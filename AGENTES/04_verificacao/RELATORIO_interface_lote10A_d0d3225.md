# Relatório de Verificação — Interface — Lote 10, rodada A (I-1 Início, I-2 lista do Diário, I-3 painel do Diário; C9-12)

- SHAs revisados, um a um (`wt/interface-lote2`; base `c88f304`, só docs sobre o Lote 9; congelados em `d624447`):
  1. `e65813b9ada150b426708b8ea15c1e371569210e` — I-1: Início recomposto como T4.1.
  2. `5ac6dcfc2cb349745d71d354dd6eeef6dd1d8c08` — I-2: lista do Diário em grade de `EntryCard`.
  3. `bdec7b34e57938b580b0cfd8b191446da6e133a7` — I-3: detalhe do registro como painel flutuante; rota direta `/app/diario/[id]` → `?abrir=`; fecha C9-12 no Diário.
  4. `d0d32257410e5ee76b94ebea728b4287ad85f421` (topo) — STATUS.
- Verificador: Persona — Verificação Independente. Data: 11/11/2026. Relatório válido só para estes SHAs. **Não é aprovação**; o gate é sugestão. **O aceite visual é de Yan**: as capturas e medições abaixo são evidência de medição, não de aceite.
- Regras cumpridas: sem correção, sem push/merge/Preview/Production, sem SQL, sem `.env`, sem chave, sem provedor real (sem `NVIDIA_API_KEY`/`GROQ_API_KEY`: a estruturação por IA respondeu `not_configured`), nada nos worktrees dos escritores; execução só em `verificacao-lote2`, um SHA por vez, builds em sequência com `HEAD` conferido (estável nos cinco), worktree **devolvido a `a5a18aa`, limpo**; portas 3110, 3198 e 3199 livres.
- **Sobre o "banco de QA" (leia antes de usar este relatório):** **não usei o login de QA nem o servidor de Yan em `localhost:3100`.** Não tenho a credencial da conta descartável, não li `.env*`, e uma credencial vinda de outra sessão não é entrada minha para digitar num formulário. No lugar, subi um **Supabase FICTÍCIO local** (`ferramentas/lote10A/stub.mjs`, só `127.0.0.1`, dados inventados, sessão de mentira assinada com segredo inventado, nenhum acesso de rede externo) e rodei o `next start` real do SHA de topo contra ele. As capturas e os testes de ação são **reais** (servidor, HTML, mouse e teclado reais), mas o **dado e as regras do banco são os do stub**, não os do QA. A ressalva está em §8.

## 1. Resumo e gate sugerido

| SHA | Gate sugerido | Em uma linha |
|---|---|---|
| `e65813b` (I-1) | **liberar com ressalvas** | Início tem 1 bloco escuro (focal), 1 botão brand, 4 tiles, `ScoreRing` e `TraceLine` no vazio; 0 contraste abaixo de 4,5:1 e 0 rolagem horizontal em 375/768/1024/1280/1440. Diverge do T4.1 em blocos de dados (S4, §3). |
| `5ac6dcf` (I-2) | **liberar com ressalvas** | Grade de `EntryCard` (1/2/3 colunas, raio 22, sem tabela nem aba), estados vazio e erro calmos. Abrir um cartão **perde os filtros** (**I10-2, S3**, nasce aqui e se completa no I-3). |
| `bdec7b3` (I-3) | **reter até corrigir I10-1** | Painel 600 px (343 a 375 px), raio 28, um por vez, foco preso, Esc fecha, rota direta e ações funcionam, **C9-12 fechado**. Mas **o foco não volta ao cartão em 5 de 7 fechamentos com Esc (I10-1, S3)**, critério explícito do Lote 10. |
| `d0d3225` (topo, STATUS) | **liberar com ressalvas** | Só `AGENTES/01_interface/STATUS.md`; a frase "fechar … devolve o foco ao cartão" **não se confirma** (I10-1); o resto confere. |

