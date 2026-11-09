# Fundação visual — Lote 2 (Interface)

08/11/2026. Base `acc1f44`. Escopo: tokens, tipografia, AppShell e navegação. **Nenhuma tela foi migrada.** Fontes: pacote `docs/design/approved/2026-11-03-t4` (somente leitura) e `MAPA_TELAS.md`.

## 1. O que mudou

| Arquivo | Mudança |
|---|---|
| `apps/web/app/layout.tsx` | Inter e Plus Jakarta Sans via `next/font/local` a partir de `public/fonts/` (substitui o Geist Sans lido de `node_modules/next/...`). Geist Mono segue para o papel técnico. |
| `apps/web/public/fonts/**` | 2 `.woff2` variáveis (`latin`) e 2 textos OFL. Licença provada em `LICENCAS_FONTES.md`. |
| `apps/web/app/globals.css` | (a) `--font-sans` → Inter; `--font-display` → Plus Jakarta Sans. (b) Bloco novo de tokens `--ds-*`. (c) Bloco antigo da casca (`.app-shell`, `.app-header`, `.app-rail`, `.rail-item*`, `.app-content`, ~80 linhas) substituído por `.skip-link`, `.app-shell`, `.app-sidebar*`, `.nav-*`, `.app-content`. (d) Removida a regra de 48 px de `.app-shell` no `@media`; impressão aponta para as classes novas. Nenhuma outra regra das ~3.000 linhas foi tocada. |
| `apps/web/components/shell/app-shell.tsx` | Novo. Moldura: link “Ir para o conteúdo”, slot de navegação e painel `#conteudo`. Não renderiza `<main>` (cada página já tem o seu). |
| `apps/web/app/app/app-navigation.tsx` | Trilho de 36 px → barra lateral do DS: marca, “Registrar agora” (→ `/app/diario`), 5 destinos com rótulo, Configurações no rodapé. Ícones Carbon (regra `AGENTS.md` §8). |
| `apps/web/app/app/layout.tsx` | Mantém a guarda de sessão/onboarding; só renderiza `AppShell`. O cabeçalho “Persona · Base profissional” saiu: a marca agora está na barra lateral. |

## 2. Decisões de implementação

- **Tokens com prefixo `--ds-`.** O DS reutiliza nomes que o legado já usa com outros valores (`--indigo-500` é `#7c3aed` no legado e `#8b5cf6` no DS; `--radius-sm/md/lg` colidem com o `@theme` do Tailwind). O prefixo permite coexistir sem regressão; cada fatia migra suas classes e, no fim, o legado sai.
- **Moldura clara, painel escuro enquanto a tela é legada.** O DS aprovado é claro e **não tem variante escura**; as telas atuais são escuras. Misturar texto claro em painel claro as tornaria ilegíveis. Por isso `.app-content` mantém o fundo/tema atuais e passa a claro (`--ds-surface-subtle`) quando a página contém `.ds-surface` (seletor `:has`). A fatia migrada só precisa pôr `ds-surface` na raiz do seu `<main>`. Sem JavaScript e sem lista de rotas.
- **Sem cabeçalho fixo, busca e painel do Agente.** Dependem do Agente (decisão 4.3: fora desta migração). **Sem** “Continue de onde parou” e emblemas de contagem: exigem consultas a dados de outras áreas (`lib/**`).
- **Responsivo sem JavaScript novo.** ≥ 1100 px: barra de 256 px com botão de recolher (estado local, não persiste). < 1100 px: trilho de 76 px. < 640 px: barra superior com os mesmos destinos (sem gaveta e sem armadilha de foco); “Registrar agora” some nesse tamanho (o Diário é um destino).
- **Rolagem na janela, não no painel.** O DS rola dentro do painel; aqui o painel não é contêiner de rolagem, para não quebrar os `position: sticky` das telas atuais. A coluna do painel é `1fr` (mínimo automático, sem `min-width: 0`): se uma grade legada precisa de mais largura que a janela oferece (≈ 946 px de painel em Artefatos/Live), o painel cresce com o conteúdo e a **janela rola na horizontal** em vez de cortar. Isso **não** equivale à base (`acc1f44`), que não rolava nessas larguras: por isso os filtros de Artefatos e do Diário quebram linha abaixo de 1280 px (IF3-1), e o que ainda for mais largo que o painel rola em vez de ser cortado. `overflow: clip` só arredonda os cantos e não corta nada (IF2-1 e IF3-1 da Verificação, sobre `e6b3e5c` e `d71f2a7`). Abaixo de 640 px a barra superior fica limitada à janela (`max-width: calc(100vw - 16px)`, `left: 8px`).
- **Anel de foco.** O DS usa `indigo-400` (≈ 2,7:1 sobre branco); a barra lateral usa `--ds-focus-ring: indigo-600` (≈ 5,7:1), para cumprir WCAG 2.2 (1.4.11, 3:1).
- **Fonte latin apenas** (ver `LICENCAS_FONTES.md` §4).

