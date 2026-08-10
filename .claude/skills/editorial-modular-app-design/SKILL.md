---
name: editorial-modular-app-design
description: Design, implement, refactor, or audit mobile-first applications using editorial minimalism, modular and block-based interfaces, content-first hierarchy, neutral surfaces, restrained accent colors, progressive disclosure, contextual editing, and polished native interactions. Use for iOS, Android, React Native, Flutter, SwiftUI, Jetpack Compose, PWA, responsive web apps, productivity apps, knowledge tools, dashboards, admin apps, and design systems. Also use when the user requests a Notion-inspired interface without copying Notion.
when_to_use: Use when creating app screens, user flows, navigation, design tokens, component libraries, block editors, data views, responsive layouts, accessibility reviews, visual refactors, prototypes, or production UI code in this design language.
argument-hint: "[task, screen, feature, audit, or app brief]"
---

# Editorial Modular App Design

Apply this skill to create production-ready APP interfaces whose visual language combines editorial minimalism, modular composition, content-first hierarchy, soft flat surfaces, progressive disclosure, and direct manipulation.

Treat `$ARGUMENTS` as additional task context when present.

## Mission

Create an original application experience, not a replica of Notion or another product. Reuse design principles, never proprietary identity, exact layouts, exclusive illustrations, logos, copy, or distinctive branded assets.

Prioritize, in this order:

1. User task completion.
2. Information clarity.
3. Accessibility and platform conventions.
4. Consistency and maintainability.
5. Visual refinement.
6. Delight that does not obstruct work.

## Operating modes

Classify the request before acting:

- **Create:** build a new app, feature, screen, flow, prototype, or design system.
- **Implement:** convert requirements, screenshots, wireframes, or design files into working code.
- **Refactor:** improve an existing interface while preserving behavior and product identity.
- **Audit:** inspect usability, accessibility, responsiveness, consistency, or visual quality.
- **Systematize:** extract tokens, components, patterns, and documentation from an existing app.

When the user asks for implementation, edit the project and deliver working code rather than only describing it. When the user asks for design-only work, deliver specifications detailed enough for implementation.

## First actions

1. Inspect the repository, current screens, package manifest, existing design system, navigation, assets, tests, and platform configuration.
2. Infer the platform and stack from the codebase. Do not ask the user for information already present in files.
3. Identify the core user, primary job, primary action, data entities, navigation model, and required states.
4. Preserve existing conventions unless they conflict with accessibility, the explicit brief, or maintainability.
5. Ask only questions that block a correct implementation. For low-risk ambiguity, state a reasonable assumption and continue.
6. Before broad changes, create a compact implementation plan and a UI contract.

## UI contract

Define or infer the following before implementation:

- Product purpose and target user.
- Platform: iOS, Android, cross-platform mobile, tablet, responsive web app, desktop app, or hybrid.
- Primary tasks and success conditions.
- Navigation model and screen hierarchy.
- Core entities and content density.
- Brand constraints and accent family.
- Typography and localization requirements.
- Required component and page states.
- Accessibility target.
- Offline, loading, permission, authentication, and error behavior.
- Technical stack, available libraries, and test commands.

Use `templates/app-brief.md` when the project lacks a clear product brief.

## Design invariants

The following rules define the style and remain active throughout the task:

### Content first

- Make content visually dominant and interface chrome quiet.
- Use hierarchy, spacing, alignment, and typography before borders, shadows, or color.
- Keep the most important action visible and the rest contextual.
- Avoid decorative elements without a functional or narrative purpose.

### Editorial hierarchy

- Structure screens like readable documents: clear title, supporting metadata, sections, labels, and predictable rhythm.
- Use short line lengths for reading-heavy content and denser layouts only for scanning-heavy data.
- Prefer sentence case. Avoid excessive capitalization and oversized display type in operational screens.

### Modular composition

- Build screens from reusable primitives and semantic modules.
- Treat sections, rows, cards, blocks, properties, lists, tables, and editor nodes as composable units.
- Avoid one-off styling when an existing token or component can express the same intent.

### Quiet surfaces

- Use neutral backgrounds, subtle tonal separation, thin borders, and restrained shadows.
- Use one accent family by default. Add semantic colors only for status, warning, success, danger, or data meaning.
- Reserve elevation for floating elements, transient menus, sheets, dialogs, and dragged items.
- Avoid card-inside-card nesting, heavy gradients, glass effects, and oversized shadows unless the product brief explicitly requires them.

### Progressive disclosure

