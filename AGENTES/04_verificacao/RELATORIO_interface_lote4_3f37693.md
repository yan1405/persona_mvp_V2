# Relatório de Verificação — Interface — Lote 4 (S4 do Lote 3, Evidências, Live)

- SHAs revisados, um a um (`wt/interface-lote2`, base `e0be7e6be2fc39889a0b6598d1d500f1fa1a4561`):
  1. `45a399649c4f30e9ac7b02a445ea87eeda1a7dad` — item 1: IF6-2 (`useId`), IF6-5 (CSS morto), IF6-1 aceito, IF6-3 documentado (3 arquivos).
  2. `ed879071abae773a387e806725c5fad68f0df6e7` — item 2: tela Evidências (biblioteca) na Fundação (4 arquivos).
  3. `3f376937012717a8449730675e0a7ae3372c5cdb` (topo) — item 3: tela Live, índice e sessão (6 arquivos).
- Cada commit é filho direto do anterior. Verificador: Persona — Verificação Independente. Data: 09/11/2026. **Não aprovo visual**: o aceite é de Yan.
- Os relatórios de `e0be7e6` e anteriores são histórico e **não** aprovam estes SHAs. Um relatório vale só para o SHA citado.
- Regras cumpridas: sem correção, sem push/merge, sem chave, `.env` ou chamada externa; nada nos worktrees dos escritores; execução só em `verificacao-lote2`, um SHA por vez, builds em sequência com `HEAD` conferido, devolvida a `a5a18aa` limpa. Mutações e amostras só em cópias fora do repositório.

## 1. Resumo e gate sugerido por SHA

| SHA | Gate sugerido | Em uma linha |
|---|---|---|
| `45a3996` (S4) | **liberar para integração local** | IF6-5 provado: 15 classes sem nenhum uso em `*.tsx`, e nenhuma tela medida mudou (0 diferenças de estilo). IF6-2 provado: `id` únicos e estáveis, o antigo duplicava `id` com dois formulários na tela. |
| `ed87907` (Evidências) | **liberar com ressalvas** | Só apresentação (`ds-surface`, `aria-current`); mesma consulta, filtros, textos e links. 0 rolagens e 0 cortes em 24 larguras × 4 estados. Aceite visual e tela real PENDING. |
| `3f37693` (Live) | **liberar com ressalvas** | Só apresentação e acessibilidade (`useId`, `aria-describedby`, `data-status`). Com texto realista 0 rolagens/cortes/vazamentos; contraste do Live antigo (4 textos a 3,73:1) corrigido. **IF7-1 (S4):** palavra de 70 caracteres seguidos no nome da empresa é cortada em silêncio. Aceite visual e tela real PENDING. |

Respostas diretas: **(a)** nenhuma mudança de lógica, RPC, consulta, validação ou texto em Live e Evidências em relação a `e0be7e6` (seção 3); **(b)** CSS morto realmente sem uso (seção 4); **(c)** `useId` não quebra SSR nem associações (seção 5); **(d)** 0 rolagens horizontais de 360 a 1280 px com texto realista, e o que acontece com palavra única gigante (seção 6); **(e)** sem vazamento de CSS: 0 diferenças de estilo computado e de caixa nas telas legadas e em 302 elementos de um "zoo" (seção 7); **(f)** acessibilidade (seção 8).

Execução independente, sem `.env`, nos três SHAs: `next typegen` 0, `npm test` 32/32 (cancelados 0, ignorados 0), lint 0 (0 avisos), typecheck 0, build 0; `HEAD` conferido antes e depois de cada passo.

## 2. Checagens C1–C6 (por SHA)

| # | Checagem | `45a3996` | `ed87907` | `3f37693` |
|---|---|---|---|---|
| C1 | Escopo (`LOTE-4.md`: `evidencias/**`, `live/**`, `components/**`, `globals.css`, docs, STATUS; item 1 também `diario/diary-forms.tsx` por IF6-2) | OK: `diary-forms.tsx`, `globals.css`, STATUS | OK: `evidencias/page.tsx`, `globals.css`, `FUNDACAO_LOTE2.md`, STATUS | OK: `live/page.tsx`, `live/[id]/page.tsx`, `live/live-forms.tsx`, `globals.css`, `FUNDACAO_LOTE2.md`, STATUS |
| C2 | Proibidos (`actions.ts`, `lib/**`, SQL, `package*.json`, lockfile, `.env`, `supabase/`) | OK (nenhum) | OK | OK |
| C3 | `git diff --check` | 0 linhas | 0 | 0 |
| C4 | Segredos (chave/token/JWT/PEM nas linhas adicionadas) | 0 | 0 | 0 |
| C5 | Commit | autor Yan; trailer `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>` | idem | idem |
| C6 | `STATUS.md` do papel | "pendente de Verificação", sem `VERIFIED` autorrotulado, PENDING declarados | idem | idem; bloco "Para a 2ª conversa" presente |

