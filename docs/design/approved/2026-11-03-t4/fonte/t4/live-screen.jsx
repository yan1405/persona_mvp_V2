(function(){
const L = window.PersonaDesignSystem_ff1a7b;
const { AppShell, EntryCard, EvidenceCard, ArgumentPanel, DraftPanel, Badge, Button, Chip, Input, Icon } = L;
const SYN = 'Dados sintéticos para demonstração';
const NOTICE = 'O Persona não responde por você. Processos seletivos podem restringir assistência externa.';
/* Literal (§10): 4 evidências (títulos, competências, provas 2/1/1/0, níveis); sessão Aurora (encerrada) cita evidências 1–3. Empresa, vaga, perguntas, datas: sintéticos. */
const EVS = [
  { id: 'e1', n: 1, title: 'Automação de relatórios semanais com IA generativa', comp: ['Automação', 'Análise de dados'], links: 2, level: 'Documentada' },
  { id: 'e2', n: 2, title: 'Pitch de 5 minutos para banca de empreendedorismo', comp: ['Comunicação', 'Storytelling'], links: 1, level: 'Documentada' },
  { id: 'e3', n: 3, title: 'Entrevistas com 8 usuários para validar o problema', comp: ['Pesquisa com usuários', 'Análise'], links: 1, level: 'Documentada' },
  { id: 'e4', n: 4, title: 'Oficina de Python para calouros', comp: ['Ensino', 'Liderança'], links: 0, level: 'Registrada' },
];
const EV = Object.fromEntries(EVS.map(e => [e.id, e]));
const QS = [
  { id: 'q1', text: 'Conte sobre uma situação em que você resolveu um problema com dados.', ev: ['e1'], kw: /dados/i },
  { id: 'q2', text: 'Fale sobre uma vez em que você apresentou uma ideia para um grupo.', ev: ['e2'], kw: /apresent|pitch|comunic/i },
  { id: 'q3', text: 'Conte sobre uma situação em que você liderou outras pessoas.', ev: [], kw: /l[ií]der/i, missing: ['Uma situação de liderança, com a sua ação e o resultado registrado'] },
];
const SESS0 = [
  { id: 'aurora', title: 'Sessão Aurora', company: 'Aurora', role: 'Vaga de exemplo', status: 'encerrada', evs: ['e1', 'e2', 'e3'], lit: true },
  { id: 'sx1', title: 'Sessão exemplo A', company: 'Empresa Exemplo A', role: 'Vaga Exemplo A', status: 'pausada', evs: ['e1', 'e3'] },
  { id: 'sx2', title: 'Sessão exemplo B', company: 'Empresa Exemplo B', role: 'Vaga Exemplo B', status: 'pronta', evs: ['e2'] },
];
const STL = { pronta: 'Pronta', ativa: 'Ativa', processando: 'Processando', pausada: 'Pausada', encerrada: 'Encerrada' };
const STT = { pronta: 'info', ativa: 'success', processando: 'info', pausada: 'warning', encerrada: 'neutral' };
const STI = { pronta: 'circle-check', ativa: 'radio', processando: 'loader', pausada: 'pause', encerrada: 'lock' };
const FORM_OK = { company: 'Empresa Exemplo', role: 'Vaga de exemplo', desc: '' };
const WS0 = { status: 'ativa', q: '', asked: '', phase: 'idle', evId: null, dmode: 'normal', hist: [], saveSt: 'idle', gapSent: false, notice: '', confirmEnd: false, qErr: false };
const H1 = { q: QS[0].text, out: 'sustentada', src: 'Evidência 1' };
const answered = (q, evId, extra) => ({ ...WS0, q: q.text, asked: q.text, phase: 'answer', evId, ...extra });
const SC = {
  'sem-sessoes': { mode: 'list', sessions: [] },
  lista: { mode: 'list' },
  'sem-resultado': { mode: 'list', query: 'fintech' },
  duplicando: { mode: 'list', dup: 'aurora' },
  'prep-vazia': { mode: 'prep', form: { company: '', role: '', desc: '' }, sel: [] },
  'prep-validacao': { mode: 'prep', form: { company: '', role: '', desc: '' }, sel: [], touched: true },
  'prep-zero': { mode: 'prep', form: FORM_OK, sel: [], noElig: true },
  'prep-selecao': { mode: 'prep', form: FORM_OK, sel: ['e1', 'e2', 'e3'] },
  criando: { mode: 'prep', form: FORM_OK, sel: ['e1', 'e2', 'e3'], creating: true },
  pronta: { mode: 'ws', ws: { ...WS0, status: 'pronta' } },
  ativa: { mode: 'ws', ws: { ...WS0, hist: [H1] } },
  processando: { mode: 'ws', ws: { ...WS0, q: QS[1].text, asked: QS[1].text, phase: 'processing', hist: [H1] } },
  resposta: { mode: 'ws', ws: answered(QS[1], 'e2', { hist: [H1] }) },
  lacuna: { mode: 'ws', ws: { ...WS0, q: QS[2].text, asked: QS[2].text, phase: 'gap', hist: [H1] } },
  'lacuna-enviada': { mode: 'ws', ws: { ...WS0, q: QS[2].text, asked: QS[2].text, phase: 'gap', hist: [H1], gapSent: true } },
  'falha-ia': { mode: 'ws', ws: { ...WS0, q: QS[1].text, asked: QS[1].text, phase: 'error', hist: [H1] } },
  pausada: { mode: 'ws', ws: answered(QS[0], 'e1', { status: 'pausada' }) },
  retomada: { mode: 'ws', ws: answered(QS[0], 'e1', { notice: 'Sessão retomada. Pergunta, rascunho e histórico foram preservados.' }) },
  encerrada: { mode: 'ws', ws: answered(QS[0], 'e1', { status: 'encerrada' }), title: 'Sessão Aurora' },
  salvando: { mode: 'ws', ws: answered(QS[0], 'e1', { saveSt: 'saving' }) },
  'falha-salvar': { mode: 'ws', ws: answered(QS[0], 'e1', { saveSt: 'fail' }) },
};
const sr = { position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)', whiteSpace: 'nowrap' };
const h2s = { margin: 0, fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, letterSpacing: '-0.01em', lineHeight: 1.3, color: 'var(--text-strong)', outline: 'none' };
const ps = { margin: 0, fontSize: 13, lineHeight: 1.55, color: 'var(--text-body)', textWrap: 'pretty' };
const row = { display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' };
const col = { display: 'flex', flexDirection: 'column', gap: 12, minWidth: 0 };
const dashed = { padding: 24, borderRadius: 'var(--radius-md)', border: '1px dashed var(--border-strong)', display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'flex-start' };
const card = { background: 'var(--surface-card)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-soft)', padding: 20, display: 'flex', flexDirection: 'column', gap: 14, minWidth: 0, boxSizing: 'border-box' };
const lbl = { fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '.02em' };
const titleS = { fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, color: 'var(--text-strong)' };

function useW() {
  const ref = React.useRef(null); const [w, setW] = React.useState(0);
  React.useLayoutEffect(() => { const el = ref.current; if (!el) return; const f = () => setW(el.offsetWidth); f(); const ro = new ResizeObserver(f); ro.observe(el); return () => ro.disconnect(); }, []);
  return [ref, w];
}
function Notice() {
  return <p role="note" style={{ ...ps, display: 'flex', gap: 8, alignItems: 'flex-start', padding: '10px 14px', borderRadius: 'var(--radius-sm)', background: 'var(--amber-soft)', color: 'var(--amber-ink)', fontWeight: 500 }}><Icon name="shield-alert" size={16} style={{ marginTop: 2, flexShrink: 0 }} /><span style={{ minWidth: 0 }}>{NOTICE}</span></p>;
}
const ev2arg = e => ({ fact: e.title, competencies: e.comp, source: 'Evidência ' + e.n + ' · ' + e.level, level: String(e.level || '').toLowerCase() });
function resolveQ(text, evs) {
  const q = QS.find(x => x.text === text) || QS.find(x => x.kw.test(text));
  const ok = q ? q.ev.filter(i => evs.includes(i)) : [];
  return ok.length ? { gap: false, evId: ok[0], ids: ok } : { gap: true, missing: (q && q.missing) || ['Um registro que sustente esta pergunta, com a sua ação e o resultado'] };
}
function draftText(e, mode) {
  const base = 'Um exemplo que posso usar: ' + e.title.charAt(0).toLowerCase() + e.title.slice(1) + '. Está registrado como evidência ' + e.level.toLowerCase() + '.';
  if (mode === 'short') return 'Exemplo: ' + e.title + '. Complete com a sua ação e o resultado registrado.';
  if (mode === 'deep') return base + ' Complete com a situação, a sua ação e o resultado que você registrou. Inclua o contexto do problema e o que mudou depois, usando só o que está no registro.';
  return base + ' Complete com a situação, a sua ação e o resultado que você registrou.';
}

function LiveScreen({ scenario, width, height, agentOpen, onAgentToggle }) {
  const sc = SC[scenario] || SC.lista;
  const [mode, setMode] = React.useState(sc.mode);
  const [sessions, setSessions] = React.useState(sc.sessions || SESS0);
  const [query, setQuery] = React.useState(sc.query || '');
  const [flt, setFlt] = React.useState('todas');
  const [dup, setDup] = React.useState(sc.dup || null);
  const [form, setForm] = React.useState(sc.form || FORM_OK);
  const [sel, setSel] = React.useState(sc.sel || []);
  const [touched, setTouched] = React.useState(!!sc.touched);
  const [creating, setCreating] = React.useState(!!sc.creating);
  const [ws, setWs] = React.useState(sc.ws || WS0);
  const [msg, setMsg] = React.useState('');
  const [ref, cw] = useW();
  const hRef = React.useRef(null); const first = React.useRef(true);
  React.useEffect(() => { if (first.current) { first.current = false; return; } hRef.current && hRef.current.focus(); }, [mode]);
  React.useEffect(() => { if (!dup) return; if (sc.dup && dup === sc.dup && mode === 'list') { /* estado estático de revisão */ } }, []);
  const upd = p => setWs(w => ({ ...w, ...p }));
  const say = t => setMsg(t);
  const cols = cw >= 860 ? 3 : cw >= 520 ? 2 : 1;
  const stacked = cw < 1280 || agentOpen;
  const timers = React.useRef([]);
  React.useEffect(() => () => timers.current.forEach(clearTimeout), []);
  const later = (f, ms) => timers.current.push(setTimeout(f, ms));
  const authorized = sel.length ? sel : (sc.mode === 'ws' ? ['e1', 'e2', 'e3'] : []);
  const wsEvs = mode === 'ws' ? (ws.authorized || (scenario === 'encerrada' || scenario === 'pausada' || true ? ['e1', 'e2', 'e3'] : authorized)) : [];
  const evsNow = ws.authorized || wsEvs;
  // ---------- actions
  const ask = () => {
    const t = ws.q.trim();
    if (!t) { upd({ qErr: true }); say('Escreva ou escolha a pergunta antes de montar os argumentos.'); return; }
    upd({ phase: 'processing', asked: t, qErr: false, status: 'ativa', saveSt: 'idle', dmode: 'normal' }); say('Buscando fatos nas evidências autorizadas.');
    later(() => { const r = resolveQ(t, evsNow); setWs(w => ({ ...w, phase: r.gap ? 'gap' : 'answer', evId: r.gap ? null : r.evId, gapSent: false })); say(r.gap ? 'Lacuna encontrada: ainda não há evidência para esta pergunta.' : 'Argumentos e rascunho prontos, com origem indicada.'); }, 900);
  };
  const retry = () => ask();
  const next = () => { const out = ws.phase === 'gap' ? 'lacuna' : 'sustentada'; upd({ hist: [...ws.hist, { q: ws.asked, out, src: ws.evId ? 'Evidência ' + EV[ws.evId].n : 'Sem evidência' }], q: '', asked: '', phase: 'idle', evId: null, dmode: 'normal', saveSt: 'idle', gapSent: false }); say('Pergunta guardada no histórico. Pronto para a próxima.'); };
  const pause = () => { upd({ status: 'pausada', notice: '' }); say('Sessão pausada. Pergunta e histórico preservados.'); };
  const resume = () => { upd({ status: 'ativa', notice: 'Sessão retomada. Pergunta, rascunho e histórico foram preservados.' }); say('Sessão retomada.'); };
  const end = () => { upd({ status: 'encerrada', confirmEnd: false, notice: '' }); say('Sessão encerrada. Agora ela é somente leitura.'); };
  const other = () => { const alt = evsNow.map(i => EV[i]).filter(e => e.id !== ws.evId); if (!alt.length) { upd({ notice: 'Não há outra evidência autorizada nesta sessão.' }); say('Não há outra evidência autorizada nesta sessão.'); return; } upd({ evId: alt[0].id, dmode: 'normal', notice: 'Outra evidência autorizada: ' + alt[0].title }); say('Rascunho refeito com outra evidência autorizada.'); };
  const save = () => { upd({ saveSt: 'saving' }); say('Salvando nos Artefatos.'); later(() => { setWs(w => ({ ...w, saveSt: 'ok' })); say('Rascunho salvo nos Artefatos. Revise antes de usar.'); }, 900); };
  const dupSess = id => { setDup(id); say('Duplicando sessão.'); later(() => { const s = sessions.find(x => x.id === id); setSessions(a => [{ ...s, id: 'c' + Date.now(), title: 'Cópia de ' + s.title, status: 'pronta', lit: false }, ...a]); setDup(null); say('Sessão duplicada como pronta. Evidências e pergunta não foram copiadas como respostas.'); }, 1200); };
  const toWs = (s) => { setWs({ ...WS0, status: s.status === 'encerrada' ? 'encerrada' : s.status, authorized: s.evs, ...(s.status === 'encerrada' ? { q: QS[0].text, asked: QS[0].text, phase: 'answer', evId: 'e1' } : {}) }); setCur(s); setMode('ws'); say('Sessão aberta: ' + s.title); };
  const [cur, setCur] = React.useState(sc.mode === 'ws' ? (scenario === 'encerrada' ? SESS0[0] : { id: 'w', title: 'Sessão exemplo', company: 'Empresa Exemplo', role: 'Vaga de exemplo', evs: ['e1', 'e2', 'e3'] }) : null);
  const errs = { company: form.company.trim() ? '' : 'Informe a empresa.', role: form.role.trim() ? '' : 'Informe a vaga ou o objetivo.', sel: sel.length >= 1 ? '' : 'Selecione de 1 a 8 evidências para autorizar.' };
  const valid = !errs.company && !errs.role && !errs.sel;
  const start = () => {
    setTouched(true);
    if (!valid) { say('Preencha empresa, vaga e selecione ao menos uma evidência.'); return; }
    setCreating(true); say('Criando sessão.');
    later(() => { const s = { id: 'n' + Date.now(), title: 'Sessão ' + form.company, company: form.company, role: form.role, status: 'pronta', evs: sel }; setSessions(a => [s, ...a]); setCreating(false); setWs({ ...WS0, status: 'pronta', authorized: sel }); setCur(s); setMode('ws'); say('Sessão pronta com ' + sel.length + (sel.length === 1 ? ' evidência autorizada.' : ' evidências autorizadas.')); }, 900);
  };
  // ---------- views
  const head = (title, sub, cta) => <div style={{ ...row, justifyContent: 'space-between', gap: 12 }}>
    <div style={{ ...col, gap: 4, flex: '1 1 260px' }}><h2 ref={hRef} tabIndex={-1} style={h2s}>{title}</h2>{sub}</div>{cta}</div>;
  let body;
  if (mode === 'list') {
    const q = query.trim().toLowerCase();
    const list = sessions.filter(s => (!q || (s.title + ' ' + s.company + ' ' + s.role).toLowerCase().includes(q)) && (flt === 'todas' || (flt === 'andamento' ? ['pronta', 'ativa'].includes(s.status) : s.status === flt)));
    const filtered = q || flt !== 'todas';
    const grid = { display: 'grid', gridTemplateColumns: 'repeat(' + cols + ', minmax(0,1fr))', gap: 16 };
    body = <>
      {head('Prepare-se com o que você já registrou.', <span aria-live="polite" style={{ fontSize: 13, color: 'var(--text-body)' }}>{sessions.length ? sessions.length + (sessions.length === 1 ? ' sessão' : ' sessões') : 'Nenhuma sessão ainda'}</span>, <Button variant="brand" icon="plus" disabled={!!dup} onClick={() => { setForm({ company: '', role: '', desc: '' }); setSel([]); setTouched(false); setMode('prep'); say('Nova sessão: preparação.'); }}>Nova sessão</Button>)}
      <Notice />
      {sessions.length ? <div style={{ ...row, gap: 12 }}>
        <Input variant="search" aria-label="Buscar nas sessões" placeholder="Buscar nas sessões" value={query} onChange={e => setQuery(e.target.value)} style={{ flex: '1 1 260px', minWidth: 0 }} />
        <div role="group" aria-label="Estado da sessão" style={row}>{[['todas', 'Todas'], ['andamento', 'Em andamento'], ['pausada', 'Pausadas'], ['encerrada', 'Encerradas']].map(([id, l]) => <Chip key={id} size="sm" selected={flt === id} onClick={() => setFlt(id)}>{l}</Chip>)}</div>
      </div> : null}
      {dup ? <p role="status" style={{ ...row, ...ps }}><Badge tone="info" icon="loader">Duplicando sessão…</Badge><span>A cópia entra como pronta, sem respostas nem evidências confirmadas por você.</span></p> : null}
      {!sessions.length ? <div style={dashed}><span style={titleS}>Nenhuma sessão ainda.</span><p style={ps}>Crie uma sessão, informe a vaga e autorize as evidências que o Persona pode usar. Nada é gerado sem evidência que você selecionar.</p></div>
        : !list.length ? <div role="status" style={dashed}><span style={titleS}>Nenhuma sessão encontrada.</span><p style={ps}>Nenhum resultado para esta busca ou estado.</p><Button variant="outline" size="sm" icon="x" onClick={() => { setQuery(''); setFlt('todas'); }}>Limpar filtros</Button></div>
        : <ul style={{ ...grid, listStyle: 'none', margin: 0, padding: 0 }}>{(dup ? [{ id: 'ghost', ghost: true }] : []).concat(list).map(s => s.ghost ? <li key="g" style={{ minWidth: 0 }}><div aria-hidden="true" style={{ ...card, minHeight: 168, border: '1px dashed var(--border-strong)', boxShadow: 'none', background: 'var(--n-25)' }}><span style={{ ...lbl }}>Cópia em criação…</span></div></li>
          : <li key={s.id} style={{ ...col, gap: 8 }}>
            <EntryCard kind="sessao" title={s.title} meta={s.company + ' · ' + s.role + ' · ' + s.evs.length + (s.evs.length === 1 ? ' evidência autorizada' : ' evidências autorizadas') + (s.lit ? '' : ' · ' + SYN)} statusLabel={STL[s.status]} statusIcon={STI[s.status]} openLabel="Abrir sessão" onOpen={() => toWs(s)} />
            <div style={row}><Button variant="ghost" size="sm" icon="copy" disabled={!!dup} onClick={() => dupSess(s.id)} aria-label={'Duplicar sessão: ' + s.title}>Duplicar</Button></div></li>)}</ul>}
    </>;
  } else if (mode === 'prep') {
    const eligible = sc.noElig ? [] : EVS;
    const full = sel.length >= 8;
    const tog = (id, on) => { setSel(s => on ? [...s, id] : s.filter(x => x !== id)); };
    const showE = touched;
    const ta = { font: '400 14px/1.5 var(--font-body)', color: 'var(--text-strong)', background: 'var(--surface-card)', border: '1px solid var(--border-strong)', borderRadius: 'var(--radius-sm)', padding: '10px 12px', minHeight: 84, resize: 'vertical', width: '100%', boxSizing: 'border-box' };
    body = <>
      {head('Prepare a sessão.', <p style={ps}>Informe a vaga e escolha, você mesmo, as evidências que o Persona pode usar. Só elas sustentam argumentos e rascunhos.</p>, <Button variant="ghost" icon="arrow-left" disabled={creating} onClick={() => { setMode('list'); say('Voltou às sessões.'); }}>Voltar às sessões</Button>)}
      <Notice />
      <form noValidate onSubmit={e => { e.preventDefault(); start(); }} style={{ ...col, gap: 20 }}>
        <div style={{ ...card }}>
          <span style={titleS}>Vaga e empresa</span>
          <div style={{ display: 'grid', gridTemplateColumns: cw >= 620 ? '1fr 1fr' : '1fr', gap: 14 }}>
            <Input label="Empresa" required placeholder="Ex.: Empresa Exemplo" value={form.company} error={showE && errs.company || undefined} onChange={e => setForm({ ...form, company: e.target.value })} disabled={creating} aria-invalid={showE && !!errs.company} />
            <Input label="Vaga ou objetivo" required placeholder="Ex.: Vaga de exemplo" value={form.role} error={showE && errs.role || undefined} onChange={e => setForm({ ...form, role: e.target.value })} disabled={creating} aria-invalid={showE && !!errs.role} />
          </div>
          <label style={{ ...col, gap: 6 }}><span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-strong)' }}>Descrição da vaga <span style={{ fontWeight: 400, color: 'var(--text-muted)' }}>(opcional)</span></span>
            <textarea value={form.desc} onChange={e => setForm({ ...form, desc: e.target.value })} disabled={creating} placeholder="Cole aqui trechos da descrição, se quiser." style={ta} /></label>
          <p style={{ ...ps, color: 'var(--text-muted)' }}>Exemplos de preenchimento: {SYN.toLowerCase()}.</p>
        </div>
        <fieldset style={{ border: 0, padding: 0, margin: 0, ...col, gap: 14 }} disabled={creating}>
          <legend style={{ ...titleS, padding: 0, marginBottom: 6 }}>Evidências autorizadas</legend>
          <div style={{ ...row, justifyContent: 'space-between' }}>
            <p style={{ ...ps, flex: '1 1 260px' }}>Recomendadas a partir da sua biblioteca. Marque de 1 a 8: a decisão é sua e vale só para esta sessão.</p>
            <Badge tone={sel.length ? 'success' : 'neutral'} icon="list-checks"><span aria-live="polite">{sel.length} de 8 selecionadas</span></Badge>
          </div>
          {eligible.length ? <div style={{ display: 'grid', gridTemplateColumns: 'repeat(' + (cw >= 760 ? 2 : 1) + ', minmax(0,1fr))', gap: 14 }}>
            {eligible.map(e => <EvidenceCard key={e.id} variant="selectable" title={e.title} competencies={e.comp} level={e.level} proofCount={e.links} selected={sel.includes(e.id)} disabled={full && !sel.includes(e.id)} onSelectedChange={on => tog(e.id, on)} />)}
          </div> : <div role="status" style={dashed}><Badge tone="warning" icon="triangle-alert">Zero evidências elegíveis</Badge><p style={ps}>Você ainda não tem evidências confirmadas para autorizar. Registre ou confirme evidências no Diário e volte aqui. O Persona não inventa evidência para preencher lacuna.</p><Button variant="outline" size="sm" icon="notebook-pen">Ir ao Diário</Button></div>}
          {showE && errs.sel && eligible.length ? <p role="alert" style={{ ...ps, color: 'var(--red-ink)', fontWeight: 600 }}>{errs.sel}</p> : null}
        </fieldset>
        <div style={{ ...row, gap: 12 }}>
          <Button type="submit" variant={eligible.length ? 'brand' : 'outline'} icon={creating ? 'loader' : 'play'} disabled={creating || !eligible.length} aria-busy={creating || undefined}>{creating ? 'Criando sessão…' : 'Iniciar sessão'}</Button>
          {!eligible.length ? <span style={{ ...ps, color: 'var(--text-muted)' }}>Selecione ao menos uma evidência para iniciar.</span> : null}
          {creating ? <span role="status" style={ps}>A preparação e a seleção estão preservadas.</span> : null}
        </div>
      </form>
    </>;
  } else {
    const closed = ws.status === 'encerrada', paused = ws.status === 'pausada', proc = ws.phase === 'processing';
    const shown = proc ? 'processando' : ws.status;
    const lock = closed || paused || proc;
    const ev = ws.evId ? EV[ws.evId] : null;
    const r = ws.phase === 'gap' ? resolveQ(ws.asked, evsNow) : null;
    const argState = closed ? 'closed' : ws.phase === 'processing' ? 'processing' : ws.phase === 'error' ? 'error' : ws.phase === 'gap' ? 'gap' : 'sustained';
    const showWork = ws.phase !== 'idle';
    const argNode = <ArgumentPanel state={argState} question={ws.asked || undefined} items={ev ? [ev2arg(ev)] : []} avoid={ev ? 'resultados, números ou prazos que não estejam no registro desta evidência.' : undefined} missing={r ? r.missing : []} focused={ws.phase === 'gap' && !closed} onRegister={() => { upd({ gapSent: true }); say('Lacuna encaminhada ao Diário, com a pergunta como contexto.'); }} onSource={() => {}} onRetry={retry} error={ws.phase === 'error' ? 'A IA está indisponível agora. Sua pergunta e as evidências selecionadas continuam aqui, e os controles manuais seguem ativos.' : undefined} />;
    const dState = closed ? 'closed' : ws.phase === 'processing' ? 'processing' : ws.phase === 'error' ? 'error' : ws.phase === 'gap' ? 'gap' : 'ready';
    const draftNode = <DraftPanel state={dState} kind="comportamental" text={ev ? draftText(ev, ws.dmode) : undefined} sources={ev ? ['Evidência ' + ev.n + ' · ' + ev.title] : []} error={ws.phase === 'error' ? 'Não foi possível gerar o rascunho. Os argumentos e a seleção continuam disponíveis.' : undefined} onShorten={() => { upd({ dmode: 'short' }); say('Rascunho encurtado.'); }} onDeepen={() => { upd({ dmode: 'deep' }); say('Rascunho aprofundado.'); }} onOther={other} onCopy={() => say('Rascunho copiado.')} onSave={save} onRetry={retry} onDuplicate={() => { const s = SESS0[0]; setSessions(a => [{ ...s, id: 'c' + Date.now(), title: 'Cópia de ' + s.title, status: 'pronta', lit: false }, ...a]); say('Sessão duplicada como pronta.'); }} />;
    const dupl = ws.phase !== 'idle' || closed;
    body = <>
      <div style={{ ...card, gap: 12 }}>
        <div style={{ ...row, justifyContent: 'space-between', gap: 12 }}>
          <div style={{ ...col, gap: 4, flex: '1 1 260px' }}>
            <h2 ref={hRef} tabIndex={-1} style={h2s}>{cur ? cur.company : 'Empresa'} · {cur ? cur.role : 'Vaga'}</h2>
            <span style={{ ...ps, color: 'var(--text-muted)' }}>{cur && cur.title}{cur && cur.lit ? ' · evidências 1–3 autorizadas' : ' · ' + SYN}</span>
          </div>
          <div style={row}>
            <Badge tone={STT[shown]} icon={STI[shown]}>{'Sessão ' + STL[shown].toLowerCase()}</Badge>
            {!closed && !paused ? <Button variant="outline" size="sm" icon="pause" disabled={proc} onClick={pause}>Pausar</Button> : null}
            {paused ? <Button variant="outline" size="sm" icon="play" onClick={resume}>Retomar</Button> : null}
            {!closed ? <Button variant="outline" size="sm" icon="square" disabled={proc} onClick={() => upd({ confirmEnd: true })}>Encerrar</Button> : <Button variant="ghost" size="sm" icon="arrow-left" onClick={() => { setMode('list'); say('Voltou às sessões.'); }}>Voltar às sessões</Button>}
          </div>
        </div>
        {ws.confirmEnd ? <div role="alertdialog" aria-label="Confirmar encerramento" style={{ ...row, ...ps, padding: 12, borderRadius: 'var(--radius-sm)', background: 'var(--n-50)' }}><span style={{ flex: '1 1 240px' }}>Encerrar a sessão? Ela fica somente leitura; você poderá duplicá-la.</span><Button variant="outline" size="sm" onClick={end}>Encerrar sessão</Button><Button variant="ghost" size="sm" onClick={() => upd({ confirmEnd: false })}>Cancelar</Button></div> : null}
        {paused ? <p role="status" style={{ ...row, ...ps }}><Icon name="pause" size={14} />Sessão pausada: pergunta, rascunho e histórico estão preservados. Retome para continuar.</p> : null}
        {ws.notice && !paused ? <p role="status" style={{ ...row, ...ps }}><Icon name="info" size={14} />{ws.notice}</p> : null}
      </div>
      <Notice />
      <div style={card}>
        <div style={{ ...row, justifyContent: 'space-between' }}><span style={titleS}>Pergunta atual</span>{ws.phase === 'error' ? <Badge tone="danger" icon="triangle-alert">IA indisponível · pergunta e seleção preservadas</Badge> : null}</div>
        <Input label="Pergunta da entrevista" placeholder="Escreva ou escolha a pergunta que você recebeu" value={ws.q} disabled={lock || ws.phase === 'answer' || ws.phase === 'gap'} error={ws.qErr ? 'Escreva ou escolha a pergunta.' : undefined} onChange={e => upd({ q: e.target.value, qErr: false })} />
        {ws.phase === 'idle' && !lock ? <div role="group" aria-label="Perguntas de exemplo" style={row}><span style={lbl}>Exemplos · {SYN.toLowerCase()}</span>{QS.map(q => <Chip key={q.id} size="sm" style={{ maxWidth: '100%', whiteSpace: 'normal', height: 'auto', minHeight: 28, padding: '6px 12px', textAlign: 'left' }} selected={ws.q === q.text} onClick={() => upd({ q: q.text, qErr: false })}>{q.text}</Chip>)}</div> : null}
        <div style={row}>
          {ws.phase === 'idle' ? <Button variant="brand" icon="list-checks" disabled={lock} onClick={ask}>Montar argumentos</Button> : null}
          {(ws.phase === 'answer' || ws.phase === 'gap') && !closed ? <Button variant="outline" size="sm" icon="corner-down-right" disabled={paused} onClick={next}>Nova pergunta</Button> : null}
          {closed ? <span style={{ ...ps, display: 'flex', gap: 6, alignItems: 'center' }}><Icon name="lock" size={14} />Somente leitura</span> : <span style={{ ...ps, color: 'var(--text-muted)' }}>Seus controles manuais funcionam mesmo se a IA estiver indisponível.</span>}
        </div>
      </div>
      {showWork || closed ? <div data-order="args-draft" style={stacked ? { ...col, gap: 16 } : { display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: 16, alignItems: 'start' }}>{argNode}{draftNode}</div> : <div style={dashed}><span style={titleS}>Nenhum argumento ainda.</span><p style={ps}>Escolha a pergunta e monte os argumentos: eles só usam as evidências que você autorizou, e o rascunho nasce deles.</p></div>}
      {ws.gapSent ? <p role="status" style={{ ...row, ...ps }}><Badge tone="success" icon="notebook-pen">Lacuna encaminhada ao Diário</Badge><span>Nada foi gerado. Registre a experiência no Diário e autorize a nova evidência em uma próxima sessão.</span></p> : null}
      {ws.saveSt === 'saving' ? <p role="status" aria-busy="true" style={{ ...row, ...ps }}><Badge tone="info" icon="loader">Salvando nos Artefatos…</Badge></p> : null}
      {ws.saveSt === 'ok' ? <p role="status" style={{ ...row, ...ps }}><Badge tone="success" icon="circle-check">Salvo nos Artefatos como Rascunho</Badge><span>Revise antes de usar.</span></p> : null}
      {ws.saveSt === 'fail' ? <div role="alert" style={{ ...row, ...ps, color: 'var(--red-ink)', fontWeight: 600 }}><Icon name="triangle-alert" size={16} />Não foi possível salvar. O rascunho continua aqui, sem alterações.<Button variant="outline" size="sm" icon="refresh-cw" onClick={save}>Tentar salvar de novo</Button></div> : null}
      <div style={{ display: 'grid', gridTemplateColumns: cw >= 760 ? 'minmax(0,1fr) minmax(0,1fr)' : '1fr', gap: 16, alignItems: 'start' }}>
        <section aria-label="Histórico da sessão" style={card}><span style={titleS}>Histórico da sessão</span>
          {ws.hist.length ? <ol style={{ margin: 0, padding: 0, listStyle: 'none', ...col, gap: 10 }}>{ws.hist.map((h, i) => <li key={i} style={{ ...col, gap: 6, paddingTop: i ? 10 : 0, borderTop: i ? '1px solid var(--divider)' : 0 }}><span style={{ fontSize: 14, color: 'var(--text-strong)', lineHeight: 1.45 }}>{h.q}</span><span style={row}>{h.out === 'lacuna' ? <Badge status="lacuna" /> : <Badge tone="success" icon="badge-check">Sustentada</Badge>}<span style={{ ...ps, color: 'var(--text-muted)' }}>{h.src}</span></span></li>)}</ol> : <p style={ps}>Ainda sem perguntas nesta sessão.</p>}
        </section>
        <section aria-label="Evidências autorizadas" style={card}><span style={titleS}>Evidências autorizadas</span>
          <p style={{ ...ps, color: 'var(--text-muted)' }}>Escolhidas por você na preparação. O Agente Persona não autoriza evidências.</p>
          <ul style={{ margin: 0, padding: 0, listStyle: 'none', ...col, gap: 8 }}>{evsNow.map(id => { const e = EV[id]; return <li key={id} style={{ ...row, justifyContent: 'space-between', gap: 8 }}><span style={{ fontSize: 13, color: 'var(--text-strong)', flex: '1 1 200px', minWidth: 0 }}>{e.n} · {e.title}</span><Badge status={e.level.toLowerCase()} /></li>; })}</ul>
        </section>
      </div>
    </>;
  }
  const active = 'live';
  return <AppShell active={active} title="Persona Live" height={height} agentOpen={agentOpen} onAgentToggle={onAgentToggle} agentScreen="Persona Live" style={{ width }}>
    <div ref={ref} style={{ display: 'flex', flexDirection: 'column', gap: 20, paddingTop: 4, minWidth: 0 }}>
      <div role="status" aria-live="polite" style={sr}>{msg}</div>
      {body}
    </div>
  </AppShell>;
}
Object.assign(window, { LiveScreen, LIVE_SCENARIOS: SC });
})();
