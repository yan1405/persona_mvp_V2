# Relatório — Entrega 02 · Dados e Backend (fechamento do Lote 1)

SHA revisado: `7aeb658d7ce92336d75e0b7edd48b0cb8de21bd6` (topo de `wt/backend-lote1`, igual ao HEAD do worktree, sem alteração) · base `8da08c698a74aeb4d95c70123eba61fc921a591c` · 6 commits (`ffd4289`, `1e7ad02`, `cb0f3ba`, `4a37131`, `ee6ac3f`, `7aeb658`) · 5 arquivos, +553/−69 · revisão **estática**; nenhum SQL, banco, migração ou credencial · 05/11/2026.
Específico deste SHA. `RELATORIO_backend_ffd4289.md`, `RELATORIO_backend_4a37131.md` e `RELATORIO_backend_ee6ac3f.md` são histórico, ficam sem alteração e **não aprovam** este SHA.

## Gate sugerido: liberar com ressalvas

Vale para o que foi entregue: matriz, relatório do teste RLS, handoff e script de QA. BK-6, BK-7 e BK-8 estão corrigidos; restam S3 de texto. Isto **não** aprova a migração da Fase 9, a RLS nem qualquer banco. B-1 continua decisão de Yan, R1 continua HYPOTHESIS e a sintaxe do SQL nunca foi executada (PENDING). Nenhum S1, nenhum S2 na entrega. Nenhuma severidade reduzida.

## 1. Checagens comuns

| # | Resultado | Evidência |
|---|---|---|
| C1 escopo | VERIFIED | `git diff --name-only 8da08c6..7aeb658` → `AGENTES/02_backend/STATUS.md`, `docs/qa/fase-9/teste-rls-dois-usuarios.sql`, `docs/redesign/backend/{HANDOFF_LOTE1,MATRIZ_TELA_DADOS,RELATORIO_TESTE_RLS}.md` |
| C2 proibidos / produto | VERIFIED | `git diff --stat 8da08c6..7aeb658 -- supabase apps` vazio; nenhum `package.json`, lockfile, config, `.env*` nem migração |
| C3 `diff --check` | VERIFIED | `CHECK_OK` |
| C4 segredos e e-mail | VERIFIED | regex (`nvapi-`, `service_role`, JWT, `sb_secret`, `sk-`, e-mail, `password=`) nas linhas `+` → nenhuma ocorrência; o SQL só contém os UUIDs-modelo `AAAA…` (23×) e `BBBB…` (8×) |
| C5 commit | VERIFIED | commit novo `docs(backend)` com `Co-Authored-By`; sem upstream informado |
| C6 handoff | VERIFIED com BK-9 | `Estado: WAITING_APPROVAL`; 25% conforme contrato, nada marcado VERIFIED antes da Verificação |

Delta desde `ee6ac3f`: `git diff ee6ac3f..7aeb658 -- teste-rls-dois-usuarios.sql` altera só **comentários** do cabeçalho (9 linhas: o texto do passo 0 e a consulta de candidatos); nenhuma instrução SQL mudou. Portanto o parecer funcional da rodada 3 sobre o script (BK-1…BK-5) continua valendo.

## 2. Veredito por achado da rodada 3

| Achado | Sev. | Veredito | Evidência |
|---|---|---|---|
| **BK-6** esperado do passo 9 desatualizado no relatório | S3 | **Corrigido** | `RELATORIO_TESTE_RLS.md` §4 agora cita passo 1 = 9 chaves, passo 9 = 12 chaves (11 `_restante` = 0 + `conta_b_intacta = 1`), "seis `OK (esperado)`", "quatro `OK (conferido)`" e as duas linhas do passo 1b. Recontei no SQL (`f_backend.py`): `pg_temp.espera_erro` = 6 chamadas; `pg_temp.confere` = 4 (passos 1, 5, 6, 9); passo 1 = 9 chaves esperadas e 9 colunas projetadas; passo 5 = 3; passo 6 = 1; passo 9 = 12 esperadas e 12 projetadas, com os 11 nomes do relatório batendo com os aliases; passo 1b emite 2 `NOTICE` (`ACHADO B-1…` ou `OK (conferido) B-1…`); passo 8 emite 3 variantes (`OK:`, `ACHADO BLOQUEANTE (sinal de R1)`, `ACHADO BLOQUEANTE (SQLSTATE fora de R1…)`). Todas as afirmações do relatório conferem |
| **BK-7** `HANDOFF_LOTE1.md` mistura estados | S3 | **Corrigido** | reescrito como snapshot único: declara o HEAD do snapshot (`ee6ac3f`), que o commit de fechamento é posterior e não está nos números, o SHA `4a37131` como histórico imutável, e a lista de 6 commits com o último "(este)". Sem seção desatualizada que contradiga o resto. Os números "+560/−68" são do snapshot, declarados |
| **BK-8** cabeçalho com e-mails e "usuários reais" | S3 | **Corrigido** | consulta de candidatos agora `select id, created_at from auth.users order by created_at;` ("sem e-mail"); passo 0 e cabeçalho dizem "contas descartáveis que já existem no QA". `grep` de `e-?mail` no SQL → só o comentário "(sem e-mail)"; no relatório → nenhuma. Persistem apenas o aviso "Nunca use uma conta pessoal ou principal" e "(sem dados reais)", corretos |

