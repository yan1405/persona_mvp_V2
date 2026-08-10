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
