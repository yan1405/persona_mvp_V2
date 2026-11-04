
const APD = window.PersonaDesignSystem_ff1a7b;
const { StepFlow: AStep, EvidenceCard: AEvCard, Badge: ABadge, Button: AButton, Chip: AChip, Input: AInput, Icon: AIcon, FIELD_FOCUS: A_FF } = APD;
const aCss = {
  h3: { margin: 0, fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, letterSpacing: '-0.01em', color: 'var(--text-strong)' },
  p: { margin: 0, fontSize: 13, lineHeight: 1.55, color: 'var(--text-body)', textWrap: 'pretty' },
  label: { fontSize: 12, fontWeight: 600, color: 'var(--text-muted)' },
  row: { display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' },
  notice: { display: 'flex', flexDirection: 'column', gap: 10, padding: 16, borderRadius: 'var(--radius-sm)', background: 'var(--n-25)', border: '1px solid var(--border-subtle)' },
};
function ANotice({ tone, icon, badge, children, actions, role, style }) {
  return <div role={role} style={{ ...aCss.notice, ...style }}>
    <div style={aCss.row}><ABadge tone={tone} icon={icon}>{badge}</ABadge></div>
    {children ? <p style={aCss.p}>{children}</p> : null}
    {actions ? <div style={aCss.row}>{actions}</div> : null}
  </div>;
}
function ATextarea({ label, value, onChange, rows = 3, placeholder, hint, disabled }) {
  const [f, setF] = React.useState(false);
  return <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
    <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-strong)' }}>{label}</span>
    <textarea value={value} onChange={onChange} onFocus={() => setF(true)} onBlur={() => setF(false)} rows={rows} placeholder={placeholder} disabled={disabled}
      style={{ width: '100%', boxSizing: 'border-box', resize: 'vertical', padding: '10px 14px', fontFamily: 'var(--font-body)', fontSize: 14, lineHeight: 1.5, color: 'var(--text-strong)', background: 'var(--surface-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', outline: 0, ...(f ? A_FF : {}) }} />
    {hint ? <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{hint}</span> : null}
  </label>;
}
const A_STEP_TITLES = ['Escolha o tipo de Artefato', 'Qual é o objetivo?', 'Contexto da oportunidade', 'Dados complementares', 'Fontes e evidências', 'Gerar e revisar'];

function aReason(type, id) {
  const r = A_ROLE_KEYS(id);
  if (type === 'star') return r.includes('sit') && r.includes('res') ? 'Registra situação, tarefa, ação e resultado: sustenta a STAR completa.' : 'Registra só a ação: Situação, Tarefa e Resultado ficam como lacuna.';
  return A_EV[id].links.length ? 'Documentada com ' + A_EV[id].links.length + (A_EV[id].links.length === 1 ? ' link' : ' links') + ' de prova.' : 'Registrada, sem link de prova.';
}
const A_ROLE_KEYS = id => ({ e1: ['sit', 'tar', 'act', 'res'], e2: ['act'], e3: ['act'], e4: ['act'] }[id]);

