# Relatório — Entrega 02 · Dados e Backend (rodada 3)

SHA revisado: `ee6ac3f43ad10523b71f3f2924e71750db6f8490` (topo de `wt/backend-lote1`) · base `8da08c698a74aeb4d95c70123eba61fc921a591c` · 5 commits (`ffd4289`, `1e7ad02`, `cb0f3ba`, `4a37131`, `ee6ac3f`) · 5 arquivos, +560/−68 · revisão **estática**; nenhum SQL, banco, credencial ou worktree de escritor foi usado · 05/11/2026.
Específico deste SHA. `RELATORIO_backend_ffd4289.md` (rodada 1) e `RELATORIO_backend_4a37131.md` (rodada 2) são histórico, ficam sem alteração e **não aprovam** este SHA.

## PARECER E GATE

**Gate sugerido: liberar com ressalvas**, **para a entrega revisada** (documentação, matriz e script de QA). Os cinco achados S2/S3 da rodada 2 estão corrigidos; restam S3 de texto. Isto **não** aprova a migração da Fase 9, a RLS, nem o banco real: B-1 segue decisão pendente de Yan, R1 segue HYPOTHESIS e a sintaxe do SQL nunca foi executada (PENDING). Nenhum banco real está autorizado.
Nenhum S1. Nenhum S2 aberto nesta entrega. Nenhuma severidade reduzida.

## 1. Checagens comuns

| # | Resultado | Evidência |
|---|---|---|
| C1 escopo | VERIFIED | `git diff --name-only 8da08c6..ee6ac3f` → `AGENTES/02_backend/STATUS.md`, `docs/qa/fase-9/teste-rls-dois-usuarios.sql`, `docs/redesign/backend/{HANDOFF_LOTE1,MATRIZ_TELA_DADOS,RELATORIO_TESTE_RLS}.md` — todos de escrita do papel (`HANDOFF_LOTE1.md` fica em `docs/redesign/backend/**`) |
| C2 proibidos | VERIFIED | nenhum arquivo de `supabase/`, `apps/`, `package.json`, `.env*`; `git diff --stat 8da08c6..ee6ac3f -- supabase apps` vazio |
| C3 `diff --check` | VERIFIED | `CHECK_OK` |
| C4 segredos | VERIFIED | regex nas linhas `+` sem ocorrência; só UUIDs-modelo `AAAA…`/`BBBB…` |
| C5 commit | VERIFIED | 5 commits com `Co-Authored-By`; sem upstream informado |
| C6 handoff | VERIFIED com ressalva BK-7 | `STATUS.md` registra a rodada 3 e não marca nada VERIFIED antes da Verificação; ver BK-7 sobre o `HANDOFF_LOTE1.md` |

## 2. Veredito por achado da rodada 2

