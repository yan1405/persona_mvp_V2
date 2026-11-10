# Persona Design System — referência no repositório

Cópia de leitura do Design System feito no Claude Design (origem: pasta local `Persona Design System` e protótipos T4.1–T4.8 do projeto "T4.1 — Início do Persona", baixados em 04/11/2026). **É a fonte visual única do app** (decisão de Yan, 10/11/2026: exclusão total do design antigo; reconstrução sobre o DS).

- `readme.md`: fundamentos (conteúdo, visual, iconografia, índice de componentes). Leitura obrigatória.
- `tokens/`: cores, tipografia, espaçamento, efeitos. `components/`: protótipos React (`.jsx`), contratos (`.d.ts`, `.prompt.md`) e cartões (`.card.html`). `assets/`: logos e 72 ícones Lucide. `guidelines/`: amostras de fundamentos.
- `prototipos-t4/`: as telas T4.1–T4.8 (Início, Diário, Evidências, Live, Artefatos, Score, Configurações, Agente).
- `_adherence.oxlintrc.json`: regras de aderência do DS (sem hex/px literal, só Inter e Plus Jakarta Sans).
- Não copiados de propósito: `uploads/` (slides de terceiros, só referência estrutural), `screenshots/`, fontes (já em `apps/web/public/fonts`).
- Os `.jsx` são protótipos do Claude Design (estilos inline, `window.PersonaDesignSystem`): **servem de especificação**; o código de produção é TSX em `apps/web/components/ds/`.
