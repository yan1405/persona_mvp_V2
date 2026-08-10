# Adaptação do Design DNA ao Persona

Status: aprovado como direção visual da implementação.

## 1. Fonte e objetivo

O arquivo local [`design-dna.json`](./design-dna.json) é a fonte visual estruturada versionada do Persona. Sua estrutura foi derivada do DNA fornecido em `C:\Users\yansi\Projetos\crm\docs\design-dna.json`, mas a marca tem uma fonte independente: a paleta original e os logos oficiais do Persona.

As telas, screenshots, imagens, layouts e composições visuais do CRM são referências aprovadas para estrutura, densidade, geometria e comportamento. Textos, dados, marca, paleta, logos e funções exclusivas do CRM não pertencem ao Persona.

As telas, screenshots, layouts e composições da Persona v1 continuam explicitamente rejeitados como referência visual. A exceção aprovada é limitada à paleta original e aos logos oficiais, recuperados do pacote independente `persona-design-system-v0.1` e copiados para a v2. Nenhuma outra decisão desse sistema antigo é herdada automaticamente.

O objetivo é reinterpretar a densidade, precisão e personalidade descritas pelo DNA, combinando-as com minimalismo editorial, estrutura modular e inspiração funcional do Notion. O Notion é referência de clareza e interação contextual, não uma identidade a ser copiada.

## 2. Contrato visual

### Cores

| Papel | Token | Valor |
|---|---|---|
| Fundo principal escuro | `--color-bg-canvas` | `#1A1726` |
| Superfície escura | `--color-bg-surface` | `#2E2A3D` |
| Superfície elevada | `--color-bg-elevated` | `#4F4866` |
| Borda padrão | `--color-border` | `rgba(167, 139, 250, 0.25)` |
| Borda sutil | `--color-border-subtle` | `rgba(167, 139, 250, 0.15)` |
| Texto principal | `--color-text-primary` | `#FAFAFC` |
| Texto secundário | `--color-text-secondary` | `#C4B5FD` |
| Texto discreto | `--color-text-muted` | `#888291` |
| Ação principal | `--color-accent` | `#7C3AED` |
| Ação em hover | `--color-accent-hover` | `#6D28D9` |
| Realce e foco | `--color-accent-bright` | `#A78BFA` |

A paleta original do Persona é formada pela família índigo `#F7F5FE`, `#ECEAFB`, `#DDD6F8`, `#C4B5FD`, `#A78BFA`, `#7C3AED`, `#6D28D9`, `#5B21B6` e `#2E1A6B`, combinada aos neutros violeta `#FAFAFC`, `#F2F1F7`, `#E4E2EE`, `#C9C5D8`, `#888291`, `#6D5BA6`, `#4F4866`, `#2E2A3D` e `#1A1726`.

O roxo é reservado a ações, seleção, foco, rastreabilidade e marcas de identidade. Ele não deve virar preenchimento decorativo generalizado. Gradientes roxo-índigo, brilho neon e grandes superfícies saturadas continuam proibidos.

### Tipografia

- Família principal: Geist Sans.
- Família monoespaçada: Geist Mono, restrita a IDs, atalhos, metadados técnicos e pequenos dados tabulares.
- Plus Jakarta Sans e JetBrains Mono pertencem ao sistema antigo e não são adotadas pela v2.
- Hierarquia por tamanho, peso e espaço; não por excesso de cor.
- Títulos de página: `28px/34px`, peso 600.
- Títulos de seção: `18px/24px`, peso 600.
- Corpo: `14px/21px`, peso 400.
- Metadados e rótulos: `12px/16px`, peso 500.

### Geometria, densidade e profundidade

- Raios: 4px em controles, 5px em cartões e 8px somente em superfícies especiais.
- Botões e campos padrão: 32px de altura; 36px apenas para a ação principal de entrada/onboarding.
- Espaçamento baseado em 4px, com 8, 12, 16, 24 e 32px como intervalos dominantes.
- Separação por bordas e contraste de superfície. Sombras são raras e reservadas a menus, popovers e elementos realmente flutuantes.
- Nada de cartões dentro de cartões sem uma relação estrutural explícita.

### Logos, iconografia e ilustração

