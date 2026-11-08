# Prompt — Backend — Lote 2 (B-1, opção A)

Você é o **Persona — Dados e Backend** no worktree `C:\Users\yansi\Projetos\persona-wt\lote2-backend` (branch `wt/backend-lote2`).

Ative `/ponytail full`. Leia `AGENTS.md`, `AGENTES/PROTOCOLO.md`, `AGENTES/02_backend/AGENTS.md`, `AGENTES/ATRIBUICOES/LOTE-2.md` (sua linha), `AGENTES/ATRIBUICOES/LOTE-1_BACKEND_DECISOES.md` §1, `supabase/migrations/20260818200000_phase_9_settings.sql` e `docs/qa/fase-9/teste-rls-dois-usuarios.sql`. Antes de editar informe status, HEAD e que `02ec5df` é ancestral.

## Tarefa

Yan decidiu **B-1 = opção A**: nova migração corretiva (não editar a migração da Fase 9).

1. Criar `supabase/migrations/20261108120000_b1_revoke_anon_execute.sql`: `revoke execute` (ou `revoke all`) de `anon` em `public.authorize_sensitive_action(text)` e `public.delete_own_account(text)`; manter `authenticated`; idempotente; uma transação. Terminar com um bloco `do $$ ... $$` que **falha a migração** (`raise exception`) se `has_function_privilege('anon', ..., 'execute')` for verdadeiro em qualquer das duas, ou se `authenticated` perdeu `execute`. Considere se `service_role` e `alter default privileges` pedem tratamento e documente a decisão sem ampliar o escopo.
2. Criar `docs/redesign/backend/ROLLBACK_B1.md`: como desfazer (SQL de `grant`), quando não desfazer, impacto e a ordem de aplicação (depois da Fase 9, gate de Yan).
3. Em `docs/qa/fase-9/`: criar `verificacao-b1-anon-execute.sql` (somente leitura: `has_function_privilege` para `anon`, `authenticated`, `public`, `service_role` nas duas funções, esperado documentado no cabeçalho) e atualizar `teste-rls-dois-usuarios.sql` para que a checagem de `anon` passe a **reprovar** (e não só avisar) depois da migração, mantendo `begin` ... `rollback`. Se achar divergência em `docs/redesign/backend/RELATORIO_TESTE_RLS.md` (fora da sua lista), não edite: registre no handoff.
4. Atualizar `AGENTES/02_backend/STATUS.md` (`Estado: WAITING_APPROVAL`, SHA, comandos, limitações).

## Validação (sem banco)

Nada de SQL contra banco algum, nem local. Valide por leitura: sintaxe, nomes e assinaturas contra a migração da Fase 9, ordenação da timestamp, `git diff --check`, diff só nos caminhos da sua linha, varredura de segredo. Declare como `HYPOTHESIS` tudo que só o banco real confirma (estado real de `anon`, privilégios padrão do esquema).

Commit local `feat(backend): B-1 opção A — revogar EXECUTE de anon (migração não aplicada)` com trailer de coautoria. Sem push. Entregue handoff compacto e pare.
