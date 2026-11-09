# Relatório de Verificação — Agente NVIDIA — Lote 4 (AG5-1, M1 cliente compartilhado, M2 Score na NVIDIA)

- SHAs revisados, um a um (`wt/agente-lote2`, base `4d9aa79f6608730a34100d7d1302d152524b6ec8`):
  1. `9adce279725c476bca197002e849e919978f9534` — AG5-1: barreira ESLint do núcleo LLM (1 arquivo: `eslint.config.mjs`).
  2. `13af232e700111564815aedb6d76da2c570816f8` — M1: `lib/live/nvidia-client.ts` compartilhado, `nvidia-chat.ts` passa a usá-lo (5 arquivos).
  3. `4dbb6e468afe3513253145eaa0996fb5701b28cb` (topo) — M2: coerência do Score (`lib/score/coherence.ts`) de Groq para NVIDIA (6 arquivos).
- Cada commit é filho direto do anterior. Verificador: Persona — Verificação Independente. Data: 09/11/2026. Backend verificado por leitura; **nenhuma chamada a provedor, nenhuma chave, nenhum `.env`**.
- Os relatórios de `4d9aa79` e anteriores são histórico e **não** aprovam estes SHAs. Um relatório vale só para o SHA citado.
- Regras cumpridas: sem correção, sem push/merge; nada nos worktrees dos escritores; execução só em `verificacao-lote2`, um SHA por vez, builds em sequência com `HEAD` conferido, devolvida a `a5a18aa` limpa. Mutações, sondas e diferencial só em cópias fora do repositório.

## 1. Resumo e gate sugerido por SHA

| SHA | Gate sugerido | Em uma linha |
|---|---|---|
| `9adce27` (AG5-1) | **liberar para integração local** | A barreira passa a pegar `import()`, `require`, `.js/.mjs/.cjs` e o barril: 15 de 15 sondas esperadas bloqueiam e 4 de 4 controles liberam. Um limite S4 novo (AG6-1). |
| `13af232` (M1) | **liberar para integração local** | Live sem mudança de comportamento: 20 cenários de provedor simulado dão resultado idêntico ao `nvidia-chat.ts` antigo (chamadas, cabeçalhos, corpo, timeouts, código de erro); os 12 testes antigos seguem sem edição; 12 de 12 mutações do cliente falham. |
| `4dbb6e4` (M2) | **liberar com ressalvas** | Rubrica `coherence-v1` e notas 0/25/50/75/100 inalteradas (o arquivo do esquema nem aparece no diff); sem Groq no Score; os testes pegam "ID fora da entrada", "sem discretização" e "erro vira nota 0". Ressalvas: comportamento real do modelo NVIDIA sem `response_format` (AG6-3, HYPOTHESIS), chave `NVIDIA_API_KEY` no ambiente (AG6-4) e `server-only` removido (AG6-2). |

Respostas diretas: **(a)** M1 sem mudança de comportamento para o Live (seção 3); **(b)** barreira ESLint medida por mutação (seção 2); **(c)** M2 e a rubrica (seção 4); **(d)** testes capturam as três mutações pedidas (seção 5); **(e)** nada de Groq no Score e `lib/groq/**` intacto (seção 4); **(f)** o que o usuário vê sem chave e a posição do Score na árvore (seção 6); **(g)** gates (seção 7).

Execução independente, sem `.env`: `next typegen`, lint (0 avisos), typecheck e build com saída 0 nos três SHAs; `npm test` **82/82**, **90/90**, **96/96** (cancelados 0, ignorados 0); `HEAD` conferido antes e depois de cada passo.

## 2. AG5-1 (`9adce27`): a barreira ESLint, por mutação

Montei uma cópia de `apps/web` fora do repositório com o `node_modules` copiado e rodei `eslint` com a configuração de `9adce27` e depois com a do topo `4dbb6e4`, sobre 31 arquivos de sonda: 22 importações vindas de um componente cliente (17 que **devem** bloquear no config final, 15 delas já em `9adce27`; 5 que o config não cobre, 3 declaradas e 2 não, AG6-1), 4 controles que **devem** liberar e 5 posições permitidas ou proibidas dentro de `lib/score`, `app/app/score` e `lib/live`.

