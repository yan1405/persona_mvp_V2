# Relatório de Verificação — Interface — Lote 9, rodada 2 (C9-1, C9-2, C9-3, C9-8 e veredito da série C-1..C-6 + rodada 2)

- SHAs revisados, um a um (`wt/interface-lote2`; a rodada 2 parte do merge `24b7a2c`, que só trouxe docs da `main`: `git diff --name-only 122e860 24b7a2c` lista só 4 arquivos de `AGENTES/`):
  1. `344cafb708f2c91e148ba0284cf7d420de140598` — C9-1 (S2): painel do `AppShell` legível para telas legadas; prévia `/dev/ds/legado`.
  2. `c957171e62c924af49f3d43e0b6802c524dabd28` — C9-2 (S3): gaveta fecha com qualquer link.
  3. `4282aa24a3cf6f369d46aad5635709c9b9c9a879` — C9-3: anel de foco do logotipo.
  4. `18a01f91ddc5ffc5ab05d84f2ca945827377dfa4` — C9-8: gate de aderência.
  5. `f2c7533b4734e30d1b516868212a6dd8e1a7498c` (topo) — STATUS.
- Verificador: Persona — Verificação Independente. Data: 11/11/2026. Relatório válido só para estes SHAs. **Não é aprovação**; o gate é sugestão. **O aceite visual é de Yan**: as capturas abaixo são evidência de medição, não de aceite.
- Regras cumpridas: sem correção, sem push/merge, sem banco/SQL, sem chave, sem `.env`, sem senha real (credencial fictícia só nos `POST` de QA), sem provedor real; nada nos worktrees dos escritores; execução só em `verificacao-lote2`, um SHA por vez, builds em sequência com `HEAD` conferido (estável nos seis), worktree **devolvido a `a5a18aa`, limpo** (0 alterações, só `.env.example`); portas 3107–3110 livres. Servidores com `env -i`. Sondas, mutações e o teste novo contra o gate antigo ficaram em cópia fora do repositório.

## 1. Resumo e gate sugerido

| SHA | Gate sugerido | Em uma linha |
|---|---|---|
| `344cafb` (C9-1) | **liberar com ressalvas** | O **S2 fecha no critério pedido**: com as classes reais das 3 telas dentro do `AppShell` real, `h1` 13,30:1, `p` 6,82:1, `label` 12,2–13,3:1, link 5,45:1, campo 17,45:1 (placeholder 5,64:1), em 375 e 1280; telas com `ds-surface` sem diferença de cor ou caixa. Mas a mesma correção **piora o botão primário** (5,46 → 3,09:1, **C9-11, S3**) e o texto de erro, sucesso e aviso das 3 telas segue ilegível (1,1–1,8:1, **C9-12, S3**, já era assim antes). |
| `c957171` (C9-2) | **liberar** | Gaveta a 375 px fecha com "Registrar agora" (mouse e teclado), logo e destinos, Esc e fundo; o foco volta ao "Abrir menu" em todos. |
| `4282aa2` (C9-3) | **liberar** | Foco do logo: contorno 2 px `rgb(109,40,217)` + halo, ≈ 7,1:1 sobre o painel branco (era ≈ 2,7:1). |
| `18a01f9` (C9-8) | **liberar com ressalvas** | Todas as lacunas que listei agora falham, as telas novas e o layout de `/app` entram no gate, e o teste novo falha no gate antigo (10 de 29) e passa no novo (29/29). Sobram lacunas novas S4 (§5). |
| `f2c7533` (topo, STATUS) | **liberar** | Só `AGENTES/01_interface/STATUS.md`; os números do texto conferem com os meus. |

**Veredito sobre a série inteira (C-1..C-6 + rodada 2, topo `f2c7533`): integrar com ressalvas, sem S1 e sem S2.** O S2 (C9-1) e o S3 (C9-2) da rodada anterior estão **fechados**. Ficam dois S3 abertos nas três telas legadas dentro do shell novo: C9-11 (**regressão da rodada 2**: botão primário com texto escuro sobre violeta) e C9-12 (feedback de erro/sucesso/aviso e botão de perigo ilegíveis, preexistente à rodada 2 e já medido como parte do problema original). Recomendação: tratar **C9-11 antes de integrar** (é regressão desta rodada; um ajuste de cor do botão no mesmo bloco de `ds.css`); C9-12 pode seguir para os Lotes 10–12 (que migram essas telas) **se o Orquestrador aceitar por escrito** ficarem S3 abertos. Isto não é aprovação: o aceite visual e a tela real autenticada seguem pendentes (§7).

