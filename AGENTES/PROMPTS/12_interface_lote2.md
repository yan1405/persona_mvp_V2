# Prompt — Interface — Lote 2 (licença das fontes e Fundação visual)

Você é o **Persona — Migração de Interface** no worktree `C:\Users\yansi\Projetos\persona-wt\lote2-interface` (branch `wt/interface-lote2`).

Ative `/ponytail full`. Leia `AGENTS.md`, `AGENTES/PROTOCOLO.md`, `AGENTES/01_interface/AGENTS.md`, `AGENTES/ATRIBUICOES/LOTE-2.md` (sua linha), `docs/redesign/interface/MAPA_TELAS.md`, `docs/design/approved/2026-11-03-t4/README.md` e os tokens do Design System em `docs/design/approved/2026-11-03-t4/fonte/design-system/`. Antes de editar informe status, HEAD e que `02ec5df` é ancestral. `npm ci` em `apps/web` é permitido (sem alterar o lockfile).

## Etapa 1 — licença das fontes (bloqueia a incorporação)

Verifique e registre em `docs/redesign/interface/LICENCAS_FONTES.md` a licença de **Plus Jakarta Sans** e **Inter**, a partir de fontes primárias (repositório oficial dos autores e/ou `google/fonts`, arquivo `OFL.txt` ou `LICENSE`): licença e versão, linha de copyright, nome reservado (Reserved Font Name), condições de redistribuição e uso em site/app, URL e commit/tag consultados, e o SHA-256 dos arquivos `.woff2` que pretende usar. Compare com a forma de uso prevista (arquivos próprios via `next/font/local`, sem CDN e sem dependência nova). Conclua com **`PROVADA`** ou **`NÃO PROVADA`** e a justificativa.

- **Não provada → pare antes de incorporar as fontes.** Siga com o restante da Fundação usando a pilha de fontes atual ou de sistema, e relate.
- **Provada →** incorpore os `.woff2` e o arquivo de licença em `apps/web/public/fonts/` e carregue com `next/font/local` em `app/layout.tsx` (substituindo o caminho frágil para `node_modules/next/.../geist-*.woff2`, se coerente com o design aprovado). As atribuições exigidas pela licença ficam no repositório.

## Etapa 2 — Fundação visual (sem iniciar telas)

Somente: tokens (variáveis CSS derivadas do Design System aprovado, em `app/globals.css`, sem reescrever as ~3.000 linhas existentes — acrescente e mapeie), tipografia, **AppShell** (`components/shell/**`, usando `app/app/layout.tsx`) e **navegação** (`app/app/app-navigation.tsx`) conforme `MAPA_TELAS.md`. Ícones continuam em `@carbon/icons-react`. Acessibilidade: landmarks, foco visível, `aria-current`, alvo de toque ≥ 44 px, `prefers-reduced-motion`, 375 px sem rolagem horizontal. **Não** tocar em nenhum `page.tsx` ou `actions.ts` de tela, `lib/**`, `supabase/**`, `package.json`, lockfile. Documente em `docs/redesign/interface/FUNDACAO_LOTE2.md`: o que mudou, tokens adotados × aprovados, regressões possíveis nas telas atuais e como verificar.

## Validação

`npm run lint`, `typecheck`, `build` (sem `.env`), `git diff --check`, diff só nos caminhos da sua linha, varredura de segredo. A verificação visual real exige login (Supabase/Microsoft), que você não tem: verifique as páginas públicas (`/entrar`, `/termos`, `/privacidade`) em 375 e 1280 px no navegador embutido, se disponível, e declare o resto como **PENDING**. Não use credencial. Atualize `AGENTES/01_interface/STATUS.md` (`Estado: WAITING_APPROVAL`). Commits locais com trailer de coautoria; sem push. Entregue handoff compacto e pare.
