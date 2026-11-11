# Relatório de Verificação — Interface — Lote 9 (correções do Lote 8, casca em uso e telas de entrada, C-1 a C-6)

- SHAs revisados, um a um (`wt/interface-lote2`, base `71e35b04d05b74001fe49533c28e5e33130b306c`, cada um filho do anterior):
  1. `f4e4236c980693f48134f9015eda9532af502e37` — C-1: correções do Lote 8 no núcleo do DS (Avatar sem `ai`, padding do Button, tokens de alfa/tipografia, alvo de 44 px, gate de aderência reforçado).
  2. `74147b9d626b3fa2dfafef0d734868b5d19428a7` — C-2: `app/app/layout.tsx` passa a usar o `AppShell` do DS (removidos `components/shell/app-shell.tsx` e `app/app/app-navigation.tsx`).
  3. `decb5fca85e6d62e12a1ff567569aaca0a80bf9d` — C-3: `/entrar` sobre o DS e login de QA com destino `/onboarding` e origem vinda do `Host`.
  4. `d50d2a7af479e65f7ed72f9d92264c82017724c0` — C-4: `/onboarding` com `StepFlow`, `Input`, `Textarea`, `Chip`, `Switch`; prévia `/dev/ds/onboarding`.
  5. `c83ea53e0c0a99dad38329fc1a05844803e6cab1` — C-5: `/auth/erro` com mensagens calmas e um botão brand.
  6. `122e8609f74e2829fe7c58435abdd5c8077330d4` (topo) — C-6: `/termos` e `/privacidade` em `Card`.
- Verificador: Persona — Verificação Independente. Data: 11/11/2026. Um relatório vale só para os SHAs citados. **Não é aprovação**; o gate é sugestão. **O aceite visual é de Yan**: nada aqui está marcado como visualmente aprovado; as capturas abaixo são evidência de medição, não de aceite.
- Regras cumpridas: sem correção, sem push/merge, sem banco/SQL, sem chave, sem `.env` (o worktree só tem `.env.example`), sem chamada a provedor real (nenhum login Microsoft, nenhum envio do onboarding), credenciais só fictícias; nada nos worktrees dos escritores; execução só em `verificacao-lote2`, um SHA por vez, builds em sequência com `HEAD` conferido antes e depois (`HEAD estavel` nos sete), worktree devolvido a `a5a18aa` **limpo** (0 alterações, só `.env.example`), portas 3107/3108/3109 livres. Servidores `next start` sempre com `env -i`. Mutações, sondas e a cópia com o shell real ficaram **fora do repositório** (pasta do scratchpad).

## 1. Resumo e gate sugerido por SHA

| SHA | Gate sugerido | Em uma linha |
|---|---|---|
| `f4e4236` (C-1) | **liberar com ressalvas** | As cinco correções do Lote 8 conferem (§3). Ressalva S4: o gate reforçado ainda tem lacunas (§3.5, C9-8). |
| `74147b9` (C-2) | **reter (não integrar como está)** | **C9-1 (S2):** telas legadas sem `ds-surface` ficam com texto `rgb(250,250,252)` sobre o painel `rgb(250,250,252)` (contraste 1:1). **C9-2 (S3):** na gaveta do celular, "Registrar agora" e o logo navegam sem fechar a gaveta. Medidas do shell, ordem de foco, estados e 5 destinos + Configurações conferem; o portão de perfil/onboarding do layout não mudou. |
| `decb5fc` (C-3) | **liberar com ressalvas** | `/entrar` com 1 botão brand; HTML **sem nenhum vestígio** do formulário de QA com o gate desligado; formulário só com gate ligado e Host local; destino `/onboarding`; origem pelo `Host`. Ressalvas S4: C9-4 (teste novo fora do `npm test`), C9-6 (botão Microsoft sem o logotipo), C9-7 (protocolo do redirecionamento segue `X-Forwarded-Proto`). |
| `d50d2a7` (C-4) | **liberar com ressalvas** | Fluxo de 4 etapas exercitado de verdade (validação, foco no título/campo, consentimento, rascunho preservado); alvos 44 px em ponteiro grosso; validação do servidor e `actions.ts` **não mudaram**. Ressalva S4: C9-10. O envio real **não** foi exercitado (sem banco). |
| `c83ea53` (C-5) | **liberar** | Quatro mensagens + código inválido/duplicado/`__proto__` caem no padrão "retorno"; um botão brand; sem jargão. |
| `122e860` (C-6, topo) | **liberar C-6; a série não integra enquanto C-2 estiver aberto** | `/termos` e `/privacidade` com o mesmo conteúdo, título com ponto e chip "Em preparação"; sem rolagem horizontal em 375–1440. O topo herda C9-1 e C9-2. |

