# Handoff — Persona — Dados e Backend (Lote 1)

Formalização em arquivo do handoff entregue no chat em 05/11/2026. Somente leitura de fatos; nenhum SQL, migração, push ou chamada externa foi executado para produzi-lo. Rodada 3 (correções BK-1…BK-5, liberada pelo Orquestrador) foi commitada em commits novos sobre `4a37131…` (imutável); ver §16.

## 1. Papel
Persona — Dados e Backend (papel 02, Lote 1). Fonte: `AGENTES/ATRIBUICOES/LOTE-1.md`, seção 02; prompt `AGENTES/PROMPTS/02_backend.md`.

## 2. Pasta, branch, HEAD, merge-base
- Worktree: `C:\Users\yansi\Projetos\persona-wt\backend` · branch `wt/backend-lote1` (sem upstream)
- HEAD: `4a37131865586be802f25511ce8f6969ad09109e`
- Merge-base com `main`: `8da08c698a74aeb4d95c70123eba61fc921a591c` (`main` já estava em `420eca6e26bcab8ce425103fde7091788356e7ab`)
- `git status` (no momento do handoff): `On branch wt/backend-lote1` / `nothing to commit, working tree clean`

## 3. Escopo
Escrita permitida: `docs/redesign/backend/**`, `docs/qa/fase-9/**`, `AGENTES/02_backend/STATUS.md`. Proibido: aplicar/criar migração, conectar a banco, usar credencial ou service role. Objetivos: (a) matriz tela × dados × ações × backend T4.1–T4.8; (b) revisar/corrigir `docs/qa/fase-9/teste-rls-dois-usuarios.sql`.

## 4. Arquivos
Alterados/criados (4, +411/−68 sobre `8da08c6`): `docs/redesign/backend/MATRIZ_TELA_DADOS.md` (novo), `docs/redesign/backend/RELATORIO_TESTE_RLS.md` (novo), `docs/qa/fase-9/teste-rls-dois-usuarios.sql` (reescrito), `AGENTES/02_backend/STATUS.md`.
Apenas lidos: `AGENTS.md`, `AGENTES/PROTOCOLO.md`, `AGENTES/02_backend/AGENTS.md`, 7 migrações, `actions.ts`/`page.tsx` de `apps/web/app`, `apps/web/lib/**`, `app/api/export/route.ts`, `app/auth/callback/route.ts`, `.jsx` do pacote T4.
Fora do repositório: patch `…\scratchpad\backend-lote1-8da08c6..4a37131.patch` (SHA-256 `24d6cc211a3123f09815532842ce4de4feea351889db45e53d6cb237d04a1dbf`).

## 5. Commits (ordem)
1. `ffd4289e1c7efaa46ae52734962e5d371e1ee491` — matriz T4, relatório RLS, script corrigido, STATUS inicial.
2. `1e7ad0242cbeaa5887011c299b2fc6e22143f2b5` — passos 1, 5, 6 e 9 reprovam sozinhos (`pg_temp.confere`); R2 reclassificado.
3. `cb0f3ba6451c7087fe745375803e0464ba5a9024` — exige duas contas descartáveis de QA; privilégios incluem TRUNCATE, REFERENCES, TRIGGER.
4. `4a37131865586be802f25511ce8f6969ad09109e` — `MAINTAIN` conferido só se `server_version_num >= 170000`.

## 6. Comandos e validações
`git diff --check` após cada alteração (limpo, só aviso LF→CRLF); `grep` dos nomes citados na matriz contra migrações e `apps/web` (todos encontrados; só `max_rows` e `select_own`, termos genéricos, não casaram); `git diff --binary` + `sha256sum` do patch.
**Não executados:** qualquer SQL, migração, conexão ao Supabase, `npm run lint/typecheck/test/build`, parser SQL.

## 7. Fatos VERIFIED (por leitura)
Nomes de tabelas/RPCs/actions/libs da matriz existem; o teste original nunca reprovava (`raise 'FALHOU'` dentro do `exception when others`); `/api/export` não pagina (`route.ts:30-43`); o script mantém `begin;` … `rollback;`; nada em `supabase/`, `apps/web/` ou `package.json` foi tocado.

## 8. Resposta aos achados da Verificação (`RELATORIO_backend_4a37131.md`)