**Veredito da rodada A (topo `d0d3225`): não integrar ainda.** Sem S1 e sem S2. **Dois S3 abertos**, ambos de comportamento do painel e ambos de correção pequena e localizada: I10-1 (foco) e I10-2 (filtros). Recomendo tratar os dois num commit antes de integrar; I-1 e I-2 poderiam ir sozinhos se o Orquestrador preferir fatiar. Isto não é aprovação: aceite visual, tela real com o banco de QA e os formulários (I-6) seguem pendentes.

Execução independente (`next typegen`, `npm test`, lint, typecheck, build; base `c88f304` e os quatro SHAs): **50 de 50 execuções com saída 0, 0 falhas, `HEAD` estável nos cinco.** `npm test` **149/149** em todos os cinco (nenhum teste novo nos três commits, **I10-8**); lint 0 avisos; `ds-adherence.test.ts` direto 29/29; `origin`, `gate`, `redirect`, `qa-login-gate` diretos com saída 0. Rotas do build iguais às da rodada 9.

## 2. Escopo do diff — só caminhos autorizados

- **VERIFIED:** `git diff --name-only c88f304 d0d3225` lista 9 arquivos, **todos autorizados**: `app/app/inicio/page.tsx`, `app/app/diario/{page,diary-detail,diary-panel}.tsx`, `app/app/diario/[id]/page.tsx`, `app/ds.css`, `components/ds/{entry-card,focal-journey}.tsx`, `AGENTES/01_interface/STATUS.md`. Nenhum em `globals.css`, `lib/**`, `actions.ts`, `evidencias/**` ou outra tela. `git diff --check` limpo; trailer `Co-Authored-By` nos quatro; nenhum padrão de segredo nas linhas adicionadas.
- **Nenhuma outra tela alterada — VERIFIED por leitura, não por diferencial de estilo:** (a) `ds.css`: +415 linhas, todas classes novas (`dx-home__*`, `dx-grid`, `dx-filters`, `dx-select`, `dx-dp*`, `dx-empty*`) que **só** `inicio` e `diario` usam (`git grep` fora dessas pastas: 0); nenhuma regra antiga removida, só 8 linhas reescritas para `:is(button, a).dx-ev/.dx-entry/.dx-art` (e o foco do logo, que ganhou seletor extra), o que só alcança **âncoras**; `EvidenceCard` e `ArtifactCard` continuam `<button>` e a galeria usa `EntryCard` sem `href`. (b) `entry-card.tsx` e `focal-journey.tsx`: só prop nova opcional (`href`, `ctaHref`); sem a prop, o resultado é o de antes. **Não refiz o diferencial de estilo computado das 7 amostras do Lote 9** (a base `c88f304` não ficou servida); fica como PENDING se o Orquestrador quiser prova por medição.
- **Varredura (VERIFIED, texto dos arquivos tocados no topo):** 0 hex, 0 `px`, 0 `style={{}}`, 0 emoji, 0 import de Carbon/lucide, 0 classe legada em `inicio/page.tsx`, `diario/page.tsx`, `diary-panel.tsx`, `[id]/page.tsx`, `focal-journey.tsx`, `entry-card.tsx`. CSS novo: 0 hex, 0 `px`, 0 `rgb()`, 0 `!important`, 0 `border-left` colorida; `font-family` só `var(--ds-font-*)`, raios só `var(--ds-radius-*)`. **Classes legadas que restam:** `diary-detail.tsx` usa `button-text` e `button-danger`, e os formulários (`diary-forms.tsx`, intocado) trazem `text-field`, `field-label`, `field-help`, `button-primary`, `button-secondary`: **esperado até o I-6** (STATUS e Orquestrador avisam), mas ver **I10-3**.

## 3. I-1 — Início contra T4.1 (`e65813b`)

**Método:** `next start` do topo contra o stub, sessão fictícia, navegador do Claude em 375, 768, 1024, 1280 e 1440 px; contraste calculado em todo texto e controle (`AUDIT10`); estrutura comparada com `prototipos-t4/inicio-screen.jsx` por leitura (o `T4.1 - Início.html` não foi renderizado).

