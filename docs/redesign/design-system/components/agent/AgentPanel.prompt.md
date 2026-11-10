Docked Agente Persona panel on the right of internal screens (Diário, Evidências, Score, Live, Artefatos). Opens from the "Agente" header button or Ctrl/⌘+K; pushes content instead of covering it.

```jsx
<AgentPanel open={open} onToggle={setOpen} screen="Evidências" messages={msgs} onSend={ask} onAction={go} />
```

- Open: `clamp(380px, 30vw, 420px)`, radius 28, Float shadow. Collapsed: 64px rail with "Expandir Agente Persona".
- Composes the real `MessageBubble` and `Composer` — do not rebuild them.
- No tabs and no maturity/beta badge on the agent. Starts collapsed in the Persona Live workspace.
