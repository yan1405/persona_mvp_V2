# Status — Persona — Agente NVIDIA

Estado: WAITING_APPROVAL

Branch `wt/agente-lote2` (worktree `C:\Users\yansi\Projetos\persona-wt\lote2-agente`). Sem push, sem chave, sem chamada externa em nenhum lote. Handoff compacto vai na resposta final; não criar arquivo de handoff.

## Para a 2ª conversa (retomar sem o histórico)

**Estado.** Lotes 2, 3 e 4 entregues e integrados na `main` local (`168c251`). O Lote 5 (3 commits abaixo, branch `wt/agente-lote2`, base `4dbb6e4`) aguarda revisão independente e integração pelo Orquestrador, só com autorização de Yan. Decisões de Yan já tomadas: **tudo usa NVIDIA** (ADR aceito, G0), parser do Live em lote próprio (feito), AG5-2 aceito.

**SHAs vigentes (ordem cronológica, todos locais).**

| Lote | SHA | Conteúdo |
|---|---|---|
| 2 | `cba617a` · `9abf927` · `72b0e60` · `ae00dd4` | testes do adaptador Live; timeout/`signal` (AG2-1); `runGenerateVersion` testável (AG2-2); fakes de autorização (feito por outro agente, AG4-1) |
| 3 | `b7b21a4` · `952ec70` · `4d9aa79` | barreira ESLint + `--test-timeout` (AG2-3/AG3-1/AG4-2); parser do Live (A-1/A-7/L-1); ADR NVIDIA único |
| 4 | `9adce279725c476bca197002e849e919978f9534` · `13af232e700111564815aedb6d76da2c570816f8` · **este commit (M2)**, SHA completo no handoff | AG5-1 (import dinâmico/require/sufixo/barril); M1 cliente NVIDIA compartilhado; M2 Score na NVIDIA |

| 5 | `31c1800ab8c432644d527f28850d6c2f2e0871a5` · `ca6bf9fdf7b172a66316d1ddd6972183a3f54b1d` · `02bebe9727d9d7c7ee013a39445180764beba31c` | AG6-2 casca `server-only` do Score; AG6-3 cerca Markdown no Score; M3 Diário na NVIDIA |

**O que existe hoje.**
- `lib/live/nvidia-client.ts`: `callNvidiaChat({ messages, temperature, maxTokens, timeoutMs? })`; erro `NvidiaError` com cinco códigos (`not_configured`, `timeout`, `rate_limit`, `invalid_output`, `provider_error`); 2 tentativas (429, 5xx, rede/timeout), 4xx ≠ 429 não repete; chave só no cabeçalho `Authorization`; modelo `NVIDIA_MODEL` ou `z-ai/glm-5.3-flash`.
- `lib/live/nvidia-chat.ts`: Live (temp. 0,5, 1.024 tokens, 15 s) sobre o cliente; `generate-live-response.ts` é a casca com `server-only`; `generate-version.ts` guarda a orquestração testável de `app/app/live/actions.ts`.
- `lib/score/analyze-coherence.ts`: casca `server-only` do Score (como `generate-live-response.ts`); `app/app/score/actions.ts` importa a casca, não mais o núcleo.
- `lib/groq/structure-evidence.ts`: **Diário na NVIDIA** (M3; temp. 0,1, 1.400 tokens, 12 s por tentativa, esquema no prompt, sem `response_format`, sem fallback para Groq, mesmo `parseEvidenceStructure`, `StructureEvidenceError` e import da ação). Núcleo sem `server-only`; a barreira é o ESLint. Sem chave o usuário vê o aviso `not_configured` do Diário.
- `lib/score/coherence.ts`: **Score na NVIDIA** (temp. 0,1, 1.600 tokens, 12 s por tentativa, esquema no prompt + `parseCoherenceOutput`, rubrica `coherence-v1` e notas 0/25/50/75/100 inalteradas, sem `response_format`, sem fallback para Groq). Formato é o **M0 provisório**; a decisão final é de Yan depois do G2.
- `lib/live/response-schema.ts`: parser do Live com A-1/A-7/L-1 corrigidos (excerto íntegro, sem cortar número/palavra, negação por oração com vírgula/quebra de linha como fim de oração, competências isoladas). Limites e L-2 declarados em `docs/redesign/agent/CONTRATO_AGENTE.md`.
- ESLint (`apps/web/eslint.config.mjs`): `no-restricted-imports` + `no-restricted-syntax` proíbem importar `nvidia-chat`, `nvidia-client`, `generate-version` e `coherence` (também por `import()` literal, `require` literal, sufixos `.ts/.js/.mjs/.cjs` e pasta/index de `lib/live`) fora de `lib/live/**`, `lib/score/coherence.ts`, `lib/score/coherence.test.ts`, `lib/score/analyze-coherence.ts`, `lib/groq/structure-evidence.ts` (+ teste), `app/app/live/actions.ts` e `app/app/diario/actions.ts` (também `structure-evidence`). **Arquivo novo que precise importar o núcleo tem de entrar nessa lista.** Limites declarados no config: caminho montado em execução, alias novo, componente dentro das pastas liberadas.
- `npm test` = 105 testes no M3; o Score aceita **uma** cerca Markdown inteira em volta do JSON (AG6-3), e o Diário a mesma (regex duplicada em `structure-evidence.ts`, não compartilhada); `scripts.test` usa `--test-timeout=60000`.

