# Handoff — Persona — Dados e Backend (Lote 1)

Snapshot do branch no HEAD `ee6ac3f43ad10523b71f3f2924e71750db6f8490` (rodada 3 de correções incluída). O commit de fechamento que contém esta versão é posterior e não aparece nos números abaixo. Somente leitura de fatos: nenhum SQL, migração, banco, credencial, push ou merge. O SHA `4a37131865586be802f25511ce8f6969ad09109e` é histórico imutável (entrega encaminhada à Verificação na rodada 2).

## 1. Papel e fonte
Persona — Dados e Backend (papel 02, Lote 1). Atribuição: `AGENTES/ATRIBUICOES/LOTE-1.md` §02, correções em `LOTE-1_CORRECOES.md` §02 e fechamento em `AGENTES/PROMPTS/07_backend_fechamento_lote1.md`.

## 2. Branch e base
- Worktree `C:\Users\yansi\Projetos\persona-wt\backend`, branch `wt/backend-lote1` (sem upstream, nada no remoto).
- Base/merge-base: `8da08c698a74aeb4d95c70123eba61fc921a591c`. `main` do Orquestrador já avançou além disso (`0240dc5…`); a integração é do Orquestrador.
- HEAD deste snapshot: `ee6ac3f43ad10523b71f3f2924e71750db6f8490`.

## 3. Escopo
Escrita: `docs/redesign/backend/**`, `docs/qa/fase-9/**`, `AGENTES/02_backend/STATUS.md`. Proibido: migração, banco, credencial/service role, `apps/web/**`, `supabase/**`.

## 4. Arquivos (base → `ee6ac3f`: 5 arquivos, +560/−68)
`docs/redesign/backend/MATRIZ_TELA_DADOS.md`, `docs/redesign/backend/RELATORIO_TESTE_RLS.md`, `docs/redesign/backend/HANDOFF_LOTE1.md`, `docs/qa/fase-9/teste-rls-dois-usuarios.sql`, `AGENTES/02_backend/STATUS.md`. Apenas lidos: migrações, `actions.ts`/`page.tsx`, `apps/web/lib/**`, rotas `api/export` e `auth/callback`, pacote T4.

## 5. Commits (ordem)
1. `ffd4289` matriz T4, relatório RLS, script corrigido, STATUS inicial.
2. `1e7ad02` passos 1, 5, 6 e 9 reprovam sozinhos (`pg_temp.confere`); R2 reclassificado.
3. `cb0f3ba` duas contas descartáveis de QA; privilégios TRUNCATE, REFERENCES, TRIGGER.
4. `4a37131` `MAINTAIN` só se `server_version_num >= 170000` (entregue à Verificação na rodada 2).
5. `ee6ac3f` rodada 3: BK-1…BK-5 (escopo real do teste, `23001`/`23503`, B-1 não abortante, perfil semeado, matriz sem `ilike`).
6. Commit de fechamento (este): BK-6, BK-7, BK-8 e `STATUS.md` em `WAITING_APPROVAL`.

## 6. O que o script prova e não prova
- **Roda como `postgres`** (ignora RLS e privilégios de tabela). Prova: a lógica de `authorize_sensitive_action` e `delete_own_account` por `auth.uid()` simulado (finalidade, sem identidade, sem autorização, confirmação errada, expirada, isolamento A×B); o catálogo da Fase 9 (RLS ligada, ACLs da tabela, `EXECUTE` de `authenticated`, assinatura antiga removida); a cascata de exclusão com dados semeados (R1).
- **Não prova:** nenhuma política RLS das Fases 3–8, nem acesso como `authenticated`/`anon`. Passar não significa "RLS aprovada". Teste futuro descrito em `RELATORIO_TESTE_RLS.md` §7, não implementado.
- Estrutura: `begin;` … `rollback;`, transação única, sem `commit` nem DDL persistente.

## 7. Achados da Verificação e tratamento
| Achado | Estado |
|---|---|
| BK-1…BK-5 (rodada 3, `ee6ac3f`) | corrigidos em texto/script; Verificação os aceitou ressalvando BK-6…BK-8 |
| BK-6 relatório §4 com esperado antigo | corrigido no commit de fechamento (passo 9 = 12 chaves; passo 1b = duas linhas) |
| BK-7 este handoff misturava `4a37131` e rodada 3 | corrigido: snapshot único |
| BK-8 cabeçalho do SQL (e-mails, "usuários reais") | corrigido: lista só `id, created_at`; "contas descartáveis existentes no QA" |

## 8. Comandos e validações
`git diff --check 8da08c6..HEAD` limpo (só avisos de LF→CRLF); `grep` dos nomes citados na matriz contra migrações e `apps/web`. **Não executados:** SQL, migração, Supabase, `npm run lint/typecheck/test/build` (nenhum código de produto alterado).

## 9. Classificações
- **B-1** (`anon` com `EXECUTE` nas funções da Fase 9): decisão pendente de Yan (A/B/C em `LOTE-1_BACKEND_DECISOES.md`); fato lido: a migração revoga só de `public`; efeito no banco PENDING. Este lote não escolheu opção.
- **R1** (exclusão de conta × FKs `on delete restrict`): HYPOTHESIS, severidade alta; sinal no banco real = `23001` ou `23503` com restrição `restrict` nomeada das fases 4–8.
- **R2:** ausência de paginação no export é fato no código; `max_rows` do projeto PENDING. **R3:** sem `revision` em `daily_logs`/`evidences`.
- Sem autorização para banco real; RLS não aprovada.

## 10. Pendências e gates
Decisões de Yan: B-1; aplicar a migração da Fase 9 e executar o teste no QA com duas contas descartáveis; migração corretiva se R1 se confirmar; `revision` (R3). Dependências: Orquestrador (integração) e Verificação (parecer do commit de fechamento).

## 11. Local × remoto e bloqueio
Tudo só local: commits em `wt/backend-lote1`, sem upstream e sem push. Cópia deste arquivo na pasta do agente do projeto (`AGENTES/02_backend/`, checkout do Orquestrador) é untracked. Bloqueio: execução em Supabase real (gate de Yan).

## 12. Porcentagem
25% pelo contrato (matriz entregue, aguardando Verificação; demais tarefas PENDING; teste não executado).
