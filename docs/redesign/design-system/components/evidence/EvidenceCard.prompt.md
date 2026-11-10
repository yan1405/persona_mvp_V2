Card for one evidence — use in the Evidências grid, for AI suggestions pending review, and to select evidence for Persona Live or a new Artefato. Never render it as a table row.

```jsx
<EvidenceCard title="Automação de relatórios semanais com IA generativa" competencies={['Automação', 'Análise de dados']} level="Documentada" proofCount={2} onOpen={open} />
<EvidenceCard variant="suggestion" title="Organização do cronograma de entregas do semestre" origin="Diário" updatedAt="ontem" onConfirm={confirm} onDiscard={discard} />
<EvidenceCard variant="selectable" title="…" reason="…" selected={on} onSelectedChange={setOn} />
```

- `grid`: radius 22, Soft shadow, lifts to Float on hover; lay out in a 2–3 column grid.
- `suggestion`: dashed border on subtle surface + "Para revisar" badge; actions "Confirmar evidência" (Ink by default, `confirmVariant="brand"` only if it is the screen's one brand action) and "Descartar".
- `selectable`: native checkbox (keyboard + screen reader), selected state shown by check mark, 2px Indigo border and the "Selecionada" label.
- Levels: only Registrada and Documentada. Missing origin/date render an explicit gap, never invented values.
