# Relatório de Verificação — Agente NVIDIA — Lote 6 (AG7-2, AG7-3, AG7-4)

- SHAs revisados, um a um (`wt/agente-lote2`, base `b409e7c512671e92021d7ebdf88257d1365ec4b5`, já integrada na `main` local; cada SHA é filho do anterior):
  1. `ef46c80d3d35f70a6ff2bc1fb992e1cdbaac8285` — AG7-2: casca `server-only` do Diário (`structure-evidence-server.ts`; `diario/actions.ts` passa a importá-la).
  2. `d6af7283cdbc413edd45f3d41d46fe5016046cc4` — AG7-3: as três cascas entram na barreira do ESLint.
  3. `6389599a1595d04cb7f2ddbcd38bd1b572fe195c` — AG7-4: testes do corte de 2.000 caracteres e das frases do prompt.
  4. `b5ba5149216ceff1f29359356be43958448a8798` (topo) — só `STATUS.md`.
- Verificador: Persona — Verificação Independente. Data: 09/11/2026. Os relatórios de `b409e7c` e anteriores são histórico e **não** aprovam estes SHAs. Um relatório vale só para o SHA citado.
- Regras cumpridas: sem correção, sem push/merge/banco/chave/provedor real (os testes usam provedor simulado); nada nos worktrees dos escritores; execução só em `verificacao-lote2`, um SHA por vez, builds em sequência com `HEAD` conferido antes e depois, devolvida a `a5a18aa` limpa. Mutações e sondas só em cópias fora do repositório.

## 1. Resumo e gate sugerido por SHA

| SHA | Gate sugerido | Em uma linha |
|---|---|---|
| `ef46c80` (AG7-2) | **liberar para integração local** | Casca de 3 linhas (`import "server-only"` + reexport). Componente cliente que a importa **quebra o `next build`** ("depends on server-only"); sem ele compila. Em `diario/actions.ts` muda **uma linha** (o caminho do import). 105/105. |
| `d6af728` (AG7-3) | **liberar para integração local** | A barreira agora cobre as três cascas: 15 de 15 formas de importação em cliente falham, as 3 ações passam, núcleos e página de servidor falham; controles de esquema passam; lint do repositório inteiro em 0. AG6-1 (S4) segue aberto. 105/105. |
| `6389599` (AG7-4) | **liberar para integração local** | +2 testes (corte em 2.000 e 6 frases do prompt). As 4 mutações que sobreviviam (S8, S13, S14, S15) e os cortes em 1.999/2.001 agora falham; 31 de 33 mutações morrem; sobram 2 inofensivas (X6, X7, S4). 107/107. |
| `b5ba514` (STATUS, topo) | **liberar para integração local** | Só `STATUS.md`; contagens conferem (107 testes; mutações e sondas citadas existem). |

Execução independente, sem `.env`: `next typegen`, `npm test` **105/105, 105/105, 107/107, 107/107** (cancelados 0, ignorados 0), lint (0 avisos), typecheck e build com saída 0 nos quatro; `HEAD` estável antes e depois de cada um. O `b409e7c` também foi reconstruído como base (build 0).

**Sem S1, S2 ou S3 confirmado.** O S3 AG7-1 (textos "Groq") **não é do Agente**: está resolvido no ramo da Interface (`f80de4a`); em `b5ba514` sozinho os cinco textos ainda estão em `diario/[id]/page.tsx` (`git grep`), porque o ramo não contém aquele commit. Para fechar o S3 os dois ramos entram juntos (`git merge-tree 7e33f8f b5ba514` sem conflito; leitura, nada integrado). Três S4 abaixo.

## 2. Escopo do diff (`b409e7c..b5ba514`)

