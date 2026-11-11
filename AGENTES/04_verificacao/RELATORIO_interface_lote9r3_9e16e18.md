# Relatório de Verificação — Interface — Lote 9, rodada 3 (C9-11, C9-12 e veredito da série C-1..C-6 + rodadas 2 e 3)

- SHA revisado (`wt/interface-lote2`; a rodada 3 parte do merge `b127288`, que só trouxe docs; código novo = só `apps/web/app/ds.css`, +14 linhas):
  1. `9e16e18fd53a210f5440ceea2438154037531db8` (topo) — C9-11 (botão primário) e C9-12 (mensagens de estado, botão de perigo) das 3 telas legadas dentro do `AppShell`; `AGENTES/01_interface/STATUS.md`.
- Verificador: Persona — Verificação Independente. Data: 11/11/2026. Relatório válido só para este SHA. **Não é aprovação**; o gate é sugestão. **O aceite visual é de Yan**: a captura citada é evidência de medição, não de aceite.
- Regras cumpridas: sem correção, sem push/merge, sem banco/SQL, sem chave, sem `.env`, sem senha real, sem provedor real; nada nos worktrees dos escritores; execução só em `verificacao-lote2`, um SHA por vez, builds em sequência com `HEAD` conferido (estável nos dois), worktree **devolvido a `a5a18aa`, limpo**; portas 3109 e 3110 livres. Servidor `next start` com `env -i`. Os diferenciais removeram regras **só em memória do navegador**, em cópia da página; nada foi gravado no repositório.

## 1. Resumo e gate sugerido

| SHA | Gate sugerido | Em uma linha |
|---|---|---|
| `b127288` (base, docs) | **liberar** | Só documentação; serve de base de comparação (gates com saída 0, 146/146). |
| `9e16e18` (topo) | **liberar com ressalvas** | **C9-11 fechado:** botão primário das 3 telas 3,09 → **5,70:1** (hover 7,1:1). **C9-12 reduzido, não zerado:** mensagens de erro, sucesso e aviso, botão e resumo de perigo e rótulo de nível passam de 1,1–1,8:1 para **7,2–9,6:1**; sobram **2 elementos** (os `strong` dos painéis "confirmada" e "não concluída" da aba Sugestões do Diário, 1,46 e 1,82:1). **C9-1 sem regressão. Telas com `ds-surface`: 0 diferença.** |

**Veredito sobre a série inteira (C-1..C-6 + rodadas 2 e 3, topo `9e16e18`): integrar com ressalvas, sem S1, sem S2 e sem o S3 de regressão.** O S3 que eu recomendei tratar antes de integrar (C9-11) **está fechado** neste SHA. Fica **um S3 residual, C9-12** (2 títulos de painel de estado no Diário), que o Orquestrador já decidiu aceitar como aberto até os Lotes 10–12 migrarem essas telas; o texto corrido logo abaixo de cada título é legível. S4 C9-13, C9-14, C9-15 seguem como estavam (aceitos). Isto não é aprovação: o aceite visual e as telas reais autenticadas seguem pendentes (§7).

Execução independente (`next typegen`, `npm test`, lint, typecheck, build; base `b127288` e topo `9e16e18`): **20 de 20 execuções com saída 0, 0 falhas, `HEAD` estável**. `npm test` **146/146** nos dois; lint 0 avisos; `ds-adherence.test.ts` direto **29/29** nos dois; `origin`, `gate`, `redirect`, `qa-login-gate` diretos também com saída 0. Rota do build: `ƒ /dev/ds/legado` (única, igual à rodada 2).

## 2. Escopo do diff — só caminhos autorizados

- **VERIFIED:** `git diff --name-only b127288 9e16e18` lista `apps/web/app/ds.css` e `AGENTES/01_interface/STATUS.md`. Nenhum arquivo fora do autorizado; `globals.css`, telas, componentes e testes **inalterados**. As 14 linhas novas de CSS são três regras, todas com o prefixo `.dx-shell__content:not(:has(.ds-surface))`:
  - `.button-primary { color: var(--ds-text-on-brand) }`
  - `:is(.field-error, .form-error, .field-error-list, .danger-zone summary, .button-danger, .button-danger:hover:not(:disabled)) { color: var(--ds-red-ink) }`
  - `:is(.form-success, .inline-notice, .evidence-level[data-level="documented"]) { color: var(--ds-green-ink) }`
