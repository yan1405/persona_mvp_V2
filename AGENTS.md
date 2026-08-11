# AGENTS.md — Persona MVP v2

> Fonte de governança para qualquer agente que trabalhe neste diretório.
> Leia este arquivo integralmente antes de analisar, planejar ou modificar o projeto.
> Estado: mapa, arquitetura e stack aprovados; protótipo legado arquivado em `../99_lixo/persona_v1/`; Fases 1–3 implementadas e aprovadas; Fase 4 implementada e tecnicamente validada em 10/08/2026, aguardando avaliação de Yan.
> Idioma de trabalho: português do Brasil.

## 1. O projeto

**Persona** é um software de evidências e desenvolvimento narrativo profissional. Ele ajuda estudantes e profissionais a registrar experiências reais, transformá-las em evidências organizadas e usar esse histórico para comunicar competências com clareza em oportunidades de carreira.

Categoria do produto: **sistema de evidências profissionais**.

Proposta institucional: **“O sistema operacional da sua identidade profissional.”**

Promessa funcional: **“Registre uma vez. Prove sempre.”**

Diferencial central: **o Persona transforma experiências profissionais em argumentos verdadeiros e recupera as evidências mais relevantes quando o usuário precisa demonstrar competência.**

O ciclo conceitual do produto é:

1. **Daily Log:** registrar o dia ou uma experiência profissional em texto ou voz própria.
2. **Estruturação:** identificar contexto, ação, resultado, competência e possíveis provas.
3. **Revisão:** o usuário corrige e confirma sugestões antes de tratá-las como evidência.
4. **Evidência:** relacionar registros a documentos, links, resultados e níveis de confiança.
5. **Síntese:** atualizar Narrative Score, padrões, competências e evolução de forma explicável.
6. **Ativação:** recuperar evidências no Persona Live e produzir Artefatos profissionais.
7. **Validação:** futuramente, permitir que outras pessoas confirmem competências e evidências.

### 1.1 Persona Live

**Persona Live** é o diferencial demonstrável do produto. Durante uma entrevista, ele ajuda o usuário a recordar e organizar o que realmente viveu. O recurso não responde pelo usuário nem deve ser apresentado como ferramenta invisível para enganar recrutadores.

Contrato funcional aprovado:

- mostrar simultaneamente, em áreas separadas, **argumentos reais** e **rascunho sugerido**;
- sustentar ambos apenas com evidências existentes no histórico do usuário;
- priorizar respostas curtas e adaptar automaticamente a extensão à pergunta;
- oferecer `Encurtar`, `Aprofundar` e `Outra experiência`;
- sinalizar fatos incertos, ausência de evidência e afirmações que o usuário não deve fazer;
- operar em modo **Manual**, sem captura da conversa, e **Automático**, somente após autorização apropriada;
- descartar a transcrição temporária ao final por padrão;
- nunca prometer respostas perfeitas, funcionamento indetectável ou aprovação em processos seletivos.

No MVP do Empreenda Senac, o modo Manual será funcional. O modo Automático será uma demonstração controlada. Captura completa e confiável em Google Meet, Zoom e Microsoft Teams pertence a uma versão posterior e dependerá de validação do produto, privacidade e viabilidade técnica.

O projeto atende dois objetivos conectados:

- **Produto:** construir e validar um MVP real do Persona.
- **Competição:** apresentar uma solução convincente e demonstrável à banca do Empreenda Senac.

Quando houver conflito, os requisitos e prazos da competição têm prioridade. O MVP deve produzir evidências de produto e validação, não apenas telas.

## 2. Escopo atual

Existe um entregável principal: **o sistema web completo do Persona**. Não há uma landing page isolada como entregável desta fase. A apresentação do produto para a banca, o onboarding, a autenticação e todas as funções-base devem compor uma única experiência web coerente, navegável, adaptada a desktop e suficientemente completa para testes e demonstração.

O fluxo prioritário da aplicação web é:

1. registrar um Daily Log;
2. revisar sugestões e transformá-las em evidências profissionais estruturadas;
3. consultar a Biblioteca de Evidências;
4. visualizar os KPIs explicáveis do Narrative Score no Início;
5. informar uma pergunta no Persona Live e receber argumentos + rascunho rastreável;
6. criar, revisar e salvar Artefatos profissionais baseados nas evidências.

Restrições desta fase:

