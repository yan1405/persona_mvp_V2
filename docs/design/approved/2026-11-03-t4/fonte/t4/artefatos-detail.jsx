
const DPD = window.PersonaDesignSystem_ff1a7b;
const { SectionIndex: DIndex, EntryCard: DEntry, EvidenceCard: DEvCard, TraceLine: DTrace, Badge: DBadge, Button: DButton, Chip: DChip, Icon: DIcon } = DPD;

function aGo(id) {
  const el = document.getElementById(id); if (!el) return;
  let p = el.parentElement; while (p && !p.hasAttribute('data-shell-scroll')) p = p.parentElement;
  if (p) p.scrollTop += el.getBoundingClientRect().top - p.getBoundingClientRect().top - 84;
}
function ACite({ ev, gone }) {
  const e = A_EV[ev];
  return <button type="button" onClick={() => aGo('art-evid')} title={'Evidência ' + e.n + ': ' + e.title + (gone ? ' · fonte indisponível' : '')} aria-label={'Fonte: evidência ' + e.n + (gone ? ', indisponível' : '') + '. Ir para Evidências'}
    style={{ display: 'inline-flex', alignItems: 'center', gap: 3, margin: '0 2px 0 4px', padding: '1px 8px', minHeight: 22, borderRadius: 999, border: '1px solid ' + (gone ? 'var(--amber-ink)' : 'var(--border-strong)'), background: gone ? 'var(--amber-soft)' : 'var(--n-25)', color: gone ? 'var(--amber-ink)' : 'var(--text-strong)', fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 600, cursor: 'pointer', verticalAlign: 'baseline' }}>
    <DIcon name={gone ? 'triangle-alert' : 'link'} size={11} />E{e.n}</button>;
}
function FactLine({ f, alt, gone }) {
  return <>{alt ? f.a : f.t}{f.ev ? <ACite ev={f.ev} gone={gone.includes(f.ev)} /> : <span style={{ marginLeft: 6, fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', overflowWrap: 'anywhere' }}>{f.label || 'Declaração manual'}</span>}</>;
}
function SecBody({ s, gone }) {
  if (s.gap) return <div role="status" style={{ ...aCss.notice, borderStyle: 'dashed' }}><div style={aCss.row}><DBadge tone="warning" icon="triangle-alert">{s.optional ? 'Opcional · sem registro' : 'Lacuna de dados'}</DBadge></div><p style={aCss.p}>{s.gap}</p>{!s.manualGap ? <div style={aCss.row}><DButton variant="outline" size="sm" icon="notebook-pen">Registrar no Diário</DButton></div> : null}</div>;
  const tx = { fontSize: 15, lineHeight: 1.65, color: 'var(--text-strong)', textWrap: 'pretty', margin: 0 };
  return <>
    {s.list ? <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>{s.facts.map(f => <li key={f.id} style={{ ...tx, display: 'flex', gap: 10 }}><span aria-hidden="true" style={{ color: 'var(--text-muted)' }}>•</span><span style={{ minWidth: 0 }}><FactLine f={f} alt={s.alt} gone={gone} /></span></li>)}</ul>
      : <p style={tx}>{s.facts.map(f => <React.Fragment key={f.id}><FactLine f={f} alt={s.alt} gone={gone} />{' '}</React.Fragment>)}</p>}
    {s.srcs && s.facts.some(f => f.kind === 'manual') ? <div style={aCss.row}><span style={aCss.label}>Fontes mantidas:</span>{s.srcs.map(e => <ACite key={e} ev={e} gone={gone.includes(e)} />)}</div> : null}
    {s.note ? <p style={{ ...aCss.p, color: 'var(--amber-ink)', fontWeight: 600 }}>{s.note}</p> : null}
  </>;
}
const A_ACT = [['shorten', 'Encurtar', 'minimize-2'], ['deepen', 'Aprofundar', 'maximize-2'], ['adapt', 'Adaptar ao objetivo', 'target'], ['alt', 'Gerar alternativa', 'shuffle']];

function ArtDetail({ art: art0, init, gone: gone0, onBack, onSaved, width }) {
  const I = init || {};
  const gone = gone0 || [];
  const base = React.useMemo(() => { let a = art0; if (I.dirtyAction) { const [sid, k] = I.dirtyAction; a = { ...a, sections: a.sections.map(s => s.id === sid ? (aApply(s, k, a.objective, a.sel).s || s) : s) }; } return a; }, []);
  const [art, setArt] = React.useState(base);
  const [saved, setSaved] = React.useState({ sections: art0.sections, status: art0.status });
  const [selId, setSelId] = React.useState(I.selId || (art0.sections.find(s => !s.gap) || art0.sections[0]).id);
  const [saveSt, setSaveSt] = React.useState(I.saveSt || 'idle');
  const [busy, setBusy] = React.useState(I.busy || null);
  const [fail, setFail] = React.useState(I.fail || null);
  const [failOnce, setFailOnce] = React.useState(!!I.failOnce);
  const [msg, setMsg] = React.useState(I.msg || null);
  const [rs, setRs] = React.useState(I.restore || null);
  const [ex, setEx] = React.useState(I.ex || 'idle');
  const [copied, setCopied] = React.useState(false);
  const [edit, setEdit] = React.useState(null);
  const [view, setView] = React.useState(I.view || 'secoes');
  const [showSaved, setShowSaved] = React.useState(false);
  const [first, setFirst] = React.useState(!!I.first);
  const [flash, setFlash] = React.useState(I.flash || null);
  const T = React.useRef([]); React.useEffect(() => () => T.current.forEach(clearTimeout), []);
  const later = (fn, ms) => T.current.push(setTimeout(fn, ms));
  const dirty = JSON.stringify(art.sections) !== JSON.stringify(saved.sections);
  const [ref, cw] = aUseW();
  const wide = cw >= 900;
  const goneIn = s => aCited(s).filter(e => gone.includes(e));
  const goneAny = aAllCited(art.sections).filter(e => gone.includes(e));
  const gapN = art.sections.filter(s => s.gap && !s.optional).length;
  const pdf = !!A_PDF[art.type];
  const lock = !!busy || saveSt === 'saving' || !!rs && rs.step === 'busy';
  const touch = (fn, note) => { setArt(a => { const n = fn(a); return { ...n, status: 'rascunho' }; }); setFlash(null); setFirst(false); if (saveSt === 'saved') setSaveSt('idle'); setMsg(null); };
  const run = (sid, kind) => {
    const s = art.sections.find(x => x.id === sid); setSelId(sid); setFail(null); setMsg(null);
    setBusy({ id: sid, kind });
    later(() => {
      if (failOnce) { setFailOnce(false); setBusy(null); setFail({ id: sid, kind }); return; }
      const r = aApply(s, kind, art.objective, art.sel.filter(e => !gone.includes(e)));
      setBusy(null);
      if (r.s) touch(a => ({ ...a, sections: a.sections.map(x => x.id === sid ? r.s : x) }));
      setMsg({ id: sid, text: r.msg, tone: r.s ? 'success' : 'neutral' });
    }, 1100);
  };
  const doSave = (label) => {
    setSaveSt('saving');
    later(() => {
      const n = art.versions.length + 1;
      const v = { n, label: label || 'Edição de seção', detail: dirty ? 'Alterações salvas por ação humana. Nada foi sobrescrito: a versão anterior continua no histórico.' : 'Estado salvo.', age: 'agora', sections: aSnap(art.sections) };
      const a = { ...art, versions: [...art.versions, v], updated: 'agora' };
      setArt(a); setSaved({ sections: a.sections, status: a.status }); setSaveSt('saved'); onSaved && onSaved(a);
    }, 900);
  };
  const discard = () => { setArt(a => ({ ...a, sections: saved.sections, status: saved.status })); setSaveSt('idle'); setMsg(null); setFail(null); };
  const review = () => { setArt(a => ({ ...a, status: 'revisado' })); setSaved(s => ({ ...s, status: 'revisado' })); setFlash('reviewed'); onSaved && onSaved({ ...art, status: 'revisado' }); };
  const applyEdit = () => { const s = art.sections.find(x => x.id === edit.id); const t = edit.text.trim(); if (!t) return; touch(a => ({ ...a, sections: a.sections.map(x => x.id === edit.id ? { ...x, gap: null, optional: false, srcs: aCited(s), adapted: false, alt: false, facts: [{ id: 'manual', ev: null, kind: 'manual', t, a: t, label: 'Edição manual' }] } : x) })); setEdit(null); };
  const copy = () => { const txt = art.sections.filter(s => !s.gap).map(s => (art.type === 'pitch' ? s.title + '\n' : art.type === 'star' ? s.title + ': ' : '') + aText(s)).join('\n\n'); try { navigator.clipboard && navigator.clipboard.writeText(txt); } catch (e) {} setCopied(true); later(() => setCopied(false), 2200); };
  const exportPdf = () => { setEx('exporting'); later(() => setEx(ex === 'error' ? 'done' : 'done'), 1000); };
  const restore = v => { setRs({ v: v.n, step: 'busy' }); later(() => { const n = art.versions.length + 1; const nv = { n, label: 'Restaurada da versão ' + v.n, detail: 'Conteúdo da versão ' + v.n + ' restaurado por ação humana. As demais versões foram mantidas.', age: 'agora', sections: aSnap(v.sections) }; const a = { ...art, status: 'rascunho', sections: aSnap(v.sections), versions: [...art.versions, nv], updated: 'agora' }; setArt(a); setSaved({ sections: a.sections, status: 'rascunho' }); setRs(null); setFlash('restored:' + v.n); setSaveSt('idle'); onSaved && onSaved(a); }, 1000); };
  const cur = art.versions[art.versions.length - 1];
  const primary = saveSt === 'conflict' ? { l: 'Salvar minha versão', f: () => doSave('Minha versão após conflito'), i: 'check' }
    : dirty ? { l: saveSt === 'saving' ? 'Salvando…' : 'Salvar alterações', f: () => doSave(), i: saveSt === 'saving' ? 'loader' : 'check' }
    : art.status === 'rascunho' ? { l: 'Marcar como revisado', f: review, i: 'check-check', off: goneAny.length ? 'Há fonte indisponível. Resolva antes de revisar.' : null } : null;
  const allCited = aAllCited(art.sections);
  const traceSteps = [
    { kind: 'evidencia', label: 'Evidências', meta: allCited.map(e => 'E' + A_EV[e].n).join(' · ') || 'Nenhuma', state: allCited.length ? 'done' : 'gap' },
    { kind: 'prova', label: 'Provas', meta: allCited.filter(e => A_EV[e].links.length).length + ' de ' + allCited.length + ' com link', state: allCited.every(e => A_EV[e].links.length) ? 'done' : 'gap' },
    { kind: 'uso', label: 'Artefato', meta: A_TLABEL[art.type] + ' · v' + cur.n, state: goneAny.length ? 'gap' : 'done' },
  ];
  const secCard = s => {
    const isSel = selId === s.id, isBusy = busy && busy.id === s.id, g = goneIn(s), editing = edit && edit.id === s.id;
    const nocts = !!g.length || s.gap || lock || !!edit;
    return <section key={s.id} id={'sec-' + s.id} aria-labelledby={'sec-' + s.id + '-h'} aria-busy={isBusy || undefined} style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: 20, borderRadius: 'var(--radius-md)', background: 'var(--surface-card)', border: isSel ? '2px solid var(--brand-strong)' : '2px solid transparent', boxShadow: 'var(--shadow-soft)' }}>
      <div style={{ ...aCss.row, justifyContent: 'space-between' }}>
        <h4 id={'sec-' + s.id + '-h'} style={{ ...aCss.h3, fontSize: 15 }}>{s.title}</h4>
        <div style={aCss.row}>
          {isBusy ? <DBadge tone="info" icon="loader">Gerando seção…</DBadge> : null}
          {g.length ? <DBadge tone="warning" icon="triangle-alert">{'Fonte indisponível · E' + g.map(e => A_EV[e].n).join(', E')}</DBadge> : null}
          {!isSel ? <DButton variant="ghost" size="sm" icon="mouse-pointer-click" disabled={lock} onClick={() => setSelId(s.id)}>Selecionar seção</DButton> : <DBadge tone="neutral" icon="mouse-pointer-click">Seção selecionada</DBadge>}
        </div>
      </div>
      {editing ? <>
        <ATextarea label={'Editar texto · ' + s.title} rows={5} value={edit.text} onChange={e => setEdit({ ...edit, text: e.target.value })} hint="O texto editado mantém as fontes da seção como referência. Confira se ainda se sustenta nelas." />
        <div style={aCss.row}><DButton variant="solid" size="sm" icon="check" disabled={!edit.text.trim()} onClick={applyEdit}>Aplicar edição</DButton><DButton variant="ghost" size="sm" onClick={() => setEdit(null)}>Cancelar</DButton></div>
      </> : <div style={{ opacity: isBusy ? 0.9 : 1 }}><SecBody s={s} gone={gone} /></div>}
      {fail && fail.id === s.id ? <ANotice role="alert" tone="danger" icon="triangle-alert" badge="A seção não foi gerada" actions={<><DButton variant="outline" size="sm" icon="refresh-cw" onClick={() => run(s.id, fail.kind)}>Tentar de novo</DButton><DButton variant="ghost" size="sm" onClick={() => setFail(null)}>Dispensar</DButton></>}>Falha ao executar “{A_ACT.find(a => a[0] === fail.kind)[1]}”. O conteúdo desta seção foi preservado como estava.</ANotice> : null}
      {msg && msg.id === s.id ? <div role="status" style={aCss.row}><DBadge tone={msg.tone === 'success' ? 'success' : 'neutral'} icon={msg.tone === 'success' ? 'circle-check' : 'info'}>{msg.tone === 'success' ? 'Seção atualizada' : 'Sem alteração'}</DBadge><span style={aCss.p}>{msg.text}</span></div> : null}
      {isSel && !editing ? <div role="group" aria-label={'Ações de IA para a seção ' + s.title} style={{ ...aCss.row, borderTop: '1px solid var(--divider)', paddingTop: 12 }}>
        {A_ACT.map(([k, l, ic]) => <DButton key={k} variant="outline" size="sm" icon={isBusy && busy.kind === k ? 'loader' : ic} disabled={nocts} onClick={() => run(s.id, k)}>{l}</DButton>)}
        <DButton variant="ghost" size="sm" icon="pencil" disabled={lock || !!g.length || (s.gap && s.manualGap === undefined && false)} onClick={() => setEdit({ id: s.id, text: s.gap ? '' : aText(s) })}>{s.gap ? 'Escrever manualmente' : 'Editar texto'}</DButton>
        {s.gap ? <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Ações de IA indisponíveis: não há fato para gerar.</span> : g.length ? <span style={{ fontSize: 12, color: 'var(--amber-ink)' }}>Ações de IA bloqueadas: fonte indisponível.</span> : null}
      </div> : null}
    </section>;
  };
  const preview = <div aria-label="Pré-visualização do documento" style={{ background: '#fff', borderRadius: 8, border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-soft)', padding: '40px 44px', display: 'flex', flexDirection: 'column', gap: 18, fontFamily: 'var(--font-body)', color: '#1A1726', maxWidth: 720, boxSizing: 'border-box', width: '100%' }}>
    {art.sections.map(s => <div key={s.id} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <span style={{ fontFamily: 'var(--font-display)', fontSize: 12, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--n-800)' }}>{s.title}</span>
      {s.gap ? <span style={{ fontSize: 13, color: 'var(--amber-ink)', fontWeight: 600 }}>[Pendente: {s.title.toLowerCase()}]</span>
        : s.list ? s.facts.map(f => <span key={f.id} style={{ fontSize: 13, lineHeight: 1.55 }}>• {s.alt ? f.a : f.t}</span>) : <span style={{ fontSize: 13, lineHeight: 1.6 }}>{aText(s)}</span>}
    </div>)}
  </div>;
  const evSec = <section id="art-evid" aria-labelledby="art-evid-h" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
    <h3 id="art-evid-h" style={aCss.h3}>Evidências</h3>
    <p style={aCss.p}>Correspondência entre os trechos do conteúdo e as evidências autorizadas. {A_SYN}: links e datas.</p>
    <DTrace title="Rastreabilidade" steps={traceSteps} />
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 14 }}>
      {allCited.map(id => { const e = A_EV[id]; const used = art.sections.filter(s => aCited(s).includes(id)).map(s => s.title);
        return <div key={id} style={{ display: 'flex', flexDirection: 'column', gap: 8, minWidth: 0 }}>
          {gone.includes(id) ? <ANotice role="alert" tone="warning" icon="triangle-alert" badge={'Evidência ' + e.n + ' · fonte indisponível'}>{e.title}. A fonte foi arquivada ou removida. Os trechos que a citam foram preservados, mas não podem ser regenerados.</ANotice>
            : <DEvCard title={e.title} competencies={e.comp} level={e.level} proofCount={e.links.length} origin={e.origin} />}
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Citada em: {used.join(' · ')}</span>
        </div>; })}
    </div>
    {!allCited.length ? <ANotice tone="warning" icon="triangle-alert" badge="Nenhuma evidência citada">Este artefato não cita fonte.</ANotice> : null}
  </section>;
  const verSec = <section id="art-vers" aria-labelledby="art-vers-h" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
    <h3 id="art-vers-h" style={aCss.h3}>Versões</h3>
    <p style={aCss.p}>Cada geração e cada salvamento cria uma versão. Restaurar nunca apaga as outras. Datas: {A_SYN.toLowerCase()}.</p>
    {dirty ? <div role="status" style={aCss.row}><DBadge tone="warning" icon="pencil">Alterações não salvas</DBadge><span style={aCss.p}>Salve ou descarte antes de restaurar uma versão.</span></div> : null}
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 14 }}>
      {[...art.versions].reverse().map(v => { const isCur = v.n === cur.n; return <div key={v.n} style={{ display: 'flex', flexDirection: 'column', gap: 8, minWidth: 0 }}>
        <DEntry kind="versao" date={v.age} title={'Versão ' + v.n + ' · ' + v.label} meta={v.detail} statusLabel={isCur ? 'Versão atual' : 'Anterior'} statusIcon={isCur ? 'circle-check' : 'history'} />
        {!isCur && !(rs && rs.v === v.n) ? <div style={aCss.row}><DButton variant="outline" size="sm" icon="history" disabled={dirty || lock} onClick={() => setRs({ v: v.n, step: 'confirm' })}>Restaurar versão {v.n}</DButton></div> : null}
        {rs && rs.v === v.n ? <ANotice role="alertdialog" tone="warning" icon="history" badge={'Restaurar a versão ' + v.n + '?'} actions={rs.step === 'busy' ? <DBadge tone="info" icon="loader">Restaurando…</DBadge> : <><DButton variant="solid" size="sm" icon="history" onClick={() => restore(v)}>Restaurar versão {v.n}</DButton><DButton variant="ghost" size="sm" onClick={() => setRs(null)}>Cancelar</DButton></>}>O conteúdo da versão {v.n} vira a versão atual como uma nova versão {art.versions.length + 1}. A versão {cur.n} continua no histórico e o estado volta para Rascunho.</ANotice> : null}
      </div>; })}
    </div>
  </section>;
  const idx = <DIndex title="Neste artefato" items={[{ id: 'art-conteudo', label: 'Conteúdo', meta: art.sections.length + ' seções' }, { id: 'art-evid', label: 'Evidências', meta: allCited.length + (allCited.length === 1 ? ' fonte' : ' fontes') }, { id: 'art-vers', label: 'Versões', meta: String(art.versions.length) }]} />;
  return <div ref={ref} style={{ display: 'flex', flexDirection: 'column', gap: 20, minWidth: 0 }}>
    <div><DButton variant="ghost" size="sm" icon="arrow-left" onClick={onBack}>Voltar para Artefatos</DButton></div>
    <header style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ ...aCss.row, justifyContent: 'space-between', gap: 12 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, minWidth: 0, flex: '1 1 320px' }}>
          <span style={aCss.label}>{A_TLABEL[art.type]}</span>
          <h2 style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, letterSpacing: '-0.015em', lineHeight: 1.25, color: 'var(--text-strong)' }}>{art.title}</h2>
          <span style={aCss.p}>Objetivo: {art.objective}</span>
        </div>
        <div style={{ ...aCss.row, justifyContent: 'flex-end' }}>
          {pdf ? <DButton variant="outline" icon={ex === 'exporting' ? 'loader' : 'file-down'} disabled={ex === 'exporting' || lock} onClick={exportPdf}>{ex === 'exporting' ? 'Exportando…' : 'Exportar PDF'}</DButton> : <DButton variant="outline" icon={copied ? 'check' : 'copy'} disabled={lock} onClick={copy}>{copied ? 'Copiado' : 'Copiar texto'}</DButton>}
          {primary ? <DButton variant="brand" icon={primary.i} disabled={lock || !!primary.off} onClick={primary.f}>{primary.l}</DButton> : <DButton variant="ghost" icon="pencil" onClick={() => setArt(a => ({ ...a, status: 'rascunho' }))}>Reabrir como rascunho</DButton>}
        </div>
      </div>
      <div style={aCss.row}>
        <DBadge status={art.status} />
        {saveSt === 'saving' ? <DBadge tone="info" icon="loader">Salvando…</DBadge> : saveSt === 'conflict' ? <DBadge tone="warning" icon="triangle-alert">Conflito de versão</DBadge> : dirty ? <DBadge tone="warning" icon="pencil">Alterações não salvas</DBadge> : saveSt === 'saved' ? <DBadge tone="success" icon="circle-check">Salvo · versão {cur.n}</DBadge> : <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Versão {cur.n} · atualizado {art.updated}</span>}
        {dirty && saveSt !== 'saving' ? <DButton variant="ghost" size="sm" icon="undo-2" onClick={discard}>Descartar alterações</DButton> : null}
      </div>
      {primary && primary.off ? <p style={{ ...aCss.p, color: 'var(--amber-ink)', fontWeight: 600 }}>{primary.off}</p> : null}
      {first ? <ANotice role="status" tone="success" icon="circle-check" badge="Primeira versão criada">A versão 1 foi gerada só com as evidências que você autorizou e está como Rascunho. Revise cada seção antes de marcar como Revisado.{gapN ? ' ' + gapN + (gapN === 1 ? ' seção ficou' : ' seções ficaram') + ' como lacuna.' : ''}</ANotice> : null}
      {flash === 'reviewed' ? <div role="status" style={aCss.row}><DBadge tone="success" icon="check-check">Marcado como Revisado por você</DBadge><span style={aCss.p}>Copiar ou exportar não altera este estado.</span></div> : null}
      {flash && flash.startsWith('restored') ? <div role="status" style={aCss.row}><DBadge tone="success" icon="history">{'Versão ' + flash.split(':')[1] + ' restaurada'}</DBadge><span style={aCss.p}>Criada a versão {cur.n}. Estado: Rascunho.</span></div> : null}
      {art.status === 'rascunho' && saved.status === 'revisado' && dirty ? <p style={aCss.p}>Editar um artefato Revisado o devolve a Rascunho. Descartar as alterações restaura o estado Revisado.</p> : null}
      {saveSt === 'conflict' ? <ANotice role="alert" tone="warning" icon="triangle-alert" badge="Conflito de versão" actions={<>{!showSaved ? <DButton variant="ghost" size="sm" icon="history" onClick={() => setShowSaved(true)}>Ver versão salva</DButton> : null}<DButton variant="ghost" size="sm" icon="x" onClick={() => { discard(); setShowSaved(false); }}>Manter versão salva</DButton></>}>Este artefato foi alterado em outra aba (versão {cur.n + 1}) depois que você começou a editar. Sua versão foi mantida e nada foi sobrescrito; escolha qual fica.{showSaved ? ' Versão salva: ' + (cur.label) + '.' : ''}</ANotice> : null}
      {ex === 'done' ? <div role="status" style={aCss.row}><DBadge tone="success" icon="printer">Impressão aberta</DBadge><span style={aCss.p}>Escolha “Salvar como PDF” na janela de impressão do navegador. Exportar não marca como Revisado.</span></div> : null}
      {ex === 'error' ? <ANotice role="alert" tone="danger" icon="triangle-alert" badge="Exportação falhou" actions={<DButton variant="outline" size="sm" icon="refresh-cw" onClick={exportPdf}>Tentar de novo</DButton>}>Não foi possível abrir a impressão do navegador. O conteúdo está intacto e o estado não mudou. Você também pode usar Ctrl/⌘+P.</ANotice> : null}
      {pdf && ex === 'idle' ? <p style={{ ...aCss.p, color: 'var(--text-muted)' }}>“Exportar PDF” usa a impressão do navegador: escolha “Salvar como PDF”.</p> : null}
    </header>
    <div style={{ display: 'grid', gridTemplateColumns: wide ? '200px minmax(0,1fr)' : 'minmax(0,1fr)', gap: 24, alignItems: 'start' }}>
      <div style={wide ? { position: 'sticky', top: 84 } : null}>{idx}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 36, minWidth: 0 }}>
        <section id="art-conteudo" aria-labelledby="art-conteudo-h" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ ...aCss.row, justifyContent: 'space-between' }}>
            <h3 id="art-conteudo-h" style={aCss.h3}>Conteúdo</h3>
            {pdf ? <div role="group" aria-label="Visão do conteúdo" style={aCss.row}><DChip size="sm" icon="layout-list" selected={view === 'secoes'} onClick={() => setView('secoes')}>Seções</DChip><DChip size="sm" icon="eye" selected={view === 'previa'} onClick={() => setView('previa')}>Pré-visualização</DChip></div> : null}
          </div>
          {view === 'previa' && pdf ? <>{gapN ? <ANotice tone="warning" icon="triangle-alert" badge={gapN + (gapN === 1 ? ' lacuna' : ' lacunas')}>As lacunas saem como “[Pendente]” no PDF. As marcas de fonte não são impressas. Complete antes de enviar a alguém.</ANotice> : null}{preview}</>
            : <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}><p style={aCss.p}>Selecione uma seção para usar as ações de IA. Elas só reorganizam fatos das evidências autorizadas; nada é gerado sem fonte.</p>{art.sections.map(secCard)}</div>}
        </section>
        {evSec}
        {verSec}
      </div>
    </div>
  </div>;
}
Object.assign(window, { ArtDetail, aGo });
