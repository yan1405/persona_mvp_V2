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
