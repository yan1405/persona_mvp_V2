-- Teste da Fase 9 — rodar inteiro no SQL Editor do Supabase (projeto
-- persona-mvp-v2), depois de aplicar 20260818200000_phase_9_settings.sql.
-- (Revisado em 04/11/2026, Lote 1 — ver docs/redesign/backend/RELATORIO_TESTE_RLS.md.)
--
-- Cobre o que exige execução real: finalidade incorreta, ausência de
-- autorização prévia, confirmação incorreta, autorização expirada,
-- isolamento entre dois usuários e exclusão com limpeza em cascata
-- (agora com dados dependentes semeados: evidência, sessão Live, Artefato,
-- diagnóstico/snapshot — as FKs `on delete restrict` das Fases 4–8 podem
-- impedir a cascata a partir de auth.users).
-- Privilégios (RLS ligada, REVOKE ALL na tabela, EXECUTE só para
-- authenticated) são conferidos pelo catálogo no passo 1.
--
-- Tudo roda dentro de UMA transação com ROLLBACK no final: nada é
-- persistido, nem mesmo a exclusão de conta simulada no passo 8. Seguro
-- para rodar contra o banco real, mas ainda assim use duas contas que
-- você aceitaria perder se algo saísse do esperado.
--
-- ANTES DE RODAR: substitua (find & replace no editor) as duas strings
-- abaixo por dois UUIDs reais e distintos de auth.users — ex.: sua conta
-- principal como A e a conta descartável de QA das Fases 7-9 como B.
--   AAAAAAAA-AAAA-AAAA-AAAA-AAAAAAAAAAAA  -> usuário A
--   BBBBBBBB-BBBB-BBBB-BBBB-BBBBBBBBBBBB  -> usuário B
-- Para ver candidatos: select id, email from auth.users order by created_at;
--
-- Saída esperada: apenas NOTICE "OK ..." e os resultados dos passos 1, 8 e 9.
-- Qualquer "FALHOU" aborta a transação (nada é gravado). O passo 8 NÃO
-- aborta: se a exclusão falhar, ele imprime "ACHADO BLOQUEANTE" e segue.

begin;

-- simula "sou este usuário" para auth.uid() sem depender de sessão real
create or replace function pg_temp.como(p_id uuid) returns void as $$
begin
  perform set_config('request.jwt.claims', json_build_object('sub', p_id)::text, true);
end;
$$ language plpgsql;

-- exige que o SQL falhe com o SQLSTATE esperado. O raise de falha fica FORA
-- do bloco protegido; do contrário o próprio handler o engoliria e o teste
-- nunca reprovaria.
create or replace function pg_temp.espera_erro(p_sqlstate text, p_sql text, p_rotulo text)
returns void as $$
begin
  begin
    execute p_sql;
  exception when others then
    if sqlstate = p_sqlstate then
      raise notice 'OK (esperado) %: % [%]', p_rotulo, sqlerrm, sqlstate;
      return;
    end if;
    raise exception 'FALHOU %: erro % (%) em vez de %', p_rotulo, sqlstate, sqlerrm, p_sqlstate;
  end;
  raise exception 'FALHOU %: deveria ter falhado com %', p_rotulo, p_sqlstate;
end;
$$ language plpgsql;

-- 0) os dois UUIDs foram substituídos por usuários reais e distintos
do $$ begin
  if 'AAAAAAAA-AAAA-AAAA-AAAA-AAAAAAAAAAAA'::uuid = 'BBBBBBBB-BBBB-BBBB-BBBB-BBBBBBBBBBBB'::uuid
    or (select count(*) from auth.users
        where id in ('AAAAAAAA-AAAA-AAAA-AAAA-AAAAAAAAAAAA'::uuid, 'BBBBBBBB-BBBB-BBBB-BBBB-BBBBBBBBBBBB'::uuid)) <> 2 then
    raise exception 'FALHOU: substitua os UUIDs de exemplo por dois usuários distintos de auth.users';
  end if;
end $$;