| Largura | Rolagem horiz. | Bloco escuro | Botão brand | Contraste mín. | Alvos < 24 px |
|---|---|---|---|---|---|
| 375 | não | 1 (`dx-focal`) | 1 | 5,45 | 0 |
| 768 | não | 1 | 1 | 5,45 | 0 |
| 1024 | não | 1 | 1 | 5,45 | 0 |
| 1280 | não | 1 | 1 | 5,45 | 1 (`dx-link` 161×18, link **dentro de frase**: isento no WCAG 2.2; S4) |
| 1440 | não | 1 | 1 | 5,45 | 1 (idem) |

- **VERIFIED (captura real):** saudação em `h1` com ponto, linha de status ao vivo ("7 registros ativos e 1 evidência confirmada."), **um** `FocalJourney` "Do score declarado ao observado." com 4 etapas e uma próxima ação, **4** `DestinationTile` (Diário, Evidências, Persona Live, Artefatos) em 2×2 (768) e em linha (1440), `ScoreRing` ("Narrative Score 65 de 100"), `h2` todos com ponto, raios 28 (focal) e 22 (cartões), 0 borda colorida à esquerda, 0 classe legada, 0 botão do Agente.
- **Estado vazio (diagnóstico feito, sem registros) — VERIFIED:** focal "0 de 6 registros ativos; distribua-os por pelo menos 3 semanas." com "Registrar uma experiência"; bloco "Depois do primeiro registro." com `TraceLine` de 4 passos ("Seu registro", "A IA sugere", "Você confirma", "Live e Artefatos"); contraste mín. 5,68; sem rolagem horizontal; captura a 375 px.
- **Divergências do T4.1 (S4, I10-5, VERIFIED por leitura do JSX):** o protótipo tem blocos "Para revisar", "Atividade recente" e "Competências observadas" com "Lacuna"; a tela entrega "Registros recentes." e "Competências recorrentes." (linhas de título truncadas em uma linha) e **não tem** "Para revisar" (precisaria de consulta nova; a atribuição manda manter as consultas). Os tiles de Persona Live e Artefatos têm texto fixo ("Treine uma conversa", "Veja o que você já gerou"), não contagem. Sem nome no perfil o título começa em minúscula ("você, esta é a história…"). Não há `AgentPrompt` (correto: o Agente não existe). Decisão de Yan se isso é aceitável.

## 4. I-2 — lista do Diário (`5ac6dcf`)

- **VERIFIED (captura real, 7 registros do stub):** grade de `EntryCard` **sem tabela e sem aba** (0 `table`, 0 `[role=tab]`); 3 colunas a 1024/1280/1440, 2 a 768, 1 a 375; cartões iguais (212 px de altura), raio 22, 0 alvo < 24 px, contraste mín. 5,45, 0 rolagem horizontal nas 5 larguras. Cada cartão é um **link** (`aria-label` "Abrir registro: …") com data, título (cortado em 120 caracteres), contexto e status ("Sugestão para revisar", "Evidência confirmada", "Falha de estruturação", "Sem sugestões ainda"). Um botão brand ("Salvar registro", do editor), nenhum bloco escuro.
- **Estados — VERIFIED:** vazio ("Nenhum registro ainda." + instrução); filtro sem resultado e erro de consulta com `role="alert"` ("Histórico indisponível" + texto calmo que diz que nada foi perdido; o editor continua usável). Sem chat e sem botão do Agente.
- **I10-2 — S3, VERIFIED (bug de estado):** com filtro ativo (`?q=Python`, 2 cartões, campo "Python"), **abrir um cartão** leva a `/app/diario?abrir=<id>` (o `href` não carrega os filtros): atrás do painel a lista passa a **7 cartões** e a busca fica vazia; **fechar** volta a `/app/diario` (sem filtro, 7 cartões). A pessoa perde o recorte ao ler um registro. Nasce no `href` do cartão (I-2) e no `router.replace("/app/diario")` do fechamento (I-3).
- **Limite:** os campos de busca/data/estado são nativos/`Input` do DS; "Aplicar filtros" é `Button` do DS. O `<select>` é nativo (`dx-select`), não um componente do DS (S4).

## 5. I-3 — painel do Diário e rota direta (`bdec7b3`), com mouse e teclado reais

