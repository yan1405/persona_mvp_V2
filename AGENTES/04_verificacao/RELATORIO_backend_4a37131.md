# Relatório — Entrega 02 · Dados e Backend (rodada 2)

SHA revisado: `4a37131865586be802f25511ce8f6969ad09109e` · base `8da08c698a74aeb4d95c70123eba61fc921a591c` · 4 commits (`ffd4289`, `1e7ad02`, `cb0f3ba`, `4a37131`) · 4 arquivos, +411/−68 · revisão **estática**; nenhum SQL, banco, credencial ou worktree de escritor foi usado · 05/11/2026.
Específico deste SHA. `RELATORIO_backend_ffd4289.md` é histórico da rodada 1 e não aprova este SHA.

## PARECER E GATE DO BACKEND (para o Orquestrador repassar a Yan)

**Gate sugerido: bloquear integração até correção textual pequena** (regra do plano: com S2 aberto não se usa "liberar com ressalvas"). Não há defeito de lógica no script: as três pendências S2 são de enquadramento (BK-1 nome/escopo "RLS"), de leitura do resultado (BK-2 SQLSTATE) e de ordem de execução (BK-5, HYPOTHESIS). Corrigidas em texto/ordem, a entrega pode ser **liberada com ressalvas** (documentação e script de QA; nada sobre banco real). Nenhum S1; nenhum achado reproduzido em execução (não há execução).
Mantidos exatamente: **B-1 = decisão pendente de Yan** (A, B ou C em `LOTE-1_BACKEND_DECISOES.md`); **R1 = HYPOTHESIS** até execução autorizada em QA; **nenhuma autorização para banco real**; RLS **não aprovada**.
Resumo dos cinco pontos pedidos por Yan: (1) matriz fiel, VERIFIED com 1 inexatidão S3; (2) SQL válido por leitura, VERIFIED com sintaxe não executada (PENDING); (3) isolamento entre usuários é só funcional, não de RLS por papel: VERIFIED como limitação (BK-1); (4) R1 HYPOTHESIS, com um erro de SQLSTATE na proposta (BK-2); (5) `begin`/transação única/`rollback` VERIFIED.

## 1. Checagens comuns

| # | Resultado | Evidência |
|---|---|---|
| C1 escopo | VERIFIED | `git diff --name-only` → `AGENTES/02_backend/STATUS.md`, `docs/qa/fase-9/teste-rls-dois-usuarios.sql`, `docs/redesign/backend/{MATRIZ_TELA_DADOS,RELATORIO_TESTE_RLS}.md` — todos de escrita do papel |
| C2 proibidos | VERIFIED | nenhum arquivo em `supabase/`, `apps/web/`, `package.json`, `.env*` |
| C3 `diff --check` | VERIFIED | saída vazia |
| C4 segredos | VERIFIED | regex `nvapi-\|secret\|service_role\|password\|eyJ\|e-mail` nas linhas `+` → 0; o script só cita UUIDs-modelo `AAAAAAAA-…`/`BBBBBBBB-…` |
| C5 commit | VERIFIED | `docs/test(backend)`, trailer de coautoria nos 4; branch sem upstream |
| C6 handoff | VERIFIED | STATUS completo; % só conta a matriz (25); RLS permanece PENDING |

## 2. Ponto 1 — fidelidade da matriz às migrações, actions, RPCs e libs · VERIFIED (1 inexatidão S3)

Método sistemático: extraí os 253 trechos entre crases de `MATRIZ_TELA_DADOS.md` e procurei cada identificador no código da base (`apps/web/**` + `supabase/**` em `8da08c6`, extraído em diretório de scratchpad). Resultado: **todo identificador de tabela, coluna, RPC, action, lib e componente existe**; os 33 "sem lastro" do script são rótulos (`EXISTE`, `RESTRICT`…), caminhos relativos à pasta `app/app/` e glob. Conferência semântica por amostra, todas conferindo:
- Políticas (grep de `create policy`): as 7 tabelas descritas como "escrita direta" têm as políticas citadas; `narrative_score_snapshots`, `live_*`, `artifacts`, `artifact_*` têm só `select_own` (leitura direta; escrita por RPC) — bate com §0. `live_sessions` insert exige `preparing`; `sensitive_action_authorizations` com RLS e zero políticas (migração fase 9, linhas 9–11).
- As 15 RPCs citadas (`record_narrative_score_snapshot`, `confirm_evidence_suggestion`, `set_live_evidences`, `change_live_session_status`, `create/finish/fail_live_question`, `duplicate_live_session`, `create_artifact(_from_live)`, `autosave_artifact`, `apply_artifact_version`, `mark_artifact_reviewed`, `restore_artifact_version`, `complete_narrative_diagnostic`) existem; `40001` para conflito de revisão existe nas migrações (linhas 1124/1176/1197/1232 do concatenado).
- Referências de linha: `evidencias/page.tsx:58` (nível derivado), `evidencias/[id]/page.tsx:57` (origem), `artefatos/[id]/page.tsx:23` (fontes), `api/export/route.ts:30-43` (14 tabelas, `select("*")`, sem `range`) — todas corretas.
- Colunas `daily_logs.occurred_on/context` e FKs `restrict` existem.
- Cobertura T4.1–T4.8: toda linha traz EXISTE/PARCIAL/INEXISTENTE/DERIVADO; Agente marcado INEXISTENTE; nenhuma linha afirma "aplicado no banco real".

