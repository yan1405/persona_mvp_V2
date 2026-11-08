# Relatório de Verificação — Interface — Lote 2 (re-verificação)

- SHA revisado: `d71f2a7ac2e9b720385f0bf8d425d95811d0edab` (`wt/interface-lote2`; filho direto de `e6b3e5c`; 2 commits sobre `acc1f4443939cdaf1d57d13b67fe8f929adf1e97`).
- Verificador: Persona — Verificação Independente (não corrigi nada; **não aprovo visual**, o aceite é de Yan).
- Data: 08/11/2026. Diffs: `git diff acc1f44..d71f2a7` e `git diff e6b3e5c..d71f2a7`.
- `RELATORIO_interface_e6b3e5c.md` vira histórico e **não aprova** este SHA.

## 1. Resumo e gate sugerido

**Gate sugerido: liberar com ressalvas.** O S2 anterior (IF2-1, conteúdo cortado sem rolagem) está **corrigido**: com o CSS real do build, nenhuma largura de 1024 a 1280 px nem 375 px cortou conteúdo, os `text-overflow: ellipsis` continuam truncando, `position: sticky` continua funcionando e não surgiu rolagem horizontal nova a 1280 e 375 px. Mas a janela **passa a rolar na horizontal de 1024 a ≈ 1233 px** nas telas de Artefatos, o que **não** equivale ao comportamento da base (`acc1f44` não rola nessas larguras na mesma amostra): novo achado IF3-1 (S3). IF2-2 e IF2-3 seguem abertos, sem mudança. Nenhum S1/S2 aberto. Tela real (sessão autenticada) e aceite visual: PENDING.

## 2. Checagens C1–C6

| # | Checagem | Resultado | Evidência |
|---|---|---|---|
| C1 | Escopo (linha 01) | **OK** | 12 arquivos na base (mesmos de `e6b3e5c`); o commit novo toca só `apps/web/app/globals.css`, `docs/redesign/interface/FUNDACAO_LOTE2.md` e `AGENTES/01_interface/STATUS.md` (+11/−7) |
| C2 | Arquivos proibidos | **OK** | nenhum `lib/**`, `package*.json`, lockfile (idêntico), telas, `.env`; `components/` e `configuracoes/` sem mudança desde `e6b3e5c` |
| C3 | `git diff --check` | **OK** | exit 0 (contra a base e contra `e6b3e5c`) |
| C4 | Segredos nas linhas adicionadas | **OK** | sem ocorrências |
| C5 | Commit e coautoria | **OK** | pai = `e6b3e5c`; autor Yan; trailer `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>` |
| C6 | `STATUS.md` do papel | **OK com ressalva** | `Estado: WAITING_APPROVAL`; o autorrótulo `VERIFIED (código)` saiu (IF2-4 corrigido: agora `PENDING`, "VERIFIED só após a Verificação"); IF2-2/IF2-3 declarados abertos. Ressalva: o texto diz que a janela rola "como antes da casca" (ver IF3-1) |

## 3. O que a correção mudou (leitura do diff `e6b3e5c..d71f2a7`)

| Mudança | Efeito |
|---|---|
| `.app-shell { grid-template-columns: auto 1fr }` (era `auto minmax(0, 1fr)`) e `1fr` no layout < 640 px | a coluna do painel tem mínimo automático: cresce até o conteúdo mais largo |
| `.app-content` sem `min-width: 0` | idem; `overflow: clip` fica só para arredondar |
| `.app-sidebar` (< 640 px): `left: 8px; max-width: calc(100vw − 16px)` | ver seção 5 |
| `STATUS.md`, `FUNDACAO_LOTE2.md` | texto da correção; IF2-4 |

## 4. IF2-1 — reprodução com o CSS real do build, comparada com a base

Método: `next build` em `acc1f44` (base) e em `d71f2a7`; o CSS gerado de cada um (`.next/static/chunks/*.css`) foi carregado em duas páginas estáticas servidas em `127.0.0.1` (encerradas), com a marcação **real** (classes copiadas de `artefatos/page.tsx`, `live/page.tsx`, `live/live-forms.tsx`, `diario`) — filtros de Artefatos (5 campos reais, `date` inclusive), `.artifact-list` (objetivo longo, `small` com reticências), `.live-session-list`, `.live-evidence-options`, `.diary-list` (parágrafo longo com reticências) e um `<aside class="artifact-editor-aside">` sticky — mais a casca de cada SHA (base: cabeçalho de 48 px + trilho de 56 px; novo: barra lateral). Transições desligadas na medição. Os dados são sintéticos; **a tela real autenticada não foi testada (PENDING)**.

