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