| Sonda | `9adce27` | `4dbb6e4` |
|---|---|---|
| `import … from "@/lib/live/nvidia-client"` (alias), caminho relativo com `.ts` | bloqueia | bloqueia |
| sufixos `.js`, `.mjs`, `.cjs` em `nvidia-chat`/`nvidia-client` | bloqueia (3 de 3) | bloqueia |
| `import("…/nvidia-client")`, `import("…/nvidia-chat.ts")` | bloqueia (`no-restricted-syntax`) | bloqueia |
| `require("…/nvidia-chat")` | bloqueia (`no-restricted-syntax`) | bloqueia |
| `export * from`, `export { x } from` | bloqueia | bloqueia |
| barril: `@/lib/live`, `…/index`, `…/index.ts` | bloqueia (3 de 3) | bloqueia |
| `generate-version` | bloqueia | bloqueia |
| `coherence` (`@/lib/score/coherence`, `…/coherence.ts`) | libera (ainda não era núcleo) | **bloqueia** (2 de 2) |
| `import type { NvidiaMessage } from …/nvidia-client` | bloqueia | bloqueia (falso positivo inofensivo; só tipo) |
| **Controles:** `lib/live/validation`, `coherence-schema`, `my-coherence`, `import("@/lib/live/validation")` | libera (4 de 4) | libera |
| `app/app/score/actions.ts`, `lib/score/coherence.test.ts` | libera | libera (permitidos) |
| `app/app/score/page.tsx`, `lib/score/other.ts` → `coherence` | libera | **bloqueia** (correto) |
| **Limites declarados no config:** caminho montado (`` import(`…/${p}`) ``, concatenação), alias novo (`@server-core/…`), componente cliente **dentro** de `lib/live` | libera | libera (igual ao documentado) |
| **Fora dos limites declarados:** `` import(`@/lib/live/nvidia-chat`) `` e `` require(`…`) `` com template sem expressão | **libera** | **libera** (AG6-1) |

- O `eslint` do próprio checkout também passa com 0 avisos nos três SHAs (nenhum arquivo real viola).
- Controle de método: uma sonda de `import()` bloqueada só pela regra nova prova que `no-restricted-syntax` está ativo; as sondas de caminho montado, que o config declara não cobrir, liberam como declarado.
- AG5-1 (do Lote 3) **resolvido** nos casos listados; sobra o limite declarado "componente cliente dentro de `lib/live`" e o AG6-1 abaixo.

## 3. M1 (`13af232`): Live sem mudança de comportamento

- **Diff de `nvidia-chat.ts` (−49):** saem URL, modelo, timeout, tentativas, corpo, laço de tentativas e leitura da chave; entram `callNvidiaChat({ messages, temperature: 0.5, maxTokens: 1_024 })`, `NvidiaError → LiveGenerationError(error.code)` e a reexportação de `NVIDIA_MAX_ATTEMPTS`/`NVIDIA_TIMEOUT_MS`. O prompt (mensagens `system` e `user`) fica byte a byte igual, só reindentado.
- **`nvidia-client.ts` (+53):** o laço (2 tentativas em 429, 5xx e rede/timeout; 4xx ≠ 429 não repete), `AbortSignal.timeout(timeoutMs)` por tentativa, cinco códigos, chave só no cabeçalho `Authorization`, `catch` que mapeia `TimeoutError`/`AbortError` para `timeout` e o resto para `provider_error`. É o mesmo código movido.
- **Diferencial executado:** carreguei o `nvidia-chat.ts` de `4d9aa79` e o de `4dbb6e4` lado a lado e rodei o mesmo provedor simulado (sem rede) em **20 cenários**: ok, `NVIDIA_MODEL` definido, sem chave, 429, 429 que recupera, 503, 400, 401, erro de rede, rede que recupera, `TimeoutError`, `AbortError`, chamada pendurada (aborto real), conteúdo vazio, `null`, sem `choices`, corpo não JSON, saída inválida, JSON de forma errada, ID de evidência fora da entrada. Comparei número de chamadas, URL, método, cabeçalhos, corpo (JSON completo), timeouts pedidos e o resultado/erro (nome, classe, código). **20 de 20 idênticos**; exports públicos preservados.
- **Testes antigos:** `nvidia-chat.test.ts` (12 testes) não está no diff de nenhum dos três commits e passa; a suíte sobe de 82 para 90 com os 8 testes novos do cliente.
- **Mutações do cliente** (cópia, 12): repetir em 4xx, uma tentativa só, `timeoutMs` ignorado, chave no corpo, 429→`provider_error`, timeout→`provider_error`, conteúdo vazio aceito, `NVIDIA_MODEL` ignorado, sem `not_configured`, `max_tokens` fixo, temperatura fixa, sem `signal`. **12 de 12 falham** (de 1 a 28 testes cada). Mais 3 mutações no `nvidia-chat.ts` (temperatura, `max_tokens`, código de erro): 3 de 3 falham, pegas pelo diferencial.
- A sentinela de timeout do Lote 3 segue: `--test-timeout=60000` está no `scripts.test`, que só ganhou o arquivo novo.

