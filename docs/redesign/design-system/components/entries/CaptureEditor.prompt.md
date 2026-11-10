The Diário editor for writing a new entry — use at the top of the Diário. It is a personal log editor, never a chat.

```jsx
<CaptureEditor onSave={({ text, date, context }) => save(text, date, context)} />
```

- Counter states: empty ("Mínimo de 40 caracteres"), under 40 ("Faltam N caracteres para salvar", amber ink), valid ("Pronto para salvar", green ink), limit ("Limite de 2.000 caracteres atingido"). `maxLength` stops typing at 2.000.
- "Salvar registro" is the screen's brand button and stays disabled until the text is valid.
- No bubbles, prompt chips, avatar or send arrow. AI suggestions appear afterwards, in the entry detail — the text is never rewritten.
