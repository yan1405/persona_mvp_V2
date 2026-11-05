-- Teste da Fase 9 — rodar inteiro no SQL Editor do Supabase (projeto
-- persona-mvp-v2), depois de aplicar 20260818200000_phase_9_settings.sql.
-- (Revisado em 04/11/2026, Lote 1 — ver docs/redesign/backend/RELATORIO_TESTE_RLS.md.)
--
-- ESCOPO REAL (BK-1): este arquivo roda no SQL Editor como o papel `postgres`,
-- que IGNORA RLS e privilégios de tabela. Ele NÃO prova nenhuma política RLS
-- das Fases 3–8 (`*_select_own`, `*_update_own` etc.) nem o acesso de clientes
-- como `authenticated`/`anon` às tabelas. Prova apenas (a) a lógica das duas
-- funções sensíveis da Fase 9, chaveada por auth.uid() simulado, e (b) o
-- catálogo (ACLs e RLS ligada) da tabela e das funções da Fase 9. Passar aqui
-- NÃO significa "RLS aprovada". Teste futuro com papel `authenticated`: ver
-- docs/redesign/backend/RELATORIO_TESTE_RLS.md §7 (não implementado).
--
-- Cobre o que exige execução real: finalidade incorreta, ausência de
-- autorização prévia, confirmação incorreta, autorização expirada,
-- isolamento entre dois usuários e exclusão com limpeza em cascata
-- (agora com dados dependentes semeados: evidência, sessão Live, Artefato,
-- diagnóstico/snapshot — as FKs `on delete restrict` das Fases 4–8 podem
-- impedir a cascata a partir de auth.users).
-- Privilégios (RLS ligada, REVOKE ALL na tabela — SELECT, INSERT, UPDATE,
-- DELETE, TRUNCATE, REFERENCES e TRIGGER para anon e authenticated, mais
-- MAINTAIN quando server_version_num >= 170000 —, e EXECUTE só para
-- authenticated) são conferidos pelo catálogo no passo 1; a checagem de
-- EXECUTE para `anon` (B-1) NÃO aborta: vira aviso (passo 1b). MAINTAIN não é
-- passado ao has_table_privilege no PostgreSQL 15/16 (levantaria erro).
--
-- Tudo roda dentro de UMA transação com ROLLBACK no final: nada é
-- persistido, nem mesmo a exclusão de conta simulada no passo 8. Rodar
-- SOMENTE no projeto de QA e SOMENTE com duas contas descartáveis de QA
-- (sem dados reais). Nunca use uma conta pessoal ou principal: o script
-- semeia e exclui dados do usuário A dentro da transação.
--
-- ANTES DE RODAR: substitua (find & replace no editor) as duas strings
-- abaixo por dois UUIDs reais e distintos de auth.users, ambos de contas
-- descartáveis de QA.
--   AAAAAAAA-AAAA-AAAA-AAAA-AAAAAAAAAAAA  -> usuário A
--   BBBBBBBB-BBBB-BBBB-BBBB-BBBBBBBBBBBB  -> usuário B
-- Para ver candidatos: select id, email from auth.users order by created_at;
--
-- Saída esperada: seis NOTICE "OK (esperado)" (passos 2–7); "OK (conferido)"
-- nos passos 1, 5, 6 e 9 (função pg_temp.confere); NOTICE do passo 1b ("OK
-- (conferido) B-1 ..." ou "ACHADO B-1 ..."); e um NOTICE no passo 8.
-- Qualquer booleano ou contagem diferente do esperado nos passos 1, 5, 6 e 9
-- levanta "FALHOU" e a transação aborta (nada é gravado; rode ROLLBACK).
-- Exceções que NÃO abortam: o passo 1b (anon com EXECUTE = ACHADO B-1, decisão
-- de Yan; o script não escolhe opção) e o passo 8 (imprime "OK:" ou "ACHADO
-- BLOQUEANTE" e segue; se a exclusão falhar, o passo 9 reprova).

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

-- compara o resultado de um passo (linha como jsonb) com o esperado; reprova
-- se qualquer chave divergir, faltar ou for NULL. Os valores ficam no NOTICE.
create or replace function pg_temp.confere(p_rotulo text, p_obtido jsonb, p_esperado jsonb)
returns void as $$
begin
  if p_obtido is distinct from p_esperado then
    raise exception 'FALHOU %: obtido % esperado %', p_rotulo, p_obtido, p_esperado;
  end if;
  raise notice 'OK (conferido) %: %', p_rotulo, p_obtido;
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
select pg_temp.confere('passo 1 catálogo', to_jsonb(t), '{"tabela_existe": true, "authorize_existe": true, "delete_existe": true, "assinatura_antiga_removida": true, "rls_ligada": true, "tabela_fechada_authenticated": true, "tabela_fechada_anon": true, "delete_exec_authenticated": true, "authorize_exec_authenticated": true}'::jsonb)
from (
select
  to_regclass('public.sensitive_action_authorizations') is not null as tabela_existe,
  to_regprocedure('public.authorize_sensitive_action(text)') is not null as authorize_existe,
  to_regprocedure('public.delete_own_account(text)') is not null as delete_existe,
  to_regprocedure('public.delete_own_account()') is null as assinatura_antiga_removida,
  (select relrowsecurity from pg_class where oid = 'public.sensitive_action_authorizations'::regclass) as rls_ligada,
  not has_table_privilege('authenticated', 'public.sensitive_action_authorizations', 'select,insert,update,delete,truncate,references,trigger'
    || case when current_setting('server_version_num')::int >= 170000 then ',maintain' else '' end) as tabela_fechada_authenticated,
  not has_table_privilege('anon', 'public.sensitive_action_authorizations', 'select,insert,update,delete,truncate,references,trigger'
    || case when current_setting('server_version_num')::int >= 170000 then ',maintain' else '' end) as tabela_fechada_anon,
  has_function_privilege('authenticated', 'public.delete_own_account(text)', 'execute') as delete_exec_authenticated,
  has_function_privilege('authenticated', 'public.authorize_sensitive_action(text)', 'execute') as authorize_exec_authenticated
) t;

-- 1b) B-1: `anon` com EXECUTE nas duas funções? NÃO aborta. A migração revoga
-- só de `public`; se o Supabase concede EXECUTE a `anon` por privilégios
-- padrão, isto é um ACHADO (decisão A/B/C de Yan em LOTE-1_BACKEND_DECISOES.md;
-- este script não escolhe opção) e os passos 2–9, inclusive o que prova R1,
-- continuam rodando. Dentro das funções, auth.uid() nulo ainda responde 42501.
do $$
declare
  f text;
begin
  foreach f in array array['public.authorize_sensitive_action(text)', 'public.delete_own_account(text)'] loop
    if has_function_privilege('anon', f, 'execute') then
      raise notice 'ACHADO B-1: anon tem EXECUTE em % (decisão de Yan pendente)', f;
    else
      raise notice 'OK (conferido) B-1: anon sem EXECUTE em %', f;
    end if;
  end loop;
end $$;

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
select pg_temp.confere('passo 5 isolamento', to_jsonb(t),
  '{"autorizacao_de_a": 1, "autorizacao_de_b": 0, "conta_b_intacta": 1}'::jsonb)
from (select
  (select count(*) from public.sensitive_action_authorizations where user_id = 'AAAAAAAA-AAAA-AAAA-AAAA-AAAAAAAAAAAA'::uuid) as autorizacao_de_a,
  -- contagens lidas como postgres (não como B): provam a lógica da função, não RLS
  (select count(*) from public.sensitive_action_authorizations where user_id = 'BBBBBBBB-BBBB-BBBB-BBBB-BBBBBBBBBBBB'::uuid) as autorizacao_de_b,
  (select count(*) from auth.users where id = 'BBBBBBBB-BBBB-BBBB-BBBB-BBBBBBBBBBBB'::uuid) as conta_b_intacta) t;
-- esperado: 1, 0, 1 (reprova automaticamente se divergir)

-- 6) A (autorizado) confirma com texto errado (22023); a autorização não é consumida
select pg_temp.como('AAAAAAAA-AAAA-AAAA-AAAA-AAAAAAAAAAAA');
select pg_temp.espera_erro('22023', $q$select public.delete_own_account('excluir')$q$, 'confirmação incorreta');
select pg_temp.confere('passo 6 autorização preservada', to_jsonb(t), '{"autorizacao_de_a_preservada": 1}'::jsonb)
from (select count(*) as autorizacao_de_a_preservada
  from public.sensitive_action_authorizations
  where user_id = 'AAAAAAAA-AAAA-AAAA-AAAA-AAAAAAAAAAAA'::uuid and purpose = 'delete_account') t;