- O uso será gratuito; não implementar cobrança, checkout ou billing real.
- O MVP não precisa integrar diretamente com Meet, Zoom ou Teams.
- O MVP não deve gravar ou persistir áudio de terceiros.
- O modo Automático não pode comprometer a entrega do fluxo Manual funcional.
- Todas as áreas públicas, de autenticação, onboarding e uso interno devem parecer partes do mesmo sistema.
- A primeira versão será projetada e validada para **desktop/web**, priorizando computadores e notebooks. Responsividade para celulares será estudada em uma etapa posterior e não é critério de aceite desta primeira implementação.
- O layout desktop deve aproveitar larguras expandidas e densidade informacional; não limitar o sistema a uma coluna móvel centralizada.
- O design deve ser original. O Notion é referência de princípios — clareza, edição contextual, estrutura modular e conteúdo em primeiro lugar —, nunca um modelo para cópia literal.
- A identidade e o papel do mascote ainda serão definidos. **Xisto**, atualmente representado como constelação, é uma opção em discussão, não uma decisão definitiva.
- O briefing e o plano técnico estão versionados em `docs/`. O mapa de páginas reformulado após a auditoria de 10/08/2026 foi aprovado explicitamente por Yan e governa a implementação inicial.

## 3. Fontes de verdade e precedência

Use esta ordem quando houver divergência:

1. Instrução explícita e atual de Yan Guilherme Oliveira da Silva.
2. Este `AGENTS.md` e documentos aprovados dentro de `persona_mvp_v2/`, especialmente `docs/PRODUCT_BRIEF.md`, `docs/audits/2026-08-10-product-scope-audit.md`, `docs/architecture/INFORMATION_ARCHITECTURE.md`, `docs/architecture/TECHNICAL_ARCHITECTURE.md`, `docs/design/DESIGN_DNA_ADAPTATION.md`, `docs/design/VISUAL_REVIEW_PROTOCOL.md`, `docs/design/design-dna.json` e `docs/plans/2026-08-05-persona-live-design.md`.
3. Documentação viva em `../Persona Empreenda/00_documentacao/`.
4. Código e documentos arquivados em `../99_lixo/persona_v1/`, somente como referência histórica e funcional. A interface, as telas, as imagens e os assets visuais da v1 não são referência para a v2.

Não copie automaticamente a arquitetura, o design, a dívida técnica ou o escopo da v1. Reaproveite apenas o que for confirmado como válido para a v2.

## 4. Organização do repositório

Diretório exclusivo do MVP v2:

```text
persona_mvp_v2/
├── AGENTS.md              # regras deste projeto
├── .agents/               # skills e instruções compatíveis com agentes
├── .claude/               # skills, comandos e configuração legada do Claude
├── docs/                  # produto, arquitetura, Design DNA e planos aprovados
└── apps/                  # a aplicação web será criada em apps/web
```

Não criar diretórios vazios ou scaffolding especulativo. A árvore acima é uma convenção de destino, não uma ordem para materializar tudo agora.

## 5. Tecnologia

A stack aprovada está detalhada em `docs/architecture/TECHNICAL_ARCHITECTURE.md`:

- uma única aplicação em `apps/web` com Next.js 16, React 19, App Router e TypeScript estrito;
- npm e `package-lock.json` como gerenciador e lockfile únicos;
- Tailwind CSS, tokens CSS próprios e componentes shadcn/ui adicionados seletivamente;
- Supabase Postgres, Auth, Storage e Row Level Security, sem Prisma;
- autenticação Microsoft Azure por meio do Supabase Auth;
- SDK oficial da Groq somente no servidor, com modelo configurável e integração direta;
- Vercel AI Gateway fora da arquitetura inicial; reavaliar apenas se testes demonstrarem necessidade real de fallback, roteamento, observabilidade centralizada ou múltiplos provedores;
- Vitest para regras e Playwright para fluxos críticos;
- Vercel e Supabase como destino de hospedagem futuro, sem criar recursos pagos sem autorização.

### Autenticação obrigatória

- O acesso ao Persona será feito exclusivamente por uma conta Microsoft.
- Microsoft Entra ID / Microsoft identity platform será o provedor de identidade obrigatório e deve exibir o fluxo oficial de login da Microsoft.
- Não implementar cadastro ou login local por e-mail e senha, nem outros provedores sociais, nesta fase.
- A estratégia aprovada para o MVP é usar Microsoft Entra ID como provedor de identidade por meio do Supabase Auth. A Microsoft executa o login; o Supabase recebe o retorno OAuth, mantém a sessão da aplicação e integra o usuário às políticas de acesso ao banco.
- Aceitar contas Microsoft pessoais, corporativas e educacionais por meio de uma configuração multitenant compatível com o público do Persona.
- Solicitar somente os escopos necessários ao login. Configurar e validar as garantias de e-mail verificado recomendadas para a integração Microsoft/Supabase.
- Banco de dados e armazenamento não precisam pertencer à Microsoft por causa dessa decisão; autenticação, autorização e persistência devem permanecer responsabilidades separadas.
- Nunca expor client secrets, tokens, códigos de autorização ou dados de sessão no cliente, no repositório, em logs ou em exemplos públicos.