## 3. Lógica, dados e textos (comparação com `e0be7e6`)

- `git diff e0be7e6 3f37693`: 8 arquivos, `globals.css` +382/−99, nenhum em `actions.ts`, `lib/**`, SQL ou configuração.
- **Evidências:** só `ds-surface` na raiz e `aria-current="page"` nos dois filtros salvos. A consulta (`.from("evidences")…limit(100)`), o filtro em memória, os textos e os links ficam nas linhas **não alteradas**.
- **Live índice:** só `ds-surface`. **Live sessão:** `ds-surface` e `data-status={question.status}` no `<span class="live-question-status">` (uma linha longa do diff; as demais partes dela são idênticas). Nenhum `import`, RPC, `bind` ou `redirect` mudou.
- **`live-forms.tsx` (28 linhas) e `diary-forms.tsx` (19):** só `useId` nos três formulários, `id` dos erros de campo, `aria-describedby` condicional e o `id` do texto de ajuda. Provei por renderização (seção 5): removidos `id`, `for`, `aria-describedby` e `aria-invalid`, o HTML antigo e o novo ficam **idênticos** nos 9 casos, com e sem erros.
- Marcação que muda a árvore de acessibilidade sem mudar texto: `aria-current` nos filtros salvos, `aria-describedby` nos campos e `data-status` (só estilo).
- IF6-1 aceito e IF6-3 documentado: registrados no STATUS e em `FUNDACAO_LOTE2.md` §7 (ver IF7-1 sobre a precisão do texto de IF6-3).

## 4. IF6-5 — CSS morto (item 1)

- As linhas removidas de `globals.css` citam 21 nomes de classe. **14 deixam de existir** no CSS (`metric-label`, `score-home`, `score-home-heading`, `score-hero`, `score-provenance`, `dimension-strip`, `narrative-trace`, `home-workspace`, `home-density`, `next-action`, `narrative-objective`, `compact-list`, `competency-list`, `dense-empty`) e **0 aparecem** em qualquer arquivo de `apps/web` (`git grep -w` em `3f37693`, fora do próprio CSS). A 15ª, `score-empty`, só existia em `.score-hero .score-empty`; o `-w` a achou em `inicio/page.tsx` só como parte de `ds-score-empty` (outra classe, outra regra, mantida).
- As outras 6 (`button-primary`, `eyebrow`, `section-heading-row`, `score-page`, `score-page-heading`, `score-dimensions-detail`) seguem definidas e usadas; só saíram regras compostas sob ancestrais mortos (`.next-action .button-primary`, `.home-density .section-heading-row`…).
- Nenhuma montagem dinâmica de nome (`` `score-${x}` `` etc.): 0 ocorrências de template de classe com esses prefixos em `apps/web`.
- CSS compilado do build, comparado por regra (postcss): 973 → 930 regras; 51 removidas (todas com as classes acima), 8 reentram divididas (`.score-page`, `.score-page-heading`, `.score-dimensions-detail` etc., antes agrupadas com seletores mortos) e 1 "alterada" é só a divisão de um grupo (`.score-page-heading>strong`, mesmas declarações). Diferencial de estilo computado de `base` contra `3f37693` em Score (115 elementos), Artefatos, Diagnóstico, Configurações, Diário `[id]` e Live legado: **0 diferenças**.
- Controle positivo: o Início **antigo** (marcação com as classes removidas) muda em 99 de 146 elementos (cerca de 1.800 propriedades). O detector funciona, e a remoção só afetaria uma marcação que já não existe no app.

## 5. IF6-2 — `useId`: SSR, associação e estabilidade (itens 1 e 3)

Transpilei `diary-forms.tsx` e `live-forms.tsx` (antigo e novo) com TypeScript e renderizei com `react-dom/server` (React 19.2, `actions` simuladas, `useActionState` com e sem erros de campo). Resultado em 9 casos:

- **Antigo duplica `id`:** dois `NewLiveSessionForm` na mesma tela repetem `live-target`, `live-company`, `live-description`; `NewDailyLogForm` + `EditDailyLogForm` repetem `daily-content`, `daily-content-help`, `daily-date`, `daily-context`. **Novo: 0 duplicados** nos mesmos casos.
- Todo `for` tem `id` de destino e todo `aria-describedby` aponta para um `id` existente (0 órfãos), inclusive com os três erros de campo (6 `id`, 3 descrições).
- **Estável:** duas renderizações da mesma árvore dão HTML idêntico; o `id` vem da posição na árvore (`_R_…_`), igual no servidor e no cliente.
- Marcação restante **idêntica** à antiga (ver seção 3).
- Não executei hidratação no navegador (sem tela autenticada nem chave). O contrato do `useId` e o build verde sustentam o resultado; hidratação real fica **HYPOTHESIS** até a tela real.

## 6. Rolagem horizontal, corte e vazamento (CSS real do build)

Método: páginas estáticas com a marcação transcrita dos `page.tsx` e o CSS de `.next/static/chunks` de cada SHA, em `iframe` sem rolagem, 24 larguras (360, 375, 390, 414, 430, 480, 540, 560, 600, 639, 640, 641, 700, 760, 768, 769, 800, 900, 1000, 1024, 1100, 1152, 1200, 1280 px). Medidas: `scrollWidth` contra a janela, descendente além da borda do painel (corte), descendente fora do cartão e `sticky`.

| Conjunto | Casos | Rolagem | Corte | Vazamento |
|---|---|---|---|---|
| Evidências novo (lista, erro, vazio, filtrado), texto extremo | 96 | 0 | 0 | 0 |
| Live índice novo (lista e vazio), texto extremo | 48 | 0 | 0 | 0 |
| Live sessão novo (preparação e área ativa), texto extremo | 48 | 0 | 32 casos (16 larguras × 2 telas), até 312 px | 0 |
| As 4 telas novas (Evidências, índice, preparação, área ativa), **texto realista** | 96 | 0 | 0 | 0 |
| Live sessão antigo (base), texto realista | 48 | 4 casos (2 larguras por tela) | 0 | 0 |

- **Controle positivo:** um elemento de 900 px injetado na sessão a 375 px dá `clipped` 590 com `scrollWidth` 375. Por isso medi o **corte** além da rolagem: nas telas `ds-surface` o excesso não rola, é cortado.
- **Texto extremo (palavra de 136 caracteres no nome da empresa):** Live sessão novo corta até 312 px em 16 de 24 larguras; a base rolava a janela (667 px a 375 px). Varri 62 combinações (31 campos × 375 e 1024 px) com 70 caracteres seguidos: **só** o `eyebrow` do cabeçalho da sessão (nome da empresa, até 120 caracteres no formulário) corta; os demais cortes eram textos fixos do sistema, não dado do usuário. Ver **IF7-1**.
- `sticky` da barra: idêntico à base em Evidências, Live índice e sessão (fixa em 76 px de 767 px para cima; sai de cena a 375 px).
- `container-type: inline-size` (IF6-3) em Live: `ConfirmCloseButton` usa `window.confirm` nativo, e o CSS do Live não tem `position: fixed`, `<dialog>` nem popover; nada fica contido indevidamente.

## 7. Vazamento do CSS novo (`globals.css` +382, −99)

- CSS compilado, passo a passo: `45a3996`→`ed87907` **+36 regras**, `ed87907`→`3f37693` **+91**; 0 removidas e 0 alteradas; **todas** as 127 têm `ds-` no seletor. Os 5 `@container` novos só envolvem regras `.ds-surface`.
- Diferencial de estilo computado e caixa, `base` (`e0be7e6`) contra `3f37693`, mesma marcação **sem** `ds-surface`: Evidências (4 estados), Live índice (2), Live sessão (2) e "zoo" (302 elementos, todas as classes estáticas não-`ds` do app), a 375 e 1024 px: **0 diferenças**. Telas legadas (Artefatos, Score, Diagnóstico, Configurações, Diário `[id]`, Evidências simplificada, Live legado, Diário antigo) a 375/768/1280 px: **0**. Passo a passo (`base→45a3996→ed87907→3f37693`) em 9 telas × 2 larguras × 3 passos = 54 comparações: **0**, inclusive nas telas do Lote 3 (Início e Diário novos).

## 8. Acessibilidade (amostra com o CSS real)