## 4. M2 (`4dbb6e4`): Score na NVIDIA

- **Rubrica e discretização:** `lib/score/coherence-schema.ts` **não aparece** em `git diff 4d9aa79 4dbb6e4` (continua `COHERENCE_RUBRIC_VERSION = "coherence-v1"`, `enum [0, 25, 50, 75, 100]`, pesos 35/25/25/15, `parseCoherenceOutput` com UUID, ID permitido, ao menos uma evidência). Um teste novo trava a versão e o `enum`.
- **Prompt:** as mesmas 9 frases do sistema; entra só "Retorne somente JSON válido, sem Markdown, seguindo exatamente este JSON Schema: …" no lugar do `response_format`. Parâmetros: temperatura 0,1, `max_tokens` 1.600, **12 s por tentativa** (mantido do Groq), 2 tentativas.
- **Sem Groq no Score:** `git grep` em `lib/score` e `app/app/score` encontra "groq" só no teste (variável de ambiente sintética para provar que **não há fallback**). `lib/groq/**` **não foi tocado** (`git diff --stat` vazio). `groq-sdk` segue em `package.json` para Diário (`structure-evidence`) e Artefatos (`generate-artifact`), como o ADR manda (M3/M4/M6); `package.json` mudou só em `scripts.test`, o lockfile não.
- **Mudanças de comportamento reais (o que deixa de ser igual ao Groq):** (i) a chave passa a ser `NVIDIA_API_KEY` e o modelo `NVIDIA_MODEL` (padrão `z-ai/glm-5.3-flash`, **compartilhado com o Live**; `GROQ_MODEL` e `GROQ_API_KEY` não valem mais para o Score); (ii) o provedor deixa de **impor** o esquema (`json_schema` estrito): a validação passa a ser só o prompt e o parser; (iii) a segunda tentativa é imediata em 429/5xx/rede, sem o recuo do SDK do Groq (**HYPOTHESIS**: não executei o SDK); (iv) `coherence.ts` perde `import "server-only"` e passa a ter extensão `.ts` nos imports, para rodar em `node --test`.
- **Equivalência de erros:** os cinco códigos mantêm o significado; `RateLimitError`, `APIConnectionTimeoutError` e `APIError` viram `NvidiaError` com o mesmo código.

## 5. Os testes pegam as mutações pedidas? (M2)

34 mutações em cópias com o mesmo conjunto de testes (`nvidia-client`, `nvidia-chat`, `coherence`, `score` e o diferencial); critério: ao menos um teste vermelho.