A v1 usou Next.js 14, React 18, Prisma e PWA. Não transportar essas versões ou camadas automaticamente. Reaproveitar somente conceitos e regras confirmados para a v2; `../99_lixo/persona_v1/` é arquivo histórico e permanece somente leitura.

### Política de uso do shadcn/ui

Fonte oficial: `https://github.com/shadcn-ui/ui` e `https://ui.shadcn.com/docs`.

- Não clonar nem incorporar o monorepo `shadcn-ui/ui` ao Persona. Usar a CLI oficial para trazer apenas os componentes necessários.
- Tratar shadcn/ui como código aberto distribuído para o projeto, não como uma biblioteca visual fechada: o código recebido passa a ser mantido e adaptado localmente.
- Executar `shadcn init` somente depois de o framework, a estrutura de diretórios e os tokens do Persona estarem aprovados.
- Antes de adicionar um componente, usar `shadcn view`; adicionar somente o que tiver uso imediato com `shadcn add`.
- Preferir HTML nativo quando ele resolver corretamente. Usar shadcn/ui para primitivas interativas em que composição, comportamento e acessibilidade reduzam trabalho real.
- Habilitar CSS variables e mapear os tokens semânticos do shadcn/ui para o Design System do Persona. Não conservar tema, tipografia, raio, sombras, ícones ou copy padrão por conveniência.
- Não importar blocos completos como identidade pronta. Navegação, densidade, hierarquia e componentes de domínio devem ser autorais.
- Toda inclusão ou alteração de componente deve passar pelas skills `editorial-modular-app-design`, `design-sem-cara-de-ia` e pela revisão Ponytail.
- Registrar no repositório os componentes adicionados e suas dependências; não editar arquivos de terceiros sem entender o comportamento e os estados acessíveis.
- Preservar o aviso de licença MIT quando exigido pela licença ou quando forem distribuídas porções substanciais do código original.

### Política de uso do Strix

Fonte oficial: `https://github.com/usestrix/strix` e `https://docs.strix.ai`.

- Strix está aprovado como ferramenta externa complementar de pentest. Não é dependência de runtime do Persona e não garante segurança sozinho.
- Não clonar nem incorporar o repositório `usestrix/strix` ao código do produto. Instalar ou executar a CLI somente quando existir um alvo testável e houver autorização explícita.
- Executar primeiro em ambiente local, efêmero ou de staging, sem dados pessoais reais. Nunca apontar exploração ativa para produção, terceiros ou infraestrutura fora do escopo autorizado.
- A execução local exige Docker e acesso a um provedor de LLM. Avaliar previamente custo, exposição de código/dados ao provedor escolhido e armazenamento dos artefatos em `strix_runs/`.
- Não enviar segredos, credenciais reais, transcrições, evidências profissionais ou outros dados pessoais ao Strix ou ao provedor de LLM. Usar contas, dados e tokens exclusivos de teste.
- Fixar versão do Strix e revisar changelog, licença Apache-2.0 e script de instalação antes do uso. Não executar automaticamente `curl | bash` em CI ou na máquina de desenvolvimento.
- Definir por execução: alvo, autorização, regras de engajamento, exclusões, orçamento, duração e critérios de interrupção.
- Tratar achados e correções automáticas como candidatos a revisão humana. Reproduzir a vulnerabilidade, corrigir a causa raiz, executar testes de regressão e repetir o scan antes de encerrar o achado.
- Um resultado limpo cobre somente o escopo efetivamente analisado. Strix complementa, mas não substitui, modelagem de ameaças, revisão de autenticação/autorização, validação de entrada, gestão de segredos, atualização de dependências e testes manuais.
- Considerar integração em CI apenas depois que o scan local estiver estável, com modo não interativo, orçamento limitado, segredos protegidos e política clara para bloquear o pipeline.

## 6. Direção obrigatória de design

Toda decisão visual e de experiência deve usar obrigatoriamente as skills **`editorial-modular-app-design`** e **`design-sem-cara-de-ia`**.