Execução independente (`next typegen`, `npm test`, lint, typecheck, build; base da rodada `24b7a2c` e os cinco SHAs): **todos com saída 0** (60 de 60 linhas de execução com `exit 0`, contando os testes diretos; 0 falhas; `HEAD` estável nos seis). `npm test`: **137/137** em `24b7a2c`, `344cafb`, `c957171`, `4282aa2` e **146/146** em `18a01f9` e `f2c7533` (+9 casos sujos de CSS). Lint com 0 avisos nos seis. `ds-adherence.test.ts` direto: 20/20 → **29/29** a partir de `18a01f9`. Rota nova no build: `ƒ /dev/ds/legado` (única).

## 2. Escopo do diff — só caminhos autorizados

- **VERIFIED:** por SHA: `344cafb` → `app/dev/ds/legado/page.tsx` (novo) e `app/ds.css`; `c957171` → `app/dev/ds/legado/page.tsx` e `components/ds/app-shell.tsx`; `4282aa2` → `app/ds.css`; `18a01f9` → `components/ds/ds-adherence.ts`, `ds-adherence.test.ts` e `eslint.config.mjs`; `f2c7533` → `AGENTES/01_interface/STATUS.md`. **Zero arquivo fora** (`components/ds`, `ds.css`, `eslint.config.mjs`, `app/dev/ds/legado`, STATUS). `git diff --check` limpo; trailer `Co-Authored-By` em todos; nenhum padrão de segredo nas linhas adicionadas.
- **Sem regressão dos itens liberados antes (C-1, C-3 a C-6):** `git diff --name-only 122e860 f2c7533` não toca `app/entrar`, `app/onboarding`, `app/auth/**`, `app/termos`, `app/privacidade`, `app/app/layout.tsx` nem os componentes DS além de `app-shell.tsx`. Provas de servidor do `/entrar` refeitas em `f2c7533` (`srv9.sh`): **idênticas** às do Lote 9 (gate desligado em produção, Vercel simulada e Host externo: 18.940 bytes, 0 vestígio de QA, 1 formulário de QA só com gate ligado e Host local: 21.179 bytes; `POST` 404 com gate desligado e Host externo; `X-Forwarded-Host` ignorado; 303 com origem do Host).

## 3. C9-1 — telas legadas dentro do shell novo (`344cafb`)

**Mecanismo (lido):** `ds.css` ganha `.dx-shell__content { color: var(--ds-text-body); color-scheme: light }` e, **só quando não há `.ds-surface`** (`:not(:has(.ds-surface))`), remapeia `--color-bg-*`, `--color-border*`, `--color-text-*` e `--color-accent-bright` para os pares claros do DS. Nenhuma tela foi tocada; `globals.css` inalterado.

**Medição (refiz a minha original):** build de produção de `f2c7533` em `next start` (`NODE_ENV=development` só para a prévia ficar disponível); `/dev/ds/legado` é o `AppShell` real com `contentAs="div"`; troquei o `<main>` por marcação **transcrita dos `page.tsx` reais** (`diario/[id]` nas duas abas, `evidencias/[id]` nas três, `artefatos/novo` + as classes dos formulários: `field-label`, `text-field`, `field-help`, `field-error`, `form-error/success`, `inline-notice`, `state-panel`, botões primário/secundário/texto/perigo, `danger-zone`, `detail-tabs`…), com contraste calculado em **todos os textos e controles** (cor sobre fundo composto, gradiente pelo pior caso, `::placeholder` incluído). Controle: as duas regras novas removidas em tempo de execução (reproduz o 122e860).

| | `h1` | `p` (texto corrido) | `label` | link | campo | placeholder | textos que falham (de 41 a 54 por tela) |
|---|---|---|---|---|---|---|---|
| **Antes** (regras removidas, 1280) | 1,00 | 1,14–1,77 | 1,62–1,77 | 1,00–3,57 | 2,12–7,56 | 2,12 | **36 a 50** por tela (`diario` 36, `sugestoes` 41, `evidencia` 50, `artefato` 13) |
| **Depois** (375 e 1280, iguais) | **13,30** | **6,82** | **12,17–13,30** | **5,45** | **17,45** | **5,64** | **3 a 9** por tela (só os do §3.2) |

