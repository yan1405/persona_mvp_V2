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
