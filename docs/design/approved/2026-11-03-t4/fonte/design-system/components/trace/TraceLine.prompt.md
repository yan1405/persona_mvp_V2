Signature element: Registro → Sugestão → Evidência → Prova → Uso. Shows where every text came from.

```jsx
<TraceLine steps={[{ kind: 'registro', label: 'Registro de origem' }, { kind: 'evidencia', label: 'Oficina de Python para calouros', meta: 'Registrada' }, { kind: 'prova', label: 'Sem link de prova', state: 'gap' }]} />
```

- `gap` = missing link (dashed amber), `error` = broken link. `onStep` makes nodes buttons; `archived` is muted and non-interactive.