- **VERIFIED (critério da atribuição):** `h1`, `p`, `label`, link e campo ≥ 4,5:1 nas três páginas, em 375 e 1280 px; sem rolagem horizontal; conteúdo do painel `rgb(46,42,61)` com `color-scheme: light`.
- **Capturas reais** (navegador do Claude, emulação 375 e 800/1280): Diário (campos, botões, zona de perigo), Evidência a 375 px e Artefatos a 1280 px: título, texto, rótulos e campos legíveis; as mensagens verdes/vermelhas aparecem pálidas sobre fundo pálido. Servem de medição, **não** de aceite visual.

### 3.1 Nenhuma tela com `ds-surface` muda de aparência — VERIFIED (com a ressalva do `color-scheme`)
Sete amostras de telas com `ds-surface` (Início, Diário, Evidência, Perfil, Diagnóstico, Live, Conta; marcação das amostras do Lote 6), em 375 e 1280, no mesmo shell, com e sem as duas regras: **0 diferença de cor, borda, fonte ou caixa em 707 elementos por largura (1.414 medições)**; a **única** propriedade que muda é `color-scheme` (de `dark` herdado do `body` para `light`), que só afeta controles nativos (indicador do campo de data, rolagem, lista do `select`) e é o valor que o `.app-content:has(.ds-surface)` do shell antigo já dava. Controle positivo (telas legadas): 28 propriedades mudam em 100% dos elementos. **Limite:** amostras transcritas, não as telas reais.

### 3.2 Achados novos (mesma marcação transcrita)
- **C9-11 — S3, VERIFIED (regressão desta rodada):** `.button-primary { color: var(--color-text-primary) }` sobre `--color-accent`; o remapeamento põe `--color-text-primary` escuro, então "Salvar alterações", "Estruturar com IA", "Confirmar", "Salvar", "Adicionar", "Criar rascunho" saem **`rgb(26,23,38)` sobre `rgb(124,58,237)` = 3,09:1**. Antes (regras removidas) o botão não aparece nas falhas: branco sobre o mesmo violeta, ≈ 5,46:1 (calculado). A captura do Diário mostra o rótulo escuro sobre o violeta. É a ação principal dos formulários das três telas.
- **C9-12 — S3, VERIFIED (preexistente à rodada 2; resíduo do S2 original):** cores claras fixas do legado (`#fca5a5`, `#fecaca`, `#a7f3d0`, `#6ee7b7`) continuam sobre o painel claro: `.inline-notice` 1,14:1, `.form-success` 1,14:1, `.form-error` 1,62:1, `.field-error` e lista de erros 1,82:1, `summary` da zona de perigo 1,82:1, botão de perigo 1,19:1, `strong` de estado "confirmada" 1,46:1 e "não concluída" 1,82:1, `.evidence-level` 1,46:1. São justamente as mensagens de erro e de confirmação das três telas; no controle (regras removidas) já falhavam igual (a correção não as alcança porque os valores não vêm dos tokens remapeados).
- **C9-14 — S4, HYPOTHESIS:** o remapeamento depende de `:has()`; em navegador sem `:has()` a regra inteira é descartada e as telas legadas voltam ao estado ilegível. Não testei navegador antigo.
- **Limite geral:** as páginas reais exigem sessão e banco; a evidência é de marcação transcrita com as classes e o CSS reais do build (as classes dos subcomponentes de formulário foram lidas do código, não renderizadas). **PENDING:** as três telas reais autenticadas.

### 3.3 Rota nova `app/dev/ds/legado` — VERIFIED
`next start` em `f2c7533`: `NODE_ENV=production`, `+ VERCEL=1`, `development + VERCEL=1` e `development + VERCEL_ENV=preview` → `/dev/ds/legado` (com e sem `?ancora=1&tela=evidencia`), `/dev/ds` e `/dev/ds/onboarding` respondem **404**; só `NODE_ENV=development` sem Vercel responde 200. A página usa o mesmo `isDsGalleryEnabled`, `robots: noindex`, `force-dynamic`. **C9-15 — S4:** o corpo do 404 de `/dev/ds/legado` contém o título da prévia ("Prévia das telas legadas no shell"): mesmo padrão do DS8-7 do Lote 8, sem alcançar a página.

## 4. C9-2 e C9-3

