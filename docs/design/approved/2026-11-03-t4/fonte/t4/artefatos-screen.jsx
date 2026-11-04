
const SPD = window.PersonaDesignSystem_ff1a7b;
const { AppShell: SShell, ArtifactCard: SCard, Badge: SBadge, Button: SButton, Chip: SChip } = SPD;

const A_MAN_C = { email: 'yan@exemplo.com', formacao: '', idiomas: '' };
const aCV = () => aMake('a3', 'curriculo', 'Currículo ATS', 'rascunho', ['e1', 'e2', 'e3'], { ...A_MAN_C, synthetic: true }, A_OBJ, null, 'há 1 dia');
const aPF = () => aMake('a4', 'portfolio', 'Portfólio por casos', 'rascunho', ['e1', 'e3'], { ...A_MAN_C, synthetic: true }, A_OBJ, null, 'há 1 dia');
const aPitchDirty = k => { const p = aSeed()[1]; return p; };
const aPitchSaved = () => { const p = aSeed()[1]; const s = p.sections.map(x => x.id === 's30' ? aApply(x, 'alt', A_OBJ, []).s : x); p.sections = s; p.versions = [...p.versions, { n: 3, label: 'Edição de seção', detail: 'Alterações salvas por ação humana. Nada foi sobrescrito: a versão anterior continua no histórico.', age: 'agora', sections: aSnap(s) }]; p.updated = 'agora'; return p; };
const aFresh = () => { const a = aMake('n1', 'pitch', 'Pitch pessoal', 'rascunho', ['e1', 'e2', 'e3'], {}, A_OBJ, null, 'agora'); a.versions[0].detail = 'Gerada pelo Persona só com as evidências autorizadas.'; return a; };

const ASC = {
  'lib-lista': {}, 'lib-vazia': { list: 'empty' }, 'lib-carregando': { list: 'loading' }, 'lib-erro': { list: 'error' },
  'lib-filtros': { filters: { open: true } }, 'lib-sem-resultado': { filters: { open: true, type: 'curriculo' } },
  c1: { route: 'new', init: { step: 1 } },
  'c1-agente': { route: 'new', init: { step: 1, type: 'pitch', objective: A_OBJ, agent: true }, agent: true },
  c2: { route: 'new', init: { step: 2, type: 'star' } },
  'c2-validacao': { route: 'new', init: { step: 2, type: 'star', objective: 'IA', tried: true } },
  c3: { route: 'new', init: { step: 3, type: 'star', objective: A_OBJ } },
  c4: { route: 'new', init: { step: 4, type: 'curriculo', objective: A_OBJ, man: { ...A_MAN_C } } },
  c5: { route: 'new', init: { step: 5, type: 'star', objective: A_OBJ, sel: ['e1'], auth: true } },
  'c5-sem': { route: 'new', init: { step: 5, type: 'star', objective: A_OBJ, evs: [] } },
  c6: { route: 'new', init: { step: 6, type: 'pitch', objective: A_OBJ, sel: ['e1', 'e2', 'e3'], auth: true } },
  'c6-gerando': { route: 'new', init: { step: 6, type: 'pitch', objective: A_OBJ, sel: ['e1', 'e2', 'e3'], auth: true, gen: 'running' } },
  'c6-timeout': { route: 'new', init: { step: 6, type: 'pitch', objective: A_OBJ, sel: ['e1', 'e2', 'e3'], auth: true, gen: 'timeout' } },
  'c6-provedor': { route: 'new', init: { step: 6, type: 'pitch', objective: A_OBJ, sel: ['e1', 'e2', 'e3'], auth: true, gen: 'provider' } },
  'c6-lacuna': { route: 'new', init: { step: 6, type: 'star', objective: A_OBJ, sel: ['e4'], auth: true } },
  'c-primeira': { route: 'detail', art: aFresh, init: { first: true } },
  'd-star': { route: 'detail', art: () => aSeed()[0] }, 'd-pitch': { route: 'detail', art: () => aSeed()[1] },
  'd-curriculo': { route: 'detail', art: aCV }, 'd-curriculo-previa': { route: 'detail', art: aCV, init: { view: 'previa' } },
  'd-portfolio': { route: 'detail', art: aPF, init: { view: 'previa' } },
  'd-salvando': { route: 'detail', art: () => aSeed()[1], init: { dirtyAction: ['s30', 'shorten'], saveSt: 'saving', selId: 's30' } },
  'd-salvo': { route: 'detail', art: aPitchSaved, init: { saveSt: 'saved', selId: 's30' } },
  'd-nao-salvo': { route: 'detail', art: () => aSeed()[1], init: { dirtyAction: ['s30', 'alt'], selId: 's30' } },
  'd-conflito': { route: 'detail', art: () => aSeed()[1], init: { dirtyAction: ['s30', 'alt'], saveSt: 'conflict', selId: 's30' } },
  'd-gerando': { route: 'detail', art: () => aSeed()[1], init: { busy: { id: 's60', kind: 'deepen' }, selId: 's60' } },
  'd-falha': { route: 'detail', art: () => aSeed()[1], init: { fail: { id: 's60', kind: 'deepen' }, selId: 's60' } },
  'd-restaurar': { route: 'detail', art: () => aSeed()[1], init: { restore: { v: 1, step: 'confirm' } , scroll: 'art-vers' } },
  'd-restaurando': { route: 'detail', art: () => aSeed()[1], init: { restore: { v: 1, step: 'busy' }, scroll: 'art-vers' } },
  'd-exportando': { route: 'detail', art: aCV, init: { ex: 'exporting' } },
  'd-falha-export': { route: 'detail', art: aCV, init: { ex: 'error' } },
  'd-fonte': { route: 'detail', art: () => aSeed()[1], gone: ['e2'] },
};

