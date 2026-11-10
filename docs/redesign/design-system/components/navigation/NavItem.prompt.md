One row of the sidebar. Five destinations (Início, Diário, Evidências, Persona Live, Artefatos) plus Configurações in the footer — use `Sidebar`, which already wires them.

```jsx
<NavItem icon="house" label="Início" active />
<NavItem icon="notebook-pen" label="Diário" badge={2} badgeLabel="2 sugestões para revisar" />
<NavItem icon="badge-check" label="Evidências" collapsed />
```

- No chevrons, no empty or "fora do escopo" items, no nested lists.
- Narrative Score and Diagnóstico are never nav items.