O arquivo local `docs/design/design-dna.json` é a fonte visual estruturada versionada. A estrutura, densidade, geometria, componentes e efeitos foram adaptados de `C:\Users\yansi\Projetos\crm\docs\design-dna.json`. A identidade cromática e os logos vêm exclusivamente da paleta original e dos SVGs aprovados do Persona, hoje copiados para `apps/web/public/brand/`. A adaptação e a precedência dessas fontes estão documentadas em `docs/design/DESIGN_DNA_ADAPTATION.md` e `docs/design/BRAND_FOUNDATION.md`.

As telas, screenshots, imagens, layouts e composições do projeto CRM de origem são referências visuais aprovadas para estrutura, densidade, geometria e comportamento. Preservar essa direção sem transportar textos, dados, marca, paleta, logos ou funções exclusivas do CRM para o Persona.

Do Design System original do Persona, somente a paleta de cores e os arquivos oficiais de logo estão aprovados para reutilização na v2. Tipografia, escala, espaçamento, raios, sombras, componentes e demais decisões antigas não devem ser importados. A tipografia atual da v2 é Geist Sans com Geist Mono nos papéis técnicos documentados.

As telas, screenshots, layouts e composições da Persona v1 foram rejeitados como direção visual. Não os usar como referência, não os copiar e não tentar manter semelhança visual com a v1. Essa restrição não invalida a paleta original e os logos oficiais aprovados separadamente para a v2. A v1 pode informar somente requisitos, regras e comportamentos que forem novamente confirmados para a v2.

Responsabilidades:

- `editorial-modular-app-design` define a linguagem editorial, modular, funcional, responsiva e acessível;
- `design-sem-cara-de-ia` exige decisões autorais de marca e elimina padrões genéricos herdados de templates ou geração automática.
- `design-dna` governa a leitura, tradução e verificação dos tokens, estilo e efeitos do arquivo local.

Antes de desenhar telas, a direção visual deve fixar: referência de ancoragem, paleta semântica de 4–6 cores, papéis tipográficos, princípio de grid e espaçamento, voz da marca e um elemento-assinatura do Persona. Essas escolhas precisam ser deliberadas e documentadas; não aceitar “moderno e limpo” como direção suficiente.

Invariantes:

- conteúdo antes do chrome da interface;
- hierarquia editorial por posição, alinhamento, espaço e tipografia;
- composição modular e baseada em blocos;
- superfícies neutras, bordas discretas e sombras somente para elevação real;
- uma família de cor de destaque, além de cores semânticas;
- revelação progressiva de ações secundárias;
- manipulação direta e edição contextual quando fizer sentido;
- desktop-first para esta fase, com validação prioritária em computadores e notebooks;
- acessibilidade mínima WCAG 2.2 AA;
- estados de carregamento, vazio, erro, sucesso, salvamento e indisponibilidade quando aplicáveis;
- identidade original, sem replicar telas, textos, ilustrações ou elementos proprietários do Notion.

O mascote ou sistema de personagens deve ter função narrativa ou funcional: onboarding, orientação, feedback ou estados vazios. Não usar ilustração como decoração aleatória.

Proibições padrão, salvo decisão explícita e justificada:

- gradiente roxo–índigo genérico;
- hero centralizado de altura total seguido por três cards iguais;
- sombras suaves aplicadas indiscriminadamente;
- tipografia, ícones ou componentes usados apenas porque são o padrão da stack;
- copy vaga como “tudo em um só lugar” ou “leve sua carreira ao próximo nível”;
- movimento decorativo repetido sem comunicar estado ou ação.

Antes de entregar qualquer tela, mockup ou protótipo, executar a autocrítica da skill `design-sem-cara-de-ia`, remover os três elementos mais genéricos e justificar qualquer sinal mantido. Quando houver HTML, CSS, JSX, TSX ou Vue, executar também `scripts/auditar_tells_ia.py` da skill e revisar manualmente cada ocorrência.

### 6.1 Avaliação visual obrigatória por fase

Aplicar integralmente `docs/design/VISUAL_REVIEW_PROTOCOL.md`.

- Toda fase deve terminar com uma **Sessão de Avaliação Visual** apresentada a Yan.
- Quando houver interface executável, apresentar screenshots reais do app e estados representativos.
- Comparar o resultado com as telas do CRM, o Design DNA, o contrato aprovado e as skills visuais obrigatórias.
- Registrar aderências, divergências, correções e a decisão de Yan em `docs/reviews/`.
- Aprovação técnica, testes e build não substituem aprovação visual.
- Não iniciar a próxima fase enquanto Yan não aprovar explicitamente o resultado ou autorizar o avanço com ajustes registrados.

