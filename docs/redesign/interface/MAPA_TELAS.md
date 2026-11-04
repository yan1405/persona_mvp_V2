# Mapa de migração — telas T4.1–T4.8 → app real

Contrato de migração, **sem código de produto**. Lote 1, papel Interface, 04/11/2026. Base: `8da08c6` (`baseline/2026-11-03`).

**Fontes.** Protótipo: `docs/design/approved/2026-11-03-t4/fonte/` (somente leitura). Cada afirmação cita arquivo e os 12 primeiros caracteres do SHA-256 de `MANIFEST.json` (`sha:`). App real: `apps/web/app/**`. Comportamento real vence o protótipo (`AGENTS.md` §3); o protótipo é especificação visual, não prova de backend nem de acessibilidade.

**Método.** Rotas, componentes e actions conferidos com `Glob`/`Grep`/leitura (seção 7). Estados do protótipo vêm dos mapas de cenários nos `.jsx` (`SCENARIOS`, `ESC`, `STATES`, `SC`, `ASC`, `N_SCN`, `C_SC`) e do seletor do HTML de T4.8. Nenhum screenshot foi reaberto neste lote.

**Fontes tipográficas.** Os `.woff2` (Inter e Plus Jakarta Sans, `fonts/*.woff2` no `MANIFEST.json`) foram excluídos do pacote Git, mas existem nas cópias oficiais locais indicadas por `MANIFEST.json` → `fonte.copias_locais` (`claude/exports/2026-11-03-oficial/`, fora do Git). Não é preciso buscá-los na internet. Incluí-los no produto continua dependendo de decisão de Yan e da conferência da licença.

## 1. Achados que mudam o desenho da migração

1. **O app real não tem biblioteca de componentes.** Não existe `apps/web/components/`. A UI são páginas (`page.tsx`) com marcação inline, formulários por rota (`*-forms.tsx`) e ~3.000 linhas de classes em `apps/web/app/globals.css`. Todo componente proposto abaixo é **novo**; "reutilizar" vale para páginas, formulários e actions. A casca é `app/app/layout.tsx` + `app/app/app-navigation.tsx`.
2. **T4.6 e T4.8 não são páginas.** `T4.6 - Narrative Score.html` carrega `inicio-screen.jsx` + `score-panel.jsx`: o Score é um **painel flutuante sobre o Início** (sha: `bbfd35a05074`). T4.8 é uma **superfície transversal** (conversa central no Início; `AgentPanel` acoplado em Evidências e Persona Live), não uma rota. O app tem `/app/score` com abas, fora da navegação.
3. **T4.7 junta o que o app separa.** O protótipo é uma tela com índice de seções (`cfg-dados`, `cfg-conta`…); o app tem layout + 3 rotas.
4. **T4.5 tem criação em 6 passos** (`c1`–`c6`); o app resolve em um formulário (`NewArtifactForm`).
5. **Dados de T4 são sintéticos** ("Dados sintéticos para demonstração", `configuracoes-screen.jsx`, `agente-core.jsx`). Nenhum entra no produto.
6. **Nomes divergem.** O protótipo usa o tipo `curriculo`; o app usa `resume` (`lib/artifacts/artifact.ts`, `artifactTypeLabel`: `star`, `pitch`, `resume`, `portfolio`).

## 2. Mapa por tela

Caminhos relativos a `apps/web/app/` salvo indicação. Componentes do DS: `fonte/design-system/components/` (hashes na seção 5).

### T4.1 — Início
- **Protótipo:** `T4.1 - Início.html` (sha: `8cb04c55ea6b`), `t4/inicio-screen.jsx` (sha: `4ec6cb698888`).
- **Rota real:** existe, `app/inicio/page.tsx` (server component; lê `daily_logs` e `getNarrativeScoreData`).
- **Componentes:** `AppShell`, `DestinationGrid`/`DestinationTile`, `FocalJourney`, `Card`, `ScoreRing`, `TraceLine`, `Badge`, `Chip`, `Button`, `AgentPrompt`, `AgentPanel` → TSX **novos**: `AppShell` (substitui o markup de `app/app/layout.tsx`), `DestinationTile`, `FocalJourney`, `ScoreRing`, `TraceLine`, `Badge`, `Button`. `AgentPrompt`/`AgentPanel` ficam em T4.8.
- **Estados** (`STATES`): `completo`, `vazio`, `calculando`, `falha`.
- **Lacunas:** o real só tem `?notice=diagnostic-completed` e o estado sem-Score; faltam `calculando` e `falha` no Início (o Score é calculado na action de `/app/score`). Credibilidade é "Indisponível nesta fase" no real; conferir o protótipo. A atividade recente do protótipo (`ACT_*`) mistura registros e evidências; o real lista 4 registros e competências recorrentes.
- **Compartilhados:** `app/app/layout.tsx`, `app/app/app-navigation.tsx`, `app/globals.css`.

