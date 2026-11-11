# Lote 2 — SHAs congelados para a Verificação

## Rodada 5 — IF5-1, AG4-1 e saneamento Backend (08/11/2026)

Snapshot do Orquestrador após a pausa dos escritores: worktrees limpos, HEAD igual ao SHA abaixo, um commit por papel sobre o SHA vigente da rodada anterior, caminhos dentro da atribuição da Rodada 5, `git diff --check` limpo, trailer de coautoria e varredura de segredos sem ocorrência. Nenhum merge, push, banco, SQL, chave, Preview ou Production.

| Entrega | SHA congelado | Substitui | Escopo |
|---|---|---|---|
| 01 Interface | `a5a18aae940134385f9cd0e5c04586e957874e0f` | `d3dfa633630f672f7301fadfecdd78d8f186fc5c` | IF5-1 e IF2-2; 3 arquivos, somente CSS/status/documentação |
| 02 Backend | `1349a0acda404a0f64b94678369ab100873d0fe3` | `33373ae2f0d909da0dfad67584ed0ab8db654ec1` | BK3-1/BK3-2 documentais; SQL executável com SHA-256 normalizado idêntico antes/depois |
| 03 Agente NVIDIA | `ae00dd49d741a0bc4149abfad86b19118450f494` | `72b0e60d51c6c7142207f62cf2085356e4aa7a52` | AG4-1; somente `generate-version.test.ts` |

Relatórios específicos: `RELATORIO_interface_a5a18aa.md`, `RELATORIO_backend_1349a0a.md` e `RELATORIO_agente-nvidia_ae00dd4.md`. Relatórios anteriores são histórico e não aprovam estes SHAs.

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


## Atualização 08/11/2026 — Rodada 4: Interface (IF4-1) e Agente (AG2-2), novos SHAs

Decisões de Yan: "Corrigir agora" (IF4-1) e tratar o AG2-2. Refresh completo de Git feito (`fetch`, `worktree list --porcelain`, HEADs conferidos; `main` `2f8f0d3`, `origin/main` `06de045`). Cada SHA é o topo do worktree respectivo, limpo, filho direto do anterior, caminhos dentro da linha do papel, `git diff --check` limpo, coautoria presente, zero padrões de segredo. **Nada foi integrado:** a `main` contém `d71f2a7` (Interface) e `9abf927` (Agente); os SHAs abaixo entram por merge simples só com autorização de Yan. Os dois commits tocam arquivos disjuntos.

| Entrega | Branch | SHA congelado | Substitui | Diff do commit novo |
|---|---|---|---|---|
| 01 Interface | `wt/interface-lote2` | `d3dfa633630f672f7301fadfecdd78d8f186fc5c` | `14ad9699faa1041ce9e66f9da4693227ed8234e8` (que substituiu `d71f2a7`) | 3 arquivos, +4 / −6: `apps/web/app/globals.css` (remove o override `.diary-filters` de `max-width:1023px`; `.artifact-list li > a` com `minmax(0, 1fr)` na coluna de título), `FUNDACAO_LOTE2.md`, `AGENTES/01_interface/STATUS.md` |
| 03 Agente NVIDIA | `wt/agente-lote2` | `72b0e60d51c6c7142207f62cf2085356e4aa7a52` | `9abf92762285c50dc4c20c58624b8f4a794d0001` | 5 arquivos, +195 / −40: novo `apps/web/lib/live/generate-version.ts` (corpo de `generateVersion` movido sem alteração, com `supabase`/`generate` injetados) e `generate-version.test.ts` (11 testes), `actions.ts` (só a casca fina), `apps/web/package.json` (só `scripts.test`), `AGENTES/03_agente_nvidia/STATUS.md` |

Backend `33373ae` segue vigente e inalterado. Os relatórios `RELATORIO_interface_14ad969.md` e `RELATORIO_agente-nvidia_9abf927.md` viram histórico e **não aprovam** os SHAs novos.