-- esperado: 1 (reprova automaticamente se divergir)

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
  -- garante 1 perfil de A: sem isso profiles_restante = 0 passaria trivialmente
  insert into public.profiles (
    id, display_name, professional_moment, main_objective, product_consent,
    product_consent_at, consent_version, onboarding_completed_at
  )
  values (a, 'QA Fase 9', 'estudando', 'Objetivo de teste QA da fase 9', true, now(), '2026-08-10', now())
  on conflict (id) do nothing;

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
  -- 23001 (restrict_violation) e 23503 (foreign_key_violation) são sinal de R1;
  -- o script não afirma qual vem (só o banco real decide). Conferir se a
  -- mensagem nomeia uma FK `restrict` das Fases 4–8. Outro SQLSTATE
  -- (ex.: 42501, 42883) não é sinal de R1: falha de ambiente/privilégio.
  if sqlstate in ('23001', '23503') then
    raise notice 'ACHADO BLOQUEANTE (sinal de R1) [%] %', sqlstate, sqlerrm;
  else
    raise notice 'ACHADO BLOQUEANTE (SQLSTATE fora de R1; investigar ambiente) [%] %', sqlstate, sqlerrm;
  end if;
end $$;

-- 9) resultado da cascata: tudo de A deve ter sumido; B deve continuar
select pg_temp.confere('passo 9 cascata', to_jsonb(t),
  '{"auth_users_restante": 0, "profiles_restante": 0, "daily_logs_restante": 0, "evidences_restante": 0, "live_evidences_restante": 0, "artifact_sources_restante": 0, "snapshots_restante": 0, "live_sessions_restante": 0, "live_questions_restante": 0, "artifacts_restante": 0, "diagnostics_restante": 0, "conta_b_intacta": 1}'::jsonb)
