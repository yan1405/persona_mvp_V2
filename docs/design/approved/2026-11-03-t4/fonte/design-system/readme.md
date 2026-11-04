# Persona Design System

Persona is a Brazilian **personal platform for professional narrative**. People log real experiences, Persona identifies what they demonstrate and organises a traceable professional memory. It is **not an academic product**, **not a CRM** and not a social network: it never answers for the person and never invents facts.

The **Agente Persona** — an AI agent that only uses the person's registered evidence and cites the source of every claim — is the **central direction of this prototype**. It is **not yet a proven, implemented feature** of the app (collaborative agent LD-026, approved but not built); screens never claim it already exists. Inside the Persona Live and Artefatos workspaces there is no open chat: the AI acts through named actions.

- **Proposition:** "Sua história profissional, organizada para trabalhar a seu favor."
- **Functional promise:** "Registre uma vez. Prove sempre."
- **Differentiation:** "O Persona não começa pela resposta. Começa pela evidência."

**The cycle:** **Diário** (free text) → AI suggestions → human confirmation → **Evidências** (Registrada, or Documentada with a proof link) → explainable **Narrative Score** → activation in **Persona Live** (real arguments + a suggested interview draft) and **Artefatos** (Resposta STAR, Pitch pessoal, Currículo ATS, Portfólio). The rule across the cycle: **the AI suggests, the person confirms**, and every generated text points to its source evidence.

This design system captures the **2026 redesign**: Persona's Indigo + Slate palette on a calm, action-first dashboard shell. The iStudio case study is a **structural and visual reference** only; none of its content is copied.

## Sources
- GitHub: **https://github.com/yan1405/persona_redign**
  - `docs/persona-fluxos-e-features.md` — **product** source of truth: flows, validated features, screens, honesty rules, sample data.
  - `docs/design-dna-persona.md` — **visual** source of truth: tokens, contrast table, component notes.
  - Explore the repository to go deeper.
