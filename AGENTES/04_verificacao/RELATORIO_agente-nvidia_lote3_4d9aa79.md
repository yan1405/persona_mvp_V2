# Relatório de Verificação — Agente NVIDIA — Lote 3 (AG2-3/AG3-1/AG4-2, parser do Live, ADR)

- SHAs revisados, um a um (`wt/agente-lote2`, base `ae00dd49d741a0bc4149abfad86b19118450f494`):
  1. `b7b21a49057e143ccf259dde678cd3949b0f8b3c` — AG2-3 (regra no ESLint), AG3-1 (`--test-timeout`), AG4-2 (registro no STATUS) (3 arquivos).
  2. `952ec70b65b2793e07f06c22909073e42e08bb71` — parser do Live A-1/A-7/L-1 (`response-schema.ts` +31/−, 73 linhas de teste, contrato; 5 arquivos).
  3. `4d9aa79f6608730a34100d7d1302d152524b6ec8` (topo) — `ADR_NVIDIA_UNICO.md` (2 arquivos, só documento).
- Cada commit é filho direto do anterior. Verificador: Persona — Verificação Independente. Data: 08/11/2026.
- Os relatórios de `ae00dd4` e anteriores são histórico e **não** aprovam estes SHAs.
- Regras: sem correção, sem push/merge, sem chave, `.env` ou chamada a provedor; nada nos worktrees dos escritores; execução só em `verificacao-lote2` (um SHA por vez, builds em sequência, `HEAD` conferido) e **mutações em cópias fora do repositório**; verificação devolvida a `a5a18aa`, limpa.

## 1. Resumo e gate sugerido por SHA

| SHA | Gate sugerido | Em uma linha |
|---|---|---|
| `b7b21a4` (AG2-3, AG3-1, AG4-2) | **liberar para integração local** (ressalva S4: AG5-1) | A regra falha o lint para import estático do núcleo NVIDIA em componente cliente (alias, relativo, `.ts`, `export … from`, `import type`) e não quebra `node --test` (76/76). Não pega `import()` dinâmico, `require`, sufixo `.js`, import por "barril" dentro de `lib/live` nem cliente dentro de `lib/live`. O `--test-timeout=60000` derruba um teste pendurado em 61 s (antes: travava). |
| `952ec70` (parser) | **liberar com ressalvas** | A-1 e A-7 **fechados**: os testes novos falham 5/6 contra o parser antigo e passam 6/6 no novo. O novo parser só aceita **menos** respostas que o antigo, nunca mais. L-1 **parcialmente** resolvido (8 das 9 frases do meu achado agora passam); resta falso positivo quando a negação não está separada por vírgula ou ponto (AG5-2, S3). Frequência real PENDING (exige evidências reais e modelo real). |
| `4d9aa79` (ADR) | **liberar** (documento) | Inventário **completo** contra `git grep` de Groq/LLM em `apps/web` (5 usos, 16 arquivos explicados), parâmetros conferidos um a um no código, nenhuma mudança de código. Só imprecisões S4 (AG5-5). |

Execução independente, sem `.env` (typegen 0, lint 0 sem avisos, typecheck 0, build 0 nos três): `npm test` **76/76** em `b7b21a4`, **82/82** em `952ec70` e em `4d9aa79` (cancelados 0, ignorados 0; suíte em 1,2–1,9 s, longe do limite de 60 s).

## 2. Checagens C1–C6 (por SHA)

| # | Checagem | `b7b21a4` | `952ec70` | `4d9aa79` |
|---|---|---|---|---|
| C1 | Escopo (`LOTE-3.md`) | OK: `eslint.config.mjs` (só o AG2-3), `package.json` (só `scripts.test`), STATUS | OK: `response-schema.ts` e `.test.ts` **só neste item**, `package.json` (só `scripts.test`: acrescenta o teste novo), `CONTRATO_AGENTE.md`, STATUS | OK: `docs/redesign/agent/ADR_NVIDIA_UNICO.md`, STATUS |
| C2 | Proibidos (`app/**`, SQL, lockfile, `.env`) | OK | OK | OK |
| C3 | `git diff --check` | OK | OK | OK |
| C4 | Segredos (padrões nas linhas adicionadas) | OK | OK | OK |
| C5 | Commit | autor Yan; trailer `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>` nos três | idem | idem |
| C6 | `STATUS.md` do papel | OK: declara os limites da regra e lista os arquivos (AG4-2) | OK: limites do parser declarados | OK: "PROPOSTO", `PENDING` nos gates G0–G7 |

