# Protocolo de Avaliação Visual por Fase

Status: obrigatório para todo o projeto Persona MVP v2.

## 1. Regra de aprovação

Toda fase do projeto deve terminar com uma **Sessão de Avaliação Visual** apresentada a Yan Guilherme Oliveira da Silva. A fase seguinte não pode começar enquanto Yan não aprovar explicitamente o resultado visual ou as correções acordadas.

Essa regra também vale quando o código está funcional e todos os testes técnicos passaram. Aprovação técnica não substitui aprovação visual.

## 2. Referências obrigatórias

Cada avaliação deve comparar o resultado com:

1. `docs/design/design-dna.json`;
2. `docs/design/DESIGN_DNA_ADAPTATION.md`;
3. `docs/design/BRAND_FOUNDATION.md` e os logos locais em `apps/web/public/brand/`;
4. telas, imagens, layouts e composições aprovadas do projeto CRM em `C:\Users\yansi\Projetos\crm`, somente para estrutura, densidade, geometria e comportamento;
5. contrato de tela ou fluxo aprovado para a fase;
6. skills `editorial-modular-app-design` e `design-sem-cara-de-ia`.

A interface, as imagens, os layouts e os assets da Persona v1 não podem ser utilizados na comparação visual. A única exceção é a paleta original e os logos oficiais já aprovados, documentados e copiados para a v2.

## 3. Conteúdo da sessão

Quando houver interface executável, a sessão deve apresentar:

- screenshots reais do app, não somente código ou descrição;
- visão geral da fase e fluxo principal demonstrado;
- comparação de estrutura, proporções, tipografia, espaçamento, cores, superfícies, ícones e estados;
- estados representativos: carregando, vazio, preenchido, erro, foco e painel/modal, quando aplicáveis;
- larguras desktop de 1024, 1280, 1440 e 1920px, proporcionais ao risco da alteração;
- divergências conhecidas, com justificativa e proposta de correção;
- três elementos potencialmente genéricos identificados pela autocrítica `design-sem-cara-de-ia` e a decisão de remover ou manter cada um;
- lista objetiva do que precisa da aprovação de Yan.

Quando a fase ainda não possuir interface executável, a sessão deve apresentar o contrato visual, o mapa de telas ou o wireframe correspondente e registrar a aprovação antes da implementação.

## 4. Ordem de avaliação

Avaliar sempre nesta ordem:

1. arquitetura da tela e navegação;
2. tamanho e posição das regiões;
3. hierarquia e densidade da informação;
4. tipografia;
5. espaçamento e alinhamento;
6. cores, bordas e superfícies;
7. componentes e estados;
8. ícones, imagens e linguagem do Xisto quando aplicável;
9. movimento e microinterações;
10. acessibilidade visual e foco.

Corrigir primeiro divergências estruturais. Não gastar tempo polindo microdetalhes de uma composição ainda não aprovada.

## 5. Registro mínimo

Cada sessão deve gerar ou atualizar um arquivo em `docs/reviews/` com:

```text
fase:
data:
rotas avaliadas:
viewports:
estados:
referências comparadas:
aderências:
divergências:
correções solicitadas:
decisão de Yan: pendente | aprovado | aprovado com ajustes | reprovado
```

Screenshots da avaliação devem ficar em `docs/reviews/<fase>/` quando forem produzidos.

## 6. Gate de continuidade

Somente `aprovado` ou `aprovado com ajustes` explicitamente autorizado por Yan permite avançar. Se a decisão for `pendente` ou `reprovado`, o agente deve permanecer na fase, aplicar as correções e apresentar nova sessão visual.

## 7. Checkpoint de teste e eficiência

Cada entrega de fase deve incluir também um checkpoint curto para Yan com:

- o que foi implementado;
- o que pode ser testado pelo usuário, em passos objetivos;
- o resultado esperado de cada teste;
- limitações ou pendências conhecidas;
- o que foi simplificado, reaproveitado ou automatizado para reduzir tempo e complexidade.

Esse checkpoint complementa a avaliação visual e não substitui testes técnicos, segurança ou aprovação explícita.
