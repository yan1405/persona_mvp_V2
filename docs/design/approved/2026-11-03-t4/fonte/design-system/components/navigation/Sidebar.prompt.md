The app sidebar. Wires the five destinations, the Ink "Registrar agora" (opens the Diário) and Configurações in the footer.

```jsx
<Sidebar active="inicio" onNavigate={setRoute}
  resume={{ title: 'Registro de ontem', meta: '2 sugestões para revisar' }} onResume={openSuggestions}
  badges={{ diario: { count: 2, label: '2 sugestões para revisar' } }} />
<Sidebar collapsed active="evidencias" />
```

- Omit `resume` when nothing is pending; never render an empty block.
- No Narrative Score, Diagnóstico, plans or prices in the nav.
