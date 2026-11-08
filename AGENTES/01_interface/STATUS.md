# Status — Persona — Migração de Interface

Estado: WAITING_APPROVAL (Lote 2 · 01 entregue: licença das fontes PROVADA e Fundação visual implementada; aguarda gate da Verificação e aceite visual de Yan). Nenhuma tela migrada.

| Tarefa | Peso | Estado | Evidência |
|---|---:|---|---|
| Fundação visual da fatia | 20 | PENDING | autoexecução de lint, typecheck, `npm test` e build verdes; `FUNDACAO_LOTE2.md`; `VERIFIED` só após a Verificação; visual depende do aceite de Yan |
| Componentes e estados | 25 | PENDING | fora do Lote 2 |
| Tela/fluxo aprovado | 35 | PENDING | fora do Lote 2 |
| Acessibilidade e larguras | 20 | PENDING | sem sessão de login; 1024/1440/1920 px e leitor de tela não feitos |

Concluído (plano ponderado do papel): 0% comprovado até a Verificação e o aceite visual; a Fundação pesa 20 e só conta com essas evidências.

Escopo recebido: `AGENTES/ATRIBUICOES/LOTE-2.md`, linha 01, em `wt/interface-lote2` (`C:\Users\yansi\Projetos\persona-wt\lote2-interface`), base `acc1f44`.

Correção IF2-1 (S2 da Verificação sobre `e6b3e5c`, `RELATORIO_interface_e6b3e5c.md`): **corrigido, pendente de re-verificação.** `.app-content` não tem mais `min-width: 0` e a coluna da casca é `1fr`: o painel cresce até o conteúdo e a janela rola na horizontal, como antes da casca; `overflow: clip` só arredonda. Barra superior < 640 px limitada à janela. Em harness com o CSS real do build e a marcação de `.artifact-filters`, `.artifact-list`, `.live-session-list` e `.live-evidence-options`, a 1024, 1100, 1152, 1200, 1230, 1280, 1920 e 375 px nada ficou fora do painel; a janela rola abaixo de ≈ 1226 px e não rola a 1280/1920 px. Casca real (login) segue PENDING. O SHA a congelar é o HEAD do branch (`git rev-parse HEAD`), informado por mensagem; `e6b3e5c` é o SHA anterior, histórico. IF2-4 (autorrótulo) aplicado na tabela acima. IF2-2 (barra lateral em janelas baixas) e IF2-3 (`<main>` em Configurações) **não** foram resolvidos por esta correção e seguem abertos.

Etapa 1 — licença: `docs/redesign/interface/LICENCAS_FONTES.md`. **PROVADA**: Plus Jakarta Sans e Inter são OFL-1.1, sem Reserved Font Name; `.woff2` idênticos (SHA-256) aos servidos pelo Google Fonts; fontes primárias `google/fonts@5bb2873`, `rsms/inter@v4.1`, `tokotype/PlusJakartaSans@2.7.1`. Versão e ausência de RFN lidas das licenças/metadados, não da tabela `name` dos binários.
Etapa 2 — Fundação: `apps/web/app/layout.tsx`, `app/globals.css` (tokens `--ds-*`, tipografia, casca), `components/shell/app-shell.tsx`, `app/app/app-navigation.tsx`, `app/app/layout.tsx`, `public/fonts/**`, `docs/redesign/interface/FUNDACAO_LOTE2.md`.

Comandos e resultados (em `apps/web`, sem `.env`, lockfile intacto): `npm ci` ok; `npm run lint` ok; `npm run build` ok; `npm run typecheck` ok (depende do build para os tipos de rota); `git diff --check` limpo. `npm test` não rodado (`lib/**` intocado).
Visual: `/entrar`, `/termos`, `/privacidade` em 375 e 1280 px no navegador embutido (Inter carrega; `/entrar` com +5 px de rolagem a 375 px, **pré-existente**, fora do escopo). Casca avaliada só em harness estático (1280/1000/375 px): PENDING a sessão real.

Riscos:
- Tema misto transitório: moldura clara do DS + painel escuro legado até cada fatia pôr `ds-surface` na raiz (o DS não tem variante escura).
- Regressões possíveis em todas as telas de `/app/**` (moldura, fonte, largura útil); lista e roteiro de verificação em `FUNDACAO_LOTE2.md` §4–5.
- Geist Mono continua carregado de `node_modules/next/...` (sem fonte monoespaçada no DS).
- Header do DS, busca, painel do Agente, “Continue de onde parou” e emblemas ficaram de fora (dependem do Agente e de dados de outras áreas).

Decisões pendentes de Yan: aceite visual da moldura clara com painel escuro transitório; monoespaçada (manter Geist Mono × definir no DS); decisões 4.2–4.9 do `MAPA_TELAS.md` seguem abertas.

Bloqueio: nenhum. Próximo passo: Orquestrador congela o SHA do HEAD (`git rev-parse HEAD`) e envia à Verificação; depois Yan decide.