| Achado | Sev. | Veredito | Evidência |
|---|---|---|---|
| **BK-1** o script não exercita RLS por papel | S2 | **Corrigido** (texto); nome do arquivo mantido | Cabeçalho do SQL (linhas 5-12): roda como `postgres`, "NÃO prova nenhuma política RLS das Fases 3–8… Passar aqui NÃO significa 'RLS aprovada'"; `RELATORIO_TESTE_RLS.md` §0 e §7 descrevem o teste futuro com `set local role authenticated`/`anon` (não implementado). Ressalva: o arquivo continua se chamando `teste-rls-dois-usuarios.sql`; o aviso no cabeçalho cobre o risco de leitura. |
| **BK-2** SQLSTATE 23001 × 23503 | S2 (HYPOTHESIS) | **Corrigido** | Passo 8 (`git diff 4a37131..ee6ac3f`): `if sqlstate in ('23001','23503')` → "ACHADO BLOQUEANTE (sinal de R1)"; outro código → "fora de R1; investigar ambiente". `MATRIZ_TELA_DADOS.md` R1 cita os dois; `LOTE-1_BACKEND_DECISOES.md:43-46` aceita `23503` **ou** `23001` com a restrição nomeada. |
| **BK-5** B-1 pode abortar o passo 1 antes de R1 | S2 (HYPOTHESIS) | **Corrigido** | As chaves `delete_sem_exec_anon`/`authorize_sem_exec_anon` saíram do `confere` do passo 1; novo passo 1b (`do $$ … foreach f in array … has_function_privilege('anon', f, 'execute')`) só emite `NOTICE` ("ACHADO B-1" ou "OK (conferido) B-1") e não aborta. Os passos 2–9, inclusive R1, rodam. B-1 continua decisão de Yan; o script não escolhe A/B/C. |
| **BK-3** matriz diz "só `ilike`" | S3 | **Corrigido** | `MATRIZ_TELA_DADOS.md` T4.8: "não há busca no banco (nenhum `ilike`, `.or(`, `textSearch` ou `.like(` em `apps/web`); filtros em memória sobre até 100 registros (`evidencias/page.tsx:55`)". Conferi: `git grep` desses termos em `8da08c6 -- apps/web` → vazio; `evidencias/page.tsx:55` traz o comentário "100 registros locais bastam…". |
| **BK-4** falsos positivos do script | S3 | **Corrigido** (com justificativa para o resto) | Seed cria `profiles` de A (`on conflict (id) do nothing`); passo 9 passa a contar também `live_sessions`, `live_questions`, `artifacts` e `narrative_diagnostics` (11 contagens zero + conta B = 1); passo 8 classifica o SQLSTATE. Mantido por justificativa: `autorizacao_de_b` é lido como `postgres` (comentado no próprio passo 5). |

## 3. Verificado nesta rodada (leitura)

- **Seed de `profiles` contra o schema** (`phase_3_onboarding.sql:1-25` e `phase_6_narrative_score.sql`): `display_name` `'QA Fase 9'` (9, exige 2–80); `professional_moment 'estudando'` (valor permitido); `main_objective` `'Objetivo de teste QA da fase 9'` (30 caracteres; a Fase 6 exige 8–240); `product_consent true` (o `check` exige); `consent_version`, `product_consent_at` e `onboarding_completed_at` preenchidos; demais colunas têm default. Nenhum `NOT NULL` sem valor. Não há `create trigger` nas migrações.
- **Passo 9** agora confere 12 chaves (11 zeros + `conta_b_intacta`); as tabelas novas contadas existem e têm `user_id` (`live_sessions`, `live_questions`, `artifacts`, `narrative_diagnostics`).
- **Passo 1b**: `foreach f in array array['public.authorize_sensitive_action(text)','public.delete_own_account(text)']` e `has_function_privilege('anon', f, 'execute')` são válidos em PostgreSQL 15/16/17 (assinatura em texto). A existência das funções já é exigida pelo passo 1 antes de chegar ao 1b.
- **`begin`/`rollback`**: `begin;` na linha 49 (as outras ocorrências de `begin` são blocos PL/pgSQL), `rollback;` na 261. `grep -nEi "^\s*(commit|savepoint)|service_role|set +(local +)?role|drop |alter |truncate +table|grant |revoke "` → só um comentário (linha 20). Blocos `$$` pares (14), seis chamadas `$q$ … $q$`. Dados só sintéticos.
- **Contas**: o cabeçalho agora exige "SOMENTE no projeto de QA e SOMENTE com duas contas descartáveis… Nunca use uma conta pessoal ou principal". Nenhuma sugestão de inserir em `auth.users`. (B-2 da rodada 1 permanece corrigido.)
- **Matriz**: fidelidade conferida na rodada 2 e as linhas alteradas (T4.8 e R1) conferem; `git diff 4a37131..ee6ac3f -- MATRIZ_TELA_DADOS.md` tem 2 linhas.

## 4. Achados novos (todos S3, VERIFIED por leitura)

### BK-6 · S3 — `RELATORIO_TESTE_RLS.md` §4 ficou com o esperado antigo
`docs/redesign/backend/RELATORIO_TESTE_RLS.md` §4 ainda diz "passo 9 = `0,0,0,0,0,0,0,1`" (8 valores), mas o script agora espera 11 zeros e `conta_b_intacta = 1` (12 chaves). Também fala em "quatro `OK (conferido)`", e o passo 1b imprime mais um ou dois `OK (conferido) B-1`. Quem comparar a saída com o relatório vai achar divergência que não existe. Recomendação: alinhar §4 ao cabeçalho do script.