- Structural and visual reference: iStudio — Student Career Dashboard case study (Behance, https://www.behance.net/gallery/257051775/Student-Career-Dashboard-UIUX-Design-Case-Study-2026). Slides in `uploads/istudio-*.png` — **third-party work, used for structure and visual language only; not copied into assets.**
- Logos: `uploads/persona-*.svg` → `assets/logos/`.

There is no product codebase or Figma; components are authored from the DNA's component notes and the product file's screen specs.

---

## Content fundamentals
- **Language:** Brazilian Portuguese. Second person, informal-professional: **"você"**, never "tu", never corporate "o usuário".
- **Tone:** human, encouraging, calm. *"Bom dia, Yan."* Motivating without being childish; no hype, no exclamation stacks.
- **Headlines end with a period.** *"Hoje, de relance."* · *"Tudo o que sustenta a sua história."* Short, declarative.
- **CTAs are direct imperatives:** "Salvar registro", "Revisar sugestões", "Confirmar evidência", "Adicionar link de prova", "Iniciar sessão", "Novo Artefato".
- **Casing:** sentence case everywhere (buttons, titles, nav). UPPERCASE only for numbered overlines: **01 INÍCIO**, **03 EVIDÊNCIAS**.
- **One live status line per destination:** "4 confirmadas · 2 para revisar", "Score 65 · base declarada", "1 sessão encerrada". Never a bare "0 ativos"; empty states always point to the next step ("Nenhuma evidência ainda. Comece pelo Diário.").
- **Gaps, not filler:** without enough facts, show the gap. *"Ainda não há evidência para sustentar esta resposta. Registre a situação no Diário."*
- **Errors** are calm and explanatory, never blaming: *"Não foi possível gerar sugestões agora — seu registro está salvo e você pode estruturar manualmente."*
- **A honestidade é parte da voz:** a IA sugere e você confirma. O Persona nunca inventa conquistas; todo texto gerado cita a evidência de origem e o que não tem prova aparece como Registrada.
- **Numbers:** tabular (`tnum`), Brazilian formats (10:15, 4 nov, 1.978, 72%).
- **Emoji:** not used. The ✓ / ↗ / ✦ glyphs appear only as Lucide icons or as a single overline ornament.

## Visual foundations
- **Colour:** monochromatic Indigo + violet-tinted Slate. Indigo `#7C3AED→#6D28D9` (gradient) is reserved for **the one CTA per screen**, the active journey step and the active nav icon. Ink `#1A1726` does text, solid buttons (one per card) and the person's bubbles in the Agente Persona. Paper `#F2F1F7` is the app background; cards are white. Hue varies only in **destination-tile pastels** and semantic states. Plum was removed (collides with Indigo).
- **Semantic** colours are always *dark ink on soft tint* (`#064E3B` on `#ECFDF5`, etc.) — white on green fails AA (2.54:1).
- **Type:** Plus Jakarta Sans 600–800 for display/headings with negative tracking (−0.03em display → −0.01em H3); Inter 400–700 for reading. Scale 40 · 28 · 22 · 18 · 15 · 14 · 13 · 12. No mono — numbers use Inter `tnum`. This pairing comes from the Behance reference and is **intentional**: it differs from the original app's type and must not be reverted to Geist.
- **Spacing:** 4px base (4 8 12 16 20 24 32 40 56 72). Shell gap 16, card padding 20–24, tile gap 12–16, section rhythm 40 desktop / 32 mobile.
- **Layout:** two-column app shell — a floating white sidebar (radius 22) + a main panel (radius 28, `#FAFAFC`) on the paper background with 16px of air. 12-column content, max 1280. Four destination tiles in a row (Diário, Evidências, Persona Live, Artefatos).
- **Corners:** everything is round — 16 (inputs and compact controls), 22 (cards, tiles), 28 (panels, focal, dialogs), pill (all buttons, chips, search). Small 10px only for index chips.
- **Structure:** lists are card grids of 2–3 columns, never tables. Details open in an anchored floating panel (560–640px, radius 28, Float shadow, one at a time); long details use stacked sections with an anchor index. No tabs. Artefatos use a full-page workspace. The Agente panel docks on the right (380–420px, collapsible).
- **Cards:** white, radius 22–28, **Soft** shadow, no border; neutral/outline states get 1px `#E4E2EE`. No coloured left-border accents.
- **Elevation:** Soft (cards) · Float (hover, popovers, dialogs) · Slab (focal/raised) · Brand glow under the CTA only. Shadows are diffuse and ink-tinted, never black.
- **Focal surface:** exactly one dark block per screen — `linear-gradient(135deg,#1A1726,#2E1A6B)` with a soft radial Indigo glow (35%) in the top-right. It holds the journey / "what do I do now?". Text on it: white + Indigo 300 (9.5:1).
- **Backgrounds:** flat. No textures, patterns, photos or full-bleed imagery in product. The orange/purple slide backgrounds and dot grids of the reference are presentation material — never product.
- **Imagery:** circular avatars only. The reference's 3D "clay" icons are explicitly rejected; use Lucide glyphs in soft circles or rounded squares.
- **Motion:** minimal, functional. Easing `cubic-bezier(0.16,1,0.3,1)`; 140ms micro (hover/press), 220ms normal (lift, toggle), 360ms macro (entrance, ring draw). Entrances fade + rise 8px with 40ms stagger. The active journey node pulses softly. `prefers-reduced-motion` disables all of it.
- **Hover:** tiles/cards lift 2px and swap Soft→Float; the ↗ arrow nudges 2px; buttons darken (ink→`#2E2A3D`) or get a stronger glow (brand); ghost rows tint `#F2F1F7`.
- **Press:** buttons scale to 0.98. No colour flash.
- **Focus (WCAG 2.2 AA, ≥ 3:1):** only on `:focus-visible`, never the browser default. Double ring from `components/core/focusRing.jsx`: light surfaces = inner 2px `#A78BFA` + outer 2px `#6D28D9`; dark/focal = inner `#6D28D9` + outer `#A78BFA`. Text fields: 2px `#6D28D9` edge + soft `#A78BFA` 35% halo.
- **Transparency/blur:** only translucent whites on the focal surface (10–16%) and the dialog scrim (ink 18%). No glassmorphism, no backdrop blur.
- **Borders/dividers:** 1px `#E4E2EE`, only on outline buttons, inputs, neutral cards and section dividers and separators inside cards or panels. Never use dividers to simulate tables, dense lists or threads.

## Iconography
- **Lucide**, outline, **stroke 1.75**, sizes 16 / 18 / 20 / 24. Specified by the DNA (`"preferred_set": "Lucide"`).
- 72 glyphs were copied programmatically from `lucide-static@0.460.0` into `assets/icons/*.svg` (stroke rewritten to 1.75) and embedded in the `Icon` component (`components/core/Icon.jsx`). Need another? Copy it from the same package; don't hand-draw.
- Icons sit bare in nav/buttons, or inside a soft white/pastel rounded square (destination tiles) or circle (avatars).
- No icon font, no PNG icons, no emoji, no unicode-as-icon (⌘K is the only literal glyph, as a key hint).
- **Logo:** an Indigo node-network mark. `persona-lockup-h.svg` (mark + wordmark) in the sidebar; `persona-logo-rica` (rich, light) / `-rica-dark` (on focal) for hero use; `persona-logo-compacta` for tight spaces; `persona-logo-mono` for single-colour contexts.

---

## Index
- `styles.css` — entry point (imports only) → `tokens/fonts.css`, `colors.css`, `typography.css`, `spacing.css`, `effects.css`
- `fonts/` — self-hosted Plus Jakarta Sans + Inter woff2 (latin, latin-ext)
- `assets/logos/` — 5 Persona logos · `assets/icons/` — Lucide SVGs
- `guidelines/` — foundation specimen cards (Colors, Type, Spacing, Brand)
- `components/` — React primitives (below), one `@dsCard` per folder
- `SKILL.md` — Agent-Skill entry · `github.md` — source sync record · `thumbnail.html`

### Components
- **core/** — `Icon`, `Button`, `IconButton`, `Badge`, `Chip`, `Avatar`
- **forms/** — `Input`, `Switch` · `PillTabs` — legado; não usar como navegação e remover na T6.2.
- **surfaces/** — `Card`, `FocalCard`, `DestinationTile`, `DestinationGrid` (4 colunas ≥ 900 px de container, senão 2 × 2), `FocalJourney` (“Do score declarado ao observado”, 2 colunas ≥ 1000 px), `JourneyStepper`, `ProgressBar`, `ScoreRing`
- **navigation/** — `NavItem` · `Sidebar` (5 destinos + Configurações no rodapé, expandida e rail) · `AppHeader` (Buscar ou perguntar + botão Agente)
- **evidence/** — `EvidenceCard` (variantes: card de grade, sugestão para revisar, selecionável)
- **entries/** — `EntryCard` (registro do Diário, sessão do Persona Live, versão de Artefato) · `CaptureEditor` (editor do Diário; não é chat)
- **agent/** — `AgentPrompt` (large · compact) · `AgentPanel` (painel acoplado, aberto e recolhido)
- **chat/** — `MessageBubble`, `Composer` — núcleo do Agente Persona; usados só por `AgentPanel` (e, futuramente, pela conversa central do Início)
- **score/** — `DimensionRow` (Credibilidade “Ainda não avaliada”, sem número)
- **flow/** — `StepFlow` (Etapa N de M, Voltar / Continuar)
- **live/** — `ArgumentPanel` (Argumentos reais, estado lacuna) · `DraftPanel` (Rascunho sugerido, duração-alvo e controles)
- **artifacts/** — `ArtifactCard`
- **trace/** — `TraceLine` (rastreabilidade, elemento-assinatura)
- **shell/** — `AppShell` (lateral + cabeçalho fixo opaco + AgentPanel acoplado que empurra o conteúdo, folha abaixo de 1024 px; FloatingPanel ancorado à esquerda do agente)
- **overlay/** — `FloatingPanel` (um por vez, prende o foco, Esc fecha) · `SectionIndex` (índice de âncoras, não é aba)

All derived from the DNA's `components` block (pill buttons in four tiers, pill search, 16px fields, destination tiles, focal journey card, stepper, list rows, ink message bubbles, verification chips, badges).

### Intentional additions
- `Icon` — wrapper for the copied Lucide set.
- `MessageBubble` agent variant and `Avatar variant="ai"` — núcleo do Agente Persona, eixo da plataforma (protótipo do agente colaborativo LD-026, ainda não implementado).
