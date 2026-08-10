---
name: editorial-modular-app-design
description: Design, implement, refactor, or audit mobile-first applications using editorial minimalism, modular and block-based interfaces, content-first hierarchy, neutral surfaces, restrained accent colors, progressive disclosure, contextual editing, and polished native interactions. Use for iOS, Android, React Native, Flutter, SwiftUI, Jetpack Compose, PWA, responsive web apps, productivity apps, knowledge tools, dashboards, admin apps, and design systems. Also use when the user requests a Notion-inspired interface without copying Notion.
when_to_use: Use when creating app screens, user flows, navigation, design tokens, component libraries, block editors, data views, responsive layouts, accessibility reviews, visual refactors, prototypes, or production UI code in this design language.
argument-hint: "[task, screen, feature, audit, or app brief]"
---

# Editorial Modular App Design

Apply this skill to create production-ready APP interfaces whose visual language combines editorial minimalism, modular composition, content-first hierarchy, soft flat surfaces, progressive disclosure, and direct manipulation.

Treat `$ARGUMENTS` as additional task context when present.

## Mission

Create an original application experience, not a replica of Notion or another product. Reuse design principles, never proprietary identity, exact layouts, exclusive illustrations, logos, copy, or distinctive branded assets.

Prioritize, in this order:

1. User task completion.
2. Information clarity.
3. Accessibility and platform conventions.
4. Consistency and maintainability.
5. Visual refinement.
6. Delight that does not obstruct work.

## Operating modes

Classify the request before acting:

- **Create:** build a new app, feature, screen, flow, prototype, or design system.
- **Implement:** convert requirements, screenshots, wireframes, or design files into working code.
- **Refactor:** improve an existing interface while preserving behavior and product identity.
- **Audit:** inspect usability, accessibility, responsiveness, consistency, or visual quality.
- **Systematize:** extract tokens, components, patterns, and documentation from an existing app.

When the user asks for implementation, edit the project and deliver working code rather than only describing it. When the user asks for design-only work, deliver specifications detailed enough for implementation.

## First actions

1. Inspect the repository, current screens, package manifest, existing design system, navigation, assets, tests, and platform configuration.
2. Infer the platform and stack from the codebase. Do not ask the user for information already present in files.
3. Identify the core user, primary job, primary action, data entities, navigation model, and required states.
4. Preserve existing conventions unless they conflict with accessibility, the explicit brief, or maintainability.
5. Ask only questions that block a correct implementation. For low-risk ambiguity, state a reasonable assumption and continue.
6. Before broad changes, create a compact implementation plan and a UI contract.

## UI contract

Define or infer the following before implementation:

- Product purpose and target user.
- Platform: iOS, Android, cross-platform mobile, tablet, responsive web app, desktop app, or hybrid.
- Primary tasks and success conditions.
- Navigation model and screen hierarchy.
- Core entities and content density.
- Brand constraints and accent family.
- Typography and localization requirements.
- Required component and page states.
- Accessibility target.
- Offline, loading, permission, authentication, and error behavior.
- Technical stack, available libraries, and test commands.

Use `templates/app-brief.md` when the project lacks a clear product brief.

## Design invariants

The following rules define the style and remain active throughout the task:

### Content first

- Make content visually dominant and interface chrome quiet.
- Use hierarchy, spacing, alignment, and typography before borders, shadows, or color.
- Keep the most important action visible and the rest contextual.
- Avoid decorative elements without a functional or narrative purpose.

### Editorial hierarchy

- Structure screens like readable documents: clear title, supporting metadata, sections, labels, and predictable rhythm.
- Use short line lengths for reading-heavy content and denser layouts only for scanning-heavy data.
- Prefer sentence case. Avoid excessive capitalization and oversized display type in operational screens.

### Modular composition

- Build screens from reusable primitives and semantic modules.
- Treat sections, rows, cards, blocks, properties, lists, tables, and editor nodes as composable units.
- Avoid one-off styling when an existing token or component can express the same intent.

### Quiet surfaces

- Use neutral backgrounds, subtle tonal separation, thin borders, and restrained shadows.
- Use one accent family by default. Add semantic colors only for status, warning, success, danger, or data meaning.
- Reserve elevation for floating elements, transient menus, sheets, dialogs, and dragged items.
- Avoid card-inside-card nesting, heavy gradients, glass effects, and oversized shadows unless the product brief explicitly requires them.

### Progressive disclosure

- Keep common actions visible and reveal secondary actions on focus, hover, selection, swipe, long press, overflow menus, or expanded details.
- Never hide critical actions behind hover on touch devices.
- Do not overload the first screen with every possible control.

### Direct manipulation

- Prefer inline editing, immediate feedback, drag-and-drop where appropriate, contextual toolbars, and autosave.
- Provide non-drag alternatives for accessibility and precision.
- Make destructive actions reversible when possible through undo, Trash, or confirmation.

### Originality

- Do not reproduce another app screen pixel for pixel.
- Change structure, spacing, component treatment, iconography, and brand expression enough to create an independent visual identity.
- Use the project’s own content, copy, symbols, and domain language.

## Reference-loading policy

Read only the supporting files required by the task. Do not load every reference automatically.

- Read `references/01-design-language.md` for visual direction and style boundaries.
- Read `references/02-design-tokens.md` when defining or modifying tokens, themes, typography, spacing, radii, borders, shadows, or motion.
- Read `references/03-layout-responsive.md` for grids, safe areas, breakpoints, foldables, tablets, landscape, and adaptive layouts.
- Read `references/04-navigation-information-architecture.md` for app structure, routes, tabs, drawers, breadcrumbs, command palettes, and deep linking.
- Read `references/05-components-patterns.md` when building a component library or screen UI.
- Read `references/06-block-editor-data-views.md` for document editors, blocks, databases, lists, tables, Kanban, calendars, timelines, and filters.
- Read `references/07-states-feedback-motion.md` for state machines, loading, errors, empty states, autosave, gestures, transitions, and motion.
- Read `references/08-accessibility-inclusion.md` for accessibility, keyboard, screen readers, contrast, dynamic type, localization, and reduced motion.
- Read `references/09-platform-guidelines.md` for iOS, Android, React Native, Flutter, web app, PWA, tablet, or desktop-specific behavior.
- Read `references/10-code-architecture.md` for implementation architecture and stack-specific guidance.
- Read `references/11-quality-assurance.md` before final validation or when auditing an existing app.
- Read `references/12-deliverables.md` when producing design documentation, specifications, or handoff.
- Read `references/13-content-ux-writing.md` when writing labels, messages, empty states, onboarding, errors, or permissions.
- Read `references/14-performance-security.md` for performance, privacy, secure UI, sensitive data, and offline behavior.
- Read `references/15-reference-sources.md` when standards or platform guidance must be verified.
- Read `references/16-visual-validation.md` when screenshots, visual comparison, or image-based QA is available.

## Implementation workflow

### 1. Discover

- Inspect current routes, screens, components, styles, tokens, assets, and dependencies.
- Search for duplicated colors, spacing, typography, and components.
- Identify the most important user flow and its failure points.
- Check whether the app already supports dark mode, localization, reduced motion, keyboard navigation, and responsive layouts.

### 2. Model

Create a compact map of:

- Screens and routes.
- Navigation relationships.
- Primary and secondary actions.
- Data entities and their states.
- Reusable components.
- Loading, empty, partial, error, offline, permission, and success states.

### 3. Establish foundations

- Reuse the current design system when possible.
- Otherwise create semantic design tokens before styling screens.
- Separate primitive tokens from semantic and component tokens.
- Define light and dark themes only when required or already supported.
- Use a neutral foundation with a configurable accent family; never hardcode a specific brand palette as a universal rule.

### 4. Build structure first

Implement in this sequence:

1. Navigation and screen shell.
2. Layout and responsive behavior.
3. Typography hierarchy.
4. Core components and content.
5. Interactive states.
6. Feedback and motion.
7. Accessibility semantics.
8. Visual polish.

Do not begin with decorative effects.

### 5. Implement complete states

Every screen or data-bound component must account for relevant states:

- Initial/loading.
- Skeleton or progressive loading.
- Populated.
- Empty.
- No results after search/filter.
- Partial data.
- Stale/offline.
- Error and retry.
- Permission denied.
- Disabled or unavailable.
- Saving/saved/save failed.
- Success/confirmation.

### 6. Verify behavior

- Run formatting, linting, type checking, tests, and build commands available in the repository.
- Launch the app when tooling permits.
- Exercise the primary flow, not only static compilation.
- Check small phone, large phone, tablet or expanded width, and at least one landscape or resizable state when relevant.
- Validate keyboard navigation and screen-reader labels where supported.
- Record commands, progress, failures, and final status. Never hide a failing validation.

### 7. Review visually

Check:

- Hierarchy is obvious within three seconds.
- The primary action is clear.
- Alignment and spacing follow tokens.
- Text does not clip at larger sizes.
- Interactive elements have all states.
- Content remains usable without color alone.
- Dense screens remain scannable.
- Empty and error screens guide the next action.
- The result feels original rather than copied.

## Coding rules

- Follow the existing framework and architecture unless the user explicitly requests migration.
- Prefer semantic, reusable components over large monolithic screen files.
- Keep business logic outside visual components when the stack permits.
- Use design tokens rather than raw repeated values.
- Prefer platform-native primitives for navigation, inputs, dialogs, accessibility, and gestures.
- Use the existing icon library. Do not mix unrelated icon styles.
- Do not use emoji as functional icons unless the product language explicitly uses emoji.
- Use real, domain-relevant copy rather than Lorem ipsum.
- Avoid arbitrary dependencies. Add a dependency only when it meaningfully reduces complexity or improves correctness.
- Preserve public APIs and behavior during refactors unless change is requested.
- Do not remove existing accessibility attributes, tests, analytics, localization, or error handling without replacement.
- Keep animations interruptible and respect reduced-motion preferences.
- Never expose secrets, personal data, tokens, or internal identifiers in UI, logs, fixtures, screenshots, or generated examples.