## 3. Item 1 — AG2-3, AG3-1, AG4-2 (`b7b21a4`)

**AG2-3 por mutação.** Cópia de `apps/web` do SHA fora do repositório (com `node_modules` copiado), arquivos-sonda e `eslint` direto. Linha de base: `eslint` no projeto inteiro sai 0. A regra: `no-restricted-imports` com `patterns[].regex = (^|/)(nvidia-chat|generate-version)(\.ts)?$`, desligada em `lib/live/**` e `app/app/live/actions.ts`.

| Sonda (componente `"use client"` em `components/`, salvo quando indicado) | Falha o lint? |
|---|---|
| `import … from "@/lib/live/nvidia-chat"` | **sim** (mensagem própria: "Núcleo do Live é só de servidor…") |
| import relativo `../../lib/live/nvidia-chat` | **sim** |
| `@/lib/live/generate-version` | **sim** |
| `@/lib/live/nvidia-chat.ts` (com extensão) | **sim** |
| `export { … } from "@/lib/live/nvidia-chat"` | **sim** |
| `import type { … } from …/nvidia-chat` | **sim** (tipo também é barrado) |
| `lib/other/nvidia-chat.ts` (homônimo fora de `lib/live`) | sim — falso positivo inofensivo |
| `app/app/live/<outro>.ts` (servidor fora da lista) | sim — por desenho |
| `import("@/lib/live/nvidia-chat")` **dinâmico** | **não** |
| `require("@/lib/live/nvidia-chat")` | **não** |
| `…/nvidia-chat.js` | **não** |
| cliente → `lib/live/barril.ts` (`export * from "./nvidia-chat.ts"`) | **não** (a regra vigia a aresta, não o grafo) |
| cliente **dentro** de `lib/live/` | **não** (limite já declarado pelo escritor, junto com "não detecta `use client`") |
| cliente → casca `generate-live-response` | não pela regra; barrado em build por `import "server-only"` (a casca o tem) |

Conclusão: o **caso principal** (import estático) é barrado e a regra não quebra o `node --test` (a regra só atua no `eslint`; `npm test` 76/76). Limites além dos declarados em **AG5-1**. Efeito real de um import cliente escapar: o bundle do navegador não recebe `NVIDIA_API_KEY` (variável sem prefixo `NEXT_PUBLIC_`), a geração falharia com `not_configured`; não é vazamento de chave.

**AG3-1.** `scripts.test` agora tem `--test-timeout=60000`. Teste pendurado (`new Promise(() => {})`) em cópia: terminou em **61 s** com saída 1 ("test timed out after 60000ms"). A suíte real leva 1,2–1,9 s.

**AG4-2.** O STATUS lista `nvidia-chat.ts`, `nvidia-chat.test.ts`, `generate-version.ts`, `generate-version.test.ts`, `generate-live-response.ts` (casca) e `COMPARACAO_LIVE_GROQ_NVIDIA.md`; todos existem no SHA. **Resolvido.**

Observação S4 (AG5-1): no JS, `"\."` dentro de uma string vira `.`; a regex efetiva é `(.ts)?`. Sem efeito prático (casa o mesmo), mas o escape não vale.

## 4. Item 2 — parser do Live (`952ec70`)

### 4.1 Testes novos contra o parser antigo e o novo
Os 6 testes de `response-schema.test.ts` (executados em cópia, com o `response-schema.ts` de `b7b21a4` e o de `952ec70`):

