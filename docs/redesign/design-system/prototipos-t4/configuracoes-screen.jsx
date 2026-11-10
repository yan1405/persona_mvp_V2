const CPD = window.PersonaDesignSystem_ff1a7b;
const { Sidebar: CSide, Badge: CBadge, Button: CBtn, Input: CInput, Switch: CSwitch, SectionIndex: CIndex, FloatingPanel: CPanel, Avatar: CAvatar, Icon: CIcon, IconButton: CIconBtn } = CPD;
const C_SYN = 'Dados sintéticos para demonstração';
const C_BASE = { nome: 'Pessoa Exemplo', cargo: 'Cargo de exemplo', objetivo: 'Texto de exemplo do objetivo profissional.', local: 'Cidade de exemplo', contato: 'contato@exemplo.invalid', formacao: '', idiomas: '', lembrete: true, horario: '19:00', resumo: false, novidades: false };
const C_DIRTY = { ...C_BASE, cargo: 'Outro cargo de exemplo', resumo: true };
const C_INV = [
  ['book-open', 'Registros do Diário', '4', 'Textos livres que você escreveu.'],
  ['library', 'Evidências', '6', '4 confirmadas · 2 para revisar.'],
  ['target', 'Narrative Score', '1', 'Score 65 · base declarada.'],
  ['messages-square', 'Sessões do Persona Live', '1', 'Sessão encerrada, com rascunho.'],
  ['file-text', 'Artefatos', '4', 'Com versões e fontes citadas.'],
  ['settings', 'Perfil e preferências', '1', 'Os campos desta tela.'],
  ['user', 'Identidade Microsoft', '1', 'Vínculo da conta usada para entrar.'],
];
const C_SC = {
  carregando: { load: 1 }, limpo: {}, alterado: { dirty: 1 }, validacao: { dirty: 1, inval: 1, tried: 1 },
  salvando: { dirty: 1, save: 'saving' }, salvo: { saved: 1 }, 'falha-salvar': { dirty: 1, save: 'fail' },
  inventario: { scroll: 'cfg-dados' }, exportando: { exp: 'busy', scroll: 'cfg-dados' }, 'export-pronto': { exp: 'ready', scroll: 'cfg-dados' }, 'export-falha': { exp: 'fail', scroll: 'cfg-dados' },
  'excl-aviso': { del: { step: 1 }, scroll: 'cfg-dados' },
  'reauth-solicitada': { del: { step: 2, auth: 'req' }, scroll: 'cfg-dados' }, 'reauth-valida': { del: { step: 2, auth: 'valid', secs: 292 }, scroll: 'cfg-dados' }, 'reauth-expirada': { del: { step: 2, auth: 'expired' }, scroll: 'cfg-dados' },
  'excl-incorreta': { del: { step: 3, auth: 'valid', secs: 241, typed: 'excluir' }, scroll: 'cfg-dados' }, 'excl-correta': { del: { step: 3, auth: 'valid', secs: 233, typed: 'EXCLUIR' }, scroll: 'cfg-dados' },
  'excl-processando': { del: { step: 3, auth: 'valid', secs: 200, typed: 'EXCLUIR', proc: 'busy' }, scroll: 'cfg-dados' }, 'excl-concluida': { del: { step: 3, auth: 'valid', secs: 200, typed: 'EXCLUIR', proc: 'done' }, scroll: 'cfg-dados' }, 'excl-falha': { del: { step: 3, auth: 'valid', secs: 200, typed: 'EXCLUIR', proc: 'fail' }, scroll: 'cfg-dados' },
  'ms-disponivel': { scroll: 'cfg-conta' }, 'sessao-expirada': { ms: 'expired' }, saindo: { ms: 'leaving', scroll: 'cfg-conta' }, 'sair-falha': { ms: 'leaveFail', scroll: 'cfg-conta' },
};
const cfgCss = {
  card: { background: 'var(--surface-card)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-soft)', padding: 24, display: 'flex', flexDirection: 'column', gap: 18, minWidth: 0, scrollMarginTop: 80 },
  over: { fontSize: 12, fontWeight: 700, letterSpacing: '.08em', color: 'var(--text-muted)' },
  h2: { margin: 0, fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.25, color: 'var(--text-strong)' },
  p: { margin: 0, fontSize: 14, lineHeight: 1.5, color: 'var(--text-body)', textWrap: 'pretty' },
  muted: { fontSize: 12, lineHeight: 1.5, color: 'var(--text-muted)' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 16 },
  row: { display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8 },
  h3: { margin: 0, fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 700, letterSpacing: '-0.01em', color: 'var(--text-strong)' },
};
const cfgDanger = { color: 'var(--red-ink)', borderColor: 'var(--red-500)' };
const cfgMmss = s => String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0');
function CfgAlert({ tone = 'danger', icon = 'triangle-alert', children, action, role = 'alert' }) {
  const t = tone === 'danger' ? ['var(--red-soft)', 'var(--red-ink)'] : tone === 'warn' ? ['var(--amber-soft)', 'var(--amber-ink)'] : ['var(--green-soft)', 'var(--green-ink)'];
  return <div role={role} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', flexWrap: 'wrap', padding: '12px 16px', borderRadius: 'var(--radius-sm)', background: t[0], color: t[1], fontSize: 13, lineHeight: 1.5 }}>
    <CIcon name={icon} size={18} color={t[1]} style={{ flexShrink: 0, marginTop: 1 }} /><div style={{ flex: '1 1 220px', minWidth: 0 }}>{children}</div>{action}</div>;
}
function CfgSec({ id, over, title, desc, badge, children }) {
  return <section id={id} aria-labelledby={id + '-t'} style={cfgCss.card}>
    <header style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{ ...cfgCss.row, justifyContent: 'space-between' }}><span style={cfgCss.over}>{over}</span>{badge}</div>
      <h2 id={id + '-t'} style={cfgCss.h2}>{title}</h2>{desc ? <p style={cfgCss.p}>{desc}</p> : null}
    </header>{children}</section>;
}
function CfgSkeleton() {
  const b = (w, h) => <div style={{ width: w, height: h, borderRadius: 12, background: 'var(--n-50)' }}></div>;
  return <div role="status" aria-busy="true" aria-live="polite" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
    <span style={{ fontSize: 13, color: 'var(--text-body)' }}>Carregando suas configurações…</span>
    {[0, 1, 2].map(i => <div key={i} style={{ ...cfgCss.card, gap: 14 }}>{b(90, 12)}{b('45%', 24)}{b('100%', 44)}{b('100%', 44)}</div>)}</div>;
}