Execução independente, sem `.env`, em base e nos seis SHAs: `next typegen`, `npm test`, lint, typecheck e build com **saída 0 em todos** (35 comandos; `exit 0` em 67 de 67 linhas de execução, contando os testes diretos). `npm test`: **123/123 na base e 137/137 em cada SHA** (+14 casos de `ds-adherence.test.ts`; cancelados 0, ignorados 0). Lint com 0 avisos em todos. Testes que o `npm test` não roda, executados direto (`node --experimental-strip-types --test`): `ds-adherence.test.ts` **20/20** (C-1 em diante; 6/6 na base), `gate.test.ts` 2/2, `origin.test.ts` **3/3** (C-3 em diante), `redirect.test.ts` 6/6, `qa-login-gate.test.ts` 3/3. Rotas do build: 28 na base e em C-1..C-3; **29** de C-4 em diante; a única nova é `ƒ /dev/ds/onboarding` (404 em produção).

**S2: 1. S3: 1.** Mais nove S4 (alguns só observação). Nenhum componente do Agente entrou.

## 2. Escopo do diff (`71e35b0..122e860`) — só caminhos autorizados

- **VERIFIED:** `git diff --name-only 71e35b04 122e860` lista 28 arquivos, todos dentro de `LOTE-9.md`: `components/ds/**`, `app/ds.css`, `app/dev/ds/**`, `eslint.config.mjs`, `app/app/layout.tsx`, remoção de `app/app/app-navigation.tsx` e `components/shell/app-shell.tsx`, `app/entrar/**`, `app/onboarding/**` (só `page.tsx` e `onboarding-form.tsx`), `app/auth/erro/**`, `app/auth/qa-entrar/**`, `app/termos/**`, `app/privacidade/**`, `AGENTES/01_interface/STATUS.md`, `docs/redesign/interface/**`. **Zero arquivo fora.** `globals.css`, `package.json`, `proxy.ts`, `lib/**`, `app/onboarding/actions.ts`, `app/auth/iniciar/**`, `app/auth/callback/**` e as telas `app/app/**` **não** aparecem.
- Ninguém importa os arquivos removidos: `git grep "components/shell|app-navigation"` no topo não acha nada. Nenhum arquivo tocado importa Carbon (o único acerto é a frase "Carbon" em `ENTRADA_LOTE9.md`, texto).

## 3. C-1 — cada correção do Lote 8 (`f4e4236`)

| Item | Verificação | Resultado |
|---|---|---|
| DS8-8 Avatar sem `ai` | `git grep 'dx-avatar--ai\|variant="ai"'` no topo: 0; `avatar.tsx` sem prop `variant`; seletor `.dx-avatar--ai .dx-avatar__face` removido do `ds.css`; galeria medida no navegador: 0 avatares com classe `ai`. O `icon` continua aceito. | **VERIFIED** |
| DS8-4 padding do Button | Galeria, ponteiro fino: sm `0 14px`, md `0 18px`, lg `0 22px`; alturas 32 / 40 / 48; raio 999; fontes 13/14/15 px. DS: 14/18/22. | **VERIFIED** (confere) |
| DS8-3 tokens de alfa e tipografia | `ds.css` do topo: `rgb()/hsl()` só em declarações de token (`--x:`), 0 literais de `font-weight`/`line-height`/`letter-spacing` fora de `var()`; `gallery.css` trocou `800/700/1.5/-0.02em…` por `--ds-fw-*`, `--ds-lh-*`, `--ds-ls-*`. `--ds-halo-active` passou a `var(--ds-brand-a35)`. 23 tokens novos, 0 colisões com `globals.css`. | **VERIFIED** |
| DS8-6 alvo de 44 px (ponteiro grosso) | Preset móvel (`pointer: coarse`): logo da Sidebar na gaveta **120 × 44**, "Recolher menu" 44 × 44, itens 44; nó do `TraceLine` mede 32 × 32 com `::after` (`inset: calc((32 − 44)/2)`); teste de acerto por `elementFromPoint`: acerta o nó até ~21,8 px do centro e falha em 22 → área ≈ 43,7–44 px (a diferença para 44 é arredondamento da emulação, borda de 0,67 px). | **VERIFIED** (≈44 px) |
| DS8-2 gate de aderência | `cssViolations` + ESLint. Ver §3.5. | **VERIFIED com lacunas (S4)** |

