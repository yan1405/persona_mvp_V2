Input at the bottom of the Agente Persona conversation — only inside `AgentPanel` (and, later, the central conversation on Início).

```jsx
<Composer onSend={send} />
<Composer suggestions={[]} onSend={send} />
```

- Defaults: placeholder "Pergunte ao Agente Persona…", chips "O que falta para o score observado?", "Organize minhas evidências", "Preparar uma entrevista", footer "O agente só usa as evidências que você registrou. Confira sempre a origem."
- Send is Ink (`solid`), never brand: the conversation never competes with the screen's main action.
- No attach or mic buttons (upload and audio are out of scope).
