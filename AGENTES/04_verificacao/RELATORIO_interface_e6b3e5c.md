# Relatório de Verificação — Interface — Lote 2

- SHA revisado: `e6b3e5c0367a8b76acfadebe5072ccf70f55c089` (`wt/interface-lote2`, 1 commit sobre `acc1f4443939cdaf1d57d13b67fe8f929adf1e97`).
- Verificador: Persona — Verificação Independente (não corrigi nada; **não aprovo visual**: o aceite visual é de Yan, `AGENTS.md` §6.1).
- Data: 08/11/2026. Base do diff: `git diff acc1f44..e6b3e5c`.
- Vale só para este SHA. Relatórios do Lote 1 (`abcf288` etc.) são histórico e não aprovam este SHA.

## 1. Resumo e gate sugerido

**Gate sugerido: bloquear a integração deste SHA até IF2-1 ser corrigido ou aceito por escrito pelo Orquestrador/Yan; o restante libera com ressalvas.** A licença das fontes está de fato provada (hashes e textos oficiais conferidos). A Fundação passa em lint, typecheck, `npm test`, build, mas o `.app-content { overflow: clip }` combinado com a barra lateral de 256 px **recorta sem rolagem** conteúdo que antes rolava a página, em larguras de 1100 a ≈ 1230 px (reproduzido com o CSS real do build; a tela real ainda é PENDING). Um S2 (IF2-1) e três S3 (IF2-2 a IF2-4); sem S1. Se o Orquestrador classificar IF2-1 como aceitável (por exemplo, só para Preview interno sem usuários), o gate vira "liberar com ressalvas".

## 2. Checagens C1–C6

| # | Checagem | Resultado | Evidência |
|---|---|---|---|
| C1 | Escopo (linha 01 de `LOTE-2.md`) | **OK** | 12 arquivos: `app/layout.tsx`, `app/globals.css`, `app/app/layout.tsx`, `app/app/app-navigation.tsx`, `components/shell/app-shell.tsx` (novo), `public/fonts/` (2 `.woff2` + 2 `OFL-*.txt`, só porque a licença foi provada), `docs/redesign/interface/{FUNDACAO_LOTE2,LICENCAS_FONTES}.md`, `AGENTES/01_interface/STATUS.md` |
| C2 | Arquivos proibidos | **OK** | nenhum `lib/**`, `package*.json`, lockfile (`package-lock.json` idêntico), outra migração, `.env`, `docs/design/approved/**` alterados; nenhuma tela de `app/app/**/page.tsx` migrada |
| C3 | `git diff --check` | **OK** | exit 0 |
| C4 | Segredos nas linhas adicionadas (texto; `.woff2` binário não varrido por padrão) | **OK** | sem ocorrências |
| C5 | Commit e coautoria | **OK** | 1 commit, pai = `acc1f44`, autor Yan, trailer `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>` |
| C6 | `STATUS.md` do papel | **OK com ressalva (IF2-4)** | `Estado: WAITING_APPROVAL`; declara o que é `PENDING` (sessão real, 1024/1440/1920 px, leitor de tela, aceite de Yan) |

## 3. Licença das fontes — conferência independente

`LICENCAS_FONTES.md` conclui `PROVADA`. Reproduzi o que dá para reproduzir sem dependência nova:

| Verificação | Resultado |
|---|---|
| SHA-256 de `Inter-latin.woff2` no commit | `3100e775…bd4c62`, 48 256 bytes = o declarado e = o `sha256` de `fonts/Inter-{400,500,600,700}-latin.woff2` no `MANIFEST.json` do pacote T4 aprovado ✓ |
| SHA-256 de `PlusJakartaSans-latin.woff2` no commit | `153fc85b…db5e79`, 27 348 bytes = o declarado e = o do `MANIFEST.json` (`PlusJakartaSans-{500…800}-latin.woff2`) ✓ |
| `OFL-Inter.txt` × `rsms/inter` tag `v4.1` `LICENSE.txt` (baixado de `raw.githubusercontent.com`, só para hash) | **byte a byte idêntico** (`262481e8…54935a`, 4 380 bytes) ✓ |
| `OFL-PlusJakartaSans.txt` × `tokotype/PlusJakartaSans` tag `2.7.1` `OFL.txt` | idêntico exceto espaços finais de linha: upstream `995c7199…ab08a99` (4 402 bytes) × arquivo `f9a8e776…1f86e3` (4 401 bytes), `diff` ignorando espaço final sem diferenças. O `LICENCAS_FONTES.md` já declara o espaço removido (linha 21) ✓ |
| Copyright / nome reservado | Inter: `Copyright (c) 2016 The Inter Project Authors`; Plus Jakarta Sans: `Copyright 2020 The Plus Jakarta Sans Project Authors`; ambos "SIL Open Font License, Version 1.1"; **sem** "Reserved Font Name" nas linhas de copyright dos dois textos ✓ |
| Uso (`next/font/local`, arquivos próprios, sem CDN, sem dependência nova) | OFL-1.1 permite uso e redistribuição em app/site com o aviso junto aos arquivos; os `OFL-*.txt` estão ao lado dos `.woff2` ✓ |

