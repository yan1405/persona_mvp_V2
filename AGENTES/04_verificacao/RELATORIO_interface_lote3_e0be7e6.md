# Relatório de Verificação — Interface — Lote 3 (IF2-3/IF3-2, Início, Diário)

- SHAs revisados, um a um (`wt/interface-lote2`, base `a5a18aae940134385f9cd0e5c04586e957874e0f`):
  1. `a15ed1b650371e9f798c02dd9d81815237f3fec1` — IF2-3 (`<main>` em Configurações) e IF3-2 declarado "não reproduz" (2 arquivos).
  2. `4f2190768b5001117e965c9fce3f1b3b60338059` — tela Início (4 arquivos, +306 linhas de CSS).
  3. `e0be7e6be2fc39889a0b6598d1d500f1fa1a4561` (topo) — tela Diário (5 arquivos; `globals.css` +409 no total, 0 linhas removidas).
- Cada commit é filho direto do anterior. Verificador: Persona — Verificação Independente. Data: 08/11/2026. **Não aprovo visual**: o aceite é de Yan.
- Os relatórios de `a5a18aa` e anteriores são histórico e **não** aprovam estes SHAs.
- Regras: sem correção, sem push/merge, sem chave, `.env` ou chamada externa; nada nos worktrees dos escritores; execução só em `verificacao-lote2`, um SHA por vez, builds em sequência com `HEAD` conferido, devolvida a `a5a18aa` limpa.

## 1. Resumo e gate sugerido por SHA

| SHA | Gate sugerido | Em uma linha |
|---|---|---|
| `a15ed1b` (IF2-3, IF3-2) | **liberar para integração local** | Só troca `<section>` por `<main>` no layout de Configurações; um único `<main>` por rota; IF3-2 só reproduz se uma tela já transborda na horizontal (ver IF6-4). |
| `4f21907` (Início) | **liberar com ressalvas** | Só apresentação: mesmos dados, consulta e textos (um texto passou de `aria-label` a título visível, IF6-1); 0 rolagens/cortes/vazamentos em 96 casos; telas não migradas intactas (0 diferenças de estilo). Aceite visual e tela real PENDING. |
| `e0be7e6` (Diário) | **liberar com ressalvas** | Só apresentação e uma associação de acessibilidade (`aria-describedby`); 0 rolagens/cortes/vazamentos em 48 casos; o Diário antigo transbordava a 375 px e agora não. IF6-2 e IF6-3 (S4) para o próximo lote. Aceite visual e tela real PENDING. |

Resposta direta às perguntas do congelamento: **(a)** nenhuma mudança de lógica, RPC, consulta, validação ou mensagem em Início, Diário e Configurações em relação a `a5a18aa` (seção 3); **(b)** 0 rolagens horizontais de 375 a 1280 px nas telas tocadas **e** nas não tocadas, medido com o CSS real do build (seção 4); **(c)** sem vazamento dos 409 CSS novos para telas não migradas: 0 diferenças de estilo computado e de caixa em 8 páginas e num "zoo" com as 252 combinações de classe legadas do app (seção 5); **(d)** acessibilidade conforme a seção 6; **(e)** IF3-2 não reproduz nas telas tocadas, mas reproduzi o defeito na base com o Início antigo (seção 7).

Execução independente, sem `.env`: nos três SHAs `next typegen` 0, `npm test` 32/32 (cancelados 0, ignorados 0), lint 0 (sem avisos), typecheck 0, build 0.

## 2. Checagens C1–C6 (por SHA)

| # | Checagem | `a15ed1b` | `4f21907` | `e0be7e6` |
|---|---|---|---|---|
| C1 | Escopo (`LOTE-3.md`) | OK: `configuracoes/layout.tsx`, STATUS | OK: `inicio/page.tsx`, `globals.css`, `FUNDACAO_LOTE2.md`, STATUS | OK: `diario/page.tsx`, `diary-forms.tsx` (só marcação), `globals.css`, `FUNDACAO_LOTE2.md`, STATUS |
| C2 | Proibidos (`actions.ts`, `lib/**`, RPC, `package*.json`, lockfile, `.env`) | OK | OK | OK |
| C3 | `git diff --check` | OK (0 linhas) | OK | OK |
| C4 | Segredos (padrões de chave/token/JWT/PEM nas linhas adicionadas dos três commits) | OK | OK | OK |
| C5 | Commit | autor Yan; trailer `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>` presente nos três | idem | idem |
| C6 | `STATUS.md` do papel | OK: "pendente de Verificação", "Autorrótulo `VERIFIED` não usado", HYPOTHESIS/PENDING declarados | OK | OK |

