"Nesta página" anchor index for long details stacked in sections. Numbered text links with a dot marker — not tabs.

```jsx
<SectionIndex items={[{ id: 'resumo', label: 'Resumo' }, { id: 'provas', label: 'Provas', meta: '2 links' }]} activeId={a} onSelect={setA} />
```

- Sections without content are muted and not focusable. Enter on a link scrolls the nearest scroll container.
