# 08 — Acessibilidade e inclusão

## Meta

Trate acessibilidade como requisito de arquitetura, não como revisão final. Para web, mire WCAG 2.2 AA. Para apps nativos, siga as APIs e padrões de acessibilidade da plataforma.

## Percepção

- contraste suficiente para texto, ícones, bordas importantes e foco;
- estado não comunicado apenas por cor;
- texto sobre imagens com tratamento de contraste;
- suporte a high contrast quando disponível;
- descrições para imagens informativas;
- conteúdo decorativo oculto de leitores de tela.

## Operação

- alvos de toque confortáveis e espaçados;
- navegação completa por teclado no web/desktop;
- ordem de foco lógica;
- foco visível e não encoberto;
- alternativa a drag, swipe, long press e hover;
- atalhos não conflitantes e documentados;
- ações repetitivas agrupadas quando possível.

## Compreensão

- labels persistentes;
- instruções antes da ação;
- erros específicos e próximos do campo;
- linguagem simples;
- padrões consistentes;
- confirmação para ações de alto risco;
- ajuda contextual em vez de documentação distante.

## Robustez

- HTML semântico no web;
- roles apenas quando elementos nativos não resolvem;
- nomes, estados e valores acessíveis;
- announcements para mudanças assíncronas relevantes;
- componentes testados com screen reader;
- não criar controles customizados sem suporte equivalente ao nativo.

## Texto ampliado

- evite alturas fixas;
- permita quebra de linha;
- reflow sem perda de conteúdo;
- ajuste layouts com textos 200% ou tamanho de acessibilidade da plataforma;
- não truncar ações essenciais;
- use scroll quando necessário, não clipping.

## Alvos de interação

- iOS/iPadOS: siga regiões de toque da plataforma, normalmente 44×44 pt para controles importantes.
- Android: use alvos confortáveis próximos de 48×48 dp.
- Web: cumpra o mínimo WCAG e prefira áreas maiores para ações frequentes.

A área clicável pode ser maior que o ícone visual.

## Formulários

- associe label e campo;
- informe formato esperado;
- preserve valor após erro;
- não desabilite submit sem explicar requisitos;
- agrupe erros no topo em formulários longos e mantenha erros inline;
- suporte autofill e tipos de teclado adequados;
- evite desafios cognitivos desnecessários.

## Screen readers

- icon buttons precisam de nome;
- badges e estados precisam de descrição útil;
- listas, headings, landmarks e tabelas devem ter estrutura;
- ordem de leitura deve seguir a ordem visual e lógica;
- mudanças de rota precisam atualizar foco ou título;
- modais devem confinar foco e devolvê-lo à origem.

## Teclado e foco

- Tab percorre controles em ordem;
- Shift+Tab retorna;
- Enter/Space acionam controles conforme semântica;
- Esc fecha elementos temporários quando seguro;
- setas navegam menus, tabs e grids conforme padrão;
- foco não desaparece atrás de sticky bars, sheets ou teclado.

## Movimento

- respeite `prefers-reduced-motion` ou configuração nativa;
- desative parallax, zoom e deslocamentos grandes;
- mantenha feedback de estado mesmo sem animação;
- evite flashes e padrões que causam desconforto.

## Áudio, vídeo e voz

- legendas para fala;
- transcrição quando necessário;
- controles acessíveis;
- não depender de áudio para feedback único;
- entrada por voz precisa de alternativa manual.

## Inclusão cognitiva

- uma ação principal por etapa;
- mensagens curtas e específicas;
- padrões previsíveis;
- progresso visível;
- possibilidade de revisar antes de concluir;
- evitar timeout curto;
- salvar rascunho.

## Localização

- aceite expansão de texto;
- não concatene frases em código;
- suporte plural, data, número, moeda e fuso;
- prepare RTL;
- não incorpore texto em imagens;
- revise ícones direcionais em RTL.

## Testes mínimos

- teclado completo;
- screen reader básico;
- contraste;
- zoom/texto ampliado;
- reduced motion;
- orientação e reflow;
- mensagens de erro;
- alvos de toque;
- localização com strings longas.