from (select
  (select count(*) from auth.users where id = 'AAAAAAAA-AAAA-AAAA-AAAA-AAAAAAAAAAAA'::uuid) as auth_users_restante,
  (select count(*) from public.profiles where id = 'AAAAAAAA-AAAA-AAAA-AAAA-AAAAAAAAAAAA'::uuid) as profiles_restante,
  (select count(*) from public.daily_logs where user_id = 'AAAAAAAA-AAAA-AAAA-AAAA-AAAAAAAAAAAA'::uuid) as daily_logs_restante,
  (select count(*) from public.evidences where user_id = 'AAAAAAAA-AAAA-AAAA-AAAA-AAAAAAAAAAAA'::uuid) as evidences_restante,
  (select count(*) from public.live_session_evidences where user_id = 'AAAAAAAA-AAAA-AAAA-AAAA-AAAAAAAAAAAA'::uuid) as live_evidences_restante,
  (select count(*) from public.artifact_sources where user_id = 'AAAAAAAA-AAAA-AAAA-AAAA-AAAAAAAAAAAA'::uuid) as artifact_sources_restante,
  (select count(*) from public.narrative_score_snapshots where user_id = 'AAAAAAAA-AAAA-AAAA-AAAA-AAAAAAAAAAAA'::uuid) as snapshots_restante,
  (select count(*) from public.live_sessions where user_id = 'AAAAAAAA-AAAA-AAAA-AAAA-AAAAAAAAAAAA'::uuid) as live_sessions_restante,
  (select count(*) from public.live_questions where user_id = 'AAAAAAAA-AAAA-AAAA-AAAA-AAAAAAAAAAAA'::uuid) as live_questions_restante,
  (select count(*) from public.artifacts where user_id = 'AAAAAAAA-AAAA-AAAA-AAAA-AAAAAAAAAAAA'::uuid) as artifacts_restante,
  (select count(*) from public.narrative_diagnostics where user_id = 'AAAAAAAA-AAAA-AAAA-AAAA-AAAAAAAAAAAA'::uuid) as diagnostics_restante,
  (select count(*) from auth.users where id = 'BBBBBBBB-BBBB-BBBB-BBBB-BBBBBBBBBBBB'::uuid) as conta_b_intacta) t;
-- esperado: 0 nas 11 primeiras e conta_b_intacta = 1 (reprova automaticamente se divergir)

rollback; -- desfaz TUDO, inclusive os dados semeados e a exclusão do passo 8

-- Depois de rodar: cole os `NOTICE` (seis "OK (esperado)" dos passos 2–7, os
-- "OK (conferido)" dos passos 1, 5, 6 e 9, o aviso do passo 1b — "OK
-- (conferido) B-1" ou "ACHADO B-1" — e o "OK:"/"ACHADO BLOQUEANTE" do passo 8)
-- em docs/reviews/fase-9-configuracoes-privacidade.md. Se algum passo
-- abortar com "FALHOU", cole a mensagem completa (traz obtido e esperado).