## 3. Lógica, dados e textos (comparação com `a5a18aa`)

- `git diff --name-only a5a18aa e0be7e6`: 7 arquivos, nenhum em `actions.ts`, `lib/**`, SQL ou configuração. As consultas e o cálculo do Início (`getNarrativeScoreData`, `next`, `competencies`) e do Diário (filtros, `latestState`, `summary`) estão nas linhas **não alteradas** dos arquivos.
- Textos: extraí todas as cadeias de caracteres de `inicio/page.tsx` e `diario/page.tsx` nas duas versões e comparei. **Início:** só sumiu `"Rastreabilidade do Score"` como `aria-label` e entrou o mesmo texto como título visível `<h2>`; o resto são classes e atributos (`active/done/locked`, `group`, `step`). **Diário:** nenhum texto mudou (só a classe `ds-surface` e `aria-current="step"`). **Configurações:** nenhum texto mudou.
- Marcação nova que **muda a árvore de acessibilidade, sem mudar texto**: `ol`/`li` na rastreabilidade e no fluxo do Diário, `dl` nas dimensões, `h2` nos blocos, `aria-describedby` no editor. A derivação `activeStep` do Início é só visual (`data-state`/`aria-current`), sem efeito em dados.
- IF2-3: o único `<main>` em `app/app/configuracoes/**` está no `layout.tsx`; `conta/page.tsx` e `dados/page.tsx` usam `<section>`; `AppShell` não renderiza `<main>`. **Um `<main>` por rota.** Nenhuma regra de CSS depende da tag (`.settings-page` por classe).

## 4. Rolagem horizontal, corte e vazamento (CSS real do build)

Método: `npm run build` de cada SHA (CSS gerado em `.next/static`), páginas-harness estáticas fora do repositório com a casca real e a marcação **transcrita do `page.tsx`** de cada SHA (Início com e sem Score, com texto longo e palavra sem quebra de 136 caracteres, aviso, rastreabilidade completa; Diário com 5 registros, os 4 estados, contexto longo, URL sem quebra, aviso, erros de formulário e estado vazio de filtro), servidas por `python -I -m http.server` em 127.0.0.1 e medidas dentro de `iframe` com `scrolling=no`. 24 larguras: 375, 390, 414, 440, 560, 600, 639, 640, 660, 672, 700, 760, 768, 780, 799, 800, 900, 1000, 1023, 1024, 1100, 1230, 1279, 1280. Medidas: `scrollWidth > innerWidth`, conteúdo além da borda do painel, descendente além da borda do cartão, barra lateral `sticky`, reticências.

| Conjunto | SHA/CSS | Casos | Rolam | Cortam | Vazam do cartão |
|---|---|---:|---:|---:|---:|
| Início novo (4 variantes) | `e0be7e6` | 96 | **0** | 0 | 0 |
| Diário novo (cheio e vazio) | `e0be7e6` | 48 | **0** | 0 | 0 |
| Início novo | `4f21907` (CSS do Início) | 24 | 0 | 0 | 0 |
| Diário **antigo** (a marcação do Diário só muda no 3º SHA) com o CSS do 2º SHA | `4f21907` | 24 | 1 (375 px, 384 px) | 0 | 0 |
| Telas não migradas (Artefatos, Live, Score, Diagnóstico, Evidências, Configurações, Diário `[id]`) | `e0be7e6` | 168 | 7 (todos idênticos na base) | 0 | 0 |
| Mesmas telas | base `a5a18aa` | 168 | 7 | 0 | 0 |
| Início e Diário **antigos** | base `a5a18aa` | 120 | 21 | 6 | 0 |

