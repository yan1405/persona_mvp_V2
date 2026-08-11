# Design, referências, skills e screenshots

## 1. Regra de precedência visual

1. **Persona original:** somente paleta e logos oficiais.
2. **Design DNA adaptado do CRM:** estrutura, densidade, geometria, superfícies, componentes e movimento.
3. **Persona MVP v2:** Geist, conteúdo, fluxos, arquitetura, estados e decisões novas.

Quando houver conflito, a paleta e os logos do Persona prevalecem. Nenhuma outra decisão visual antiga entra automaticamente.

Fontes obrigatórias:

- `docs/design/design-dna.json`;
- `docs/design/BRAND_FOUNDATION.md`;
- `docs/design/DESIGN_DNA_ADAPTATION.md`;
- `docs/design/VISUAL_REVIEW_PROTOCOL.md`;
- código/telas aprovadas do CRM apenas para estrutura e comportamento;
- contrato da fase ativa.

Proibido usar telas, screenshots, layout ou assets da Persona v1 como referência. O legado serve somente para requisitos novamente confirmados.

## 2. Tokens de marca

### Índigo

| Token | Valor | Papel |
|---|---|---|
| `indigo-50` | `#F7F5FE` | realce claro |
| `indigo-100` | `#ECEAFB` | seleção/borda suave |
| `indigo-200` | `#DDD6F8` | superfície marcada |
| `indigo-300` | `#C4B5FD` | texto secundário escuro |
| `indigo-400` | `#A78BFA` | foco/realce |
| `indigo-500` | `#7C3AED` | ação principal/logo |
| `indigo-600` | `#6D28D9` | hover |
| `indigo-700` | `#5B21B6` | ênfase clara |
| `indigo-900` | `#2E1A6B` | ênfase máxima |

### Neutros violeta

`#FAFAFC`, `#F2F1F7`, `#E4E2EE`, `#C9C5D8`, `#888291`, `#6D5BA6`, `#4F4866`, `#2E2A3D`, `#1A1726`.

### Semânticas

- sucesso: `#ECFDF5`, `#10B981`, `#064E3B`;
- alerta: `#FFFBEB`, `#F59E0B`, `#78350F`;
- erro: `#FEF2F2`, `#EF4444`, `#7F1D1D`;
- informação: `#EFF6FF`, `#3B82F6`, `#1E3A8A`.

O roxo marca ação, seleção, foco, rastreabilidade e identidade. Não preencher grandes superfícies sem função. Gradiente roxo-índigo, neon e glassmorphism continuam proibidos.

## 3. Tipografia, geometria e layout

- Geist Sans: interface, títulos e corpo;
- Geist Mono: IDs, atalhos e metadados técnicos;
- títulos de página: 28/34, peso 600 como base operacional;
- títulos de seção: 18/24, peso 600;
- corpo: 14/21;
- labels/metadados: 12/16;
- grid de espaço baseado em 4px;
- intervalos dominantes: 8, 12, 16, 24 e 32px;
- raio 4px em controles, 5px em superfícies e 8px em superfícies especiais;
- controles padrão 32px; ação principal de entrada/onboarding 36px;
- bordas/contraste antes de sombra;
- sombras somente em elevação real;
- cabeçalho 48px;
- trilho principal 56px;
- painel contextual 280–360px;
- conteúdo até 1280px e gutter mínimo 24px;
- viewports: 1024, 1280, 1440 e 1920px.

## 4. Logos e imagens

Arquivos:

- `apps/web/public/brand/persona-logo-rica.svg` — fundo claro, 24px ou mais;
- `apps/web/public/brand/persona-logo-rica-dark.svg` — fundo escuro, 24px ou mais;
- `apps/web/public/brand/persona-logo-compacta.svg` — favicon/até 20px;
- `apps/web/public/brand/persona-logo-mono.svg` — uso monocromático.

Não aplicar gradiente, sombra, distorção ou recoloração arbitrária.

Xisto/mascote ainda não possui linguagem aprovada. Não criar personagem definitivo por iniciativa própria.

## 5. Skills obrigatórias

### `editorial-modular-app-design`

Usar para desenhar, implementar, refatorar ou auditar interface.

Exige:

- conteúdo antes do chrome;
- hierarquia por posição, alinhamento, espaço e tipo;
- blocos modulares;
- ações progressivas;
- estados completos;
- WCAG 2.2 AA;
- responsividade proporcional ao escopo;
- revisão visual no app real.

### `design-sem-cara-de-ia`

Usar em toda tela nova ou alterada.

Exige:

- âncora visual e direção específica;
- copy concreta;
- remoção de três sinais genéricos;
- revisão de cor, tipografia, layout, ícones, movimento e stack default;
- execução do script quando houver HTML/CSS/JSX/TSX:

```powershell
C:\Users\yansi\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe `
  C:\Users\yansi\.codex\skills\design-sem-cara-de-ia\scripts\auditar_tells_ia.py `
  --caminho C:\Users\yansi\OneDrive\Persona_Geral\persona_mvp_v2\apps\web
```

Cada ocorrência é candidata a revisão manual, não erro automático. O script atualmente reconhece `#7C3AED` como possível gradiente por heurística; a cor isolada é a marca aprovada.

### `design-dna`

Usar quando a tarefa extrair, alterar, comparar ou aplicar o DNA. Auditar antes de editar e preservar a stack real do projeto. O JSON orienta visual; não redefine Next.js, banco ou autenticação.

### Ponytail em nível `full`

Usar em código, arquitetura, dependência, refatoração e revisão.

Ordem:

1. confirmar necessidade;
2. reutilizar o projeto;
3. usar plataforma/stdlib;
4. usar dependência instalada;
5. escrever a menor solução completa;
6. manter um teste mínimo para lógica não trivial.

Nunca simplificar segurança, privacidade, acessibilidade, validação ou prevenção de perda de dados.

### Brainstorming

Usar antes de criar nova feature, componente, comportamento ou contrato amplo. Comparar duas ou três abordagens, recomendar uma e documentar a decisão antes de implementação ampla.

### Skills por artefato

Se uma fase produzir PDF, DOCX, PPTX ou planilha, usar a skill específica e cumprir renderização/QA visual. Não usar essas skills apenas porque o formato aparece como visão futura.

## 6. Política shadcn/ui e ícones

- não importar monorepo ou bloco visual pronto;
- usar `shadcn view` antes de `shadcn add`;
- adicionar somente componente com uso imediato;
- tratar código recebido como código local;
- mapear tokens do Persona antes de aceitar o visual;
- preferir HTML nativo quando suficiente;
- Carbon para domínio/navegação;
- Lucide apenas para utilidades sem equivalente conveniente;
- não misturar famílias no mesmo grupo.

No estado atual, Carbon Icons React está instalado e é usado no shell e nas ações de domínio. shadcn/ui e Lucide não estão instalados.

## 7. Tells proibidos por padrão

- gradiente roxo-índigo;
- brilho neon;
- glassmorphism;
- hero centralizado de tela cheia + três cards iguais;
- dashboard genérico de cartões repetidos;
- sombras em toda superfície;
- pills em todos os controles;
- copy como “leve sua carreira ao próximo nível”;
- emoji como iconografia;
- movimento decorativo repetido;
- IA apresentada como chatbot sem rastreabilidade;
- valor/score inventado para preencher estado vazio.

## 8. Screenshots obrigatórios

Para cada fase com UI:

- capturar app real;
- estados vazio, preenchido, foco, loading, erro, sucesso e painel/modal quando aplicáveis;
- validar 1024, 1280, 1440 e 1920px conforme risco;
- salvar em `docs/reviews/fase-N-<nome>/`;
- nomear `rota-viewport-estado.png` quando possível;
- não incluir token, e-mail desnecessário, dado financeiro ou relato privado em screenshot público;
- usar dados sintéticos ou autorizados.

## 9. Inventário visual existente

### Fase 1

Diretório `docs/reviews/fase-1-fundacao/`:

- entrada 1024;
- entrada 1280;
- entrada 1440;
- entrada 1920;
- versões corrigidas com paleta Persona.

### Fase 2

Diretório `docs/reviews/fase-2-autenticacao/`:

- configuração necessária;
- onboarding autenticado.

### Fase 3

Diretório `docs/reviews/fase-3-onboarding/`:

- `etapa-1-contexto.png`;
- `etapa-4-daily-log.png`;
- `inicio-primeiro-registro.png`.

Fase 3 tem captura automatizada em 1280×720. As larguras restantes são item de avaliação manual pendente.

### Fase 4

Diretório `docs/reviews/fase-4-diario-evidencias/`:

- evidência confirmada em 1024, 1280, 1440 e 1920px;
- dados sintéticos removidos após a captura.

### Fase 5

Diretório `docs/reviews/fase-5-biblioteca-evidencias/`:

- Biblioteca preenchida em 1024, 1280, 1440 e 1920px;
- detalhe Provas em 1440px;
- somente dados sintéticos, removidos e verificados no Supabase após a captura.

## 10. Sessão visual obrigatória

A revisão em `docs/reviews/fase-N-<nome>.md` precisa registrar:

- fase, data, rotas, viewports e estados;
- referências comparadas;
- aderências;
- divergências e justificativas;
- três tells genéricos removidos ou mantidos;
- correções solicitadas;
- testes do usuário;
- eficiência aplicada;
- decisão de Yan.

Sem `aprovado` ou `aprovado com ajustes` explicitamente autorizado, a fase seguinte permanece bloqueada.
