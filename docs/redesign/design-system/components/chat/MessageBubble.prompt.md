A single message in the Agente Persona conversation — Ink for the person, white for the agent. Use only inside `AgentPanel` (and, later, the central conversation on Início); never in Diário, Evidências, Persona Live or Artefatos workspaces.

```jsx
<MessageBubble role="user">O que falta para meu score sair da base declarada?</MessageBubble>
<MessageBubble citations={['Sugestões do Diário', 'Como é calculado']} actions={['Revisar sugestões']} onAction={go}>Para a Coerência observada falta 1 evidência confirmada…</MessageBubble>
<MessageBubble typing />
```

- Every agent claim lists its origin under "Origem" as text chips — never colour alone.
- Actions are outline buttons with visible labels and are **contextual** — pass only the ones that apply; the three never need to appear together:
  - "Revisar sugestões" → only when there are pending suggestions;
  - "Abrir no Persona Live" → only for preparation or an interview;
  - "Criar Artefato" → only when the request involves professional material (pitch, resposta STAR, etc.).
- Example: a Narrative Score answer shows only "Revisar sugestões".
- No maturity/beta badge; the agent is always named "Agente Persona".
