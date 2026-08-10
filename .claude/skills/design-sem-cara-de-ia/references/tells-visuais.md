# Tells visuais e estruturais — lista completa

Use este arquivo quando precisar do detalhe por trás de qualquer linha da tabela resumo do SKILL.md, ou ao auditar uma peça já pronta item a item. Cada bloco segue o formato: **o que aparece → por que aparece → como corrigir**.

## 1. Cor

**O que aparece.** Gradiente de azul para roxo/índigo no hero, no botão principal e nos ícones. Texto em gradiente. Glow/blur roxo atrás de cards. Bordas neon competindo entre si.

**Por que aparece.** `indigo-500` é a cor padrão do Tailwind CSS desde 2019; como Tailwind é o framework mais presente no código que treinou os modelos, essa cor específica tornou-se a resposta estatisticamente mais provável para "algo moderno e tecnológico". O padrão se reforça sozinho: sites com esse gradiente ganham visibilidade, entram na próxima leva de treinamento, e o ciclo se aprofunda.

**Como corrigir.** Não é proibir gradiente — é proibir gradiente **não escolhido**. Construa a paleta a partir de algo verdadeiro sobre o produto (o material, o setor, uma cor de marca já existente), nomeie cada cor pela função semântica que ela cumpre (`cor-acao-primaria`, `cor-feedback-sucesso`) em vez de nome decorativo (`cor-gradiente-inicio`), e reserve gradiente para o único lugar em que ele carrega significado, se algum lugar carregar. Ver `paletas-tipografia.md` para direções de partida já filtradas.

## 2. Tipografia

**O que aparece.** Inter (ou a pilha `system-ui`) como única fonte, sem hierarquia de peso além de bold/regular. Nenhum par de display + corpo.

**Por que aparece.** Inter é a fonte de interface mais usada no corpus de treinamento — tecnicamente excelente, o que a torna a escolha "segura" default quando ninguém decide o contrário.

**Como corrigir.** O problema não é Inter; é Inter não escolhida. Ou (a) mantenha Inter no corpo e escolha uma fonte de display com personalidade para títulos, ou (b) substitua por um par que carregue a intenção do produto: uma serifada de autoridade editorial, uma monoespaçada para produto voltado a desenvolvedores, uma grotesca com peso mais quente para calor de marca. Fixe a escolha como token e repita em toda a peça — a consistência é o que separa uma decisão de um acidente.

## 3. Layout e estrutura

**O que aparece.**
- Três (ou quatro) cards de feature no mesmo tamanho, ícone em cima, título, parágrafo curto, sombra suave, cantos arredondados — o "grid didático" de tutorial.
- Tudo centralizado: título centralizado, cards centralizados, rodapé centralizado.
- Cards aninhados dentro de cards (um card de hero contendo um card de dashboard contendo cards de estatística) sem necessidade estrutural.
- Border-radius idêntico em cada elemento da página (geralmente 16px), sem variação que sinalize hierarquia.
- Hero ocupando 100vh com padding de seção entre 120–200px, forçando rolagem longa antes de qualquer conteúdo real aparecer.
- Uso de bento grid ou glassmorphism como decoração generalizada, aplicada à página inteira, em vez de reservada para elementos específicos que se beneficiam de profundidade (modal, barra flutuante, painel de notificação).

**Por que aparece.** É o layout usado em tutoriais introdutórios de Tailwind/CSS Grid para demonstrar "como se faz uma seção de features"; o modelo aprendeu esse layout como a resposta padrão para qualquer briefing sem direção estrutural explícita. Centralização e espaçamento generoso é o caminho de menor risco visual — "parece limpo" sem exigir julgamento de hierarquia.

**Como corrigir.**
- Quebrar o reflexo do trio: usar quantidade diferente de itens, tamanhos assimétricos, ou abandonar o grid de cards em favor de mostrar um fluxo real de uso do produto.
- Especificar sistema espacial explícito em vez de deixar "limpo" em aberto: grid de 12 colunas, conteúdo assimétrico (por exemplo, colunas 2–8 em vez de centralizado), ritmo vertical em múltiplos fixos (8px base, espaçamentos múltiplos de 24px), divisores de seção em traço de 1px em vez de sombra.
- Reduzir padding para o que o conteúdo pede, não para preencher a tela — hero de 60–70vh no máximo, salvo justificativa específica.
- Reservar glassmorphism e bento grid para onde a profundidade cumpre função (elemento flutuante, painel modal), nunca como tratamento de fundo de página inteira; glassmorphism 2.0 (2026) é seletivo e cirúrgico, não decorativo.
- Ao usar bento grid, garantir hierarquia real de tamanho (célula grande = conteúdo principal, células menores = suporte) — não uma grade uniforme disfarçada de bento.

## 4. Ícones e imagens

**O que aparece.** Ícones de linha fina intercambiáveis (tipicamente Lucide ou Heroicons usados sem seleção curada — qualquer ícone do pacote serve para qualquer conceito). Ilustração 3D genérica com blobs flutuantes. Foto de banco de imagens mostrando grupo diverso de pessoas sorrindo para um laptop em escritório com luz perfeita.

