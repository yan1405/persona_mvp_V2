# Status — Persona — Agente NVIDIA

Estado: VERIFIED (incremento 1 do Lote 1, sem rede); PENDING (adaptador real e evals com modelo)

| Tarefa | Peso | Estado | Evidência |
|---|---:|---|---|
| Prompt e contrato de saída | 20 | VERIFIED | `persona-agent-readonly-v1`; casos adversariais (injection em pergunta/evidência, número/ID/excerto inventado, schema inválido) em `agent.test.ts` |
| Recuperação/RAG mínimo | 25 | PENDING | ownership, teto 8 e determinismo verificados; **recall não avaliado** (sem dados reais/métrica) |
| Ferramentas e autoridade | 20 | VERIFIED | `TOOL_MATRIX` + teste de ausência de `tools` e de zero mutações (entrada congelada) |
| Adaptador NVIDIA | 15 | PENDING | só provedor simulado (timeout/rate limit/erro); sem chamada real por gate |
| Evals e regressão | 20 | PENDING | suíte sintética de 9 casos passa; sem eval com modelo real |

Concluído comprovado (só tarefas inteiras: prompt 20 + ferramentas 20): **40%**
Faltante: 60%

## Handoff

- **Escopo recebido:** `AGENTES/ATRIBUICOES/LOTE-1.md` §03. Escrita: `apps/web/lib/agent/**`, `docs/redesign/agent/**`, este STATUS.
- **Arquivos alterados:** `apps/web/lib/agent/agent.ts`, `apps/web/lib/agent/agent.test.ts`, `docs/redesign/agent/CONTRATO_AGENTE.md`, `AGENTES/03_agente_nvidia/STATUS.md`. Nenhum arquivo de produto existente tocado.
- **Comandos:** `node --experimental-strip-types --test lib/agent/*.test.ts` → 9/9; `npm test` → 32/32 (existentes); `npm run lint` e `npm run typecheck` sem erros.
- **Reuso:** `recommendEvidences` e `parseLiveResponse`/`LIVE_RESPONSE_SCHEMA` de `lib/live` (somente leitura).
- **Riscos:** validador aceita número já presente na evidência (inclusive plantado); nada comprova comportamento do modelo real; módulo não integrado a nenhuma rota.
- **Decisões pendentes (Yan/Orquestrador):** incluir `lib/agent/agent.test.ts` no script `npm test` (`package.json` é dele); chamada real e chave NVIDIA rotacionada; migração Groq→NVIDIA continua não aprovada.
- **Bloqueio:** nenhum para este lote. Credencial não solicitada nem usada; `.env*` não lido.
- **Próximo passo:** com gate de Yan, adaptador NVIDIA (timeout/retry/429) e eval real; métrica de recall com dados sintéticos maiores.
- **Commit:** local em `wt/agente-nvidia-lote1`; sem push.