**O que falta (ordem do ADR, `docs/redesign/agent/ADR_NVIDIA_UNICO.md`).**
1. **M4 Artefatos** (`lib/groq/generate-artifact.ts`) ainda usa Groq (`groq-sdk`, `GROQ_API_KEY`, `GROQ_MODEL`, JSON Schema estrito do provedor). Os textos "Groq" em `app/app/diario/[id]/page.tsx` (5) são da Interface (M3 já saiu da Groq; os textos ficam errados até a Interface trocar).
2. **M5** provedor real para `lib/agent/**` (hoje sem chamador) e **M6** remover `groq-sdk`/`GROQ_*` (dependência e lockfile = gate de Yan). `.env.example` ainda lista `GROQ_*` e precisa de `NVIDIA_API_KEY`/`NVIDIA_MODEL` já presentes; atualizar no M6 (fora das minhas pastas hoje).
3. **Gates de Yan (G1–G7):** chave NVIDIA nova só no Preview; uma chamada real por superfície com dados sintéticos (G2); qualidade e taxa de `invalid_output` por superfície (G3); limite de duração da função na Vercel frente ao pior caso (G4); Preview (G5); remoção do `groq-sdk` (G6); Production só com `NVIDIA_API_KEY` presente antes do push (G7).
4. **Riscos abertos:** `regenerateLiveQuestion` descarta a mensagem de erro e a casca de `askLiveQuestion`/`regenerateLiveQuestion` (redirect, `revalidatePath`, RPC `create_live_question`) segue sem teste; `max_tokens` 1.024 do Live pode truncar JSON (HYPOTHESIS); segunda tentativa sem pausa em 429; Score com 12 s × 2 tentativas na NVIDIA nunca foi medido; sem schema estrito do provedor aumenta `invalid_output` (PENDING); L-2.