### T4.2 — Diário
- **Protótipo:** `T4.2 - Diário.html` (sha: `dc9b6a74580f`), `t4/diario-screen.jsx` (sha: `59b9f01ffa17`), `t4/diario-panel.jsx` (sha: `e3c7486dac4d`).
- **Rotas reais:** existem `app/diario/page.tsx` (captura + histórico) e `app/diario/[id]/page.tsx`; `app/diario/diary-forms.tsx` (`NewDailyLogForm`, `EditDailyLogForm`, `SuggestionReviewForm`, `PendingButton`); `app/diario/actions.ts`.
- **Componentes:** `CaptureEditor`, `EntryCard`, `Input`, `Chip`, `Badge`, `FloatingPanel` (painel do registro), `SectionIndex`, `TraceLine` → TSX **novos** para a casca; lógica de `NewDailyLogForm`/`SuggestionReviewForm` reaproveitada.
- **Estados** (`SCENARIOS`, 21): `editor-vazio`, `editor-preenchido`, `criando`, `salvar-falha`, `historico-vazio`, `historico`, `sem-resultado`, `carregando`, `erro-leitura`, `registro-criado`, `gerando`, `nenhuma-util`, `pendente`, `descartada`, `confirmada`, `falha-ia`, `manual`, `conflito`, `exclusao-bloqueada`, `exclusao-confirmar`, `exclusao-falha`.
- **Lacunas:** o real cobre vazio, erro de leitura, sem-resultado e falha de sugestão; **não tem `carregando`** (sem `loading.tsx`). `conflito` de edição e `exclusao-bloqueada` não foram localizados (não verificado a fundo). O real abre o registro em **página** (`/app/diario/[id]`); o protótipo, em **painel** (decisão 4.7).
- **Compartilhados:** `app/globals.css`; `lib/diary/validation.ts` (leitura).

### T4.3 — Evidências
- **Protótipo:** `T4.3 - Evidências.html` (sha: `4939b55522f9`), `t4/evidencias-screen.jsx` (sha: `e62b68e9c76a`), `t4/evidencias-panel.jsx` (sha: `7bfe726c8d70`).
- **Rotas reais:** existem `app/evidencias/page.tsx` e `app/evidencias/[id]/page.tsx`; `app/evidencias/evidence-forms.tsx` (`NewEvidenceForm`, `EditEvidenceForm`, `EvidenceLinkForm`); `app/evidencias/actions.ts` (inclui `restoreEvidence`, `archiveEvidence`, `removeEvidenceLink`).
- **Componentes:** `EvidenceCard`, `Chip` (filtros), `Input`, `Badge`, `FloatingPanel`, `SectionIndex`, `TraceLine` + painéis `NovaPanel`, `EvidenciaPanel`, `ErroPanel` → TSX **novos**; formulários reutilizados.
- **Estados** (`ESC`, 27): `vazia`, `completa`, `para-revisar`, `sem-resultado`, `busca`, `filtros`, `nova-vazia`, `nova-preenchida`, `salvando`, `falha-salvar`, `erro-leitura`, `erro-escrita`, `det-registrada`, `det-documentada`, `det-e2`, `det-e3`, `link-adicionando`, `link-removendo`, `link-removido`, `prova-ausente`, `uso-vazio`, `edicao-alterada`, `conflito`, `arquivada`, `restaurada`, `nao-encontrado`, `sem-permissao`.
- **Lacunas:** o real filtra por query string (`view=review`, `state`, `level`, `competency`, `q`, `from`, `to`); o protótipo exibe sugestões do Diário (`SUGS0`) junto da lista, enquanto no real elas vivem no Diário (`evidence_suggestions`). `nao-encontrado`/`sem-permissao` não têm página própria (`notFound()` genérico).
- **Compartilhados:** `app/globals.css`; `lib/evidence/validation.ts` (leitura).