- **VERIFIED:** 5 arquivos, +53/−23: `AGENTES/03_agente_nvidia/STATUS.md`, `app/app/diario/actions.ts` (1 linha), `eslint.config.mjs`, `lib/groq/structure-evidence-server.ts` (novo), `lib/groq/structure-evidence.test.ts`. `structure-evidence.ts`, `evidence-schema.ts`, `nvidia-client.ts`, `nvidia-chat.ts`, `coherence*` e `package.json` **não aparecem**: nenhum esquema, prompt, parâmetro do provedor ou dependência mudou.

## 3. AG7-2 (`ef46c80`): casca server-only do Diário

- **VERIFIED, conteúdo:** `import "server-only"; export { structureEvidence, StructureEvidenceError } from "./structure-evidence.ts";`. É o mesmo molde de `generate-live-response.ts` e `analyze-coherence.ts`. `actions.ts` troca só `@/lib/groq/structure-evidence` por `@/lib/groq/structure-evidence-server`; `StructureEvidenceError` e `structureEvidence` continuam os mesmos símbolos.
- **VERIFIED, efeito (cópia de `apps/web` fora do repositório, `next build` com Turbopack):** com um componente `"use client"` que importa `@/lib/groq/structure-evidence-server`, o build **falha**: "You're importing a module that depends on "server-only"…" com o rastro do componente cliente (Browser e SSR). Com o mesmo componente importando o **núcleo** (`structure-evidence`, sem a trava) o build passa e a rota é gerada. Ou seja, a casca protege no build; o núcleo continua importável sem trava, e quem impede isso é o ESLint (AG7-3). O build do repositório em `ef46c80` passa (saída 0).

## 4. AG7-3 (`d6af728`): cascas na barreira do ESLint

- Mudança em `eslint.config.mjs` (33 linhas): constantes `SERVER_CORE_FILE`, `SERVER_CORE_BARREL`, `SERVER_SHELL_FILE` (`generate-live-response`, `analyze-coherence`, `structure-evidence-server`), helper `restrict(patterns)` que monta `no-restricted-imports` e `no-restricted-syntax` e substitui blocos repetidos; overrides: `score/actions.ts` e `diario/actions.ts` podem importar a sua casca, `live/actions.ts` a do Live; Score e Diário **não** podem importar o núcleo.
- **VERIFIED por sondas** (cópia de `apps/web` com `node_modules` copiado, `eslint --format json`; arquivos de sonda só na cópia):

| Sonda | Esperado | Resultado |
|---|---|---|
| 3 cascas × 5 formas em `"use client"` (`import * as`, `export *`, sufixo `.js`, `import()` literal, `require` literal) | falha | **15 de 15 falham** (`no-restricted-imports` ou `no-restricted-syntax`; `require` também acusa `no-require-imports`) |
| caminho relativo `../../lib/groq/structure-evidence-server` em cliente | falha | falha |
| casca do Diário e `analyze-coherence` importadas de uma página de servidor (`app/probe2/page.tsx`, `page2.tsx`) | falha | **2 de 2 falham**, com a mensagem "importe-a apenas de app/app/live/actions.ts, score/actions.ts ou diario/actions.ts" |
| núcleos em cliente (`coherence`, `nvidia-client`, `structure-evidence`) | falha | **3 de 3 falham** |
| as três `actions.ts` reais | passa | **3 de 3 passam** |
| controles: `evidence-schema`, `coherence-schema` em cliente | passa | **2 de 2 passam** (o esquema é importável) |
| template literal sem expressão: `` import(`@/lib/score/analyze-coherence`) `` | passa (limite declarado) | passa: **AG6-1 segue aberto (S4)** |

- Lint do repositório inteiro em `d6af728`, `6389599` e `b5ba514`: 0 avisos, 0 erros (a barreira não derruba nenhum arquivo real).

## 5. AG7-4 (`6389599`): testes do corte e do prompt

