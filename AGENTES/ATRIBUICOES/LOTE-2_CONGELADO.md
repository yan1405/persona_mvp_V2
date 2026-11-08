# Lote 2 — SHAs congelados para a Verificação

Congelado pelo Orquestrador em 08/11/2026. Base: `acc1f4443939cdaf1d57d13b67fe8f929adf1e97` (`main` local; contém `02ec5df`). `origin/main` `06de045` não foi tocada. Cada SHA é o topo do branch do escritor, igual ao HEAD do worktree, com worktree sem alteração, 1 commit sobre a base, caminhos dentro da linha do papel em `LOTE-2.md`, nenhum arquivo proibido, `git diff --check` limpo, trailer de coautoria e zero padrões de segredo nas linhas adicionadas. Nenhum push, merge, migração, SQL ou chave. Um SHA é imutável: nova correção gera novo SHA e novo registro.

| Entrega | Branch | SHA congelado | Arquivos | Linhas (vs. base) |
|---|---|---|---:|---|
| 02 Backend | `wt/backend-lote2` | `4b4650d34f3a748078dcb5b7c6c351eade7ad7eb` | 5 | +165 / −18 |
| 03 Agente NVIDIA / Live | `wt/agente-lote2` | `cba617abe33860d94e338dfb93ee14a67f60499e` | 7 | +305 / −94 |
| 01 Interface | `wt/interface-lote2` | `e6b3e5c0367a8b76acfadebe5072ccf70f55c089` | 12 | +787 / −141 (2 `.woff2`) |

Comando de diff para cada um, de qualquer checkout: `git diff acc1f44..<SHA>`.

## Pontos de atenção do Orquestrador para a Verificação

- **Backend:** a migração nunca foi aplicada nem testada em banco. Verificar por leitura: assinaturas contra a Fase 9, bloco `has_function_privilege` que falha a migração, ordem da timestamp, transação, idempotência, rollback e o novo passo do teste RLS (precisa reprovar, mantendo `begin` … `rollback`). O que só o banco real prova fica `HYPOTHESIS`.
- **Agente / Live:** `generate-live-response.ts` foi reduzido a casca e o núcleo foi extraído para `nvidia-chat.ts`; `actions.ts` mudou (extração mínima). Conferir que o **comportamento publicado não mudou** (modelo, tentativas, timeout, mapeamento de erros) e que o parser (`response-schema.ts`, `recommendation.ts`, `validation.ts`, `live.test.ts`) não foi tocado. Conferir que `package.json` mudou **somente** `scripts.test`. A comparação Groq × NVIDIA deve separar `VERIFIED`, `HYPOTHESIS` e `PENDING`; nenhuma chamada real foi ou pode ter sido feita.
- **Interface:** `globals.css` +433 linhas sobre um arquivo de ~3.000: procurar regressão nas telas atuais (seletores renomeados ou sobrescritos), contraste, foco e `prefers-reduced-motion`. A licença das fontes (`LICENCAS_FONTES.md`) deve ser conferida contra as fontes primárias e os SHA-256 dos dois `.woff2` contra os arquivos do commit; os `OFL-*.txt` devem ser os textos oficiais. A casca foi vista só em harness estático, sem sessão autenticada: o resto da verificação visual é `PENDING`.
- Não há sobreposição de arquivos entre os três; ainda assim, o Orquestrador integrará um de cada vez, e `app/layout.tsx` (Interface) e `lib/live/**` (Agente) não se tocam.

## Checkout isolado da Verificação

`C:\Users\yansi\Projetos\persona-wt\verificacao-lote2`, desanexado em `acc1f44`, limpo. Uso exclusivo da Verificação: `git checkout --detach <sha>` para cada SHA, `npm ci` em `apps/web` (sem alterar o lockfile), `npx next typegen`, testes do papel, `npm test`, `npm run lint`, `npm run typecheck`, `npm run build` sem `.env`. Sem rede de provedor, sem chave, sem SQL.

## Relatórios

Um relatório por SHA em `AGENTES/04_verificacao/`: `RELATORIO_backend_4b4650d.md`, `RELATORIO_agente-nvidia_cba617a.md`, `RELATORIO_interface_e6b3e5c.md`.


