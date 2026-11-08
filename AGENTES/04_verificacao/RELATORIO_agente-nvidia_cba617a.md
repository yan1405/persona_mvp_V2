# Relatório de Verificação — Agente NVIDIA / Live — Lote 2

- SHA revisado: `cba617abe33860d94e338dfb93ee14a67f60499e` (`wt/agente-lote2`, 1 commit sobre `acc1f4443939cdaf1d57d13b67fe8f929adf1e97`).
- Verificador: Persona — Verificação Independente (não corrigi nada; não revisei trabalho meu).
- Data: 08/11/2026. Base do diff: `git diff acc1f44..cba617a`.
- Vale só para este SHA. Relatórios do Lote 1 (`42dbddf`, `f4edecf`…) são histórico e não aprovam este SHA.

## 1. Resumo e gate sugerido

**Gate sugerido: liberar com ressalvas.** O comportamento publicado do adaptador do Persona Live **não mudou** (prova abaixo: `diff` linha a linha), o parser compartilhado não foi tocado, `package.json` mudou só `scripts.test`, a suíte passa (62/62 no `npm test`), lint, typecheck e build passam sem `.env`. Nenhum S1, nenhum S2. Três S3 (AG2-1 a AG2-3) e uma observação S4 (AG2-4). Não aprova: chamada real, qualidade do modelo, latência, troca de provedor em Production, nem o parser compartilhado (A-1/A-7/L-1 seguem fora deste SHA e sem correção).

## 2. Checagens C1–C6

| # | Checagem | Resultado | Evidência |
|---|---|---|---|
| C1 | Escopo (linha 03 de `LOTE-2.md`) | **OK** | 7 arquivos: `app/app/live/actions.ts`, `lib/live/generate-live-response.ts`, `lib/live/nvidia-chat.ts` e `nvidia-chat.test.ts` (padrão `nvidia-*.ts`/testes de adaptador), `package.json` (só `scripts.test`), `docs/redesign/agent/COMPARACAO_LIVE_GROQ_NVIDIA.md`, `AGENTES/03_agente_nvidia/STATUS.md`. `lib/agent/**` não foi alterado (só passou a rodar no `npm test`) |
| C2 | Arquivos proibidos | **OK** | `response-schema.ts`, `recommendation.ts`, `validation.ts`, `live.test.ts` e `lib/groq/**` ausentes do diff; `package-lock.json` idêntico (`git diff --quiet` verdadeiro); nenhum `.env`; nenhuma dependência nova. `package.json`: diff de **uma** linha, a de `scripts.test` |
| C3 | `git diff --check` | **OK** | exit 0 |
| C4 | Segredos nas linhas adicionadas | **OK** | só ocorrências esperadas: `process.env.NVIDIA_API_KEY` (leitura), cabeçalho `Authorization: Bearer ${apiKey}`, e a constante de teste `nvapi-chave-sintetica-de-teste` (claramente sintética, nunca usada em rede); nomes de variável no documento. Nenhuma chave real |
| C5 | Commit e coautoria | **OK** | 1 commit, pai = `acc1f44`, autor Yan, trailer `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>`; a mensagem descreve a extração e os 10 testes |
| C6 | `STATUS.md` do papel | **OK com ressalva (AG2-4)** | `Estado: WAITING_APPROVAL`; declara que a action não é testada, que o parser (G5) é intocado e o que é `PENDING` |

## 3. O comportamento publicado mudou? (diff do núcleo)

`git show acc1f44:apps/web/lib/live/generate-live-response.ts` × `git show cba617a:apps/web/lib/live/nvidia-chat.ts`, comparados com `diff`:

- Corpo de `generateLiveResponse`, URL, modelo padrão (`z-ai/glm-5.3-flash`, `NVIDIA_MODEL`), `LIVE_PROMPT_VERSION` (`persona-live-nvidia-v1`), prompt do sistema, `temperature` 0,5, `top_p` 1, `max_tokens` 1024, `stream:false`, cabeçalhos, 2 tentativas, `AbortSignal.timeout(15_000)` por tentativa, regras de retentativa (429/5xx/erro de rede repetem; outros 4xx não), mapeamento de erros: **byte a byte idênticos**.
- Diferenças, só estas três: (a) saiu `import "server-only"` do núcleo (continua na casca, ver AG2-3); (b) o import do parser passou de `@/lib/live/response-schema` para `./response-schema.ts` (o alias `@/` não resolve em `node --test`); (c) `LiveGenerationError` deixou de usar *parameter property* (campo explícito + atribuição no construtor; `--experimental-strip-types` não aceita parameter property). Mesmo `code`, mesmo `message`, mesma classe reexportada (`instanceof` em `actions.ts` segue válido).
- `actions.ts`: o `catch` passa a chamar `describeLiveFailure(mode, error)`. Equivalência com o código antigo: código = `error.code` se `LiveGenerationError`, senão `provider_error` ✓; `fail_live_question` só no modo `initial` ✓; mensagem "demorou além do limite" só para `timeout`, genérica nos outros ✓; `console.error("Live generation failed", { code })` ✓. O resto do arquivo está intacto (`git diff` de 10 linhas).
- `generate-live-response.ts` virou `import "server-only"` + `export { … } from "./nvidia-chat.ts"`: os mesmos quatro nomes que `actions.ts` importa. O build (`next build`) compila a reexportação com extensão `.ts` e `tsc` aceita.