- Contraste (fundo composto, 3 larguras, 5 telas): **0 textos abaixo do mínimo** nas telas novas (a única linha é o bloco de exemplo "coluna alta" da amostra, não do app). No Live **antigo**, 4 textos ficavam a 3,73:1 (`field-help`, rótulos de versão, `live-no-draft`); no novo, 0.
- Alvos: 0 botões, campos e links abaixo de 44 px nas telas novas, **exceto** os 5 `<input type=checkbox>` da escolha de evidências a 20×20 px (abaixo de 24 px do WCAG 2.5.8); a linha inteira é um `<label>`, que é alvo maior. O antigo tinha 6 alvos abaixo de 24 px e dezenas abaixo de 44 px (**IF7-2**, S4).
- Foco: Tab real do teclado em 4 telas (154 paradas: sessão 40, Evidências 39, preparação 40, índice 35): em todas `:focus-visible` e contorno de 2 px `rgb(124,58,237)`; nenhuma sem indicador.
- Estrutura: 1 `<main>`, 1 `<h1>`, 0 saltos de título, 0 `id` duplicado em todas as telas novas. `aria-current="page"` nos filtros salvos e `aria-describedby` válidos (seção 5).

## 9. Achados

| ID | Sev. | Achado | Evidência | Sugestão (não aplicada) |
|---|---|---|---|---|
| IF7-1 | **S4** | O texto de IF6-3 no STATUS diz que, em `.app-content` (`overflow: clip`, sem `min-width: 0`), "conteúdo largo faz a janela rolar em vez de cortar". Nas telas `ds-surface` isso **não vale**: o `container-type: inline-size` do `<main>` zera a largura intrínseca e o excesso é **cortado em silêncio**. Caso real: `.live-session-header .eyebrow` (nome da empresa, até 120 caracteres, sem `overflow-wrap`) com 70 caracteres seguidos corta 297 px a 375 px (20 px a 768 px); a base rolava a janela (667 px). | seção 6; controle positivo | `overflow-wrap: anywhere` no `eyebrow` desse cabeçalho e corrigir a frase do STATUS. Entrada rara (nome sem espaço); o nome aparece inteiro na lista e no título. |
| IF7-2 | S4 | 5 checkboxes de evidência a 20×20 px (< 24 px). O `<label>` envolve a linha, então o alvo efetivo é maior. Melhorou frente ao antigo (6). | seção 8 | Aceitar ou subir para 24 px no próximo lote visual. |
| IF6-1 | S4 | Aceito (registrado). | STATUS | — |
| IF6-3 | S4 | Documentado; ver IF7-1 para a imprecisão. | STATUS, `FUNDACAO_LOTE2.md` | — |
| IF6-4 / IF3-2 | S4 | Causa não tratada (barra lateral só `sticky` na vertical), declarada no STATUS; não aparece nas telas medidas. | STATUS | Fora deste lote. |

Nenhum S1, S2 ou S3. IF6-2 e IF6-5 **resolvidos** (provados). Os S4 acima não bloqueiam.

## 10. VERIFIED / HYPOTHESIS / PENDING

- **VERIFIED (por execução, só nestes SHAs):** gates dos três SHAs; escopo, `diff --check`, segredos e trailers; lógica e textos intactos; CSS morto sem uso; `useId` (SSR, associações, estabilidade, 0 duplicados); 0 rolagens e 0 vazamentos em 288 casos novos e 0 cortes com texto realista (96 casos; texto extremo: IF7-1); 0 diferenças de estilo nas telas legadas e no zoo; `sticky` igual; contraste, foco real por teclado e alvos.
- **HYPOTHESIS:** hidratação no navegador; comportamento com dados reais (comprimentos, quantidade de sessões e evidências); IF7-1 só com nome de empresa sem espaço.
- **PENDING:** tela real autenticada (a amostra transcreve a marcação e usa o CSS real do build), leitor de tela, Safari/VoiceOver, aceite visual de Yan (`AGENTS.md` §6.1), Preview e Production.

## 11. Decisões pendentes (de Yan ou do Orquestrador)

1. Aceite visual de Evidências e Live (e de Início/Diário do Lote 3, ainda pendente).
2. Tratar IF7-1 e IF7-2 no próximo lote de Interface ou aceitar como S4.
3. Integração local dos três SHAs (autorização de Yan; não fiz merge).

Nada foi corrigido, aplicado, integrado ou commitado por mim.
