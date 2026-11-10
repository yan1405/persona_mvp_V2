The "Buscar ou perguntar" field — `large` on Início, `compact` in the header. Searches entries and evidence; questions go to the Agente Persona.

```jsx
<AgentPrompt size="large" onSubmit={ask} onSuggestion={ask} />
<AgentPrompt size="compact" onSubmit={ask} />
```

- White pill, Lucide `search`, Ink send button (never brand).
- `large`: 64px, Float shadow, up to 4 chips (default "O que falta para o score observado?", "Organize minhas evidências", "Preparar uma entrevista", "Criar um Artefato").
- `compact`: 40px, outline, ⌘K hint, no chips.
