# Relatório de Verificação — Agente NVIDIA — Lote 2, Rodada 2

- SHA revisado: `9abf92762285c50dc4c20c58624b8f4a794d0001` (`wt/agente-lote2`; filho direto de `cba617abe33860d94e338dfb93ee14a67f60499e`).
- Verificador: Persona — Verificação Independente. Data: 08/11/2026. Diff: `git diff cba617a 9abf927` (3 arquivos, +53/−16).
- `RELATORIO_agente-nvidia_cba617a.md` vira histórico e **não aprova** este SHA.
- Regras: sem chave, sem `.env`, sem rede de provedor, sem push/merge/correção; mutações só em cópia fora do repositório.

## 1. Resumo e gate sugerido

**Gate sugerido: liberar para integração local, com ressalvas.** AG2-1 está **fechado por medição**: as mutações `sem_signal` e `timeout_30` que sobreviviam 10/10 agora **falham** (5 de 12 testes cada), o código sem mutação passa 12/12 em quatro execuções, e o comportamento publicado do adaptador **não mudou**. Continuam abertos, sem mudança de natureza: AG2-2 (action não testada, S3) e o parser compartilhado (A-1/A-7/L-1, fora deste SHA). Nenhum S1/S2. Chamada real, chave, latência e ADR: `PENDING`, gates de Yan.

## 2. Checagens

| # | Checagem | Resultado | Evidência |
|---|---|---|---|
| C1 | Escopo | **OK** | só `apps/web/lib/live/nvidia-chat.ts`, `apps/web/lib/live/nvidia-chat.test.ts`, `AGENTES/03_agente_nvidia/STATUS.md` |
| C2 | Arquivos proibidos | **OK** | nenhuma mudança em `package*.json`, lockfile, `response-schema.ts`, `generate-live-response.ts`, `app/**` (`git diff … \| wc -l` = 0) |
| C3 | `git diff --check` | **OK** | exit 0 |
| C4 | Segredos | **OK** | única correspondência nas linhas adicionadas é o **nome** `NVIDIA_API_KEY` lido de `process.env`; a chave `nvapi-chave-sintetica-de-teste` já existia e é sintética |
| C5 | Commit | **OK** | pai = `cba617a`; autor Yan; trailer `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>` |
| C6 | `STATUS.md` | **OK** | linha AG2-1 `DONE`; registra o SHA anterior; declara que A-1/A-7/L-1 seguem abertos, que a guarda `server-only` está na casca e que AG2-2 segue como ressalva (resolve AG2-4 e documenta AG2-3) |

## 3. O comportamento publicado não mudou

`git diff cba617a 9abf927 -- apps/web/lib/live/nvidia-chat.ts`, integral (9 linhas):

| Mudança | Efeito |
|---|---|
| +1 linha de comentário no topo: núcleo sem `server-only` para rodar em `node --test`; a guarda está em `generate-live-response.ts` | nenhum (comentário) |
| `+export const NVIDIA_TIMEOUT_MS = 15_000;` | o valor é o mesmo que estava inline |
| `+export const NVIDIA_MAX_ATTEMPTS = 2;` | idem |
| `for (… attempt < 2 …)` → `attempt < NVIDIA_MAX_ATTEMPTS` | idêntico com N = 2 |
| `AbortSignal.timeout(15_000)` → `AbortSignal.timeout(NVIDIA_TIMEOUT_MS)` | idêntico |
| `if (attempt === 0) continue;` → `if (attempt < NVIDIA_MAX_ATTEMPTS - 1) continue;` | com N = 2 isso é `attempt < 1`; `attempt` começa em 0 e é inteiro, então ≡ `attempt === 0`. Só diverge se N mudar, e então o novo texto é o que o nome sugere (repetir até a última) |

`generate-live-response.ts` re-exporta por **nome** (`generateLiveResponse, LIVE_PROMPT_VERSION, LiveGenerationError, describeLiveFailure`), então as duas constantes novas não entram na superfície do app. Nenhum outro arquivo de produto mudou.

## 4. AG2-1: mutações em cópia fora do repositório

Cópia: `nvidia-chat.ts`, `nvidia-chat.test.ts` e `response-schema.ts` extraídos de `9abf927` para uma pasta do scratchpad, mutados com `sed`, executados com `node --experimental-strip-types --test nvidia-chat.test.ts`. Nada no repositório foi tocado.

| Mutação | Resultado | Testes que falham |
|---|---|---|
| nenhuma (3 cópias, 3 execuções) | **pass 12 / fail 0** nas três | — |
| `sem_signal`: apaga a linha `signal: AbortSignal.timeout(…)` (era 10/10 verde) | **pass 7 / fail 5** | sucesso; timeout; 429; 5xx/rede; aborto real |
| `timeout_30` literal: `AbortSignal.timeout(30_000)` (era 10/10 verde) | **pass 7 / fail 5** | mesmos cinco |
| constante `NVIDIA_TIMEOUT_MS = 30_000` | pass 6 / fail 6 | os cinco + "política publicada" |
| `NVIDIA_MAX_ATTEMPTS = 3` | pass 10 / fail 2 | "política publicada"; 429 |
| retry nunca (`if (false) continue;`) | pass 9 / fail 3 | os de nº de tentativas |
| sinal que nunca expira (`new AbortController().signal`) | **pass 7 / fail 4 só com `--test-timeout=4000`**; sem isso o teste "aborto real" **não termina** | ver AG3-1 |

