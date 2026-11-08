# Status — Persona — Migração de Interface

Estado: WAITING_APPROVAL (Lote 2 · 01 entregue: licença das fontes PROVADA e Fundação visual implementada; aguarda gate da Verificação e aceite visual de Yan). Nenhuma tela migrada.

| Tarefa | Peso | Estado | Evidência |
|---|---:|---|---|
| Fundação visual da fatia | 20 | VERIFIED (código) / PENDING (visual) | lint, typecheck e build verdes; `FUNDACAO_LOTE2.md`; aceite visual pendente |
| Componentes e estados | 25 | PENDING | fora do Lote 2 |
| Tela/fluxo aprovado | 35 | PENDING | fora do Lote 2 |
| Acessibilidade e larguras | 20 | PENDING | sem sessão de login; 1024/1440/1920 px e leitor de tela não feitos |

Concluído (plano ponderado do papel): 0% comprovado até a Verificação e o aceite visual; a Fundação pesa 20 e só conta com essas evidências.

Escopo recebido: `AGENTES/ATRIBUICOES/LOTE-2.md`, linha 01, em `wt/interface-lote2` (`C:\Users\yansi\Projetos\persona-wt\lote2-interface`), base `acc1f44`.

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
