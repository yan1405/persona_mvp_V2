# Relatório de Verificação — Interface — Lote 8 (componentes do Design System em TSX, DS-1 a DS-6)

- SHAs revisados, um a um (`wt/interface-lote2`, base `67ba7e82ed6822441f3c46bc2fbf21f01a75345c`, cada um filho do anterior):
  1. `1d5bcf596dcce7f8bb742a56cd8f8f68c2a626fb` — DS-1: primitivos (Icon, Button, IconButton, Badge/Count, Chip, Avatar, Input, Switch) e `app/ds.css`.
  2. `10e49e4e1016124c524befeb2842cb642a677b09` — DS-2: superfícies e jornada (Card, FocalCard, DestinationGrid/Tile, JourneyStepper, FocalJourney, ProgressBar, ScoreRing, TraceLine, DimensionRow).
  3. `6875d5eaaeb185131fef34a0171da4f29fb0ac24` — DS-3: navegação e shell (Logo, NavItem, Sidebar, AppHeader, AppShell).
  4. `03b533e947d89e05ef8100fbb8cbfe3d952c0843` — DS-4: FloatingPanel, SectionIndex, StepFlow, EvidenceCard, EntryCard, ArtifactCard.
  5. `1c5947298a91483ad11dd4270bf8492168b75af5` — DS-5: galeria `/dev/ds` (404 em produção).
  6. `ee64fe6da8b154a743a290a41c45db4e3e1a123e` (topo) — DS-6: bloco ESLint em `components/ds`, teste de CSS, mapa DS→TSX e STATUS.
- Verificador: Persona — Verificação Independente. Data: 10/11/2026. Um relatório vale só para os SHAs citados. **Não é aprovação**; o gate é sugestão. **O aceite visual é de Yan**: nada aqui está marcado como visualmente aprovado.
- Regras cumpridas: sem correção, sem push/merge, sem banco/SQL, sem chave, sem `.env` (o worktree só tem `.env.example`), sem chamada a provedor real; nada nos worktrees dos escritores; execução só em `verificacao-lote2`, um SHA por vez, builds em sequência com `HEAD` conferido antes e depois (`HEAD estavel` em todos), devolvida a `a5a18aa` limpa. Servidor `next start` em `127.0.0.1:3107`, sempre com ambiente limpo (`env -i`), encerrado ao fim. Mutações e sondas só em cópias fora do repositório.

## 1. Resumo e gate sugerido por SHA

| SHA | Gate sugerido | Em uma linha |
|---|---|---|
| `1d5bcf5` (DS-1) | **liberar para integração local** | 10 arquivos novos em `components/ds` + `ds.css` + 1 linha em `layout.tsx` (`import "./ds.css"`); nenhuma tela existente os importa. Ressalvas S4: DS8-4 (padding dos botões) e DS8-5 (contraste do `Count`). |
| `10e49e4` (DS-2) | **liberar para integração local** | Só componentes e CSS `dx-*`. Medidas de Card (22 px), FocalCard (28 px, padding 28), tile (22 px, mínimo 124), barra (6 px) e anel (96 px) batem com o DS. |
| `6875d5e` (DS-3) | **liberar para integração local** | Sidebar, AppHeader, AppShell; tokens de largura/altura (256, 76, 56, 560, 1280) conferem. Mexe em `button.tsx` e `icon-button.tsx` (−2 linhas) do DS-1. |
| `03b533e` (DS-4) | **liberar para integração local** | FloatingPanel é `<dialog>` modal: abre com foco dentro, Esc fecha e devolve o foco ao gatilho (VERIFIED na galeria). |
| `1c59472` (DS-5) | **liberar com ressalvas** | `/dev/ds` responde **404 em `next start`** com `NODE_ENV=production`, com `VERCEL=1`, com `VERCEL_ENV` e com os três juntos. Ressalvas S4: DS8-7 (a resposta 404 carrega o título da galeria no payload RSC e o chunk da galeria fica em `/_next/static`) e DS8-8 (`Avatar variant="ai"`). |
| `ee64fe6` (DS-6, topo) | **liberar com ressalvas** | Gates verdes; adesão por ESLint e teste de CSS funcionam para os casos comuns e **falham em 8 de 21 casos sujos** (DS8-2); os dois testes novos **não entram no `npm test`** (DS8-1). Zero tela existente alterada (§3). |

