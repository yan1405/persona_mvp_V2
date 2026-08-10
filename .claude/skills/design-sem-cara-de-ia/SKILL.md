---
name: design-sem-cara-de-ia
description: Diagnostica e corrige a "cara de feito por IA" em qualquer interface — site, app, dashboard, landing page ou produto SaaS — antes ou depois da implementação. Cobre os nove pontos que mais denunciam geração automática (cor, tipografia, layout, ícones/imagens, movimento, copy, densidade, stack técnico não customizado e acessibilidade como sintoma), o método de correção por restrição deliberada, e um script de auditoria que varre código HTML/CSS/JSX em busca desses sinais. Use esta skill sempre que o usuário pedir para criar, revisar, "dar uma repaginada" ou tirar a "cara de IA" de qualquer front-end — mesmo que ele não use literalmente essas palavras, mas descreva um site, app ou landing page genérico, parecido com "todo mundo", com gradiente roxo, cards uniformes, ou peça uma auditoria visual antes de entregar um projeto. Também use antes de finalizar qualquer artifact, mockup ou protótipo visual gerado nesta conversa.
---

# Design Sem Cara de IA

## O mecanismo, não o gosto

Antes de listar sintomas, entenda a causa — isso evita tratar cada correção como uma regra arbitrária e permite generalizar para casos que esta skill não previu.

Um modelo de linguagem não tem gosto: ele prevê o token mais provável. Quando alguém pede "um site moderno para uma SaaS" sem mais direção, o modelo devolve a média estatística de tudo que viu — porque a média é, por definição, a resposta mais provável. Essa média converge para o mesmo lugar em qualquer prompt, porque a internet contém muito mais landing page genérica de SaaS do que design autoral e específico. O resultado tem nome no mercado: **AI slop design** — a marca visual de uma interface em que ninguém tomou uma decisão real.

Isso cria um ciclo que se realimenta: quando um site com gradiente roxo-índigo ganha destaque, ele entra na próxima leva de dados de treinamento, o que ensina o próximo modelo que gradiente roxo é ainda mais "normal". Um padrão que parecia fresco em 2025 já é clichê em 2026 — não porque o gosto mudou, mas porque o loop de retroalimentação o digeriu. Um exemplo concreto e bem documentado: a Tailwind CSS definiu `indigo-500` como cor padrão em 2019; como Tailwind virou o framework mais comum nos tutoriais e repositórios que alimentaram o treinamento dos modelos, o próprio criador do framework, Adam Wathan, brincou publicamente pedindo desculpas por ter feito de `indigo-500` a cor de todo botão gerado por IA no planeta.

A consequência prática: **genérico é pior do que feio**. Um site feio pelo menos mostra que alguém tomou uma decisão; um site genérico é esquecível, e esquecível é fatal quando o produto depende de ser lembrado. A cura não é "prompt melhor" — é constranger o modelo com decisões reais de marca, tipografia, cor e estrutura antes de pedir o resultado. Sem essas decisões, o modelo preenche tudo com a média; com elas, o modelo vira um executor rápido de uma escolha que já foi feita.

## Quando aplicar

Aplique esta skill sempre que:
- for criar uma interface do zero (site, app, dashboard, e-mail, apresentação com componentes visuais);
- for revisar ou "dar polimento" em algo que já existe e parece "template";
- estiver prestes a entregar um artifact, protótipo ou mockup gerado nesta própria conversa — trate a autocrítica como parte do trabalho, não como etapa opcional;
- o usuário mencionar explicitamente "cara de IA", "parece feito por IA", "genérico demais", "todo mundo faz isso" ou pedir uma auditoria visual.

Esta skill é agnóstica de estilo: ela não empurra para um visual específico (isso é papel de um brief de marca ou de uma skill de estilo já definida, como uma direção editorial). O objetivo aqui é eliminar decisões não tomadas, qualquer que seja o estilo escolhido depois.