## Visual defaults

Use these defaults only when the project has no established system:

- Neutral or slightly warm background.
- White or near-white primary surface in light mode.
- Near-black primary text rather than absolute black when suitable.
- One restrained accent family with semantic status colors.
- Moderate corner radii, not uniformly pill-shaped controls.
- Thin borders and tonal surfaces before shadows.
- Outline icons with consistent optical size and stroke.
- A 4-unit spacing foundation with an 8-unit primary rhythm.
- Compact but comfortable content density.
- Short, subtle motion with ease-out behavior.

Consult `references/02-design-tokens.md` for ranges and token structure.

## Navigation defaults

Choose navigation from task structure, not fashion:

- Use bottom navigation for a small number of equally important top-level mobile destinations.
- Use a navigation rail or sidebar when width permits and destinations are numerous.
- Use a stack for drill-down flows.
- Use tabs for sibling views within the same context.
- Use sheets for focused, temporary tasks.
- Use dialogs only for brief decisions that must interrupt the flow.
- Preserve back behavior, deep links, and state restoration.

## Component expectations

Prefer a small, coherent library containing:

- App shell and safe-area container.
- Top app bar, bottom navigation, rail, sidebar, tabs, breadcrumbs.
- Buttons, icon buttons, segmented controls, chips, toggles.
- Inputs, search, combobox, select, date/time controls, upload.
- Lists, rows, cards, properties, metadata, avatars, badges.
- Dialogs, sheets, popovers, menus, tooltips, toasts.
- Skeletons, progress, empty states, banners, inline validation.
- Tables, boards, calendars, timelines, filters, sorting, pagination.
- Editor blocks and contextual block controls when applicable.

Components must expose semantic variants and states rather than arbitrary style props.

## Accessibility baseline

- Target WCAG 2.2 AA for web surfaces and equivalent platform accessibility expectations for native apps.
- Provide visible focus and logical focus order.
- Give every icon-only control an accessible name.
- Support text resizing and avoid fixed-height text containers.
- Keep touch targets comfortably operable; follow platform minimums.
- Do not rely on color, position, motion, sound, or gesture alone.
- Provide alternatives to drag, swipe, long press, and hover-only actions.
- Respect reduced motion, high contrast, screen readers, and keyboard or switch input where applicable.

## Output behavior

When delivering implementation work, report:

1. What was built or changed.
2. Key design decisions and assumptions.
3. Files created or modified.
4. Commands and validations executed.
5. Results, including failures or limitations.
6. Remaining risks or recommended next action, only when material.

When delivering a design specification, use `templates/screen-spec.md`, `templates/component-spec.md`, and `templates/handoff.md` as appropriate.

## Definition of done

A task is complete only when the relevant criteria hold:

- The primary user flow is implemented or fully specified.
- The interface follows the editorial-modular design invariants.
- Components use tokens and remain reusable.
- Responsive or adaptive behavior is defined and tested.
- Relevant loading, empty, error, offline, permission, saving, and success states exist.
- Accessibility semantics and alternative interactions are present.
- Visual hierarchy, spacing, and alignment are consistent.
- The implementation builds and passes the available quality checks, or failures are clearly reported.
- The result is original and does not copy another product’s protected identity.

Use `references/11-quality-assurance.md` and `templates/qa-checklist.md` for the final gate.


---

# Referências incorporadas

Esta distribuição contém as referências no mesmo arquivo. Na versão modular, leia apenas os arquivos necessários.


---

<!-- Source: references/01-design-language.md -->

# 01 — Linguagem de design

## Definição

O estilo combina quatro famílias:

1. **Minimalismo editorial:** leitura, escrita, hierarquia tipográfica e ritmo de documento.
2. **Interface modular:** telas formadas por blocos, propriedades e componentes reutilizáveis.
3. **Soft flat design:** superfícies planas com separação tonal, bordas discretas e elevação mínima.
4. **Content-first UI:** a estrutura da interface desaparece visualmente para dar prioridade ao conteúdo e à tarefa.

## Personalidade visual

A interface deve parecer:

- clara;
- calma;
- precisa;
- funcional;
- inteligente sem ser fria;
- organizada sem parecer rígida;
- sofisticada sem depender de efeitos decorativos.

Evite que pareça:

- um clone de produto conhecido;
- um painel genérico cheio de cards;
- um site de marketing disfarçado de app;
- um protótipo sem estados reais;
- uma interface futurista com excesso de vidro, brilho ou gradiente;
- uma tela vazia com pouco contraste e pouca hierarquia.

## Gramática visual

### Hierarquia

Use os seguintes recursos em ordem de preferência:

1. posição;
2. alinhamento;
3. espaço;
4. escala tipográfica;
5. peso tipográfico;
6. contraste tonal;
7. borda;
8. cor de destaque;
9. sombra.

Não use sombra ou cor quando espaçamento e tipografia resolvem a hierarquia.

### Espaço em branco

O espaço em branco funciona como estrutura, não como ausência. Ele deve:

- separar grupos sem criar caixas desnecessárias;
- reduzir ruído;
- destacar a ação principal;
- melhorar leitura e escaneabilidade;
- criar ritmo entre título, metadados, conteúdo e ações.

### Densidade

Use três níveis sem misturá-los arbitrariamente:

- **Confortável:** onboarding, leitura, criação, configurações e tarefas focadas.
- **Padrão:** listas, dashboards leves, detalhes e formulários.
- **Compacto:** tabelas, painéis operacionais e usuários avançados.

A densidade deve ser configurável em produtos profissionais com muita informação.

### Cor

- Use uma escala neutra dominante.
- Escolha uma única família de acento principal.
- Use cores semânticas para significado, não decoração.
- Não use mais de uma cor saturada concorrendo por atenção na mesma região.
- Não aplique a cor da marca em grandes áreas apenas para “dar identidade”.
- Diferencie estados também por ícone, texto, forma, borda ou padrão.

### Tipografia

- Prefira sans-serif humanista ou geométrica com boa legibilidade.
- Use serifas apenas quando o produto exige caráter editorial forte ou leitura longa.
- Use monoespaçada para código, IDs, métricas tabulares ou dados técnicos.
- Mantenha poucos estilos: display opcional, títulos, corpo, label, caption e mono.
- Use peso e tamanho com parcimônia; excesso de variações destrói consistência.

### Ícones

- Use uma única biblioteca ou família visual.
- Prefira ícones outline para ações e navegação.
- Mantenha tamanho óptico consistente, mesmo quando o viewBox varia.
- Ícones sem texto são aceitáveis apenas quando universais ou acompanhados de tooltip/label acessível.
- Não use emoji como substituto genérico de ícone funcional.

### Ilustrações e imagens

- Use apenas quando ajudam orientação, identidade, ensino ou estado vazio.
- Prefira ilustrações simples, monocromáticas ou com a família de acento.
- Fotos devem ter propósito editorial ou de conteúdo.
- Evite imagens decorativas em fluxos operacionais.

## Formas

### Raios

- Pequeno: controles compactos, badges e campos densos.
- Médio: botões, inputs, cards, menus.
- Grande: sheets, modais, painéis e superfícies de destaque.
- Pílula: chips, filtros, badges e controles cujo formato comunica agrupamento.

Não transforme todos os componentes em pílulas. Misture raios somente por função.

### Bordas

Use bordas para:

- delimitar campos;
- separar regiões interativas;
- indicar seleção ou foco;
- estruturar tabelas quando o espaçamento não basta.

Evite bordas em cada card, linha e seção ao mesmo tempo.

### Sombras

Use sombra apenas para elevação real:

- menu ou popover;
- modal ou sheet;
- elemento arrastado;
- barra flutuante;
- botão flutuante quando apropriado à plataforma.

A sombra deve ser suave, ampla e com baixa opacidade. Prefira borda ou tonalidade em superfícies estáticas.

## Princípios de composição

- Alinhe conteúdo a uma grade previsível.
- Use uma âncora dominante por tela.
- Evite centralizar longos blocos de texto ou formulários.
- Limite o número de ações primárias a uma por contexto.
- Agrupe por significado, não apenas proximidade visual.
- Mantenha metadados visualmente secundários.
- Mostre contexto antes de controles avançados.

## Padrões a evitar

- Card dentro de card dentro de card.
- Sidebar, topbar, toolbar e tabbar competindo simultaneamente.
- Títulos gigantes em telas operacionais pequenas.
- Cores arbitrárias em cada categoria sem legenda ou semântica.
- Sombras pesadas e bordas de alto contraste.
- Gradientes como preenchimento padrão de botões.
- Glassmorphism sem justificativa de contexto.
- Skeleton que não representa o layout final.
- Ícones desalinhados, com espessuras e estilos diferentes.
- Muitos CTAs primários na mesma tela.
- Controles essenciais apenas no hover.



---

<!-- Source: references/02-design-tokens.md -->

# 02 — Design tokens

## Arquitetura em três camadas

### 1. Tokens primitivos

Valores brutos sem significado de interface:

- cores da paleta;
- escala de espaço;
- famílias e tamanhos tipográficos;
- raios;
- espessuras;
- sombras;
- durações;
- curvas de movimento;
- opacidades.

### 2. Tokens semânticos

Expressam intenção:

- `color.background.canvas`;
- `color.background.surface`;
- `color.text.primary`;
- `color.text.muted`;
- `color.border.default`;
- `color.action.primary`;
- `color.status.danger`;
- `space.page.inline`;
- `radius.control`;
- `motion.duration.fast`.

