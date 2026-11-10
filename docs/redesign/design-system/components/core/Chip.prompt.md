Pill for competencies, view chips ("Todas", "Para revisar"), status filters and quick actions.

```jsx
<Chip size="sm">Automação</Chip>
<Chip status="documentada" />
<Chip status="para-revisar" onClick={...} />
<Chip selected onClick={...}>Todas</Chip>
```

- `status` gives the same six product states as `Badge` (registrada, documentada, para-revisar, rascunho, revisado, lacuna) as a tinted pill with icon and label — useful for status filters.
- Without `status`: outline pill (white, 1px border) for competencies and actions; `selected` = Ink fill for the active view chip.
- Views replace tabs: render sibling views as chips, never tabs.