function CreateFlow({ init, onClose, onCreated }) {
  const i = init || {};
  const [step, setStep] = React.useState(i.step || 1);
  const [type, setType] = React.useState(i.type || null);
  const [objective, setObjective] = React.useState(i.objective != null ? i.objective : '');
  const [company, setCompany] = React.useState(i.company || '');
  const [desc, setDesc] = React.useState(i.desc || '');
  const [man, setMan] = React.useState(i.man || { email: '', formacao: '', idiomas: '' });
  const [sel, setSel] = React.useState(i.sel || []);
  const [auth, setAuth] = React.useState(!!i.auth);
  const [gen, setGen] = React.useState(i.gen || 'idle');
  const [force, setForce] = React.useState(i.force || null);
  const [tried, setTried] = React.useState(!!i.tried);
  const [agentNote, setAgentNote] = React.useState(!!i.agent);
  const avail = i.evs || A_EVIDS;
  const pdf = !!A_PDF[type];
  const objOk = objective.trim().length >= 8;
  const emailOk = !man.email.trim() || /^\S+@\S+\.\S+$/.test(man.email.trim());
  const secs = type ? aGenerate(type, sel, { ...man, synthetic: man.email === A_MAN0.email }, objective.trim() || A_OBJ) : [];
  const gaps = secs.filter(s => s.gap && !s.optional);
  const errs = {
    1: !type ? 'Escolha um tipo para continuar.' : null,
    2: !objOk ? 'Descreva o objetivo com ao menos 8 caracteres. Seus campos foram preservados.' : null,
    4: pdf && !emailOk ? 'O e-mail informado não parece válido. Os demais campos foram preservados.' : null,
    5: !sel.length ? 'Autorize ao menos uma evidência.' : !auth ? 'Confirme a autorização para usar as evidências selecionadas.' : null,
  };
  const blocked = (s => s === 5 && !avail.length ? true : !!errs[s] && s !== 5)(step) || (step === 5 && (!sel.length || !auth)) || gen === 'running';
  const next = () => { setTried(true); if (errs[step] || (step === 5 && !avail.length)) return; setTried(false); setStep(step + 1); };
  const back = () => { setTried(false); setGen('idle'); setStep(Math.max(1, step - 1)); };
  const timer = React.useRef(null);
  React.useEffect(() => () => clearTimeout(timer.current), []);
  const generate = () => {
    setGen('running');
    timer.current = setTimeout(() => {
      if (force === 'timeout' || force === 'provider') { setGen(force); setForce(null); return; }
      const man2 = { ...man, synthetic: man.email === A_MAN0.email };
      const art = aMake('n' + Date.now(), type, A_TLABEL[type] + (company.trim() ? '' : ''), 'rascunho', sel, man2, objective.trim(), null, 'agora');
      art.versions[0].detail = 'Gerada pelo Persona só com as evidências autorizadas.';
      art.company = company.trim(); art.desc = desc.trim();
      onCreated(art);
    }, 1400);
  };
  const toggleSel = id => { setSel(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]); setAuth(false); };
  const showErr = tried && errs[step] ? errs[step] : null;
  const t = A_TYPES.find(x => x.id === type);
  let body, nextLabel = 'Continuar', nextVariant = 'solid', disabledReason = null;
  if (step === 1) body = <>
    {agentNote ? <div role="status" style={aCss.row}><ABadge tone="info" icon="sparkles">Pré-preenchido pelo Agente Persona</ABadge><span style={aCss.p}>Só tipo e objetivo. Revise antes de seguir; nenhum texto foi gerado.</span></div> : null}
    <div role="radiogroup" aria-label="Tipo de Artefato" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 12 }}>
      {A_TYPES.map(x => <AType key={x.id} t={x} sel={type === x.id} onPick={() => { setType(x.id); setTried(false); }} />)}
    </div>
    <p style={{ ...aCss.p, color: 'var(--text-muted)' }}>Estes são os quatro tipos desta versão. Todos exigem fontes que você autoriza.</p>
  </>;
  if (step === 2) body = <>
    {agentNote ? <div role="status" style={aCss.row}><ABadge tone="info" icon="sparkles">Objetivo pré-preenchido pelo Agente Persona</ABadge></div> : null}
    <AInput label="Objetivo do artefato" placeholder="Para que você vai usar este material?" value={objective} onChange={e => setObjective(e.target.value.slice(0, 140))}
      error={tried && !objOk ? 'Descreva o objetivo com ao menos 8 caracteres.' : null} hint={tried && !objOk ? null : 'Seu objetivo declarado no Persona é “' + A_OBJ + '”.'} aria-invalid={tried && !objOk ? 'true' : undefined} />
    <div style={aCss.row}><AChip size="sm" icon="target" onClick={() => setObjective(A_OBJ)}>Usar meu objetivo declarado</AChip></div>
    <p style={aCss.p}>Tipo escolhido: <strong>{t ? t.label : '—'}</strong>.</p>
  </>;
  if (step === 3) body = <>
    <p style={aCss.p}>Opcional. Esta informação orienta a adaptação, mas nunca vira fato do artefato.</p>
    <AInput label="Empresa (opcional)" placeholder="Nome da empresa" value={company} onChange={e => setCompany(e.target.value.slice(0, 80))} hint="Declaração manual. Não é usada como evidência." />
    <div style={aCss.row}><AChip size="sm" onClick={() => setCompany('Empresa Aurora (fictícia)')}>Usar “Empresa Aurora (fictícia)”</AChip></div>
    <ATextarea label="Descrição da vaga (opcional)" rows={3} placeholder="Cole trechos da descrição, se quiser." value={desc} onChange={e => setDesc(e.target.value.slice(0, 600))} hint="Declaração manual." />
  </>;
  if (step === 4) body = pdf ? <>
    <ABadge tone="info" icon="pencil-line">Declaração manual · não são evidências</ABadge>
    <AInput label="E-mail de contato" placeholder="voce@exemplo.com" value={man.email} onChange={e => setMan({ ...man, email: e.target.value })} error={tried && !emailOk ? 'E-mail inválido.' : null} hint={man.email === A_MAN0.email ? A_SYN + '.' : 'Declaração manual.'} inputMode="email" />
    <div style={aCss.row}><AChip size="sm" onClick={() => setMan({ ...man, email: A_MAN0.email })}>Usar e-mail sintético</AChip></div>
    <AInput label="Formação" placeholder="Curso e instituição" value={man.formacao} onChange={e => setMan({ ...man, formacao: e.target.value.slice(0, 160) })} hint="Declaração manual. Em branco, a seção aparece como lacuna." />
    <AInput label="Idiomas" placeholder="Idioma e nível" value={man.idiomas} onChange={e => setMan({ ...man, idiomas: e.target.value.slice(0, 120) })} hint="Declaração manual. Em branco, aparece como lacuna." />
  </> : <ANotice tone="neutral" icon="circle-check" badge="Nada a declarar">{t ? t.label + ' usa apenas evidências. Não são necessários dados manuais.' : 'Escolha um tipo na etapa 1.'}</ANotice>;
  if (step === 5) body = !avail.length ? <ANotice role="status" tone="warning" icon="search-x" badge="Nenhuma evidência elegível"
      actions={<AButton variant="outline" size="sm" icon="notebook-pen">Registrar no Diário</AButton>}>Artefatos só usam evidências confirmadas. Confirme ao menos uma evidência e volte aqui. Seus campos desta criação foram preservados.</ANotice>
    : <>
      <p style={aCss.p}>Escolha as evidências que o Persona pode usar. Cada trecho gerado vai citar a evidência de origem.</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 12 }}>
        {avail.map(id => { const e = A_EV[id]; return <AEvCard key={id} variant="selectable" title={e.title} competencies={e.comp} level={e.level} proofCount={e.links.length} origin={e.origin} reason={aReason(type, id)} selected={sel.includes(id)} onSelectedChange={() => toggleSel(id)} />; })}
      </div>
      <label style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 13, color: 'var(--text-strong)', cursor: 'pointer', padding: '12px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', background: 'var(--surface-card)' }}>
        <input type="checkbox" checked={auth} disabled={!sel.length} onChange={e => setAuth(e.target.checked)} style={{ width: 18, height: 18, marginTop: 1, accentColor: 'var(--brand-strong)', flexShrink: 0 }} />
        <span>Autorizo o Persona a usar {sel.length ? (sel.length === 1 ? 'a evidência ' : 'as evidências ') + sel.map(x => A_EV[x].n).join(', ') : 'as evidências selecionadas'} neste artefato. Só a pessoa autoriza; o Agente Persona não autoriza.</span>
      </label>
    </>;
  if (step === 6) {
    nextLabel = gen === 'timeout' || gen === 'provider' ? 'Tentar gerar de novo' : gen === 'running' ? 'Gerando…' : 'Gerar rascunho'; nextVariant = 'brand';
    body = <>
      <div style={aCss.notice}>
        <span style={aCss.label}>Resumo</span>
        <div style={aCss.row}><ABadge tone="neutral" icon={t ? t.icon : 'file'}>{t ? t.label : '—'}</ABadge><ABadge tone="neutral" icon="pencil">Rascunho ao criar</ABadge></div>
        <p style={aCss.p}>Objetivo: {objective.trim() || '—'}</p>
        {company.trim() ? <p style={aCss.p}>Empresa: {company.trim()} <span style={{ color: 'var(--text-muted)' }}>· declaração manual</span></p> : null}
        <p style={aCss.p}>Fontes autorizadas: {sel.map(x => 'Evidência ' + A_EV[x].n).join(' · ') || 'nenhuma'}</p>
        {pdf ? <p style={aCss.p}>Dados manuais: {[man.email && 'e-mail', man.formacao && 'formação', man.idiomas && 'idiomas'].filter(Boolean).join(', ') || 'nenhum'}.</p> : null}
      </div>
      {gaps.length ? <ANotice role="status" tone="warning" icon="triangle-alert" badge={'Lacuna de dados · ' + gaps.length}>{'Estas seções não serão preenchidas, porque não há fato registrado: ' + gaps.map(g => g.title).join(', ') + '. O rascunho mostra a lacuna, nunca um texto genérico.'}</ANotice> : <p style={aCss.p}>As fontes autorizadas cobrem todas as seções obrigatórias.</p>}
      {gen === 'running' ? <div role="status" aria-live="polite" style={aCss.row}><ABadge tone="info" icon="loader">Gerando rascunho…</ABadge><span style={aCss.p}>Usando só as fontes autorizadas. Seus campos continuam salvos.</span></div> : null}
      {gen === 'timeout' ? <ANotice role="alert" tone="danger" icon="clock" badge="A geração demorou demais">Nada foi criado. Todos os campos foram preservados; você pode tentar de novo.</ANotice> : null}
      {gen === 'provider' ? <ANotice role="alert" tone="danger" icon="cloud-off" badge="Provedor de IA indisponível">Não foi possível gerar agora. Nada foi criado e os campos foram preservados. Tente de novo em instantes.</ANotice> : null}
    </>;
  }
  return <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 860 }}>
    <div style={aCss.row}><AButton variant="ghost" size="sm" icon="arrow-left" onClick={onClose}>Voltar para Artefatos</AButton></div>
    <AStep step={step} total={6} title={A_STEP_TITLES[step - 1]} description={['Cada tipo tem uma estrutura própria e exige fontes.', 'O objetivo orienta a adaptação do texto.', 'Dados da oportunidade, quando houver.', pdf ? 'Dados que não são evidência: ficam marcados como declaração manual.' : 'Este tipo não precisa de dados manuais.', 'Só entram evidências que você autorizar.', 'A geração só acontece quando você aciona “Gerar rascunho”.'][step - 1]}
      onBack={back} onNext={step === 6 ? generate : next} nextLabel={nextLabel} nextVariant={nextVariant} disabled={step === 6 && gen === 'running' ? true : false}
      nextDisabled={step !== 6 && ((step === 1 && !type) || (step === 5 && (!avail.length || !sel.length || !auth)) || (step === 2 && !objOk && !tried && false))}
      nextDisabledReason={step === 1 && !type ? 'Escolha um tipo.' : step === 5 && !avail.length ? 'Sem evidência elegível.' : step === 5 && !sel.length ? 'Autorize ao menos uma evidência.' : step === 5 && !auth ? 'Confirme a autorização.' : null}
      saving={false} error={showErr}>{body}</AStep>
  </div>;
}
function AType({ t, sel, onPick }) {
  const [f, setF] = React.useState(false);
  return <button type="button" role="radio" aria-checked={sel} onClick={onPick} onFocus={e => setF(e.target.matches(':focus-visible'))} onBlur={() => setF(false)}
    style={{ display: 'flex', flexDirection: 'column', gap: 10, textAlign: 'left', padding: 18, background: 'var(--surface-card)', borderRadius: 'var(--radius-md)', border: sel ? '2px solid var(--brand-strong)' : '2px solid var(--border-subtle)', cursor: 'pointer', fontFamily: 'var(--font-body)', minWidth: 0, outline: 0, boxShadow: f ? '0 0 0 2px var(--focus-ring), 0 0 0 4px var(--brand-strong)' : 'none' }}>
    <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}><span style={{ width: 36, height: 36, borderRadius: 12, background: 'var(--n-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-strong)' }}><AIcon name={t.icon} size={18} /></span>
      <span style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, color: 'var(--text-strong)' }}>{t.label}</span>{sel ? <AIcon name="circle-check" size={18} color="var(--brand-strong)" style={{ marginLeft: 'auto' }} /> : null}</span>
    <span style={aCss.p}>{t.desc}</span>
    <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Saída: {t.out}</span>
  </button>;
}
Object.assign(window, { CreateFlow, ANotice, ATextarea, aCss });
