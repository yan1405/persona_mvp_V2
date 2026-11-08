-- B-1 (opção A, decisão de Yan): `anon` não pode executar as duas funções
-- sensíveis da Fase 9. Depende de 20260818200000_phase_9_settings.sql (as
-- funções precisam existir; sem elas o REVOKE falha e a transação aborta).
-- Rollback e ordem de aplicação: docs/redesign/backend/ROLLBACK_B1.md.
--
-- Por que é preciso: a Fase 9 revoga de `public`, mas o Supabase costuma
-- conceder EXECUTE a `anon` por privilégio padrão do esquema (concessão direta,
-- que o revoke de `public` não toca). HYPOTHESIS: só o banco real confirma.
--
-- Decisões de escopo:
--  * `authenticated` não é tocado (já tem EXECUTE da Fase 9); o bloco final só
--    confere que continua com ele.
--  * `service_role` não é tocado: não é o problema de B-1, e dentro das funções
--    auth.uid() nulo já responde 42501.
--  * `alter default privileges` NÃO é alterado: afetaria toda função futura do
--    esquema `public` e outros objetos; é decisão de Yan à parte. Funções novas
--    precisam do próprio revoke.
-- Idempotente: REVOKE repetido não falha.

begin;

revoke execute on function public.authorize_sensitive_action(text) from anon;
revoke execute on function public.delete_own_account(text) from anon;

-- Falha a migração (aborta a transação) se o resultado efetivo não for o esperado.
do $$
declare
  f text;
begin
  foreach f in array array[
    'public.authorize_sensitive_action(text)',
    'public.delete_own_account(text)'
  ] loop
    if has_function_privilege('anon', f, 'execute') then
      raise exception 'B-1 FALHOU: anon ainda tem EXECUTE em %', f;
    end if;
    if not has_function_privilege('authenticated', f, 'execute') then
      raise exception 'B-1 FALHOU: authenticated perdeu EXECUTE em %', f;
    end if;
  end loop;
end $$;

commit;
