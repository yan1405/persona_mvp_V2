# Rollback — B-1 (revogar EXECUTE de `anon`)

Migração: `supabase/migrations/20261108120000_b1_revoke_anon_execute.sql` (opção A, decisão de Yan). **Não aplicada**; nenhum SQL foi executado em banco algum. Tudo que depende do estado real do Supabase é `HYPOTHESIS`.

## Ordem de aplicação (gate de Yan em cada passo)

1. Aplicar `20260818200000_phase_9_settings.sql` (a B-1 falha se as funções não existirem).
2. Opcional, antes: rodar `docs/qa/fase-9/verificacao-b1-anon-execute.sql` (somente leitura) e guardar a saída.
3. Aplicar `20261108120000_b1_revoke_anon_execute.sql`. A timestamp é posterior à da Fase 9. Se o bloco final falhar, o efeito depende do método (seção abaixo).
4. Rodar de novo a verificação (esperado `anon = false`, `authenticated = true`, `public = false`, `conforme = true`) e, no QA, `teste-rls-dois-usuarios.sql` (o passo 1b agora reprova se `anon` tiver `EXECUTE`).

## Método de aplicação e falha parcial

O arquivo não tem `begin`/`commit`.

- **Supabase CLI (`db push`)**: o CLI envolve o arquivo numa transação. Se o bloco final falhar, os `revoke` são desfeitos e a migração não é registrada; nada muda.
- **SQL Editor**: cada `revoke` vale sozinho (atômico). Se o bloco final falhar, os `revoke` **ficam aplicados** e o erro `B-1 FALHOU` indica o que sobrou (ex.: `anon` ainda com `EXECUTE` por `PUBLIC` ou por papel herdado, ou `authenticated` sem `EXECUTE`). Estado parcial = `anon` com menos privilégio, nunca mais; corrija a causa e rode o arquivo de novo (idempotente) ou use o `grant` abaixo para voltar.
- Se a Fase 9 não estiver aplicada, o primeiro `revoke` falha (função inexistente) e nada é alterado.

## O que a migração muda

Só `revoke execute … from anon` em `public.authorize_sensitive_action(text)` e `public.delete_own_account(text)`. Não toca `authenticated`, `service_role`, `public`, tabelas nem `alter default privileges`. Idempotente.

## Impacto

- Chamada anônima via `/rest/v1/rpc/…` passa a falhar com `42501` (permission denied) em vez de chegar à função e levar `42501` de `auth.uid()`; para o usuário nada muda.
- Usuários logados (`authenticated`): sem mudança. O app só chama as duas funções com sessão.
- **Não cobre** funções futuras do esquema `public`: se o Supabase concede `EXECUTE` a `anon` por privilégio padrão, elas continuam nascendo abertas. Mudar o default (`alter default privileges … revoke execute on functions from anon`) é decisão separada de Yan.

## Como desfazer

```sql
grant execute on function public.authorize_sensitive_action(text) to anon;
grant execute on function public.delete_own_account(text) to anon;
```

Rodar como `postgres`, em transação, também sob gate de Yan.

## Quando NÃO desfazer

Quase sempre. As duas funções são `security definer`, uma exclui a conta e a outra autoriza a exclusão; `anon` não tem motivo de uso. Só desfaça se algum chamador legítimo sem sessão for provado (hoje nenhum conhecido; a Verificação revisa) e, mesmo então, prefira corrigir o chamador. Não desfaça para "passar" o passo 1b do teste: ele existe para reprovar nesse caso.

## Limites

Estado real de `anon` e privilégios padrão do esquema `public` são `HYPOTHESIS` até alguém rodar a verificação no banco. O teste e a verificação não provam RLS das Fases 3–8.