| Janela | Base `acc1f44`: painel / rolagem horizontal da janela | Novo `d71f2a7`: painel / rolagem / conteúdo cortado |
|---:|---|---|
| 1024 | 953 px / **não rola** | 946 px (trilho 76) / **rola** (documento 1054 px) / 0 px cortados |
| 1100 | 1029 / não rola | 946 (barra 256) / **rola** (1234 px) / 0 |
| 1152 | 1081 / não rola | 946 / **rola** (1234) / 0 |
| 1200 | 1129 / não rola | 946 / **rola** (1234) / 0 |
| 1230 | 1159 / não rola | 946 / **rola** (1234, 4 px a mais que a janela) / 0 |
| 1280 | 1209 / não rola | 961 / **não rola** / 0 |
| 375 | rola 34 px (a `aside` fixa de 280 px da minha amostra estoura o painel de 327 px) | 368 px / **não rola** / 0 |

Leitura:

1. **IF2-1 corrigido.** Em todas as larguras o último descendente (`filter-clear`, `SPAN`…) fica dentro do documento rolável (`maxDescR ≤ docScrollW`) e `clippedByPanel = 0`: nenhum controle inalcançável. A grade de filtros de Artefatos (a mais larga, ≈ 928 px) e as outras três (`.artifact-list`, `.live-session-list`, `.live-evidence-options`) ficam inteiras.
2. **Reticências preservadas.** `.artifact-list small` e `.diary-list p` truncam (3/3 elementos) em todas as larguras, nos dois SHAs: o painel crescer até o conteúdo **não** desfez o `text-overflow` (essas grades usam `minmax(0, 1fr)`/`minmax(240px, 1fr)`, que contribuem pouco ao tamanho mínimo). Isto responde à sua preocupação com `auto 1fr`.
3. **Sticky preservado.** Rolando a 1800 px: `aside` sticky com `top: 76 px` em 76 px nos dois SHAs (1280 px); barra lateral sticky em `top: 16 px` (novo) e barra superior em `top: 8 px` a 375 px. Nota de método: a primeira medição do sticky tinha a `aside` esticada pela grade (`align-items` padrão); refiz com `align-items: start`, como no CSS real.
4. **Sem rolagem nova a 1280 px e 375 px.** 1280: nenhuma nos dois. 375: nenhuma no novo (a da base vem da minha `aside` de 280 px; é artefato da amostra, não regressão do novo).
5. **Entre 1024 e ≈ 1233 px a janela rola na horizontal, e isso NÃO é igual à base.** Na mesma amostra a base cabe em qualquer largura ≥ ≈ 1002 px (precisa de 946 px + 56 px do trilho), enquanto a barra de 256 px (ou o trilho de 76 px + margens, a 1024 px) tira ≈ 250 px do painel. É o efeito colateral esperado do `1fr`, mas é **consequência da casca nova**, não "como antes". O escritor estimou ≈ 1226 px; medi **≈ 1233 px**. A 1024 px (largura da definição de pronto, `AGENTS.md` §12) a rolagem é de 30 px.

## 5. Trecho novo `left: 8px; max-width: calc(100vw − 16px)`

É o `.app-sidebar` dentro de `@media (max-width: 639px)`. O elemento é `position: sticky` (regra-base, linha 1027). Com a coluna `1fr` agora capaz de crescer além da janela, `width: 100%` passaria a ser a largura do **painel**, não da janela; o `max-width` prende a barra superior à janela e `left: 8px` faz o sticky também segurar a barra à esquerda se a página rolar na horizontal. Faz sentido. Medido a 375 px: barra de 8 a 367 px, janela de 376 px, sem estouro. A lacuna: a mesma proteção não existe de 640 px para cima, onde `.app-sidebar` não tem `left` (IF3-2).

## 6. Achados