Como a correção funciona (lido no teste): `AbortSignal.timeout` é substituído por um espião durante `run()`, que registra o `ms` pedido e, no teste de aborto real, o encurta (5 ms) só no timer real; cada chamada de `fetch` registra se recebeu um `AbortSignal` ainda não abortado; `assertTransport` exige 1..`NVIDIA_MAX_ATTEMPTS` chamadas, todas com sinal vivo e `timeouts` iguais a `15_000` (literal, não a constante); o passo `"hang"` só rejeita quando o sinal aborta e lança se não houver sinal. O teste "política publicada" fixa `NVIDIA_TIMEOUT_MS === 15_000` e `NVIDIA_MAX_ATTEMPTS === 2`. Restauração de `AbortSignal.timeout`/`fetch`/`NVIDIA_API_KEY` num `finally`.

## 5. Execução independente

Checkout isolado `C:\Users\yansi\Projetos\persona-wt\verificacao-lote2`, desanexado em `9abf92762285c50dc4c20c58624b8f4a794d0001`, `git status` limpo; devolvido a `acc1f44` (limpo). Lockfile igual ao do SHA anterior (nenhuma mudança em `package*.json`), então reutilizei os `node_modules` do `npm ci` anterior. Em `apps\web`, sem `.env`, sem chave, sem rede de provedor:

| Comando | Exit | Resultado |
|---|---:|---|
| `npx next typegen` | 0 | tipos gerados |
| `npm test` | 0 | tests **64** · pass 64 · fail 0 · cancelled 0 · skipped 0 (era 62: +2 testes novos no adaptador) |
| `npm run lint` | 0 | sem diagnósticos |
| `npm run typecheck` | 0 | sem erros |
| `npm run build` | 0 | compilado, rotas dinâmicas listadas |

## 6. Achados

| ID | Sev. | Status | Achado |
|---|---|---|---|
| AG2-1 | (era S3) | **resolvido (medido)** | seção 4. Os testes agora fixam o `signal` por tentativa, o 15 s e as 2 tentativas, e exercitam o aborto real. |
| AG2-2 | S3 | **aberto, sem mudança** | `generateVersion`/`askLiveQuestion`/`regenerateLiveQuestion` não têm teste executável; só `describeLiveFailure`. Ressalva aceita pelo parecer (B). |
| AG2-3 | S3 → S4 | **mitigado por comentário** | `nvidia-chat.ts` segue sem `import "server-only"`; o comentário do topo manda importar a casca. É convenção, não barreira: um import direto de um componente cliente ainda compilaria. Sem vazamento de chave (`NVIDIA_API_KEY` não é `NEXT_PUBLIC_`). Reduzi a S4 porque a casca existe, o risco é só de manutenção e o escritor deixou o motivo escrito; se o Orquestrador quiser manter S3, a barreira real é uma regra `no-restricted-imports`. |
| AG2-4 | (era S4) | **resolvido** | `STATUS.md` agora diz que A-1/A-7/L-1 seguem abertos fora deste SHA. |
| **AG3-1** | S4 | VERIFIED | Mutante em que o sinal nunca expira faz o teste "aborto real" **pendurar** em vez de falhar: `npm test` não passa `--test-timeout`. Medido: a execução ficou parada além de 5 min e deixou um `node` órfão que precisei encerrar. É detectado (não "sobrevive"), mas como travamento do CI, não como falha. **Recomendação:** `--test-timeout` no script de teste, ou um `Promise.race` com limite dentro do teste. Não afeta o produto. |

Nenhuma severidade reduzida além da AG2-3, justificada acima.

## 7. VERIFIED / HYPOTHESIS / PENDING

| Estado | Itens |
|---|---|
| VERIFIED | C1–C6; diff do adaptador ≡ comportamento anterior; mutações `sem_signal` e `timeout_30` agora falham; typegen/test 64/64/lint/typecheck/build; AG2-4; AG3-1 |
| HYPOTHESIS | que `AbortSignal.timeout` real do runtime da Vercel se comporte como o espião simula (o teste fixa o contrato do código, não o runtime) |
| PENDING | chamada real (gates de Yan); latência contra o limite da função; parser compartilhado (G5, A-1/A-7/L-1); ADR Groq→NVIDIA; teste da action (AG2-2); variáveis da Vercel |

## 8. Decisões pendentes

Orquestrador: aceitar AG2-2/AG2-3/AG3-1 como ressalvas; tratar o parser compartilhado em lote próprio. Yan: chave NVIDIA nova, chamada de aceite com dados sintéticos, ADR, Preview/Production.