## 3. Tokens adotados × aprovados

| Grupo | Aprovado (`design-system/tokens/*.css`) | Adotado |
|---|---|---|
| Cores (indigo, neutros, semânticas, tiles) | `colors.css` | **Todas**, como `--ds-*` (mesmos valores). `--ds-focus-ring` difere (acima). |
| Aliases semânticos | `--bg-app`, `--surface-*`, `--text-*`, `--border-*`, `--brand*`, `--ink` | Adotados (`--ds-bg-app`…). Não adotados: `--surface-focal*`, `--brand-gradient`, `--bubble-*`, `--success/warning/danger/info` (sem consumidor na Fundação). |
| Espaço, raios | `spacing.css` | Adotados; `--gutter`, `--section-gap*`, `--card-pad*` ficam para as fatias. |
| Sombras, movimento | `effects.css` | `--ds-shadow-soft`, `--ds-shadow-float`, `--ds-dur-*`. Não adotados: `shadow-slab`, `brand-glow`, `ring-focus` (substituído), `@keyframes persona-*` (nenhum uso). `prefers-reduced-motion` já é coberto pela regra global existente. |
| Tipografia | `typography.css`, `fonts.css` | Famílias e escala `--ds-fs-*`. Não adotados: `--lh-*`, `--tr-*`, `--fw-*` (cada fatia define ao usar). |
| Ícones | Lucide (DS) | **Carbon**, por `AGENTS.md` §8 (decisão 4.2 do mapa segue pendente de Yan). |

## 4. Regressões possíveis nas telas atuais

1. **Todas as telas de `/app/**`** ganham moldura nova (barra lateral clara 256/76 px, painel arredondado com margem de 16 px). A área útil horizontal diminui até ~272 px em ≥ 1100 px (antes 56 px); o `.app-page` tem `max-width` 1280 e pode ficar mais estreito em notebooks de 1280 px. Os filtros de Artefatos (≈ 928 px) e do Diário passam a 3 colunas abaixo de 1280 px (o override antigo do Diário em ≤ 1023 px foi removido), e os filtros do Diário passam a uma coluna abaixo de 450 px (IF5-1); a coluna de título da lista de Artefatos encolhe (`minmax(0, 1fr)`; IF4-1). Com isso, na amostra sintética (CSS real do build), nenhuma página medida (Artefatos, Diário, Live) rola na horizontal de 375 a 1280 px. Telas reais e grades não amostradas (Evidências, Score, Diagnóstico, Configurações) seguem **HYPOTHESIS**: se alguma ainda for mais larga que o painel, a janela rola em vez de cortar. Verificar tabelas e grades largas (Evidências, Artefatos).
2. **Mudança de fonte global** (Geist → Inter): larguras de texto mudam levemente; checar quebras de linha em botões, abas, filtros e cabeçalhos de 3+ colunas.
3. `.diagnostic-page` tem `min-height: calc(100svh - 48px)` herdado do cabeçalho antigo; fica um pouco abaixo da altura do painel (sem efeito visível esperado).
4. Impressão do Artefato: `.app-content` perde fundo/raio na impressão (regra existente estendida); conferir a folha A4.
5. Rótulos curtos: `title` aparece só no modo recolhido (trilho automático < 1100 px não define `title`; o nome acessível vem do texto visualmente oculto).
6. `/entrar` (fora da Fundação) já transborda ~5 px a 375 px **antes** desta mudança (`@media (max-width: 1023px)` mantém `.login-grid` em duas colunas, a segunda com 380 px). Não corrigido: é tela, não Fundação.
7. Tema misto transitório: moldura clara + painel escuro até as fatias migrarem. Efeito estético deliberado, a validar por Yan.