Execução independente, sem `.env`, nos seis SHAs: `next typegen`, `npm test` **110/110 em cada um** (cancelados 0, ignorados 0), lint (0 avisos), typecheck e build com saída 0. Os testes novos rodei **diretamente** (`node --experimental-strip-types --test`): `app/dev/ds/gate.test.ts` **2/2** (de `1c59472` em diante) e `components/ds/ds-adherence.test.ts` **6/6** (em `ee64fe6`); `lib/auth/redirect.test.ts` 1/1 (versão antiga, esta é a base do Backend). A base `67ba7e8` foi reconstruída para comparação (build 0). Rotas do build: 30 na base, 31 no topo; a única nova é `ƒ /dev/ds`.

**Sem S1, S2 ou S3.** Nenhum componente do Agente entrou. Dez S4 abaixo (alguns são só observação).

## 2. Escopo do diff (`67ba7e8..ee64fe6`) — só caminhos autorizados

- **VERIFIED:** `git diff --name-only 67ba7e8 ee64fe6` lista apenas: `apps/web/components/ds/**`, `apps/web/app/ds.css`, `apps/web/app/dev/ds/**`, `apps/web/app/layout.tsx`, `apps/web/eslint.config.mjs`, `AGENTES/01_interface/STATUS.md` e `docs/redesign/interface/DS_LOTE8.md`. **Zero arquivo fora dos caminhos de `LOTE-8.md`** (conferido também commit a commit: DS-1 12 arquivos, DS-2 11, DS-3 9, DS-4 8, DS-5 7, DS-6 4).
- `layout.tsx`: o diff inteiro é **uma linha**, `+import "./ds.css";`. `eslint.config.mjs`: só o bloco novo `files: ["components/ds/**/*.{ts,tsx}"]` (os demais blocos não mudam; o novo repete a barreira do núcleo do LLM, que continua valendo para o resto). `package.json`, `proxy.ts`, `lib/**`, telas em `app/app/**`, `globals.css` **não** aparecem.

## 3. Nenhuma tela existente foi alterada

Cinco provas independentes:

1. **Ninguém importa os componentes:** `git grep "components/ds"` fora de `components/ds` e de `app/dev/ds` só acha comentários do `eslint.config.mjs`. Nenhuma página, layout ou componente existente usa o DS.
2. **O CSS não alcança o legado:** `app/ds.css` tem 3.155 linhas, 439 seletores; **todos** (fora 4 blocos `:root`) contêm uma classe `dx-`; os 4 `:root` só definem 83 variáveis `--ds-*`; `@keyframes` só `dx-rise`, `dx-pulse`, `dx-ring-in`. `globals.css` do topo é **byte a byte igual** ao da base (mesmo md5). O `ds.css` usa 154 variáveis `--ds-*`: **0 indefinidas**; 75 delas só existem no `globals.css` (a Fundação), por exemplo `--ds-content-max: 1280px`; o DS depende desses tokens enquanto o `globals.css` existir (S4, observação). O comportamento de `prefers-reduced-motion` já é coberto pela regra global do `globals.css` (`transition-duration: 0.01ms !important`), então o DS também a respeita.
3. **Rotas:** o build do topo tem 31 rotas contra 30 da base; a única diferença é `ƒ /dev/ds`.
4. **Estilo computado:** 62 páginas de amostra (as do Lote 6: Início, Diário, Evidências, Live, Artefatos, Diagnóstico, Configurações e a página de componentes, em marcação antiga e nova, mais as versões `_r`), base × topo, nas larguras 375 e 1280 (todas as propriedades computadas de todos os elementos): **124 comparações, 20.920 elementos, 0 diferenças**. Controles: base × base **0 de 124**; controle positivo (topo × cópia com uma regra injetada `padding-top`) **detecta 124 de 124** (ex.: `app-shell` +7 px de altura); a amostra reduzida de 8 páginas × 2 larguras também deu 0 diferenças base × topo, 0 base × base e 16 de 16 no positivo. Amostra = marcação transcrita das telas, não telas reais autenticadas.
5. **Os 404 de produção não mudam nada fora da galeria:** `/entrar` em produção tem **0** ocorrências de `dxg`/`dx-` (15.318 bytes).

