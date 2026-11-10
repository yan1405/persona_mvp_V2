**Legado — remover na T6.2.** Não é navegação do produto (o Persona não usa abas) e não deve receber usos novos. Mantido apenas como demonstração acessível até a remoção.

```jsx
<PillTabs label="Filtro de evidências" value={f} onChange={setF} items={[{ id: 'all', label: 'Todas' }, { id: 'review', label: 'Para revisar', count: 2 }]} />
```

- Teclado: Tab entra na aba ativa; ←/→/Home/End trocam a seleção.
- Para listas, prefira grade de cards; para detalhes longos, `SectionIndex`.
