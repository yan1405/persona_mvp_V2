-- Verificação B-1 — SOMENTE LEITURA (só SELECT no catálogo; nada é alterado).
-- Rodar no SQL Editor do projeto de QA, antes e depois de aplicar
-- 20261108120000_b1_revoke_anon_execute.sql (gate de Yan). Status até aqui:
-- escrito e validado por leitura, NÃO executado (HYPOTHESIS sobre o banco real).
--
-- Consulta 1 — uma linha por função (esperado 2 linhas).
--   Antes da migração B-1 (só Fase 9): `anon` pode ser true (é o ACHADO B-1).
--   Depois da migração B-1, esperado em AMBAS as linhas:
--     anon = false          (efetivo: direto ou herdado)
--     authenticated = true
--     public = false        (nenhuma concessão a PUBLIC; proacl nulo conta como PUBLIC)
--     conforme = true
--   service_role: informativo, não é avaliado (a migração B-1 não o altera;
--   no Supabase costuma ser true).
-- Consulta 2 — esperado: funcoes_encontradas = 2.
-- Consulta 3 — informativa: privilégios padrão para funções (pg_default_acl).
--   Se algum papel que cria funções em `public` (ex.: postgres) tem default
--   com `anon=X`, funções FUTURAS voltam a nascer abertas para `anon`.

select
  p.oid::regprocedure as funcao,
  has_function_privilege('anon', p.oid, 'execute') as anon,
  has_function_privilege('authenticated', p.oid, 'execute') as authenticated,
  exists (
    select 1
    from aclexplode(coalesce(p.proacl, acldefault('f', p.proowner))) a
    where a.grantee = 0 and a.privilege_type = 'EXECUTE'
  ) as public,
  has_function_privilege('service_role', p.oid, 'execute') as service_role,
  p.proacl::text as acl,
  (not has_function_privilege('anon', p.oid, 'execute')
    and has_function_privilege('authenticated', p.oid, 'execute')
    and not exists (
      select 1
      from aclexplode(coalesce(p.proacl, acldefault('f', p.proowner))) a
      where a.grantee = 0 and a.privilege_type = 'EXECUTE'
    )) as conforme
from pg_proc p
where p.oid in (
  to_regprocedure('public.authorize_sensitive_action(text)'),
  to_regprocedure('public.delete_own_account(text)')
)
order by p.proname;

select count(*) as funcoes_encontradas
from pg_proc
where oid in (
  to_regprocedure('public.authorize_sensitive_action(text)'),
  to_regprocedure('public.delete_own_account(text)')
);

select
  pg_get_userbyid(defaclrole) as papel_criador,
  defaclnamespace::regnamespace::text as esquema, -- "-" = global
  defaclacl::text as acl_padrao
from pg_default_acl
where defaclobjtype = 'f'
order by 1, 2;