**C9-2 (`c957171`) — VERIFIED.** Mudança: o `onClick` do `<dialog>` agora fecha também quando `e.target.closest("a[href]")`. Teste real a 375 px (preset móvel, ponteiro grosso; `/dev/ds/legado?ancora=1`, onde as rotas viram âncoras): "Registrar agora" **por toque** → gaveta fecha, hash `#registrar`, foco no "Abrir menu"; **logo** → fecha, `#inicio`, foco no gatilho; **destino** (Evidências) → fecha, `#evidencias`, foco no gatilho; **teclado**: Enter no gatilho abre (foco no logo), Tab, Tab até "Registrar agora", Enter → fecha, foco no gatilho; **Esc** → fecha, foco no gatilho; **toque no fundo** → fecha, foco no gatilho (regressão: ok). "Recolher menu" dentro da gaveta não fecha (igual ao anterior). Alvos do logo 120 × 44 e do "Registrar agora" 252 × 44. **Limite:** em rotas reais o `Link` navega e a página nova monta; só testei com âncoras (a navegação real exige sessão).

**C9-3 (`4282aa2`) — VERIFIED.** Tab real a 1280 px: o link do logo recebe `:focus-visible` com `outline: 2px solid rgb(109,40,217)`, deslocamento 2 px e halo `box-shadow` 2 px `rgb(124,58,237)`; fundo da barra `rgb(255,255,255)` → contorno ≈ 7,1:1 (≥ 3:1). Ordem de foco inalterada (pular para o conteúdo → logo → …).

## 5. C9-8 — gate de aderência (`18a01f9`), com casos meus

**Teste do autor contra o código antigo:** o `ds-adherence.test.ts` novo rodado sobre o `ds-adherence.ts` e o `eslint.config.mjs` do 122e860 → **10 falham de 29** (os 9 casos novos de CSS e o de TSX); sobre `f2c7533` → 29/29. **VERIFIED:** "falha na versão anterior e passa na nova".

**CSS (`cssViolations`), 60+ formas minhas, antes → agora:** passam a ser pegos CSS em linha única (`.a{color:red}`, `font-family`, `font-weight`, `line-height`, `letter-spacing`, duas declarações na mesma linha, várias regras na mesma linha, `COLOR:red`, `color : red`, `!important`, aninhado, comentário no meio), `font-weight` em palavra (`bold`, `bolder`, `lighter`, `normal`), `pt`, `pc`, `cm`, `mm`, `in`, `Q`, escape (`12\70x`, `\23fff`, `\72ed`, `\201C` fora de string), cor nomeada em gradiente, sombra, borda, `outline-color`, `font-family` entre aspas fora do DS, `letter-spacing: 0.1rem`, `font-weight: calc(...)`. Controles limpos passam sem falso positivo (`var()`, `rem`, `em`, `ch`, `%`, `vh`, `transparent`, `currentColor`, `line-height: normal`, `letter-spacing: normal`, token com cor nomeada, `content: "\201C"` em string).
- **Lacunas novas (S4, VERIFIED) — C9-13:** (a) **valor na linha seguinte** (`color:` numa linha e `red;` na outra, idem `font-weight: bold` e `font-family`) **passa** (o gate analisa linha a linha); (b) expoente (`1e1px`) passa; (c) cores de sistema (`CanvasText`) passam (legítimas em modo de alto contraste; observação); (d) falsos positivos leves: `font-weight: normal` e `inherit` são pegos.

**TSX (ESLint), 55 sondas minhas:** passam a ser pegos `color`/`background`/`backgroundColor`/`borderColor`/`fill`/`stroke`/`outlineColor` com nome de cor (maiúsculas incluídas), medida numérica nas chaves listadas (`width`, `height`, `margin*`, `padding*`, `gap`, `fontSize`, `borderRadius`, `top/right/bottom/left`; inteiros, decimais ≥ 1, negativos, dentro de expressão), `fontFamily` literal, `fontWeight`/`lineHeight`/`letterSpacing` literais (número e texto), as três juntas num `style={{}}`. Controles limpos passam (`var(--ds-*)`, `"100%"`, `opacity`, `zIndex`, `flex`, `gap: 0`).
- **Alcance — VERIFIED:** o mesmo texto sujo com 5 violações dá **5 erros** em `components/ds/`, `app/entrar`, `app/onboarding` (incluindo `actions.ts`), `app/auth/erro`, `app/termos`, `app/privacidade` e `app/app/layout.tsx`; **0** em `app/app/diario/**`, `app/auth/qa-entrar/route.ts` e `app/dev/ds/legado` (fora do alcance, como declarado). Antes: só `components/ds/` (1 erro).
- **Ainda passam (S4, VERIFIED) — C9-13:** nome de cor em ternário (`c ? "red" : "blue"`), em template (`` `red` ``), com chave entre aspas ou computada; `fontFamily`/`fontWeight` em ternário, em template ou com chave entre aspas; `rowGap`, `columnGap`, `flexBasis`, `inset`, `borderWidth`, `outlineOffset` numéricos e `width: 0.5` (a lista de chaves é fechada); `textDecorationColor`/`caretColor` nomeados; `boxShadow` com cor nomeada sem hex/px; cor nomeada em texto de CSS dentro de string. O gate pega a forma direta; contorná-lo é fácil.
- O CSS do gate cobre só `ds.css` e `gallery.css` (as telas novas não têm CSS próprio).