### 3.5 Gate de aderência reforçado, com casos sujos (independente do teste do autor)

- **CSS (`cssViolations`)**, 49 formas sujas minhas (`ferramentas/lote9/css_dirty3.mts`), declaradas uma por linha como no `ds.css`: pega hex (3/6/8, maiúsculo, `%23` em `url(data:…)`, dentro de fallback `var(--x,#fff)`), `rgb/rgba/hsl/hwb/lab/oklab/color()/color-mix()` (também em maiúsculas), cor nomeada (`red`, `RED`, `solid tomato`), `px` (maiúsculo, decimal, em `calc`, negativo, em `@media`, em fallback de `var`), `font` abreviado, `font-family` solto, `font-weight`/`line-height`/`letter-spacing` literais (também `FONT-WEIGHT`). Sem falso positivo em `var()`, `transparent`, `currentColor`, `rem`, `%`, `vh`, comentários e `0`.
- **Lacunas do CSS (S4):** a regra é ancorada na linha: declaração minificada numa linha só (`.a{color:red}`) **passa** para cor nomeada, `font-family`, `font-weight`, `line-height` e `letter-spacing` (hex, `rgb()` e `px` ainda são pegos); `font-weight: bold` (palavra) passa; unidade `pt` passa; `px` escapado (`12\70x`) passa.
- **ESLint (TSX)**, 22 sondas sujas da matriz do Lote 8 + 15 novas, cópia fora do repositório com a configuração do topo: **19 de 22** das antigas são pegas (Lote 8: 13 de 21); passaram a ser pegas `rgb`, `hsl`, `12PX`, `px` por concatenação, `px` dinâmico (`${n}px`) e interpolação; das novas, pegos `color-mix`, `oklch`, `hwb`, `HSL(...)`, `rgba` em template, `calc(100% - 8PX)`, `1.5PX`, `font: "12px/1.5 Arial"`, `url(#fff)`. **Ainda passam:** cor nomeada em TS (`color: "red"`), `px` numérico (`width: 12`), `fontFamily: "Arial"` como chave de objeto, e `fontWeight`/`lineHeight`/`letterSpacing` literais em TS. Controles limpos (`var()`, números sem unidade, `%`, `rem`) passam sem falso positivo.
- **Cobertura:** o gate cobre só `components/ds/**`, `ds.css` e `gallery.css`. As telas novas (`app/entrar`, `onboarding`, `auth/erro`, `termos`, `privacidade`) **não** estão sob o gate; conferi à mão com `grep`: 0 hex, 0 `rgb()/hsl()`, 0 `px` literal nelas (o `px` que sobra em `StepFlow` é a grade `repeat(N, …)` dinâmica e `Avatar` recebe tamanho numérico por prop, ambos herdados do Lote 8).
- `origin.test.ts` **não** está no script `test` do `package.json` (declarado em `ENTRADA_LOTE9.md`; `package.json` está fora da escrita): ver C9-4.

## 4. C-2 — a casca em uso (`74147b9`)

### 4.1 Layout e portão de perfil/onboarding
`git diff 71e35b04 122e860 -- apps/web/app/app/layout.tsx` mostra só a troca do shell: as chamadas `getCurrentProfile`, `redirect("/entrar")`, `redirect("/onboarding")` (sem perfil e com `onboarding_completed_at` nulo) **não mudam**. **VERIFIED por diff**; execução real **PENDING** (sem Supabase local, `/app/*` redireciona para `/auth/erro?codigo=configuracao` em `next start`: 307 conferido).
O shell antigo tinha os mesmos cinco destinos + Configurações + "Registrar agora" + recolher: **sem perda de função**.

### 4.2 Medidas (build de produção do topo; layout e AppShell reais, páginas internas substituídas por *stubs* com as classes do legado; portão e `proxy.ts` neutralizados só nessa cópia)

| Largura | Modo | Barra | Cabeçalho | Conteúdo | Rolagem horizontal |
|---|---|---|---|---|---|
| 375 | gaveta (`<dialog>`) | oculta; botão "Abrir menu" 40 × 40 | busca 266 × 43 | 359 de largura | não |
| 768 | trilho | **76** | busca 459 × 43 | 644 | não |
| 1024 | trilho | **76** | idem | 900 | não |
| 1280 | expandida | **256** | idem | 976 (máx. 1280) | não |
| 1440 | expandida | **256** | idem | 1136 | não |