### BK-7 · S3 — `HANDOFF_LOTE1.md` mistura o estado de `4a37131` com o da rodada 3
`docs/redesign/backend/HANDOFF_LOTE1.md` §2 (HEAD `4a37131`), §4 (4 arquivos, +411/−68), §5 (4 commits), §8 ("Ação: … novo commit, quando liberado" para itens já feitos), §13 e §15 ("STATUS não registra o SHA…") descrevem o estado anterior; só o §16 e o cabeçalho avisam da rodada 3. O próprio arquivo se declara "somente leitura de fatos". Um leitor que pare em §2 toma `4a37131` por HEAD. Recomendação: atualizar §2 e §5 para `ee6ac3f` ou marcar as seções como históricas.

### BK-8 · S3 — resíduos de enquadramento no cabeçalho do SQL
Continuam: "Para ver candidatos: `select id, email from auth.users order by created_at;`" (lista e-mails de todos os usuários do projeto; no QA com contas descartáveis é tolerável, mas é o único ponto que pede leitura de e-mails) e o comentário do passo 0, "usuários reais e distintos", que contradiz o aviso de contas descartáveis. Recomendação: listar só `id, created_at` e trocar "reais" por "existentes".

## 5. O que continua sem prova (não são achados desta entrega)

- **B-1 — decisão pendente de Yan (A/B/C em `LOTE-1_BACKEND_DECISOES.md`).** Fato lido (VERIFIED): `revoke all … from public` e `grant execute … to authenticated` (migração, linhas 87-90), sem `revoke … from anon` nominal; e ambas as funções falham com `42501` quando `auth.uid()` é nulo (linhas 24-26 e 61-63). O efeito (se o Supabase concede `EXECUTE` a `anon`) só o banco real mostra.
- **R1 — HYPOTHESIS.** As cinco FKs `on delete restrict` existem (`evidences.source_log_id`, `narrative_score_snapshots.diagnostic_id`, `live_session_evidences.evidence_id`, `live_questions.primary_evidence_id`, `artifact_sources.evidence_id`). Se a cascata de `auth.users` as satisfaz, só o banco responde.
- **Só o banco real comprova:** aplicação da migração; ACLs de `anon`/`authenticated` (B-1); ordem da cascata e SQLSTATE (R1); que `auth.uid()` lê `request.jwt.claims` no projeto; persistência do `set_config(…, true)` entre statements do editor; FKs de outros esquemas para `auth.users`; **sintaxe e parser** (nada foi executado); versão do PostgreSQL do QA (ramo `MAINTAIN`).
- **RLS das Fases 3–8:** não coberta pelo script (BK-1). RLS **não aprovada**.

## 6. Classificação

| Item | Estado |
|---|---|
| C1–C5 | VERIFIED |
| Matriz × código (rodada 2) e correções BK-3/BK-4 | VERIFIED |
| Escopo real do script e SQLSTATE de R1 documentados | VERIFIED |
| B-1 não aborta o teste (passo 1b) | VERIFIED por leitura; execução PENDING |
| Seed e passo 9 coerentes com as migrações | VERIFIED por leitura |
| `begin`/transação única/`rollback`, sem commit nem DDL persistente | VERIFIED |
| Texto consistente (BK-6, BK-7, BK-8) | NÃO — S3 abertos |
| Sintaxe/execução, B-1, R1, RLS das Fases 3–8 | PENDING / decisão de Yan / HYPOTHESIS |

Achados abertos: S3 ×3 (BK-6, BK-7, BK-8). Nenhum S1/S2 na entrega.

## 7. Gate sugerido

**Liberar com ressalvas** a documentação e o script de QA, corrigindo BK-6, BK-7 e BK-8 em texto. Antes de qualquer execução no QA: decisão de Yan sobre B-1, duas contas descartáveis e ambiente isolado. Migração, correção de R1 e banco real continuam gates de Yan.
