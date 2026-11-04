Pill button for every action; use `brand` for the one primary CTA on a screen, `solid` (ink) for the one action inside a card, `outline`/`ghost` for the rest.

```jsx
<Button variant="brand" iconRight="arrow-right">Revisar sugestões</Button>
<Button variant="solid" icon="check">Confirmar evidência</Button>
<Button variant="outline" size="sm" icon="link">Adicionar link de prova</Button>
```

- `variant`: brand | solid | outline | ghost | onFocal (on the dark journey surface)
- `size`: sm 32 · md 40 · lg 48
- Never place two `brand` buttons on the same screen.
