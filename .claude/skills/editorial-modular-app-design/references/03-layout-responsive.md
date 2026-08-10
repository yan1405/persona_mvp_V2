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