- Cabeçalho interno 56 px (84 com respiro); conteúdo com `max-width 1280`; trilho abaixo de 68,75 rem de shell, gaveta abaixo de 40 rem. O "mínimo 560" do Lote 8 não se aplica ao shell em uso (ocupa a janela): **não medi**.
- **Destinos:** Início, Diário, Evidências, Persona Live, Artefatos + Configurações no rodapé; `aria-current="page"` no ativo, por prefixo de rota (conferido em `/app/inicio`, `/app/diario`, `/app/evidencias`, `/app/evidencias?q=…`). Em `/app/score` e `/app/diagnostico` (fora do menu, declarado) nenhum item fica ativo. **Sem botão do Agente**: nenhum botão/link com "agente/assistente/IA" no cabeçalho nem na barra.
- **Estados:** expandida ↔ trilho por clique (`aria-expanded` e rótulo "Recolher/Expandir menu" coerentes; no trilho os itens mantêm nome acessível e 44 × 44). Gaveta: abre com foco no logo, destinos fecham a gaveta e devolvem o foco ao "Abrir menu".
- **Ordem de foco (Tab real, 1280):** Ir para o conteúdo → logo → Recolher menu → Registrar agora → Início → Diário → Evidências → Persona Live → Artefatos → Configurações → Buscar ou perguntar → (volta ao link de pular). Anel visível em todos (2 px `brand-strong` + halo), **exceto o que está em C9-3**. `id="conteudo"` com `tabIndex=-1`; um só `<main>` (o da página) porque `contentAs="div"`.
- **Busca:** formulário GET `action="/app/evidencias"` com `name="q"`; digitei "projeto" + Enter e a navegação foi a `/app/evidencias?q=projeto`; a tela de Evidências legada lê `filters.q` (conferido no código).

### 4.3 C9-1 — S2, VERIFIED: telas legadas sem `ds-surface` ficam ilegíveis dentro do shell novo
- O shell antigo (`.app-content`, `globals.css`) dava às telas internas o **canvas escuro** (`background: var(--color-bg-canvas)`, `color-scheme: dark`) e só virava claro com `:has(.ds-surface)`. O shell novo não traz esse invólucro: o painel é claro (`rgb(250,250,252)`) e o `body` continua com texto claro (`rgb(250,250,252)`).
- Páginas do topo cujo `<main>` **não** tem `ds-surface`: `app/app/diario/[id]/page.tsx` (`diary-detail-page`), `app/app/evidencias/[id]/page.tsx` (`evidence-detail-page`) e `app/app/artefatos/novo/page.tsx` (`artifact-new-page`). As demais telas têm `ds-surface` (e `configuracoes/layout.tsx` também).
- Medido com CSS real e shell real: `main.app-page.evidence-detail-page`, `diary-detail-page` e `artifact-new-page` → `h1` e `p` com `color: rgb(250,250,252)` sobre fundo `rgb(250,250,252)` (**1:1**); com `ds-surface` o texto vira `rgb(26,23,38)`/`rgb(46,42,61)` (legível). Captura real do 1280 px: painel em branco onde deveriam estar título e texto. `color-scheme: dark` também chega aos controles de formulário dentro do painel claro.
- **Limite:** o conteúdo foi simulado (um `h1` e um `p` com as classes reais), porque as páginas reais precisam de Supabase; cartões internos com fundo próprio, se houver, ficariam legíveis, mas títulos e texto corrido herdam a cor. É uma regressão em fluxos centrais (abrir um registro do Diário, abrir uma evidência, criar artefato). Já existe desde `74147b9`.
- Quem decide o conserto e onde (as páginas e `globals.css` estão fora da escrita do Interface neste lote). Não corrigi.

### 4.4 C9-2 — S3, VERIFIED: a gaveta do celular não fecha ao tocar em "Registrar agora" nem no logo
- `app-shell.tsx` só embrulha `onNavigate` (destinos) e `onRegister` (botão). No layout real o "Registrar agora" é um **link** (`registerHref="/app/diario"`) e o logo é `Link`: nenhum dos dois chama `closeDrawer`.
- Real, preset móvel 375 px: toquei em "Registrar agora" dentro da gaveta → a rota mudou para `/app/diario` e a gaveta (`<dialog>` modal) **continuou aberta** cobrindo a página; "Evidências" fechou a gaveta e devolveu o foco ao "Abrir menu"; o clique programático no logo também deixou a gaveta aberta (`/app/inicio`, `open: true`). Mesmo código em `74147b9` e `122e860`.
- Na galeria `/dev/ds` o "Registrar agora" é botão com `onRegister`, que fecha: **a galeria não pega o defeito**.