### 3. Tokens de componente

Mapeiam semântica para um componente:

- `button.primary.background.default`;
- `input.border.focus`;
- `navigation.item.background.selected`;
- `card.padding.default`;
- `dialog.shadow`.

Evite pular diretamente dos valores brutos para estilos de tela.

## Paleta neutra padrão

Quando não existir identidade definida, crie uma escala neutra com pelo menos:

- canvas;
- superfície principal;
- superfície secundária;
- hover;
- pressed;
- borda fraca;
- borda forte;
- texto principal;
- texto secundário;
- texto desabilitado;
- overlay.

A temperatura pode ser fria, neutra ou quente. Escolha uma e mantenha consistência.

## Acento configurável

Crie uma escala de 8 a 10 passos, por exemplo:

```text
accent.50
accent.100
accent.200
accent.300
accent.400
accent.500
accent.600
accent.700
accent.800
accent.900
```

Mapeamento recomendado:

- tons claros: fundos selecionados, badges, foco suave;
- tom médio: CTA primário, ícone ativo, links;
- tons fortes: hover, pressed, texto de destaque;
- tom escuro: contraste sobre superfícies claras.

Nunca assuma que o acento é roxo, azul ou qualquer cor fixa.

## Cores semânticas

Defina escalas para:

- sucesso;
- informação;
- alerta;
- perigo.

Cada estado precisa de:

- fundo;
- borda;
- texto/ícone;
- versão de alto contraste;
- equivalente em tema escuro, quando aplicável.

## Tipografia

### Escala sugerida

Use valores adequados à plataforma, mantendo relações próximas destas:

| Papel | Faixa comum | Uso |
|---|---:|---|
| Display | 32–48 | Tela de apresentação ou marco importante |
| Título de página | 28–36 | Cabeçalho principal |
| Título de seção | 20–24 | Seções e painéis |
| Subtítulo | 17–20 | Cards, blocos e listas |
| Corpo | 15–17 | Conteúdo principal |
| Label | 13–15 | Controles e propriedades |
| Caption | 11–13 | Metadados e ajuda |

### Regras

- Corpo: line-height aproximado de 1.45 a 1.65.
- Títulos: line-height aproximado de 1.15 a 1.35.
- Evite texto principal abaixo de 14 unidades visuais em interfaces densas.
- Métricas devem usar números tabulares quando alinhadas em colunas.
- Não fixe altura de contêiner quando o texto pode crescer.
- Suporte Dynamic Type, font scaling ou zoom conforme a plataforma.

## Espaçamento

Use base 4 e ritmo principal 8:

```text
0, 2, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96
```

Exemplo de semântica:

- `space.inline.xs`: 4;
- `space.inline.sm`: 8;
- `space.inline.md`: 12;
- `space.stack.sm`: 8;
- `space.stack.md`: 16;
- `space.section`: 24 ou 32;
- `space.page`: adaptativo por largura.

Não use valores aleatórios como 13, 19 ou 27 sem justificativa óptica.

## Raios

Faixas sugeridas:

```text
radius.none: 0
radius.xs: 4
radius.sm: 6
radius.md: 8
radius.lg: 12
radius.xl: 16
radius.2xl: 24
radius.full: 9999
```

Mapeie semanticamente:

- controle compacto: `sm`;
- input/botão: `md`;
- card: `md` ou `lg`;
- sheet/modal: `xl` ou `2xl`;
- chip: `full`.

## Bordas

- Padrão: 1 unidade física/lógica.
- Seleção ou foco: 1–2 unidades, conforme contraste.
- Divisores: use apenas quando espaço ou tonalidade não resolvem.

Tokens:

```text
border.width.hairline
border.width.default
border.width.strong
border.color.subtle
border.color.default
border.color.focus
```

## Sombras e elevação

Crie poucos níveis:

- `elevation.none`;
- `elevation.floating`;
- `elevation.overlay`;
- `elevation.modal`.

Não use sombras em todos os cards. Em tema escuro, elevação pode depender mais de tonalidade e borda.

## Movimento

Durações sugeridas:

```text
instant: 0–80ms
fast: 100–140ms
normal: 160–220ms
slow: 240–320ms
```

Curvas:

- entrada: ease-out;
- saída: ease-in;
- movimento entre estados: ease-in-out ou spring moderada;
- reorganização: spring com baixa oscilação.

Crie alternativa de movimento reduzido.

## Z-index ou camadas

Defina uma escala pequena e documentada:

```text
base
sticky
navigation
popover
sheet
modal
toast
critical
```

Não use números arbitrários crescentes.

## Tema escuro

Não inverta a paleta mecanicamente.

- Use cinzas muito escuros em vez de preto absoluto para superfícies amplas.
- Reduza saturação de cores brilhantes.
- Mantenha diferenças claras entre canvas, surface e elevated.
- Ajuste bordas e foco para visibilidade.
- Revise imagens, logos, ilustrações e estados desabilitados.

## Formatos de distribuição

Exporte tokens conforme a stack:

- JSON como fonte canônica;
- CSS custom properties para web;
- TypeScript para React/React Native;
- Dart para Flutter;
- Swift para SwiftUI/UIKit;
- Kotlin para Compose/Views;
- Figma Variables quando houver handoff de design.

Use `templates/design-tokens.json` como base.



---

<!-- Source: references/03-layout-responsive.md -->

# 03 — Layout responsivo e adaptativo

## Princípio central

Projete para o espaço disponível, não para nomes fixos de dispositivos. A mesma aplicação pode rodar em celular, tablet, janela redimensionada, desktop, foldable ou split screen.

## Unidades

- iOS: pontos lógicos e safe areas.
- Android: dp para layout, sp para texto.
- Web: rem, em, %, fr, minmax, clamp e container queries quando apropriado.
- React Native: unidades lógicas do framework.
- Flutter: logical pixels e constraints.

Evite posicionamento dependente de pixels físicos.

## Larguras de referência para teste

Use como conjunto de teste, não como breakpoints rígidos:

- telefone estreito: 320–360;
- telefone comum: 375–390;
- telefone amplo: 412–430;
- tablet compacto: 600–768;
- tablet amplo: 834–1024;
- desktop/app web: 1280–1440;
- desktop amplo: 1600 ou mais.

Teste também:

- orientação paisagem;
- teclado virtual aberto;
- split view;
- janela flutuante ou redimensionada;
- zoom ou texto ampliado;
- conteúdo localizado mais longo.

## Classes de layout

Use classes semânticas:

### Compacta

- uma coluna;
- navegação inferior ou stack;
- sidebar como drawer;
- ações secundárias em overflow ou sheet;
- tabelas simplificadas, roláveis ou convertidas em lista.

### Média

- uma coluna ampla ou duas regiões leves;
- navigation rail opcional;
- filtros persistentes compactos;
- lista e detalhe alternados ou lado a lado quando o conteúdo permite.

### Expandida

- sidebar ou rail persistente;
- layout list-detail;
- painéis auxiliares;
- maior densidade sem ampliar excessivamente a linha de leitura.

Não apenas aumente margens em telas grandes. Reorganize a informação.

## Grade

### Mobile

- margem externa: geralmente 16–24 unidades;
- gutter: 12–16;
- uma coluna principal;
- alinhamento forte à esquerda;
- componentes full-width apenas quando a tarefa pede.

### Tablet

- margem: 24–40;
- 8 ou 12 colunas conceituais;
- painéis com largura mínima funcional;
- controle de linha de leitura.

### Desktop/web app

- sidebar: aproximadamente 232–288, conforme densidade;
- conteúdo de leitura: largura máxima aproximada de 680–840;
- conteúdo operacional: 960–1440 ou fluido;
- painéis laterais: aproximadamente 280–400;
- page padding: 24–64, adaptativo.

Esses valores são faixas, não regras absolutas.

## Safe areas e regiões do sistema

- Respeite recortes, ilhas, barras do sistema, home indicator e gesture areas.
- Não coloque controles críticos sob áreas de gesto.
- Trate barras transparentes e conteúdo edge-to-edge de forma explícita.
- Ajuste scroll indicators e conteúdo rolável às insets.
- Garanta que sheets e bottom bars não cubram campos focados.

## Teclado virtual

- Mantenha o campo focado visível.
- Ajuste viewport ou scroll sem saltos imprevisíveis.
- Não esconda o botão de conclusão atrás do teclado.
- Forneça ações de teclado adequadas: next, done, search, send.
- Preserve conteúdo digitado durante rotação ou mudança de tamanho.

## Foldables e telas dobráveis

- Detecte dobradiça e regiões obstruídas.
- Não posicione conteúdo crítico sobre a dobra.
- Use a dobra como separador natural para lista/detalhe quando apropriado.
- Não assuma que a janela ocupa a tela inteira.

## Layouts canônicos

### Lista–detalhe

Ideal para notas, mensagens, arquivos, tarefas e configurações.

- compacto: lista e detalhe em rotas separadas;
- expandido: lista e detalhe simultâneos;
- mantenha item selecionado e estado de navegação.

### Feed

Ideal para atividade, atualizações e conteúdo cronológico.

- limite a largura de leitura;
- use filtros persistentes em telas amplas;
- preserve posição de rolagem.

### Painel de suporte

Conteúdo principal + painel secundário para propriedades, comentários, inspeção ou IA.

- painel recolhível;
- largura mínima e máxima;
- não comprimir o conteúdo principal abaixo do utilizável.

## Scroll

- Prefira um eixo principal por região.
- Evite scroll vertical aninhado.
- Use cabeçalho sticky somente quando aumenta orientação.
- Preserve contexto ao carregar mais itens.
- Não mova ações primárias com mudanças inesperadas de conteúdo.
- Considere paginação, virtualização ou carregamento incremental em listas grandes.