## Processo em cinco fases

Siga esta sequência. Pular a fase 2 (ancoragem) é o erro mais comum — sem uma referência concreta, todas as fases seguintes herdam a média.

**1. Diagnóstico.** Se já existe algo construído, rode a auditoria (seção "Checklist" abaixo e `references/checklist-auditoria.md`) antes de tocar em qualquer código. Se é um projeto novo, pule para a fase 2.

**2. Ancoragem.** Troque "moderno e limpo" por um nome. Uma marca real, uma década, uma publicação, um material físico. O modelo tem uma representação nítida de "página de produto da Linear em 2024" ou "revista Wired de 2003"; só tem um borrão nebuloso chamado "moderno".

**3. Sistema de restrições.** Antes de gerar qualquer tela, fixe: paleta (4–6 hex nomeados), tipografia (papéis de display e corpo, nunca a dupla óbvia), princípio de grid/espaçamento, e o "elemento-assinatura" — a única coisa ousada da peça. Use `references/paletas-tipografia.md` como ponto de partida em vez de deixar o modelo escolher; escolher a partir de um conjunto já curado por gosto humano produz resultado melhor do que pedir para o modelo "escolher uma cor bonita".

**4. Construção com uma decisão forte por tela.** Cada tela tem uma coisa que compete por atenção — geralmente a manchete ou o elemento-assinatura — e tudo o resto recua. Ausência de hierarquia (tudo do mesmo tamanho, tudo centralizado, tudo com a mesma sombra) é, por si só, um dos tells mais confiáveis.

**5. Autocrítica e remoção.** Depois da primeira geração, identifique as três coisas que "gritam IA" e pergunte se a peça sobrevive sem elas. Removê-las quase sempre revela o esqueleto de algo melhor — o que se perde sem fazer falta já era enchimento. Valide também com o checklist de acessibilidade: efeito de vidro (glassmorphism), gradiente atrás de texto e contraste insuficiente costumam andar juntos.

## Os nove pontos que mais denunciam a IA

Visão geral rápida — a lista completa, com exemplos e a correção de cada item, está em `references/tells-visuais.md` (visual/estrutural) e `references/copy-microcopy.md` (texto).

| # | Categoria | Tell típico | Por que acontece |
|---|---|---|---|
| 1 | Cor | Gradiente roxo-para-índigo em hero, botão e cards | Herança direta do `indigo-500` padrão do Tailwind, superrepresentado no treinamento |
| 2 | Tipografia | Inter (ou system-ui) sem nenhuma outra decisão tipográfica | Fonte mais usada em interfaces no corpus de treinamento — ótima, mas não escolhida |
| 3 | Layout | Três cards centralizados, cantos arredondados uniformes, hero de 100vh | Layout didático de tutorial de Tailwind, aprendido como "assim que se faz uma seção de features" |
| 4 | Ícones/imagens | Ícones de linha fina intercambiáveis (Lucide/Heroicons sem curadoria), blobs 3D flutuantes, foto de banco de imagens | Biblioteca padrão de todo stack React+Tailwind+shadcn; imagem genérica em vez de screenshot real do produto |
| 5 | Movimento | Fade-in com o mesmo easing em todo elemento, ou nenhuma micro-interação | Motion design exige entender intenção, não só padrão; o modelo replica o padrão mais comum (fade genérico) |
| 6 | Copy | "Construa o futuro do seu trabalho", "tudo em um só lugar" | Manchete gerada pela média de todas as manchetes vistas; correta gramaticalmente, vazia de conteúdo |
| 7 | Densidade | Espaçamento excessivo (padding de 120–200px), tudo centralizado | O modelo erra para mais espaço "limpo" em vez de hierarquia real |
| 8 | Stack/código | React + Tailwind + shadcn/ui + Lucide sem nenhum token customizado | É o stack padrão de todo tool de geração — não é o problema; usá-lo sem sobrescrever nada é |
| 9 | Acessibilidade | Vidro fosco cobrindo texto, contraste abaixo de 4.5:1, foco visível ausente | Efeito visual copiado sem verificar contraste em fundo real, em movimento e nos dois temas |

