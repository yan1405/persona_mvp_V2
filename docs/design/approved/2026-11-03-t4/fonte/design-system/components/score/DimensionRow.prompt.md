One Narrative Score dimension (Coerência, Consistência, Credibilidade) with value, origin and concrete progress toward observed data.

```jsx
<DimensionRow label="Coerência" value={75} weight="0,6" progress="Rumo ao dado observado: 4 de 5 evidências confirmadas" />
<DimensionRow label="Credibilidade" notEvaluated />
```

- Credibilidade without real validation shows "Ainda não avaliada" — never a number.
- `onOpen` makes the row a button (opens the Score panel); disabled rows are not focusable.