## Tabelas em telas pequenas

Escolha uma estratégia:

1. rolagem horizontal com primeira coluna fixada;
2. seleção de colunas essenciais;
3. linha convertida em card/list item;
4. detalhe em sheet ou nova rota;
5. modo compacto configurável.

Nunca reduza o texto até ficar ilegível para “caber”.



---

<!-- Source: references/04-navigation-information-architecture.md -->

# 04 — Navegação e arquitetura da informação

## Princípios

- Organize por modelos mentais do usuário, não pela estrutura interna do banco de dados.
- Uma tela deve responder: onde estou, o que posso fazer e como volto.
- Mantenha navegação estável entre sessões e tamanhos de janela.
- Não misture destinos, filtros e ações na mesma barra sem distinção visual.

## Modelos de navegação

### Stack

Use para progressão e drill-down:

- lista → detalhe;
- configuração → subconfiguração;
- projeto → tarefa → comentário.

Preserve back nativo, estado e scroll.

### Bottom navigation

Use quando existem poucos destinos principais de importância semelhante.

- rótulos curtos;
- ícone + texto;
- estado ativo inequívoco;
- não use para ações como “Adicionar” quando isso confunde destino e comando;
- preserve cada stack por aba quando apropriado.

### Navigation rail

Use em largura média:

- mais espaço que bottom bar;
- menos peso que sidebar;
- adequado para tablet e desktop compacto.

### Sidebar

Use quando há:

- muitos destinos;
- hierarquia;
- espaços de trabalho;
- favoritos;
- conteúdo navegável;
- necessidade de troca rápida.

Ela deve ser recolhível e não roubar espaço do conteúdo em telas compactas.

### Tabs

Use para visões irmãs dentro do mesmo objeto ou contexto.

Não use tabs para etapas obrigatórias de um formulário; use stepper ou fluxo sequencial.

### Drawer

Use como adaptação da sidebar ou para navegação menos frequente. Não esconda os principais destinos em drawer quando a frequência exige acesso persistente.

### Breadcrumb

Use em estruturas profundas, especialmente web/desktop. Em mobile, simplifique para título de contexto e back.

### Command palette e busca global

Úteis para usuários avançados e apps com muitos objetos.

Inclua:

- pesquisa por nome, conteúdo e ação;
- atalhos recentes;
- comandos agrupados;
- navegação por teclado;
- feedback de nenhum resultado;
- permissões respeitadas.

## Arquitetura de tela

Uma tela editorial-modular pode conter:

1. Contexto: breadcrumb, workspace ou back.
2. Título e metadados.
3. Ação principal e ações secundárias.
4. Ferramentas locais: busca, filtro, ordenação, visualização.
5. Conteúdo principal.
6. Painel contextual opcional.
7. Feedback transitório.

Não é obrigatório mostrar todas as regiões simultaneamente.

## Deep links

- Cada detalhe importante deve ter rota ou identificador estável quando a plataforma permite.
- Autenticação deve retornar o usuário ao destino original.
- Links inválidos precisam de fallback útil.
- Preserve filtros e visualização quando fazem parte do contexto compartilhado.

## Estado de navegação

Preserve, quando adequado:

- aba selecionada;
- item selecionado;
- filtros e ordenação;
- posição de rolagem;
- draft não enviado;
- painel aberto;
- modo de visualização;
- consulta de busca.

## Onboarding

- Ensine no momento de uso, não em uma sequência longa antes do valor.
- Permita pular quando não for essencial.
- Peça permissões apenas quando o benefício estiver claro.
- Termine em uma ação real, não em uma tela celebratória sem continuidade.

## Autenticação

- Mantenha login simples.
- Explique requisitos de senha antes do erro.
- Preserve entrada após falha.
- Diferencie erro de credencial, conexão, bloqueio e conta inexistente sem expor riscos de segurança.
- Ofereça recuperação e retorno previsível.

## Modais, sheets e popovers

### Dialog

Use para decisão curta e bloqueante. Evite formulários longos.

### Bottom sheet

Use em mobile para seleção, ações contextuais, filtros e formulários breves.

### Side sheet/panel

Use em telas amplas para detalhes, propriedades, comentários ou edição auxiliar.

### Popover

Use para menus e controles temporários próximos à origem. Precisa de posicionamento adaptativo e navegação por teclado no web/desktop.



---

<!-- Source: references/05-components-patterns.md -->

# 05 — Componentes e padrões

## Princípios de componente

Cada componente deve:

- ter propósito semântico claro;
- usar tokens;
- suportar estados relevantes;
- aceitar conteúdo variável;
- funcionar com texto ampliado e localização;
- expor acessibilidade;
- evitar props de estilo arbitrárias quando variantes semânticas resolvem;
- ter comportamento consistente entre telas.

## Anatomia mínima de especificação

Para cada componente documente:

- objetivo;
- anatomia;
- variantes;
- tamanhos;
- estados;
- comportamento;
- conteúdo permitido;
- acessibilidade;
- responsividade;
- exemplos corretos e incorretos.

## Botões

Hierarquia:

- primário: ação principal do contexto;
- secundário: ação importante de apoio;
- terciário/ghost: ação de baixa ênfase;
- destrutivo: ação de risco;
- icon button: ação compacta com nome acessível.

Estados:

- default;
- hover quando aplicável;
- pressed;
- focus;
- loading;
- disabled;
- success temporário quando útil.

Regras:

- texto com verbo específico;
- não usar mais de um primário por região;
- loading não deve mudar drasticamente a largura;
- ícone à esquerda para identificação e à direita para progressão ou expansão, conforme significado.

## Inputs

Anatomia:

- label persistente;
- controle;
- ajuda opcional;
- contador opcional;
- erro específico;
- indicador de obrigatório quando necessário.

Estados:

- vazio;
- preenchido;
- focus;
- válido;
- inválido;
- disabled;
- read-only;
- loading ou verificação assíncrona.

Não use placeholder como único label.

## Busca

- opção clara para limpar;
- estado de busca ativa;
- histórico ou sugestões quando útil;
- loading;
- nenhum resultado;
- correção ou filtros sugeridos;
- cancelamento em mobile quando necessário.

## Listas e linhas

Uma linha pode conter:

- leading icon/avatar/check;
- título;
- subtítulo ou metadado;
- badge;
- ação trailing;
- disclosure;
- seleção.

Use altura consistente por nível de densidade. Não transforme toda linha em card.

## Cards

Use card quando o conteúdo precisa ser selecionado, agrupado, movido, comparado ou isolado. Não use como contêiner padrão de toda seção.

Variantes:

- flat;
- outlined;
- selected;
- interactive;
- draggable;
- media.

## Chips, tags e badges

- Chip: controle ou filtro interativo.
- Tag: classificação de conteúdo.
- Badge: estado, contagem ou metadado compacto.

Não misture as funções. Não atribua cores aleatórias sem semântica.

## Menus

- ações ordenadas por frequência e risco;
- separadores por grupo semântico;
- destrutivas no fim;
- atalhos visíveis no desktop;
- item selecionado marcado;
- submenu somente quando necessário;
- tamanho adequado ao toque em mobile.

## Tooltip

Use para explicar ícones ou termos curtos, não para conteúdo essencial. Em touch, forneça alternativa acessível.

## Toast e snackbar

Use para feedback transitório e não bloqueante.

- mensagem curta;
- ação opcional como Desfazer;
- duração suficiente;
- não empilhar indefinidamente;
- erros persistentes importantes devem aparecer inline ou em banner.

## Banner e alerta inline

Use para estado relevante à tela ou seção:

- informação;
- aviso;
- erro;
- sucesso persistente.

Inclua ação concreta quando houver solução.

## Dialog e sheet

- título descritivo;
- corpo curto;
- ação primária e cancelamento;
- foco inicial previsível;
- fechamento por Esc/back quando seguro;
- confirmação adicional apenas para risco real.

## Empty state

Deve conter:

1. o que está vazio;
2. por que isso importa;
3. próxima ação;
4. ilustração opcional.

Diferencie vazio inicial de nenhum resultado após filtro.

## Skeleton e loading

- represente a geometria final;
- evite shimmer agressivo;
- não use skeleton para operações instantâneas;
- preserve layout para evitar saltos;
- ofereça cancelamento em tarefas longas quando possível.

## Data display

Inclua componentes para:

- tabela;
- lista;
- grid;
- métricas;
- gráfico;
- timeline;
- calendário;
- Kanban;
- árvore/hierarquia.

A visualização deve ser escolhida pelo tipo de decisão que o usuário precisa tomar.

## Componentes editoriais

- heading;
- paragraph;
- quote;
- callout;
- divider;
- code block;
- checklist;
- attachment;
- image with caption;
- property row;
- inline mention;
- comments;
- table of contents.

## Componentes de IA

Quando o app contém IA:

- diferencie entrada do usuário e conteúdo gerado;
- mostre geração, streaming, erro e cancelamento;
- permita revisar, editar, copiar, aceitar e rejeitar;
- indique limitações e fontes quando relevante;
- não substitua ações críticas sem confirmação;
- preserve histórico e versão quando a geração altera conteúdo.



---

<!-- Source: references/06-block-editor-data-views.md -->

# 06 — Editor em blocos e visualizações de dados

## Modelo de bloco

Um bloco é uma unidade endereçável de conteúdo com:

```text
id
type
content
properties
parentId
children
position
createdAt
updatedAt
createdBy
version
```

Tipos comuns:

- paragraph;
- heading;
- checklist;
- bullet list;
- numbered list;
- quote;
- callout;
- code;
- image;
- file;
- embed;
- table;
- database view;
- divider;
- toggle;
- columns.

