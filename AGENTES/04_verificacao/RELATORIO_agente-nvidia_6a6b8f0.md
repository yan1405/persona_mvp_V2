# Relatório — Entrega 03 · Agente NVIDIA

SHA revisado: `6a6b8f0011aa340a0efaf5862c837d72ab530777` (branch `wt/agente-nvidia-lote1`). Base `8da08c6`. Patch: `git diff 8da08c6..6a6b8f0` (4 arquivos, +213/−13).
Método: leitura estática. **Nenhum teste foi executado por mim** (PENDING, ver §4).
Gate (decidido pelo Orquestrador em 05/11/2026): **bloquear integração** até haver novo SHA com a correção de A-1 e regressão. Com S2 aberto não se usa "liberar com ressalvas" (`PLANO_LOTE1.md`).

## 1. Checagens comuns

| # | Resultado | Comando / evidência |
|---|---|---|
| C1 escopo | VERIFIED | `git diff --name-only` → só `apps/web/lib/agent/**`, `docs/redesign/agent/**`, `AGENTES/03_agente_nvidia/STATUS.md` |
| C2 proibidos | VERIFIED | filtro por `package.json`, lockfile, configs, `globals.css`, migrações, `.env`, navegação → nenhum |
| C3 `diff --check` | VERIFIED | saída vazia |
| C4 segredos | VERIFIED | regex (`nvapi-`, `service_role`, JWT, e-mail, `password=`) sobre as linhas `+` → nenhuma ocorrência |
| C5 commit | VERIFIED | `test(agente): …` com trailer `Co-Authored-By`; sem upstream informado |
| C6 handoff | VERIFIED com ressalva | completo; ver A-6 sobre a porcentagem |

## 2. Verificado (estático)

- Sem rede, ambiente nem escrita: `grep -nE "fetch\(|process\.env|https?://|node:(net|http|https|fs|child_process)|supabase|\.(insert|update|delete|upsert|rpc)\(|console\."` em `agent.ts` → nenhuma ocorrência. Imports só de `../live/recommendation.ts` e `../live/response-schema.ts`.
- `lib/live` intacto: `git diff --stat 8da08c6..6a6b8f0 -- apps/web/lib/live` vazio.
- Ownership: `retrieveEvidences` filtra `user_id === userId` antes do ranking (`agent.ts:25`); `user_id` não vai ao modelo (`buildMessages`, linha 32 desestrutura só campos de conteúdo).
- Sem campo `tools` nas mensagens; pergunta e evidências só no turno `user` como JSON (`agent.ts:44`).
- IDs fora das evidências recuperadas são rejeitados porque `parseLiveResponse` recebe só a lista recuperada (`agent.ts:62`; `response-schema.ts:50-55`).
- O rascunho final é reconstruído dos excertos (`response-schema.ts:69`), então texto livre do modelo não chega ao usuário.
- Erro do provedor não propaga mensagem (`agent.ts:58`); o teste cobre isso.
- Teste de zero mutações congela a entrada e roda em módulo ESM (modo estrito): uma escrita lançaria erro.

## 3. Achados

### A-1 · S2 · VERIFIED em execução (reprodução externa por Codex, registrada pelo Orquestrador em 05/11/2026; confirmei por leitura; minha execução independente segue PENDING) — o validador não aplica os limites que o contrato declara
- Onde: `apps/web/lib/live/response-schema.ts:50-69` (`parseLiveResponse`, usado por `agent.ts:62`); contrato em `docs/redesign/agent/CONTRATO_AGENTE.md`, seção "Limites".
- O que acontece: `LIVE_RESPONSE_SCHEMA` só é enviado ao modelo no prompt; `parseLiveResponse` não confere `arguments ≤ 5`, `source_excerpt` mínimo 2/máximo 240, `text` mínimo 4, `draft ≤ 1200` nem `missing_facts`. Um `source_excerpt` vazio ou de espaços vira `""` após `trim` e `source.includes("")` é verdadeiro (linha 56), então passa.
- Impacto: uma resposta `supported:true` com excerto `""` produz o rascunho `"Na minha experiência: ."` e é entregue como válida; mais de 5 argumentos ou rascunho acima de 1200 caracteres também passam. O contrato afirma esses limites como existentes. Não permite fato inventado (o excerto ainda precisa ser substring), mas quebra a promessa de "somente argumentos sustentados".
- Reprodução mínima (resultado reproduzido externamente por Codex e repassado pelo Orquestrador: excerto vazio gera "Na minha experiência: ."): em `agent.test.ts`, `runAgent(reply(answer(e, { arguments: [{ text: "xxxx", evidence_id: e.id, source_field: "result", source_excerpt: "" }] })), base([e]))`. Esperado pelo contrato: `invalid_output`. Previsto pela leitura: resolve com `draft === "Na minha experiência: ."`.
- `parseLiveResponse` também atende ao Persona Live atual, então o defeito atinge código em uso, não só o módulo novo. Decisão do Orquestrador: a correção do parser compartilhado vai para o dono que ele definir, com teste de regressão (excerto vazio/espaços, mais de 5 argumentos, rascunho acima de 1200, textos abaixo do mínimo) cobrindo Live e Agente, e novo SHA congelado. Eu não corrijo.

