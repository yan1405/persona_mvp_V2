Main-panel header of internal screens: the single "Buscar ou perguntar" field (AgentPrompt compact, ⌘K) and the "Agente" IconButton that opens/closes the docked AgentPanel.

```jsx
<AppHeader agentOpen={open} onAgentToggle={setOpen} onSearch={ask} />
```

- The Agente button exposes aria-pressed/aria-expanded; it never shows a beta or maturity badge.
- No notification bell, profile menu or extra nav items.