**Pontos para a re-verificação:**
- Interface `d3dfa63`: (1) nenhuma rolagem horizontal da janela de 375 a 1280 px em Artefatos e Diário (medir pelo menos 375, 414, 560, 600, 639, 640, 660, 672, 700, 760, 768, 780, 799, 800, 900, 1000, 1023, 1024, 1100, 1230, 1279, 1280 px), antes (`14ad969`) × depois, com o CSS real do build; (2) sem regressão em Live, Score e Diagnóstico e no IF3-1 (1024–1280 px); (3) sem corte (IF2-1), reticências, `sticky` e barra lateral preservados; a remoção do override `.diary-filters` em `max-width:1023px` muda o layout do Diário entre 640 e 1023 px (colunas de `minmax(220px,1fr) 140px 140px` para `repeat(3, minmax(0,1fr))`): avaliar se piora algo; (4) `npm test`, lint, typecheck e build sem `.env`; (5) IF2-2, IF2-3, IF3-2 inalterados ou não.
- Agente `72b0e60`: (1) a extração é comportamentalmente idêntica (diff linha a linha do corpo de `generateVersion` entre `actions.ts` de `9abf927` e `generate-version.ts`; mensagens, ordem das chamadas, nomes de RPC e parâmetros); (2) os 11 testes cobrem os casos pedidos (sessão inativa, sem evidências, `alternative` sem outra, sucesso com `answered`/`gap` e `p_evidence_ids` sem duplicatas, falha do adaptador com e sem `markQuestionFailed`, falha do `rpc` como `invalid_output`); (3) repetir 3 mutações em cópia fora do repo (ex.: não chamar `fail_live_question`, trocar `answered`/`gap`, gerar com sessão inativa) e provar que falham; (4) `generate-version.ts` importa `nvidia-chat.ts` direto, sem passar pela casca `generate-live-response.ts`: confirmar que só `actions.ts` (servidor) o importa e que nada de cliente o alcança (relação com AG2-3); (5) `npm test` (75), lint, typecheck e build sem `.env`; (6) escopo, `diff --check`, segredos, coautoria; (7) AG2-3 e AG3-1 abertos? A correção os altera?

Nada se corrige: só relatar.


## Lote 3 — SHAs congelados (08/11/2026)

Refresh completo de Git feito (`fetch`; worktrees limpos; HEADs iguais aos SHAs; `main` `1d94887`+registros, `origin/main` `06de045`). Cada commit: filho do anterior, caminhos dentro de `LOTE-3.md`, `git diff --check` limpo, coautoria presente, zero segredo. Nada integrado.

| Papel | Branch | Ordem | SHA | Conteúdo |
|---|---|---|---|---|
| 01 Interface | `wt/interface-lote2` | 1 | `a15ed1b650371e9f798c02dd9d81815237f3fec1` | IF2-3 (`<main>` em Configurações, `layout.tsx`); IF3-2 declarado não reproduz |
| 01 Interface | | 2 | `4f2190768b5001117e965c9fce3f1b3b60338059` | tela Início (`inicio/page.tsx`, +306 linhas de CSS) |
| 01 Interface | | 3 | `e0be7e6be2fc39889a0b6598d1d500f1fa1a4561` (topo) | tela Diário (`diario/page.tsx`, `diary-forms.tsx`, CSS) |
| 03 Agente | `wt/agente-lote2` | 1 | `b7b21a49057e143ccf259dde678cd3949b0f8b3c` | AG2-3 (regra no ESLint), AG3-1 (`--test-timeout`), AG4-2 |
| 03 Agente | | 2 | `952ec70b65b2793e07f06c22909073e42e08bb71` | parser do Live A-1/A-7/L-1 (`response-schema.ts` +31/−, 73 linhas de teste, contrato) |
| 03 Agente | | 3 | `4d9aa79f6608730a34100d7d1302d152524b6ec8` (topo) | ADR_NVIDIA_UNICO.md (só documento) |

