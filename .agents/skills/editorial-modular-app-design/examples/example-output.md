# Exemplo resumido — Aplicativo de notas de pesquisa

## UI contract

- Plataforma: mobile + tablet, React Native.
- Usuário: estudante ou pesquisador que captura, relaciona e recupera notas.
- Tarefa principal: criar uma nota e conectá-la a um tema.
- Navegação: bottom navigation em largura compacta; rail em tablet.
- Destinos: Notas, Explorar, Coleções, Perfil.
- Estilo: editorial modular, superfícies neutras, acento azul-petróleo configurável.

## Fluxo principal

```text
Notas → Nova nota → Editor em blocos → Adicionar tema → Salvo automaticamente
```

## Telas

1. Lista de notas.
2. Editor.
3. Busca global.
4. Coleção.
5. Perfil/configurações.

## Estados da lista

- skeleton inicial;
- notas agrupadas por data;
- vazio inicial com CTA “Criar primeira nota”;
- nenhum resultado com ação “Limpar busca”;
- offline com banner e cache;
- erro com retry.

## Composição da tela de notas

- top app bar com título e avatar;
- busca persistente;
- filtro por coleção em chips;
- lista de linhas editoriais, não cards;
- FAB ou botão contextual para criação, conforme plataforma;
- metadados secundários: data, tema e quantidade de conexões.

## Editor

- título inline;
- propriedades recolhíveis;
- blocos de texto, heading, checklist, quote, imagem e arquivo;
- comando `/`;
- autosave discreto;
- toolbar de seleção;
- alça de bloco em pointer/hover e menu equivalente em touch;
- recuperação de draft.

## Tokens

```text
canvas: neutral.50
surface: neutral.0
text.primary: neutral.900
text.muted: neutral.500
action.primary: accent.600
selected.background: accent.50
border.subtle: neutral.200
```

## Responsividade

- compacta: uma tela por vez;
- média: lista e editor alternados, rail opcional;
- expandida: lista e editor lado a lado, painel de propriedades recolhível.

## Critérios de aceitação

- criação e edição funcionam offline;
- texto ampliado não corta toolbar ou conteúdo;
- toda ação de drag possui menu alternativo;
- busca retorna resultados e estado vazio;
- build, lint e testes passam;
- tela é original e não replica o layout de um concorrente.