| ID | Sev. | Status | Achado |
|---|---|---|---|
| IF2-1 | (era S2) | **corrigido** (CSS real; tela real PENDING) | seção 4, itens 1–4. Nenhuma severidade reduzida: o defeito deixou de existir na amostra |
| **IF3-1** | S3 | VERIFIED (CSS real, amostra sintética) / HYPOTHESIS (tela real) | **A casca nova faz a janela rolar na horizontal de 1024 a ≈ 1233 px nas telas largas (Artefatos), o que a base não faz.** `STATUS.md` e `FUNDACAO_LOTE2.md` dizem "como antes da casca" — impreciso. Conteúdo alcançável, mas 1024 px é largura de aceite. **Opções (não implementadas):** manter o trilho de 76 px até ≈ 1280 px; reduzir a margem/lacuna da casca; ou permitir que `.artifact-filters` quebre linha abaixo de ≈ 1280 px (dono: Interface, na fatia de Artefatos). **Reprodução:** páginas do harness em 1024 e 1100 px; `document.documentElement.scrollWidth > innerWidth` no novo e não na base. |
| IF3-2 | S4 | VERIFIED | De 640 px para cima a barra lateral é sticky só na vertical: com a janela rolada à direita (≥ 1100 px, `scrollX 149`) ela fica fora da tela (`left −133`). O ajuste `left` existe só abaixo de 640 px. Cosmético; o conteúdo continua alcançável. |
| IF2-2 | S3 | VERIFIED (re-medido) | **Sem mudança.** 800 × 400 px: `scrollHeight` 411 × `clientHeight` 368 px; último item 43 px abaixo do cartão; `overflow-y: visible`. Correção sugerida igual: `overflow-y: auto` em `.app-sidebar-nav`. |
| IF2-3 | S3 | VERIFIED (re-medido) | **Sem mudança.** `git grep "<main" d71f2a7 -- apps/web/app/app/configuracoes` vazio; 12 páginas têm `<main>`, as de Configurações não; o texto de `FUNDACAO_LOTE2.md` ("cada página já tem o seu") continua inexato para essas rotas. |
| IF2-4 | (era S3) | **corrigido** | autorrótulo `VERIFIED` removido do `STATUS.md`. |
| IF2-5 | S4 | observação | sem mudança. |

Nenhuma severidade reduzida sem evidência; IF2-1 e IF2-4 fecham por evidência de medição e de leitura do diff.

## 7. Execução independente

Checkout isolado `C:\Users\yansi\Projetos\persona-wt\verificacao-lote2`, desanexado em `d71f2a7ac2e9b720385f0bf8d425d95811d0edab`, `git status` limpo; depois devolvido a `acc1f44`. Sem `.env`, sem chave, sem rede de provedor. `npm ci` não foi repetido (lockfile idêntico, `git diff --quiet` verdadeiro; os `node_modules` do `npm ci` anterior valem).

| Comando (em `apps\web`) | Exit | Resultado |
|---|---:|---|
| `npx next typegen` | 0 | tipos gerados |
| testes do papel | n/a | o papel não tem teste unitário |
| `npm test` | 0 | tests 32 · pass 32 · fail 0 · cancelled 0 · skipped 0 |
| `npm run lint` | 0 | sem diagnósticos |
| `npm run typecheck` | 0 | sem erros |
| `npm run build` (sem `.env`) | 0 | "Compiled successfully in 2.6s" |

Também executei o build da base `acc1f44` (exit 0) só para extrair o CSS de comparação. Medições no navegador embutido: 1024, 1100, 1152, 1200, 1230, 1280, 375 e 800 × 400 px; janela e servidor local restaurados/encerrados.

## 8. VERIFIED / HYPOTHESIS / PENDING

| Estado | Itens |
|---|---|
| VERIFIED | C1–C5; lint/typecheck/test/build; IF2-1 corrigido na amostra com CSS real; reticências e sticky preservados; sem rolagem nova a 1280 e 375 px; IF3-1 na amostra; IF2-2 e IF2-3 inalterados |
| HYPOTHESIS | que as telas reais tenham a mesma largura mínima da amostra (filtros reais podem ser mais estreitos ou largos); que a rolagem de 1024–1233 px ocorra nas demais telas |
| PENDING | sessão real de `/app/**`; 1440/1920 px; leitor de tela; impressão A4; foco em telas reais; **aceite visual de Yan** |

## 9. Decisões pendentes

Orquestrador/Yan: aceitar IF3-1 (janela rolável de 1024 a ≈ 1233 px) ou pedir ajuste (trilho até 1280 px / filtros que quebram linha); IF2-2/IF2-3/IF3-2 no próximo lote da Interface. Yan: aceite visual.