## 5. C-3 — `/entrar` e login de QA (`decb5fc`)

Provas em `next build` + `next start` de produção do topo (`app/entrar` e `app/auth/qa-entrar` são idênticos de C-3 a C-6: `git diff decb5fc 122e860` vazio), sem `.env`, sem Supabase.

| Caso | `/entrar` | Rastros de QA no HTML | `<h1>` | Botão brand (elemento) | `POST /auth/qa-entrar` |
|---|---|---|---|---|---|
| `NODE_ENV=production` (+ flag `PERSONA_QA_PASSWORD_LOGIN=1`) | 200, 18.940 B | **0** | 1 | **1** (`<a href="/auth/iniciar">`) | **404** |
| `NODE_ENV=production` sem a flag | 200, 18.940 B | 0 | 1 | 1 | — |
| `NODE_ENV=development` + `VERCEL=1` + flag | 200, 18.940 B | 0 | 1 | 1 | **404** |
| `NODE_ENV=development` + `VERCEL_ENV=preview` + flag | 200, 18.940 B | 0 | 1 | 1 | — |
| **gate ligado** (`development` + flag), Host `127.0.0.1`, `localhost`, `[::1]` | 200, 21.179 B | formulário presente (`action="/auth/qa-entrar"`, e-mail, senha, "Entrar (QA)" `outline`) | 1 | **1** (o de QA é `outline`) | 303 |
| gate ligado com Host `evil.example`, `localhost.evil.example`, `127.0.0.1.evil.example` | 200, 18.940 B | **0** | 1 | 1 | **404** |
| gate ligado, Host `evil.example` + `X-Forwarded-Host: localhost` | sem formulário | 0 | — | — | — |
| gate ligado, Host `127.0.0.1` + `X-Forwarded-Host: evil.example` | com formulário | — | — | — | 303 (o cabeçalho é ignorado) |

- **HTML sem vestígio com o gate desligado — VERIFIED:** 0 ocorrências de `qa-entrar`, `qa-email`, `qa-password`, "Acesso de QA", "Entrar (QA)", `dx-signin__qa`, `PERSONA_QA`, nem `type="password"`/`action` de QA. A **única** coincidência é a URL pedida (`?erro=qa`) refletida no estado do roteador do RSC quando eu mesmo peço `/entrar?erro=qa`; sem formulário nem mensagem. Os arquivos estáticos do cliente (`.next/static`) **não** têm nenhuma dessas cadeias; o JSX do formulário só existe no chunk do servidor; a classe `.dx-signin__qa` existe na folha de estilo pública (só seletor, sem texto) — observação S4, sem vestígio no HTML.
- `?conta=excluida` mostra o aviso "Sua conta e os dados vinculados foram excluídos." (1 ocorrência) com ou sem gate.
- **Botão brand:** o HTML tem a classe `dx-btn--brand` duas vezes, mas uma é a prop `className` no payload RSC; o elemento é **um** (`<a href="/auth/iniciar" class="dx-btn dx-btn--brand dx-btn--lg dx-btn--full">`). Âncora comum (`native`), sem `Link`/prefetch, como a base (que também usava `<a>`): o início do OAuth não é pré-carregado.
- **Destino `/onboarding` e origem pelo Host:** `origin.test.ts` 3/3 (Host `127.0.0.1:3100`, `localhost:3199`, `[::1]:3000`, sem Host, protocolo da requisição, destino `/onboarding`). No servidor, `POST` com credencial fictícia e sem Supabase: Host `127.0.0.1:3107` → `303 Location: http://127.0.0.1:3107/entrar?erro=qa`; `localhost:3107` → `http://localhost:3107/…`; `[::1]:3107` → `http://[::1]:3107/…`; Host `evil.example` e `localhost.evil.example` → **404**; `POST` sem corpo → 303 para `?erro=qa`; `GET` → 405. A rota não lê mais `next` do formulário. **O 303 para `/onboarding` após sucesso não foi exercitado** (precisa de Supabase): VERIFIED por código e teste unitário, runtime **PENDING**.
- **Login Microsoft sem regressão — VERIFIED:** `app/auth/iniciar/**` e `app/auth/callback/**` não estão no diff; o botão aponta para `/auth/iniciar` como antes; sem Supabase a rota redireciona a `/auth/erro?codigo=configuracao` (comportamento da base). Login real **não** exercitado (sem provedor).
- **C9-6 (S4, HYPOTHESIS):** o botão da base tinha o logotipo da Microsoft (`MicrosoftMark`); o novo usa só texto + seta. Pelo meu conhecimento, as diretrizes da Microsoft para o botão "Entrar com a Microsoft" pedem o logotipo; **não reli a fonte nesta sessão**. É decisão de design do Yan.
- **C9-7 (S4, VERIFIED):** com gate ligado e `X-Forwarded-Proto: https`, o `Location` sai `https://127.0.0.1:3107/entrar?erro=qa` (o protocolo vem de `request.url`, que o Next monta a partir do cabeçalho). O host continua o do `Host`, e só existe com gate local ligado; sem impacto fora do QA local.

