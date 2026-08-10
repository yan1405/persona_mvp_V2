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