| Parser | Aprovados | Reprovados |
|---|---:|---:|
| **antigo** (`b7b21a4`) | 1 | **5** (A-1, A-7 número/palavra, A-7 negação, A-7 competências, "limites conhecidos") |
| **novo** (`952ec70`) | **6** | 0 |

O único teste que passa no antigo é o L-1 de frases fiéis (o antigo aceitava tudo). **Falham antes, passam depois.**

### 4.2 Mutação do parser novo (cópia fora do repositório, 14 mutações)
12 mutações de comportamento são **pegas** pelos testes: sem exigir letra/dígito; sem fronteira inicial; sem fronteira final; sem regra de `30%`/`1,5`; sem regra de `1.000 → 000`; sem negação; sem `nunca`; sem normalização de acento; competências juntas; vírgula não encerra oração; quebra de linha não encerra; `;` e `:` não encerram. **2 sobrevivem** (6/0): (a) remover a isenção "negador dentro do excerto" (`|| NEGATOR.test(fold(excerpt))`); (b) olhar só a primeira ocorrência do excerto (`start = -1`). Duas mutações de `sed` não se aplicaram (escape) e foram refeitas em Python, junto com a de `;`/`:`; as 3 foram pegas. → **AG5-3 (S4)**.

### 4.3 O que muda para o usuário final (Persona Live), em linguagem simples
O Live escreve o rascunho de resposta com **trechos citados** das evidências do usuário. Antes, a checagem era só "esse trecho existe em algum lugar do texto?" — passava um trecho vazio, uma letra solta, meia palavra, um número cortado ou uma frase sem o "não" que a antecedia. Agora:
1. **Trecho vazio ou só pontuação** (`""`, espaços, `...`, caracteres invisíveis) → a resposta inteira é recusada.
2. **Não pode cortar palavra nem número:** "30%" citado como "3", "1.000" como "1" ou "000", "manual" como "man" → recusada.
3. **Não pode tirar a negação** que vem antes na mesma oração: de "Não reduzi o custo" citar "reduzi o custo" → recusada. O fim da oração é `. , ; : ! ?` ou quebra de linha (ponto e vírgula entre números não contam).
4. **Competências** são comparadas uma a uma (não dá mais para "emendar" duas).
Quando recusa, o usuário vê "Não foi possível gerar com segurança. A pergunta foi preservada." (na primeira geração a pergunta também fica marcada como falha e pode ser refeita). **O que o usuário nunca passa a ver:** o conjunto de respostas aceitas só **diminui** — o novo exige o mesmo "o trecho existe no texto" do antigo (por construção, `indexOf` sobre o texto em minúsculas) e acrescenta condições. Resposta nova nunca é aceita.

### 4.4 Regressão em respostas válidas (corpus sintético meu, **não** é medição de produção)
61 pares fonte/excerto, antigo × novo:

| Classe | N | Aceitos (antigo) | Aceitos (novo) |
|---|---:|---:|---:|
| Fiéis, **sem** negador antes do trecho (valores com `R$ 1.500,00`, `10,5%`, `v2.0`, `9h30`, data, hífen, aspas, parênteses, `Sr.`, `S.A.`, lista numerada, URL, maiúsculas, acento…) | 23 | 23 | **23** |
| Fiéis **com** negador antes (classe L-1) | 15 | 15 | **10** |
| Distorções que devem ser recusadas | 23 | 22 | 7 |