Pontos para a Verificação — Interface: apresentação só (nenhuma mudança de lógica, RPC, textos ou mensagens em Início/Diário/Configurações: comparar com a base `a5a18aa`); zero rolagem horizontal 375–1280 px; sem regressão em telas não tocadas (globals.css cresceu +409 linhas: checar vazamento de seletores novos); acessibilidade; IF3-2 realmente não reproduz; gates. Agente: AG2-3 por mutação (import cliente falha o lint); parser: testes falham antes e passam depois (rodar os testes novos contra o parser antigo), o que muda para o usuário, regressões nas respostas válidas; ADR: inventário completo contra `git grep` de Groq/LLM, sem código; gates. Nada se corrige: só relatar.


## Lote 4 — SHAs congelados (09/11/2026)

Refresh completo de Git feito (`fetch`; worktrees limpos; HEADs iguais aos topos; `main` `eaae4a1`, `origin/main` `06de045`). Cada commit: filho do anterior, caminhos dentro de `LOTE-4.md`, `git diff --check` limpo, coautoria presente, zero segredo real (a única ocorrência é a chave sintética `nvapi-chave-sintetica-de-teste` dos testes). Nada integrado.

| Papel | Branch | Ordem | SHA | Conteúdo |
|---|---|---|---|---|
| 01 Interface | `wt/interface-lote2` (base `e0be7e6`) | 1 | `45a399649c4f30e9ac7b02a445ea87eeda1a7dad` | S4: IF6-2 (`useId`), IF6-5 (−~100 linhas de CSS morto); IF6-1/IF6-3 no STATUS |
| 01 Interface | | 2 | `ed879071abae773a387e806725c5fad68f0df6e7` | tela Evidências (`evidencias/page.tsx`, +108 CSS) |
| 01 Interface | | 3 | `3f376937012717a8449730675e0a7ae3372c5cdb` (topo) | tela Live (`live/[id]/page.tsx`, `live-forms.tsx`, `live/page.tsx`, +270 CSS) |
| 03 Agente | `wt/agente-lote2` (base `4d9aa79`) | 1 | `9adce279725c476bca197002e849e919978f9534` | AG5-1 (ESLint: `import()`, `require`, sufixos, barril) |
| 03 Agente | | 2 | `13af232e700111564815aedb6d76da2c570816f8` | M1: `nvidia-client.ts` compartilhado + teste; `nvidia-chat.ts` reduzido |
| 03 Agente | | 3 | `4dbb6e468afe3513253145eaa0996fb5701b28cb` (topo) | M2: Score (`coherence.ts`) de Groq para NVIDIA + `coherence.test.ts`; ADR atualizado |

Pontos para a Verificação — Interface: apresentação só (comparar lógica, textos e RPC de Live e Evidências com `e0be7e6`; `live-forms.tsx` mudou 28 linhas); remoção de CSS morto realmente sem uso (cada classe contra `git grep` em todo `apps/web`, inclusive `.tsx` dinâmicos/template strings); `useId` não quebra SSR/hidratação nem o `aria-describedby`; 0 rolagem 375–1280 px; sem vazamento de CSS (`globals.css` +378 −103). Agente: M1 sem mudança de comportamento do Live (diff de `nvidia-chat.ts`, testes antigos intactos); barreira do ESLint por mutação (`import()`, `require`, `.js`, barril); M2: rubrica `coherence-v1` e discretização inalteradas, testes falham em mutações (ex.: aceitar ID fora da entrada, não discretizar, trocar erro por 0), nenhum uso restante de Groq no Score, `lib/groq/**` intocado; efeito do Score ficar `not_configured` sem chave (o que o usuário vê); gates. Nada se corrige: só relatar. Esta é a última rodada da conversa atual da Verificação: deixar "Para a 2ª conversa" no `AGENTES/04_verificacao/STATUS.md`.


## Lote 5 — SHAs congelados (09/11/2026)

