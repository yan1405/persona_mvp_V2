# Lote 8 — componentes do Design System em TSX

Fonte única: `docs/redesign/design-system/` (Claude Design). Código em `apps/web/components/ds/` (barril `index.ts`), estilos em `apps/web/app/ds.css` (classes `dx-*`, só tokens `--ds-*`), galeria em `/dev/ds` (404 em produção). Nenhuma tela existente usa estes componentes ainda; o legado só sai no fim da reconstrução.

## Mapa DS → TSX

| Componente do DS (`components/**`) | Arquivo TSX | Observação |
|---|---|---|
| core/Icon | `icon.tsx` | 72 glifos Lucide embutidos (sem dependência npm); cor herdada |
| core/Button | `button.tsx` (`Button`, `ButtonLink`) | 4 níveis; `ButtonLink` é novo (navegação do Next) |
| core/IconButton | `icon-button.tsx` (`IconButton`, `IconLink`) | `label` obrigatório; `IconLink` novo |
| core/Badge | `badge.tsx` (`Badge`, `Count`, `STATUSES`) | variante `count` virou `Count` |
| core/Chip | `chip.tsx` | vira `<button aria-pressed>` com `onClick` |
| core/Avatar | `avatar.tsx` | |
| forms/Input | `input.tsx` | rótulo, dica, erro com `role="alert"` |
| forms/Switch | `switch.tsx` | `role="switch"`, área de toque de 44 px |
| surfaces/Card | `card.tsx` | sem `onClick` (ação = botão/link dentro) |
| surfaces/FocalCard | `focal-card.tsx` | um por tela |
| surfaces/DestinationGrid, DestinationTile | `destination.tsx` | grade por container query; tile vira `<a>` com `href` |
| surfaces/JourneyStepper | `journey-stepper.tsx` | `aria-current="step"`; sem `onSelect` (não tinha teclado) |
| surfaces/FocalJourney | `focal-journey.tsx` | |
| surfaces/ProgressBar | `progress-bar.tsx` | `role="progressbar"` |
| surfaces/ScoreRing | `score-ring.tsx` | gradiente por token; animação CSS |
| trace/TraceLine | `trace-line.tsx` | horizontal/vertical por container query |
| score/DimensionRow | `dimension-row.tsx` | |
| navigation/NavItem | `nav-item.tsx` | `<Link>` ou botão; contador vira ponto no trilho |
| navigation/Sidebar | `sidebar.tsx` | 5 destinos + Configurações; expandida e trilho |
| navigation/AppHeader | `app-header.tsx` | só "Buscar ou perguntar"; sem botão do Agente |
| shell/AppShell | `app-shell.tsx` | container query; gaveta `<dialog>` abaixo de 40 rem |
| overlay/FloatingPanel | `floating-panel.tsx` | `<dialog>` modal: um por vez, foco preso, Esc fecha |
| overlay/SectionIndex | `section-index.tsx` | |
| flow/StepFlow | `step-flow.tsx` | "Etapa N de M" |
| evidence/EvidenceCard | `evidence-card.tsx` | grade, sugestão, selecionável |
| entries/EntryCard | `entry-card.tsx` | |
| artifacts/ArtifactCard | `artifact-card.tsx` | |
| (novo) logo | `logo.tsx` | lockup horizontal e marca, geometria do DS, sem metadados |

## Fora do lote, e por quê

- **agent/AgentPanel, agent/AgentPrompt, chat/Composer, chat/MessageBubble:** o Agente Persona não existe no produto; sem botão nem painel.
- **entries/CaptureEditor, live/ArgumentPanel, live/DraftPanel:** dependem de dados, regras e telas dos Lotes 10 a 12 (portá-los agora seria inventar comportamento).
- **forms/PillTabs:** ligado ao legado (abas em pílula das telas atuais); entra com a tela que o usar.
- **FloatingPanel `contained`:** a variante "contida" existia para prévias; o `<dialog>` modal vai para a camada superior e não precisa dela.

## Desvios documentados

- Anel de foco usa `--ds-focus-ring` (indigo-600) e a borda de campo `--ds-n-400`, por contraste WCAG 2.2 (1.4.11), como na Fundação.
- Alvos: botões de ícone e chips clicáveis mantêm as alturas do DS (≥ 32 px) com ponteiro fino e sobem para 44 px com ponteiro grosso (`pointer: coarse`); o switch ganha área de 44 px por pseudo-elemento; a caixa de seleção do cartão selecionável tem 24 px e o cartão inteiro é o alvo.
- Pontos de quebra de container query em `rem` (sem px literal): 40 rem (gaveta), 68,75 rem (trilho), 56,25 rem (grade de destinos 4 colunas), 62,5 rem (FocalJourney em 2 colunas), 6,5 rem por passo (TraceLine).

## Aderência (DS-6)

- TSX: bloco novo em `apps/web/eslint.config.mjs` só para `components/ds/**` (erro para hex, px literal e `font-family` fora de Inter / Plus Jakarta Sans); repete a barreira do núcleo do LLM, que não muda para o resto do código.
- CSS: `components/ds/ds-adherence.test.ts` (hex, px fora de declaração de token, `font-family` só por `var(--ds-font-*)`) sobre `app/ds.css` e a galeria. **Não está na lista do script `test` do `package.json`** (fora da escrita do papel): o Orquestrador precisa acrescentar `components/ds/ds-adherence.test.ts` e `app/dev/ds/gate.test.ts`.