**BK-3 · S3 · VERIFIED — afirmação inexata de busca.** Matriz T4.8 diz "só `ilike` simples nas páginas". `git grep -nE "ilike|\.or\(|textSearch|\.like\("` em `apps/web` (base) → 0. Os filtros são feitos em memória (`evidencias/page.tsx:55`: comentário "100 registros locais…" + `.filter`). Impacto: o desenho do Agente supõe um primitivo SQL que não existe. Recomendação: trocar por "filtro em memória sobre até 100 registros, sem busca no banco".
Obs.: o item "Excluir registro" cita FK `restrict`, o que é correto (`evidences.source_log_id`).

## 3. Ponto 2 — validade do SQL e PostgreSQL 15/16/17 · VERIFIED por leitura; sintaxe não executada = PENDING

Revisão linha a linha de `teste-rls-dois-usuarios.sql` (217 linhas):
- Helpers em `pg_temp`: `como(uuid)` usa `set_config('request.jwt.claims', json_build_object('sub', …)::text, true)`; `auth.uid()` do Supabase lê `request.jwt.claims->>'sub'` (comportamento a confirmar no projeto: PENDING, já listado pelo Backend). `espera_erro`: o `raise exception 'FALHOU'` do caso de erro errado fica **no handler** (propaga, não é capturado pelo próprio bloco) e o de "deveria ter falhado" fica **depois** do bloco protegido (`:61`) — a falha da rodada 1 (D1) está de fato corrigida. `confere` compara `jsonb` por igualdade; chaves/valores divergentes ou ausentes reprovam.
- Assertions coerentes com a migração (`20260818200000_phase_9_settings.sql`): `22023` finalidade (linha 29 da migração, verificada **depois** do teste de identidade, ordem que o passo 2/3 respeita), `42501` sem identidade/sem autorização/expirada, `22023` confirmação errada checada **antes** de consumir a autorização (passo 6 preserva a linha: confere com migração linhas 65–73), PK `(user_id, purpose)`.
- Semeadura do passo 8 conferida contra as definições das migrações: `daily_logs` (content 40–2000: `repeat('registro de teste da fase 9 ', 3)` = 84), `evidences` (títulos/contextos/ação ≥ 4, `competencies` 1–8), `live_sessions` (role ≥ 4, company ≥ 2), `live_session_evidences`, `live_questions` (texto ≥ 8), `artifacts` (type `star`, título/objetivo ≥ 2), `artifact_sources`, `narrative_diagnostics` (`completed` com todos os campos exigidos pelo CHECK; `version = max+1`; evita o índice de rascunho único), `narrative_score_snapshots` (enums e `method_version`/`reason` válidos). Nenhuma coluna `NOT NULL` sem valor foi encontrada.
- **PostgreSQL 15/16/17**: `has_table_privilege(role, tabela, 'select,insert,…,trigger' [|| ',maintain'])`. A lista separada por vírgula é aceita e retorna `true` se houver **qualquer** um; `not has_table_privilege(…)` portanto significa "nenhum" — a semântica pretendida. `MAINTAIN` só existe a partir do 17; a concatenação é decidida por `current_setting('server_version_num')::int >= 170000`, calculada antes da chamada, então 15/16 nunca recebem o termo desconhecido. Cobertura de privilégios completa para 15/16 (7) e 17 (8). Reparo: `to_regprocedure('public.delete_own_account()') is null` confere a remoção da assinatura antiga. PENDING: parser real e a versão do servidor do QA.
- Contagens do cabeçalho (6 `OK (esperado)`, 4 `OK (conferido)`): confere com o código (passos 2–7 usam `espera_erro` ×6; 1, 5, 6, 9 usam `confere` ×4).