Não reproduzi: o commit `5bb28733` do `google/fonts`, os `METADATA.pb`, a igualdade dos `.woff2` com `fonts.gstatic.com` v20/v12 e a tabela `name`/eixo `fvar` dos binários (sem ferramenta de leitura de `.woff2`, e baixar as fontes foge do necessário). A procedência pelo pacote aprovado (que cita "pulled from Google Fonts" em `fonts.css`) e a identidade de hash dentro do repositório sustentam a conclusão; a igualdade com o Google Fonts fica **HYPOTHESIS**. Isto é conferência técnica, não parecer jurídico (o próprio documento diz o mesmo).

Observação S4: o texto da OFL de Plus Jakarta Sans no repositório difere do upstream só por espaço final; a OFL exige que o aviso acompanhe a fonte, o que é cumprido. Se alguém quiser o hash oficial, basta restaurar o espaço (e o `git diff --check` reclamar).

## 4. Achados

| ID | Sev. | Status | Achado |
|---|---|---|---|
| IF2-1 | **S2** | VERIFIED (mecanismo, CSS real do build); HYPOTHESIS (tela real) | **O painel `.app-content` passa a recortar (`overflow: clip`) o que antes rolava a página.** Antes, o trilho tinha 56 px e `.app-content` não recortava: um filho mais largo que a coluna fazia a página rolar na horizontal. Agora a barra lateral tem 256 px a partir de 1100 px (+16 px de folga e 16 px de borda de cada lado), a coluna fica com `viewport − 304 px` e o excedente é cortado **sem barra de rolagem** (`overflow: clip` não é rolável nem por foco). Medi no harness (HTML estático com o CSS real de `.next/static/chunks/*.css`, servido em `127.0.0.1`, filhos sintéticos): a grade `.artifact-filters` (colunas `minmax(220px,1.5fr) repeat(2, minmax(150px,.75fr)) repeat(2, minmax(130px,.65fr)) auto auto`, necessidade ≈ 928 px) em **1100 px: coluna de 796 px, 96 px cortados** (os dois botões); em **1280 px: coluna de 976 px, cabe**; em **1024 px: trilho de 76 px, cabe**. Antes (`acc1f44`): 1100 − 56 = 1044 px, cabia. Outras grades com mínimos largos no CSS: `.live-evidence-options label` (≈ 598 px), `.artifact-list li > a` (≈ 692 px), `.live-session-list li > a` (≈ 650 px) — estas cabem a 1100 px; só o filtro de Artefatos estoura na amostra. O escritor registra o risco genérico (`FUNDACAO_LOTE2.md` §4.1) mas não o mediu. **Impacto:** controles inalcançáveis visualmente entre ≈ 1100 e ≈ 1230 px (notebooks de 1152/1200 px e janelas não maximizadas) nas telas de Artefatos e possivelmente outras; WCAG 1.4.10/2.4.7. **Recomendação (não implementada):** recolher a barra para o trilho de 76 px abaixo de ≈ 1280 px em vez de 1100 px, ou trocar `overflow: clip` por `visible` (e arredondar com `border-radius` + fundo no wrapper), ou `overflow-x: auto` no painel aceitando perder `sticky`. **Reprodução mínima:** em qualquer página sob `.app-content` com uma grade de ≥ 930 px de mínimo, abrir a 1100 px e comparar `getBoundingClientRect().right` do último filho com o do `.app-content`. A tela real exige sessão autenticada (PENDING). |
| IF2-2 | S3 | VERIFIED (harness) | **A barra lateral estoura o cartão em janelas baixas e não rola.** `.app-sidebar` tem `height: calc(100svh − 32px)` e nenhum `overflow-y`. Com viewport de 800 × 400 px (equivale a um notebook 1600 × 800 a 200 % de zoom, ou 1366 × 768 a ≈ 200 %): `scrollHeight` 411 px × `clientHeight` 368 px; o último item (Configurações) fica **43 px abaixo do cartão branco**, sobre o fundo cinza, e só entra na janela ao rolar o documento até o fim (medido: `scrollY 27`, item de 356 a 400). O alvo continua alcançável por rolagem e por foco, mas a presença fora do cartão é um defeito visual e dificulta o uso com zoom (WCAG 1.4.4). Limiar prático: altura < ≈ 445 px. **Recomendação:** `overflow-y: auto` em `.app-sidebar-nav`. **Reprodução:** viewport 800 × 400, `document.querySelector('.app-sidebar').scrollHeight > clientHeight`. |
| IF2-3 | S3 | VERIFIED | **A afirmação "cada página já tem o seu `<main>`" é falsa para Configurações.** `FUNDACAO_LOTE2.md` e o comentário de `app-shell.tsx` dizem que o AppShell não renderiza `<main>` porque cada página tem o seu. As 12 páginas de Início/Diário/Evidências/Live/Artefatos/Score/Diagnóstico têm; `/app/configuracoes`, `/conta` e `/dados` (layout com `<section className="settings-page">`) **não têm `<main>`** — nem antes (pré-existente), mas a Fundação passa a depender disso e também remove o `<header>` do app (landmark `banner`). O link "Ir para o conteúdo" aponta para uma `div` (`#conteudo`, `tabIndex=-1`), o que funciona, mas o leitor de tela não encontra região principal em Configurações. **Reprodução:** `git grep -n "<main" e6b3e5c -- apps/web/app/app/configuracoes` → nada. **Recomendação:** `<main>` no AppShell e retirar o `<main>` das páginas, ou `<main>` no layout de Configurações. |
| IF2-4 | S3 | VERIFIED | **`STATUS.md` rotula como `VERIFIED` antes da Verificação.** A linha "Fundação visual da fatia … `VERIFIED (código)`" repete o achado IF-3 do Lote 1 (autorrótulo). Neste SHA o rótulo acabou confirmado pela minha execução (seção 6), mas o protocolo reserva `VERIFIED` à evidência independente. **Recomendação:** `PENDING` até a Verificação. |
| IF2-5 | S4 | observação | Transição de `width` (220 ms) dispara também ao cruzar 1100 px ao redimensionar (vi o cartão a 83 px no meio da transição); inofensivo e coberto por `prefers-reduced-motion`. `nav-toggle` não tem `aria-controls`. "Registrar agora" e "Diário" levam à mesma rota (`/app/diario`), e só "Diário" recebe `aria-current`. Nenhum bloqueia. |

