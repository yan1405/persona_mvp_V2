Anchored detail panel (560–640px) over an ink 18% scrim; the list stays visible behind it. One open at a time.

```jsx
<FloatingPanel open={open} onClose={close} eyebrow="Evidência 1" title="Automação de relatórios semanais com IA generativa" footer={<Button variant="solid">Testar no Live</Button>}>…</FloatingPanel>
```

- Focus moves in on open, Tab/Shift+Tab are trapped, Esc or scrim closes, focus returns to the opener.
- Long content: stacked sections with `SectionIndex` — no tabs.