Refresh completo de Git feito (`fetch`; worktrees limpos; HEADs iguais aos topos; `main` `9f4c845`, `origin/main` `06de045`). Cada commit: filho do anterior, `git diff --check` limpo, coautoria presente, zero segredo. Nada integrado.

| Papel | Branch | Ordem | SHA | Conteúdo |
|---|---|---|---|---|
| 01 Interface | `wt/interface-lote2` (base `3f37693`) | 1 | `3da5f586db03e8f220e64813031bb9923b84abc5` | IF7-1 (`overflow-wrap` no eyebrow do Live) e texto de IF6-3 |
| 01 Interface | | 2 | `1eef0a4dd87d664fb426596f051a13b85a7a1b66` | tela Score (`score/page.tsx`, +68 CSS) |
| 01 Interface | | 3 | `ce12bee4b1bcaefc6080b584448713136b9e7dbd` (topo) | tela Artefatos (`artefatos/page.tsx`, `artefatos/[id]/page.tsx`, +130 CSS) |
| 03 Agente | `wt/agente-lote2` (base `4dbb6e4`) | 1 | `31c1800ab8c432644d527f28850d6c2f2e0871a5` | AG6-2: `analyze-coherence.ts` com `server-only`; **também alterou `app/app/score/actions.ts` (1 linha de import), fora da lista literal de caminhos** |
| 03 Agente | | 2 | `ca6bf9fdf7b172a66316d1ddd6972183a3f54b1d` | AG6-3: cerca Markdown tolerada em `coherence-schema.ts` + testes |
| 03 Agente | | 3 | `02bebe9727d9d7c7ee013a39445180764beba31c` | M3: Diário (`structure-evidence.ts`) de Groq para NVIDIA + 144 linhas de teste |
| 03 Agente | | 4 | `b409e7c512671e92021d7ebdf88257d1365ec4b5` (topo) | só `STATUS.md` (bloco da 2ª conversa) |

Pontos para a Verificação — Interface: apresentação só (comparar lógica, textos e RPC de Score e Artefatos com `3f37693`); IF7-1 realmente corrige a palavra de 70 caracteres (a 375 e 768 px) e nas novas telas; 0 rolagem 375–1280 px; sem corte com palavras longas; sem vazamento de CSS; acessibilidade. Agente: AG6-2 (importar a análise do Score de componente cliente falha o build/lint; `node --test` segue passando; a mudança em `score/actions.ts` é só o import); AG6-3 (cerca tolerada, mas conteúdo continua estrito: mutações); M3: esquema/validação inalterados (`useful=false`, campos sem sustentação como `null`), nenhum Groq restante no Diário, `lib/groq/**` restante intacto, mutações em cópia, o que o usuário vê sem chave, quem chama `structure-evidence.ts`; gates. Nada se corrige: só relatar. Manter o bloco "Para a 2ª conversa" do STATUS atualizado.


## Lote 6 — SHAs congelados (09/11/2026)

Refresh completo de Git feito (`fetch`; worktrees limpos; HEADs iguais aos topos; `main` `8339c81`, `origin/main` `06de045`). Cada commit: filho do anterior, `git diff --check` limpo, coautoria presente, zero segredo. Nada integrado.