const AGENT_SEED = { role: 'agent', text: 'Você está em Artefatos. Posso pré-preencher o tipo e o objetivo de um novo Artefato ou levar você até ele. Não gero texto sem as evidências que você autorizar e não marco nada como Revisado.', actions: ['Criar Artefato'] };
const aInfer = t => /curr[ií]culo|\bcv\b/i.test(t) ? 'curriculo' : /portf[oó]lio/i.test(t) ? 'portfolio' : /star|comportament/i.test(t) ? 'star' : /pitch|apresenta/i.test(t) ? 'pitch' : null;

function ArtefatosScreen({ scenario, width, height, agentOpen, onAgentToggle }) {
  const sc = ASC[scenario] || ASC['lib-lista'];
  const [arts, setArts] = React.useState(() => sc.list === 'empty' ? [] : aSeed());
  const [listSt, setListSt] = React.useState(sc.list || 'ok');
  const [route, setRoute] = React.useState(() => sc.route === 'new' ? { name: 'new', init: sc.init } : sc.route === 'detail' ? { name: 'detail', art: sc.art(), init: sc.init, gone: sc.gone } : { name: 'lib' });
  const f0 = sc.filters || {};
  const [fOpen, setFOpen] = React.useState(!!f0.open);
  const [fType, setFType] = React.useState(f0.type || '');
  const [fState, setFState] = React.useState(f0.state || '');
  const [fDate, setFDate] = React.useState('todos');
  const [msgs, setMsgs] = React.useState([AGENT_SEED]);
  const pend = React.useRef(null);
  const [ref, cw] = aUseW();
  const cols = cw >= 860 ? 3 : cw >= 520 ? 2 : 1;
  const firstRoute = React.useRef(true);
  React.useEffect(() => {
    if (firstRoute.current) { firstRoute.current = false; return; }
    const r = ref.current; const h = r && (r.querySelector('main h2') || r.querySelector('main h1'));
    if (h) { h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true }); }
  }, [route.name]);
  const age = a => ({ 'há 12 dias': 12, 'há 3 dias': 3, 'há 1 dia': 1, agora: 0 }[a.updated] ?? 0);
  const list = arts.filter(a => (!fType || a.type === fType) && (!fState || a.status === fState) && (fDate === 'todos' || age(a) <= +fDate));
  const nF = (fType ? 1 : 0) + (fState ? 1 : 0) + (fDate !== 'todos' ? 1 : 0);
  const clear = () => { setFType(''); setFState(''); setFDate('todos'); };
  React.useEffect(() => { if (sc.init && sc.init.scroll) setTimeout(() => aGo(sc.init.scroll), 120); }, []);
  const sendAgent = t => {
    const ty = aInfer(t); pend.current = ty;
    setMsgs(m => [...m, { role: 'user', text: t }, ty ? { role: 'agent', text: 'Posso abrir Novo Artefato com “' + A_TLABEL[ty] + '” e o seu objetivo declarado. Você escolhe as evidências e aciona a geração.', actions: ['Criar Artefato'] } : { role: 'agent', text: 'Aqui eu só pré-preencho tipo e objetivo ou levo você à tela certa. Diga qual tipo quer criar: Resposta STAR, Pitch, Currículo ATS ou Portfólio.' }]);
  };
  const agentAction = a => { if (a === 'Criar Artefato') setRoute({ name: 'new', init: { step: 1, agent: true, type: pend.current || 'pitch', objective: A_OBJ }, k: Date.now() }); };
  const onCreated = art => { setArts(x => [art, ...x]); setRoute({ name: 'detail', art, init: { first: true } }); };
  const onSaved = a => setArts(x => x.some(i => i.id === a.id) ? x.map(i => i.id === a.id ? a : i) : x);
  const lib = route.name === 'lib';
  const grid = { display: 'grid', gridTemplateColumns: 'repeat(' + cols + ', minmax(0,1fr))', gap: 16 };
  const dashed = { padding: 24, borderRadius: 'var(--radius-md)', border: '1px dashed var(--border-strong)', display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'flex-start' };
  const dTitle = { fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, color: 'var(--text-strong)' };
  const chipRow = (label, items, val, set) => <div role="group" aria-label={label} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}><span style={aCss.label}>{label}</span><div style={aCss.row}>{items.map(([id, l]) => <SChip key={id} size="sm" selected={val === id} onClick={() => set(val === id && id ? '' : id)}>{l}</SChip>)}</div></div>;
  let body;
  if (listSt === 'loading') body = <div aria-busy="true" role="status" style={grid}><SCard type="star" title="Carregando artefatos…" disabled disabledText="Carregando…" /><SCard type="pitch" title="Carregando artefatos…" disabled disabledText="Carregando…" /></div>;
  else if (listSt === 'error') body = <div role="alert" style={dashed}><SBadge tone="danger" icon="triangle-alert">Biblioteca indisponível</SBadge><p style={aCss.p}>Não foi possível carregar seus artefatos agora. Nada foi perdido ou alterado.</p><SButton variant="outline" size="sm" icon="refresh-cw" onClick={() => setListSt('ok')}>Tentar carregar de novo</SButton></div>;
  else if (!arts.length) body = <div style={dashed}><span style={dTitle}>Nenhum Artefato ainda.</span><p style={aCss.p}>Artefatos nascem das suas evidências confirmadas. Use “Novo Artefato” para criar o primeiro: você escolhe o tipo, o objetivo e as fontes.</p></div>;
  else if (!list.length) body = <div role="status" style={dashed}><span style={dTitle}>Nenhum Artefato encontrado.</span><p style={aCss.p}>Nenhum resultado para estes filtros.</p><SButton variant="outline" size="sm" icon="x" onClick={clear}>Limpar filtros</SButton></div>;
  else body = <><div style={grid}>{list.map(a => <SCard key={a.id} type={a.type} title={a.title} objective={a.objective} status={a.status} updated={'Atualizado ' + a.updated} sources={aAllCited(a.sections).map(e => 'Evidência ' + A_EV[e].n)} onOpen={() => setRoute({ name: 'detail', art: a })} />)}</div><span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Datas de atualização e links de prova: {A_SYN.toLowerCase()}.</span></>;
  const canTool = listSt === 'ok' || listSt === 'empty';
  const content = route.name === 'new' ? <CreateFlow key={route.k || 'n'} init={route.init} onClose={() => setRoute({ name: 'lib' })} onCreated={onCreated} />
    : route.name === 'detail' ? <ArtDetail key={route.art.id} art={route.art} init={route.init} gone={route.gone} onBack={() => setRoute({ name: 'lib' })} onSaved={onSaved} width={cw} />
    : <div style={{ display: 'flex', flexDirection: 'column', gap: 20, paddingTop: 4, minWidth: 0 }}>
      <div style={{ ...aCss.row, justifyContent: 'space-between', gap: 12 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 0, flex: '1 1 260px' }}>
          <h2 style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, letterSpacing: '-0.01em', lineHeight: 1.3, color: 'var(--text-strong)' }}>Materiais profissionais, sempre com fonte.</h2>
          <span aria-live="polite" style={{ fontSize: 13, color: 'var(--text-body)', fontFeatureSettings: "'tnum'" }}>{listSt === 'loading' ? 'Carregando…' : listSt === 'error' ? 'Não foi possível contar' : arts.length ? arts.filter(a => a.status === 'revisado').length + ' revisado · ' + arts.filter(a => a.status === 'rascunho').length + ' rascunho' : 'Biblioteca vazia'}</span>
        </div>
        <SButton variant="brand" icon="plus" disabled={listSt === 'loading'} onClick={() => setRoute({ name: 'new', init: { step: 1 }, k: Date.now() })}>Novo Artefato</SButton>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={aCss.row}><SButton variant="outline" size="sm" icon="filter" disabled={!canTool} aria-expanded={fOpen} aria-controls="art-filtros" onClick={() => setFOpen(!fOpen)}>{nF ? 'Filtros · ' + nF : 'Filtros'}</SButton>{nF ? <SButton variant="ghost" size="sm" icon="x" onClick={clear}>Limpar filtros</SButton> : null}</div>
        {fOpen && canTool ? <div id="art-filtros" role="group" aria-label="Filtros da biblioteca" style={{ display: 'flex', flexDirection: 'column', gap: 14, padding: 16, borderRadius: 'var(--radius-md)', background: 'var(--surface-card)', border: '1px solid var(--border-subtle)' }}>
          {chipRow('Tipo', A_TYPES.map(t => [t.id, t.label]), fType, setFType)}
          {chipRow('Estado', [['rascunho', 'Rascunho'], ['revisado', 'Revisado']], fState, setFState)}
          {chipRow('Data · ' + A_SYN.toLowerCase(), [['todos', 'Todo o período'], ['7', 'Últimos 7 dias'], ['30', 'Últimos 30 dias']], fDate, v => setFDate(v || 'todos'))}
          <span aria-live="polite" style={{ fontSize: 12, color: 'var(--text-muted)', fontFeatureSettings: "'tnum'" }}>{list.length + (list.length === 1 ? ' artefato' : ' artefatos')}</span>
        </div> : null}
      </div>
      {body}
    </div>;
  return <SShell active="artefatos" title="Artefatos" height={height} agentOpen={agentOpen} onAgentToggle={onAgentToggle} agentScreen="Artefatos" agentMessages={msgs} onAgentSend={sendAgent} onAgentAction={agentAction} style={{ width }}>
    <div ref={ref} style={{ minWidth: 0 }}>{content}</div>
  </SShell>;
}
Object.assign(window, { ArtefatosScreen, ART_SCENARIOS: ASC });