- **Sem regressão** nas 23 respostas válidas sem negação anterior (inclui números, decimais, moeda, versões, datas e siglas).
- **Falsos positivos (5 de 15)**, todos de negação sem vírgula/ponto entre ela e o trecho: "Não conhecia a ferramenta **e** aprendi em duas semanas" → "aprendi em duas semanas"; "Assumi a gestão **sem** treinamento formal **e** entreguei no prazo"; "Mesmo **sem** experiência prévia com Python eu liderei a automação"; "**Nunca** perdi um prazo e entreguei 12 relatórios" (limite declarado); "Não lancei a versão v2.0 pelo cliente Acme" (ponto entre dígitos, limite declarado). As outras 10, incluindo as de vírgula, quebra de linha, `;` e ponto final, passam.
- **Contra o meu achado L-1 (`42dbddf`)**: das 9 frases citadas no relatório, **8 passam** (a 9ª, "Nunca perdi um prazo…", é o limite declarado). O corpus original de 12 não foi reexecutado (não o tenho mais); a comparação vale para as 9 frases.
- **Distorções que ainda passam (7 de 23)**: 3 de negação por sinônimo ("Falhei em liderar a equipe" → "liderar a equipe"; "Nada do que fiz reduziu o custo"; "Fui incapaz de liderar") — **limite declarado** (negação léxica); 1 de **isenção** (de "Não liderei o projeto Alfa e não aprendi nada" citar "projeto Alfa e não aprendi": como o excerto contém "não", a checagem é dispensada); 2 de **excerto trivial** ("a", "de"); 1 caso fraco do meu corpus ("Ninguém me ensinou, liderei sozinho…", que não é distorção clara).

## 5. Item 3 — ADR "NVIDIA único" (`4d9aa79`)

- **Só documento:** 2 arquivos (`ADR_NVIDIA_UNICO.md`, STATUS); `git diff --stat 952ec70 4d9aa79` sem código.
- **Inventário contra `git grep`** (padrões: groq, nvidia, openai, anthropic, llm, `chat/completions`, `gpt-`, `glm-`, gemini, mistral, llama, huggingface, ollama, embedding; `apps/web` sem o lockfile, e o resto do repositório fora de `docs/`, `AGENTES/` e `*.md`): 16 arquivos em `apps/web` e **0 fora dele**. Todos explicados: **5 usos** (Live, Diário/estruturar evidência, Score/coerência, Artefatos, Agente sem chamador) + `groq-sdk` (`package.json`, só 3 módulos o importam), `.env.example`, `diario/actions.ts`, `artefatos/actions.ts`, `diario/[id]/page.tsx` (5 textos "Groq"), testes (`groq/evidence-schema.test.ts`, `nvidia-chat.test.ts`, `generate-version.test.ts`) e o `eslint.config.mjs` (a regra do AG2-3). Nenhum uso de LLM fora do inventário; nenhuma outra chamada a provedor de IA.
- **Parâmetros conferidos no código do SHA** (todos conferem): modelos (`z-ai/glm-5.3-flash`; `openai/gpt-oss-20b` ×3), temperaturas 0,5 / 0,1 / 0,1 / 0,1, saída máxima 1.024 / 1.400 / 1.600 / 2.400, tempos 15 / 12 / 12 / 15 s, `maxRetries: 1` nos três Groq, 2 tentativas sem pausa no Live (429, 5xx, rede), repetição em `json_validate_failed` nos Artefatos, versões `persona-live-nvidia-v1`, `persona-artifacts-v1`, `coherence-v1`, `persona-agent-readonly-v1`, códigos de erro, chamadores e linhas (`diario/actions.ts:210`, `score/actions.ts:22`, `artefatos/actions.ts:56` e `:99`, `live/actions.ts:77`), `GROQ_MODEL` único, `model`/`prompt_version` gravados (`finish_live_question`, versões de Artefato; Score grava `rubric_version`), 12 testes do adaptador, sem `maxDuration` no repositório, o caso de 90 s (STATUS do Orquestrador).
- Plano M0–M6 e gates G0–G7: coerentes com o código e com o limite de papéis; `PENDING` bem declarado (chave, chamada real, qualidade, limite de duração, privacidade). Sem decisão tomada em nome de Yan.
- Imprecisões **S4 (AG5-5)**: (i) cita a branch `lote2-agente`, que não existe (a real é `wt/agente-lote2`); (ii) atribui a aprovação de `glm-5.3-flash` de 28/10 ao "STATUS do Agente", mas a evidência está em `docs/reviews/2026-10-28-persona-live-nvidia.md` e no STATUS do Orquestrador; (iii) M6 não menciona que `scripts.test` do `package.json` lista `lib/groq/evidence-schema.test.ts` e precisará ser ajustado ao remover/renomear `lib/groq/**`.

