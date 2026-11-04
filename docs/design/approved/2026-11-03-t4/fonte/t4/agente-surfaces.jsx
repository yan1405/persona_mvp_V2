/* T4.8 — superfícies: conversa central no Início; AgentPanel acoplado em Evidências e Persona Live. */
const AGS = window.PersonaDesignSystem_ff1a7b;
const { AppShell: AgShell, AgentPanel: AgPanel, AgentPrompt: AgPromptDS, Composer: AgComposer, MessageBubble: AgBubble, FocalJourney: AgFocal, Card: AgCard, Badge: AgSBadge, Button: AgSButton, Chip: AgSChip, Icon: AgSIcon } = AGS;

const AG_CHIPS = {
  inicio: ['O que falta para o score observado?', 'Organize minhas evidências', 'Preparar uma entrevista'],
  evidencias: ['Quais evidências ainda não têm link?', 'Organize minhas evidências', 'O que falta para o score observado?'],
  live: ['Preparar uma entrevista', 'Fale de um conflito em equipe.', 'Criar um Artefato'],
};
const agH2 = { margin: 0, fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, letterSpacing: '-0.01em', color: 'var(--text-strong)' };
const agP = { margin: 0, fontSize: 13, lineHeight: 1.5, color: 'var(--text-body)', textWrap: 'pretty' };
const AG_COMPOSER = 'textarea[aria-label="Mensagem para o Agente Persona"]';

/* O cabeçalho do AppShell não recebe o estado do painel externo: sincronizamos semântica e rótulo. */
function useHeaderSync(rootRef, { open, unavailable, mode, onAsk }) {
  const askRef = React.useRef(onAsk); askRef.current = onAsk;
  React.useEffect(() => {
    const r = rootRef.current; if (!r) return;
    const b = r.querySelector('[data-shell-header] button[aria-pressed]');
    if (b) {
      if (mode === 'central') { b.removeAttribute('aria-expanded'); b.removeAttribute('aria-pressed'); b.setAttribute('aria-label', 'Agente: ir para a conversa'); b.title = 'Agente: ir para a conversa'; }
      else { b.setAttribute('aria-expanded', String(!!open)); b.setAttribute('aria-pressed', String(!!open)); b.setAttribute('aria-label', open ? 'Agente (aberto)' : 'Agente'); b.title = open ? 'Agente (aberto)' : 'Agente'; b.dataset.agentOpen = open ? '1' : '0'; const a = r.querySelector('aside[aria-label="Agente Persona"]'); if (a && a.id) b.setAttribute('aria-controls', a.id); }
    }
    const inp = r.querySelector('[data-shell-header] input[type="search"]');
    if (inp) { const ph = unavailable ? 'Buscar em registros e evidências' : 'Buscar ou perguntar'; inp.placeholder = ph; inp.setAttribute('aria-label', ph); }
  });
  React.useEffect(() => {
    const r = rootRef.current; if (!r) return;
    const f = r.querySelector('[data-shell-header] form[role="search"]'); if (!f) return;
    const h = () => { const i = f.querySelector('input'); const v = i && i.value.trim(); if (v && askRef.current) askRef.current(v); };
    f.addEventListener('submit', h); return () => f.removeEventListener('submit', h);
  }, []);
}

function useCmdK(fn) {
  const ref = React.useRef(fn); ref.current = fn;
  React.useEffect(() => { const k = e => { if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); ref.current(); } }; document.addEventListener('keydown', k); return () => document.removeEventListener('keydown', k); }, []);
}

/* ---------------- Início: conversa central ---------------- */
function CentralConversation({ ag }) {
  const ref = React.useRef(null);
  React.useEffect(() => { const el = ref.current; if (el) el.scrollTop = el.scrollHeight; }, [ag.bubbles.length]);
  return <AgCard padding={24} radius="lg" style={{ minWidth: 0 }}>
    <section aria-labelledby="ag-c-h" style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
        <h2 id="ag-c-h" style={agH2}>Conversa com o Agente Persona</h2>
        <AgSBadge tone="neutral" icon="clock">Só nesta sessão</AgSBadge>
        <span style={{ marginLeft: 'auto' }}><AgSButton variant="ghost" size="sm" icon="x" onClick={() => { ag.reset(); setTimeout(() => { const t = document.querySelector('[data-ag-central] ' + AG_COMPOSER); t && t.focus(); }, 0); }}>Limpar conversa</AgSButton></span>
      </div>
      <div ref={ref} role="log" aria-live="polite" aria-label="Conversa com o Agente Persona" style={{ display: 'flex', flexDirection: 'column', gap: 16, minWidth: 0 }}>
        {ag.bubbles.length ? ag.bubbles.map((m, i) => <AgBubble key={i} {...m}>{m.text}</AgBubble>) : <p style={agP}>Pergunte sobre suas evidências, seu score ou a próxima entrevista. Eu só uso o que você registrou.</p>}
      </div>
      <div data-ag-central="">
        <AgComposer value={ag.draft} onChange={ag.setDraft} onSend={q => ag.ask(q)} suggestions={AG_CHIPS.inicio} onSuggestion={q => ag.ask(q)} footer={window.AG_FOOTER} />
      </div>
    </section>
  </AgCard>;
}

