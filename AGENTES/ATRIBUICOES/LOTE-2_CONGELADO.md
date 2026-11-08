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