Nenhuma severidade foi reduzida.

## 5. Revisão do CSS e da navegação (sem aprovação visual)

| Item | Resultado |
|---|---|
| Regressão por seletor renomeado | Removidas apenas `.app-header`, `.app-rail`, `.app-rail-main`, `.rail-item*` e o `grid-template-columns: 48px` do `@media` — **nenhuma é usada fora da casca** (`git grep` em `apps/`; `.wordmark`/`.phase-label` seguem, usadas por `/entrar`, onboarding e Diário). Das ~3 000 linhas, só mudaram o `@theme` de fontes, os tokens `--ds-*`, o bloco da casca, a remoção da regra `.app-shell` de 48 px no `@media` e as regras de impressão (`git diff -U0`: 21 hunks, todos nesses cinco grupos). A afirmação "nenhuma outra regra foi tocada" procede ✓ |
| Colisão de tokens | `--ds-*` não colide com `--indigo-*`/`--radius-*` legados ✓; `--font-sans` e `--font-display` entram no `@theme` e o build os emite (`--font-display:var(--font-jakarta)…`, `--font-sans:var(--font-inter)…`) ✓ |
| Fontes no build | 3 `@font-face` (`inter` 400–700, `plusJakartaSans` 500–800, `geistMono` 100–900), `font-display: swap`, com fallbacks ajustados ✓. Pesos usados no CSS legado: 400, 500, 600 (40×) e 800 (1×, no display) — todos dentro dos intervalos ✓ |
| Contraste (calculado) | foco `indigo-600` × branco **5,7:1** (o do DS, `indigo-400`, daria 2,72:1 — o desvio é justificado); foco × item ativo `indigo-100` 4,81:1; ícone ativo `brand` × `indigo-100` 4,81:1; ícone `n-600` × branco 8,57:1 e × hover `n-50` 7,63:1; texto `n-900` × `indigo-100` 14,84:1; "Registrar agora" branco × `ink` 17,58:1 (hover 13,86:1) ✓ todos ≥ 3:1/4,5:1 |
| `prefers-reduced-motion` | regra global (`transition-duration: 0.01ms !important`) cobre o novo `transition` de largura e de cor ✓ |
| Alvos | `min-height: 44px` em todos os controles da barra; no harness 44×44 ✓ |
| Teclado e nomes | ordem: link de salto, recolher, Registrar, 5 destinos, Configurações; `aria-current="page"`, `aria-expanded` e `aria-label` do botão; nome acessível preservado no texto visualmente oculto quando recolhido ✓ por leitura (não testado com leitor de tela: PENDING) |
| Estados do shell | trilho < 1100 px e barra superior < 640 px por CSS puro ✓ por leitura; `.app-content:has(.ds-surface)` sem consumidor ainda (nenhuma tela usa `.ds-surface`) |