| Achado | O que o script prova | O que não prova / ação |
|---|---|---|
| **BK-1 · S2 · VERIFIED** — não exercita RLS por papel | Lógica das duas funções chaveada por `auth.uid()` (finalidade, sem identidade, sem autorização, confirmação errada, expirada, isolamento A×B) e ACLs da Fase 9 via catálogo (passo 1) | Nenhuma política `*_select_own`/`*_update_own` das Fases 3–8; nenhum acesso como `authenticated`/`anon` (sem `set local role`; tudo como `postgres`, que ignora RLS). Pode passar com RLS quebrada nas outras tabelas. Limitação de escopo; o relatório não afirma "RLS aprovada". Ação: descrever o arquivo como "funções sensíveis da Fase 9 + catálogo" (texto) |
| **BK-2 · S2 · HYPOTHESIS** — SQLSTATE de R1 | O passo 8 imprime o SQLSTATE bruto | Não define qual código é R1. PostgreSQL: `ON DELETE RESTRICT` → `23001`; `23503` é do `NO ACTION`. A §3 de `LOTE-1_BACKEND_DECISOES.md` já aceita `23503` ou `23001` com restrição nomeada das fases 4–8. Só texto |
| **BK-3 · S3 · VERIFIED** — "só `ilike`" na matriz | — | Erro meu: não há `ilike`/`.or(`/`textSearch`/`.like(` em `apps/web`; filtros são em memória sobre até 100 registros (`evidencias/page.tsx:55`). Corrigir a linha T4.8 da matriz (novo commit, quando liberado) |
| **BK-4 · S3 · VERIFIED** — falsos positivos | — | `profiles_restante = 0` passa sem perfil de A (seed não cria; a prova real é `auth_users_restante`); passo 9 não conta `live_questions`, `live_sessions`, `artifacts`, `narrative_diagnostics`; `autorizacao_de_b` lido como `postgres`; passo 8 trata qualquer erro como "ACHADO BLOQUEANTE". Texto/documentação |
| **BK-5 · S2 · HYPOTHESIS** — B-1 aborta o passo 1 antes de R1 | O passo 1 exige `anon` sem `EXECUTE`; se B-1 for real, reprova e os passos 2–9 não rodam | **Só documentação** se Yan escolher A ou C de B-1 (resolver B-1 antes de rodar o arquivo inteiro; consulta de catálogo antes). **Exige código** só se Yan escolher B (aceitar o risco): aí a checagem de `anon` precisaria virar não abortante ou ficar em bloco separado |

## 9. Classificações mantidas
- **B-1:** decisão pendente de Yan (A/B/C). Fato lido: a migração revoga `EXECUTE` só de `public`, sem revogar de `anon` nominalmente; efeito no banco: PENDING (baixo: `auth.uid() is null → 42501`).
- **R1:** HYPOTHESIS, severidade alta. Cinco FKs `restrict` existem (`evidences.source_log_id`, `narrative_score_snapshots.diagnostic_id`, `live_session_evidences.evidence_id`, `live_questions.primary_evidence_id`, `artifact_sources.evidence_id`); só banco liberado por Yan confirma.
- **R2:** ausência de paginação no export é fato no código; `max_rows` do projeto PENDING.
- **R3:** sem `revision` em `daily_logs`/`evidences` (conflito "outra aba" de T4.2/T4.3).
- Sem autorização para banco real; RLS não aprovada.

## 10. Decisões pendentes de Yan
B-1 (A/B/C); gate para aplicar a migração da Fase 9 e rodar o teste no QA com duas contas descartáveis; migração corretiva se R1 se confirmar; migração de `revision` (R3).

## 11. Dependências e conflitos
Orquestrador (congelar/encaminhar, integrar; `main` avançou além da base) e Verificação (parecer). `AGENTES/02_backend/STATUS.md` existe em todos os worktrees. Agente (T4.8) é trabalho do papel Agente NVIDIA.

## 12. Local × remoto
Tudo só local: 4 commits, branch sem upstream, patch no scratchpad. Nada enviado ao remoto.

## 13. Bloqueio e próximo passo
Bloqueio: execução do teste em Supabase real (gate de Yan). Próximo passo mínimo (não executado): o Orquestrador libera um commit textual para BK-1 (nome/descrição), BK-3 (matriz), BK-4 e BK-5 (ordem de execução); depois, gate do QA.

## 14. Porcentagem comprovada
25% (matriz 25 VERIFIED; adaptação de contratos 25 PENDING; auth/ownership/RLS 25 PENDING — teste não executado; regressão 25 PENDING — sem código alterado).

## 15. Divergências conhecidas
`AGENTES/02_backend/STATUS.md` não registra o SHA `4a37131`, o parecer da Verificação nem BK-1…BK-5 (não atualizado por causa do congelamento). A Verificação (`RELATORIO_backend_4a37131.md`) aponta BK-3 como inexatidão da matriz; confirmei por `git grep`. Nenhuma outra divergência de conteúdo.

## 16. Rodada 3 — correções BK-1…BK-5 (commits novos; `4a37131` intocado)
Escopo: `docs/redesign/backend/**`, `docs/qa/fase-9/**`, `AGENTES/02_backend/STATUS.md`. Sem SQL, banco, credencial, migração, push ou merge. Detalhes e tratamento por achado: `RELATORIO_TESTE_RLS.md` §0 e §4b. Resumo: BK-1 escopo explícito (roda como `postgres`, não prova RLS das Fases 3–8); BK-2 R1 aceita `23001` e `23503`; BK-3 sem `ilike`; BK-4 perfil semeado e passo 9 com 11 contagens; BK-5 B-1 virou aviso não abortante no passo 1b. Nada VERIFIED até o parecer da Verificação; B-1 segue decisão de Yan; R1 segue HYPOTHESIS.