## Atualização 08/11/2026 19:13 — Interface: novo SHA após IF2-1 (substitui `e6b3e5c`)

Yan decidiu **corrigir o IF2-1**. Refresh completo de Git feito às 19:13 (`fetch`, `worktree list --porcelain`, HEADs estáveis; `main` `77ee86c`, `origin/main` `06de045`; Backend e Agente inalterados). O SHA abaixo é o topo de `wt/interface-lote2`, igual ao HEAD do worktree, limpo, filho direto de `e6b3e5c`, 2 commits sobre a base, caminhos dentro da linha da Interface, `git diff --check` limpo, coautoria presente, zero padrões de segredo.

| Entrega | Branch | SHA congelado | Substitui | Diff do commit novo |
|---|---|---|---|---|
| 01 Interface | `wt/interface-lote2` | `d71f2a7ac2e9b720385f0bf8d425d95811d0edab` | `e6b3e5c0367a8b76acfadebe5072ccf70f55c089` | 3 arquivos, +11 / −7: `apps/web/app/globals.css`, `docs/redesign/interface/FUNDACAO_LOTE2.md`, `AGENTES/01_interface/STATUS.md` |

Backend `4b4650d34f3a748078dcb5b7c6c351eade7ad7eb` e Agente `cba617abe33860d94e338dfb93ee14a67f60499e` **continuam vigentes**, sem mudança.

O relatório `RELATORIO_interface_e6b3e5c.md` vira histórico e **não aprova** `d71f2a7`. Relatório novo: `RELATORIO_interface_d71f2a7.md`.

**Correção (conferida pelo Orquestrador no diff):** `grid-template-columns: auto minmax(0, 1fr)` → `auto 1fr` (e `1fr` no layout móvel), e removido `min-width: 0` do painel, para que o painel cresça até o conteúdo e a janela volte a rolar na horizontal como antes da casca; `overflow: clip` fica só para arredondar. Mais `left: 8px; max-width: calc(100vw - 16px)` em um elemento do bloco móvel e o `STATUS.md` sem o autorrótulo `VERIFIED`.

**Pontos para a re-verificação:** (1) IF2-1 resolvido nas larguras 1024, 1100, 1152, 1200, 1230, 1280 e 375 px, com o CSS real do build; (2) sem regressão: a 375 px e a 1280 px não pode surgir rolagem horizontal nova nem corte; `position: sticky` das páginas preservado; (3) o efeito colateral esperado do `1fr` é a janela rolar na horizontal entre ≈ 1100 e ≈ 1230 px nas telas de Artefatos/Live: avaliar se é aceitável (igual ao comportamento antes da casca) ou novo defeito; (4) IF2-2 e IF2-3 seguem abertos, salvo se a correção os alterou.


## Atualização 08/11/2026 — Rodada 2: novos SHAs de Backend e Agente (substituem `4b4650d` e `cba617a`)

Decisão de Yan: "Sim, rodada curta". Refresh completo de Git feito (`fetch`, `worktree list --porcelain`, HEADs conferidos; `main` `7108259`, `origin/main` `06de045`; Interface inalterada em `d71f2a7`). Cada SHA é o topo do worktree respectivo, limpo, filho direto do SHA anterior, caminhos dentro da linha do papel (+ `docs/redesign/backend/**` autorizado), `git diff --check` limpo, coautoria presente, zero segredo real (a única ocorrência é a chave sintética `nvapi-chave-sintetica-de-teste` já existente nos testes).

| Entrega | Branch | SHA congelado | Substitui | Diff do commit novo |
|---|---|---|---|---|
| 02 Backend | `wt/backend-lote2` | `33373ae2f0d909da0dfad67584ed0ab8db654ec1` | `4b4650d34f3a748078dcb5b7c6c351eade7ad7eb` | 5 arquivos, +47 / −18: migração B-1 sem `begin`/`commit`, `ROLLBACK_B1.md` (método e falha parcial), `RELATORIO_TESTE_RLS.md`, `HANDOFF_LOTE1.md` (aviso de histórico), `AGENTES/02_backend/STATUS.md` |
| 03 Agente NVIDIA | `wt/agente-lote2` | `9abf92762285c50dc4c20c58624b8f4a794d0001` | `cba617abe33860d94e338dfb93ee14a67f60499e` | 3 arquivos, +53 / −16: `nvidia-chat.ts` (exporta `NVIDIA_TIMEOUT_MS = 15_000` e `NVIDIA_MAX_ATTEMPTS = 2`, mesmo comportamento), `nvidia-chat.test.ts`, `AGENTES/03_agente_nvidia/STATUS.md` |
| 01 Interface | `wt/interface-lote2` | `d71f2a7ac2e9b720385f0bf8d425d95811d0edab` | (vigente, sem mudança) | — |