- Keep common actions visible and reveal secondary actions on focus, hover, selection, swipe, long press, overflow menus, or expanded details.
- Never hide critical actions behind hover on touch devices.
- Do not overload the first screen with every possible control.

### Direct manipulation

- Prefer inline editing, immediate feedback, drag-and-drop where appropriate, contextual toolbars, and autosave.
- Provide non-drag alternatives for accessibility and precision.
- Make destructive actions reversible when possible through undo, Trash, or confirmation.

### Originality

- Do not reproduce another app screen pixel for pixel.
- Change structure, spacing, component treatment, iconography, and brand expression enough to create an independent visual identity.
- Use the project’s own content, copy, symbols, and domain language.

## Reference-loading policy

Read only the supporting files required by the task. Do not load every reference automatically.

- Read `references/01-design-language.md` for visual direction and style boundaries.
- Read `references/02-design-tokens.md` when defining or modifying tokens, themes, typography, spacing, radii, borders, shadows, or motion.
- Read `references/03-layout-responsive.md` for grids, safe areas, breakpoints, foldables, tablets, landscape, and adaptive layouts.
- Read `references/04-navigation-information-architecture.md` for app structure, routes, tabs, drawers, breadcrumbs, command palettes, and deep linking.
- Read `references/05-components-patterns.md` when building a component library or screen UI.
- Read `references/06-block-editor-data-views.md` for document editors, blocks, databases, lists, tables, Kanban, calendars, timelines, and filters.
- Read `references/07-states-feedback-motion.md` for state machines, loading, errors, empty states, autosave, gestures, transitions, and motion.
- Read `references/08-accessibility-inclusion.md` for accessibility, keyboard, screen readers, contrast, dynamic type, localization, and reduced motion.
- Read `references/09-platform-guidelines.md` for iOS, Android, React Native, Flutter, web app, PWA, tablet, or desktop-specific behavior.
- Read `references/10-code-architecture.md` for implementation architecture and stack-specific guidance.
- Read `references/11-quality-assurance.md` before final validation or when auditing an existing app.
- Read `references/12-deliverables.md` when producing design documentation, specifications, or handoff.
- Read `references/13-content-ux-writing.md` when writing labels, messages, empty states, onboarding, errors, or permissions.
- Read `references/14-performance-security.md` for performance, privacy, secure UI, sensitive data, and offline behavior.
- Read `references/15-reference-sources.md` when standards or platform guidance must be verified.
- Read `references/16-visual-validation.md` when screenshots, visual comparison, or image-based QA is available.

## Implementation workflow

### 1. Discover

- Inspect current routes, screens, components, styles, tokens, assets, and dependencies.
- Search for duplicated colors, spacing, typography, and components.
- Identify the most important user flow and its failure points.
- Check whether the app already supports dark mode, localization, reduced motion, keyboard navigation, and responsive layouts.

### 2. Model

Create a compact map of:

- Screens and routes.
- Navigation relationships.
- Primary and secondary actions.
- Data entities and their states.
- Reusable components.
- Loading, empty, partial, error, offline, permission, and success states.

### 3. Establish foundations

- Reuse the current design system when possible.
- Otherwise create semantic design tokens before styling screens.
- Separate primitive tokens from semantic and component tokens.
- Define light and dark themes only when required or already supported.
- Use a neutral foundation with a configurable accent family; never hardcode a specific brand palette as a universal rule.

### 4. Build structure first

Implement in this sequence:

1. Navigation and screen shell.
2. Layout and responsive behavior.
3. Typography hierarchy.
4. Core components and content.
5. Interactive states.
6. Feedback and motion.
7. Accessibility semantics.
8. Visual polish.

Do not begin with decorative effects.

### 5. Implement complete states

Every screen or data-bound component must account for relevant states:

- Initial/loading.
- Skeleton or progressive loading.
- Populated.
- Empty.
- No results after search/filter.
- Partial data.
- Stale/offline.
- Error and retry.
- Permission denied.
- Disabled or unavailable.
- Saving/saved/save failed.
- Success/confirmation.

### 6. Verify behavior

- Run formatting, linting, type checking, tests, and build commands available in the repository.
- Launch the app when tooling permits.
- Exercise the primary flow, not only static compilation.
- Check small phone, large phone, tablet or expanded width, and at least one landscape or resizable state when relevant.
- Validate keyboard navigation and screen-reader labels where supported.
- Record commands, progress, failures, and final status. Never hide a failing validation.

### 7. Review visually

Check:

- Hierarchy is obvious within three seconds.
- The primary action is clear.
- Alignment and spacing follow tokens.
- Text does not clip at larger sizes.
- Interactive elements have all states.
- Content remains usable without color alone.
- Dense screens remain scannable.
- Empty and error screens guide the next action.
- The result feels original rather than copied.

## Coding rules

- Follow the existing framework and architecture unless the user explicitly requests migration.
- Prefer semantic, reusable components over large monolithic screen files.
- Keep business logic outside visual components when the stack permits.
- Use design tokens rather than raw repeated values.
- Prefer platform-native primitives for navigation, inputs, dialogs, accessibility, and gestures.
- Use the existing icon library. Do not mix unrelated icon styles.
- Do not use emoji as functional icons unless the product language explicitly uses emoji.
- Use real, domain-relevant copy rather than Lorem ipsum.
- Avoid arbitrary dependencies. Add a dependency only when it meaningfully reduces complexity or improves correctness.
- Preserve public APIs and behavior during refactors unless change is requested.
- Do not remove existing accessibility attributes, tests, analytics, localization, or error handling without replacement.
- Keep animations interruptible and respect reduced-motion preferences.
- Never expose secrets, personal data, tokens, or internal identifiers in UI, logs, fixtures, screenshots, or generated examples.

## Visual defaults

Use these defaults only when the project has no established system:

- Neutral or slightly warm background.
- White or near-white primary surface in light mode.
- Near-black primary text rather than absolute black when suitable.
- One restrained accent family with semantic status colors.
- Moderate corner radii, not uniformly pill-shaped controls.
- Thin borders and tonal surfaces before shadows.
- Outline icons with consistent optical size and stroke.
- A 4-unit spacing foundation with an 8-unit primary rhythm.
- Compact but comfortable content density.
- Short, subtle motion with ease-out behavior.

Consult `references/02-design-tokens.md` for ranges and token structure.

## Navigation defaults

Choose navigation from task structure, not fashion:

- Use bottom navigation for a small number of equally important top-level mobile destinations.
- Use a navigation rail or sidebar when width permits and destinations are numerous.
- Use a stack for drill-down flows.
- Use tabs for sibling views within the same context.
- Use sheets for focused, temporary tasks.
- Use dialogs only for brief decisions that must interrupt the flow.
- Preserve back behavior, deep links, and state restoration.

## Component expectations

Prefer a small, coherent library containing:

- App shell and safe-area container.
- Top app bar, bottom navigation, rail, sidebar, tabs, breadcrumbs.
- Buttons, icon buttons, segmented controls, chips, toggles.
- Inputs, search, combobox, select, date/time controls, upload.
- Lists, rows, cards, properties, metadata, avatars, badges.
- Dialogs, sheets, popovers, menus, tooltips, toasts.
- Skeletons, progress, empty states, banners, inline validation.
- Tables, boards, calendars, timelines, filters, sorting, pagination.
- Editor blocks and contextual block controls when applicable.

Components must expose semantic variants and states rather than arbitrary style props.

## Accessibility baseline

- Target WCAG 2.2 AA for web surfaces and equivalent platform accessibility expectations for native apps.
- Provide visible focus and logical focus order.
- Give every icon-only control an accessible name.
- Support text resizing and avoid fixed-height text containers.
- Keep touch targets comfortably operable; follow platform minimums.
- Do not rely on color, position, motion, sound, or gesture alone.
- Provide alternatives to drag, swipe, long press, and hover-only actions.
- Respect reduced motion, high contrast, screen readers, and keyboard or switch input where applicable.

## Output behavior

When delivering implementation work, report:

1. What was built or changed.
2. Key design decisions and assumptions.
3. Files created or modified.
4. Commands and validations executed.
5. Results, including failures or limitations.
6. Remaining risks or recommended next action, only when material.

When delivering a design specification, use `templates/screen-spec.md`, `templates/component-spec.md`, and `templates/handoff.md` as appropriate.

## Definition of done

A task is complete only when the relevant criteria hold:

- The primary user flow is implemented or fully specified.
- The interface follows the editorial-modular design invariants.
- Components use tokens and remain reusable.
- Responsive or adaptive behavior is defined and tested.
- Relevant loading, empty, error, offline, permission, saving, and success states exist.
- Accessibility semantics and alternative interactions are present.
- Visual hierarchy, spacing, and alignment are consistent.
- The implementation builds and passes the available quality checks, or failures are clearly reported.
- The result is original and does not copy another product’s protected identity.

Use `references/11-quality-assurance.md` and `templates/qa-checklist.md` for the final gate.