- O símbolo oficial do Persona é a constelação presente nos SVGs locais de `apps/web/public/brand/`.
- `persona-logo-rica.svg`: fundos claros e uso a partir de 24px.
- `persona-logo-rica-dark.svg`: fundos escuros e uso a partir de 24px.
- `persona-logo-compacta.svg`: favicon e usos de até 20px.
- `persona-logo-mono.svg`: reprodução sem cor.
- A tipografia do wordmark na interface é Geist; o antigo lockup com Plus Jakarta Sans não é usado pela v2.

- Carbon Icons representa navegação e ações do domínio quando houver equivalente adequado.
- Lucide fica restrito a utilidades trazidas por componentes shadcn/ui ou estados sem equivalente conveniente.
- Um mesmo grupo visual não mistura estilos de ícones.
- Ícones devem ter rótulo ou tooltip quando o significado não for inequívoco.
- O Xisto ainda não tem linguagem final aprovada. Até essa decisão, nenhum mascote definitivo será implementado. O espaço conceitual fica limitado a onboarding, estados vazios e celebrações pontuais, sem partículas decorativas constantes.

### Movimento

- Feedback de controle: 100–150ms.
- Entrada ou expansão contextual: 180–240ms.
- Transição estrutural: até 400ms.
- Movimento explica mudança de estado ou hierarquia; não cria espetáculo.
- Respeitar `prefers-reduced-motion` desde a primeira implementação.

## 3. Estrutura desktop

- Cabeçalho global: 48px.
- Trilho lateral principal: 56px, com ícones e tooltips.
- Painel contextual opcional: 280–360px, usado somente quando melhora busca, filtros ou edição.
- Área operacional: largura máxima de 1280px, com respiro lateral mínimo de 24px.
- Alvos principais de validação: 1024, 1280, 1440 e 1920px.
- A versão atual não promete experiência mobile. O código não deve impedir adaptação futura, mas não serão criadas navegações ou layouts móveis especulativos.

## 4. Componentes afetados

### Fundação

- tokens CSS de cor, tipografia, espaço, raio, borda, elevação e movimento;
- shell autenticado, cabeçalho, trilho lateral e painel contextual;
- estados de foco, hover, seleção, carregamento, vazio e erro.

### Primitivos shadcn/ui adaptados

- Button, Input, Textarea, Label e Select;
- Dialog, Sheet, Popover, Tooltip e Dropdown Menu;
- Tabs, Badge, Separator e Scroll Area;
- Form, Toast/Sonner e Skeleton.

Os componentes serão copiados seletivamente para o projeto e tratados como código local. O visual padrão do shadcn/ui não será aceito sem mapeamento para os tokens do DNA.

### Componentes do Persona

- `EvidenceCard`: evidência, estado, origem e qualidade;
- `EvidenceEditor`: captura e revisão contextual;
- `EvidenceLevel`: força/qualidade da evidência sem gamificação infantil;
- `LiveQuestionComposer`: pergunta manual ou cenário demonstrativo;
- `ArgumentBlock`: argumento recuperado com rastreabilidade;
- `DraftBlock`: texto curto gerado, visualmente separado das fontes;
- `ArtifactCard`: produção criada e seu vínculo com evidências;
- `NarrativeSnapshot`: síntese de evolução, subordinada ao fluxo principal.

## 5. Assinatura visual do Persona

A diferenciação não dependerá de efeitos genéricos. Ela será construída por três elementos:

1. evidências apresentadas como blocos editoriais rastreáveis;
2. relações visuais claras entre fonte, argumento e texto gerado;
3. uma linguagem futura do Xisto que represente conexão e trajetória, sem imitar o Notion ou uma estética de chatbot.

## 6. Critérios de conformidade

Uma tela só está pronta quando:

- usa os tokens locais, sem valores arbitrários recorrentes;
- mantém hierarquia clara sem depender de cartões excessivos;
- contém estados vazio, carregando, erro, sucesso e desabilitado quando aplicáveis;
- funciona por teclado, possui foco visível e contraste adequado;
- não contém copy promocional genérica nem elementos decorativos sem função;
- foi comparada com `design-dna.json` e revisada com `design-sem-cara-de-ia` e Ponytail.