- **VERIFIED (por leitura):** `.dx-shell__content` só aparece em `components/ds/app-shell.tsx` e `app/ds.css`. Telas fora do `AppShell` (`/entrar`, `/onboarding`, `/auth/erro`, `/termos`, `/privacidade`, galeria `/dev/ds`) **não estão dentro desse contêiner**, logo as regras novas não as alcançam. Telas dentro do shell com `ds-surface` são excluídas por `:not(:has(.ds-surface))`. As únicas páginas de `/app` sem `ds-surface` são as três legadas (`diario/[id]`, `evidencias/[id]`, `artefatos/novo`).
- `git diff --check` limpo. Provas de servidor do `/entrar` e do 404 de `/dev/ds/legado` **não foram refeitas**: o diff não toca TSX, gate nem rota; a afirmação é por diff, não por medição nova.

## 3. C9-11 — botão primário (VERIFIED)

Medição: build de produção de `9e16e18` em `next start` (`NODE_ENV=development` só para a prévia `/dev/ds/legado` existir), `AppShell` real, marcação das três telas **transcrita dos `page.tsx` reais** (mesmas classes), 375 e 1280 px, contraste calculado em **todo texto e controle** (fundo composto, gradiente pelo pior caso).

| | Antes (rodada 2, `f2c7533`) | Agora (`9e16e18`) |
|---|---|---|
| `.button-primary` repouso | `rgb(26,23,38)` sobre `rgb(124,58,237)` = **3,09:1** | `rgb(255,255,255)` sobre `rgb(124,58,237)` = **5,70:1** (bate com os 5,70 da Interface) |
| `.button-primary` hover (mouse real) | — | branco sobre `rgb(109,40,217)` ≈ **7,1:1** (calculado) |

- Vale para os botões "Salvar alterações", "Estruturar com IA", "Confirmar", "Salvar", "Adicionar", "Criar rascunho" nas três telas, em 375 e 1280 (mesmo número nas duas larguras). **Captura real** (navegador do Claude, 1024×768): rótulo branco sobre violeta; serve de medição, **não de aceite visual**.

## 4. C9-12 — mensagens de estado, perigo e rótulo (VERIFIED, resíduo de 2 elementos)

| Elemento | Antes (r2) | Agora | Cor/fundo agora |
|---|---|---|---|
| `.field-error` e lista de erros | 1,82:1 | **9,61:1** | `--ds-red-ink` |
| `.form-error` | 1,62:1 | **8,57:1** | `--ds-red-ink` |
| `.form-success` | 1,14:1 | **8,67:1** | `--ds-green-ink` |
| `.inline-notice` | 1,14:1 | **8,67:1** | `--ds-green-ink` |
| `.button-danger` repouso | 1,19:1 | **8,24:1** | `--ds-red-ink` |
| `.button-danger` hover (mouse real) | — | **7,19–8,80:1** (texto `rgb(127,29,29)` sobre tinta vermelha a 10%; calculado sobre branco, canvas claro e cinza 229) | borda `rgb(239,68,68)` |
| `.danger-zone summary` | 1,82:1 | **9,61:1** | `--ds-red-ink` |
| `.evidence-level[data-level="documented"]` | 1,46:1 | **9,32:1** | `--ds-green-ink` |
| **`.success-panel strong`** ("Evidência confirmada") | 1,46:1 | **1,46:1 (sem mudança)** | `#6ee7b7` fixo em `globals.css` |
| **`.error-panel strong`** ("Estruturação não concluída") | 1,82:1 | **1,82:1 (sem mudança)** | `#fca5a5` fixo em `globals.css` |

- **Resíduo, S3 (C9-12):** os dois `strong` acima **não estão no seletor novo**. Aparecem na aba "Sugestões" do Diário (painel de estado). É o título do estado; o parágrafo abaixo passa. Nas quatro visões medidas (`diario`, `sugestoes`, `evidencia`, `artefato`), **são as únicas falhas que restam**. Fecharia com `.success-panel strong` e `.error-panel strong` no mesmo `:is()`, ou com a migração das telas (Lotes 10–12). Não corrigi.
- **HYPOTHESIS:** o seletor cobre só `data-level="documented"` para o nível de evidência; outros valores de `data-level` não estão no CSS novo e **não estavam na marcação que transcrevi**, então não os medi.
- **Limite:** controles `[disabled]` ficam fora da medição (isentos de contraste no WCAG); o estado `:disabled` do botão de perigo não foi medido.

## 5. C9-1 — sem regressão (VERIFIED)

Refeito com as classes reais das 3 telas, 375 e 1280, sem rolagem horizontal:

| | `h1` | `p` (corrido) | `label` | link | campo | placeholder |
|---|---|---|---|---|---|---|
| `f2c7533` (rodada 2) | 13,30 | 6,82 | 12,17–13,30 | 5,45 | 17,45 | 5,64 |
| **`9e16e18`** | **13,30** | **6,82** | **12,17–13,30** | **5,45** | **17,45** | **5,64** |