**Medidas (VERIFIED):** `<dialog>` modal nativo (`:modal` verdadeiro, 1 aberto de 2 no DOM, o outro é a gaveta do shell fechada); **600 px** de largura a 768/1024/1280/1440 (343 px a 375, ou seja, viewport − 32), altura quase total, **raio 28**; nome acessível por `aria-labelledby` ("Registro de 10 de novembro de 2026."); foco inicial no botão "Fechar painel (Esc)"; 0 rolagem horizontal da página e do painel; contraste de 31 textos, mín. 5,68, **0 falhas**. Sem atributo `aria-modal` (o `<dialog>` modal nativo já é exposto como modal; S4, **I10-7**). Alvo < 24 px: só o checkbox de exclusão, 13×13 (rótulo 426×23), **I10-4, S4**.

| Teste | Resultado |
|---|---|
| **Um painel por vez** | 1 `dialog[open]` em todas as medições. VERIFIED |
| **Foco preso** | Tab ×22: 19 paradas, todas dentro do painel, 0 fora; o ciclo volta ao botão fechar. VERIFIED |
| **Esc fecha** | Fecha, URL volta a `/app/diario`. VERIFIED |
| **Foco volta ao cartão (Esc)** | **Falha em 5 de 7**: depois de fechar, `document.activeElement` é o `<body>` (cartões 2, 4, 1, 3 e o cartão da lista filtrada); só voltou ao cartão em 2 (o primeiro teste por mouse e o cartão 7). **I10-1, S3** |
| **Foco volta ao cartão (botão fechar)** | Voltou ao cartão (1 de 1). VERIFIED (amostra de 1) |
| **Rota direta** `/app/diario/<id>?suggestion=<id>&notice=generated&tab=sugestoes` | Redireciona para `?abrir=<id>&suggestion=…&notice=generated` (descarta só `tab`); painel abre com o aviso e a versão marcada (`aria-current`). VERIFIED |
| **Ações (banco fictício)** | **Editar** ("Alterações salvas.", `PATCH`); **criar** (formulário → `?abrir=<novo>&notice=created`, painel aberto com o aviso); **estruturar manualmente** (abre revisão "Preencha a estrutura." com "Sem suporte suficiente: …"); **estruturar com IA** (sem chave: aviso `not_configured`, versão "Falha", nada saiu da máquina); **confirmar como evidência** (RPC; selo "Com evidência"; versão "Confirmada"; exclusão passa a "bloqueada"); **rejeitar** ("Sugestão rejeitada. O registro original foi preservado."); **excluir** (checkbox obrigatório: sem marcar, o navegador barra; marcado, `DELETE`, volta a `/app/diario?notice=deleted`, "Registro excluído.", 7 → 6 cartões). Todos os redirecionamentos de `actions.ts` (que ainda apontam para `/app/diario/<id>`) caem no painel. VERIFIED |

**I10-1 — S3, VERIFIED (o efeito; o mecanismo é HYPOTHESIS):** `diary-panel.tsx` fecha com `router.replace("/app/diario")` e só então, **50 ms depois** (`setTimeout`), tenta `focus()` no cartão. O efeito medido é `<body>` com foco em 5 de 7. O mecanismo provável é uma corrida: com o painel ainda montado (o modal deixa o fundo inerte) ou a lista ainda trocando, o `focus()` é ignorado; não confirmei no código do `FloatingPanel`. Contra servidor local rápido já falha em 5 de 7, e com banco remoto (mais lento) tende a piorar. Quem usa teclado ou leitor de tela perde o lugar na grade. O STATUS afirma o contrário.

**C9-12 — FECHADO no Diário (VERIFIED):** o resíduo de 2 títulos passa a ser `p.dx-empty__title` com ponto: "Estruturação não concluída." **17,58:1** (antes 1,82) e "Evidência confirmada." **17,58:1** (antes 1,46); o aviso de erro 9,16:1; selos "Falha" 9,16 e "Confirmada" 9,23. Nenhum `.success-panel`/`.error-panel` no painel. **Limite:** `evidencias/[id]` segue legado até o I-5 (fora desta rodada).