## 4. Conformidade com o DS (`.jsx`, `.prompt.md`, tokens)

Medi no navegador do Claude (galeria `/dev/ds`, ponteiro fino em 1440 px) e comparei com `docs/redesign/design-system/components/**`:

| Item | Medido no TSX | DS | Resultado |
|---|---|---|---|
| Raios | `--ds-radius-sm/md/lg/pill` = 16 / 22 / 28 / 999 | 16 / 22 / 28 / pill | confere |
| Button | altura 32 / 40 / 48; fonte 13 / 14 / 15; raio pill; 5 variantes (brand, solid, outline, ghost, on-focal); `:active` escala 0,98; brilho da marca | 32 / 40 / 48; 13 / 14 / 15 | confere; **padding 12 / 20 / 24 contra 14 / 18 / 22 do DS** (DS8-4) |
| IconButton | 40 (padrão), 32/36/44 por `size`, pill | 40; `size` livre | confere |
| Chip | 34 e 28; pill | 34 / 28 | confere |
| Badge / Count | 22 px, 12 px, pill / 20 px, 11 px bold | 22 / 20, 12 / 11 | confere; contraste do `Count` (DS8-5) |
| Avatar | 32 / 40 / 48 / 56 | tamanhos do DS | confere |
| Input | caixa 44 px, raio 16 (pill na busca); anel no contêiner por `:focus-within` (2 px de `brand-strong` + 3 px de halo) | 44; `FIELD_FOCUS` | confere (borda `--ds-n-400`, desvio documentado) |
| Switch | 36 × 20; área de 44 × 44 por `::after`; `role="switch"` + rótulo ligado por `for` | 36 × 20 | confere; área maior é desvio documentado |
| Card / FocalCard | raio 22 (padrão) e 16 (`sm`); FocalCard raio 28, padding 28, sombra `slab` | `radius` md/sm, `padding=28`, `slab` | confere |
| DestinationTile | raio 22, mínimo 124, padding 16/16/13,8 | `minHeight 124`, `16px 16px 14px` | confere (0,2 px por cálculo com token) |
| ProgressBar / ScoreRing | trilho 6 px; anel 96 (72 e 128 por `size`) | 6; 96 | confere |
| Sombras e movimento | `--ds-shadow-soft/float/slab` e `--ds-dur-micro/normal/macro` = .14 / .22 / .36 s, `--ds-ease-out` = `cubic-bezier(.16,1,.3,1)` | tokens `effects.css` | confere |
| Anel de foco | `outline 2px` `--ds-brand-strong` (#6D28D9) + `box-shadow 0 0 0 2px --ds-focus-ring` (#7C3AED); invertido no `on-focal` | DS: `--focus-ring` (#A78BFA) | **desvio documentado** em `DS_LOTE8.md` (contraste WCAG 2.2 1.4.11) |
| FloatingPanel | `<dialog>` modal, `aria-labelledby`, raio 28, sombra `float` | `FloatingPanel.jsx` | confere |
| Shell | `--ds-header-h` 56, `--ds-side-w` 256, trilho 76, mínimo 560, largura máxima 1280 | idem | confere (nos tokens; não medi cada estado do AppShell) |

**Não conferi por medição:** Sidebar expandida/trilho, gaveta do AppShell, StepFlow, SectionIndex ativo, TraceLine em cada container, DimensionRow, EntryCard e ArtifactCard em todos os estados; li o código e vi a galeria, sem comparação numérica contra o DS.

**Os `.card.html` do DS não renderizam offline** (precisam de `unpkg`, `../../styles.css` e `../../_ds_bundle.js`, que a cópia do repositório não traz): **não houve comparação lado a lado com a renderização do DS**. A conformidade acima é contra os valores do `.jsx`, os `.prompt.md` e os tokens. PENDING.

## 5. Zero hex e zero px literal (e tentativa de violar o gate)

- **Prova própria** (sem usar o gate do autor): `grep` em `app/ds.css`: **0** `#hex`; **0** `px` fora de linha `--ds-*` (nem em comentário); `font-family` só `var(--ds-font-body)` (21) e `var(--ds-font-display)` (14). Nos TSX de `components/ds` e `app/dev/ds`: **0** hex e **0** `px`. Resta **3** `rgb(124 58 237 / …)` literais em `ds.css` (linhas 604, 769, 773; DS8-3).
- **Os gates do autor passam no código real:** ESLint dos 31 arquivos de `components/ds` sem avisos; `ds-adherence.test.ts` 6/6 (hex, px só em token, `font-family` só por `var(--ds-font-*)` ou Inter/Plus Jakarta Sans, sobre `ds.css` e `gallery.css`).
- **Casos sujos** (arquivos de sonda em cópia fora do repositório; o ESLint com a configuração do topo; o teste de CSS sobre cópias do `ds.css` com a linha suja):

| Caso sujo em `components/ds` | ESLint |
|---|---|
| hex de 3 e de 8 dígitos; hex em string, em template, em template com expressão | **pega** (5 de 5) |
| `px` em string, em template, decimal (`1.5px`) e em `style={{ width: "10px" }}`; o texto `font-family: Arial` ou `Geist` dentro de uma string | **pega** (6 de 6) |
| importar o núcleo do LLM de dentro de `components/ds` (2 formas) | **pega** (2 de 2) |
| `rgb()`, `hsl()`, cor nomeada (`red`) | **passa** (gap) |
| `12PX` (maiúsculo), `px` por concatenação (`n + "px"`), `px` dinâmico, número em estilo (`{ width: 12 }`) | **passa** (gap) |
| `fontFamily: "Arial"` como chave de objeto | **passa** (gap) |
| controles que devem passar: `rem`, `var(--ds-font-*)`, Inter / Plus Jakarta Sans; hex fora de `components/ds` (por desenho) | passam |

  **Resultado: 13 de 21 casos sujos pegos, 8 passam.** O teste de CSS pega hex, `px` fora de token e `font-family` solto no `ds.css` e na galeria; **não pega** `rgb()`/`hsl()`/cor nomeada, `font` em forma abreviada nem hex dentro de `url(data:…)`. O código real **não** usa nenhum desses padrões, exceto os 3 `rgb()` de marca (DS8-3). **Os dois testes novos não rodam no `npm test`** (110 nos seis SHAs), então só o ESLint trava na integração contínua (DS8-1).

## 6. Galeria `/dev/ds`: 404 em produção (build + `next start`)

Build do topo sem `.env`; `/dev/ds` aparece como `ƒ` (dinâmica, `force-dynamic`), sem HTML estático gerado. `next start` com `env -i` e porta 3107; o corpo do 404 é a página 404 padrão do Next.

| Ambiente do processo | `/dev/ds` | `/dev/ds?x=1` | `/dev/ds/` | `/dev/ds/index`, `/dev` |
|---|---|---|---|---|
| `NODE_ENV=production` | **404** | **404** | 308 → `/dev/ds` (404) | 404 |
| `NODE_ENV=production` + `VERCEL=1` | **404** | **404** | idem | 404 |
| `NODE_ENV=production` + `VERCEL_ENV=production` | **404** | **404** | idem | 404 |
| `NODE_ENV=production` + `VERCEL_ENV=preview` | **404** | **404** | idem | 404 |
| `NODE_ENV=development` (`next start`, só para o lado positivo) | **200** (222.874 bytes) | 200 | 308 | 404 |
| `NODE_ENV=development` + `VERCEL=1` | **404** | **404** | 308 | 404 |
| `NODE_ENV=development` + `VERCEL_ENV=preview` | **404** | **404** | 308 | 404 |

- **VERIFIED:** o gate puro (`isDsGalleryEnabled`) liga só com `NODE_ENV !== "production"` **e** sem `VERCEL` **e** sem `VERCEL_ENV`; `gate.test.ts` 2/2. Sem dados reais: a galeria só usa nomes fictícios ("Ana Souza", "Bruno Lima"…) e texto de exemplo; nenhuma chamada a Supabase ou a provedor (o servidor rodou sem variáveis de provedor).
- **S4 (DS8-7):** a resposta 404 de `/dev/ds` traz, no payload RSC (corpo, não na tela), os metadados da página (`<title>Galeria do Design System</title>`, `robots noindex, nofollow`) e as referências ao CSS e ao JS da galeria; esses arquivos (`1jxxriu6kto3y.js`, 60 KB, e `09ujzogup-o51.css`) existem em `/_next/static/chunks/` em produção. Não há dado nenhum neles (nomes fictícios), mas a rota deixa de ser invisível e o código da galeria vai para o cliente.

## 7. Lista DS → TSX e o que ficou de fora

- **VERIFIED:** o DS tem **37** arquivos `.jsx`; **28** viraram TSX (mapa completo em `docs/redesign/interface/DS_LOTE8.md`, mais `logo.tsx` novo e `ButtonLink`, `IconLink`, `Count`).
- **Fora do lote (9):** as quatro que o Orquestrador listou (`agent/AgentPanel`, `agent/AgentPrompt`, `chat/Composer`, `chat/MessageBubble`), **mais** `entries/CaptureEditor`, `live/ArgumentPanel`, `live/DraftPanel`, `forms/PillTabs` (dependem de dados/telas dos Lotes 10 a 12, ou do legado) e o auxiliar `core/focusRing` (substituído por CSS). Cada exclusão tem motivo escrito no `DS_LOTE8.md`; a variante `contained` do FloatingPanel também ficou de fora. As quatro além do pedido foram uma decisão do Interface (S4, DS8-9).
- **Sinal do Agente:** nenhum componente do Agente entrou; `AppHeader` só tem "Buscar ou perguntar" e traz o comentário "não há botão do Agente"; `git grep` por `agente`, `groq`, `nvidia`, `assistente` só acha esse comentário e o texto do título da especificação na galeria. Textos "IA" que seguem o DS (`EvidenceCard`: "Sugerida pela IA…", "A IA ainda não sugeriu…"; `TraceLine`: "Sugestão da IA") falam de **sugestão de evidência**, não do Agente. **Ressalva (DS8-8):** `Avatar` mantém a variante `ai` (ícone `sparkles`), que o DS reserva ao Agente Persona e manda mostrar sempre ao lado do rótulo "Agente Persona"; a galeria a exibe **sem rótulo**. Nenhuma tela real a usa.

## 8. Capturas reais e acessibilidade básica da galeria

Navegador do Claude (Chromium), `http://127.0.0.1:3107/dev/ds`, build do topo com `NODE_ENV=development`. Capturas vistas e medições em cada largura (o aceite visual é de Yan):

| Largura | Rolagem horizontal | Elementos além da janela |
|---|---|---|
| 375 px | **não** (`scrollWidth` 375 = `clientWidth` 375; altura total 20.055 px) | 0 |
| 768 px | **não** (753 = 753, sem a barra de rolagem; 15.049 px) | 0 |
| 1024 px | **não** (1009 = 1009) | 0 |
| 1280 px | **não** (1265 = 1265) | 0 |
| 1440 px | **não** (1425 = 1425) | 0 |

Em 375, 768 e 1024 px o índice "Nesta página" aparece acima do conteúdo; a partir de 1280 px ele é a coluna da esquerda. A grade de ícones quebra sem corte.

Em **375 px com ponteiro grosso** (104 controles interativos) e com Tab real (100 paradas de teclado):

- **Nome acessível:** 0 de 104 controles sem nome; 0 imagens sem `alt`; 0 SVG sem `aria-hidden`/nome; 0 ids duplicados; `lang="pt-BR"`.
- **Foco visível:** nas 100 paradas o anel aparece (contorno de 2 px `#6D28D9` com deslocamento de 2 px, mais sombra de 2 px em botões e chips). Nos **campos de texto** o contorno do `<input>` é `none` e o anel fica no contêiner (`:focus-within`: 2 px de `brand-strong` e halo de 3 px). Nenhum controle sem indicador.
- **Alvos** (todos os 104 controles, medidos): botões 44 ou 48 px (28), botões de ícone 44 px (14), chips 44 px, itens de navegação e do índice 44 px, campo 44 px (a caixa; o `<input>` interno tem 42 px), **Switch 36 × 20 com área de 44 × 44** por `::after`, caixa de seleção do cartão 24 × 24 (o cartão inteiro é o alvo). Abaixo de 44 px: os **nós interativos do TraceLine, 32 × 32** (3) e o **link do logotipo da Sidebar, 120 × 30** (DS8-6); ambos acima de 24 px.
- **Contraste** (535 textos medidos; fundos em gradiente tratados pelo pior caso): só falham os contadores `Count` (DS8-5). Os demais abaixo de 4,5:1 são estados **desativados ou "fora"** do próprio DS (`opacity` 0,5/0,6; `--ds-text-disabled`), que a WCAG exclui.
- **Estrutura da página da galeria:** 4 `<main>`, 5 `<h1>` e 2 saltos de nível de título (vários AppShell na mesma página). Só a galeria; uma tela real tem um shell (S4, observação).
- **FloatingPanel** (clique real e teclado real): abre como diálogo modal com o foco dentro e o botão "Fechar painel (Esc)" focado; Tab e Shift+Tab ficam **no painel** (a cada volta o foco passa uma vez pela interface do navegador, comportamento padrão do `<dialog>` modal, e volta ao painel); Esc fecha e o foco **volta ao gatilho** com o anel visível.

Medições de acessibilidade feitas em 375 px; nas outras larguras medi rolagem, alinhamento e a captura.

## 9. Achados

| ID | Sev. | Rótulo | Achado | Recomendação |
|---|---|---|---|---|
| DS8-1 | S4 | VERIFIED | `gate.test.ts` e `ds-adherence.test.ts` **não estão no `npm test`** (110 nos seis SHAs). | O Orquestrador acrescenta os dois ao script `test` (o autor já avisou no `DS_LOTE8.md`). |
| DS8-2 | S4 | VERIFIED | O gate de aderência deixa passar 8 de 21 casos sujos (`rgb()`, `hsl()`, cor nomeada, `12PX`, `px` por concatenação ou dinâmico, número em estilo, `fontFamily` como chave de objeto); o teste de CSS não pega `rgb()`/`hsl()`/nomeadas, `font` abreviado nem hex em `url(data:…)`. | Aceitar como limite declarado ou estender as regras. |
| DS8-3 | S4 | VERIFIED | 3 `rgb(124 58 237 / …)` literais em `ds.css` (linhas 604, 769, 773), contra "só tokens `--ds-*`" (cor de marca com alfa); 47 `font-weight`, 17 `line-height` e 15 `letter-spacing` literais (os tokens tipográficos não são usados); na minha comparação, 37 tokens do DS ficaram sem equivalente `--ds-*`. | Criar tokens de alfa/tipografia ou registrar como decisão. |
| DS8-4 | S4 | VERIFIED | Padding horizontal do Button: **12 / 20 / 24 px** (sm / md / lg) contra **14 / 18 / 22** do `Button.jsx`; não consta nos "Desvios documentados". Vem da escala de espaço em 4 px. | Documentar ou ajustar. |
| DS8-5 | S4 | VERIFIED | Contraste do `Count` (11 px, negrito): branco sobre verde `#10B981` = **2,54:1** e sobre vermelho `#EF4444` = **3,76:1** (AA pede 4,5:1). O DS tem os mesmos pares (`Badge.jsx`), então o TSX é fiel; o problema nasce na especificação. | Decisão do design: texto escuro ou fundo mais escuro nesses dois tons. |
| DS8-6 | S4 | VERIFIED | Com ponteiro grosso, os nós interativos do TraceLine (32 × 32) e o link do logotipo da Sidebar (120 × 30) ficam abaixo de 44 px (botões, chips e navegação sobem para 44; o Switch ganha área de 44 px). Atendem os 24 px da WCAG 2.5.8, não o critério de 44 px do projeto. | Estender a regra `pointer: coarse` a esses dois ou dar área por pseudo-elemento. |
| DS8-7 | S4 | VERIFIED | O 404 de `/dev/ds` em produção carrega no payload RSC o título "Galeria do Design System" e as referências ao CSS/JS da galeria; esses arquivos ficam públicos em `/_next/static` (sem dado real). | Aceitar, ou tirar a galeria do build de produção (por exemplo, não gerar a rota fora de desenvolvimento). |
| DS8-8 | S4 | VERIFIED | `Avatar variant="ai"` (ícone `sparkles`) existe na API e aparece sozinho na galeria; o DS o reserva ao "Agente Persona", com rótulo visível. O produto "não tem Agente" (comentário do `AppHeader`). Nenhuma tela real o usa. | Remover a variante da API/galeria ou rotulá-la; decisão do Orquestrador sobre o que conta como "sinal do Agente". |
| DS8-9 | S4 | VERIFIED | Quatro exclusões além das quatro pedidas (CaptureEditor, ArgumentPanel, DraftPanel, PillTabs) e o auxiliar `focusRing`; todas com motivo no `DS_LOTE8.md`. | Confirmar com o Orquestrador. |
| DS8-10 | S4 | PENDING | Os `.card.html` do DS não renderizam offline; sem comparação visual lado a lado. Estados de Sidebar, AppShell, StepFlow, TraceLine, DimensionRow, EntryCard e ArtifactCard só foram vistos na galeria, sem medição numérica contra o DS. | Aceite visual de Yan sobre a galeria. |

## 10. Não verificado / PENDING

- **Aceite visual (Yan)**; comparação visual com a renderização dos `.card.html`; telas reais autenticadas (nenhuma usa o DS ainda); leitor de tela; contraste e alvos fora de 375 px; estados do Sidebar, AppShell (gaveta), StepFlow, TraceLine, DimensionRow, EntryCard e ArtifactCard medidos contra o DS; modo escuro; impressão; Preview e Production reais (a prova de 404 foi em `next start` local com variáveis simuladas); banco.
- A prova de "nenhuma tela alterada" usa as 62 amostras transcritas (computed style) mais prova estrutural; não vi as telas reais.
- Nada foi corrigido, aplicado, integrado ou commitado por mim.

## 11. Decisão de gate (resumo)

`1d5bcf5`, `10e49e4`, `6875d5e`, `03b533e`: **liberar para integração local**. `1c59472` e `ee64fe6`: **liberar com ressalvas** (DS8-1 a DS8-3, DS8-7, DS8-8). Aceite visual: Yan.