Nenhum desses elementos é proibido isoladamente — Inter é uma fonte excelente, cards com cantos arredondados não são um erro, glassmorphism é uma tendência legítima de 2026. O tell não é o elemento; é o elemento **não escolhido**, presente porque ninguém decidiu removê-lo ou substituí-lo.

## Método de correção: substituir generalidade por decisão

Sete alavancas, todas a mesma ideia com fantasias diferentes — recusar a média por nome, por negação, por referência curada ou por restrição explícita:

1. **Ancorar em referência específica**, não em "moderno" (ver fase 2 acima).
2. **Proibir os tells em voz alta.** Uma lista curta de proibições no topo do prompt/briefing funciona melhor do que três parágrafos de direção positiva. Exemplo de bloco a manter como referência de formato:
   ```
   Proibido:
   - Inter, Roboto, Open Sans como única decisão tipográfica
   - Gradiente roxo-para-índigo
   - Três cards no mesmo tamanho sobre fundo branco
   - Sombra suave genérica em tudo (usar borda de 1px ou nada)
   - Qualquer frase do tipo "leve sua empresa para o próximo nível"
   ```
3. **Escolher de um conjunto curado em vez de perguntar ao modelo.** Use as paletas e pares tipográficos de `references/paletas-tipografia.md` como cardápio fechado — isso já foi filtrado por gosto humano, então o resultado começa acima da média.
4. **Exigir uma decisão visual forte por tela** e mandar tudo o resto recuar (fase 4).
5. **Especificar o sistema espacial, não só o cromático.** Grid de 12 colunas, conteúdo do hero assimétrico (colunas 2–8, não centralizado), ritmo vertical em múltiplos de 24px, divisores de 1px em vez de sombra. Espaçamento e alinhamento respondem por boa parte de como uma interface "sente" — mais do que cor.
6. **Dar voz antes de dar layout.** Decida o tom (direto e confiante / autoirônico / técnico e sóbrio) e escreva as manchetes nesse tom antes de desenhar a seção — o layout segue a voz, não o contrário. Teste rápido: "o fundador do produto diria essa frase em voz alta?" Se a resposta for não, reescreva.
7. **Iterar removendo.** Depois de gerar, identificar os três elementos mais genéricos e pedir a remoção deles é mais eficaz do que pedir mais direção. O que sobra costuma ser o esqueleto de algo bom.

## Erros de supercorreção

Corrigir a "cara de IA" tem seus próprios modos de falha — vale a pena verificar se algum deles não substituiu o problema original:

- **Compensar com excesso.** Empilhar gradiente, parallax em toda seção, cursor customizado e fundo animado não é distinção — é ruído. Produtos lembrados (Linear, Stripe, Notion) são reconhecíveis pela contenção, não pelo acúmulo: poucas decisões, mas cada uma consistente.
- **Rejeitar a IA por completo.** Recusar qualquer ferramenta de geração por princípio joga fora velocidade real em boilerplate, responsividade e estrutura inicial. O problema nunca foi usar IA — foi entregar a saída sem refinamento humano.
- **Trocar o visual e manter o texto genérico.** Uma fonte customizada com paleta de marca, mas manchete "Capacitando equipes a construírem produtos melhores", continua parecendo genérica. Visual e copy têm de ser corrigidos juntos.
- **Pular o sistema de design.** Ajustes pontuais de uma página não sobrevivem à criação da próxima — sem tokens de cor, tipografia e espaçamento documentados, o padrão da IA volta a se infiltrar a cada nova tela gerada.
- **Tratar como correção única.** A "cara de IA" é uma força gravitacional, não um bug que se corrige uma vez. Toda vez que uma nova página, e-mail ou banner é gerado rapidamente sem revisão, os defaults reaparecem — revisar contra o sistema estabelecido precisa ser hábito, não evento.