## 6. Execução independente

Checkout isolado `C:\Users\yansi\Projetos\persona-wt\verificacao-lote2`, desanexado em `e6b3e5c0367a8b76acfadebe5072ccf70f55c089`, `git status` limpo antes e depois. Sem `.env`, sem chave, sem rede de provedor.

| Comando (em `apps\web`) | Exit | Resultado |
|---|---:|---|
| `npx next typegen` | 0 | tipos gerados |
| testes do papel | n/a | o papel não tem teste unitário; o CSS/React da casca não é testado por `node --test` |
| `npm test` | 0 | tests 32 · pass 32 · fail 0 · cancelled 0 · skipped 0 |
| `npm run lint` | 0 | sem diagnósticos |
| `npm run typecheck` | 0 | sem erros |
| `npm run build` (sem `.env`) | 0 | "Compiled successfully"; 24 páginas; as duas fontes entram em `.next/static/media` |

Visual: **não aprovado e não avaliado em tela real.** Usei só um harness estático (HTML escrito por mim, copiando as classes de `app-navigation.tsx`/`app-shell.tsx` e carregando o CSS real do build) no navegador embutido, 1024/1100/1280 e 800 × 400 px, para medir IF2-1 e IF2-2. O harness não usa os componentes React nem dados; não substitui sessão real. Servidor local encerrado, janela restaurada, checkout devolvido a `acc1f44`.

## 7. VERIFIED / HYPOTHESIS / PENDING

| Estado | Itens |
|---|---|
| VERIFIED | escopo, arquivos proibidos, `diff --check`, segredos, coautoria; hashes dos `.woff2` e dos `OFL-*.txt` (contra o pacote aprovado e as fontes upstream); lint, typecheck, `npm test`, build; classes removidas sem uso externo; contrastes; recorte do `.app-content` e estouro vertical no harness |
| HYPOTHESIS | que a tela real de Artefatos (e outras) sofra o recorte de IF2-1; igualdade dos `.woff2` com o Google Fonts; `fvar`/`name` dos binários |
| PENDING | sessão real de `/app/**`; 1024/1440/1920 px; leitor de tela; foco em telas reais; impressão do Artefato (A4); decisões 4.2–4.9 do `MAPA_TELAS.md`; **aceite visual de Yan** |

## 8. Decisões pendentes

Orquestrador/Yan: corrigir ou aceitar IF2-1 (ponto de recolhimento da barra e/ou o `clip`); IF2-2/IF2-3 podem entrar num lote de correção da Interface. Yan: aceite visual da moldura clara com painel escuro transitório; fonte monoespaçada.
