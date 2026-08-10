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