**Armadilhas.**
- `node --experimental-strip-types --test`: **sem** parameter properties (`constructor(readonly x)`), sem `enum`, imports relativos **com `.ts`**, alias `@/` não resolve e `server-only` não existe fora do Next. Por isso os núcleos testáveis não importam `server-only`; a barreira é o ESLint.
- Depois de `npm ci` rode `npx next typegen` (senão `typecheck` falha por `LayoutProps`). Nunca `npm install` (altera lockfile).
- Editar arquivos com script Python: abrir com `newline=""` e preservar CRLF/LF; os avisos "LF will be replaced by CRLF" do Git são inofensivos.
- Heredoc grande no Bash com aspas misturadas já quebrou o parser da ferramenta; para arquivos de teste use a ferramenta de escrita.
- Mutação por ESLint sem escrever no repo: `printf '...' | npx eslint --stdin --stdin-filename components/x.tsx`.
- Chaves nos testes são sintéticas (`nvapi-chave-sintetica-de-teste`); a varredura de segredo as acusa, é esperado.
- Escrita: só a linha do Agente em `AGENTES/ATRIBUICOES/LOTE-N.md` do lote vigente; outro arquivo = parar e pedir ao Orquestrador. Não editar `AGENTES/` de outro papel, `00_orquestrador`, `ATRIBUICOES`, `PROMPTS`.
- Proibido sempre: push, merge/rebase com a `main`, Preview, Production, banco/SQL, chave real, chamada a provedor, dependência nova. Commit local com `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>`.
- Validação padrão por commit: `npm test`, `npm run lint`, `npm run typecheck`, `npm run build` (sem `.env`), `git diff --check`, varredura de segredo, diff só nos caminhos autorizados.

## Histórico por lote

**Lote 2 (base `acc1f44`).** Adaptador testado com `fetch` simulado (`nvidia-chat.test.ts`); `lib/agent` no `npm test`; `docs/redesign/agent/COMPARACAO_LIVE_GROQ_NVIDIA.md`. AG2-1: `NVIDIA_TIMEOUT_MS`/`NVIDIA_MAX_ATTEMPTS` exportadas, `AbortSignal` por tentativa fixado, aborto real exercitado, 4 mutações falham. AG2-2: `runGenerateVersion` (corpo movido sem alteração para `lib/live/generate-version.ts`, 11 testes com fakes, 6 mutações falham).

**Lote 3.** AG2-3: regra `no-restricted-imports`; AG3-1: `--test-timeout=60000`; AG4-2: arquivos novos registrados. Parser do Live (A-1, A-7, L-1): 6 testes em `response-schema.test.ts` (5 falham no parser anterior; 5 mutações falham). ADR NVIDIA único: inventário dos 5 usos de LLM, plano M0–M6, riscos, gates G0–G7.

**Lote 4.**
- AG5-1: a regra cobre `import()` literal, `require` literal, sufixos e `lib/live` como pasta/index; provado por `eslint --stdin` com componente cliente (9 formas falham; `lib/live`, `coherence.ts`, `actions.ts` e a casca passam).
- M1: `callNvidiaChat` generalizado de `nvidia-chat.ts`; Live sem mudança de comportamento (os 12 testes antigos passam sem edição); 8 testes novos do cliente; 6 mutações em cópia falham (timeout ignorado, sem `signal`, temperatura fixa, `max_tokens` fixo, chave no corpo, repetição de 4xx).
- M2: Score migrado; 6 testes em `coherence.test.ts` (rubrica `coherence-v1` e notas discretas, sucesso, `not_configured` sem fallback para `GROQ_API_KEY`, timeout, 429, 5xx/rede, 4xx, saída inválida incluindo ID fora da entrada, nota fora de 0/25/50/75/100, critério ausente e nenhuma evidência citada); 8 mutações em cópia falham (sem esquema no prompt, temperatura, timeout, `max_tokens`, ID fora da entrada, erro do provedor vira `invalid_output`, sem `NvidiaError`, rubrica alterada). Sem chamada real: PENDING.

**Lote 5.** AG6-2: casca `server-only` (build passa; `eslint --stdin`: componente cliente e `actions.ts` importando o núcleo falham, a casca passa). AG6-3: 1 teste falha antes e passa depois + 1 de guarda; 4 mutações em cópia falham. M3: `structure-evidence.test.ts` (7 testes, `fetch` simulado); 9 mutações em cópia falham. Sem chamada real: PENDING.

Gates humanos: chave NVIDIA nova, chamada real de aceite (G2), qualidade por superfície (G3), limite da função (G4), push/Preview/Production, remoção do `groq-sdk`.