- As **7 ocorrências nas telas não migradas** (1 px a 375 px em cinco telas; a minha amostra de Evidências, 400 px a 375/390) são **idênticas nas duas versões em 168/168 larguras** (`scrollWidth` igual base × `e0be7e6`): vêm da grade sintética de 280 px da amostra e do meu palpite de marcação de Evidências, não do Lote 3.
- Base `a5a18aa` com a marcação **antiga**: o Início antigo transborda em 19 de 72 casos (17 com o texto adversarial, palavra sem quebra de 136 caracteres: documento de 792 a 916 px; 2 de 1 px a 375 px) e o Diário antigo, a 375 px, em 2 de 48 (384 px). Com a marcação nova, **0**. É uma melhora medida com conteúdo adversarial, não uma frequência real.
- Barra lateral/trilho: `sticky` com `top` 16 px (≥ 640 px) e barra superior em 8 px (< 640 px) em todos os casos; a aside de teste (`artifact-editor-aside`) segue a regra legada (`top: 76 px` de 768 px para cima, estática abaixo) **igual à base**.
- Reticências do resumo do Diário (`.diary-list p`): 5/5 truncados com o texto de 2 × 180 caracteres, como antes.

## 5. Vazamento do CSS novo (`globals.css` +409, −0)

- Estático: 129 seletores nos blocos adicionados (analisados com um parser de blocos próprio, `python -I`); **129/129 contêm `ds-`** (`.ds-surface …`, `.ds-home …`, `.ds-*`); 0 seletores sem `ds-`; 6 at-rules (`@media`/`@container`). O `.app-content:has(.ds-surface)` já existia na base. O container (`container-type: inline-size`) só é declarado em `.ds-surface`.
- Dinâmico (diferença de **estilo computado de todas as propriedades e da caixa** de cada elemento, base × SHA, em 5 larguras para `e0be7e6` — 375, 640, 800, 1100, 1280 — e em 3 para `4f21907` — 375, 800, 1280): Artefatos, Live, Score, Diagnóstico, Evidências, Configurações, Diário `[id]` e um "zoo" com **uma `div` para cada uma das 252 cadeias de `className` do app que não contêm `ds-`** (302 elementos): **0 diferenças** com o CSS de `4f21907` e com o de `e0be7e6`. O Diário **antigo** (sem `ds-surface`) sob o CSS novo: 0/145. Controles positivos (o método detecta diferença): Início novo base × `e0be7e6` 106/153 elementos; Diário novo 98/145. Início novo `4f21907` × `e0be7e6`: 0 (o commit do Diário não altera o Início).
- Conclusão: **nenhum vazamento de seletor** detectado; os 409 acréscimos só atuam sob `.ds-surface`.

## 6. Acessibilidade

- Foco por **teclado real** (Tab no painel do navegador, `:focus-visible` verdadeiro): anel de 2 px sólido, `rgb(124, 58, 237)` sobre o painel claro (botão secundário, link, textarea, campo de contexto, botão "Salvar registro") e `rgb(196, 181, 253)` no botão "Continuar" sobre o bloco focal escuro; `aria-describedby="daily-content-help"` presente e o alvo existe.
- Contraste calculado no navegador (cor computada × fundo efetivo, WCAG): em Início e Diário **nenhum par de texto abaixo de 4,5:1** (a única falha é o enchimento "coluna alta" da minha amostra); placeholder e texto de ajuda `rgb(109, 91, 166)` = 5,68:1; borda de campo `rgb(136, 130, 145)` ≈ 3,7:1 (não-texto, mínimo 3:1).
- Alvos: nenhum `button`, `input`, `select` ou `textarea` com altura < 44 px; nenhum alvo interativo de bloco < 24 px.
- Estrutura nas páginas transcritas: 1 `<main>` e 1 `<h1>` por página, **0 saltos de nível de título, 0 IDs duplicados**, listas reais (`ol`/`dl`).
- Observação (S4, HYPOTHESIS): o ícone do seletor de data fica com foco interno sem anel no campo hospedeiro (`:focus` falso, `:focus-within` verdadeiro) no Chrome; é comportamento do navegador, igual nas telas legadas. Safari/VoiceOver não testado: 19 regras `list-style: none` no CSS podem remover a semântica de lista (comportamento conhecido do WebKit; sem `role="list"`).

## 7. IF3-2 "não reproduz"