## Interações do editor

- Enter cria bloco compatível.
- Backspace em bloco vazio combina ou altera tipo conforme contexto.
- `/` abre inserção por comando.
- seleção de texto abre toolbar contextual.
- alça aparece por hover, foco ou gesto equivalente.
- drag-and-drop reorganiza, mas deve haver ação alternativa.
- indent/outdent altera hierarquia.
- undo/redo preserva operações estruturais.
- autosave informa estado sem interromper.

## Segurança de edição

- preserve drafts localmente quando possível;
- trate conflitos de versão;
- indique offline e sincronização pendente;
- evite perda de dados ao navegar;
- permita recuperação após falha;
- registre autoria e atualização quando o produto é colaborativo.

## Colaboração

Considere:

- presença;
- cursores ou seleção remota;
- comentários e menções;
- permissões por página ou bloco;
- histórico de versões;
- resolução de conflito;
- notificações agrupadas;
- estado “visualizando” versus “editando”.

## Banco de dados ou coleção

Separe:

- entidade;
- esquema/propriedades;
- registros;
- visualizações;
- filtros;
- ordenação;
- agrupamento;
- fórmulas ou derivados;
- permissões.

Uma visualização é uma projeção dos mesmos dados, não uma cópia.

## Tabela

Inclua:

- cabeçalho claro;
- ordenação;
- seleção;
- redimensionamento quando aplicável;
- edição inline;
- coluna fixada em datasets largos;
- estados vazios;
- virtualização em grande volume;
- ações em lote;
- exportação quando relevante.

Não deixe todas as colunas visíveis por padrão. Priorize as essenciais.

## Kanban

- colunas representam uma propriedade real;
- cards exibem apenas metadados úteis;
- arrastar atualiza estado com feedback;
- forneça alternativa via menu;
- trate limite de coluna e permissões;
- preserve ordem;
- suporte filtro e busca.

## Calendário

- dia, semana, mês ou agenda conforme tarefa;
- eventos com contraste e texto;
- timezone explícito quando relevante;
- criação rápida;
- conflito ou sobreposição legível;
- navegação “Hoje”;
- modo agenda para acessibilidade e mobile.

## Timeline

- escala temporal ajustável;
- dependências claras;
- marco e duração distintos;
- scroll e zoom previsíveis;
- resumo em lista como alternativa;
- não dependa apenas de cor.

## Lista

Preferível quando:

- leitura sequencial importa;
- tela é compacta;
- os registros têm título e metadados principais;
- ações são simples.

## Galeria/grid

Preferível quando imagem, capa ou comparação visual é central. Evite para dados principalmente textuais.

## Filtros

- mostre filtros ativos;
- permita limpar todos;
- preserve filtros úteis;
- indique contagem de resultados;
- use linguagem do domínio;
- diferencie filtro, busca e ordenação.

## Propriedades

Tipos comuns:

- texto;
- número;
- moeda;
- status;
- select/multiselect;
- pessoa;
- data;
- relação;
- fórmula;
- checkbox;
- arquivo;
- URL;
- email;
- telefone.

Cada propriedade deve ter formatação, validação e edição apropriadas.

## Desempenho

- virtualize listas e tabelas grandes;
- carregue mídia sob demanda;
- debounce busca sem atrasar interação local;
- use optimistic UI com rollback;
- preserve scroll e seleção;
- evite re-render total do editor a cada tecla.



---

<!-- Source: references/07-states-feedback-motion.md -->

# 07 — Estados, feedback e movimento

## Estado é parte do design

Não entregue apenas o “happy path”. Modele estados como uma máquina previsível.

## Estados de tela

- inicial;
- carregando;
- carregamento progressivo;
- conteúdo completo;
- conteúdo parcial;
- vazio inicial;
- nenhum resultado;
- offline com cache;
- offline sem cache;
- erro recuperável;
- erro fatal;
- sem permissão;
- recurso bloqueado;
- atualização disponível;
- manutenção.

## Estados de ação

- idle;
- hover;
- focus;
- pressed;
- selected;
- loading;
- success;
- error;
- disabled;
- read-only.

## Feedback imediato

Toda ação deve responder rapidamente com pelo menos um sinal:

- mudança visual;
- estado pressed;
- spinner ou progresso;
- toast;
- atualização otimista;
- vibração/haptic quando apropriado;
- mensagem inline.

Não deixe o usuário repetir a ação por falta de feedback.

## Optimistic UI

Use quando:

- a ação é provável de funcionar;
- pode ser revertida;
- a latência prejudica a fluidez.

Inclua rollback e mensagem de falha. Não use para ações financeiras, destrutivas ou irreversíveis sem garantias adequadas.

## Autosave

Estados recomendados:

```text
Editando → Salvando → Salvo
                  ↘ Falha ao salvar
Offline → Alterações pendentes → Sincronizando → Sincronizado
```

- mantenha o indicador discreto;
- não mostre “Salvo” a cada tecla de forma chamativa;
- preserve conteúdo em falhas;
- permita retry;
- mostre conflito quando necessário.

## Progresso

- indeterminado: duração desconhecida;
- determinado: progresso mensurável;
- etapas: processo com marcos reais.

Não invente percentuais. Para tarefas longas, informe o que está acontecendo e permita cancelar quando seguro.

## Erros

Uma boa mensagem responde:

1. o que aconteceu;
2. o impacto;
3. o que fazer agora.

Exemplo:

```text
Não foi possível sincronizar suas alterações.
Elas continuam salvas neste dispositivo.
[Tentar novamente]
```

Evite códigos técnicos sem tradução. Preserve detalhes técnicos em logs ou seção expandível quando o público precisa deles.

## Empty states

### Vazio inicial

Ensina valor e primeira ação.

### Nenhum resultado

Explica que filtros ou busca removeram resultados e oferece limpar ou ajustar.

### Sem permissão

Explica a restrição e indica contato, solicitação ou retorno.

## Destruição e undo

Preferência:

1. undo imediato;
2. Trash com recuperação;
3. confirmação;
4. confirmação reforçada para alto risco.

Não confirme ações rotineiras de baixo risco.

## Motion principles

- movimento explica relação espacial e mudança de estado;
- duração curta em tarefas frequentes;
- entrada e saída preservam continuidade;
- não anime todas as propriedades;
- evite movimento que bloqueia toque;
- interrupções e reversões devem funcionar;
- suporte reduced motion.

## Padrões de movimento

### Fade

Para mudança de conteúdo leve e feedback.

### Slide

Para navegação, sheets e relação espacial.

### Scale discreto

Para menus e popovers, sem “zoom dramático”.

### Shared element

Use com parcimônia quando ajuda a perceber continuidade entre lista e detalhe.

### Reorder

Itens devem mover-se suavemente e o espaço de destino precisa ser visível.

## Haptics

Use apenas quando a plataforma e o contexto justificam:

- confirmação importante;
- seleção em controle;
- limite ou erro;
- conclusão.

Não use haptic em toda interação.



---

<!-- Source: references/08-accessibility-inclusion.md -->

# 08 — Acessibilidade e inclusão

## Meta

Trate acessibilidade como requisito de arquitetura, não como revisão final. Para web, mire WCAG 2.2 AA. Para apps nativos, siga as APIs e padrões de acessibilidade da plataforma.

## Percepção

- contraste suficiente para texto, ícones, bordas importantes e foco;
- estado não comunicado apenas por cor;
- texto sobre imagens com tratamento de contraste;
- suporte a high contrast quando disponível;
- descrições para imagens informativas;
- conteúdo decorativo oculto de leitores de tela.

## Operação

- alvos de toque confortáveis e espaçados;
- navegação completa por teclado no web/desktop;
- ordem de foco lógica;
- foco visível e não encoberto;
- alternativa a drag, swipe, long press e hover;
- atalhos não conflitantes e documentados;
- ações repetitivas agrupadas quando possível.

## Compreensão

- labels persistentes;
- instruções antes da ação;
- erros específicos e próximos do campo;
- linguagem simples;
- padrões consistentes;
- confirmação para ações de alto risco;
- ajuda contextual em vez de documentação distante.

## Robustez

- HTML semântico no web;
- roles apenas quando elementos nativos não resolvem;
- nomes, estados e valores acessíveis;
- announcements para mudanças assíncronas relevantes;
- componentes testados com screen reader;
- não criar controles customizados sem suporte equivalente ao nativo.

## Texto ampliado

- evite alturas fixas;
- permita quebra de linha;
- reflow sem perda de conteúdo;
- ajuste layouts com textos 200% ou tamanho de acessibilidade da plataforma;
- não truncar ações essenciais;
- use scroll quando necessário, não clipping.

## Alvos de interação

- iOS/iPadOS: siga regiões de toque da plataforma, normalmente 44×44 pt para controles importantes.
- Android: use alvos confortáveis próximos de 48×48 dp.
- Web: cumpra o mínimo WCAG e prefira áreas maiores para ações frequentes.

A área clicável pode ser maior que o ícone visual.

## Formulários

- associe label e campo;
- informe formato esperado;
- preserve valor após erro;
- não desabilite submit sem explicar requisitos;
- agrupe erros no topo em formulários longos e mantenha erros inline;
- suporte autofill e tipos de teclado adequados;
- evite desafios cognitivos desnecessários.

## Screen readers

- icon buttons precisam de nome;
- badges e estados precisam de descrição útil;
- listas, headings, landmarks e tabelas devem ter estrutura;
- ordem de leitura deve seguir a ordem visual e lógica;
- mudanças de rota precisam atualizar foco ou título;
- modais devem confinar foco e devolvê-lo à origem.

## Teclado e foco

