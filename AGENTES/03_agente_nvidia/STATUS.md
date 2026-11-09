# Status — Persona — Agente NVIDIA

Estado: WAITING_APPROVAL

Lote 2 (base `acc1f44`, branch `wt/agente-lote2`). Entrega: testes do adaptador do Persona Live com provedor simulado, `lib/agent` no `npm test` e comparação Groq × NVIDIA. Sem chave, sem chamada externa, sem push.

| Tarefa | Estado | Evidência |
|---|---|---|
| Testes do adaptador (`nvidia-chat.test.ts`, 10 casos) | DONE | sucesso, sem chave, timeout, 429, 5xx/rede, 4xx, saída inválida, chave só no cabeçalho, nº de tentativas |
| Erro da server action | DONE (parcial) | `describeLiveFailure` testada (mensagem por código, `fail_live_question` só no modo inicial); a action em si exige Next/Supabase e **não** é testada |
| `npm test` inclui `lib/agent` e o novo teste | DONE | só o valor de `scripts.test` |
| AG2-1 (rodada 2): timeout e `signal` fixados | DONE | `NVIDIA_TIMEOUT_MS`/`NVIDIA_MAX_ATTEMPTS` exportadas e asseridas; cada tentativa leva `AbortSignal` não abortado criado com 15 s (espião em `AbortSignal.timeout`); aborto real exercitado (12 testes). Mutações em cópia (sem `signal`; 30_000 literal; constante 30_000; 3 tentativas) agora falham |
| AG2-2 (rodada 3): orquestração de `generateVersion` testável | DONE | corpo movido sem alteração para `lib/live/generate-version.ts` (`runGenerateVersion`, dependências injetadas); `actions.ts` ficou com a casca (`authenticatedClient` + chamada). 11 testes com fakes: sessão inativa, sem evidências, alternative sem outra, `finish_live_question` (answered/gap, sem duplicatas), `fail_live_question` só no modo inicial, falha do rpc → `invalid_output`. 6 mutações em cópia falham |
| Comparação Groq × NVIDIA | DONE | `docs/redesign/agent/COMPARACAO_LIVE_GROQ_NVIDIA.md` |

SHAs anteriores (congelados, não reescritos): `cba617abe33860d94e338dfb93ee14a67f60499e`, `9abf92762285c50dc4c20c58624b8f4a794d0001`. Novo SHA informado no handoff.

Decisão refatoração: núcleo movido para `lib/live/nvidia-chat.ts` (sem `server-only`); `generate-live-response.ts` virou casca de reexportação. Comportamento igual; `LiveGenerationError` deixou de usar parameter property (não roda em `node --test`).

Riscos abertos: `regenerateLiveQuestion` ainda descarta a mensagem de erro (agora provado: `runGenerateVersion` a devolve, a action a ignora); `askLiveQuestion`/`regenerateLiveQuestion` (casca: redirect, revalidatePath, RPC `create_live_question`) seguem sem teste; latência/limite da função, taxa de `invalid_output` e `max_tokens` 1.024 dependem de chamada real (PENDING); parser do Live (G5) intocado: **A-1/A-7/L-1 do parser seguem abertos, fora deste SHA** (AG2-4). A guarda `server-only` está na casca `generate-live-response.ts`, não em `nvidia-chat.ts` (AG2-3); AG2-2 segue como ressalva.
Gates humanos: chave NVIDIA nova, chamada real de aceite, ADR Groq→NVIDIA, push/Preview/Production.
