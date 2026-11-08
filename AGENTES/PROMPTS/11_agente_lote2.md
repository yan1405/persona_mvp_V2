# Prompt — Agente NVIDIA / Persona Live — Lote 2 (testes do adaptador)

Você é o **Persona — Agente NVIDIA** no worktree `C:\Users\yansi\Projetos\persona-wt\lote2-agente` (branch `wt/agente-lote2`).

Ative `/ponytail full`. Leia `AGENTS.md`, `AGENTES/PROTOCOLO.md`, `AGENTES/03_agente_nvidia/AGENTS.md`, `AGENTES/ATRIBUICOES/LOTE-2.md` (sua linha), `docs/redesign/agent/CONTRATO_AGENTE.md`, `docs/audits/2026-11-08-auditoria-pre-push-41-commits.md` (achados P-1, P-3, P-4), `apps/web/lib/live/generate-live-response.ts`, `apps/web/app/app/live/actions.ts`, `apps/web/lib/live/live.test.ts` e o adaptador antigo: `git show 06de045:apps/web/lib/groq/generate-live-response.ts`. Antes de editar informe status, HEAD e que `02ec5df` é ancestral. Rode `npm ci` em `apps/web` (sem alterar o lockfile) e `npx next typegen`.

## Tarefas

1. **Testes do adaptador** (`generateLiveResponse`) com **fetch simulado** (`globalThis.fetch` ou injeção mínima): sucesso com JSON válido; `NVIDIA_API_KEY` ausente → `not_configured` (sem chamar fetch); timeout (`AbortError`/`TimeoutError`) → `timeout`; 429 → `rate_limit`; 5xx e erro de rede após duas tentativas → `provider_error`; 4xx diferente de 429 → `provider_error` sem repetir; corpo sem `choices` ou `content` vazio → `invalid_output`; conteúdo que não passa em `parseLiveResponse` → `invalid_output`; a chave aparece só no cabeçalho `Authorization`, nunca no corpo nem na mensagem de erro; número de tentativas. `import "server-only"` quebra no `node --test`: resolva com a **menor** refatoração (extrair o núcleo para `lib/live/nvidia-chat.ts` sem `server-only`, mantendo `generate-live-response.ts` como casca), sem dependência nova e sem mudar o comportamento.
2. **Testes da rota**: o fluxo é a server action `actions.ts`. Teste o mapeamento de `LiveGenerationError.code` para a mensagem ao usuário, `fail_live_question` e o modo regenerar (que hoje descarta a mensagem). Se for impossível sem Next, extraia uma função pura mínima; registre como risco o que ficar sem teste.
3. **`npm test`**: incluir `lib/agent/*.test.ts` e os novos testes alterando **somente** o valor de `scripts.test` em `apps/web/package.json`.
4. **Comparação Groq × NVIDIA para o Live** em `docs/redesign/agent/COMPARACAO_LIVE_GROQ_NVIDIA.md`: tabela de fatos do código (modelo, temperatura 0,1 × 0,5, JSON Schema estrito do provedor × schema no prompt, tentativas, timeout, SDK × `fetch`, variáveis na Vercel — `GROQ_*` existem e `NVIDIA_API_KEY` não —, rollback por revert de `45379b8`), o que cada opção exige para Preview, riscos (latência de até 90 s registrada; limite da função) e uma **recomendação com gates**. Marque cada afirmação como `VERIFIED` (por código ou teste), `HYPOTHESIS` ou `PENDING` (exige chamada real, que você não pode fazer). Fontes públicas podem ser lidas; **nenhuma chamada a API de provedor, nenhuma chave**.
5. Atualizar `AGENTES/03_agente_nvidia/STATUS.md` (`Estado: WAITING_APPROVAL`).

## Limites

Não tocar em `apps/web/lib/live/response-schema.ts`, `recommendation.ts`, `validation.ts`, `live.test.ts`, `lib/groq/**`, `.env*`, lockfile, dependências, nem em outro campo do `package.json`. O parser do Live só muda em lote específico. Sem rota nova e sem chamada externa.

## Validação

`node --experimental-strip-types --test lib/agent/*.test.ts` e os testes novos de `lib/live/`, `npm test`, `npm run lint`, `npm run typecheck`, `npm run build` (sem `.env`), `git diff --check`, varredura de segredo, diff só nos caminhos da sua linha. Commits locais com trailer de coautoria; sem push. Entregue handoff compacto e pare.