- **VERIFIED:** dois testes novos em `structure-evidence.test.ts`: "o relato é cortado em 2.000 caracteres antes de ir ao provedor" e "o prompt mantém as frases de segurança e de contrato" (6 frases). 105 → 107.
- **Mutações** (cópias fora do repositório, `node --experimental-strip-types --test` sobre `structure-evidence`, `coherence`, `nvidia-client` e `evidence-schema`; 33 mutações):

| Grupo | Mutações | Resultado |
|---|---|---|
| Cerca Markdown do Score (F1 a F8) e do Diário (S1 a S4, S18) | 13 | 13 morrem |
| Parâmetros e contrato (S5 temperatura, S6 tokens, S7 prazo, S9 esquema fora do prompt, S10 a S12, S16 fallback Groq, S17 parse sem validar) | 9 | 9 morrem |
| **Antigas sobreviventes** (S8 sem corte, S13 sem regra `null`, S14 sem `useful=false`, S15 sem "dado não confiável") | 4 | **4 morrem agora** (os testes novos) |
| Novas: corte em 1.999 e 2.001 (X1, X2), sem "Não invente…" (X3), sem "uma sugestão por experiência" (X4), sem "somente JSON" (X5) | 5 | 5 morrem |
| Novas: tirar "Competências devem decorrer de ações descritas…" (X6) ou "Resultado só pode repetir uma consequência explicitamente narrada." (X7) | 2 | **2 sobrevivem** |

- Resultado: **31 de 33 mortas**. X6 e X7 são as duas frases de prompt que o teste das 6 não fixa; mudar essas frases não quebra nada, mas ambas são instruções de não invenção (competência e resultado). **S4**.

## 6. `b5ba514` (STATUS)

- **VERIFIED:** só `STATUS.md`. O bloco "Para a 2ª conversa" e o parágrafo "Lote 6" citam: 107 testes ✓, build em cópia quebra com cliente importando a casca ✓, sondas (5 formas em cliente falham, 3 ações passam, Score/Diário importando o núcleo falham) ✓, "S8, S13, S14, S15 e corte em 1.999 agora falham" ✓. "Fora do escopo: AG7-5/6, M4" confere (regex duplicada e `lib/groq/` do núcleo NVIDIA seguem como estavam).

## 7. Achados

| ID | Sev. | Rótulo | Achado | Recomendação |
|---|---|---|---|---|
| AG8-1 | S4 | VERIFIED | Duas frases de segurança do prompt do Diário (competências, resultado) não são fixadas por teste (X6, X7). | Incluir no teste das frases, em lote futuro. |
| AG6-1 | S4 | VERIFIED (aberto) | `import(` com template literal sem expressão passa pela barreira. | Aceitar ou fechar com `TemplateLiteral`. |
| AG8-2 | S4 | PENDING | O ESLint declara limites (caminho montado em execução, alias novo, componente dentro das pastas liberadas); a casca protege no build, mas só para cliente. Uma ação nova fora das três lista tem de ser incluída na barreira. | Já registrado no `STATUS.md`. |
| AG7-5/6 | S4 | aberto | Regex da cerca duplicada; núcleo NVIDIA ainda em `lib/groq/`. | — |
| AG7-1 | S3 | resolvido na Interface | Textos "Groq" do Diário: corrigidos em `f80de4a` (ramo da Interface); ainda presentes no ramo do Agente isolado. | Integrar os dois ramos juntos. |

## 8. Não verificado / PENDING

- Chamada real à NVIDIA, chave `NVIDIA_API_KEY`, qualidade do JSON do modelo no Diário sem `response_format` estrito (HYPOTHESIS), latência (até ~24 s), taxa real de `invalid_output`, limite de função da Vercel, M4 (Artefatos ainda na Groq), banco, Preview e Production.
- A mensagem de erro do `server-only` foi observada em cópia do `next build` com Turbopack; não testei `webpack` nem o comportamento em Preview.

## 9. Decisão de gate (resumo)

Os quatro SHAs: liberar para integração local. Nenhum bloqueio de gate. Nada foi corrigido, integrado ou commitado por mim.