## 4. Ponto 3 — isolamento, privilégios e falsos positivos · VERIFIED como limitação; o teste não prova o que o nome sugere

**BK-1 · S2 · VERIFIED (leitura) — o script não exercita RLS nem privilégios *como* `authenticated`/`anon`.**
- Onde: todo o arquivo. `git show 4a37131:docs/qa/fase-9/teste-rls-dois-usuarios.sql | grep -nEi "set +(local +)?role|set session|service_role"` → só ocorrências de `has_*_privilege`; não há `set local role authenticated`/`anon`. Todas as chamadas (inclusive as contagens do passo 5 e 9) rodam como o papel do SQL Editor (`postgres`), que ignora RLS e privilégios de tabela.
- Impacto: o passo 5 prova isolamento **da lógica das duas funções** (chaveada por `auth.uid()`), e o passo 1 lê o catálogo para as ACLs da tabela da Fase 9. Mas nenhuma política `*_select_own`/`*_update_own` das Fases 3–8 é testada, e a tabela `sensitive_action_authorizations` nunca é acessada por um papel de cliente. Assim o arquivo "teste RLS" pode passar integralmente com RLS quebrada nas demais tabelas. Isto é uma limitação de escopo, não um defeito de lógica, mas o nome do arquivo e o relatório podem induzir a ler "RLS aprovada".
- Recomendação: renomear/descrever como "teste das funções sensíveis da Fase 9 + catálogo", ou adicionar um bloco `set local role authenticated` com `select` cruzado A→B (e `reset role`) em decisão futura; não afirmar "RLS verificada" em nenhum documento. Mantido: o `RELATORIO_TESTE_RLS.md` não afirma RLS aprovada (VERIFIED).

**BK-4 · S3 · VERIFIED — falsos positivos pontuais.**
- `profiles_restante = 0` passa trivialmente se a conta A não tinha linha em `profiles` (o seed não cria). A prova real é `auth_users_restante = 0`.
- Passo 9 não conta `live_questions`, `live_sessions`, `artifacts`, `narrative_diagnostics`; elas dependem de `auth.users` por `cascade` direto, mas o passo 8 só prova a ordem da cascata pelas cinco tabelas `restrict` + `auth.users`.
- Passo 5: `autorizacao_de_b = 0` é verificado como `postgres`, não como B; ok para a lógica.
- O passo 8 captura **qualquer** erro (`exception when others`) como "ACHADO BLOQUEANTE": um `42501` (autorização ausente) também apareceria assim. O documento de decisões já cobre isso na tabela da seção 3.

## 5. Ponto 4 — R1, B-1 e o limite do banco real

**R1 · HYPOTHESIS (mantida; S2 por precaução como no rodada 1, B-4).** Conferi no concatenado das migrações as cinco FKs `on delete restrict` citadas: `evidences.source_log_id → daily_logs` (linha 220), `narrative_score_snapshots.diagnostic_id` (490), `live_session_evidences.evidence_id` (724), `live_questions.primary_evidence_id` (742), `artifact_sources.evidence_id` (1007) — **todas existem e apontam para linhas apagadas pela própria cascata de `auth.users`**. Se a cascata as satisfaz é decisão da ordem interna de disparo de triggers de FK: só o banco real responde. Sem execução, continua HYPOTHESIS.

**BK-2 · S2 · HYPOTHESIS (documento de PostgreSQL; sem execução) — o mapeamento de SQLSTATE da proposta R1 provavelmente classifica um R1 verdadeiro como "não é R1".**
- Onde: `LOTE-1_BACKEND_DECISOES.md` §3 ("Só `23503` com a restrição `on delete restrict`… confirma R1") contra `MATRIZ_TELA_DADOS.md` R1 (que diz `23001`).
- Fato: no PostgreSQL, violação de `ON DELETE RESTRICT` levanta `23001` (`restrict_violation`); `23503` (`foreign_key_violation`) é o erro do `NO ACTION`/checagem diferida. Os dois documentos do Orquestrador/Backend se contradizem.
- Impacto: se R1 for real e o erro vier como `23001`, a linha 3 da tabela ("outro SQLSTATE… **não** é R1") levaria a descartá-lo. O script imprime o SQLSTATE bruto (correto) — o risco é na leitura.
- Recomendação: tabela de decisão aceitar `23001` **e** `23503` com restrição das tabelas das Fases 4–8 (a mensagem de erro nomeia a restrição). Rotulei HYPOTHESIS por não haver execução.

