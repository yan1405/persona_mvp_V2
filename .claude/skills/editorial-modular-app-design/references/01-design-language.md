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