## 6. Achados

| ID | Sev. | Estado | Descrição |
|---|---|---|---|
| AG2-3 | S4 | **resolvido para o caso principal** | import estático do núcleo NVIDIA por código cliente falha o lint, sem quebrar `node --test`. Limites em AG5-1. |
| AG3-1 | S4 | **resolvido** | `--test-timeout=60000`: teste pendurado cai em 61 s, saída 1. |
| AG4-2 | S4 | **resolvido** | arquivos novos registrados no STATUS. |
| A-1, A-7 | S2 | **resolvidos** (parser) | testes novos 5/6 vermelhos no antigo e 6/6 verdes no novo; 12 de 14 mutações pegas. |
| L-1 | S2 | **reduzido a S3 (AG5-2)** | 8 das 9 frases do achado original passam; evidência: seção 4.4. |
| **AG5-1** | S4 | VERIFIED | a regra do AG2-3 vigia só a aresta estática: não pega `import()`, `require`, sufixo `.js`, "barril" dentro de `lib/live`, cliente dentro de `lib/live` (os dois últimos, o último declarado). A escape de `\.` na string do regex se perde. Efeito real: geração falharia por falta de chave no navegador, sem vazar chave. |
| **AG5-2** | S3 | VERIFIED (corpus sintético) / HYPOTHESIS (frequência real) | falso positivo quando a negação não está separada por `. , ; : ! ?` ou quebra de linha: "Não conhecia… e aprendi…", "sem treinamento formal e entreguei…", "Mesmo sem experiência … eu liderei…" (5 de 15). Falha fechada (`invalid_output`); o usuário vê a mensagem de falha e pode refazer. Taxa real depende de evidências reais e modelo real: PENDING. |
| **AG5-3** | S4 | VERIFIED | 2 de 14 comportamentos do parser não são fixados por teste: isenção "negador dentro do excerto" e a varredura de todas as ocorrências. A isenção também permite o desvio "projeto Alfa e não aprendi" (sem o "Não liderei o"). |
| **AG5-4** | S4 | VERIFIED | excerto de uma letra ou preposição ("a", "de") passa (`HAS_CONTENT` só exige letra ou dígito); sinônimos de negação ("falhei em", "nada", "incapaz") passam (limite léxico declarado). |
| **AG5-5** | S4 | VERIFIED por leitura | imprecisões do ADR (seção 5): branch inexistente, fonte da aprovação de 28/10, `scripts.test` em M6. |

Nenhuma severidade foi reduzida sem evidência; L-1 sai de S2 por medição nas 9 frases do achado original.

## 7. VERIFIED / HYPOTHESIS / PENDING

| Estado | Itens |
|---|---|
| VERIFIED | C1–C6 nos três SHAs; typegen/test (76, 82, 82)/lint/typecheck/build 0; sondas do AG2-3; `--test-timeout` em cópia; parser: testes antes/depois, 14 mutações, corpus de 61 pares, "só aceita menos"; ADR: inventário contra `git grep` e parâmetros contra o código |
| HYPOTHESIS | frequência real de AG5-2 e de `invalid_output`; impacto de AG5-4 no rascunho; o corpus é sintético e meu |
| PENDING | chamada real à NVIDIA, chave, latência, qualidade em português nas outras tarefas, limite de duração na Vercel, política de privacidade, aceite do ADR (G0) e demais gates G1–G7 (todos de Yan) |

## 8. Decisões pendentes

Orquestrador/Yan: integrar `b7b21a4` e o ADR sem ressalva de risco; integrar `952ec70` **aceitando por escrito o AG5-2** (S3) e **medindo** com evidências reais antes de Production (a regra "aceita só menos" garante que não há resposta indevida nova; o custo é disponibilidade); decidir se o AG5-1 (S4) pede um ajuste curto (ex.: também `ImportExpression`/`require`) ou fica documentado. Yan: aceitar o ADR (G0) e os gates G1–G7.