Rodadas anteriores confirmadas por leitura (sem regressão): BK-1 (escopo real no cabeçalho e §0/§7), BK-2 (passo 8 aceita `23001` e `23503`), BK-3 (matriz sem `ilike`), BK-4 (perfil semeado, passo 9 com 11 contagens), BK-5 (passo 1b não aborta).

## 3. Contagens e mensagens do SQL, por leitura

- Estrutura: `begin;` na linha 50 e `rollback;` na 262; os outros `begin` são blocos PL/pgSQL. Nenhum `commit`, `savepoint`, `service_role`, `set role`, `drop`, `alter`, `truncate table`, `grant` nem `revoke` (grep). Blocos `$$` pares (14) e 6 linhas com `$q$`.
- Passo 1b (`foreach f in array array['public.authorize_sensitive_action(text)','public.delete_own_account(text)']` + `has_function_privilege('anon', f, 'execute')`): sintaxe e assinatura em texto válidas em PostgreSQL 15/16/17; só emite `NOTICE`, não aborta.
- Passo 8: classifica o SQLSTATE (`23001`/`23503` = sinal de R1; outro = "investigar ambiente"). Não afirma qual código vem.
- Nada foi executado: a sintaxe real, o parser e o comportamento de `set_config`/`auth.uid()` no editor do Supabase continuam **PENDING**.

## 4. Achado novo (S3, VERIFIED por leitura)

### BK-9 · S3 — `STATUS.md` ainda diz "aguarda Verificação da rodada 3"
`AGENTES/02_backend/STATUS.md`: a linha da tarefa "Matriz tela × dados × ações" mantém "entregue (BK-3 corrigido); aguarda Verificação da rodada 3", enquanto o resto do arquivo está no fechamento (rodada 4) e o `Estado` é `WAITING_APPROVAL`. Não afeta o gate; confunde quem ler só a tabela. Recomendação: trocar por "aguarda o parecer sobre `7aeb658`".

## 5. Mantido, sem prova

- **B-1 — decisão pendente de Yan (A/B/C em `LOTE-1_BACKEND_DECISOES.md`).** Fato lido: a migração faz `revoke all … from public` e `grant execute … to authenticated`, sem revogar de `anon` nominalmente; ambas as funções falham com `42501` quando `auth.uid()` é nulo. O efeito real só o banco mostra. O script agora só avisa (passo 1b).
- **R1 — HYPOTHESIS.** Cinco FKs `on delete restrict` apontam para linhas que a cascata de `auth.users` remove; se a cascata as satisfaz, só um banco liberado por Yan responde.
- **RLS das Fases 3–8**: não coberta pelo script (declarado no cabeçalho, §0 e §7). RLS **não aprovada**.
- **Só o banco real comprova:** aplicação da migração; ACLs de `anon`/`authenticated`; ordem da cascata e SQLSTATE; `auth.uid()` lendo `request.jwt.claims`; persistência de `set_config(…, true)` no editor; FKs de outros esquemas para `auth.users`; sintaxe/parser; versão do PostgreSQL do QA (ramo `MAINTAIN`).

## 6. Classificação

| Item | Estado |
|---|---|
| C1–C5; sem SQL, migração, banco, credencial, e-mail | VERIFIED |
| BK-6, BK-7, BK-8 | Corrigidos (VERIFIED) |
| Contagens e mensagens do SQL × relatório | VERIFIED por leitura |
| `begin`/transação única/`rollback`, sem commit nem DDL persistente | VERIFIED |
| Texto consistente (BK-9) | NÃO — S3 aberto |
| Sintaxe/execução, B-1, R1, RLS das Fases 3–8 | PENDING / decisão de Yan / HYPOTHESIS |

Achados abertos: S3 ×1 (BK-9). Nenhum S1/S2.

## 7. Gate sugerido

**Liberar com ressalvas** a documentação e o script de QA, corrigindo BK-9 em texto. Antes de qualquer execução no QA: decisão de Yan sobre B-1, duas contas descartáveis em ambiente isolado. Migração, correção de R1 e banco real continuam gates de Yan.
