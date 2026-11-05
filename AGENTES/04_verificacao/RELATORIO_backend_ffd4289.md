# Relatório — Entrega 02 · Dados e Backend

SHA revisado: `ffd4289e1c7efaa46ae52734962e5d371e1ee491` (branch `wt/backend-lote1`). Base `8da08c6`. Patch: `git diff 8da08c6..ffd4289` (4 arquivos, +370/−63).
Método: leitura estática. Nenhum SQL executado (sem banco, sem Postgres local).
Gate (decidido pelo Orquestrador em 05/11/2026): **bloquear integração**. Há S2 aberto (B-1, B-2, B-4); com S2 não se usa "liberar com ressalvas" (`PLANO_LOTE1.md`). Nenhum banco real está autorizado.

## 1. Checagens comuns

| # | Resultado | Evidência |
|---|---|---|
| C1 escopo | VERIFIED | só `docs/redesign/backend/**`, `docs/qa/fase-9/**`, `AGENTES/02_backend/STATUS.md` |
| C2 proibidos | VERIFIED | nenhum arquivo de `supabase/`, `apps/web/`, `package.json`, `.env*` |
| C3 `diff --check` | VERIFIED | vazio |
| C4 segredos | VERIFIED | regex sobre as linhas `+` sem ocorrência; o SQL usa UUIDs de exemplo `AAAA…`/`BBBB…` |
| C5 commit | VERIFIED | `docs(backend): …` com trailer |
| C6 handoff | VERIFIED | completo; porcentagem 25% é autodeclarada |

## 2. Matriz tela × dados — conferência por amostra

- 17 de 17 RPCs citadas existem em exatamente uma migração (`grep -l "function public.<nome>"`).
- 29 de 29 actions citadas existem em `apps/web/app/app/**/actions.ts` ou `lib/settings/actions.ts`.
- Referências `arquivo:linha` conferidas: `evidencias/page.tsx:58` (nível derivado de `sourceCount`), `evidencias/[id]/page.tsx:57` (`source_log_id`), `artefatos/[id]/page.tsx:23` (`artifact_sources`) — corretas.
- `app/api/export/route.ts` lê 14 tabelas (conta 14 no código) com `select("*")` sem paginação; `supabase/config.toml` não existe (`ls supabase` → só `migrations`) — R2 coerente.
- Só `daily_logs` e `evidence_sources` têm política `for delete` (`grep "for delete"`); a afirmação de que `evidences` e `artifacts` não têm exclusão confere.
- `inicio/page.tsx` não lê `evidence_suggestions` (0 ocorrências) e usa `.limit(4)` em `daily_logs` (linha 15): confere.
- Não conferi linha a linha cada célula (≈120). Fica `PENDING` uma conferência completa de políticas por tabela.

## 3. Teste RLS — revisão por leitura

Verificado:
- `begin` na linha 30 e `rollback` na 184; nenhum `commit`, `drop`, `truncate`, `alter`, `grant`, `revoke`, `set role` nem `service_role` (grep).
- Defeito D1 do original é real e a correção é correta: o `raise exception 'FALHOU…'` agora fica fora do bloco com `exception when others` (`espera_erro`, linhas 42-56).
- Passos 2-7 conferem com a migração: `22023` para finalidade e confirmação inválidas, `42501` sem identidade/sem autorização/expirada, confirmação verificada antes de consumir a autorização (migração, linhas 65-77), então o passo 6 mantém a linha.
- Seed do passo 8 respeita `NOT NULL` e `CHECK` das migrações: `daily_logs.content` 84 caracteres (mín. 40), `evidences` com 1 competência, `live_sessions` 11/10 caracteres (mín. 4/2), `live_questions.question_text` 20 (mín. 8), `artifacts.title/objective`, `narrative_diagnostics` concluído com todos os campos exigidos pelo `check` e objetivo de 20 caracteres (mín. 8), snapshot com valores permitidos. Não há `create trigger` em nenhuma migração, então o seed não esbarra em gatilho.
- Assinatura antiga `delete_own_account()` removida pela migração (linha 47), como o passo 1 espera.

### B-1 · S2 · HYPOTHESIS — o passo 1 provavelmente reportará `false` para "anon sem EXECUTE"
- Onde: `teste-rls-dois-usuarios.sql:76-79` (`delete_sem_exec_anon`, `authorize_sem_exec_anon`); migração `20260818200000_phase_9_settings.sql:87-88`.
- A migração faz `revoke all on function … from public`, que não remove concessões diretas a `anon`. No Supabase, funções criadas em `public` costumam receber `EXECUTE` para `anon`/`authenticated`/`service_role` por privilégios padrão do esquema. Nenhuma migração do repositório revoga `anon` em funções (`grep anon` só acha a linha 11 da Fase 9, que é sobre a tabela). O relatório e o script dizem "esperado: todas true".
- Impacto: ou o script acusa `false` num banco correto (falso alarme que Yan pode ler como defeito da Fase 9), ou revela que `anon` pode chamar as RPCs. Não é explorável como está: sem `auth.uid()` as funções levantam `42501`. É questão de menor privilégio.
- Só um banco real confirma. Decisão exigida pelo Orquestrador: definir o hardening explícito de `EXECUTE` para `anon` **antes de aplicar a migração**. Alterar a migração é gate de Yan; este relatório não a altera. Depois da decisão, o passo 1 do script deve refletir o estado definido.