## 6. C-4 a C-6 — regras do DS nas telas

| Regra | `/entrar` | `/onboarding` | `/auth/erro` | `/termos`, `/privacidade` |
|---|---|---|---|---|
| Um brand por tela | 1 (a de QA é `outline`) | 1 por etapa (`Continuar` é `solid`; só "Salvar primeiro registro" é `brand`) | 1 | 0 (voltar é `outline`) |
| Sem borda colorida à esquerda | sim | sim | sim | sim |
| Título com ponto | "Registre uma vez. Prove sempre." / "Entre no Persona." | as 4 etapas | os 4 títulos | "Termos da fase de testes." / "Privacidade." |
| Sem sinal do Agente/IA | sim | sim | sim | sim |
| Sem hex / `px` literal / Carbon | sim (grep) | sim | sim | sim |
| `lang="pt-BR"`, 1 `<h1>`, 1 `<main>` | sim (5 larguras) | sim | sim | sim |

(A única `border-left` do CSS é a linha de conexão do `TraceLine` (`.dx-trace__item::after`), que já estava na base: não é borda de destaque.)

- **C-4 `/onboarding`:** `app/onboarding/actions.ts` e `lib/onboarding/**` **inalterados**; os valores do cliente espelham `validation.ts` (2–80, 8–180, 40–2000, consentimento obrigatório; `reminderTime` só é exigido com lembrete ligado; o regex do cliente é mais frouxo, mas `type="time"` garante `HH:MM` e o servidor continua validando). Nomes dos campos (`displayName`, `professionalMoment`, `mainObjective`, `productConsent`, `communicationsConsent`, `reminderEnabled`, `reminderTime`, `dailyLogContent`) e o `"on"` do consentimento batem com `validateOnboarding`; conferi no DOM os campos ocultos enviados (`professionalMoment=inicio-carreira`, `productConsent=on`; os desligados não são enviados). `/dev/ds/onboarding` responde 404 em produção e 200 em desenvolvimento.
  - **Fluxo real (celular, 375 px):** "Continuar" com campos vazios → erros nos campos, resumo "Revise os campos indicados para continuar.", foco no grupo "Momento profissional" (primeiro erro) e depois no campo; ao escolher o momento (`aria-pressed`) o erro some; etapa 2 sem consentimento → erro e foco no interruptor; etapa 3 (lembrete opcional) segue sem lembrete; etapa 4 com texto curto + Enter (não envia) e clique em "Salvar primeiro registro" → erro de 40–2.000 caracteres e foco no campo, **sem enviar**; o texto digitado permanece. A cada troca de etapa o foco vai ao `<h1>`. `Voltar` desativado na etapa 1.
  - **Alvos em ponteiro grosso:** chips 44, botões 44, caixa de entrada 44 (o `<input>` interno mede 43), interruptor 36 × 20 com `::after` 44 × 44. Em ponteiro fino: chips 34, botões 40.
  - **C9-10 (S4):** erro de campo e resumo usam `role="alert"` ao mesmo tempo (2 a 3 alertas anunciados por tentativa). **Não exercitado:** o envio real (`completeOnboarding` → banco), o redirecionamento a `/app/inicio`, o erro do servidor devolvendo `fieldErrors`.
- **C-5 `/auth/erro`:** `codigo=configuracao|provedor|retorno|sessao` mostram a mensagem própria; `xyz`, `__proto__`, `constructor`, `a&codigo=b` e ausência caem em "retorno" (200, 1 `<h1>`). Texto sem "Supabase/Azure" (a base tinha). Botão brand "Voltar para entrar" (48 px em ponteiro grosso, largura total).
- **C-6 `/termos` e `/privacidade`:** texto idêntico ao da base (só ganhou o ponto no título e o chip "Em preparação"); botão "Voltar para entrar" `outline` 44 px em ponteiro grosso.
- **C9-5 (S4, VERIFIED, já existia):** `/entrar`, `/auth/erro`, `/termos` e `/privacidade` compartilham o `<title>` "Persona — Registre uma vez. Prove sempre." (também na base): nenhuma tela define `metadata`.