Números idênticos: nenhum dos seis passou a falhar.

## 6. Diferencial de estilo computado — o que mais o CSS novo afetou (VERIFIED)

Método: para cada amostra, `AppShell` real, medi **todas as propriedades computadas e a caixa (x, y, largura, altura)** de cada elemento, **removi em memória as 3 regras novas** (achadas por `selectorText` + conteúdo) e medi de novo. As 3 regras foram achadas e removidas em 15 de 15 execuções.

**Telas com `ds-surface`** (as mesmas 7 amostras da rodada 2: Início, Diário, Evidência, Perfil, Diagnóstico, Live, Conta; 1280 px; **707 elementos**): **0 propriedade diferente e 0 caixa diferente**. (Na rodada 2 a diferença de `color-scheme` vinha das regras do C9-1, que continuam como estavam; aqui só as regras novas saem.) **Limite:** refeito só a 1280; a 375 vale pelo escopo do seletor (`:not(:has(.ds-surface))` não casa com essas telas em nenhuma largura) e pela medição de rodada 2 nas duas larguras para as regras anteriores.

**Telas legadas** (4 visões × 375 e 1280): **0 caixa diferente em todos os elementos**; mudam só propriedades de cor, e só nestes elementos:

| Elemento | Quantos | Observação |
|---|---|---|
| `button.button-primary` | 1–2 por visão | C9-11 |
| `button.button-danger` | 1–2 por visão | C9-12 (repouso e hover) |
| `p.field-error`, `ul.field-error-list` (+ `li`) | 1 por visão | C9-12 |
| `p.form-error`, `p.form-success`, `p.inline-notice` | 1 por visão | C9-12 |
| `summary` da zona de perigo | 1 por visão | C9-12 |
| `span.evidence-level` | 1 (visão `evidencia`) | C9-12 |

As propriedades que mudam são `color` e as derivadas de `currentColor` (`caret-color`, `outline-color`, cores de borda/regra de coluna e linha, decoração de texto). **Nenhum `h1`, `p` corrido, `label`, link, campo, cartão ou contêiner mudou.** Ou seja: **efeito colateral = nenhum além do pretendido**; as telas migradas e as novas (que usam `ds-surface` ou estão fora do shell) não são alcançadas.

## 7. Não verificado / limites

- **PENDING — telas reais autenticadas** (`diario/[id]`, `evidencias/[id]`, `artefatos/novo` com sessão e banco): a evidência é marcação transcrita com as classes e o CSS reais do build; não renderizei os subcomponentes de formulário.
- **PENDING — aceite visual: é de Yan.** Tive uma captura real a 1024×768; é medição.
- **HYPOTHESIS — C9-14 (S4):** as regras novas também dependem de `:has()`; em navegador sem `:has()` voltam ao estado ilegível. Não testei navegador antigo.
- Diferencial das 7 amostras `ds-surface` só a 1280 nesta rodada (§6). Outros valores de `data-level`, `:disabled`, impressão, leitor de tela, modo escuro: não medidos.
- Provas de servidor (404 em produção/Vercel, gate do `/entrar`): não refeitas, por diff (§2).
- C9-13 (S4, lacunas do gate por valor na linha seguinte) e C9-15 (S4, título no 404): inalterados; não retestados porque o diff não toca esses arquivos.

## 8. Achados

| ID | Sev. | Rótulo | Estado |
|---|---|---|---|
| C9-11 | S3 | VERIFIED | **Fechado** em `9e16e18` (5,70:1; hover ≈ 7,1:1) |
| C9-12 | S3 | VERIFIED | **Reduzido; resíduo de 2 elementos** (`.success-panel strong` 1,46:1, `.error-panel strong` 1,82:1). Aceito pelo Orquestrador até os Lotes 10–12 |
| C9-1 | S2 | VERIFIED | Segue fechado; 0 regressão |
| C9-13 | S4 | VERIFIED | Aberto, aceito (não retestado) |
| C9-14 | S4 | HYPOTHESIS | Aberto, aceito; as regras novas herdam a dependência de `:has()` |
| C9-15 | S4 | VERIFIED | Aberto, aceito (não retestado) |

## 9. Ferramentas

Em `ferramentas/lote9r3/`: `seq11.sh` e `seq11.out` (gates em sequência, `b127288` e `9e16e18`), `audit10.js`, `zoo10.js`, `dsz10.js` (medição de contraste e marcação das 3 telas e 7 amostras), `diff10.js` (diferencial de estilo computado com remoção das 3 regras em memória). Tudo fora do repositório.
