
const SEV = window.PersonaDesignSystem_ff1a7b;
const { AppShell: VShell, EvidenceCard: VCard, Badge: VBadge, Button: VButton, Chip: VChip, Input: VInput, Card: VPanelCard } = SEV;

/* Fonte literal (§10): 4 evidências (título, competências, provas 2/1/1/0, níveis), 2 sugestões do registro de ontem no Diário,
   Live (sessão Aurora, evidências 1–3) e Artefatos (STAR cita 1; Pitch cita 1–3). Links, URLs e idades (período) são dados sintéticos para demonstração. */
const SYNV = 'Dados sintéticos para demonstração';
const EVS0 = [
  { id: 'e1', title: 'Automação de relatórios semanais com IA generativa', comp: ['Automação', 'Análise de dados'], links: ['https://exemplo.com/prova-1a', 'https://exemplo.com/prova-1b'], age: 5, uses: ['Persona Live · sessão Aurora (encerrada)', 'Artefato · Resposta STAR “Problema resolvido com dados” (Revisado)', 'Artefato · Pitch pessoal (Rascunho)'] },
  { id: 'e2', title: 'Pitch de 5 minutos para banca de empreendedorismo', comp: ['Comunicação', 'Storytelling'], links: ['https://exemplo.com/prova-2'], age: 20, uses: ['Persona Live · sessão Aurora (encerrada)', 'Artefato · Pitch pessoal (Rascunho)'] },
  { id: 'e3', title: 'Entrevistas com 8 usuários para validar o problema', comp: ['Pesquisa com usuários', 'Análise'], links: ['https://exemplo.com/prova-3'], age: 40, uses: ['Persona Live · sessão Aurora (encerrada)', 'Artefato · Pitch pessoal (Rascunho)'] },
  { id: 'e4', title: 'Oficina de Python para calouros', comp: ['Ensino', 'Liderança'], links: [], age: 70, uses: [] },
];
const SUGS0 = [{ id: 's1', title: 'Organização do cronograma de entregas do semestre' }, { id: 's2', title: 'Protótipo de interface para app de carreira' }];
const ALLCOMP = ['Automação', 'Análise de dados', 'Comunicação', 'Storytelling', 'Pesquisa com usuários', 'Análise', 'Ensino', 'Liderança'];
const PERIODS = [['todos', 'Todo o período'], ['30', 'Últimos 30 dias'], ['90', 'Últimos 90 dias']];

const ESC = {
  vazia: { list: 'empty' },
  completa: {},
  'para-revisar': { view: 'rev' },
  'sem-resultado': { filters: { open: true, comp: 'Liderança', level: 'Documentada' } },
  busca: { query: 'python' },
  'filtros': { filters: { open: true } },
  'nova-vazia': { panel: 'new' },
  'nova-preenchida': { panel: 'new', newInit: { title: 'Exemplo sintético: título de uma evidência registrada manualmente', comp: 'Exemplo sintético' } },
  salvando: { panel: 'new', newInit: { title: 'Exemplo sintético: título de uma evidência registrada manualmente', comp: 'Exemplo sintético', step: 'review', saving: true } },
  'falha-salvar': { panel: 'new', newInit: { title: 'Exemplo sintético: título de uma evidência registrada manualmente', comp: 'Exemplo sintético', step: 'review', failed: true } },
  'erro-leitura': { list: 'error' },
  'erro-escrita': { panel: 'e4', pInit: { addOpen: true, url: 'https://exemplo.com/prova-nova', addError: true, scroll: 'ev-provas' } },
  'det-registrada': { panel: 'e4' },
  'det-documentada': { panel: 'e1' },
  'det-e2': { panel: 'e2' },
  'det-e3': { panel: 'e3' },
  'link-adicionando': { panel: 'e4', pInit: { addOpen: true, url: 'https://exemplo.com/prova-nova', adding: true, scroll: 'ev-provas' } },
  'link-removendo': { panel: 'e2', pInit: { rmIdx: 0, scroll: 'ev-provas' } },
  'link-removido': { panel: 'e2', evOver: { e2: { links: [] } }, pInit: { notice: 'removed', scroll: 'ev-provas' } },
  'prova-ausente': { panel: 'e4', pInit: { scroll: 'ev-provas' } },
  'uso-vazio': { panel: 'e4', pInit: { scroll: 'ev-uso' } },
  'edicao-alterada': { panel: 'e1', pInit: { edit: { title: 'Automação de relatórios semanais com IA generativa — texto em edição', comp: 'Automação, Análise de dados', conflict: false } } },
  conflito: { panel: 'e1', pInit: { edit: { title: 'Automação de relatórios semanais com IA generativa — minha versão', comp: 'Automação, Análise de dados', conflict: true } } },
  arquivada: { panel: 'e4', evOver: { e4: { archived: true } }, pInit: {} },
  restaurada: { panel: 'e4', pInit: { notice: 'restored' } },
  'nao-encontrado': { panel: 'err:notfound' },
  'sem-permissao': { panel: 'err:forbidden' },
};