## 7. Nenhuma tela legada alterada além do shell

1. **Caminhos:** nenhuma tela de `app/app/**` aparece no diff (só `layout.tsx`).
2. **CSS:** `ds.css` ganhou 57 seletores novos, **todos** com classe `dx-`; 1 removido (`.dx-avatar--ai …`); 23 tokens novos, 0 colisões com `globals.css`; 1 token alterado (`--ds-halo-active`, só valor equivalente via `var()`). `globals.css` **inalterado**.
3. **Rotas:** só `/dev/ds/onboarding` é nova (§1).
4. **Estilo computado** (amostra reduzida: 8 páginas do Lote 6 × 375/1280, todas as propriedades de todos os elementos, base × topo, com todos os blocos CSS de cada build): o harness acusa diferença nas 16 comparações, mas **só por dois motivos esperados**: (a) **12 variáveis do tema do Tailwind** (`--spacing`, `--text-sm`, `--container-3xl`, `--tracking-tight`…) deixam de ser emitidas porque as páginas reescritas eram as únicas que usavam essas utilidades; (b) em `reg_zoo` (a página de componentes do Lote 6, que traz a marcação **antiga** de termos/privacidade) 4 elementos com classes Tailwind (`mx-auto max-w-3xl px-6 py-16`, `text-3xl font-semibold`, `text-sm text-muted`…) perdem o estilo e a página encolhe 184 px. **Nas outras 7 páginas, 0 diferença em propriedade real** (fora variáveis e geometria derivada). Controles: base × base **0 de 16**; positivo (topo × cópia com `letter-spacing` injetado) **16 de 16**. Não rodei as 62 páginas × 2 larguras desta vez (≈19 min por rodada). **Limite:** as amostras têm o shell **antigo**; o conteúdo legado **dentro do shell novo** não está nelas (é o que C9-1 cobre à parte).

## 8. Capturas reais e acessibilidade (navegador do Claude, `127.0.0.1`)

- **Servidores:** produção (`NODE_ENV=production`) na 3107 para `/entrar`, `/auth/erro`, `/termos`, `/privacidade`; `development` + flag na 3109 para `/entrar` com QA e `/dev/ds/onboarding`; cópia com o shell real na 3108. `/onboarding` e `/app/*` reais **não são capturáveis** sem Supabase (redirecionam a `/auth/erro?codigo=configuracao`): o onboarding foi capturado em `/dev/ds/onboarding` (mesmo componente) e o shell na cópia de teste.
- **Capturas feitas** (telas reais, redimensionadas): `/entrar` 375, 768, 1024, 1280, 1440; `/auth/erro` 1440, 1024, 768, 375; `/termos` 1440, 1024, 768, 375; `/privacidade` 375 e 1280; onboarding etapas 1, 2 e 4 em 375; shell 1280 (expandido e trilho) e gaveta em 375. **Medido nas cinco larguras por iframe** (375/768/1024/1280/1440) para `/entrar`, `/auth/erro`, `/auth/erro?codigo=provedor`, `/termos`, `/privacidade` e `/dev/ds/onboarding`.
- **Sem rolagem horizontal** em nenhuma das 30 combinações (página × largura): `scrollWidth == clientWidth`; nenhum elemento além da borda; nenhum texto cortado.
- **Contraste** (pior caso de gradiente e opacidade): **0** textos abaixo de 4,5:1 (3:1 para texto grande) nessas telas. **Nomes acessíveis:** 0 controles sem nome; 0 `<img>` sem `alt`; 0 SVG decorativo sem `aria-hidden`. Sem `tabindex` positivo.
- **Foco visível (Tab real):** `/entrar` com QA: botão Microsoft → e-mail → senha → "Entrar (QA)" → Termos → Privacidade; botões e links com 2 px `rgb(109,40,217)`; campos com o anel na caixa (visto na captura). Shell: ver §4.2.
- **Alvos:** ponteiro grosso, tudo ≥ 44 (links Termos/Privacidade 55 × 44 e 86 × 44). Ponteiro fino: Termos/Privacidade em `/entrar` medem **24 px** de altura (o mínimo de 24 × 24 do WCAG 2.2 AA; abaixo dos 44 do DS só no ponteiro fino).
- **C9-3 (S4, VERIFIED):** o link do logo na barra lateral recebe o anel global de `globals.css` (`:focus-visible { outline: 2px solid var(--color-accent-bright) }` = `#A78BFA`, `rgb(167,139,250)`), **≈ 2,7:1** sobre o branco, abaixo dos 3:1 de 1.4.11 — justamente o desvio que o próprio DS documenta para os outros controles. Só o logo (`.dx-side__logo-full a`) não tem regra de foco do DS.
- **C9-9 (S4, observação):** o cabeçalho diz "Buscar ou perguntar", mas a ação é só busca em Evidências (declarado em `ENTRADA_LOTE9.md`); o texto promete uma pergunta que ainda não existe.
- Capturas servem de **medição**; o aceite visual de Yan **não** foi dado nem pedido aqui.