| Papel | Branch | Ordem | SHA | Conteúdo |
|---|---|---|---|---|
| 01 Interface | `wt/interface-lote2` (base `ce12bee`) | 1 | `f80de4a4485d2d6ba1d41d510258ee6dd6bbfb19` | AG7-1: 5 textos "Groq" → termos neutros (`diario/[id]/page.tsx`) |
| 01 Interface | | 2 | `44b191380985f5530e1206ced973336d3bf3b345` | IF7-2 (alvo 24 px) e IF8-2 (impressão), `globals.css` 1 linha |
| 01 Interface | | 3 | `ff3df5706cb3d084497e3d71453a5e56aa052f6a` | tela Diagnóstico (+62 CSS) |
| 01 Interface | | 4 | `7e33f8f37bd581ba496ce80305b4f35e6499c114` (topo) | tela Configurações, todas as rotas (+77 CSS, STATUS, FUNDACAO) |
| 03 Agente | `wt/agente-lote2` (base `b409e7c`) | 1 | `ef46c80d3d35f70a6ff2bc1fb992e1cdbaac8285` | AG7-2: `structure-evidence-server.ts` com `server-only`, `diario/actions.ts` 1 linha |
| 03 Agente | | 2 | `d6af7283cdbc413edd45f3d41d46fe5016046cc4` | AG7-3: cascas na barreira do ESLint |
| 03 Agente | | 3 | `6389599a1595d04cb7f2ddbcd38bd1b572fe195c` | AG7-4: testes do corte de 2.000 caracteres e frases-chave |
| 03 Agente | | 4 | `b5ba5149216ceff1f29359356be43958448a8798` (topo) | só `STATUS.md` |

Pontos para a Verificação — Interface: AG7-1: `git grep -i groq` em `apps/web/app` antes/depois (nenhum "Groq" visível restante; significado preservado; só textos, nenhuma lógica); IF7-2/IF8-2 medidos; telas Diagnóstico e Configurações só apresentação (comparar lógica/textos/RPC com `ce12bee`; `configuracoes/layout.tsx` 1 linha); 0 rolagem 375–1280 px; palavras longas; sem vazamento de CSS; acessibilidade. Agente: AG7-2 (importar a casca do Diário de componente cliente quebra o `next build`; `node --test` passa; só 1 linha em `diario/actions.ts`); AG7-3 (ESLint cobre as cascas; mutações); AG7-4 (as 4 mutações antes sobreviventes agora falham); nada de comportamento mudou; gates. Nada se corrige: só relatar. Atualizar o bloco "Para a 2ª conversa".

## Lote 7 — SHAs congelados (09/11/2026)

Base: `main` local `2bca379` (atribuição `LOTE-7.md`). Refresh de Git feito (fetch, worktrees, status limpo da Interface). `origin/main` `06de045`.

| Papel | SHA completo | Item |
|---|---|---|
| Interface | `d786814494b967b8c59d14aeff9d725ed6e5ea90` | QL-1 gate puro |
| Interface | `092a5c3d7c17ec6f1bd389afa9e933c098d65888` | QL-2 rota `POST /auth/qa-entrar` |
| Interface | `707e93f6d5ae90c29de63711624845ddca49f918` | QL-3 formulário em `/entrar` |
| Interface | `2e044a062082f58c2dc7168145e12f018ba22583` | QL-4 `.env.example` e STATUS (topo) |

Nota do Orquestrador: `lib/auth/qa-login-gate.test.ts` não está no script `npm test` (o `package.json` ficou fora da escrita da Interface); a Verificação deve rodá-lo diretamente. A inclusão no script é ajuste do Orquestrador na integração.

## Lote 8 — SHAs congelados (10/11/2026)

Base: `main` local `36da9be`. Refresh de Git feito (fetch, worktrees limpos, `merge-tree` entre os dois ramos sem conflito). `origin/main` `06de045`.

| Papel | SHA completo | Item |
|---|---|---|
| Interface | `1d5bcf596dcce7f8bb742a56cd8f8f68c2a626fb` | DS-1 primitivos |
| Interface | `10e49e4e1016124c524befeb2842cb642a677b09` | DS-2 superfícies e jornada |
| Interface | `6875d5eaaeb185131fef34a0171da4f29fb0ac24` | DS-3 navegação e casca |
| Interface | `03b533e947d89e05ef8100fbb8cbfe3d952c0843` | DS-4 painel, índice, fluxo e cartões |
| Interface | `1c5947298a91483ad11dd4270bf8492168b75af5` | DS-5 galeria `/dev/ds` |
| Interface | `ee64fe6da8b154a743a290a41c45db4e3e1a123e` | DS-6 aderência e STATUS (topo) |
| Backend | `173a265e088444054159e44ede5535e696614357` | BK4-1 redirect aberto (topo) |

