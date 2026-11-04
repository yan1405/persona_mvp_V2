const SPDS = window.PersonaDesignSystem_ff1a7b;
const { AppShell: SShell, CaptureEditor: SCapture, EntryCard: SEntry, Card: SCard, Badge: SBadge, Button: SButton, Chip: SChip, Input: SInput, Icon: SIcon } = SPDS;

const dsCss = {
  h2: { margin: 0, fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, letterSpacing: '-0.01em', color: 'var(--text-strong)' },
  p: { margin: 0, fontSize: 13, lineHeight: 1.55, color: 'var(--text-body)', textWrap: 'pretty' },
  row: { display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' },
};

/* Fonte literal: docs/persona-fluxos-e-features.md §10 (massa de dados fictícia do documento, não dados de uma pessoa real):
   "4 registros em 2 semanas; último registro ontem" e as 2 sugestões "vindas do registro de ontem no Diário".
   Todo o resto — textos dos registros, datas de r2–r4, evidência ligada a r2, rascunho, busca — não consta na fonte: dados sintéticos para demonstração. */
const SYN = 'Dados sintéticos para demonstração';
const RECORDS = [
  { id: 'r1', date: 'ontem', dateLong: 'Ontem', age: 1, synthetic: true, text: 'Exemplo sintético: texto de um registro genérico, usado só para demonstrar a tela.',
    suggestions: ['Organização do cronograma de entregas do semestre', 'Protótipo de interface para app de carreira'] },
  { id: 'r2', date: 'há 4 dias', dateLong: 'Há 4 dias · data sintética', age: 4, synthetic: true, text: 'Exemplo sintético: preparei a pauta de uma reunião e enviei o resumo das decisões para o grupo.',
    evidence: { title: 'Exemplo sintético de evidência confirmada', level: 'Registrada', proofs: 0 } },
  { id: 'r3', date: 'há 8 dias', dateLong: 'Há 8 dias · data sintética', age: 8, synthetic: true, text: 'Exemplo sintético: organizei os arquivos de um projeto em pastas por etapa.' },
  { id: 'r4', date: 'há 13 dias', dateLong: 'Há 13 dias · data sintética', age: 13, synthetic: true, text: 'Exemplo sintético: revisei um documento a pedido de outra pessoa e registrei os ajustes.' },
];
const DRAFT = 'Exemplo sintético: hoje revisei a lista de tarefas da semana e combinei prazos com o grupo.';
const NEW_REC = { id: 'r0', date: 'hoje', dateLong: 'Hoje', age: 0, synthetic: true, text: DRAFT };

function cardProps(r, ui) {
  const p = cardBase(r, ui);
  return r.synthetic ? { ...p, meta: SYN + ' · ' + p.meta } : p;
}
function cardBase(r, ui) {
  if (r.evidence) return { meta: 'Originou 1 evidência · ' + r.evidence.level, statusLabel: 'Evidência confirmada', statusIcon: 'badge-check' };
  if (r.suggestions) { const p = ui ? ui.items.filter(i => i.st === 'pending').length : 2; return p ? { meta: p + (p === 1 ? ' sugestão da IA aguarda sua revisão' : ' sugestões da IA aguardam sua revisão'), status: 'para-revisar', statusLabel: p === 1 ? '1 sugestão para revisar' : p + ' sugestões para revisar' } : { meta: 'Sugestões revisadas', statusLabel: 'Revisado', statusIcon: 'circle-check' }; }
  return { meta: 'Sugestões ainda não geradas', statusLabel: 'Sem sugestões ainda', statusIcon: 'clock' };
}

function initUi(rec, over) {
  return { sug: rec.suggestions ? 'ready' : 'none', items: (rec.suggestions || []).map((t, i) => ({ id: rec.id + '-' + i, title: t, st: 'pending' })), edit: null, del: null, ...over };
}

/* Cenário → estado inicial. Tudo continua interativo a partir daí. */
const SCENARIOS = {
  'editor-vazio': {},
  'editor-preenchido': { text: DRAFT },
  criando: { text: DRAFT, saving: true },
  'salvar-falha': { text: DRAFT, saveFailed: true },
  'historico-vazio': { history: 'empty' },
  historico: { filters: true },
  'sem-resultado': { filters: true, query: 'busca sintética' },
  carregando: { history: 'loading' },
  'erro-leitura': { history: 'error' },
  'registro-criado': { created: true, open: 'r0', saved: true },
  gerando: { created: true, open: 'r0', ui: { sug: 'generating' } },
  'nenhuma-util': { created: true, open: 'r0', ui: { sug: 'empty' } },
  pendente: { open: 'r1' },
  descartada: { open: 'r1', ui: { items: [{ id: 'r1-0', title: RECORDS[0].suggestions[0], st: 'discarded' }, { id: 'r1-1', title: RECORDS[0].suggestions[1], st: 'pending' }] } },
  confirmada: { open: 'r1', ui: { items: [{ id: 'r1-0', title: RECORDS[0].suggestions[0], st: 'confirmed' }, { id: 'r1-1', title: RECORDS[0].suggestions[1], st: 'pending' }] } },
  'falha-ia': { open: 'r1', ui: { sug: 'failed' } },
  manual: { open: 'r1', ui: { sug: 'manual', prevSug: 'failed' } },
  conflito: { open: 'r1', ui: { edit: { text: 'Exemplo sintético: texto de um registro genérico, editado em outra aba para demonstrar o conflito.', conflict: true } } },
  'exclusao-bloqueada': { open: 'r2', ui: { del: 'blocked' } },
  'exclusao-confirmar': { open: 'r1', ui: { del: 'confirm' } },
  'exclusao-falha': { open: 'r1', ui: { del: 'failed' } },
};

function useOwnW() {
  const ref = React.useRef(null); const [w, setW] = React.useState(0);
  React.useLayoutEffect(() => { const el = ref.current; if (!el) return; const f = () => setW(el.offsetWidth); f(); const ro = new ResizeObserver(f); ro.observe(el); return () => ro.disconnect(); }, []);
  return [ref, w];
}

function SaveNotice({ kind }) {
  if (kind === 'failed') return <div role="alert" style={{ ...dsCss.row, gap: 10 }}><SBadge tone="danger" icon="triangle-alert">Registro não salvo</SBadge><span style={dsCss.p}>Não foi possível salvar agora. Seu texto continua no editor; tente salvar de novo.</span></div>;
  if (kind === 'saved') return <div role="status" style={{ ...dsCss.row, gap: 10 }}><SBadge tone="success" icon="circle-check">Registro salvo</SBadge><span style={dsCss.p}>Ele já está no histórico. Gerar sugestões é opcional.</span></div>;
  return null;
}

const PERIODS = [['todos', 'Todo o período'], ['7', 'Últimos 7 dias'], ['30', 'Últimos 30 dias']];

function History({ st, records, uiMap, onOpen, filters, setFilters, query, setQuery, period, setPeriod, retry, cols }) {
  const active = (query.trim() ? 1 : 0) + (period !== 'todos' ? 1 : 0);
  const q = query.trim().toLowerCase();
  const list = records.filter(r => (!q || (r.text + ' ' + (r.context || '')).toLowerCase().includes(q)) && (period === 'todos' || r.age <= +period));
  const clear = () => { setQuery(''); setPeriod('todos'); };
  const grid = { display: 'grid', gridTemplateColumns: 'repeat(' + cols + ', minmax(0,1fr))', gap: 16 };
  let body;
  if (st === 'loading') body = <div role="status" aria-busy="true" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
    <span style={dsCss.p}>Carregando histórico…</span>
    <div aria-hidden="true" style={grid}>{[0, 1, 2].slice(0, cols).map(i => <div key={i} style={{ height: 148, borderRadius: 'var(--radius-md)', background: 'var(--n-50)' }}></div>)}</div>
  </div>;
  else if (st === 'error') body = <SCard padding={24} radius="md"><div role="alert" style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-start' }}>
    <SBadge tone="danger" icon="triangle-alert">Histórico indisponível</SBadge>
    <p style={dsCss.p}>Não foi possível carregar o histórico agora. O editor acima continua funcionando e nenhum registro foi perdido.</p>
    <SButton variant="outline" size="sm" icon="refresh-cw" onClick={retry}>Tentar carregar de novo</SButton>
  </div></SCard>;
  else if (!records.length) body = <div style={{ padding: 24, borderRadius: 'var(--radius-md)', border: '1px dashed var(--border-strong)', display: 'flex', flexDirection: 'column', gap: 6 }}>
    <span style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, color: 'var(--text-strong)' }}>Nenhum registro ainda.</span>
    <p style={dsCss.p}>Escreva no editor acima uma situação real de trabalho ou estudo. Ela aparece aqui, com a data.</p>
  </div>;
  else if (!list.length) body = <div role="status" style={{ padding: 24, borderRadius: 'var(--radius-md)', border: '1px dashed var(--border-strong)', display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'flex-start' }}>
    <span style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, color: 'var(--text-strong)' }}>Nenhum registro encontrado.</span>
    <p style={dsCss.p}>{(q ? 'Nada com “' + query.trim() + '”' : 'Nada') + (period !== 'todos' ? ' nos ' + PERIODS.find(p => p[0] === period)[1].toLowerCase() : '') + '. Se isso aconteceu, vale registrar no editor acima.'}</p>
    <SButton variant="outline" size="sm" icon="x" onClick={clear}>Limpar filtros</SButton>
  </div>;
  else body = <div style={grid}>{list.map(r => <SEntry key={r.id} kind="registro" date={r.date} title={r.text} {...cardProps(r, uiMap[r.id])} onOpen={() => onOpen(r.id)} openLabel="Abrir registro" />)}</div>;
  const canFilter = st === 'ok' && records.length > 0;
  return <section aria-labelledby="hist-h" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
    <div style={{ ...dsCss.row, justifyContent: 'space-between', gap: 12, minHeight: 32 }}>
      <div style={{ ...dsCss.row, gap: 12, flex: '1 1 auto', minWidth: 0 }}>
        <h2 id="hist-h" style={dsCss.h2}>Histórico</h2>
        {st === 'ok' && records.length ? <span style={{ fontSize: 13, color: 'var(--text-body)', fontFeatureSettings: "'tnum'" }}>{records.length + ' registros em 2 semanas · textos: ' + SYN.toLowerCase()}</span> : null}
      </div>
      {canFilter ? <SButton variant="outline" size="sm" icon="filter" aria-expanded={filters} aria-controls="hist-filtros" onClick={() => setFilters(!filters)}>{active ? 'Filtros · ' + active : 'Filtros'}</SButton> : null}
    </div>
    {canFilter && filters ? <div id="hist-filtros" role="group" aria-label="Filtros do histórico" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 12, padding: 16, borderRadius: 'var(--radius-md)', background: 'var(--surface-card)', border: '1px solid var(--border-subtle)' }}>
      <SInput variant="search" aria-label="Buscar nos registros" placeholder="Buscar nos registros" value={query} onChange={e => setQuery(e.target.value)} style={{ flex: '1 1 260px', minWidth: 0 }} />
      <div role="radiogroup" aria-label="Período" style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {PERIODS.map(([id, l]) => <SChip key={id} size="sm" role="radio" aria-checked={period === id} selected={period === id} onClick={() => setPeriod(id)}>{l}</SChip>)}
      </div>
      {active ? <SButton variant="ghost" size="sm" icon="x" onClick={clear}>Limpar filtros</SButton> : null}
      <span aria-live="polite" style={{ fontSize: 12, color: 'var(--text-muted)', width: '100%', fontFeatureSettings: "'tnum'" }}>{list.length === 1 ? '1 registro' : list.length + ' registros'}</span>
    </div> : null}
    {body}
  </section>;
}