## 9. Achados

| # | Sev. | Rótulo | SHA | Achado |
|---|---|---|---|---|
| C9-1 | **S2** | VERIFIED | `74147b9`+ | Telas legadas sem `ds-surface` (`diario/[id]`, `evidencias/[id]`, `artefatos/novo`) ficam com texto claro sobre o painel claro do shell novo (contraste 1:1). §4.3 |
| C9-2 | **S3** | VERIFIED | `74147b9`+ | Na gaveta do celular, "Registrar agora" (link) e o logo navegam sem fechar a gaveta modal. §4.4 |
| C9-3 | S4 | VERIFIED | `74147b9`+ | Anel de foco do logo da Sidebar usa o global `#A78BFA` (≈ 2,7:1). §8 |
| C9-4 | S4 | VERIFIED | `decb5fc`+ | `origin.test.ts` não está no `npm test` (declarado; `package.json` fora da escrita): a regra "origem pelo Host" fica sem execução em CI. Rodei direto, 3/3. |
| C9-5 | S4 | VERIFIED (preexistente) | — | Todas as telas de entrada têm o mesmo `<title>`. §6 |
| C9-6 | S4 | HYPOTHESIS | `decb5fc` | O botão Microsoft perdeu o logotipo da Microsoft. §5 |
| C9-7 | S4 | VERIFIED | `decb5fc` | Protocolo do redirecionamento do QA segue `X-Forwarded-Proto`. §5 |
| C9-8 | S4 | VERIFIED | `f4e4236` | Lacunas do gate de aderência (CSS em linha única, `bold`, `pt`, escape; TS: cor nomeada, `px` numérico, `fontFamily`, `fontWeight/lineHeight/letterSpacing`) e telas novas fora do gate. §3.5 |
| C9-9 | S4 | VERIFIED | `74147b9` | "Buscar ou perguntar" sem "perguntar" (declarado). §8 |
| C9-10 | S4 | VERIFIED | `d50d2a7` | Dois a três `role="alert"` simultâneos por tentativa no onboarding. §6 |

## 10. Não verificado / limites

- **PENDING:** `/app/*` e `/onboarding` **reais** (sessão e banco): portão de perfil/onboarding só por diff; envio do onboarding, `redirect("/app/inicio")` e erros do servidor; o 303 do login de QA para `/onboarding` após sucesso; login Microsoft; contraste e foco das telas legadas reais dentro do shell (só a simulação de C9-1).
- A cópia com o shell real tem páginas internas **simuladas** e `proxy.ts`/portão neutralizados (só nessa cópia, fora do repositório).
- Computed-style: só a amostra reduzida (8 páginas × 2 larguras), não as 62 × 2; amostras com shell antigo.
- Comparação lado a lado com os `.card.html` do DS **não** feita (não renderizam offline; igual ao Lote 8). "Mínimo 560" do shell não medido.
- Impressão (`@media print`) não verificada; o `globals.css` ainda tem regras do shell antigo (`.app-shell`, `.app-content`, `.app-sidebar`) sem uso, declaradas no `ENTRADA_LOTE9.md`.
- Capturas de 768/1024/1440 de `/privacidade` e de 1440 de `/termos` com onboarding/shell em todas as larguras: medidas por iframe, sem captura de tela individual.

## 11. Ferramentas

`ferramentas/lote9/`: `seq9.sh` (gates por SHA), `srv9.sh` (provas de servidor do C-3), `audit9.js` (auditoria por página e largura), `css_dirty3.mts` (matriz suja de CSS), `probes_eslint_novos/`, `prep_leak9.py`/`leak_small9.py`/`leak_lab9.py`/`leak_agg9.py` (estilo computado), `seq9.out`, `srv9_c6.out`, `eslint_dirty9.json`.