Conclusão: refatoração de extração, comportamento preservado. **VERIFIED** por leitura e por execução.

## 4. Achados

| ID | Sev. | Status | Achado |
|---|---|---|---|
| AG2-1 | S3 | VERIFIED | **Os testes não fixam o timeout nem o sinal de aborto.** Provei por mutação em cópia fora do repositório (scratchpad; `lib/live/*.ts` copiado e alterado só lá): trocar `AbortSignal.timeout(15_000)` por `30_000`, ou apagar a linha `signal: …`, **mantém 10/10 verdes**; `attempt < 2`→`< 3` (2 falham), remover o mapeamento de 429 (1 falha), pôr a chave no corpo (1 falha), trocar o modelo padrão (1 falha) e `markQuestionFailed` sempre verdadeiro (1 falha) **são pegos**. Os testes de "timeout" só lançam um erro com `name` `AbortError`/`TimeoutError`; nada prova que o `fetch` real recebe um `signal` de 15 s, que é o que define o pior caso de ≈ 30 s citado na comparação. **Recomendação:** afirmar `init.signal` instanceof `AbortSignal` e (com `mock.timers` ou lendo `signal.aborted` após o tempo) o limite, ou ao menos `assert.ok(init.signal)`. **Reprodução:** copiar `lib/live/{nvidia-chat,nvidia-chat.test,response-schema}.ts` para uma pasta temporária, remover `signal: AbortSignal.timeout(15_000),` e rodar `node --experimental-strip-types --test nvidia-chat.test.ts` → pass 10. |
| AG2-2 | S3 | VERIFIED | **Aceite parcial: "tratamento de erro da rota" só foi testado pela função extraída.** `LOTE-2.md` pede testes do adaptador *e* do tratamento de erro da rota com provedor simulado. A server action (`generateVersion`, `askLiveQuestion`, `regenerateLiveQuestion`) não é exercitada: o teste cobre `describeLiveFailure`, não que `actions.ts` a chame com `mode` certo nem que `fail_live_question` receba o código. O escritor declara isso ("DONE (parcial)"). A ligação foi conferida por leitura nesta revisão (equivalência na seção 3), mas continua sem teste executável. **Recomendação:** o Orquestrador decide se aceita como está (a action exige Next + Supabase) ou abre um lote de integração. |
| AG2-3 | S3 | VERIFIED | **`nvidia-chat.ts` perdeu `import "server-only"`.** A casca `generate-live-response.ts` ainda o tem, e hoje só ela é importada por código de produto, então a barreira funciona. Quem importar `nvidia-chat.ts` direto num componente cliente não leva erro de build; a chave (`NVIDIA_API_KEY`, sem `NEXT_PUBLIC_`) continua indisponível no navegador, então não há vazamento de segredo, mas a guarda deixa de cobrir o módulo que realmente faz a chamada. Escolha deliberada (precisa rodar em `node --test`). **Recomendação:** regra de lint `no-restricted-imports` ou comentário no topo do módulo; ou manter como está e registrar. |
| AG2-4 | S4 | observação | **`STATUS.md` perdeu o contexto do bloqueio do Lote 1.** `Estado` passou de `BLOCKED` (motivo: A-1/A-7 no parser compartilhado, S2 sem dono) a `WAITING_APPROVAL`, e a tabela de pesos/percentual saiu. O texto cita "parser do Live (G5) intocado", mas não diz que A-1/A-7/L-1 seguem **abertos** no parser em uso (inclusive o da Groq em Production). A comparação coloca isso como gate G5 `PENDING`, o que é fiel. Este SHA não deveria corrigir o parser (fora de escopo); só convém o Orquestrador não ler `WAITING_APPROVAL` como "S2 resolvido". |

Nenhuma severidade foi reduzida. Os achados do Lote 1 sobre o parser (A-1, A-7, L-1) **não foram reavaliados** aqui (parser intocado, fora do diff); o Orquestrador integrou só `lib/agent` em `b989c9f` (opção c do L-1).