## Checklist antes de entregar

Percorra esta lista curta ao final de qualquer entrega; a versão completa, com item a item detalhado por fase do projeto, está em `references/checklist-auditoria.md`.

- [ ] A paleta tem 4–6 cores nomeadas com propósito semântico (não decorativo) — nenhuma delas é gradiente roxo-índigo não justificado?
- [ ] A tipografia tem pelo menos uma decisão de personalidade (display + corpo deliberados), não Inter sozinho por omissão?
- [ ] Existe uma decisão visual clara e única por tela, com tudo o resto recuando?
- [ ] O grid tem alguma assimetria ou hierarquia real, ou está tudo centralizado com o mesmo padding?
- [ ] Ícones e imagens são específicos do produto (screenshot real, ilustração própria) e não um kit genérico aplicado sem curadoria?
- [ ] O movimento comunica estado (carregando, sucesso, erro) ou é fade-in decorativo repetido em todo elemento?
- [ ] Toda manchete passa no teste "o fundador diria isso em voz alta"? Nenhuma frase da lista de proibições em `references/copy-microcopy.md` sobreviveu?
- [ ] Contraste de texto sobre qualquer superfície de vidro/gradiente está acima de 4.5:1, em ambos os temas e com o texto em movimento?
- [ ] Rodando `scripts/auditar_tells_ia.py` sobre o código, o relatório não aponta ocorrência não revisada de cada sinal?

Para bases de código (HTML/CSS/JSX/TSX/Vue), rode o script de auditoria antes de considerar o checklist manual encerrado:

```bash
python3 scripts/auditar_tells_ia.py --caminho <pasta-do-projeto>
```

O script varre o código em busca dos nove sinais (cor, fonte, ícone, copy, espaçamento, sombra/borda) e devolve contagem exata e localização de cada ocorrência — não uma impressão qualitativa. Trate cada linha reportada como candidata a revisão manual, não como erro automático: o script sinaliza presença do padrão, a decisão de manter ou trocar continua sendo humana.

## Referências de calibração

Produtos que escaparam da média não são exceção por acaso — em cada bifurcação em que um modelo teria escolhido Inter e um gradiente, uma pessoa escolheu algo que significava alguma coisa, e manteve essa escolha em toda superfície do produto:

- **Linear** — restrição e um sistema tipográfico e cromático de precisão, reconhecível a partir de um único print de tela.
- **Stripe** — serifada autoral no display combinada com sans limpa no corpo; contraste que sinaliza "premium" sem depender de gradiente.
- **Notion** — paleta quente e comedida em que a cor tem função (amarelo para destaque, azul para link, vermelho para aviso), não decoração.
- **Vercel** — tipografia própria (Geist), comissionada em vez de herdada do padrão do sistema.
- **Duolingo** — linguagem visual barulhenta e guiada por personagem, que rompe deliberadamente o "clichê SaaS limpo".

A lição não é copiar nenhum desses — copiar Linear é só uma forma mais sofisticada de cair em outra média. A lição é que a distinção vem de tomar a decisão, e sustentá-la de forma consistente, em vez de herdá-la do modelo.

## Fontes

Esta skill foi construída a partir de pesquisa sobre o fenômeno documentado em 2026 como "AI slop design" — reportagens e análises de estúdios de design (925Studios, Shuffle, Visily), do próprio ecossistema de ferramentas (Tailwind CSS, shadcn/ui), e da declaração pública de Adam Wathan sobre o padrão `indigo-500`. Estatísticas de mercado citadas por terceiros nessas fontes (taxa de abandono por design ruim, desempenho de conteúdo humano vs. gerado) são números reportados pelo setor, não verificados de forma independente por esta skill — trate-os como indicativos de direção, não como dado auditado, se forem repassados ao cliente final.
