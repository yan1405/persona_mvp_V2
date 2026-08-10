# Checklist de auditoria — versão completa

Use esta versão quando a entrega for grande o suficiente para justificar uma passagem estruturada por fase (um projeto novo, uma repaginada completa, uma entrega para cliente). Para uma verificação rápida, a lista curta no corpo do SKILL.md basta.

## Fase 1 — Antes de gerar qualquer tela

- [ ] Existe uma referência nomeada (marca, década, publicação, material) documentada, em vez de "moderno e limpo"?
- [ ] O sistema de restrições (paleta, tipografia, princípio de grid, elemento-assinatura) foi fixado antes da primeira geração, não depois?
- [ ] A paleta e a tipografia vieram de uma escolha deliberada — de `paletas-tipografia.md`, da marca já existente, ou de outra fonte específica — e não de "o que a IA sugeriu primeiro"?
- [ ] O tom de voz do copy foi decidido antes do layout, não o contrário?

## Fase 2 — Cor

- [ ] A paleta tem entre 4 e 6 cores nomeadas por função (ação, feedback, superfície), não por posição em um gradiente?
- [ ] Nenhuma cor é gradiente azul-roxo/índigo sem justificativa específica de marca?
- [ ] Se há gradiente, ele varia luminosidade dentro de um único matiz, não mistura matizes distintos sem motivo?
- [ ] As cores de estado (sucesso, erro, aviso) são consistentes em toda a peça, não reinventadas tela a tela?

## Fase 3 — Tipografia

- [ ] Existem pelo menos dois papéis tipográficos deliberados (display e corpo), documentados como token?
- [ ] Se Inter (ou `system-ui`) está presente, isso foi decidido e não apenas herdado do template?
- [ ] A escala tipográfica (tamanhos, pesos) é consistente e foi definida uma vez, não ajustada visualmente tela a tela?

## Fase 4 — Layout e estrutura

- [ ] Existe assimetria ou hierarquia de tamanho real em pelo menos uma seção principal — não tudo centralizado e do mesmo tamanho?
- [ ] O grid de features (se existir) rompe o padrão "três cards iguais, ícone em cima, sombra suave"?
- [ ] Border-radius e sombra não estão aplicados de forma idêntica e simultânea em todo elemento (escolher um tratamento, não os dois)?
- [ ] O padding de seção corresponde ao conteúdo, não a um valor arbitrário de "espaço limpo" (hero até 70vh, seções em torno de 60px, salvo justificativa)?
- [ ] Cards aninhados dentro de cards foram revisados — existe necessidade estrutural real ou é decoração acumulada?
- [ ] Glassmorphism e bento grid, se usados, estão reservados a elementos que se beneficiam de profundidade (modal, painel flutuante), não aplicados à página inteira?

## Fase 5 — Ícones e imagens

- [ ] Screenshots reais do produto ou ilustração própria substituem foto de banco de imagens onde possível?
- [ ] Os ícones usados foram selecionados um a um pelo conceito, não aplicados em bloco a partir do pacote padrão?
- [ ] Nenhuma ilustração 3D genérica com blobs flutuantes aparece sem relação com o conteúdo real?

## Fase 6 — Movimento

- [ ] Cada animação comunica algo (mudança de estado, direção de atenção, personalidade de marca) — nenhuma é fade-in decorativo repetido sem propósito?
- [ ] Os estados interativos principais (botão de CTA, campo de formulário) têm transição perceptível, não resposta instantânea sem feedback?
- [ ] `prefers-reduced-motion` é respeitado?

## Fase 7 — Copy

- [ ] Cada manchete principal passa no teste "o fundador diria isso em voz alta"?
- [ ] Nenhum termo da lista de proibições em `copy-microcopy.md` sobreviveu sem justificativa?
- [ ] Os CTAs usam o verbo específico da ação (não "Saiba Mais" genérico repetido em todo botão)?
- [ ] Prova social (se existir) cita pessoa, cargo e resultado específico — não estrelas genéricas com avatar de banco de imagens?

## Fase 8 — Stack técnico

- [ ] Os tokens de tema (cor, radius, sombra, fonte) foram sobrescritos no arquivo de configuração, não deixados no valor padrão da biblioteca?
- [ ] `scripts/auditar_tells_ia.py` foi rodado sobre o código e cada ocorrência reportada foi revisada manualmente?
- [ ] Não há regras CSS com especificidade conflitante entre seletor de classe de seção e de componente (ex.: `.section` vs `.cta`) cancelando padding/margin silenciosamente?

## Fase 9 — Acessibilidade

- [ ] Todo texto sobre superfície translúcida ou gradiente mantém contraste mínimo de 4.5:1, testado sobre o fundo real (não só o mockup estático)?
- [ ] O contraste foi verificado nos dois temas (claro e escuro) e com o fundo em movimento, se houver scroll ou parallax?
- [ ] O estado de foco de teclado é visível em todo elemento interativo?
- [ ] Existe opção de reduzir ou desativar efeito de vidro para quem precisa?

## Fase 10 — Revisão final contra supercorreção

- [ ] A correção não empilhou gradiente + parallax + cursor customizado + fundo animado como resposta a "tirar a cara de IA" (isso é ruído, não distinção)?
- [ ] O sistema de tokens ficou documentado em algum lugar (arquivo de tema, guia de estilo) para a próxima tela não reintroduzir os defaults?
- [ ] Esta auditoria está marcada para se repetir na próxima peça gerada, não tratada como evento único?

Ao final, se qualquer item ficou sem marcar, decida explicitamente se a exceção é justificada para este produto específico — a regra existe para forçar a decisão, não para proibir toda cor de gradiente ou todo card arredondado por princípio.