### A-2 · S3 · VERIFIED — entradas sem limite na fronteira do módulo
`runAgent` não valida `question` (o Live usa 8–500, `lib/live/validation.ts:27`), nem o tamanho dos campos das evidências; só `description` é cortada em 2000 (`agent.ts:44`). Hoje o módulo não é importado por rota; quem chamar precisa validar. Recomendação: validar em `runAgent` ou registrar a responsabilidade no contrato.

### A-3 · S3 · VERIFIED — timeout não cancela o provedor
`Promise.race` (`agent.ts:53-56`) devolve `timeout`, mas a chamada do provedor continua em segundo plano; não há `AbortSignal`. Quando existir adaptador real, isso mantém requisições abertas e pode consumir cota. Recomendação: passar `AbortSignal` ao provedor no lote do adaptador.

### A-4 · S3 · VERIFIED — recuperação aceita preenchimento sem relevância, ordem instável com data inválida e IDs duplicados
- `recommendEvidences` devolve todas as evidências, inclusive com score 0 (`recommendation.ts:32-52`); `slice(0, 8)` (`agent.ts:28`) preenche o contexto com itens sem relação com a pergunta, que o modelo pode citar.
- O desempate usa `Date.parse(updated_at)` (`recommendation.ts:52`); com data inválida o resultado é `NaN` e a ordem deixa de ser determinística.
- Entradas com `id` repetido voltam duplicadas (`byId.get(...)`) e `evidenceIds` repete o id.
Recomendação: decidir se score 0 entra; documentar a premissa de `updated_at` válido e ids únicos.

### A-5 · S3 · VERIFIED — lacunas de teste
Sem casos para excerto vazio/curto (A-1), mais de 5 argumentos, rascunho longo, `question` fora do limite, duplicados, nem para o `rate_limit` vindo de erro genérico. Os casos de injection usam um provedor simulado obediente ou correto: provam o parser, não a resistência do modelo (o contrato já diz isso).

### A-6 · S3 · VERIFIED — rótulos de estado no STATUS
`STATUS.md` marca "Prompt e contrato de saída" como `VERIFIED` (20 pontos, total 40%). Enquanto A-1 existir, o item "validação pós-resposta cobre o contrato" não está comprovado. Sugestão ao Orquestrador: tratar o 40% como autodeclarado e não somar até a revisão de A-1.

### Já conhecidos (não são achado novo, conforme `LOTE-1_CONGELADO.md`)
`agent.test.ts` fora do `npm test`; número plantado presente na evidência é aceito; nenhuma inferência real.

## 4. PENDING

- Execução independente (testes, lint e typecheck): `node --experimental-strip-types --test lib/agent/*.test.ts`, `npm test` (32 existentes), `npm run lint`, `npm run typecheck` (após `npx next typegen`). O Orquestrador autorizou, em 05/11/2026, um checkout/worktree isolado da Verificação **somente** para executar a suíte do **novo SHA**. Falta ele informar o caminho; até lá tudo isto é PENDING. Os 9/9, 32/32, lint e typecheck do handoff do escritor e da Orquestração não contam como execução independente.
- Execução própria da reprodução de A-1 (a vigente é a registrada pelo Orquestrador).
- Qualquer comportamento do modelo real (fora do lote).

## 5. Decisão de gate sugerida

**Bloquear integração.** O módulo novo é isolado, sem rede e sem mutação, mas A-1 está confirmado em execução e atinge o parser compartilhado do Live. O próximo SHA deve trazer a correção atribuída pelo Orquestrador e a regressão. A execução independente da suíte desse SHA acontece em checkout/worktree isolado da Verificação, autorizado pelo Orquestrador somente para esse fim. Aceite visual, Preview e Production ficam com Yan.