function useOwnWE() {
  const ref = React.useRef(null); const [w, setW] = React.useState(0);
  React.useLayoutEffect(() => { const el = ref.current; if (!el) return; const f = () => setW(el.offsetWidth); f(); const ro = new ResizeObserver(f); ro.observe(el); return () => ro.disconnect(); }, []);
  return [ref, w];
}
const scH2 = { margin: 0, fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, letterSpacing: '-0.01em', color: 'var(--text-strong)' };
const scP = { margin: 0, fontSize: 13, lineHeight: 1.55, color: 'var(--text-body)', textWrap: 'pretty' };
const scRow = { display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' };
const dashed = { padding: 24, borderRadius: 'var(--radius-md)', border: '1px dashed var(--border-strong)', display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'flex-start' };

function EvidenciasScreen({ scenario, width, height, agentOpen, onAgentToggle }) {
  const sc = ESC[scenario] || {};
  const [evs, setEvs] = React.useState(() => sc.list === 'empty' ? [] : EVS0.map(e => ({ ...e, ...(sc.evOver && sc.evOver[e.id]) })));
  const [sugs, setSugs] = React.useState(sc.list === 'empty' ? [] : SUGS0);
  const [listSt, setListSt] = React.useState(sc.list || 'ok');
  const [view, setView] = React.useState(sc.view || 'all');
  const [query, setQuery] = React.useState(sc.query || '');
  const f0 = sc.filters || {};
  const [fOpen, setFOpen] = React.useState(!!f0.open);
  const [comp, setComp] = React.useState(f0.comp || '');
  const [level, setLevel] = React.useState(f0.level || '');
  const [period, setPeriod] = React.useState('todos');
  const [arch, setArch] = React.useState(false);
  const [panel, setPanel] = React.useState(sc.panel || null);
  const [flash, setFlash] = React.useState(null);
  const [ref, cw] = useOwnWE();
  const cols = cw >= 860 ? 3 : cw >= 520 ? 2 : 1;
  const grid = { display: 'grid', gridTemplateColumns: 'repeat(' + cols + ', minmax(0,1fr))', gap: 16 };
  const lvl = window.evLevelOf;
  const active = evs.filter(e => !e.archived), archived = evs.filter(e => e.archived);
  const q = query.trim().toLowerCase();
  const list = (arch ? archived : active).filter(e => (!q || (e.title + ' ' + e.comp.join(' ')).toLowerCase().includes(q)) && (!comp || e.comp.includes(comp)) && (!level || lvl(e) === level) && (period === 'todos' || e.age == null || e.age <= +period));
  const sugList = sugs.filter(s => !q || s.title.toLowerCase().includes(q));
  const nFilters = (comp ? 1 : 0) + (level ? 1 : 0) + (period !== 'todos' ? 1 : 0) + (arch ? 1 : 0);
  const clear = () => { setQuery(''); setComp(''); setLevel(''); setPeriod('todos'); setArch(false); };
  const isQuestion = /\?\s*$/.test(query.trim());
  const onChange = id => p => setEvs(es => es.map(e => e.id === id ? { ...e, ...p } : e));
  const ev = panel && !panel.startsWith('err:') && panel !== 'new' ? evs.find(e => e.id === panel) : null;
  const onSave = d => { const id = 'n' + Date.now(); setEvs(es => [{ id, title: d.title, comp: d.comp, links: [], origin: 'Manual', uses: [] }, ...es]); setPanel(null); setView('all'); setFlash('Evidência registrada como Registrada. Ela já está na biblioteca.'); };
  const confirmS = s => { setEvs(es => [{ id: 'c' + s.id, title: s.title, comp: [], links: [], origin: 'Diário', uses: [] }, ...es]); setSugs(x => x.filter(i => i.id !== s.id)); setFlash('Evidência confirmada por você. Entrou como Registrada.'); };
  const discardS = s => { setSugs(x => x.filter(i => i.id !== s.id)); setFlash('Sugestão descartada.'); };
  const panelNode = panel === 'new' ? <NovaPanel key="new" init={sc.newInit} onClose={() => setPanel(null)} onSave={onSave} />
    : panel && panel.startsWith('err:') ? <ErroPanel kind={panel.slice(4)} onClose={() => setPanel(null)} />
    : ev ? <EvidenciaPanel key={ev.id} ev={ev} init={sc.panel === ev.id && !flash ? sc.pInit : null} onChange={onChange(ev.id)} onClose={() => setPanel(null)} /> : null;
  const showRev = view === 'rev';
  const total = active.length;
  let body;
  if (listSt === 'error') body = <div role="alert" style={dashed}>
    <VBadge tone="danger" icon="triangle-alert">Biblioteca indisponível</VBadge>
    <p style={scP}>Não foi possível carregar suas evidências agora. Nada foi perdido ou alterado.</p>
    <VButton variant="outline" size="sm" icon="refresh-cw" onClick={() => setListSt('ok')}>Tentar carregar de novo</VButton>
  </div>;
  else if (!evs.length && !sugs.length) body = <div style={dashed}>
    <span style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, color: 'var(--text-strong)' }}>Nenhuma evidência ainda. Comece pelo Diário.</span>
    <p style={scP}>Evidências nascem de registros que você confirma. Se preferir, registre uma manualmente.</p>
  </div>;
  else if (showRev ? !sugList.length : !list.length) body = <div role="status" style={dashed}>
    <span style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, color: 'var(--text-strong)' }}>{showRev && !nFilters && !q ? 'Nada para revisar.' : 'Nenhuma evidência encontrada.'}</span>
    <p style={scP}>{showRev && !nFilters && !q ? 'Todas as sugestões foram revisadas. Novas sugestões surgem a partir dos registros do Diário.' : 'Nenhum resultado para esta busca ou estes filtros.'}</p>
    {nFilters || q ? <VButton variant="outline" size="sm" icon="x" onClick={clear}>Limpar filtros</VButton> : null}
  </div>;
  else body = showRev
    ? <div style={grid}>{sugList.map(s => <VCard key={s.id} variant="suggestion" title={s.title} level="Registrada" proofCount={0} origin="Diário" updatedAt="ontem" onConfirm={() => confirmS(s)} onDiscard={() => discardS(s)} />)}</div>
    : <div style={grid}>{list.map(e => <VCard key={e.id} title={e.title} competencies={e.comp} level={lvl(e)} proofCount={e.links.length} origin={e.origin} onOpen={() => { setFlash(null); setPanel(e.id); }} />)}</div>;
  const canTool = listSt !== 'error';
  return <VShell active="evidencias" title="Evidências" height={height} agentOpen={agentOpen} onAgentToggle={onAgentToggle} agentScreen="Evidências" panel={panelNode}
    badges={sugs.length ? { evidencias: { count: sugs.length, label: 'sugestões para revisar' } } : undefined} style={{ width }}>
    <div ref={ref} style={{ display: 'flex', flexDirection: 'column', gap: 20, paddingTop: 4, minWidth: 0 }}>
      <div style={{ ...scRow, justifyContent: 'space-between', gap: 12 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 0, flex: '1 1 260px' }}>
          <h2 style={{ ...scH2, lineHeight: 1.3 }}>Tudo o que sustenta a sua história.</h2>
          <span aria-live="polite" style={{ fontSize: 13, color: 'var(--text-body)', fontFeatureSettings: "'tnum'" }}>{!evs.length && !sugs.length ? 'Biblioteca vazia · comece pelo Diário' : total + (total === 1 ? ' confirmada' : ' confirmadas') + ' · ' + sugs.length + ' para revisar'}</span>
        </div>
        <VButton variant={panel ? 'outline' : 'brand'} icon="plus" onClick={() => { setFlash(null); setPanel('new'); }}>Registrar evidência</VButton>
      </div>
      {flash ? <div role="status" style={scRow}><VBadge tone="success" icon="circle-check">{flash}</VBadge></div> : null}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ ...scRow, gap: 12 }}>
          <VInput variant="search" aria-label="Buscar nas evidências" placeholder="Buscar nas evidências" disabled={!canTool} value={query} onChange={e => setQuery(e.target.value)} style={{ flex: '1 1 280px', minWidth: 0 }} />
          <VButton variant="outline" size="sm" icon="filter" disabled={!canTool} aria-expanded={fOpen} aria-controls="ev-filtros" onClick={() => setFOpen(!fOpen)}>{nFilters ? 'Filtros · ' + nFilters : 'Filtros'}</VButton>
        </div>
        {isQuestion && canTool ? <div role="status" style={scRow}><VBadge tone="info" icon="info">Parece uma pergunta</VBadge><span style={scP}>Esta lista só busca. Para perguntar, use o campo “Buscar ou perguntar” do cabeçalho ou abra o Agente Persona.</span></div> : null}
        <div role="group" aria-label="Visão" style={scRow}>
          <VChip selected={!showRev} onClick={() => setView('all')} icon="layout-grid">Todas</VChip>
          <VChip selected={showRev} onClick={() => setView('rev')} icon="sparkles">{'Para revisar · ' + sugs.length}</VChip>
        </div>
        {fOpen && canTool ? <div id="ev-filtros" role="group" aria-label="Filtros da biblioteca" style={{ display: 'flex', flexDirection: 'column', gap: 14, padding: 16, borderRadius: 'var(--radius-md)', background: 'var(--surface-card)', border: '1px solid var(--border-subtle)' }}>
          <div role="group" aria-label="Competência" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}><span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)' }}>Competência</span>
            <div style={scRow}><VChip size="sm" selected={!comp} onClick={() => setComp('')}>Todas</VChip>{ALLCOMP.map(c => <VChip key={c} size="sm" selected={comp === c} onClick={() => setComp(comp === c ? '' : c)}>{c}</VChip>)}</div></div>
          <div role="group" aria-label="Período" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}><span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)' }}>Período · datas das evidências: {SYNV.toLowerCase()}</span>
            <div style={scRow}>{PERIODS.map(([id, l]) => <VChip key={id} size="sm" selected={period === id} onClick={() => setPeriod(id)}>{l}</VChip>)}</div></div>
          <div role="group" aria-label="Nível" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}><span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)' }}>Nível</span>
            <div style={scRow}><VChip size="sm" selected={!level} onClick={() => setLevel('')}>Todos</VChip><VChip size="sm" selected={level === 'Registrada'} onClick={() => setLevel(level === 'Registrada' ? '' : 'Registrada')}>Registrada</VChip><VChip size="sm" selected={level === 'Documentada'} onClick={() => setLevel(level === 'Documentada' ? '' : 'Documentada')}>Documentada</VChip><VChip size="sm" icon="lock">Validada · indisponível nesta versão</VChip><VChip size="sm" icon="lock">Certificada · indisponível nesta versão</VChip></div></div>
          <div role="group" aria-label="Situação" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}><span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)' }}>Situação</span>
            <div style={scRow}><VChip size="sm" selected={!arch} onClick={() => setArch(false)}>Ativas</VChip><VChip size="sm" selected={arch} onClick={() => setArch(true)}>{'Arquivadas · ' + archived.length}</VChip></div></div>
          <div style={{ ...scRow, justifyContent: 'space-between' }}>
            <span aria-live="polite" style={{ fontSize: 12, color: 'var(--text-muted)', fontFeatureSettings: "'tnum'" }}>{showRev ? sugList.length + (sugList.length === 1 ? ' sugestão' : ' sugestões') : list.length + (list.length === 1 ? ' evidência' : ' evidências')}</span>
            {nFilters ? <VButton variant="ghost" size="sm" icon="x" onClick={clear}>Limpar filtros</VButton> : null}
          </div>
        </div> : null}
      </div>
      {body}
    </div>
  </VShell>;
}

Object.assign(window, { EvidenciasScreen, EVID_SCENARIOS: ESC });