### B-2 · S2 · VERIFIED (leitura) — o script induz o uso de contas reais e deixa estado de entrada sem controle
- Onde: cabeçalho, linhas 19-24 ("sua conta principal como A"; `select id, email from auth.users`), passo 0 (exige usuários existentes em `auth.users`), passos 4-5.
- Impacto: o passo 8 semeia dados e exclui a conta A de verdade dentro da transação; só o `rollback` final protege. Se a execução for parcial (selecionar um trecho no editor) ou a sessão fizer commit por outro motivo, uma conta real é destruída. Além disso, `AGENTS.md`/`PROTOCOLO.md` exigem gate para dados pessoais reais; o script lista e-mails. Se B tiver reautenticado nos últimos 5 minutos, o passo 4 falha por razão alheia ao teste.
- Reprodução: leitura das linhas citadas.
- Recomendação (revisada em 05/11/2026; a sugestão anterior de inserir linhas em `auth.users` está retirada): o script não pode citar conta principal nem listar e-mails. Usar duas contas **sintéticas e sacrificáveis**, criadas por fluxo suportado do Supabase Auth (cadastro/convite pelo painel ou API de administração do próprio projeto), de preferência em **ambiente isolado** (projeto ou branch de QA), nunca no banco com dados reais. Limpar `sensitive_action_authorizations` das duas no início da transação e manter o aviso de rodar o arquivo inteiro. Responsável pela correção: definido pelo Orquestrador.

### B-3 · S3 · VERIFIED — o script não exercita RLS como `authenticated`
`pg_temp.como` só ajusta `request.jwt.claims`; a sessão continua sendo `postgres` (ou o papel do editor). A negação de acesso direto à tabela é verificada só pelo catálogo (`has_table_privilege`). Nenhuma política `select_own` de outras tabelas é testada, apesar do nome "dois usuários". Está dentro do que a atribuição pediu (Fase 9), mas o relatório não deveria sugerir isolamento comprovado de dados em geral. Recomendação: lote futuro com `set local role authenticated` e um `select` direto esperando `42501`.

### B-4 · S2 · HYPOTHESIS — R1 (exclusão de conta) é plausível e deve ser tratado como bloqueio da Fase 9 até prova em contrário
Concordo com o escritor. Evidência de leitura: `evidences.source_log_id → daily_logs … on delete restrict` (fase 4, linha 52), `narrative_score_snapshots.diagnostic_id` (fase 6, linha 48), `live_session_evidences.evidence_id` e `live_questions.primary_evidence_id` (fase 7, linhas 19 e 37), `artifact_sources.evidence_id` (fase 8, linha 27). `RESTRICT` não é adiável; se a cascata a partir de `auth.users` apagar `daily_logs` antes de `evidences`, o PostgreSQL recusa com `23001`. A ordem depende dos gatilhos de FK, e eu não a observei. Se confirmar, `delete_own_account` falha para qualquer usuário com dados: impacto em exclusão de conta (privacidade). Não reduzo a severidade sem a saída do passo 8. O script revisado detecta o caso.

### B-5 · S3 · VERIFIED — R2 e R3 estão corretos como risco, mas sem reprodução
R2 (exportação truncada em `max_rows`) depende da configuração do projeto, que não está no repositório. R3 é lacuna de produto. Ambos corretamente rotulados; nada a alterar no documento.

## 4. PENDING

- Execução do SQL em banco liberado por Yan (sintaxe, B-1, B-4, comportamento de `set_config` no editor).
- Conferência integral das células da matriz contra políticas por tabela.
- Revisão por parser: nenhum Postgres local foi usado.

## 5. Decisão de gate sugerida

**Bloquear integração.** Pendentes para novo SHA: corrigir B-2 (contas sintéticas sacrificáveis em ambiente isolado, sem conta principal), decidir B-1 (hardening de `EXECUTE` para `anon` antes de aplicar a migração). B-4 (R1) permanece HYPOTHESIS e gate operacional da Fase 9: só a execução em banco liberado por Yan a confirma ou descarta. Migração, correção de R1 e execução em Supabase continuam gates de Yan.