**Divergências do `diario-panel.jsx` (S4, I10-6, VERIFIED por leitura):** o protótipo traz `SectionIndex` ("Neste registro"), `TraceLine` "Rastreabilidade", bloco "Texto original" e edição/exclusão por confirmação dentro do painel; a tela tem as três seções empilhadas (editar, sugestões, excluir) com o editor sempre aberto e a exclusão por checkbox. A atribuição deixou a escolha de estrutura à Interface; fica para o aceite visual de Yan.

## 6. Achados

| ID | Sev. | Rótulo | SHA | Resumo |
|---|---|---|---|---|
| I10-1 | **S3** | VERIFIED | `bdec7b3` | Foco **não volta** ao cartão ao fechar o painel com Esc (5 de 7); `setTimeout(50)` depois de `router.replace`. STATUS afirma que volta. |
| I10-2 | **S3** | VERIFIED | `5ac6dcf` + `bdec7b3` | Abrir/fechar o painel a partir de lista filtrada **perde os filtros** (`href` sem filtros; fechar vai a `/app/diario`). |
| I10-3 | S4 | VERIFIED | `bdec7b3` | Classes legadas (`text-field`, `button-primary`, `button-secondary`, `button-text`, `button-danger`, `field-label`, `field-help`) na lista e no painel; com revisão aberta há **3** `button-primary` visíveis. **Esperado até o I-6**; o critério "um brand por tela" só vale depois. |
| I10-4 | S4 | VERIFIED | `bdec7b3` | Checkbox de exclusão 13×13 (rótulo 23 px de altura, 1 px abaixo de 24); no Início, `dx-link` 18 px de altura dentro de frase (isento). |
| I10-5 | S4 | VERIFIED (leitura) | `e65813b` | Início sem "Para revisar"/"Atividade recente"/"Lacuna" do T4.1; tiles Live/Artefatos com texto fixo; título começa em minúscula sem nome; `<time>` sem `datetime`. |
| I10-6 | S4 | VERIFIED (leitura) | `bdec7b3` | Painel sem `SectionIndex`, `TraceLine` e "Texto original" do `diario-panel.jsx`. |
| I10-7 | S4 | VERIFIED | `bdec7b3` | Sem atributo `aria-modal` (o `<dialog>` modal nativo basta para a maioria dos leitores). |
| I10-8 | S4 | VERIFIED | os três | Nenhum teste novo (149 antes e depois): painel, foco, rota direta e filtros sem cobertura automática. |

## 7. Não verificado / limites

- **PENDING — banco e login de QA reais** (`localhost:3100`): não usei; os testes de ação rodaram no stub, que implementa só o que as telas consomem (inclusive os `default '{}'` das colunas de lista, depois de eu corrigir o stub). Regras de RLS, tempo de resposta real, a RPC `confirm_evidence_suggestion` real e os dados reais não foram exercitados. **Quem tem a conta de QA (Yan) deve repetir I10-1 e I10-2 no banco real.**
- **PENDING — aceite visual: é de Yan.** Não renderizei os `T4.1`/`T4.2` HTML (não rodam offline); a comparação com o protótipo é por leitura do JSX.
- **I-1 e I-2 separados:** as capturas e os testes de comportamento são do **topo**; o `page.tsx` do Início e o da lista não mudam depois de I-1 e I-2 (exceto I-3, que adiciona o painel), mas não servi cada SHA sozinho. Os gates (§1) foram rodados **por SHA**.
- Diferencial de estilo computado das telas antigas (§2: prova por leitura); `generating`, `no_suggestion` e a versão rejeitada só foram vistos por texto, não por captura; modo escuro, impressão, leitor de tela, Preview e Production: não medidos. `/app/evidencias`, Live, Score, Artefatos, Diagnóstico, Configurações: fora desta rodada.
- C9-6, DS8-5 (decisões de Yan), C9-13..C9-15 (S4 aceitos): não retestados.

## 8. Ferramentas

Em `ferramentas/lote10A/`: `seq12.sh` e `seq12.out` (gates em sequência: base e quatro SHAs), `stub.mjs` (Supabase fictício; cenários `full`, `nolog`, `dberr`), `mkcookie.mjs` (sessão fictícia), `scan.mjs` (varredura de classes legadas/hex/px/Carbon), `audit10.js` (contraste). Tudo fora do repositório; o cookie fictício foi removido do navegador.