### T4.4 — Persona Live
- **Protótipo:** `T4.4 - Persona Live.html` (sha: `11da9db39823`), `t4/live-screen.jsx` (sha: `aa32152a0a1e`).
- **Rotas reais:** existem `app/live/page.tsx` (índice + nova sessão) e `app/live/[id]/page.tsx` (preparação e conversa); `app/live/live-forms.tsx` (`NewLiveSessionForm`, `EvidenceSelectionForm`, `LiveQuestionForm`, `CopyDraftButton`, `ConfirmCloseButton`); `app/live/actions.ts`; `lib/live/*`.
- **Componentes:** `EvidenceCard`, `EntryCard`, `ArgumentPanel`, `DraftPanel`, `Input`, `Chip`, `Badge` → TSX **novos**; `ArgumentPanel` e `DraftPanel` mantêm argumentos e rascunho em áreas separadas (`AGENTS.md` §1.2); formulários reutilizados.
- **Estados** (`SC`, 21): `sem-sessoes`, `lista`, `sem-resultado`, `duplicando`, `prep-vazia`, `prep-validacao`, `prep-zero`, `prep-selecao`, `criando`, `pronta`, `ativa`, `processando`, `resposta`, `lacuna`, `lacuna-enviada`, `falha-ia`, `pausada`, `retomada`, `encerrada`, `salvando`, `falha-salvar`.
- **Lacunas:** `ConfirmCloseButton` usa `window.confirm`; o protótipo tem confirmação própria. O real já modela `live_sessions.status` (`preparing/active/paused/closed`) e `live_questions.status` (`processing/answered/gap/failed`), que cobrem a maior parte dos cenários. Só modo Manual. **Inferência real do provedor NVIDIA não está comprovada** (`AGENTS.md` §5).
- **Compartilhados:** `app/globals.css`; `app/app/artefatos/actions.ts` (`saveLiveAsArtifact`, importado por `live/[id]/page.tsx`).

### T4.5 — Artefatos
- **Protótipo:** `T4.5 - Artefatos.html` (sha: `5c0d6f622420`), `t4/artefatos-screen.jsx` (sha: `d80e2b898b3a`), `artefatos-create.jsx` (sha: `b7fdd796e5b2`), `artefatos-detail.jsx` (sha: `a2d0e69f1de9`), `artefatos-data.jsx` (sha: `80a3c2af9f6d`).
- **Rotas reais:** existem `app/artefatos/page.tsx`, `app/artefatos/novo/page.tsx`, `app/artefatos/[id]/page.tsx` (abas `content|evidences|versions`); `app/artefatos/artifact-forms.tsx` (`NewArtifactForm`, `ArtifactEditor`); `app/artefatos/actions.ts`; `lib/artifacts/*`; `lib/groq/generate-artifact.ts`.
- **Componentes:** `ArtifactCard`, `Chip`, `Input`, `Badge`, `StepFlow`/`JourneyStepper`, `FloatingPanel`, `SectionIndex`, `TraceLine`, `EvidenceCard` → TSX **novos**; lógica de `ArtifactEditor` reaproveitada.
- **Estados** (`ASC`, 36): biblioteca (6) `lib-lista`, `lib-vazia`, `lib-carregando`, `lib-erro`, `lib-filtros`, `lib-sem-resultado`; criação (13) `c1`, `c1-agente`, `c2`, `c2-validacao`, `c3`, `c4`, `c5`, `c5-sem`, `c6`, `c6-gerando`, `c6-timeout`, `c6-provedor`, `c6-lacuna`; primeira abertura (1) `c-primeira`; detalhe (16) `d-star`, `d-pitch`, `d-curriculo`, `d-curriculo-previa`, `d-portfolio`, `d-salvando`, `d-salvo`, `d-nao-salvo`, `d-conflito`, `d-gerando`, `d-falha`, `d-restaurar`, `d-restaurando`, `d-exportando`, `d-falha-export`, `d-fonte`.
- **Lacunas:** o real cria em **uma página**, não em 6 passos; tem `notices` de lacuna e timeout que casam com `c6-*`; restaura versão (`restoreArtifactVersion`). **Exportação de Artefato não foi encontrada**: `app/api/export/route.ts` exporta dados da conta (usado em Configurações), não Artefato → `d-exportando`/`d-falha-export` **não têm backend**. `d-conflito` depende de `revision` (existe no schema lido). `c1-agente` depende do Agente (decisão 4.3).
- **Compartilhados:** `app/globals.css`; `lib/artifacts/artifact.ts` (leitura).

