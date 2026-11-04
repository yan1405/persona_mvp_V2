Sequential flow shell — "Etapa N de M", segmented progress, Voltar (outline) / Continuar (Ink). Onboarding (4), Diagnóstico (3), Novo Artefato (6).

```jsx
<StepFlow step={4} total={6} title="Selecionar e autorizar evidências." nextDisabled nextDisabledReason="Selecione de 1 a 8 evidências">…</StepFlow>
```

- Blocked Continuar always states why (`nextDisabledReason`).
- `nextVariant="brand"` only when the step's action is the screen's single brand CTA.