function ConfiguracoesScreen({ scenario, width, height, fail }) {
  const sc = C_SC[scenario] || {};
  const [f, setF] = React.useState(sc.saved ? C_DIRTY : sc.inval ? { ...C_DIRTY, nome: '', contato: 'contato@', horario: '' } : sc.dirty ? C_DIRTY : C_BASE);
  const [base, setBase] = React.useState(sc.saved ? C_DIRTY : C_BASE);
  const [tried, setTried] = React.useState(!!sc.tried);
  const [save, setSave] = React.useState(sc.saved ? 'saved' : sc.save || 'idle');
  const [exp, setExp] = React.useState(sc.exp || 'idle');
  const [del, setDel] = React.useState(sc.del ? { open: true, step: 1, auth: 'req', secs: 300, typed: '', proc: 'idle', ...sc.del } : { open: false, step: 1, auth: 'req', secs: 300, typed: '', proc: 'idle' });
  const [ms, setMs] = React.useState(sc.ms || 'ok');
  const [load, setLoad] = React.useState(!!sc.load);
  const [active, setActive] = React.useState(sc.scroll || 'cfg-perfil');
  const scroller = React.useRef(null);
  const failRef = React.useRef(fail); failRef.current = fail;
  const set = (k, v) => { setF(x => ({ ...x, [k]: v })); if (save === 'saved' || save === 'fail') setSave('idle'); };
  const dirty = JSON.stringify(f) !== JSON.stringify(base);
  const errs = {};
  if (!f.nome.trim()) errs.nome = 'Informe como devemos chamar você.';
  if (f.contato && !/^\S+@\S+\.\S+$/.test(f.contato)) errs.contato = 'Use um e-mail no formato nome@dominio.';
  if (f.objetivo.length > 160) errs.objetivo = 'Use até 160 caracteres.';
  if (f.lembrete && !f.horario) errs.horario = 'Escolha um horário para o lembrete.';
  const nErr = Object.keys(errs).length;
  const show = k => tried ? errs[k] : undefined;
  const expired = ms === 'expired', out = ms === 'out';
  const blocked = expired || out;
  const goto = id => { setActive(id); const sc2 = scroller.current, el = document.getElementById(id); if (sc2 && el && sc2.contains(el)) sc2.scrollTo({ top: Math.max(0, el.getBoundingClientRect().top - sc2.getBoundingClientRect().top + sc2.scrollTop - 76), behavior: 'auto' }); };
  React.useEffect(() => { if (sc.scroll) setTimeout(() => goto(sc.scroll), 80); }, [load]);
  React.useEffect(() => { if (!load) return; }, [load]);
  React.useEffect(() => {
    if (!del.open || del.auth !== 'valid' || del.proc !== 'idle' || del.step < 2) return;
    const t = setInterval(() => setDel(d => d.secs <= 1 ? { ...d, auth: 'expired', secs: 0, step: 2, typed: '' } : { ...d, secs: d.secs - 1 }), 1000);
    return () => clearInterval(t);
  }, [del.open, del.auth, del.proc, del.step]);
  const doSave = () => {
    setTried(true);
    if (nErr) { setTimeout(() => { const n = document.querySelector('[data-cfg-form] [aria-invalid="true"]'); n && n.focus(); }, 0); return; }
    setSave('saving');
    setTimeout(() => { if (failRef.current) setSave('fail'); else { setBase(f); setSave('saved'); setTried(false); } }, 1100);
  };
  const discard = () => { setF(base); setTried(false); setSave('idle'); };
  const doExport = () => { setExp('busy'); setTimeout(() => setExp(failRef.current ? 'fail' : 'ready'), 1300); };
  const download = () => { const b = new Blob([JSON.stringify({ aviso: 'Arquivo sintético de demonstração do protótipo. Não contém dados reais.', inventario: C_INV.map(i => ({ item: i[1], quantidade: +i[2] })) }, null, 2)], { type: 'application/json' }); const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = 'persona-exportacao-sintetica.json'; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 500); };
  const closeDel = () => { if (del.proc === 'busy') return; setDel(d => ({ ...d, open: false, step: 1, auth: 'req', typed: '', proc: 'idle' })); };
  const doDelete = () => { setDel(d => ({ ...d, proc: 'busy' })); setTimeout(() => setDel(d => ({ ...d, proc: failRef.current ? 'fail' : 'done' })), 1500); };
  const doLeave = () => { setMs('leaving'); setTimeout(() => setMs(failRef.current ? 'leaveFail' : 'out'), 1200); };
  const reauth = () => setDel(d => ({ ...d, auth: 'valid', secs: 300, typed: '' }));

  const rail = width < 1100;
  const phone = width < 640;
  // Gaveta de navegação (< 640 px): foco no diálogo, Tab preso, Esc fecha, foco volta ao botão de menu.
  const [navOpen, setNavOpen] = React.useState(false);
  const navRef = React.useRef(null);
  const rootRef = React.useRef(null);
  React.useEffect(() => { if (!phone && navOpen) setNavOpen(false); }, [phone]);
  React.useEffect(() => {
    if (!(phone && navOpen)) return;
    const el = navRef.current;
    el && el.focus({ preventScroll: true });
    const k = e => {
      if (!el || (!el.contains(document.activeElement) && document.activeElement !== el)) return;
      if (e.key === 'Escape') { e.stopPropagation(); setNavOpen(false); return; }
      if (e.key !== 'Tab') return;
      const list = Array.from(el.querySelectorAll('a[href],button:not([disabled]),input:not([disabled]),[tabindex]:not([tabindex="-1"])')).filter(n => n.offsetParent !== null);
      if (!list.length) { e.preventDefault(); return; }
      const a = list[0], z = list[list.length - 1];
      if (e.shiftKey && (document.activeElement === a || document.activeElement === el)) { e.preventDefault(); z.focus(); }
      else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); }
    };
    document.addEventListener('keydown', k, true);
    return () => {
      document.removeEventListener('keydown', k, true);
      const t = rootRef.current && rootRef.current.querySelector('[data-nav-trigger]');
      if (t) t.focus({ preventScroll: true });
    };
  }, [phone, navOpen]);
  const fld = (k, label, extra = {}) => <CInput label={label} value={f[k]} onChange={e => set(k, e.target.value)} error={show(k)} aria-invalid={show(k) ? 'true' : undefined} disabled={expired || out} {...extra} />;
  const saveStatus = save === 'saving' ? ['Salvando…', 'var(--text-body)'] : save === 'saved' ? ['Alterações salvas (simulação: nada foi gravado).', 'var(--green-ink)'] : save === 'fail' ? null : tried && nErr ? ['Corrija ' + nErr + (nErr === 1 ? ' campo' : ' campos') + ' para salvar.', 'var(--red-ink)'] : dirty ? ['Alterações não salvas.', 'var(--text-strong)'] : ['Nenhuma alteração.', 'var(--text-muted)'];
  const dirtyBadge = dirty ? <CBadge tone="warning" icon="pen-line">Não salvo</CBadge> : null;

  const perfil = <CfgSec id="cfg-perfil" over="01 PERFIL" title="Como você aparece no Persona." desc="Estes campos alimentam seus Artefatos. Você edita e confirma; nada é preenchido por conta própria." badge={dirtyBadge}>
    <div data-cfg-form="" style={cfgCss.grid}>
      {fld('nome', 'Nome de exibição', { autoComplete: 'off', required: true })}
      {fld('cargo', 'Cargo ou área atual')}
      <div style={{ gridColumn: '1 / -1' }}>{fld('objetivo', 'Objetivo profissional', { hint: f.objetivo.length + ' / 160 · declaração sua, não verificada.' })}</div>
      {fld('local', 'Localização')}
      {fld('contato', 'E-mail de contato', { type: 'email', placeholder: 'nome@dominio', hint: 'Aparece nos Artefatos que você exportar. Opcional.' })}
      {fld('formacao', 'Formação', { placeholder: 'Opcional · declaração manual' })}
      {fld('idiomas', 'Idiomas', { placeholder: 'Opcional · declaração manual' })}
    </div>
    <span style={cfgCss.muted}>Valores de exemplo: {C_SYN.toLowerCase()}. Formação e idiomas ficam como declaração manual.</span>
  </CfgSec>;
  const prefs = <CfgSec id="cfg-prefs" over="02 PREFERÊNCIAS" title="Lembretes e comunicações." desc="Comunicações opcionais começam desligadas. Uma mudança de consentimento só vale depois que você salvar." badge={dirtyBadge}>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}><CSwitch checked={f.lembrete} onChange={v => set('lembrete', v)} disabled={blocked} label="Lembrete diário para registrar" /><span style={{ ...cfgCss.muted, paddingLeft: 46 }}>Um aviso curto para você escrever no Diário.</span></div>
        <div style={{ maxWidth: 240, paddingLeft: 46 }}><CInput label="Horário do lembrete" type="time" value={f.horario} onChange={e => set('horario', e.target.value)} disabled={!f.lembrete || blocked} error={show('horario')} aria-invalid={show('horario') ? 'true' : undefined} hint={f.lembrete ? undefined : 'Ative o lembrete para escolher o horário.'} /></div>
      </div>
      <div style={{ borderTop: '1px solid var(--divider)', paddingTop: 18, display: 'flex', flexDirection: 'column', gap: 14 }}>
        <h3 style={cfgCss.h3}>Comunicações opcionais</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}><CSwitch checked={f.resumo} onChange={v => set('resumo', v)} disabled={blocked} label="Resumo semanal por e-mail" /><span style={{ ...cfgCss.muted, paddingLeft: 46 }}>Um e-mail por semana com o que você registrou.</span></div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}><CSwitch checked={f.novidades} onChange={v => set('novidades', v)} disabled={blocked} label="Novidades do Persona por e-mail" /><span style={{ ...cfgCss.muted, paddingLeft: 46 }}>Avisos sobre mudanças no produto. Não afeta o seu uso.</span></div>
      </div>
    </div>
  </CfgSec>;
  const saveBar = <div style={{ position: 'sticky', bottom: 0, zIndex: 4, display: 'flex', flexDirection: 'column', gap: 10, padding: '12px 16px', background: 'var(--surface-card)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-float)' }}>
    {save === 'fail' ? <CfgAlert>Não foi possível salvar agora. Seus campos continuam preenchidos e nada foi perdido.</CfgAlert> : null}
    <div style={{ ...cfgCss.row, justifyContent: 'space-between', gap: 12 }}>
      <span role="status" aria-live="polite" style={{ fontSize: 13, fontWeight: 600, color: saveStatus ? saveStatus[1] : 'var(--text-strong)' }}>{saveStatus ? saveStatus[0] : 'Alterações não salvas.'}</span>
      <div style={cfgCss.row}>
        <CBtn variant="ghost" size="sm" onClick={discard} disabled={!dirty || save === 'saving' || blocked}>Descartar alterações</CBtn>
        <CBtn variant="brand" icon="check" onClick={doSave} disabled={!dirty || save === 'saving' || blocked} aria-busy={save === 'saving'}>Salvar alterações</CBtn>
      </div>
    </div></div>;

  const dados = <CfgSec id="cfg-dados" over="03 DADOS E PRIVACIDADE" title="O que o Persona guarda de você." desc="Esta é a lista do que existe na sua conta. Exportar e excluir só acontecem quando você pedir.">
    <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(250px,1fr))', gap: 10 }}>
      {C_INV.map(([ic, n, c, d]) => <li key={n} style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '12px 14px', borderRadius: 'var(--radius-sm)', background: 'var(--n-25)', border: '1px solid var(--border-subtle)', minWidth: 0 }}>
        <span aria-hidden="true" style={{ width: 36, height: 36, borderRadius: 12, background: 'var(--n-50)', display: 'grid', placeItems: 'center', flexShrink: 0 }}><CIcon name={ic} size={18} color="var(--text-strong)" /></span>
        <span style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0, flex: 1 }}><span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-strong)' }}>{n}</span><span style={cfgCss.muted}>{d}</span></span>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, color: 'var(--text-strong)', fontFeatureSettings: "'tnum'" }}>{c}</span></li>)}
    </ul>
    <span style={cfgCss.muted}>Contagens: {C_SYN.toLowerCase()}. No produto, virão da sua conta.</span>
    <div style={{ borderTop: '1px solid var(--divider)', paddingTop: 18, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <h3 style={cfgCss.h3}>Exportar seus dados</h3>
      <p style={cfgCss.p}>Gera um arquivo JSON com tudo o que está na lista acima. Nada é enviado a ninguém.</p>
      <div style={cfgCss.row}><CBtn variant="outline" icon="download" onClick={doExport} disabled={exp === 'busy' || blocked} aria-busy={exp === 'busy'}>{exp === 'busy' ? 'Exportando…' : 'Exportar JSON'}</CBtn>
        {exp === 'busy' ? <span role="status" style={{ fontSize: 13, color: 'var(--text-body)' }}>Preparando o arquivo. Pode levar alguns segundos.</span> : null}</div>
      {exp === 'ready' ? <CfgAlert tone="ok" icon="circle-check" role="status" action={<CBtn variant="outline" size="sm" icon="download" onClick={download}>Baixar arquivo</CBtn>}>Exportação pronta: persona-exportacao-sintetica.json. Protótipo: o arquivo baixado contém só as contagens sintéticas acima.</CfgAlert> : null}
      {exp === 'fail' ? <CfgAlert action={<CBtn variant="outline" size="sm" icon="refresh-cw" onClick={doExport}>Tentar de novo</CBtn>}>Não foi possível exportar agora. Seus dados continuam intactos; tente de novo em instantes.</CfgAlert> : null}
    </div>
    <div style={{ borderRadius: 'var(--radius-sm)', background: 'var(--red-soft)', padding: 18, display: 'flex', flexDirection: 'column', gap: 10 }}>
      <h3 style={{ ...cfgCss.h3, color: 'var(--red-ink)' }}>Excluir conta</h3>
      <p style={{ ...cfgCss.p, color: 'var(--red-ink)' }}>Apaga todos os dados da lista acima, de forma permanente. Para continuar, você vai entrar de novo com a Microsoft e digitar EXCLUIR. Nada é excluído só por abrir esta etapa.</p>
      <div><CBtn variant="outline" icon="trash-2" style={cfgDanger} disabled={blocked} onClick={() => setDel(d => ({ ...d, open: true, step: 1, auth: 'req', typed: '', proc: 'idle', secs: 300 }))}>Excluir conta…</CBtn></div>
    </div></CfgSec>;

  const conta = <CfgSec id="cfg-conta" over="04 CONTA MICROSOFT" title="Como você entra." badge={expired ? <CBadge tone="warning" icon="clock">Sessão expirada</CBadge> : out ? <CBadge tone="neutral">Sessão encerrada</CBadge> : <CBadge tone="success" dot>Conectada</CBadge>}>
    <div style={{ display: 'flex', gap: 14, alignItems: 'center', flexWrap: 'wrap' }}>
      <CAvatar name="Pessoa Exemplo" size={48} tone="indigo" />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0, flex: '1 1 200px' }}><span style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-strong)' }}>Pessoa Exemplo</span><span style={{ fontSize: 13, color: 'var(--text-body)', overflowWrap: 'anywhere' }}>pessoa.exemplo@exemplo.invalid</span><span style={cfgCss.muted}>Identidade de demonstração: {C_SYN.toLowerCase()}.</span></div>
      {expired || out ? <CBtn variant="solid" icon="user" onClick={() => setMs('ok')}>Entrar com Microsoft</CBtn> : <CBtn variant="outline" icon="log-out" onClick={doLeave} disabled={ms === 'leaving'} aria-busy={ms === 'leaving'}>{ms === 'leaving' ? 'Saindo…' : 'Sair'}</CBtn>}
    </div>
    {dirty && !blocked ? <span style={cfgCss.muted}>Há alterações não salvas. Se você sair agora, elas serão descartadas.</span> : null}
    {ms === 'leaving' ? <span role="status" style={{ fontSize: 13, color: 'var(--text-body)' }}>Encerrando a sessão com segurança…</span> : null}
    {ms === 'leaveFail' ? <CfgAlert>Não foi possível sair com segurança agora. Sua sessão continua ativa; tente de novo.</CfgAlert> : null}
    {out ? <CfgAlert tone="ok" icon="circle-check" role="status">Sessão encerrada (simulação do protótipo). Nenhum dado foi alterado.</CfgAlert> : null}
  </CfgSec>;

  const d = del, exact = d.typed === 'EXCLUIR', wrong = d.typed.length > 0 && !exact;
  const busy = d.proc === 'busy';
  const exitBtn = <CBtn variant="outline" onClick={closeDel} disabled={busy}>Cancelar</CBtn>;
  let dBody, dFoot, dTitle;
  if (d.proc === 'done') {
    dTitle = 'Exclusão concluída.';
    dBody = <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}><CfgAlert tone="ok" icon="circle-check" role="status">Simulação concluída. Protótipo: nenhuma conta, dado ou banco foi alterado.</CfgAlert><p style={cfgCss.p}>No produto, depois da exclusão a sessão seria encerrada. Aqui, nada saiu do seu navegador.</p></div>;
    dFoot = <CBtn variant="solid" onClick={closeDel}>Fechar</CBtn>;
  } else if (d.proc === 'fail') {
    dTitle = 'A exclusão não foi concluída.';
    dBody = <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}><CfgAlert>Não foi possível excluir agora. Sua conta e seus dados foram preservados.</CfgAlert><p style={cfgCss.p}>Você pode tentar de novo ou cancelar. Nada foi apagado.</p></div>;
    dFoot = <><CBtn variant="outline" onClick={closeDel}>Fechar</CBtn><CBtn variant="solid" onClick={() => setDel(x => ({ ...x, proc: 'idle', typed: '' }))}>Tentar de novo</CBtn></>;
  } else if (d.step === 1) {
    dTitle = 'Antes de continuar.';
    dBody = <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}><p style={cfgCss.p}>A exclusão apaga estes itens de forma permanente e não pode ser desfeita:</p>
      <ul style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6, fontSize: 14, color: 'var(--text-body)' }}>{C_INV.map(i => <li key={i[1]}><strong style={{ fontFeatureSettings: "'tnum'" }}>{i[2]}</strong> · {i[1]}</li>)}</ul>
      <p style={cfgCss.p}>Se quiser guardar uma cópia, feche esta janela e use Exportar JSON antes. Este passo não exclui nada.</p></div>;
    dFoot = <>{exitBtn}<CBtn variant="solid" iconRight="arrow-right" onClick={() => setDel(x => ({ ...x, step: 2 }))}>Continuar</CBtn></>;
  } else if (d.step === 2) {
    dTitle = 'Confirme que é você.';
    dBody = <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <p style={cfgCss.p}>Por segurança, entre de novo com a sua conta Microsoft. A autorização vale 5 minutos.</p>
      {d.auth === 'req' ? <div style={cfgCss.row}><CBtn variant="solid" icon="lock" onClick={reauth}>Reautenticar com Microsoft</CBtn></div> : null}
      {d.auth === 'valid' ? <CfgAlert tone="ok" icon="circle-check" role="status">Reautenticação válida. A autorização expira em <strong style={{ fontFeatureSettings: "'tnum'" }}>{cfgMmss(d.secs)}</strong>.</CfgAlert> : null}
      {d.auth === 'expired' ? <CfgAlert tone="warn" action={<CBtn variant="solid" size="sm" icon="lock" onClick={reauth}>Reautenticar de novo</CBtn>}>A autorização expirou. Sua conta foi preservada e nada foi excluído.</CfgAlert> : null}
      <span style={cfgCss.muted}>Protótipo: a reautenticação é simulada; nenhuma conta Microsoft é consultada.</span></div>;
    dFoot = <>{exitBtn}<CBtn variant="solid" iconRight="arrow-right" disabled={d.auth !== 'valid'} onClick={() => setDel(x => ({ ...x, step: 3, typed: '' }))}>Continuar</CBtn></>;
  } else {
    dTitle = 'Digite EXCLUIR para confirmar.';
    dBody = <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <CfgAlert tone="warn" icon="clock" role="status">Autorização válida por <strong style={{ fontFeatureSettings: "'tnum'" }}>{cfgMmss(d.secs)}</strong>. Depois disso, você reautentica de novo.</CfgAlert>
      <p style={cfgCss.p}>Esta ação apaga tudo de forma permanente. Digite exatamente <strong>EXCLUIR</strong>, em maiúsculas.</p>
      <CInput label="Confirmação" value={d.typed} onChange={e => setDel(x => ({ ...x, typed: e.target.value }))} disabled={busy} autoComplete="off" spellCheck={false} aria-invalid={wrong ? 'true' : undefined} error={wrong ? 'O texto precisa ser exatamente EXCLUIR, em maiúsculas.' : undefined} hint={exact ? 'Texto confere. O botão final está liberado.' : wrong ? undefined : 'O botão final só libera com o texto exato.'} />
      {busy ? <span role="status" aria-live="polite" style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-strong)' }}>Excluindo… não feche esta janela.</span> : null}</div>;
    dFoot = <>{exitBtn}<CBtn variant="solid" icon="trash-2" disabled={!exact || busy || d.auth !== 'valid'} aria-busy={busy} onClick={doDelete}>{busy ? 'Excluindo…' : 'Excluir conta definitivamente'}</CBtn></>;
  }
  const dlg = <CPanel contained open={d.open} onClose={closeDel} width={520} eyebrow={d.proc === 'done' || d.proc === 'fail' ? 'Excluir conta · Protótipo' : 'Excluir conta · Etapa ' + d.step + ' de 3 · Protótipo'} title={dTitle} footer={dFoot}>{dBody}</CPanel>;

  const items = [{ id: 'cfg-perfil', label: 'Perfil' }, { id: 'cfg-prefs', label: 'Preferências' }, { id: 'cfg-dados', label: 'Dados e privacidade' }, { id: 'cfg-conta', label: 'Conta Microsoft' }];
  return <div ref={rootRef} data-cfg-root="" style={{ position: 'relative', display: 'flex', gap: phone ? 8 : 16, padding: phone ? 8 : 16, height, boxSizing: 'border-box', background: 'var(--bg-app)', overflow: 'hidden', fontFamily: 'var(--font-body)', width }}>
    {phone ? null : <CSide active="configuracoes" collapsed={rail} onNavigate={() => {}} style={{ minHeight: 0 }} />}
    <main style={{ position: 'relative', flex: '1 1 auto', minWidth: 0, background: 'var(--n-25)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <div ref={scroller} data-shell-scroll="" tabIndex={load ? 0 : -1} role="region" aria-label="Configurações" style={{ flex: 1, minHeight: 0, overflowY: 'auto', overflowX: 'hidden' }}>
        <div style={{ position: 'sticky', top: 0, zIndex: 5, background: '#FAFAFC', padding: phone ? '12px 16px' : '14px 28px', display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', minHeight: 56, boxSizing: 'border-box' }}>
          {phone ? <CIconBtn data-nav-trigger="" icon="panel-left" variant="outline" size={40} label="Abrir menu" aria-haspopup="dialog" onClick={() => setNavOpen(true)} /> : null}
          <h1 style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, letterSpacing: '-0.015em', color: 'var(--text-strong)' }}>Configurações</h1>
          <CBadge tone="info" icon="info">Protótipo · dados sintéticos</CBadge>
        </div>
        <div style={{ padding: phone ? '12px 16px 32px' : '12px 28px 40px', maxWidth: 1280, margin: '0 auto', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {expired ? <CfgAlert tone="warn" icon="clock" action={<CBtn variant="solid" size="sm" icon="user" onClick={() => setMs('ok')}>Entrar com Microsoft</CBtn>}>Sua sessão Microsoft expirou. Entre de novo para salvar, exportar ou excluir. O que você digitou continua no formulário.</CfgAlert> : null}
          {load ? <CfgSkeleton /> : <div style={{ display: 'grid', gridTemplateColumns: phone ? 'minmax(0,1fr)' : '176px minmax(0,1fr)', gap: phone ? 16 : 28, alignItems: 'start' }}>
            <div style={phone ? undefined : { position: 'sticky', top: 84 }}><CIndex title="Nesta página" items={items} activeId={active} onSelect={goto} /></div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, minWidth: 0 }}>
              <p style={{ ...cfgCss.p, maxWidth: 640 }}>Aqui você ajusta o que é seu. Salvar, exportar, excluir, mudar um consentimento e sair só acontecem quando você pede.</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>{perfil}{prefs}{saveBar}</div>
              {dados}{conta}
            </div></div>}
        </div>
      </div>
      {dlg}
    </main>
    {phone && navOpen ? <div style={{ position: 'absolute', inset: 0, zIndex: 70 }}>
      <div aria-hidden="true" onClick={() => setNavOpen(false)} style={{ position: 'absolute', inset: 0, background: 'rgb(26 23 38 / 0.18)' }}></div>
      <div ref={navRef} role="dialog" aria-modal="true" aria-label="Navegação" tabIndex={-1} style={{ position: 'absolute', top: 8, left: 8, bottom: 8, width: 'min(280px, calc(100% - 16px))', display: 'flex', outline: 0 }}>
        <CSide active="configuracoes" collapsed={false} onNavigate={() => setNavOpen(false)} onToggle={() => setNavOpen(false)} onRegister={() => setNavOpen(false)} style={{ width: '100%', minHeight: 0 }} />
      </div>
    </div> : null}
  </div>;
}
Object.assign(window, { ConfiguracoesScreen, CFG_SCENARIOS: C_SC });