## 6. Achados

| # | Sev. | Rótulo | SHA | Achado |
|---|---|---|---|---|
| C9-11 | **S3** | VERIFIED (marcação transcrita) | `344cafb` | Botão primário das 3 telas legadas: 5,46 → 3,09:1 (texto escuro sobre violeta) por causa do remapeamento de `--color-text-primary`. §3.2 |
| C9-12 | **S3** | VERIFIED (marcação transcrita; preexistente) | `74147b9`+ | Mensagens de erro/sucesso/aviso, botão e resumo de perigo e rótulos de estado das 3 telas com 1,1–1,8:1 sobre o painel claro. §3.2 |
| C9-13 | S4 | VERIFIED | `18a01f9` | Lacunas remanescentes do gate de aderência (CSS com valor na linha seguinte, `1e1px`; TS em ternário/template/chave citada, chaves fora da lista, `0.5`). §5 |
| C9-14 | S4 | HYPOTHESIS | `344cafb` | Sem `:has()` a correção do painel é descartada. §3.2 |
| C9-15 | S4 | VERIFIED | `344cafb` | 404 de `/dev/ds/legado` carrega o título da prévia (como DS8-7). §3.3 |
| — | S4 | observação | `344cafb` | Em telas `ds-surface` só `color-scheme` muda (dark → light): coerente com o shell antigo. §3.1 |

Estado dos achados da rodada anterior: **C9-1 (S2) fechado no critério pedido** (com C9-11 e C9-12 abertos); **C9-2 (S3) fechado**; **C9-3 (S4) fechado**; **C9-8 (S4) fechado nas formas listadas** (C9-13 reabre lacunas novas). Os demais S4 do Lote 9 seguem como estavam (C9-4 tratado pelo Orquestrador; C9-5, C9-7, C9-9, C9-10 aceitos; C9-6 de Yan).

## 7. Não verificado / limites

- **PENDING:** as telas legadas **reais** autenticadas (`/app/diario/[id]`, `/app/evidencias/[id]`, `/app/artefatos/novo`) dentro do shell, com sessão e banco; o portão de perfil/onboarding em execução; envio do onboarding; login Microsoft; o 303 do QA para `/onboarding` após sucesso.
- A medição do C9-1 usa marcação **transcrita** com o CSS e o `AppShell` reais do build; as classes dos subcomponentes de formulário vêm da leitura do código; estados reais (carregando, erro do servidor) não foram exercitados.
- Navegador antigo sem `:has()`, Safari e leitor de tela não verificados; impressão não verificada.
- **Aceite visual: não dado** (de Yan); comparação com os `.card.html` do DS não feita (não renderizam offline). As capturas são emulação no navegador do Claude (375, 800 e 1280 px).
- Diferencial de estilo das 62 páginas não refeito: o diff da rodada só toca `ds.css` (duas regras escopadas a `.dx-shell__content`, um seletor de foco do logo), `app-shell.tsx` e o gate; C-1, C-3 a C-6 conferidos por diff e pelas provas de servidor.

## 8. Ferramentas

`ferramentas/lote9r2/`: `seq10.sh` (gates por SHA), `zoo10.js` (marcação das 3 telas legadas), `audit10.js` (contraste de todo texto e controle no shell real), `dsz10.js` (amostras `ds-surface`), `mk_dsz.py`, `css_extra.mts` e `css_dirty_{old,r5}.mts` (matriz suja de CSS), `probe10.mjs` (sondas ESLint por texto, antes e agora), `seq10.out`, `eslint_probe10.out`, `newtest_on_old.out`, `srv9_r5.out`.