| Mutação | Resultado |
|---|---|
| **Aceitar ID fora da entrada** (`!permitted.has(id)` removido) | **morta** (2 testes) |
| Lista de permitidos ampliada com um ID de fora | morta (1) |
| **Não discretizar** (`!SCORES.has(score)` removido) | **morta** (1) |
| Esquema com `enum` diferente | morta (1) |
| **Erro do provedor vira nota 0** (`NvidiaError → return { score: 0 }`) | **morta** (4: `not_configured`, timeout, 429/5xx, saída inválida) |
| `invalid_output` vira `provider_error` | morta (1) |
| Pesos 35/25/25/15 trocados por 25/25/25/25; rubrica `coherence-v2`; resumo curto aceito; evidência obrigatória removida | 4 de 4 mortas |
| Timeout 15 s no lugar de 12 s; temperatura 0,5; `max_tokens` 1.024; esquema fora do prompt | 4 de 4 mortas |
| Fallback para `GROQ_API_KEY` | morta (1) |
| 12 mutações do cliente e 3 do `nvidia-chat` | 15 de 15 mortas |
| **Sobreviventes (4):** sem `!UUID.test(id)`; sem teto de 12 IDs por critério; sem `slice(0, 12)` das evidências; sem `slice(0, 240)` do objetivo | **sobrevivem** (AG6-5) |

Os 4 sobreviventes são inofensivos em produção: o teste de UUID é redundante com `permitted.has` (os IDs permitidos vêm do banco e são UUID); `getNarrativeScoreData` já limita as evidências a 12 (`.limit(12)`), então os `slice` do prompt são defesa em profundidade. Observação herdada do Groq, não regressão: os IDs permitidos vêm de **todas** as evidências da entrada enquanto o prompt manda só as 12 primeiras.

## 6. Onde o Score está na árvore e o que o usuário vê

- **Quem chama:** só `app/app/score/actions.ts` (`updateCoherence`, `analyzeCoherence` na linha 22), disparada pelo `<form action={updateCoherence}>` de `app/app/score/page.tsx`. `git grep` não acha outro chamador (o Início só lê o último snapshot). A guarda de elegibilidade (5 evidências, 2 contextos, 3 competências), a autenticação e o botão desabilitado ficam **antes** da chamada ao provedor.
- **Sucesso:** RPC `record_narrative_score_snapshot` com origem `ai_assisted` e `p_rubric_version = coherence-v1`, `revalidatePath` e `?notice=updated`. Nada disso mudou.
- **Falha (qualquer dos cinco códigos, inclusive `persistence_failed`):** `console.error("Coherence analysis failed", { code })` (só o código, sem corpo nem chave), nenhum snapshot gravado e `redirect("/app/score?notice=<código>")`.
- **Sem chave (`not_configured`):** a tela do Score mostra, como `role="alert"`, "A análise não foi atualizada. O último Score válido foi preservado; tente novamente mais tarde." É a **mesma** mensagem de timeout, 429, saída inválida e erro do provedor; o código só aparece na URL (`?notice=not_configured`). O Score anterior e o Início ficam intactos. Não há aviso de que a chave falta.
- **Pior caso de duração:** 2 tentativas × 12 s = 24 s mais banco, igual ao Groq (`maxRetries` 1 × 12 s). Frente ao limite de função da Vercel é o gate G4 de Yan (PENDING).

## 7. Gates por SHA

| Passo | `9adce27` | `13af232` | `4dbb6e4` |
|---|---|---|---|
| `npx next typegen` | 0 | 0 | 0 |
| `npm test` | 82/82 | 90/90 | 96/96 |
| `npm run lint` | 0 (0 avisos) | 0 | 0 |
| `npm run typecheck` | 0 | 0 | 0 |
| `npm run build` | 0 | 0 | 0 |
| `HEAD` estável | sim | sim | sim |

Escopo e higiene: `git diff --check` 0 linhas nos três; nenhum `actions.ts`, SQL, lockfile, `.env`, `supabase/` ou `lib/groq/**` tocado; `package.json` só em `scripts.test`; `AGENTES/03_agente_nvidia/STATUS.md` (com o bloco "Para a 2ª conversa") e o ADR (§9 andamento M0–M2) são os únicos documentos. Segredos: as únicas correspondências são as chaves **sintéticas** dos testes (`nvapi-chave-sintetica-de-teste`, `gsk_chave_sintetica`). Trailer `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>` nos três; autor Yan.

