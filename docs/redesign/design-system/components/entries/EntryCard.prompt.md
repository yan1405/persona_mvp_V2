Card for one dated item in a history grid: a Diário entry, a Persona Live session or an Artefato version. Lay out in a 2–3 column grid; never as a list or inbox.

```jsx
<EntryCard kind="registro" date="ontem" title="Registro de ontem" meta="Originou 2 sugestões de evidência." status="para-revisar" onOpen={open} />
<EntryCard kind="sessao" title="Analista júnior de IA generativa · Empresa Aurora (fictícia)" meta="3 evidências autorizadas" statusLabel="Encerrada" statusIcon="lock" onOpen={open} />
<EntryCard kind="versao" title="Problema resolvido com dados" meta="Resposta STAR · cita a evidência 1" status="revisado" />
```

- No avatar, unread count, pin or message preview.
- Missing date → the date line is hidden; never "Data não informada", never an invented date. Missing meta → explicit gap.
- Evidence is not an EntryCard kind: use `EvidenceCard`.
- `status` uses the Badge product statuses; `statusLabel` + `statusIcon` for neutral states such as "Encerrada".