## 5. Como verificar

```bash
cd apps/web
npm ci
npm run lint
npm run build          # gera os tipos de rota
npm run typecheck      # depende do build acima
git diff --check
```

Verificação visual (exige login Microsoft/Supabase para as rotas `/app/**`): em 375, 1024, 1280, 1440 e 1920 px, percorrer `/app/inicio`, `/diario`, `/evidencias`, `/live`, `/artefatos`, `/configuracoes`. Conferir: item ativo com `aria-current="page"`; Tab percorre “Ir para o conteúdo”, recolher, Registrar, 5 destinos, Configurações, com foco visível; alvos ≥ 44 px; sem rolagem horizontal; leitor de tela anuncia uma região “Navegação principal”. Para uma fatia migrada: `ds-surface` na raiz do `<main>` clareia o painel.

## 6. Verificação feita neste lote

- Lint, typecheck e build verdes sem `.env` (`npm run build` após `npm ci`).
- Páginas públicas `/entrar`, `/termos`, `/privacidade`, no navegador embutido (`next start`), 375 e 1280 px: fonte Inter carrega (`document.fonts.check`); `/termos` e `/privacidade` sem rolagem horizontal; `/entrar` sem rolagem a 1280 px e +5 px a 375 px (pré-existente, item 6).
- Casca: não há login, então a moldura foi avaliada numa página-harness estática (HTML do shell com o CSS real do build, fora do repositório) em 1280, 1000 e 375 px: 256 → 76 px → barra superior, painel escuro por padrão e claro com `.ds-surface`, 44×44 px em todos os alvos, sem rolagem horizontal. O harness não usa os componentes React nem a navegação real: **PENDING** — sessão real de `/app/**`, 1024/1440/1920 px, teclado com leitor de tela, aceite visual de Yan (`AGENTS.md` §6.1).
- Não executado: `npm test` (nenhum arquivo de `lib/**` foi alterado), `auditar_tells_ia.py`.

## 7. Telas migradas (Lote 3)

Receita de uma fatia: pôr `ds-surface` na raiz do `<main>`. Sob `.ds-surface`, `globals.css` re-pinta os primitivos legados (`.eyebrow`, `.text-field`, `.button-primary/-secondary`, `.inline-notice`, `.form-*`, `.empty-state`) no tema claro, então formulários e listas legados não mudam de marcação. As demais telas continuam escuras e intactas. Larguras por `@container` (o painel varia com a barra lateral); grades `minmax(0, 1fr)`. Desvios do DS: borda de campo `n-400` (3,7:1) no lugar de `n-200` (1,6:1) e anel de foco `indigo-600` (`indigo-300` sobre o painel escuro).

| Tela | O que mudou | Não incluído |
|---|---|---|
| Início (`app/app/inicio/page.tsx`) | bloco focal (rastreabilidade + próximo movimento), cartão do Score com dimensões, objetivo, registros recentes e competências | busca/AgentPrompt, atalhos de destino com contagens, "Atividade recente" (Agente e dados de outras áreas; decisão 4.3) |
| Diário (`app/app/diario/page.tsx`, `diary-forms.tsx`) | cartão de captura, fluxo em `ol`, filtros, histórico em cartões com estado visível também em largura estreita | painel flutuante do registro e estados `carregando`/`conflito` (decisão 4.7; `[id]` segue escura) |
| Evidências (`app/app/evidencias/page.tsx`) | cabeçalho, registro manual em cartão, filtros salvos em pílula, filtros e lista em cartões | detalhe `/[id]` (segue escuro), painel flutuante e estados `carregando`/`conflito` (decisão 4.7) |