### T4.6 — Narrative Score
- **Protótipo:** `T4.6 - Narrative Score.html` (sha: `bbfd35a05074`), `t4/score-panel.jsx` (sha: `ddf1df30dccd`) sobre `inicio-screen.jsx`; `T4.6 - manifest.json` (sha: `b9ff3192c81c`). O HTML do pacote difere do `_tmp_oficial_pos` anterior (`MANIFEST.json` → `normalizacao_html.excecao`).
- **Rota real:** existe `app/score/page.tsx` (abas Resumo / Histórico / Como é calculado) + `app/score/actions.ts` (`updateCoherence`). **Fora da navegação principal.** O diagnóstico (`app/diagnostico/page.tsx`, `diagnostic-form.tsx`, `actions.ts`) também alimenta o Score e **não tem tela em T4**.
- **Componentes:** `ScoreRing`, `DimensionRow`, `ProgressBar`, `TraceLine`, `Badge`, `FloatingPanel`, `SectionIndex` → TSX **novos**.
- **Estados** (`N_SCN`): `snapshot`, `elegivel`, `nao-elegivel`, `calculando`, `concluido`, `falha-coerencia`, `agente-off`, `dados-insuficientes`, `historico-vazio`.
- **Lacunas:** painel (T4) contra página (real) — decisão 4.5. `falha-coerencia` casa com os `notice` de provedor (`not_configured`, `timeout`, `rate_limit`, `invalid_output`, `provider_error`). `agente-off` pressupõe o Agente. Credibilidade fica fora da nota no real (60% coerência + 40% consistência); conferir que o protótipo não a soma.
- **Compartilhados:** `app/globals.css`; `lib/score/*` (leitura).

### T4.7 — Configurações
- **Protótipo:** `T4.7 - Configurações.html` (sha: `0576701c7f1b`), `t4/configuracoes-screen.jsx` (sha: `a95d01f6f91b`), `T4.7 - manifest.json` (sha: `beb582d57a38`).
- **Rotas reais:** existem `app/configuracoes/layout.tsx`, `page.tsx` (Perfil), `dados/page.tsx`, `conta/page.tsx`; `profile-form.tsx` (`SettingsProfileForm`), `dados/data-form.tsx` (`SettingsDataForm`), `settings-navigation.tsx`; `lib/settings/actions.ts`; `app/api/export/route.ts`.
- **Componentes:** `Sidebar`, `Input`, `Switch`, `Badge`, `Button`, `SectionIndex`, `FloatingPanel`, `Avatar`, `IconButton`, `CfgAlert`, `CfgSkeleton` → TSX **novos** para `Switch`, `Avatar`, alerta e skeleton; formulários e actions reutilizados.
- **Estados** (`C_SC`, 24): `carregando`, `limpo`, `alterado`, `validacao`, `salvando`, `salvo`, `falha-salvar`, `inventario`, `exportando`, `export-pronto`, `export-falha`, `excl-aviso`, `reauth-solicitada`, `reauth-valida`, `reauth-expirada`, `excl-incorreta`, `excl-correta`, `excl-processando`, `excl-concluida`, `excl-falha`, `ms-disponivel`, `sessao-expirada`, `saindo`, `sair-falha`.
- **Lacunas:** o real já tem reautenticação (`/auth/iniciar?reauth=delete_account`, `?notice=reauthenticated|reauth_failed`) e a confirmação por texto `EXCLUIR`; a contagem regressiva de `secs` e o inventário com contagens por tabela do protótipo **não foram encontrados** no real. A migração e o teste RLS da Fase 9 estão **pendentes no Supabase real** (`AGENTS.md`, cabeçalho): a tela de dados não é provada ponta a ponta.
- **Compartilhados:** `app/globals.css`; `app/app/app-navigation.tsx` (ícone de Configurações).