## Lote 9 — SHAs congelados (11/11/2026)

Base: `main` local `71e35b0`. Refresh de Git feito (fetch, worktree da Interface limpo, diff só em caminhos autorizados). `origin/main` `06de045`.

| Papel | SHA completo | Item |
|---|---|---|
| Interface | `f4e4236c980693f48134f9015eda9532af502e37` | C-1 correções do núcleo do DS |
| Interface | `74147b9d626b3fa2dfafef0d734868b5d19428a7` | C-2 casca em `/app` |
| Interface | `decb5fca85e6d62e12a1ff567569aaca0a80bf9d` | C-3 `/entrar` e login de QA |
| Interface | `d50d2a7af479e65f7ed72f9d92264c82017724c0` | C-4 `/onboarding` |
| Interface | `c83ea53e0c0a99dad38329fc1a05844803e6cab1` | C-5 `/auth/erro` |
| Interface | `122e8609f74e2829fe7c58435abdd5c8077330d4` | C-6 `/termos`, `/privacidade` e STATUS (topo) |

## Lote 9, rodada 2 — SHAs congelados (11/11/2026)

Base: `main` local `0a9b533`. Refresh de Git feito (fetch, worktree da Interface limpo, diff da rodada só em `components/ds`, `ds.css`, `eslint.config.mjs` e `app/dev/ds/legado`). A série C-1..C-6 (já verificada) permanece nos mesmos SHAs; o merge `24b7a2c` só trouxe docs da `main`. `origin/main` `06de045`.

| Papel | SHA completo | Item |
|---|---|---|
| Interface | `344cafb708f2c91e148ba0284cf7d420de140598` | C9-1 telas legadas legíveis no painel do AppShell (S2) |
| Interface | `c957171e62c924af49f3d43e0b6802c524dabd28` | C9-2 gaveta do celular fecha (S3) |
| Interface | `4282aa24a3cf6f369d46aad5635709c9b9c9a879` | C9-3 anel de foco do logo |
| Interface | `18a01f91ddc5ffc5ab05d84f2ca945827377dfa4` | C9-8 gate de aderência |
| Interface | `f2c7533b4734e30d1b516868212a6dd8e1a7498c` | STATUS (topo) |

## Lote 9, rodada 3 — SHA congelado (11/11/2026)

Base: `main` local `cb6947e`. Refresh de Git feito (fetch, worktree da Interface limpo; diff de código só `apps/web/app/ds.css`, +14 linhas). Merge `b127288` só trouxe docs. `origin/main` `06de045`.

| Papel | SHA completo | Item |
|---|---|---|
| Interface | `9e16e18fd53a210f5440ceea2438154037531db8` | C9-11 botão primário legado a 5,70:1; C9-12 erro/sucesso/aviso/perigo legíveis (topo) |

## Lote 10, rodada A — SHAs congelados (11/11/2026)

Base: `main` local `c88f304`. Refresh de Git feito (fetch, worktree da Interface limpo; diff de código só em `components/ds`, `app/ds.css`, `app/dev/ds`, `app/app/inicio` e `app/app/diario`, 9 arquivos). `origin/main` `06de045`; branch de Preview `preview/reconstrucao-ds` em `c88f304` (sem o código desta rodada).

| Papel | SHA completo | Item |
|---|---|---|
| Interface | `e65813b9ada150b426708b8ea15c1e371569210e` | I-1 Início como T4.1 |
| Interface | `5ac6dcfc2cb349745d71d354dd6eeef6dd1d8c08` | I-2 lista do Diário em grade de `EntryCard` |
| Interface | `bdec7b34e57938b580b0cfd8b191446da6e133a7` | I-3 painel flutuante do Diário (rota direta `/app/diario/[id]` → `/app/diario?abrir=<id>`); fecha C9-12 |
| Interface | `d0d32257410e5ee76b94ebea728b4287ad85f421` | STATUS (topo) |