-- 1) objetos e privilégios da migração (catálogo)
select
  to_regclass('public.sensitive_action_authorizations') is not null as tabela_existe,
  to_regprocedure('public.authorize_sensitive_action(text)') is not null as authorize_existe,
  to_regprocedure('public.delete_own_account(text)') is not null as delete_existe,
  to_regprocedure('public.delete_own_account()') is null as assinatura_antiga_removida,
  (select relrowsecurity from pg_class where oid = 'public.sensitive_action_authorizations'::regclass) as rls_ligada,
  not has_table_privilege('authenticated', 'public.sensitive_action_authorizations', 'select,insert,update,delete') as tabela_fechada_authenticated,
  not has_table_privilege('anon', 'public.sensitive_action_authorizations', 'select,insert,update,delete') as tabela_fechada_anon,
  has_function_privilege('authenticated', 'public.delete_own_account(text)', 'execute') as delete_exec_authenticated,
  not has_function_privilege('anon', 'public.delete_own_account(text)', 'execute') as delete_sem_exec_anon,
  has_function_privilege('authenticated', 'public.authorize_sensitive_action(text)', 'execute') as authorize_exec_authenticated,
  not has_function_privilege('anon', 'public.authorize_sensitive_action(text)', 'execute') as authorize_sem_exec_anon;
-- esperado: todas as colunas true

-- 2) finalidade incorreta é rejeitada (22023)
select pg_temp.como('AAAAAAAA-AAAA-AAAA-AAAA-AAAAAAAAAAAA');
select pg_temp.espera_erro('22023', $q$select public.authorize_sensitive_action('outra_coisa')$q$, 'finalidade incorreta');

-- 3) sem identidade (auth.uid() nulo) é rejeitado (42501)
select set_config('request.jwt.claims', '{}', true);
select pg_temp.espera_erro('42501', $q$select public.authorize_sensitive_action('delete_account')$q$, 'sem identidade');

-- 4) usuário B nunca se reautenticou -> excluir deve falhar (42501)
select pg_temp.como('BBBBBBBB-BBBB-BBBB-BBBB-BBBBBBBBBBBB');
select pg_temp.espera_erro('42501', $q$select public.delete_own_account('EXCLUIR')$q$, 'B sem autorização prévia');

-- 5) isolamento real: A se autoriza; a autorização de A não vale para B
select pg_temp.como('AAAAAAAA-AAAA-AAAA-AAAA-AAAAAAAAAAAA');
select public.authorize_sensitive_action('delete_account');
select pg_temp.como('BBBBBBBB-BBBB-BBBB-BBBB-BBBBBBBBBBBB');
select pg_temp.espera_erro('42501', $q$select public.delete_own_account('EXCLUIR')$q$, 'B com A autorizado');
select
  (select count(*) from public.sensitive_action_authorizations where user_id = 'AAAAAAAA-AAAA-AAAA-AAAA-AAAAAAAAAAAA'::uuid) as autorizacao_de_a,
  (select count(*) from public.sensitive_action_authorizations where user_id = 'BBBBBBBB-BBBB-BBBB-BBBB-BBBBBBBBBBBB'::uuid) as autorizacao_de_b,
  (select count(*) from auth.users where id = 'BBBBBBBB-BBBB-BBBB-BBBB-BBBBBBBBBBBB'::uuid) as conta_b_intacta;
-- esperado: 1, 0, 1

-- 6) A (autorizado) confirma com texto errado (22023); a autorização não é consumida
select pg_temp.como('AAAAAAAA-AAAA-AAAA-AAAA-AAAAAAAAAAAA');
select pg_temp.espera_erro('22023', $q$select public.delete_own_account('excluir')$q$, 'confirmação incorreta');
select count(*) as autorizacao_de_a_preservada
from public.sensitive_action_authorizations
where user_id = 'AAAAAAAA-AAAA-AAAA-AAAA-AAAAAAAAAAAA'::uuid and purpose = 'delete_account';
-- esperado: 1

-- 7) autorização de A expira -> falha mesmo com confirmação certa (42501)
update public.sensitive_action_authorizations
set expires_at = now() - interval '1 minute'
where user_id = 'AAAAAAAA-AAAA-AAAA-AAAA-AAAAAAAAAAAA' and purpose = 'delete_account';

select pg_temp.como('AAAAAAAA-AAAA-AAAA-AAAA-AAAAAAAAAAAA');
select pg_temp.espera_erro('42501', $q$select public.delete_own_account('EXCLUIR')$q$, 'autorização expirada');

-- 8) exclusão bem-sucedida com dados dependentes semeados (rollback no fim)
-- Semeia, como postgres, uma linha em cada tabela que referencia
-- evidences/daily_logs/narrative_diagnostics com `on delete restrict`.
do $$
declare
  a constant uuid := 'AAAAAAAA-AAAA-AAAA-AAAA-AAAAAAAAAAAA';
  v_log uuid; v_ev uuid; v_ses uuid; v_art uuid; v_diag uuid;