- Tab percorre controles em ordem;
- Shift+Tab retorna;
- Enter/Space acionam controles conforme semântica;
- Esc fecha elementos temporários quando seguro;
- setas navegam menus, tabs e grids conforme padrão;
- foco não desaparece atrás de sticky bars, sheets ou teclado.

## Movimento

- respeite `prefers-reduced-motion` ou configuração nativa;
- desative parallax, zoom e deslocamentos grandes;
- mantenha feedback de estado mesmo sem animação;
- evite flashes e padrões que causam desconforto.

## Áudio, vídeo e voz

- legendas para fala;
- transcrição quando necessário;
- controles acessíveis;
- não depender de áudio para feedback único;
- entrada por voz precisa de alternativa manual.

## Inclusão cognitiva

- uma ação principal por etapa;
- mensagens curtas e específicas;
- padrões previsíveis;
- progresso visível;
- possibilidade de revisar antes de concluir;
- evitar timeout curto;
- salvar rascunho.

## Localização

- aceite expansão de texto;
- não concatene frases em código;
- suporte plural, data, número, moeda e fuso;
- prepare RTL;
- não incorpore texto em imagens;
- revise ícones direcionais em RTL.

## Testes mínimos

- teclado completo;
- screen reader básico;
- contraste;
- zoom/texto ampliado;
- reduced motion;
- orientação e reflow;
- mensagens de erro;
- alvos de toque;
- localização com strings longas.



---

<!-- Source: references/09-platform-guidelines.md -->

# 09 — Diretrizes por plataforma

## Regra geral

Mantenha a identidade visual compartilhada, mas adapte comportamento, navegação, gestos e componentes às expectativas da plataforma. Consistência não significa aparência idêntica em todo lugar.

## iOS e iPadOS

- use safe areas e barras do sistema corretamente;
- preserve gesto e comportamento de back;
- prefira componentes e transições nativas;
- suporte Dynamic Type;
- use sheets, context menus e swipe actions de forma coerente;
- mantenha hit regions adequadas;
- no iPad, considere sidebar, multi-column, teclado, pointer e multitarefa;
- não imite Android bottom sheets ou back behavior sem adaptação.

## Android

- projete edge-to-edge com insets corretos;
- preserve back do sistema e predictive back quando suportado;
- adapte a classes de tamanho de janela;
- use navigation bar, rail ou drawer conforme largura e destinos;
- suporte tema do sistema, font scale e contrastes;
- use padrões Material apenas como comportamento/plataforma, sem perder identidade;
- teste split screen, foldables e diferentes fabricantes.

## React Native

- use componentes acessíveis e APIs de plataforma;
- evite depender excessivamente de medidas fixas;
- trate safe area, keyboard avoidance e status/navigation bars;
- use navegação consolidada do projeto;
- mantenha tokens em TypeScript ou JSON;
- isole diferenças de plataforma quando realmente necessárias;
- teste desempenho de listas e animações no dispositivo.

## Flutter

- use constraints e layouts adaptativos;
- configure ThemeData/ColorScheme/TextTheme como fonte de verdade;
- prefira widgets semânticos e foco configurado;
- trate MediaQuery, text scaling, safe area e teclado;
- evite widgets profundamente aninhados sem necessidade;
- teste Android e iOS, não apenas um simulador.

## SwiftUI

- use Environment para size class, color scheme, dynamic type e accessibility;
- componha Views pequenas;
- use NavigationStack/SplitView conforme estrutura;
- preserve state, scene lifecycle e deep links;
- prefira controles nativos e accessibility modifiers.

## Jetpack Compose

- use MaterialTheme como sistema, adaptado à marca;
- use WindowSizeClass/adaptive layouts;
- aplique semantics e focus;
- preserve state com APIs adequadas;
- use LazyColumn/LazyGrid em conteúdo grande;
- trate insets e ime padding.

## Web app e PWA

- layout responsivo e navegável por teclado;
- HTML semântico;
- URLs e histórico corretos;
- estados de conexão e atualização do service worker;
- suporte a mouse, touch, teclado e zoom;
- não esconder ações essenciais no hover;
- foco visível;
- tabelas e painéis adaptativos;
- instalação PWA apenas quando há valor real.

## Desktop

- suporte redimensionamento;
- menus, atalhos e context menus;
- densidade maior quando necessário;
- estados hover e focus;
- seleção múltipla;
- drag-and-drop com alternativa;
- janelas e painéis persistentes;
- não ampliar simplesmente a UI mobile.

## Tablet

- explore duas ou três colunas quando útil;
- use painel de contexto;
- suporte teclado e pointer;
- preserve usabilidade no touch;
- evite regiões excessivamente largas;
- considere orientação e multitarefa.

## Forma de entrega de assets

### Ícones

- SVG para web e pipelines vetoriais;
- PDF/vector assets ou símbolos nativos em iOS;
- vector drawable em Android;
- componentes ou fontes de ícones apenas quando já padronizados.

### Imagens

- WebP/AVIF para web quando suportado;
- PNG para transparência e compatibilidade;
- JPEG para fotografia quando tamanho importa;
- múltiplas densidades ou assets vetoriais em mobile;
- dimensões corretas para evitar upscale.

### Animações

- nativas ou vetoriais leves;
- Lottie/Rive apenas quando justificado e acessível;
- fallback estático e reduced motion.



---

<!-- Source: references/10-code-architecture.md -->

# 10 — Arquitetura de código

## Princípios

- siga a stack existente;
- separe domínio, dados, estado e apresentação;
- use componentes semânticos;
- centralize tokens;
- evite telas monolíticas;
- preserve testabilidade;
- introduza dependências apenas com justificativa.

## Estrutura conceitual

```text
app/
components/
  primitives/
  navigation/
  forms/
  feedback/
  data-display/
  blocks/
features/
  <feature>/
    components/
    hooks-or-state/
    services/
    types/
    tests/
design-system/
  tokens/
  themes/
  icons/
lib/
assets/
tests/
```

Adapte ao framework. Não reorganize um projeto inteiro apenas para coincidir com esta árvore.

## Componentes

- primitive: baixo nível e semântica visual;
- composite: combinação reutilizável;
- feature component: específico do domínio;
- screen/page: orquestra layout e dados.

Evite passar dezenas de props de estilo para um primitive. Defina variantes.

## Estado

Classifique:

- estado local de interação;
- estado de formulário;
- estado de rota;
- estado servidor/cache;
- estado global real;
- estado persistido.

Não coloque tudo em uma store global.

## Dados assíncronos

- loading, error, stale e retry explícitos;
- cancelamento de requests quando necessário;
- cache e invalidação previsíveis;
- optimistic update com rollback;
- paginação ou cursor;
- proteção contra respostas fora de ordem.

## Formulários

- validação no cliente para feedback;
- validação no servidor para segurança;
- schema compartilhado quando viável;
- mensagens por campo;
- preservação de draft;
- prevenção de submit duplicado;
- acessibilidade e autofill.

## Tokens

Fonte canônica única. Gere adaptações para plataforma quando necessário.

Evite:

```text
<brand-color> repetida em 40 arquivos
padding: 17 em uma tela isolada
border-radius diferente em cada componente
```

Prefira:

```text
color.action.primary
space.control.inline
radius.control
```

## Temas

- tema claro e escuro com tokens semânticos;
- não condicionar cores diretamente em cada componente;
- suporte a sistema e preferência manual quando o produto pede;
- persistência da preferência;
- evitar flash de tema no web.

## Ícones

Crie wrapper ou convenção comum para:

- tamanho;
- stroke/weight;
- cor;
- label acessível;
- direção RTL;
- estado ativo.

## Testes

### Unitários

- formatadores;
- reducers/state machines;
- validações;
- utilitários;
- transformação de tokens.

### Componentes

- variantes;
- estados;
- eventos;
- acessibilidade;
- texto longo;
- loading/erro.

### Integração

- formulário;
- navegação;
- busca/filtro;
- autosave;
- offline/retry.

### E2E

- fluxo principal;
- autenticação;
- criação/edição;
- ação destrutiva e recuperação;
- responsividade crítica.

### Visual regression

Use quando a stack possui suporte. Compare componentes e telas em larguras representativas.

## Observabilidade de execução

Ao executar comandos:

- registre etapa atual;
- preserve stdout/stderr;
- informe duração;
- pare em erro crítico;
- diferencie warning de failure;
- não declare sucesso sem código de saída ou evidência equivalente.

## Migração e refatoração

- faça mudanças incrementais;
- mantenha compatibilidade;
- crie adapters quando necessário;
- migre tokens e componentes por domínio;
- remova código antigo apenas após confirmar uso;
- rode busca por referências antes de excluir.

## Dependências

Antes de adicionar uma biblioteca, verifique:

- se o projeto já possui solução equivalente;
- tamanho e impacto;
- manutenção;
- compatibilidade de plataforma;
- acessibilidade;
- licenciamento;
- necessidade real.



---

<!-- Source: references/11-quality-assurance.md -->

# 11 — Garantia de qualidade

## Gate 1 — Produto e fluxo

- O propósito da tela é evidente?
- O usuário sabe qual é a próxima ação?
- A ação principal conclui uma tarefa real?
- A navegação tem retorno previsível?
- Dados e permissões necessários estão modelados?

## Gate 2 — Hierarquia visual

- Título, conteúdo e metadados têm níveis distintos?
- Há uma única âncora dominante?
- O acento está reservado ao que importa?
- Bordas e sombras são necessárias?
- O espaçamento segue ritmo?
- A linha de leitura está controlada?

## Gate 3 — Componentes

- Componentes semelhantes usam a mesma implementação?
- Variantes são semânticas?
- Estados estão completos?
- Ícones seguem uma família?
- Textos e números não quebram o layout?

## Gate 4 — Responsividade

