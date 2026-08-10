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
