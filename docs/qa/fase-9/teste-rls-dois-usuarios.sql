-- Teste da Fase 9 — rodar inteiro no SQL Editor do Supabase (projeto
-- persona-mvp-v2), depois de aplicar 20260818200000_phase_9_settings.sql.
--
-- Cobre o que exige execução real: finalidade incorreta, ausência de
-- autorização prévia, confirmação incorreta, autorização expirada,
-- isolamento entre dois usuários e exclusão com limpeza em cascata.
-- O bloqueio de acesso direto à tabela (RLS habilitada, zero políticas,
-- REVOKE ALL de public/anon/authenticated) já é garantido pela própria
-- definição da migração e não precisa de teste ao vivo.
--
-- Tudo roda dentro de UMA transação com ROLLBACK no final: nada é
-- persistido, nem mesmo a exclusão de conta simulada no passo 6. Seguro
-- para rodar contra o banco real, mas ainda assim use duas contas que
-- você aceitaria perder se algo saísse do esperado.
--
-- ANTES DE RODAR: substitua (find & replace no editor) as duas strings
-- abaixo por dois UUIDs reais e distintos de auth.users — ex.: sua conta
-- principal como A e a conta descartável de QA das Fases 7-9 como B.
--   AAAAAAAA-AAAA-AAAA-AAAA-AAAAAAAAAAAA  -> usuário A
--   BBBBBBBB-BBBB-BBBB-BBBB-BBBBBBBBBBBB  -> usuário B
-- Para ver candidatos: select id, email from auth.users order by created_at;

begin;

-- simula "sou este usuário" para auth.uid() sem depender de sessão real
create or replace function pg_temp.como(p_id uuid) returns void as $$
begin
  perform set_config('request.jwt.claims', json_build_object('sub', p_id)::text, true);
end;
$$ language plpgsql;

-- 1) confirma que os objetos da migração existem
select
  to_regclass('public.sensitive_action_authorizations') is not null as tabela_existe,
  to_regprocedure('public.authorize_sensitive_action(text)') is not null as authorize_existe,
  to_regprocedure('public.delete_own_account(text)') is not null as delete_existe;
-- esperado: true, true, true

-- 2) finalidade incorreta é rejeitada
select pg_temp.como('AAAAAAAA-AAAA-AAAA-AAAA-AAAAAAAAAAAA');
do $$ begin
  perform public.authorize_sensitive_action('outra_coisa');
  raise exception 'FALHOU: deveria ter rejeitado finalidade incorreta';
exception when others then
  raise notice 'OK (esperado) finalidade incorreta: %', sqlerrm;
end $$;

-- 3) usuário B tenta excluir sem nunca ter se reautenticado -> deve falhar
select pg_temp.como('BBBBBBBB-BBBB-BBBB-BBBB-BBBBBBBBBBBB');
do $$ begin
  perform public.delete_own_account('EXCLUIR');
  raise exception 'FALHOU: deveria exigir reautenticação recente';
exception when others then
  raise notice 'OK (esperado) sem autorização prévia: %', sqlerrm;
end $$;

-- 4) usuário A se autoriza, mas confirma com texto errado -> deve falhar
select pg_temp.como('AAAAAAAA-AAAA-AAAA-AAAA-AAAAAAAAAAAA');
select public.authorize_sensitive_action('delete_account');
do $$ begin
  perform public.delete_own_account('excluir'); -- minúsculo, não bate
  raise exception 'FALHOU: deveria rejeitar confirmação incorreta';
exception when others then
  raise notice 'OK (esperado) confirmação incorreta: %', sqlerrm;
end $$;

-- 5) autorização de A expira -> deve falhar mesmo com confirmação certa
update public.sensitive_action_authorizations
set expires_at = now() - interval '1 minute'
where user_id = 'AAAAAAAA-AAAA-AAAA-AAAA-AAAAAAAAAAAA' and purpose = 'delete_account';

select pg_temp.como('AAAAAAAA-AAAA-AAAA-AAAA-AAAAAAAAAAAA');
do $$ begin
  perform public.delete_own_account('EXCLUIR');
  raise exception 'FALHOU: deveria rejeitar autorização expirada';
exception when others then
  raise notice 'OK (esperado) autorização expirada: %', sqlerrm;
end $$;

-- 6) isolamento: sob a identidade de A, auth.uid() não aponta para B
select pg_temp.como('AAAAAAAA-AAAA-AAAA-AAAA-AAAAAAAAAAAA');
select
  auth.uid() = 'AAAAAAAA-AAAA-AAAA-AAAA-AAAAAAAAAAAA'::uuid as bate_com_a,
  auth.uid() = 'BBBBBBBB-BBBB-BBBB-BBBB-BBBBBBBBBBBB'::uuid as bate_com_b;
-- esperado: true, false

-- 7) exclusão bem-sucedida: A se reautoriza e confirma corretamente
select pg_temp.como('AAAAAAAA-AAAA-AAAA-AAAA-AAAAAAAAAAAA');
select public.authorize_sensitive_action('delete_account');
select public.delete_own_account('EXCLUIR');

-- confirma que o cascade limpou os dados relacionados de A
select
  (select count(*) from auth.users where id = 'AAAAAAAA-AAAA-AAAA-AAAA-AAAAAAAAAAAA'::uuid) as auth_users_restante,
  (select count(*) from public.profiles where id = 'AAAAAAAA-AAAA-AAAA-AAAA-AAAAAAAAAAAA'::uuid) as profiles_restante,
  (select count(*) from public.daily_logs where user_id = 'AAAAAAAA-AAAA-AAAA-AAAA-AAAAAAAAAAAA'::uuid) as daily_logs_restante;
-- esperado: 0, 0, 0

rollback; -- desfaz TUDO, inclusive a exclusão do passo 7 — nada fica gravado

-- Depois de rodar: cole aqui os `NOTICE` (seis "OK (esperado)...") e os
-- resultados dos passos 6 e 7 para eu registrar em
-- docs/reviews/fase-9-configuracoes-privacidade.md.