## 5. Revisão do documento de comparação Groq × NVIDIA

Conferi cada afirmação marcada `VERIFIED` contra o código (`git show 06de045:apps/web/lib/groq/generate-live-response.ts`, `45379b8`, `node_modules/groq-sdk/client.js`):

| Afirmação | Conferido |
|---|---|
| Groq: `openai/gpt-oss-20b`, `persona-live-v1`, temperatura 0,1, `max_completion_tokens` 1800, `json_schema` `strict:true`, SDK com `maxRetries:1` e `timeout:15_000`, repetição extra em 400 `json_validate_failed` | ✓ (código de `06de045`) |
| Groq: SDK repete 408, 409, 429 e ≥ 500 (`shouldRetry`) | ✓ (`client.js` linhas 320–340) |
| NVIDIA: modelo, versão do prompt, temperatura 0,5, `max_tokens` 1024, sem schema no provedor (schema só como texto no prompt) | ✓ |
| Pior caso: Groq 4 chamadas × 15 s ≈ 60 s; NVIDIA 2 × 15 s ≈ 30 s; sem pausa entre tentativas | ✓ por cálculo; tempo real PENDING (certo) |
| Mesmos cinco códigos de erro | ✓ |
| `45379b8` está em `main` local (`acc1f44`) e **não** em `origin/main` `06de045` (`git merge-base --is-ancestor`) | ✓ |
| `maxDuration` não definido em `apps/` | ✓ (`git grep maxDuration acc1f44 -- apps` vazio) |
| `regenerateLiveQuestion` descarta o retorno de `generateVersion` | ✓ (`actions.ts` linhas 130–134) |
| "Production quebra no push sem `NVIDIA_API_KEY`" | ✓ por código: o Live em `main` local lê só `NVIDIA_API_KEY` e devolve `not_configured` sem ela |
| `NVIDIA_API_KEY` ausente na Vercel (auditoria P-1) | **não reverificado** (não consultei a Vercel); fica como "relatado", PENDING de reconferência — o documento já diz isso |

A separação VERIFIED/HYPOTHESIS/PENDING do documento é honesta: truncamento a 1024 tokens, taxa de `invalid_output`, latência, qualidade e custo estão como HYPOTHESIS/PENDING. Nenhuma chamada real foi ou pôde ter sido feita (sem chave).

## 6. Execução independente

Checkout isolado `C:\Users\yansi\Projetos\persona-wt\verificacao-lote2`, desanexado em `cba617abe33860d94e338dfb93ee14a67f60499e`, `git status` limpo antes e depois. Sem `.env`, sem chave, sem rede de provedor; `fetch` simulado.

| Comando (em `apps\web`) | Exit | Resultado |
|---|---:|---|
| `npx next typegen` | 0 | tipos gerados |
| `node --experimental-strip-types --test lib/live/nvidia-chat.test.ts lib/agent/agent.test.ts` | 0 | tests 30 · pass 30 · fail 0 · cancelled 0 · skipped 0 (10 do adaptador + 20 de `lib/agent`) |
| `npm test` | 0 | tests 62 · pass 62 · fail 0 · cancelled 0 · skipped 0 (32 anteriores + 30) |
| `npm run lint` | 0 | sem diagnósticos |
| `npm run typecheck` | 0 | sem erros |
| `npm run build` (sem `.env`) | 0 | "Compiled successfully"; rotas `/app/live` e `/app/live/[id]` presentes |

Sondas adicionais (scratchpad, fora do repositório): 8 mutações do adaptador (seção AG2-1).

## 7. VERIFIED / HYPOTHESIS / PENDING

| Estado | Itens |
|---|---|
| VERIFIED | escopo, arquivos proibidos, `diff --check`, segredos, coautoria; comportamento preservado (diff); `package.json` só `scripts.test`; 62/62, lint, typecheck, build; fatos do documento de comparação listados na seção 5 |
| HYPOTHESIS | truncamento por `max_tokens` 1024; aumento de `invalid_output`; conflito ao reverter `45379b8` |
| PENDING | chamada real (G1–G3, gates de Yan); latência contra o limite da função (G4); parser compartilhado (G5; A-1/A-7/L-1 abertos); ADR (G6); variáveis da Vercel reconferidas; teste da action (AG2-2) |

## 8. Decisões pendentes

Orquestrador: aceitar AG2-2 como está ou abrir lote de integração da action; tratar o parser compartilhado (G5) em lote próprio; registrar AG2-4. Yan: chave NVIDIA nova, chamada de aceite com dados sintéticos, ADR Groq→NVIDIA, Preview/Production.
