# 12 — Entregáveis

## Entrega de conceito

- resumo do produto;
- público e problema;
- princípios de experiência;
- direção visual;
- riscos e premissas.

## Arquitetura da informação

- sitemap ou mapa de telas;
- hierarquia;
- rotas;
- navegação;
- entidades;
- permissões;
- deep links.

## Fluxos

Para cada fluxo:

- entrada;
- objetivo;
- etapas;
- decisões;
- erros;
- saída;
- recuperação;
- eventos analíticos relevantes.

## Design system

- tokens;
- temas;
- tipografia;
- ícones;
- componentes;
- variantes;
- estados;
- padrões;
- acessibilidade;
- exemplos.

## Especificação de tela

Use `templates/screen-spec.md` e inclua:

- objetivo;
- rota;
- anatomia;
- conteúdo;
- ações;
- estados;
- comportamento responsivo;
- acessibilidade;
- analytics;
- critérios de aceitação.

## Especificação de componente

Use `templates/component-spec.md`.

## Handoff técnico

- stack;
- estrutura de arquivos;
- tokens;
- assets e formatos;
- comportamento;
- APIs ou mocks;
- comandos de execução;
- testes;
- limitações.

## Implementação

Quando o pedido é código, entregue:

- arquivos funcionais;
- dependências justificadas;
- instruções de execução;
- testes;
- relatório de validação;
- screenshots ou preview quando possível.

## Formatos

Conforme a necessidade:

- Markdown para especificações;
- JSON para tokens, conteúdo e contratos;
- CSV para inventário de telas/componentes;
- SVG para ícones e vetores;
- PNG/WebP/AVIF/JPEG para raster;
- código nativo ou cross-platform;
- Storybook, catálogo ou showcase para componentes;
- vídeo curto ou GIF apenas para demonstrar movimento, com alternativa textual.

## Inventário CSV sugerido

```csv
id,type,name,route,platform,status,priority,owner,states,responsive,a11y,tested
SCR-001,screen,Home,/home,mobile,implemented,high,team,"loading|empty|data|error",yes,yes,yes
CMP-001,component,PrimaryButton,,all,implemented,high,design-system,"default|hover|focus|pressed|loading|disabled",yes,yes,yes
```