## 7. Padrão obrigatório de implementação e revisão

Usar a skill/plugin **`ponytail:ponytail` em nível `full`** em toda tarefa de código, arquitetura, dependências, refatoração ou revisão.

Aplicar esta ordem:

1. verificar se a necessidade é real;
2. procurar solução já existente no projeto ou na v1;
3. preferir biblioteca padrão ou recurso nativo da plataforma;
4. reutilizar dependência já instalada quando ela resolver corretamente;
5. escrever a menor solução completa e verificável.

Regras:

- sem abstrações para um único caso;
- sem factories, interfaces ou configurações “para o futuro”;
- sem dependência nova quando a plataforma ou poucas linhas claras resolvem;
- corrigir causa raiz em código compartilhado, não sintomas em cada chamada;
- manter o menor número possível de arquivos e conceitos;
- não simplificar segurança, privacidade, validação em fronteiras, prevenção de perda de dados ou acessibilidade;
- lógica não trivial deve deixar uma verificação executável mínima.

Antes de concluir qualquer alteração de código, fazer uma revisão explícita com Ponytail e remover complexidade, duplicação e dependências desnecessárias.

## 8. Padrões de código

Durante toda implementação:

- seguir as convenções nativas do framework escolhido;
- usar TypeScript estrito se TypeScript for adotado;
- separar regra de negócio de componentes visuais quando isso reduzir acoplamento real;
- usar tokens semânticos; não espalhar valores visuais repetidos;
- aplicar a convenção do DNA: Carbon para navegação e ações de domínio; Lucide somente para utilidades, sem misturar estilos em um mesmo grupo visual;
- escrever conteúdo real do domínio; não usar Lorem ipsum;
- preservar navegação por teclado, foco visível, nomes acessíveis e preferência por movimento reduzido;
- não registrar nem exibir senhas, tokens, dados pessoais ou conteúdo privado;
- não usar informações fora das evidências autorizadas para compor argumentos ou respostas do Persona Live;
- não persistir transcrição temporária de entrevistas por padrão;
- manter mensagens para usuário separadas de detalhes técnicos de diagnóstico;
- comentários devem explicar decisões não óbvias, não repetir o código.

## 9. Comandos

O scaffold de `apps/web` foi criado em 10/08/2026. Execute os comandos oficiais dentro de `apps/web`.

```text
instalação: npm install
desenvolvimento: npm run dev
lint: npm run lint
typecheck: npm run typecheck
testes: ainda não existe script; adicionar junto da primeira regra não trivial
build: npm run build
```

Nunca declarar uma tarefa concluída com base em um comando presumido. Execute e registre os comandos reais do repositório.

## 10. O que o agente pode modificar

Pode, quando solicitado:

- arquivos dentro de `persona_mvp_v2/`;
- documentação, planos e especificações do MVP v2;
- código, testes, configuração e assets criados especificamente para a v2;
- reaproveitamento deliberado de regras ou conteúdos funcionais de `../99_lixo/persona_v1/`, após confirmação de validade para a v2.

Não pode sem autorização explícita:

- modificar ou excluir conteúdo em `../99_lixo/persona_v1/`;
- usar telas, imagens, layouts, composições ou outros assets da Persona v1 como referência para a v2, exceto a paleta original e os logos oficiais explicitamente aprovados e copiados para a v2;
- modificar arquivos da competição em `../Persona Empreenda/`;
- apagar histórico, evidências ou assets existentes;
- alterar decisões centrais de produto, público, monetização ou competição;
- assumir custos, publicar, enviar formulários ou contatar terceiros;
- copiar segredos ou arquivos `.env` para o novo projeto;
- substituir a versão atual de documentos históricos.

## 11. Fluxo obrigatório de trabalho

1. Ler este arquivo e as skills aplicáveis.
2. Inspecionar o estado real do repositório e os documentos relevantes.
3. Confirmar o objetivo, usuário, tarefa principal e critério de sucesso.
4. Para trabalho criativo, conduzir brainstorming e comparar de duas a três abordagens.
5. Antes de mudanças amplas, apresentar plano compacto e contrato de UI.
6. Implementar em incrementos pequenos, começando pelo fluxo principal.
7. Validar comportamento, qualidade técnica, responsividade, acessibilidade e aparência no app em execução.
8. Auditar a interface com `design-sem-cara-de-ia`, incluindo o script quando houver código compatível.
9. Executar a Sessão de Avaliação Visual da fase, registrar o resultado e obter aprovação explícita de Yan.
10. Executar as validações de segurança proporcionais ao risco; usar Strix quando houver alvo autorizado e testável.
11. Revisar o diff com Ponytail.
12. Registrar resultados, falhas e limitações reais.

