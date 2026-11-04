---
name: persona-design
description: Use this skill to design interfaces and assets for Persona — a personal platform for professional narrative (Diário → evidências → Narrative Score → Persona Live e Artefatos). Contains the visual foundations (Indigo + Slate, Plus Jakarta Sans + Inter), tokens, fonts, logos, Lucide icons and React components for prototypes or production code.
user-invocable: true
---

Read `readme.md` first, then explore the tokens, components and assets. Product truth lives in https://github.com/yan1405/persona_redign — `docs/STATUS_REDENSIGN.md`, `docs/persona-fluxos-e-features.md` (product, flows, sample data) and `docs/design-dna-persona.md` (visual). When product and visual conflict, product wins.

## What Persona is
- A **personal platform for professional narrative**: the person logs real experiences, the AI suggests evidence, the person confirms, and that evidence feeds an explainable Narrative Score, the Persona Live (interview support) and the Artefatos (Resposta STAR, Pitch pessoal, Currículo ATS, Portfólio).
- Persona **não é produto acadêmico** e **não é CRM** — no sales funnels, prospect lists, contact tables or management grids.
- Navigation: Início, Diário, Evidências, Persona Live, Artefatos; Configurações in the footer. Do not create other destinations.

## The Agente Persona
- It is the **axis of the prototype direction**, but **not yet a proven, implemented feature** of the app. Never write screen copy claiming it already exists in production.
- **Conversation exists only in the Agente Persona** (central on Início, docked right panel 380–420 px elsewhere). It only uses registered evidence, cites the source of every claim and never saves anything without confirmation.
- **Persona Live and Artefatos have no open chat**: the AI acts through named actions (Encurtar, Aprofundar, Outra experiência, Adaptar ao objetivo, Gerar alternativa).

## Structure
- Lists are **card grids** (2–3 columns) — never tables or dense rows.
- Details open in an **anchored floating panel** (560–640 px, radius 28, Float shadow, one at a time); long details use **stacked sections** with an anchor index.
- **No tabs.** Views are chips; filters stay collapsed behind a "Filtros" button. Artefatos use a full-page workspace.
- One brand (Indigo gradient) button per screen, one dark focal block per screen, at most one Ink button per card.

## Visual
- **Indigo + Slate** only. No orange, emoji, 3D icons or mascot.
- **Plus Jakarta Sans + Inter** are an intentional choice taken from the Behance reference; do not revert to Geist.
- Xisto is out of this redesign — use **Lucide** icons (stroke 1.75) from `assets/icons/` or the `Icon` component.

## Voice and honesty
- Brazilian Portuguese, "você", sentence case, headlines end with a period, tabular numbers.
- The AI suggests, the person confirms. Never invent an achievement; every generated text points to its source evidence. Levels: Registrada, Documentada; "Para revisar" for suggestions. Without enough facts, show a gap, never generic text.
- Use only the sample data in section 10 of `persona-fluxos-e-features.md`.

## Out of scope
Pricing, paywall, cover letter, own sign-up/password (entry is only "Entrar com Microsoft"), file upload and audio.

## Legacy
`ui_kits/` currently holds an obsolete kit scheduled for removal. Do not copy, reuse or reference it; build screens from the components and the product doc.

If creating visual artifacts (mocks, throwaway prototypes), copy assets out and create static HTML files. For production code, copy assets and follow these rules. If invoked without guidance, ask what the user wants to build, ask a few questions, then act as an expert designer producing HTML artifacts or production code.