Os relatórios `RELATORIO_backend_4b4650d.md` e `RELATORIO_agente-nvidia_cba617a.md` viram histórico e **não aprovam** os SHAs novos.

**Pontos para a re-verificação (só estes dois SHAs):** (1) Backend: migração sem `begin`/`commit` e ainda abortando via `DO` (ler); nenhum texto operacional contradiz a opção A (grep em `docs/redesign/backend`, `docs/qa/fase-9`, `AGENTES/02_backend`; o que sobrou em `HANDOFF_LOTE1.md` de `AGENTES/02_backend` e `docs/redesign/backend` é histórico com aviso); `ROLLBACK_B1.md` descreve CLI x SQL Editor corretamente; STATUS só do Lote 2. (2) Agente: repetir as mutações `sem_signal` e `timeout_30` em cópia fora do repo e provar que agora **falham**; provar que o comportamento publicado do adaptador não mudou (diff do `.ts`); `npm test`, lint, typecheck e build sem `.env`. Nada se corrige: só relatar.


## Atualização 08/11/2026 — Rodada 3: Interface, novo SHA após IF3-1 (substitui `d71f2a7`)

Yan decidiu **corrigir o IF3-1**. Refresh completo de Git feito (`fetch`, `worktree list --porcelain`, HEADs conferidos; `main` `2fa12d7`, `origin/main` `06de045`). O SHA abaixo é o topo de `wt/interface-lote2`, igual ao HEAD do worktree, limpo, filho direto de `d71f2a7`, 3 arquivos, caminhos dentro da linha da Interface, `git diff --check` limpo, coautoria presente, zero padrões de segredo.

| Entrega | Branch | SHA congelado | Substitui | Diff do commit novo |
|---|---|---|---|---|
| 01 Interface | `wt/interface-lote2` | `14ad9699faa1041ce9e66f9da4693227ed8234e8` | `d71f2a7ac2e9b720385f0bf8d425d95811d0edab` | 3 arquivos, +13 / −3: `apps/web/app/globals.css` (+8: `.diary-filters` e `.artifact-filters` com 3 colunas `minmax(0, 1fr)` abaixo de 1280 px), `docs/redesign/interface/FUNDACAO_LOTE2.md`, `AGENTES/01_interface/STATUS.md` |

**Nota de integração:** `main` já contém `d71f2a7` (integrado em `7da0be0`). O SHA novo é um commit só da Interface sobre `d71f2a7`; entra por merge simples quando Yan autorizar. Nada foi integrado nesta rodada.

Backend `33373ae` e Agente `9abf927` seguem vigentes. O relatório `RELATORIO_interface_d71f2a7.md` vira histórico e **não aprova** `14ad969`.

**Pontos para a re-verificação (só este SHA):** (1) nenhuma rolagem horizontal da janela de 1024 a 1280 px (1024, 1100, 1152, 1200, 1230, 1279, 1280) nas telas de Artefatos, Diário, Live, Score, Diagnóstico, com o CSS real do build; (2) sem regressão a 375 px e a ~640–768 px (a nova regra `max-width: 1279px` não pode sobrepor regras móveis posteriores de `.artifact-filters`/`.diary-filters`); (3) conteúdo acessível, sem corte (IF2-1 segue corrigido); (4) barra lateral e `position: sticky` preservados; (5) `npm test`, lint, typecheck e build sem `.env`; (6) escopo, `diff --check`, segredos, coautoria; (7) IF2-2, IF2-3 e IF3-2 seguem abertos e fora desta rodada. Nada se corrige: só relatar.