## 12. Definição de pronto

Uma tarefa só pode ser considerada concluída quando os critérios relevantes forem atendidos:

- objetivo e critérios de aceitação aprovados;
- fluxo principal funcional, não apenas telas estáticas;
- aderência verificada à skill `editorial-modular-app-design`;
- auditoria `design-sem-cara-de-ia` concluída, com sinais genéricos removidos ou deliberadamente justificados;
- estados relevantes implementados ou especificados;
- layout validado nas larguras desktop de 1024, 1280, 1440 e 1920px;
- WCAG 2.2 AA considerada, com teclado e foco validados no web;
- formatação, lint, typecheck, testes e build existentes executados com sucesso;
- fluxo principal exercitado no navegador;
- no Persona Live, argumentos e rascunho aparecem separados, possuem origem rastreável e não inventam fatos;
- o modo Manual continua disponível quando áudio, transcrição, detecção ou geração falharem;
- revisão visual feita em estados representativos;
- Sessão de Avaliação Visual da fase apresentada, registrada e explicitamente aprovada por Yan antes do avanço;
- script `auditar_tells_ia.py` executado quando aplicável e achados revisados manualmente;
- validações de segurança executadas; quando Strix for aplicável, achados reproduzidos, corrigidos e verificados por novo scan;
- revisão Ponytail concluída e complexidade desnecessária removida;
- nenhuma falha ocultada; riscos e limitações materiais registrados;
- arquivos modificados e comandos executados informados no handoff.

## 13. Decisões e preparação antes de cada fase

O plano geral, o uso desktop/web, o Design DNA, a stack, a autenticação Microsoft via Supabase e a arquitetura de informação estão aprovados. Alterações futuras no mapa, nas rotas ou nos fluxos precisam de nova aprovação explícita antes da implementação correspondente. Antes de implementar cada fluxo, detalhar e registrar apenas o necessário para aquela fase:

- público prioritário e problema inicial mais específico;
- validação com usuários de que o fluxo evidência → argumentos → rascunho curto é útil durante a preparação ou realização de entrevistas;
- eventuais alterações no mapa de páginas, nas rotas e nos fluxos aprovados;
- relação entre apresentação pública do sistema, login Microsoft, onboarding e experiência interna;
- estratégia de reaproveitamento da v1 para esse fluxo;
- tokens e componentes do Design DNA afetados;
- função, personalidade e linguagem visual do mascote/personagens;
- critérios de sucesso para banca e testes com usuários.

## 14. Continuidade, log e commits obrigatórios

Antes de qualquer nova tarefa, ler também:

1. `docs/handoff/START_HERE.md`;
2. `docs/handoff/CURRENT_STATE.md`;
3. `log_execução.md`;
4. os mapas temáticos de `docs/handoff/` relevantes ao trabalho.

Após cada fase, correção ou implementação nova:

1. atualizar o estado factual em `docs/handoff/CURRENT_STATE.md`;
2. atualizar somente os mapas afetados em `docs/handoff/`;
3. gerar ou atualizar o plano e a revisão da fase;
4. acrescentar uma entrada completa em `log_execução.md`, sem apagar histórico;
5. executar validações proporcionais ao risco;
6. revisar `git diff`, staged files e ausência de segredos;
7. criar um commit coerente, mesmo quando a aprovação visual ainda estiver pendente;
8. registrar a decisão posterior de Yan em novo commit quando ela alterar o status;
9. fazer push somente para remoto correto já configurado ou explicitamente aprovado.

Mensagens de commit devem identificar intenção e, quando aplicável, fase:

```text
feat(fase-N): descrição objetiva
fix(fase-N): descrição objetiva
docs: descrição objetiva
test(fase-N): descrição objetiva
```

Se Git ou remoto não existirem, não inventar destino nem reutilizar repositório da Persona v1. Criar commit local quando autorizado pela tarefa e informar claramente que publicação remota continua pendente.

O handoff de qualquer tarefa precisa informar: arquivos alterados, comandos, resultado, limitações, commit criado, status do push e próximo gate de aprovação.