O defeito é consequência de rolagem lateral: a barra lateral é `sticky` só na vertical. Na **base** reproduzi: Início antigo com palavra sem quebra a 800 px → documento de 916 px, ao rolar 116 px o trilho fica em `left: -100 px` (**fora da tela**). Nas telas migradas (e nas demais da amostra) a rolagem lateral **não ocorre**, então o defeito **não aparece**; o escritor está certo para as telas e larguras medidas. A causa estrutural permanece: qualquer tela que transborde no futuro expõe de novo o IF3-2 (IF6-4, S4).

## 8. Achados

| ID | Sev. | Estado | Descrição |
|---|---|---|---|
| IF2-3 | S3 | **resolvido por leitura e harness** | um `<main>` por rota em Configurações; tela real PENDING. |
| IF3-2 | S4 | **não reproduz nas telas tocadas** (VERIFIED na amostra) | ver seção 7 e IF6-4. |
| IF6-1 | S4 | VERIFIED | **Texto visível novo no Início:** "Rastreabilidade do Score" deixou de ser só `aria-label` e virou título `<h2>` visível (a regra do lote era "nenhuma mudança de textos"). Efeito: apresentação, sem dado novo. Aceitar ou ocultar para leitor de tela. |
| IF6-2 | S4 | VERIFIED por leitura | `id="daily-content-help"` fixo em `LogFields`, usado em `/app/diario` e `/app/diario/[id]` (nunca na mesma página hoje). Se o painel/gaveta de registro (decisão 4.7) renderizar o formulário ao lado de outro, o ID duplica. |
| IF6-3 | S4 | HYPOTHESIS | `.ds-surface` declara `container-type: inline-size` no `<main>`: contenção de layout e de estilo (descendentes `position: fixed` ficam contidos; contadores e unidades `cq*` mudam). Hoje não há `position: fixed` no CSS nem elementos dessa classe no Início/Diário; relevante quando entrarem diálogos/gavetas. |
| IF6-4 | S4 | VERIFIED na base, HYPOTHESIS nas telas reais | a causa do IF3-2 (barra lateral só `sticky` na vertical) não foi tratada; só deixou de ser disparada nas telas migradas. |
| IF6-5 | S4 | VERIFIED por leitura | CSS morto: 15 classes do Início antigo (`score-home`, `score-hero`, `dimension-strip`, `narrative-trace`, `home-workspace`, `home-density`, `compact-list`…) sem nenhum uso em `*.tsx`, com ~59 regras ainda em `globals.css` (nada foi removido). Sem efeito visual; custo de manutenção. |
| IF2-2 | S3 | resolvido na Rodada 5 (`a5a18aa`) | inalterado neste lote. |

Nenhuma severidade foi reduzida sem evidência; IF2-3 sai de S3 por leitura e medição.

## 9. VERIFIED / HYPOTHESIS / PENDING

| Estado | Itens |
|---|---|
| VERIFIED | C1–C6 nos três SHAs; typegen/test 32/32/lint/typecheck/build 0 nos três; ausência de mudança de lógica/dados/RPC/mensagens; diff de textos; um `<main>` por rota; 0 rolagens/cortes/vazamentos em 144 casos das telas novas; 168 casos de telas não migradas idênticos à base; 129/129 seletores com `ds-`; 0 diferenças de estilo computado nas telas legadas e no "zoo"; foco por teclado, contraste, alvos, estrutura (amostra) |
| HYPOTHESIS | telas reais autenticadas (a amostra transcreve a marcação, não executa os componentes React nem dados reais); IF6-3; Safari/VoiceOver; conteúdo real extremo; a causa de cada rolagem da base é o texto adversarial da amostra |
| PENDING | sessão real de `/app/**`; 1024/1440/1920 px; leitor de tela; impressão; **aceite visual de Yan** (`AGENTS.md` §6.1); painel/gaveta e estados `carregando`/`conflito` (fora do lote) |

## 10. Decisões pendentes

Orquestrador/Yan: integrar os três commits juntos ou em ordem (cada um é filho do anterior e passa nos gates sozinho); aceitar IF6-1 (título visível) ou pedir ajuste; IF6-2 a IF6-5 entram no próximo lote da Interface. Yan: aceite visual das duas telas em sessão real.