function SearchFallback({ onOpen }) {
  const [q, setQ] = React.useState('python');
  const [done, setDone] = React.useState('python');
  const res = window.agSearch(done);
  return <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
    <AgPromptDS size="large" placeholder="Buscar em registros e evidências" suggestions={[]} value={q} onChange={setQ} onSubmit={setDone} />
    <div role="status" style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
      <AgSBadge tone="warning" icon="triangle-alert">Agente indisponível</AgSBadge>
      <span style={agP}>Nada foi alterado. O campo virou busca simples em registros e evidências; o restante do Início continua funcionando.</span>
    </div>
    {done ? <AgCard padding={20} radius="md"><section aria-label="Resultados da busca" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', fontFeatureSettings: "'tnum'" }}>{res.length + (res.length === 1 ? ' resultado' : ' resultados') + ' para “' + done + '”'}</span>
      {res.length ? <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>{res.map(id => { const s = window.AG_REG[id]; return <li key={id} style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', padding: '10px 12px', borderRadius: 'var(--radius-sm)', background: 'var(--n-25)' }}>
        <span style={{ flex: '1 1 220px', minWidth: 0, fontSize: 14, fontWeight: 600, color: 'var(--text-strong)' }}>{s.title}</span>
        {s.kind === 'evidence' ? <AgSBadge status={s.level.toLowerCase()} /> : <AgSBadge status="para-revisar" />}
        <window.CitationChip id={id} onOpen={onOpen} />
      </li>; })}</ul> : <p style={agP}>Nenhum resultado em registros e evidências.</p>}
    </section></AgCard> : null}
  </div>;
}

function AgenteInicio({ stateKey, width, height }) {
  const P = window.InicioParts; const s = P.STATES.completo;
  const ag = useAgentSession(stateKey);
  const rootRef = React.useRef(null);
  const started = ag.items.length > 0 || stateKey === 'digitando';
  const [convo, setConvo] = React.useState(started);
  React.useEffect(() => { if (ag.items.length) setConvo(true); }, [ag.items.length]);
  const focusCentral = () => { const r = rootRef.current; const t = r && (r.querySelector('[data-ag-central] ' + AG_COMPOSER) || r.querySelector('[data-ag-home] input[type="search"]')); t && t.focus(); };
  useHeaderSync(rootRef, { mode: 'central', unavailable: ag.unavailable, onAsk: q => { if (!ag.unavailable) { setConvo(true); ag.ask(q); } } });
  useCmdK(focusCentral);
  React.useEffect(() => { if (stateKey === 'digitando') setTimeout(focusCentral, 60); }, []);
  const lead = ag.unavailable ? <SearchFallback onOpen={ag.setCite} />
    : convo ? <CentralConversation ag={ag} />
    : <div data-ag-home="" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <AgPromptDS size="large" onSubmit={q => { setConvo(true); ag.ask(q); }} onSuggestion={q => { setConvo(true); ag.ask(q); }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}><AgSBadge tone="neutral" icon="sparkles">Agente em protótipo</AgSBadge><span style={agP}>Responde só com o que você registrou e cita a origem. A conversa vale só para esta sessão.</span></div>
      </div>;
  return <div ref={rootRef} className="t48-surface" style={{ position: 'relative', width, height, overflow: 'hidden' }}>
    <AgShell active="inicio" title="Início" height={height} badges={s.badges} agentOpen={false} onAgentToggle={focusCentral} style={{ width }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 28, paddingTop: 4, minWidth: 0 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}><P.Greeting s={s} />{lead}</div>
        {convo && !ag.unavailable ? <h2 style={{ ...agH2, fontSize: 15, color: 'var(--text-body)' }}>O briefing continua aqui.</h2> : null}
        <AgFocal breakpoint={1000} />
        <P.Tiles s={s} />
        <P.ScoreBlock s={s} />
      </div>
    </AgShell>
    <window.SourceDetail id={ag.cite} onClose={() => ag.setCite(null)} />
  </div>;
}