begin
  insert into public.daily_logs (user_id, entry_key, content)
  values (a, 'qa-fase9-rls', repeat('registro de teste da fase 9 ', 3))
  returning id into v_log;

  insert into public.evidences (user_id, source_log_id, title, context, action, competencies)
  values (a, v_log, 'Evidência QA RLS', 'Contexto de teste', 'Ação de teste', array['comunicação'])
  returning id into v_ev;

  insert into public.live_sessions (user_id, target_role, company)
  values (a, 'Analista QA', 'Empresa QA') returning id into v_ses;
  insert into public.live_session_evidences (session_id, evidence_id, user_id) values (v_ses, v_ev, a);
  insert into public.live_questions (session_id, user_id, question_text, primary_evidence_id)
  values (v_ses, a, 'Pergunta de teste QA', v_ev);

  insert into public.artifacts (user_id, type, title, objective)
  values (a, 'star', 'Artefato QA', 'Objetivo QA') returning id into v_art;
  insert into public.artifact_sources (artifact_id, evidence_id, user_id) values (v_art, v_ev, a);

  -- 'completed' evita colidir com um rascunho existente (índice parcial de 1 draft)
  insert into public.narrative_diagnostics (
    user_id, version, status, current_step, professional_objective,
    declared_consistency, declared_coherence, initial_score, completed_at
  )
  values (a, (select coalesce(max(version), 0) + 1 from public.narrative_diagnostics where user_id = a),
    'completed', 3, 'Objetivo de teste QA', 50, 50, 50, now())
  returning id into v_diag;
  insert into public.narrative_score_snapshots (
    user_id, diagnostic_id, consistency_score, consistency_origin, coherence_score,
    coherence_origin, total_score, total_state, method_version, reason
  )
  values (a, v_diag, 50, 'declared', 50, 'declared', 50, 'declared', 'narrative-score-v1', 'diagnostic_completed');
end $$;

select pg_temp.como('AAAAAAAA-AAAA-AAAA-AAAA-AAAAAAAAAAAA');
select public.authorize_sensitive_action('delete_account');

do $$ begin
  perform public.delete_own_account('EXCLUIR');
  raise notice 'OK: exclusão com dados dependentes concluída';
exception when others then
  raise notice 'ACHADO BLOQUEANTE: exclusão com dados dependentes falhou [%] %', sqlstate, sqlerrm;
end $$;

-- 9) resultado da cascata: tudo de A deve ter sumido; B deve continuar
select
  (select count(*) from auth.users where id = 'AAAAAAAA-AAAA-AAAA-AAAA-AAAAAAAAAAAA'::uuid) as auth_users_restante,
  (select count(*) from public.profiles where id = 'AAAAAAAA-AAAA-AAAA-AAAA-AAAAAAAAAAAA'::uuid) as profiles_restante,
  (select count(*) from public.daily_logs where user_id = 'AAAAAAAA-AAAA-AAAA-AAAA-AAAAAAAAAAAA'::uuid) as daily_logs_restante,
  (select count(*) from public.evidences where user_id = 'AAAAAAAA-AAAA-AAAA-AAAA-AAAAAAAAAAAA'::uuid) as evidences_restante,
  (select count(*) from public.live_session_evidences where user_id = 'AAAAAAAA-AAAA-AAAA-AAAA-AAAAAAAAAAAA'::uuid) as live_evidences_restante,
  (select count(*) from public.artifact_sources where user_id = 'AAAAAAAA-AAAA-AAAA-AAAA-AAAAAAAAAAAA'::uuid) as artifact_sources_restante,
  (select count(*) from public.narrative_score_snapshots where user_id = 'AAAAAAAA-AAAA-AAAA-AAAA-AAAAAAAAAAAA'::uuid) as snapshots_restante,
  (select count(*) from auth.users where id = 'BBBBBBBB-BBBB-BBBB-BBBB-BBBBBBBBBBBB'::uuid) as conta_b_intacta;
-- esperado: 0, 0, 0, 0, 0, 0, 0, 1

rollback; -- desfaz TUDO, inclusive os dados semeados e a exclusão do passo 8

-- Depois de rodar: cole os `NOTICE` (seis "OK (esperado)" dos passos 2–7 e o
-- "OK:"/"ACHADO BLOQUEANTE" do passo 8) e os resultados dos passos 1, 5, 6 e 9
-- para registrar em docs/reviews/fase-9-configuracoes-privacidade.md.