- Telefone estreito funciona?
- Telefone amplo funciona?
- Tablet ou largura média reorganiza conteúdo?
- Desktop não é apenas mobile esticado?
- Landscape, split view e teclado virtual foram considerados?
- Tabelas e painéis têm estratégia em largura compacta?

## Gate 5 — Acessibilidade

- Contraste adequado?
- Foco visível?
- Ordem de foco lógica?
- Icon buttons nomeados?
- Alvos confortáveis?
- Texto ampliado sem clipping?
- Alternativa para drag/swipe/hover?
- Erros anunciados e associados aos campos?
- Reduced motion respeitado?

## Gate 6 — Conteúdo

- Sem Lorem ipsum?
- Labels usam linguagem do domínio?
- Erros dizem o que fazer?
- Empty states orientam?
- Ações usam verbos específicos?
- Datas, números e moedas estão localizados?

## Gate 7 — Estados

- loading;
- empty;
- no results;
- partial;
- error;
- offline;
- permission;
- saving;
- saved;
- failure;
- success.

Apenas os estados relevantes precisam existir, mas nenhum estado provável deve ser ignorado.

## Gate 8 — Código

- Build passa?
- Type check passa?
- Lint passa?
- Testes passam?
- Não há valores mágicos repetidos?
- Não há componente monolítico sem necessidade?
- Não há dependência desnecessária?
- Sem secrets ou dados pessoais?
- Logs não expõem conteúdo sensível?

## Gate 9 — Desempenho

- listas grandes virtualizadas?
- imagens dimensionadas e comprimidas?
- loading progressivo?
- animações fluidas?
- sem re-render excessivo?
- bundle ou binário sem dependências desnecessárias?

## Gate 10 — Originalidade

- A interface possui identidade própria?
- Não reproduz outra marca, ícones exclusivos ou copy?
- A estrutura foi adaptada à tarefa do produto?
- O resultado poderia ser reconhecido como o próprio projeto?

## Evidências de conclusão

Registre:

- comandos executados;
- códigos de saída;
- testes realizados;
- larguras/dispositivos verificados;
- screenshots quando disponíveis;
- limitações reais;
- arquivos alterados.

Use `templates/qa-checklist.md` para uma entrega formal.



---

<!-- Source: references/12-deliverables.md -->

# 12 — Entregáveis

## Entrega de conceito

- resumo do produto;
- público e problema;
- princípios de experiência;
- direção visual;
- riscos e premissas.

## Arquitetura da informação

- sitemap ou mapa de telas;
- hierarquia;
- rotas;
- navegação;
- entidades;
- permissões;
- deep links.

## Fluxos

Para cada fluxo:

- entrada;
- objetivo;
- etapas;
- decisões;
- erros;
- saída;
- recuperação;
- eventos analíticos relevantes.

## Design system

- tokens;
- temas;
- tipografia;
- ícones;
- componentes;
- variantes;
- estados;
- padrões;
- acessibilidade;
- exemplos.

## Especificação de tela

Use `templates/screen-spec.md` e inclua:

- objetivo;
- rota;
- anatomia;
- conteúdo;
- ações;
- estados;
- comportamento responsivo;
- acessibilidade;
- analytics;
- critérios de aceitação.

## Especificação de componente

Use `templates/component-spec.md`.

## Handoff técnico

- stack;
- estrutura de arquivos;
- tokens;
- assets e formatos;
- comportamento;
- APIs ou mocks;
- comandos de execução;
- testes;
- limitações.

## Implementação

Quando o pedido é código, entregue:

- arquivos funcionais;
- dependências justificadas;
- instruções de execução;
- testes;
- relatório de validação;
- screenshots ou preview quando possível.

## Formatos

Conforme a necessidade:

- Markdown para especificações;
- JSON para tokens, conteúdo e contratos;
- CSV para inventário de telas/componentes;
- SVG para ícones e vetores;
- PNG/WebP/AVIF/JPEG para raster;
- código nativo ou cross-platform;
- Storybook, catálogo ou showcase para componentes;
- vídeo curto ou GIF apenas para demonstrar movimento, com alternativa textual.

## Inventário CSV sugerido

```csv
id,type,name,route,platform,status,priority,owner,states,responsive,a11y,tested
SCR-001,screen,Home,/home,mobile,implemented,high,team,"loading|empty|data|error",yes,yes,yes
CMP-001,component,PrimaryButton,,all,implemented,high,design-system,"default|hover|focus|pressed|loading|disabled",yes,yes,yes
```



---

<!-- Source: references/13-content-ux-writing.md -->

# 13 — Conteúdo e UX writing

## Voz

- clara;
- direta;
- humana;
- breve;
- específica;
- respeitosa;
- sem jargão desnecessário.

## Ações

Use verbo + objeto quando o contexto não é óbvio:

- Criar projeto;
- Salvar alterações;
- Enviar convite;
- Excluir tarefa;
- Tentar novamente.

Evite:

- OK;
- Continuar, quando não diz o resultado;
- Confirmar, sem explicar o que será confirmado;
- Sim/Não em perguntas complexas.

## Títulos

- descrevem a tarefa ou conteúdo;
- sentence case;
- não repetem toda a navegação;
- evitam slogans em telas operacionais.

## Labels

- persistentes;
- curtos;
- específicos;
- alinhados ao vocabulário do usuário;
- não dependem de placeholder.

## Ajuda

- mostre antes do erro quando o requisito é incomum;
- mantenha próxima ao campo;
- explique formato com exemplo realista;
- não sobrecarregue todos os campos com texto auxiliar.

## Erros

Ruim:

```text
Erro 400. Requisição inválida.
```

Melhor:

```text
Não foi possível salvar o projeto.
Revise os campos destacados e tente novamente.
```

Inclua detalhes técnicos somente quando o público precisa ou em área copiável.

## Empty state

Estrutura:

```text
Título: estado atual
Corpo: valor ou motivo
CTA: primeira ação
```

Exemplo:

```text
Nenhuma nota ainda
Crie uma nota para registrar ideias e organizar referências.
[Criar nota]
```

## Permissões

Antes do prompt do sistema:

- explique o recurso;
- explique o benefício;
- diga quando será usado;
- ofereça alternativa quando possível.

## Confirmação destrutiva

- nomeie o objeto;
- explique impacto;
- diga se pode ser recuperado;
- ação destrutiva com verbo explícito;
- cancelamento seguro.

## IA generativa

- não trate saída como verdade garantida;
- informe quando foi gerada;
- ofereça revisão e edição;
- cite fontes quando o produto suporta;
- mantenha feedback de streaming e cancelamento;
- explique uso de dados quando relevante.

## Localização

- evite texto dentro de imagens;
- use parâmetros e plurais do sistema;
- não concatene frases;
- prepare expansão de 30–50%;
- use formatos locais;
- revise termos culturalmente ambíguos.



---

<!-- Source: references/14-performance-security.md -->

# 14 — Desempenho, privacidade e segurança

## Desempenho percebido

- mostre estrutura rapidamente;
- use cache e conteúdo anterior quando seguro;
- carregue conteúdo acima da dobra primeiro;
- preserve layout para evitar saltos;
- use optimistic UI em ações reversíveis;
- não bloqueie toda a tela por uma atualização local.

## Listas e conteúdo grande

- virtualização;
- paginação ou cursor;
- thumbnails;
- lazy loading;
- busca indexada;
- evitar cálculos pesados no thread principal;
- cancelar trabalho obsoleto.

## Imagens

- tamanho correto para o destino;
- compressão adequada;
- formatos modernos quando suportados;
- placeholders discretos;
- cache;
- alt text para conteúdo informativo;
- remover metadados sensíveis quando necessário.

## Movimento

- animar propriedades eficientes;
- limitar blur e filtros caros;
- testar em dispositivo intermediário;
- evitar animações simultâneas excessivas;
- reduced motion.

## Offline

Defina:

- o que funciona offline;
- o que fica somente leitura;
- o que entra em fila;
- como conflitos são resolvidos;
- como o usuário vê pendências;
- como retry acontece.

## Privacidade na UI

- minimize coleta;
- explique uso de dados;
- permita revisar e excluir quando aplicável;
- masque dados sensíveis;
- evite dados reais em screenshots, logs e fixtures;
- bloqueie previews em app switcher quando o domínio exige;
- trate clipboard e compartilhamento com cuidado.

## Autorização

- esconder um botão não substitui autorização no backend;
- explique estado sem permissão;
- não revele existência de recursos confidenciais;
- confirme mudança de papel ou compartilhamento;
- mostre escopo de acesso antes de conceder.

## Ações sensíveis

Para pagamento, exclusão permanente, alteração de credencial, assinatura ou publicação:

- confirme intenção;
- mostre objeto e consequência;
- evite submit duplicado;
- registre resultado;
- ofereça recibo, histórico ou recuperação quando possível.

## Conteúdo externo

- sanitize HTML e rich text;
- trate URLs e deep links;
- não execute conteúdo não confiável;
- indique domínio antes de sair quando necessário;
- valide uploads por tipo real e tamanho;
- não confie apenas na extensão do arquivo.

## Logs

- sem senhas, tokens, conteúdo privado ou dados pessoais desnecessários;
- IDs técnicos somente quando úteis e protegidos;
- mensagens de erro para usuário separadas de diagnóstico;
- monitore falhas sem expor conteúdo.



---

<!-- Source: references/15-reference-sources.md -->

# 15 — Fontes de referência

Use fontes oficiais e atuais quando uma decisão depende de padrões ou APIs que podem mudar.

## Claude Code

- Documentação oficial de Skills do Claude Code.
- Padrão aberto Agent Skills.
- Documentação oficial de hooks, settings e subagents quando utilizados.

## Acessibilidade web