### T4.8 — Agente Persona
- **Protótipo:** `T4.8 - Agente Persona.html` (sha: `260d5cb3af47`), `t4/agente-core.jsx` (sha: `3416fbab0dee`), `t4/agente-surfaces.jsx` (sha: `821f9220e02e`), reutilizando `inicio-screen`, `live-screen`, `evidencias-*`.
- **Rota real:** **ausente.** Nenhum código de produto em `apps/web/app` ou `apps/web/lib` trata o Agente. Superfícies do protótipo (seletor do HTML): `inicio` (conversa central), `evidencias` (painel), `live` (painel).
- **Componentes:** `AgentPanel`, `AgentPrompt`, `Composer`, `MessageBubble`, `CitationChip`, `AgReply`, `GapNotice`, `FailNotice`, `Handoff` → TSX **novos** (somente casca).
- **Estados** (`GROUPS` em `T4.8 - Agente Persona.html`: 19 cenários de conversa, respostas e falhas, mais `recolhido` do grupo Painel, exibido só quando o painel está acoplado = 20): Conversa (6) `vazio`, `digitando`, `respondendo`, `parcial`, `completa`, `acao-proposta`; Respostas (5) `entrevista`, `material`, `organizar`, `lacuna`, `sem-citacao`; Falhas (8) `schema-invalido`, `citacao-invalida`, `citacao-alheia`, `acao-proibida`, `timeout`, `rate-limit`, `provedor`, `indisponivel`; Painel (1) `recolhido`. Textos fixos: lacuna "Ainda não há registro sobre isso."; falha "Não consegui responder agora. Nada foi alterado.". Origem de outra conta nunca é citável (`AG_FOREIGN`).
- **Lacunas:** sem backend ou integração no app; a visão de produto do Agente está aprovada pela LD-026, e o contrato técnico inicial pertence ao Lote 1 · 03 (`lib/agent/**`). Ações propostas só `abrir`, `pre-preencher`, `revisar` (`AG_VERBS`).
- **Compartilhados:** Início, Evidências e Live (acoplar o painel); `app/globals.css`.

## 3. Arquivos compartilhados e dono sugerido

Nenhum deles é tocado neste lote. O Orquestrador designa **um dono único** por onda (`PROTOCOLO.md`).

| Arquivo | Por quê | Fatias |
|---|---|---|
| `apps/web/app/globals.css` (3.002 linhas) | todas as classes de tela | todas |
| `apps/web/app/layout.tsx` | fontes (hoje Geist via `next/font/local`) | decisão 4.1 |
| `apps/web/app/app/layout.tsx` | casca → `AppShell` do DS | todas |
| `apps/web/app/app/app-navigation.tsx` | trilho Carbon → `Sidebar` do DS | T4.1, T4.7, decisão 4.2 |
| `apps/web/package.json` + lockfile | só se as decisões 4.1/4.2 exigirem pacote | 4.1, 4.2 |
| `apps/web/app/app/artefatos/actions.ts` | também importado por Live | T4.4, T4.5 |

## 4. Decisões para Yan

1. **Fonte** — *bloqueia a Fundação.* O redesign usa Plus Jakarta Sans (display) + Inter (corpo) (`design-system/tokens/typography.css`, sha: `1675d2132707`; `tokens/fonts.css`, sha: `e0412a35f17d`). O produto usa Geist Sans/Mono (`AGENTS.md` §6, `app/layout.tsx`). Opções: (a) adotar as do redesign (usar os `.woff2` das cópias oficiais locais, conferir a licença, alterar `layout.tsx`/`globals.css`); (b) manter Geist e remapear os tokens. Recomendação: (a), porque a aprovação visual D-032 foi dada com elas, sujeita à licença.
2. **Ícones** — *bloqueia a Fundação.* O redesign usa Lucide (70+ SVG em `design-system/assets/icons/`); `AGENTS.md` §8 manda Carbon para navegação e ações de domínio, Lucide só para utilidades, sem misturar estilos no mesmo grupo; o app usa `@carbon/icons-react`. **Até decisão contrária de Yan, vale §8:** Carbon na navegação e nas ações de domínio, Lucide apenas em utilidades. Copiar os SVG do DS é só o *mecanismo de entrega* dos ícones Lucide que forem usados (sem dependência nova); não muda a regra. Decisão pendente: manter §8 ou revogá-la.
3. **Painel do Agente (T4.8) sem backend** — *bloqueia só T4.8, `c1-agente` (T4.5) e `agente-off` (T4.6).* Opções: (a) fora desta migração; (b) casca sem ação, sinalizada como indisponível; (c) esperar o contrato de `lib/agent/**`. Recomendação: (a) até haver inferência real comprovada. `c1-agente` (T4.5) e `agente-off` (T4.6) seguem a mesma decisão.
4. **Dados sintéticos de T4** — *regra para todas as fatias; não bloqueia sozinha.* Confirmar: nenhuma tela real usa os números e textos do protótipo; estados como "completo" só aparecem com dados reais do usuário.
5. **Score: painel ou página** — *bloqueia T4.1 e T4.6.* Manter `/app/score` com abas e usar o painel só como resumo no Início, ou substituir pela rota única? O Score entra na navegação?
6. **Diagnóstico e onboarding sem tela em T4** — *não bloqueia fatias de T4.* `/app/diagnostico` e `/onboarding` não têm desenho aprovado. Manter o visual atual ou incluir no próximo pacote?
7. **Painéis flutuantes (registro, evidência, Score)** — *bloqueia T4.2, T4.3 e T4.6.* O app abre em páginas `/[id]` (links diretos, SSR). Manter as rotas renderizando o painel, ou abrir mão do link direto?
8. **Exportação de Artefato** (`d-exportando`, `d-falha-export`) — *bloqueia só esses dois estados de T4.5.* Não há backend. Remover do escopo visual, ou pedir ao papel de Backend?
9. **Aceite visual** — *por fatia, antes de avançar.* A aprovação de T4 é visual; cada fatia ainda exige a Sessão de Avaliação Visual (`AGENTS.md` §6.1) e teste com leitor de tela.