**Por que aparece.** É a biblioteca de ícones padrão de todo stack React + Tailwind + shadcn/ui gerado por ferramenta de IA; e ilustração/foto genérica preenche o espaço "visual" do briefing sem exigir asset real do produto.

**Como corrigir.** Preferir screenshot real do produto, dado real de dashboard, ou ilustração própria a qualquer ícone ou foto genérica sempre que o espaço permitir. Quando ícones forem necessários, usá-los com parcimônia e curadoria deliberada (mesma família, mesmo peso, escolhidos um a um pelo conceito que representam) em vez de aplicar o pacote inteiro. Substituir imagem de banco por fotografia real da equipe, do produto ou do contexto de uso — a especificidade é o que sinaliza autenticidade que a média estatística não consegue gerar.

## 5. Movimento e microinterações

**O que aparece.** Fade-in com o mesmo easing e duração em cada elemento da página, disparado por scroll, sem relação com o conteúdo. Ou o oposto: nenhuma micro-interação — hover que não muda nada, botão que troca de estado sem transição.

**Por que aparece.** Motion design proposital exige entender a intenção de cada estado (o que está carregando, o que teve sucesso, o que precisa de atenção); o modelo, sem essa intenção, replica o padrão mais comum do corpus — "fade + translateY genérico" — ou simplesmente omite movimento.

**Como corrigir.** Movimento com propósito segue três regras: comunica mudança de estado (clique, abertura de painel, carregamento), direciona atenção para o que importa no momento certo, e reforça a personalidade do produto (preciso e "matemático" como a Stripe, ou lúdico como a Duolingo — a escolha depende da marca, não de um padrão universal). Comece pelas micro-interações do botão de call-to-action principal e dos campos de formulário; adicione animação de scroll só onde ela serve à narrativa ou à navegação; remova qualquer animação puramente decorativa.

## 6. Densidade e espaçamento

**O que aparece.** Ver item 3 (layout) — tratado aqui separadamente porque costuma passar despercebido mesmo quando cor e tipografia já foram corrigidas. Excesso de espaço em branco tratado como sinônimo de "clean", sem hierarquia real por trás.

**Como corrigir.** Espaçamento e alinhamento respondem por parte considerável de como uma interface "sente" ao usuário — mais até do que paleta. Definir um sistema de espaçamento com base fixa e múltiplos consistentes é mais eficaz do que ajustar padding tela a tela.

## 7. Stack técnico e implementação

**O que aparece.** React + Tailwind + shadcn/ui + Lucide usados exatamente como instalados, sem nenhum token sobrescrito — cores default do tema, componentes shadcn sem customização de radius/sombra/tipografia, ícones Lucide sem curadoria.

**Por que aparece.** É o stack padrão de praticamente toda ferramenta de geração de UI por IA em 2026 — não porque seja ruim (é flexível, modular e acessível por padrão via Radix), mas porque ninguém sobrescreveu a camada de estilo depois de instalar.

**Como corrigir.** Usar o stack normalmente, mas tratar a instalação como ponto de partida, não como entrega: sobrescrever tokens de cor e tipografia no arquivo de tema antes de gerar qualquer tela; escolher preset de radius e sombra deliberadamente (não os dois "cantos arredondados + sombra suave" ao mesmo tempo — cada um sozinho já basta); revisar a lista de ícones importados e remover os que foram usados só porque "estavam lá". Atenção a conflitos de especificidade CSS entre seletores baseados em classe (`.section`) e em componente (`.cta`) — é comum gerar regras que se cancelam silenciosamente, sobretudo em padding/margin entre seções.

## 8. Acessibilidade como sintoma

**O que aparece.** Texto sobre glassmorphism ou gradiente com contraste abaixo de 4.5:1. Estado de foco de teclado invisível ou removido. Efeito de vidro que funciona bem no protótipo estático, mas quebra quando o fundo muda (scroll, tema escuro, conteúdo dinâmico).

**Por que aparece.** O efeito visual foi copiado de uma referência sem verificar contraste no contexto real de uso — geralmente porque a decisão nunca foi verdadeiramente "decisão", só aplicação de tendência.

**Como corrigir.** Ao usar qualquer superfície translúcida, tratar como não negociável: manter contraste mínimo de 4.5:1 para texto essencial, testar contra fundo real (não só o mockup), testar em movimento e nos dois temas, e considerar oferecer opção de reduzir/desativar o efeito de vidro para quem precisa. Foco de teclado visível não é opcional em nenhuma peça entregue.

## Nota final

Nenhum item desta lista é proibido por si — Inter, glassmorphism, bento grid e ícones de linha fina são escolhas legítimas em 2026, adotadas inclusive por marcas de referência. O tell não é o elemento isolado; é a combinação de vários deles aparecendo juntos, sem que nenhum tenha sido escolhido por um motivo específico deste produto. Um único elemento "default" é inofensivo; dez juntos criam a sensação de já ter visto exatamente aquele produto antes.