**B-1 · decisão pendente de Yan (mantida).** O código confere o fato: a migração faz `revoke all on function … from public` (linhas 87–88) e `grant execute … to authenticated` (89–90), **sem** revogar de `anon` nominalmente; e ambas as funções começam com `auth.uid() is null → 42501` (linhas 24–26 e 61–63). Se o Supabase aplica privilégios padrão de `EXECUTE` a `anon` em funções novas do esquema `public`, `anon` herda `EXECUTE` (não verificado no banco real). Não alterei nada; as opções A/B/C continuam com Yan.

**BK-5 · S2 · HYPOTHESIS — interação B-1 × teste: o passo 1 pode abortar o arquivo e impedir a prova de R1.**
O passo 1 exige `delete_sem_exec_anon` e `authorize_sem_exec_anon = true` via `confere`; se B-1 for real (anon herda `EXECUTE`), o passo 1 reprova (`FALHOU`), a transação aborta e os passos 2–9, inclusive o que prova R1, não rodam. O plano de QA do Orquestrador (itens 3 e 5) rodaria o arquivo inteiro de uma vez. Isto é "o teste reprova sozinho", por desenho — mas pode esconder o resultado de R1 até a decisão B-1 ser tomada. Recomendação: executar a consulta de catálogo à parte (item 3 do plano) e, se B-1 for real, decidir A/B/C antes de interpretar o arquivo inteiro, ou tornar o passo 1 não abortante (apenas `notice`). Sem execução = HYPOTHESIS.

**O que só o banco real comprova:** aplicação da migração; ACLs reais de `anon`/`authenticated` (B-1); ordem da cascata e SQLSTATE (R1); que `auth.uid()` lê `request.jwt.claims` no projeto; persistência do `set_config(…, true)` entre statements do editor; FKs de outros esquemas (Storage/identidades) para `auth.users`; parser/sintaxe (nada foi executado); versão do PostgreSQL do QA.

## 6. Ponto 5 — begin, transação única e rollback · VERIFIED

`:37 begin;` … `:212 rollback;`. `git show 4a37131:… | grep -nEi "commit|drop |alter |truncate|service_role"` → apenas as palavras "truncate" dentro de `has_table_privilege` e no cabeçalho (privilégio, não DDL). DDL do arquivo: somente três `create or replace function pg_temp.*` (esquema temporário da sessão, dentro da transação). DML do passo 7 (`update … expires_at`) e do passo 8 (seed + `delete_own_account`) ficam na mesma transação e são desfeitos pelo `rollback`. Sem `savepoint` nem `commit`; sem `service_role`; dados só sintéticos (`'… QA …'`). Ressalva documentada, não achado: se algum passo abortar (`FALHOU`), o `rollback` final pode não ser alcançado no editor; como não há `commit`, nada persiste (a conexão encerra a transação), e o cabeçalho manda rodar `ROLLBACK` — HYPOTHESIS operacional, sem impacto em dados.

Documentos de decisão: `LOTE-1_BACKEND_DECISOES.md` descreve corretamente o fato de B-1, as cinco FKs, os seis/quatro NOTICE e o rollback; a única inconsistência é BK-2. Contas descartáveis e "nada de conta principal": VERIFIED no cabeçalho do script (corrige o B-2 da rodada 1).

## 7. Classificação

| Item | Estado |
|---|---|
| C1–C6 | VERIFIED |
| Matriz × código (existência, políticas, RPCs, linhas) | VERIFIED (BK-3 S3) |
| Lógica do SQL, assertions, seed, ordem, 15/16/17 | VERIFIED por leitura; execução/parser PENDING |
| Isolamento por papel / RLS das demais tabelas | NÃO COBERTO (BK-1) |
| `begin`/`rollback`, sem commit/DDL persistente | VERIFIED |
| R1 | HYPOTHESIS |
| B-1 | decisão pendente de Yan; fato lido VERIFIED, efeito PENDING |
| RLS, Auth, migração, banco real | PENDING; sem autorização |

Achados: S2 BK-1 (VERIFIED), BK-2 (HYPOTHESIS), BK-5 (HYPOTHESIS); S3 BK-3, BK-4 (VERIFIED). Nenhuma severidade reduzida.