## 5. Hashes dos componentes do DS citados (SHA-256, 12 caracteres)

`AgentPanel` 53983f15dba6 · `AgentPrompt` 8719b9386fdf · `ArtifactCard` 707ec66629cf · `Composer` b1db5819106f · `MessageBubble` 3f8209977ee5 · `Avatar` 7266227db257 · `Badge` f8c1fec27f87 · `Button` cfb659dab75e · `Chip` f184760bb422 · `Icon` 9aa116ca997a · `IconButton` 8ff48329d219 · `CaptureEditor` 3763d43006c5 · `EntryCard` 1f23a7f181f2 · `EvidenceCard` e20dae530e3a · `StepFlow` 2b7e464db211 · `Input` 3e3639c60bd7 · `PillTabs` 9c092cafbc84 · `Switch` 0e36ea7ef5c2 · `ArgumentPanel` 8b1a7162d3d5 · `DraftPanel` 7e45e1443273 · `AppHeader` 419f97802b17 · `NavItem` f081292c22e1 · `Sidebar` 33d997a18e6b · `FloatingPanel` 85593d5d36fe · `SectionIndex` 33b86097acf2 · `DimensionRow` 95615ac42209 · `AppShell` 31e6f1eeba44 · `Card` 58a64d935e5d · `DestinationGrid` ea54945ddef3 · `DestinationTile` 0220b1c06b10 · `FocalCard` e68550bfbd7d · `FocalJourney` 20ba8be53426 · `JourneyStepper` a11fdee75574 · `ProgressBar` 9b25c3b40555 · `ScoreRing` 701d73e5f758 · `TraceLine` 5899c27c2447.

Componentes com nome `Ag*`, `Cfg*`, `Citation*`, `Handoff`, `NovaPanel`, `EvidenciaPanel`, `ErroPanel`, `DiarioPanel` são locais das telas T4 (arquivos `t4/*.jsx` acima), não do DS.

## 6. Ordem sugerida de fatias

Uma fatia por atribuição; um dono de `globals.css` por onda (serializar). Decisões de fatias posteriores não bloqueiam as anteriores.

0. **Gates por fatia (não há gate global):** Fundação ← decisões 4.1 e 4.2; T4.1 ← 4.5; T4.2/T4.3 ← 4.7; T4.6 ← 4.5 e 4.7; T4.8 ← 4.3 e o contrato do backend. T4.4, T4.5 e T4.7 só dependem da Fundação (T4.5 sem exportação até a 4.8).
1. **Fundação:** tokens, fontes, `AppShell`, `Sidebar`, `Button`, `Badge`, `Input`, `Chip`, `Card`. Dono de `globals.css`, `layout.tsx`, `app-navigation.tsx`.
2. **T4.7 Configurações** — menor risco (3 rotas pequenas); ressalva da Fase 9 pendente.
3. **T4.1 Início** — leitura; destinos e Score; sem Agente.
4. **T4.2 Diário** — captura e histórico; depois painel de registro (decisão 4.7).
5. **T4.3 Evidências** — depende de `FloatingPanel` e `EvidenceCard`.
6. **T4.6 Score** — depende da decisão 4.5.
7. **T4.4 Persona Live** — depois de Evidências (`EvidenceCard`).
8. **T4.5 Artefatos** — a maior; depende de `StepFlow` e do dono de `artefatos/actions.ts`.
9. **T4.8 Agente** — só após a decisão 4.3 e o contrato do backend.

## 7. Validação

Rotas e componentes citados conferidos (resultado e comandos em `AGENTES/01_interface/STATUS.md`). Pontos marcados "não verificado" ou "não foi encontrado" são ausência na leitura feita, não prova de ausência no produto.