/* ---------------- Evidências e Persona Live: AgentPanel acoplado ---------------- */
function AgenteDock({ surface, stateKey, width, height, initialOpen }) {
  const [open, setOpen] = React.useState(initialOpen);
  const ag = useAgentSession(stateKey);
  const rootRef = React.useRef(null);
  const first = React.useRef(true);
  const Screen = surface === 'evidencias' ? window.EvidenciasScreen : window.LiveScreen;
  const scenario = surface === 'evidencias' ? 'completa' : 'resposta';
  const label = surface === 'evidencias' ? 'Evidências' : 'Persona Live';
  const agentW = width >= 1440 ? 400 : 380;
  const sheet = width < 640;
  const shellW = sheet ? width : width - (open ? agentW + 16 : 64 + 16);
  React.useEffect(() => {
    if (!(sheet && open)) return;
    const k = e => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', k);
    return () => document.removeEventListener('keydown', k);
  }, [sheet, open]);
  const focusIn = () => { const r = rootRef.current; if (!r) return; const t = r.querySelector('aside ' + AG_COMPOSER + ':not([disabled])') || r.querySelector('aside [role="log"]'); t && t.focus(); };
  React.useEffect(() => {
    if (first.current) { first.current = false; if (stateKey === 'digitando' && open) setTimeout(focusIn, 60); return; }
    const id = requestAnimationFrame(() => { if (open) focusIn(); else { const b = rootRef.current && rootRef.current.querySelector('button[aria-label="Expandir Agente Persona"]'); b && b.focus(); } });
    return () => cancelAnimationFrame(id);
  }, [open]);
  useHeaderSync(rootRef, { open, unavailable: ag.unavailable, mode: 'dock', onAsk: q => { if (!ag.unavailable) { setOpen(true); ag.ask(q); } } });
  useCmdK(() => { if (!open) setOpen(true); else focusIn(); });
  const emptyText = ag.unavailable
    ? <><AgSBadge tone="warning" icon="triangle-alert">Agente indisponível</AgSBadge>{' '}Nada foi alterado. A busca no topo da tela continua funcionando só como busca em registros e evidências.</>
    : 'Pergunte sobre suas evidências, seu score ou a próxima entrevista. Eu só uso o que você registrou.';
  return <div ref={rootRef} className="t48-surface t48-dock" style={{ position: 'relative', width, height, display: 'flex', background: 'var(--bg-app)', overflow: 'hidden' }}>
    <div data-ag-main="" style={{ position: 'relative', flex: '0 0 ' + shellW + 'px', width: shellW, height }}>
      <Screen key={surface} scenario={scenario} width={shellW} height={height} agentOpen={false} onAgentToggle={() => setOpen(o => !o)} />
      <window.SourceDetail id={ag.cite} onClose={() => ag.setCite(null)} />
    </div>
    {sheet && open ? <div aria-hidden="true" onClick={() => setOpen(false)} style={{ position: 'absolute', inset: 0, background: 'rgb(26 23 38 / 0.18)', zIndex: 60 }} /> : null}
    {sheet && !open ? null : <div {...(sheet ? { role: 'dialog', 'aria-modal': 'true', 'aria-label': 'Agente Persona' } : {})} style={sheet ? { position: 'absolute', top: 8, right: 8, bottom: 8, width: 'min(400px, calc(100% - 16px))', display: 'flex', zIndex: 61 } : { flexShrink: 0, height, padding: '16px 16px 16px 0', boxSizing: 'border-box', display: 'flex' }}>
      <AgPanel open={open} onToggle={setOpen} screen={label} messages={ag.bubbles} emptyText={emptyText}
        composerProps={{ value: ag.draft, onChange: ag.setDraft, disabled: ag.unavailable, placeholder: ag.unavailable ? 'Agente indisponível' : 'Pergunte ao Agente Persona…', suggestions: ag.unavailable || ag.items.length ? [] : AG_CHIPS[surface], onSuggestion: q => ag.ask(q), footer: window.AG_FOOTER }}
        onSend={q => ag.ask(q)} style={sheet ? { width: '100%' } : open ? { width: agentW } : undefined} />
    </div>}
  </div>;
}

Object.assign(window, { AgenteInicio, AgenteDock, AG_CHIPS });