## 8. Achados

| ID | Sev. | Achado | Evidência | Sugestão (não aplicada) |
|---|---|---|---|---|
| AG6-1 | S4 | A barreira não pega `import(`…`)` e `require(`…`)` com template **sem** expressão (texto estático em crase), e o config só declara como limite o caminho "montado em execução". | sondas q18/q19 | Selecionar também `TemplateLiteral` sem expressões, ou declarar o limite. |
| AG6-2 | S4 | `coherence.ts` e `nvidia-client.ts` não têm `server-only`; no Live há uma casca com `server-only` (`generate-live-response.ts`), no Score não. A fronteira do servidor depende do ESLint e de `app/app/score/actions.ts` ser `"use server"`. Um import indevido num cliente compilaria; a chave **não** vazaria (`NVIDIA_API_KEY` não é `NEXT_PUBLIC`, vira `undefined`) e a chamada falharia como `not_configured`. | seção 4 | Uma casca `server-only` para o Score, como no Live. |
| AG6-3 | **HYPOTHESIS** (potencial S3 de disponibilidade) | Sem `response_format`, o modelo pode devolver JSON dentro de cercas Markdown ou com texto; o parser faz `JSON.parse` estrito (igual ao do Live). A saída vira `invalid_output` e a tela mostra a mensagem genérica; nada errado é gravado. Taxa real: não medida (sem provedor). | seção 6 | Medir no G2/G3 de Yan; se frequente, tolerar cercas no parser ou usar o modo estruturado da NVIDIA. |
| AG6-4 | S4 / PENDING | O Score agora exige `NVIDIA_API_KEY` (antes `GROQ_API_KEY`) e divide `NVIDIA_MODEL` com o Live. Se o ambiente onde o Score roda não tiver a chave, "Atualizar análise" falha sem aviso específico. | seção 4 e 6 | Confirmar a chave no ambiente (decisão de Yan; não toquei variáveis). |
| AG6-5 | S4 | 4 mutações sobrevivem (UUID redundante, teto de 12 IDs, `slice` de evidências e do objetivo). Inofensivas hoje. | seção 5 | Testes pequenos, se quiser. |
| AG6-6 | S4 / HYPOTHESIS | Segunda tentativa imediata em 429, sem recuo. | seção 4 | Medir no G2. |
| AG6-7 | S4 / HYPOTHESIS | 12 s por tentativa pode ser curto para o modelo NVIDIA; o ADR já registra a dúvida. | ADR §9 | Medir no G2/G4. |

Nenhum S1, S2 ou S3 confirmado. AG5-1 **resolvido** dentro dos limites declarados.

## 9. VERIFIED / HYPOTHESIS / PENDING

- **VERIFIED (por execução, só nestes SHAs):** gates dos três; M1 idêntico ao antigo em 20 cenários e 12 de 12 mutações do cliente mortas; barreira ESLint por sondas; rubrica e esquema intactos (arquivo fora do diff, teste trava versão e `enum`); sem Groq no Score; `lib/groq/**` intacto; as três mutações pedidas mortas (30 de 34 no total); posição do Score na árvore e mensagem sem chave (por leitura do código).
- **HYPOTHESIS:** formato real da resposta do modelo NVIDIA sem `response_format`; latência frente aos 12 s; recuo do SDK do Groq; frequência de `invalid_output` (AG6-3, AG6-6, AG6-7).
- **PENDING:** chamada real (G2), qualidade e taxa de erro (G3), limite de função na Vercel (G4), chave nova só no Preview, Preview e Production, banco. As decisões do ADR e os gates G1–G7 são de Yan.

## 10. Decisões pendentes (de Yan ou do Orquestrador)

1. Integração local dos três SHAs (autorização de Yan; não fiz merge).
2. AG6-2 (casca `server-only` do Score) e AG6-1: tratar no próximo lote do Agente ou aceitar como S4.
3. Confirmar `NVIDIA_API_KEY` no ambiente onde o Score roda e rodar G2/G3 antes de Production.

Nada foi corrigido, aplicado, integrado ou commitado por mim.
