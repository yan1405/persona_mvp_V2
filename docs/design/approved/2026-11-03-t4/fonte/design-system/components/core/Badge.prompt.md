Status pill or unread-count bubble — use `status` for evidence and artefact states; colour only where it carries information.

```jsx
<Badge status="documentada" />
<Badge status="para-revisar" />
<Badge status="lacuna" />
<Badge variant="count">3</Badge>
```

- Six product statuses, label always visible:
  - `registrada`, `rascunho` — Slate (#4F4866 on #F2F1F7)
  - `documentada`, `revisado` — success (#064E3B on #ECFDF5)
  - `para-revisar`, `lacuna` — attention (#78350F on #FFFBEB)
- Each status has a Lucide icon (stroke 1.75); pass `icon={null}` to hide it. Children override the default label.
- Evidence levels are only Registrada and Documentada; "Para revisar" is for suggestions. Never "Verificada".
- Semantic tones always use dark ink text on a soft tint — never white on green.
- Generic `tone` (neutral, brand, success, warning, danger, info, ink) still works for non-status pills.