- W3C Web Content Accessibility Guidelines 2.2.
- WAI Understanding Documents e Techniques.
- ARIA Authoring Practices para padrões customizados.

## Apple

- Apple Human Interface Guidelines.
- Accessibility e developer documentation das APIs usadas.
- Recursos de design oficiais com atenção aos termos de licença.

## Android

- Android Developers.
- Material Design 3 para comportamento e adaptação.
- Adaptive Apps e Window Size Classes.
- Accessibility developer guidance.

## Frameworks

Consulte documentação oficial da stack detectada:

- React Native;
- Flutter;
- SwiftUI;
- Jetpack Compose;
- React/Next.js;
- Vue/Nuxt;
- Svelte/SvelteKit;
- Electron/Tauri.

## Regra de pesquisa

- priorize documentação oficial e especificações;
- verifique versão do projeto antes de aplicar API;
- não invente suporte;
- registre quando a orientação é inferência;
- evite copiar assets ou templates cuja licença não permita uso.



---

<!-- Source: references/16-visual-validation.md -->

# 16 — Validação visual

## Objetivo

Confirmar que a interface funciona visualmente no app em execução, não apenas no código.

## Processo

1. Execute o app.
2. Abra a rota ou fluxo alterado.
3. Capture estados representativos.
4. Compare com brief, screenshot ou especificação.
5. Corrija diferenças de estrutura antes de detalhes cosméticos.
6. Repita em larguras e temas relevantes.

## Ordem de comparação

1. estrutura e navegação;
2. tamanho e posição das regiões;
3. hierarquia tipográfica;
4. espaçamento e alinhamento;
5. cores e superfícies;
6. estados interativos;
7. ícones e assets;
8. microdetalhes.

## Matriz de screenshots

Quando relevante, capture:

- compact light;
- compact dark;
- expanded light;
- expanded dark;
- loading;
- empty;
- data;
- error;
- focused input;
- modal/sheet;
- texto ampliado.

## Tolerâncias

Não busque pixel-perfect contra outro produto. Busque fidelidade ao brief e consistência interna.

Aceite pequenas diferenças decorrentes de:

- renderização de fonte;
- plataforma;
- densidade;
- antialiasing;
- controles nativos.

Não aceite:

- clipping;
- sobreposição;
- quebra de hierarquia;
- contraste insuficiente;
- ação inacessível;
- componente desalinhado;
- estado ausente;
- layout quebrado em largura suportada.

## Comparação por imagem

Quando ferramentas permitem:

- use diffs com máscara para conteúdo dinâmico;
- mantenha baseline versionado;
- revise mudanças intencionais;
- não atualize baseline apenas para fazer o teste passar;
- associe screenshots ao componente ou fluxo.

## Relatório

Registre:

- ambiente;
- tamanho da viewport ou dispositivo;
- tema;
- estado;
- resultado;
- diferenças;
- correção aplicada;
- limitações.



---

<!-- Source: templates/app-brief.md -->

# App Brief

## Identificação

- Nome do produto:
- Plataforma:
- Stack:
- Idioma principal:
- Público:
- Estágio: conceito | MVP | produção | refatoração

## Problema

- Problema principal:
- Situação atual:
- Resultado desejado:
- Métrica de sucesso:

## Usuário

- Perfil principal:
- Nível de experiência:
- Contexto de uso:
- Necessidades de acessibilidade:

## Tarefas principais

1.
2.
3.

## Conteúdo e dados

- Entidades:
- Relações:
- Volume esperado:
- Dados sensíveis:
- Offline:
- Colaboração:

## Navegação

- Destinos principais:
- Fluxo principal:
- Deep links:
- Autenticação:
- Permissões:

## Identidade

- Personalidade:
- Cor de acento:
- Paleta existente:
- Tipografia existente:
- Ícones:
- Assets:
- Restrições de marca:

## Telas

| ID | Tela | Objetivo | Prioridade | Estados |
|---|---|---|---|---|
| SCR-001 | | | | loading, empty, data, error |

## Requisitos técnicos

- Framework:
- Bibliotecas existentes:
- API/backend:
- Analytics:
- Testes:
- Comandos de execução:

## Restrições

- Prazo:
- Compatibilidade:
- Segurança/privacidade:
- Itens fora de escopo:

## Critérios de aceitação

- [ ]
- [ ]
- [ ]



---

<!-- Source: templates/screen-spec.md -->

# Especificação de tela — <Nome>

## Metadados

- ID:
- Rota:
- Plataforma:
- Prioridade:
- Responsável:
- Status:

## Objetivo

## Entrada e saída

- Origem:
- Próximo destino:
- Back behavior:
- Deep link:

## Usuário e tarefa

- Usuário:
- Tarefa principal:
- Critério de sucesso:

## Anatomia

1. App bar/contexto
2. Título e metadados
3. Ação principal
4. Ferramentas locais
5. Conteúdo
6. Feedback
7. Navegação

## Conteúdo

| Elemento | Texto/dado | Regra |
|---|---|---|
| Título | | |

## Ações

| Ação | Gatilho | Resultado | Erro | Analytics |
|---|---|---|---|---|
| | | | | |

## Estados

- [ ] Loading
- [ ] Skeleton
- [ ] Data
- [ ] Empty
- [ ] No results
- [ ] Partial
- [ ] Offline
- [ ] Error
- [ ] Permission
- [ ] Saving
- [ ] Saved
- [ ] Success

## Responsividade

### Compacta

### Média

### Expandida

### Landscape/split

## Acessibilidade

- Ordem de foco:
- Labels acessíveis:
- Headings/landmarks:
- Text scaling:
- Alternativas a gesto:
- Announcements:

## Movimento

## Dados e API

## Segurança e privacidade

## Critérios de aceitação

- [ ]
- [ ]
- [ ]



---

<!-- Source: templates/component-spec.md -->

# Especificação de componente — <Nome>

## Objetivo

## Anatomia

## API conceitual

```text
<Component
  variant=""
  size=""
  state=""
  leading=""
  trailing=""
>
  Content
</Component>
```

## Variantes

| Variante | Uso | Não usar quando |
|---|---|---|
| | | |

## Tamanhos

## Estados

- default;
- hover;
- focus;
- pressed;
- selected;
- loading;
- disabled;
- error;
- success.

## Tokens

| Propriedade | Token |
|---|---|
| Background | |
| Text | |
| Border | |
| Radius | |
| Padding | |
| Gap | |
| Motion | |

## Conteúdo

## Comportamento

## Responsividade

## Acessibilidade

- Role/semântica:
- Nome:
- Estado/valor:
- Teclado:
- Screen reader:
- Touch target:
- Reduced motion:

## Exemplos corretos

## Anti-exemplos

## Testes

- [ ] Render
- [ ] Variantes
- [ ] Eventos
- [ ] Teclado
- [ ] Screen reader
- [ ] Texto longo
- [ ] Tema escuro
- [ ] Responsividade



---

<!-- Source: templates/qa-checklist.md -->

# Checklist de QA — Editorial Modular App

## Identificação

- Projeto:
- Versão/commit:
- Plataforma:
- Ambiente:
- Data:
- Responsável:

## Produto

- [ ] Objetivo da tela claro
- [ ] Ação principal evidente
- [ ] Fluxo principal concluível
- [ ] Back/deep link corretos

## Visual

- [ ] Hierarquia consistente
- [ ] Tokens aplicados
- [ ] Espaçamento consistente
- [ ] Ícones consistentes
- [ ] Sem card nesting excessivo
- [ ] Sem sombra/gradiente arbitrário
- [ ] Identidade original

## Estados

- [ ] Loading
- [ ] Empty
- [ ] No results
- [ ] Error/retry
- [ ] Offline
- [ ] Permission
- [ ] Saving/saved/failure
- [ ] Success

## Responsividade

- [ ] Telefone estreito
- [ ] Telefone amplo
- [ ] Tablet/largura média
- [ ] Desktop/largura expandida
- [ ] Landscape/split
- [ ] Teclado virtual
- [ ] Texto ampliado

## Acessibilidade

- [ ] Contraste
- [ ] Focus visível
- [ ] Ordem de foco
- [ ] Labels de icon buttons
- [ ] Touch targets
- [ ] Screen reader
- [ ] Alternativa a gestos
- [ ] Reduced motion
- [ ] Localização/RTL quando aplicável

## Código

- [ ] Format
- [ ] Lint
- [ ] Type check
- [ ] Unit tests
- [ ] Integration tests
- [ ] E2E principal
- [ ] Build
- [ ] Sem dados sensíveis
- [ ] Sem dependência injustificada

## Evidências

| Verificação | Comando/dispositivo | Resultado | Evidência |
|---|---|---|---|
| | | | |

## Falhas conhecidas

## Resultado final

- [ ] Aprovado
- [ ] Aprovado com ressalvas
- [ ] Reprovado



---

<!-- Source: templates/handoff.md -->

# Handoff técnico

## Resumo

## Stack

- Framework:
- Linguagem:
- Navegação:
- Estado:
- Estilos/tokens:
- Testes:

## Arquivos

| Caminho | Função | Alteração |
|---|---|---|
| | | |

## Design system

- Fonte dos tokens:
- Tema claro:
- Tema escuro:
- Tipografia:
- Ícones:
- Componentes novos:

## Fluxos implementados

## Estados implementados

## Responsividade

## Acessibilidade

## Assets

| Arquivo | Formato | Dimensão | Uso | Licença/origem |
|---|---|---:|---|---|
| | | | | |

## Comandos

```bash
# instalar

# executar

# lint

# testes

# build
```

## Validação executada

| Etapa | Resultado | Duração | Observação |
|---|---|---:|---|
| | | | |

## Limitações e riscos

## Próxima ação material