function DiarioScreen({ scenario, width, height, agentOpen, onAgentToggle }) {
  const sc = SCENARIOS[scenario] || {};
  const [text, setText] = React.useState(sc.text || '');
  const [saving, setSaving] = React.useState(!!sc.saving);
  const [notice, setNotice] = React.useState(sc.saveFailed ? 'failed' : sc.saved ? 'saved' : null);
  const [history, setHistory] = React.useState(sc.history || 'ok');
  const [records, setRecords] = React.useState(() => sc.history === 'empty' ? [] : sc.created ? [NEW_REC, ...RECORDS] : RECORDS);
  const [uiMap, setUiMap] = React.useState(() => { const m = {}; [NEW_REC, ...RECORDS].forEach(r => { m[r.id] = initUi(r, sc.open === r.id ? sc.ui : null); }); return m; });
  const [open, setOpen] = React.useState(sc.open || null);
  const [filters, setFilters] = React.useState(!!sc.filters);
  const [query, setQuery] = React.useState(sc.query || '');
  const [period, setPeriod] = React.useState('todos');
  const [ref, cw] = useOwnW();
  const cols = cw >= 860 ? 3 : cw >= 520 ? 2 : 1;
  const setUi = (id, patch) => setUiMap(m => ({ ...m, [id]: { ...m[id], ...patch } }));
  const save = () => {
    setSaving(true); setNotice(null);
    setTimeout(() => {
      setSaving(false);
      const rec = { ...NEW_REC, id: 'n' + Date.now(), text };
      setUiMap(m => ({ ...m, [rec.id]: initUi(rec) }));
      setRecords(rs => [rec, ...rs]); setText(''); setNotice('saved'); setOpen(rec.id);
    }, 900);
  };
  const gen = id => () => { setUi(id, { sug: 'generating' }); setTimeout(() => setUi(id, { sug: 'empty' }), 1400); };
  const rec = records.find(r => r.id === open) || null;
  const panel = rec ? <DiarioPanel rec={rec} ui={uiMap[rec.id]} set={p => setUi(rec.id, p)} onClose={() => setOpen(null)} gen={gen(rec.id)}
    onDelete={() => { setRecords(rs => rs.filter(r => r.id !== rec.id)); setOpen(null); }} /> : null;
  return <SShell active="diario" title="Diário" height={height} agentOpen={agentOpen} onAgentToggle={onAgentToggle} agentScreen="Diário" panel={panel}
    badges={uiMap.r1 && uiMap.r1.items.some(i => i.st === 'pending') && records.some(r => r.id === 'r1') ? { diario: { count: uiMap.r1.items.filter(i => i.st === 'pending').length, label: 'sugestões para revisar' } } : undefined}
    style={{ width }}>
    <div ref={ref} style={{ display: 'flex', flexDirection: 'column', gap: 32, paddingTop: 4, minWidth: 0 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <SCapture value={text} onChange={v => { setText(v); if (notice === 'saved') setNotice(null); }} onSave={save} saving={saving} />
        <SaveNotice kind={notice} />
      </div>
      <History st={history} records={records} uiMap={uiMap} onOpen={setOpen} filters={filters} setFilters={setFilters} query={query} setQuery={setQuery} period={period} setPeriod={setPeriod} retry={() => setHistory('ok')} cols={cols} />
    </div>
  </SShell>;
}

Object.assign(window, { DiarioScreen, DIARIO_SCENARIOS: SCENARIOS });
