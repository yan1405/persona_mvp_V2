const PDS = window.PersonaDesignSystem_ff1a7b;
const { AppShell, AgentPanel, AgentPrompt, DestinationGrid, DestinationTile, FocalJourney, Card, ScoreRing, TraceLine, Badge, Chip, Button, Icon } = PDS;

const inicioCss = {
  h2: { margin: 0, fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, letterSpacing: '-0.01em', color: 'var(--text-strong)' },
  sub: { margin: 0, fontSize: 13, lineHeight: 1.5, color: 'var(--text-body)', textWrap: 'pretty' },
  meta: { display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--text-body)' },
  label: { fontSize: 12, fontWeight: 600, color: 'var(--text-muted)' },
};

/* ---------- Dados por estado (todo número tem origem declarada no próprio texto) ---------- */
const PEND = [
  { t: 'Organização do cronograma de entregas do semestre', o: 'Diário · registro de ontem' },
  { t: 'Protótipo de interface para app de carreira', o: 'Diário · registro de ontem' },
];
const ACT_FULL = [
  { k: 'Registro', icon: 'notebook-pen', t: 'Registro de ontem', d: 'ontem', st: { status: 'para-revisar', label: 'Para revisar' } },
  { k: 'Evidência', icon: 'badge-check', t: 'Automação de relatórios semanais com IA generativa', d: '24 out', st: { status: 'documentada', label: 'Documentada' }, origin: true },
  { k: 'Evidência', icon: 'badge-check', t: 'Oficina de Python para calouros', d: '22 out', st: { status: 'registrada', label: 'Registrada' }, origin: true },
];
const ACT_FEW = [
  { k: 'Registro', icon: 'notebook-pen', t: 'Registro de hoje', d: 'hoje', st: { tone: 'neutral', icon: 'clock', label: 'Em análise' } },
  { k: 'Registro', icon: 'notebook-pen', t: 'Registro de ontem', d: 'ontem', st: { status: 'para-revisar', label: 'Para revisar' } },
  { k: 'Evidência', icon: 'badge-check', t: 'Oficina de Python para calouros', d: '22 out', st: { status: 'registrada', label: 'Registrada' }, origin: true },
];

const STATES = {
  completo: {
    sub: 'Desde ontem: 1 registro novo, que originou 2 sugestões de evidência.',
    badges: { diario: { count: 2, label: '2 sugestões para revisar' } },
    tiles: ['Último registro ontem', '4 confirmadas · 2 para revisar', '1 sessão encerrada', '1 revisado · 1 rascunho'],
    focal: {}, score: 'value', pend: 2, act: ACT_FULL,
    skills: { items: ['Automação', 'Análise de dados', 'Comunicação'], gap: 'Gestão de projetos: declarada no diagnóstico, ainda sem evidência.' },
  },
  vazio: {
    sub: 'Seu diagnóstico está pronto. A memória profissional começa no primeiro registro.',
    tiles: ['Nenhum registro ainda', 'Nenhuma evidência ainda', 'Precisa de 1 evidência', 'Precisa de 1 evidência'],
    focal: {
      steps: [
        { label: 'Diagnóstico', meta: 'Concluído', state: 'done' },
        { label: 'Primeiro registro', meta: 'Próximo passo', state: 'active', icon: 'notebook-pen' },
        { label: '5 evidências confirmadas', meta: '0 de 5', state: 'locked' },
        { label: 'Score observado', meta: 'Bloqueado', state: 'locked' },
      ],
      nextText: 'Conte no Diário uma situação real de trabalho ou estudo.',
      ctaLabel: 'Escrever primeiro registro',
    },
    score: 'waiting', empty: true,
  },
  calculando: {
    sub: 'Desde ontem: 1 registro novo, ainda em análise.',
    badges: { diario: { count: 1, label: '1 sugestão para revisar' } },
    tiles: ['2 registros · 1 em análise', '1 confirmada · 1 para revisar', 'Nenhuma sessão ainda', 'Nenhum artefato ainda'],
    focal: {
      steps: [
        { label: 'Diagnóstico', meta: 'Concluído', state: 'done' },
        { label: 'Primeiro registro', meta: 'Concluído', state: 'done' },
        { label: '5 evidências confirmadas', meta: 'Em andamento · 1 de 5', state: 'active', icon: 'badge-check' },
        { label: 'Score observado', meta: 'Bloqueado', state: 'locked' },
      ],
      nextText: 'Enquanto o registro de hoje é analisado, revise a sugestão de ontem.',
      ctaLabel: 'Revisar sugestão',
    },
    score: 'insufficient', pend: 1, act: ACT_FEW,
    skills: { items: ['Ensino', 'Liderança'], gap: 'Com 1 evidência confirmada, ainda não há padrão observável.' },
  },
  falha: {
    sub: 'Desde ontem: 1 registro novo, que originou 2 sugestões de evidência.',
    badges: { diario: { count: 2, label: '2 sugestões para revisar' } },
    tiles: ['Último registro ontem', '4 confirmadas · 2 para revisar', '1 sessão encerrada', '1 revisado · 1 rascunho'],
    focal: {}, score: 'error', agentDown: true, pend: 2, act: ACT_FULL,
    skills: { items: ['Automação', 'Análise de dados', 'Comunicação'], gap: 'Gestão de projetos: declarada no diagnóstico, ainda sem evidência.' },
  },
};

/* ---------- Blocos ---------- */
function Head({ id, title, aside }) {
  return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', minHeight: 32 }}>
    <h2 id={id} style={inicioCss.h2}>{title}</h2>{aside}
  </div>;
}
function Box({ id, children, gap = 16 }) {
  return <Card padding={24} radius="md" style={{ minWidth: 0 }}><section aria-labelledby={id} style={{ display: 'flex', flexDirection: 'column', gap }}>{children}</section></Card>;
}
function St({ st }) { return st.status ? <Badge status={st.status}>{st.label}</Badge> : <Badge tone={st.tone} icon={st.icon}>{st.label}</Badge>; }

/* Linha compacta: resumo, nunca ação de confirmar/descartar. */
function Row({ icon, title, meta, state, action }) {
  return <li style={{ listStyle: 'none', display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', padding: '10px 12px', borderRadius: 'var(--radius-sm)', background: 'var(--n-25)', minWidth: 0 }}>
    <span aria-hidden="true" style={{ width: 32, height: 32, flexShrink: 0, borderRadius: 10, background: 'var(--surface-card)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-body)' }}><Icon name={icon} size={16} /></span>
    <span style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: '1 1 160px', minWidth: 0 }}>
      <span style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.35, color: 'var(--text-strong)', textWrap: 'pretty' }}>{title}</span>
      <span style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', fontSize: 12, color: 'var(--text-body)', fontFeatureSettings: "'tnum'" }}>{state}<span>{meta}</span></span>
    </span>
    {action ? <span style={{ display: 'flex', flexShrink: 0, marginLeft: 'auto' }}>{action}</span> : null}
  </li>;
}
const listCss = { margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 8 };

function Dim({ label, value, text, icon }) {
  return <div style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 0 }}>
    <span style={inicioCss.label}>{label}</span>
    {value != null
      ? <span style={{ display: 'inline-flex', alignItems: 'baseline', gap: 2, fontFeatureSettings: "'tnum'" }}><span style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text-strong)' }}>{value}</span><span style={{ fontSize: 12, color: 'var(--text-muted)' }}>/100</span></span>
      : <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600, color: 'var(--n-600)', minHeight: 30 }}><Icon name={icon || 'info'} size={14} />{text}</span>}
  </div>;
}

function ScoreBlock({ s }) {
  const cfg = {
    value: { badge: <Badge tone="neutral">Declarada</Badge>, total: <ScoreRing value={65} size={84} stroke={9} sublabel="" />,
      note: 'Base declarada, vinda do diagnóstico. Passa a observado com 5 evidências confirmadas.', c: { value: 75 }, k: { value: 50 } },
    waiting: { badge: <Badge tone="neutral" icon="lock">Sem dados</Badge>, note: 'O cálculo começa no primeiro registro. Nenhum número aparece antes disso.',
      c: { text: 'Sem dados', icon: 'lock' }, k: { text: 'Sem dados', icon: 'lock' } },
    insufficient: { badge: <Badge tone="neutral" icon="clock">Calculando</Badge>, note: 'Dados insuficientes para um número honesto: 1 de 5 evidências e 2 de 6 registros.',
      c: { text: 'Dados insuficientes', icon: 'clock' }, k: { text: 'Dados insuficientes', icon: 'clock' } },
    error: { badge: <Badge tone="danger" icon="triangle-alert">Análise indisponível</Badge>, note: 'Não foi possível atualizar agora. Último cálculo: 65, base declarada, em 26 out.',
      c: { value: 75 }, k: { value: 50 } },
  }[s.score];
  const placeholder = <span aria-hidden="true" style={{ width: 84, height: 84, flexShrink: 0, borderRadius: 999, border: '2px dashed var(--n-200)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-disabled)' }}><Icon name={s.score === 'insufficient' ? 'clock' : 'lock'} size={20} /></span>;
  return <Box id="sc-h">
    <Head id="sc-h" title="Narrative Score" aside={<div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>{cfg.badge}<Button variant="ghost" size="sm" iconRight="arrow-right">Entender o Score</Button></div>} />
    <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, flex: '1 1 300px', minWidth: 0 }}>
        {cfg.total || placeholder}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, minWidth: 0 }}>
          <p style={{ ...inicioCss.sub, fontFeatureSettings: "'tnum'" }}>{cfg.note}</p>
          {s.score === 'error' ? <Button variant="outline" size="sm" icon="refresh-cw" style={{ alignSelf: 'flex-start' }}>Atualizar análise</Button> : null}
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, max-content))', columnGap: 32, rowGap: 12, flex: '0 1 auto' }}>
        <Dim label="Coerência" {...cfg.c} />
        <Dim label="Consistência" {...cfg.k} />
        <Dim label="Credibilidade" text="Ainda não avaliada" icon="info" />
      </div>
    </div>
  </Box>;
}

function Pending({ s }) {
  const list = PEND.slice(0, s.pend);
  return <Box id="rv-h" gap={14}>
    <Head id="rv-h" title="Para revisar" aside={<Badge status="para-revisar">{list.length === 1 ? '1 sugestão' : list.length + ' sugestões'}</Badge>} />
    <ul style={listCss}>
      {list.map(p => <Row key={p.t} icon="notebook-pen" title={p.t} meta={p.o} state={<Badge tone="neutral" icon="sparkles">Sugestão da IA</Badge>}
        action={<Button variant="ghost" size="sm" iconRight="arrow-right">Abrir revisão</Button>} />)}
    </ul>
  </Box>;
}

function Activity({ s }) {
  return <Box id="ac-h" gap={14}>
    <Head id="ac-h" title="Atividade recente" aside={<Button variant="ghost" size="sm" iconRight="arrow-right">Ver atividade</Button>} />
    <ul style={listCss}>
      {s.act.map(a => <Row key={a.t} icon={a.icon} title={a.t} meta={a.k + ' · ' + a.d} state={<St st={a.st} />}
        action={a.origin ? <Button variant="ghost" size="sm" icon="history" aria-label={'Ver origem: ' + a.t}>Ver origem</Button> : null} />)}
    </ul>
  </Box>;
}

function Skills({ s }) {
  return <Card padding={20} radius="md" style={{ minWidth: 0 }}><section aria-labelledby="sk-h" style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
    <h2 id="sk-h" style={{ ...inicioCss.h2, fontSize: 15 }}>Competências observadas</h2>
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>{s.skills.items.map(c => <Chip key={c} size="sm" icon={null}>{c}</Chip>)}</div>
    <span style={{ display: 'flex', alignItems: 'center', gap: 8, flex: '1 1 260px', minWidth: 0 }}>
      <Badge status="lacuna">Lacuna</Badge><span style={inicioCss.sub}>{s.skills.gap}</span>
    </span>
    <Button variant="ghost" size="sm" iconRight="arrow-right">Ver análise</Button>
  </section></Card>;
}

function EmptyNext() {
  return <Box id="em-h" gap={14}>
    <Head id="em-h" title="Depois do primeiro registro." />
    <p style={inicioCss.sub}>Revisões, atividade recente e competências aparecem aqui. Cada afirmação aponta para a sua origem.</p>
    <TraceLine title="Como uma evidência se forma" steps={[
      { kind: 'registro', label: 'Seu registro', state: 'gap' },
      { kind: 'sugestao', label: 'A IA sugere', state: 'gap' },
      { kind: 'evidencia', label: 'Você confirma', state: 'gap' },
      { kind: 'uso', label: 'Live e Artefatos', state: 'gap' },
    ]} />
  </Box>;
}

function Greeting({ s }) {
  return <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
    <p style={{ margin: 0, fontSize: 30, fontFamily: 'var(--font-display)', fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--text-strong)', lineHeight: 1.15 }}>Bom dia, Yan.</p>
    <p style={{ margin: 0, fontSize: 15, lineHeight: 1.5, color: 'var(--text-body)', textWrap: 'pretty' }}>{s.sub}</p>
  </div>;
}

function Prompt({ s }) {
  const sugg = s.agentDown || s.empty ? [] : s.score === 'insufficient' ? ['O que falta para o primeiro Score?'] : ['O que falta para o score observado?'];
  return <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
    <AgentPrompt size="large" suggestions={sugg} placeholder={s.agentDown ? 'Buscar em registros e evidências' : 'Buscar ou perguntar'} />
    {s.agentDown
      ? <div role="status" style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <Badge tone="warning" icon="triangle-alert">Agente indisponível</Badge>
          <span style={inicioCss.sub}>A busca em registros e evidências continua funcionando.</span>
        </div>
      : <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <Badge tone="neutral" icon="sparkles">Agente em protótipo</Badge>
          <span style={inicioCss.sub}>Responde só com o que você registrou e cita a origem.</span>
        </div>}
  </div>;
}

function Tiles({ s }) {
  const [d, e, l, a] = s.tiles;
  return <DestinationGrid breakpoint={900}>
    <DestinationTile tone="amber" title="Diário" status={d} icon="notebook-pen" />
    <DestinationTile tone="green" title="Evidências" status={e} icon="badge-check" />
    <DestinationTile tone="indigo" title="Persona Live" status={l} icon="mic" />
    <DestinationTile tone="blue" title="Artefatos" status={a} icon="file-text" />
  </DestinationGrid>;
}

function useOwnWidth() {
  const ref = React.useRef(null); const [w, setW] = React.useState(0);
  React.useLayoutEffect(() => { const el = ref.current; if (!el) return; const f = () => setW(el.offsetWidth); f(); const ro = new ResizeObserver(f); ro.observe(el); return () => ro.disconnect(); }, []);
  return [ref, w];
}

function InicioContent({ stateKey }) {
  const s = STATES[stateKey];
  const [ref, w] = useOwnWidth();
  const two = w >= 860;
  const cols = { display: 'grid', gridTemplateColumns: two ? 'minmax(0,1fr) minmax(0,1fr)' : 'minmax(0,1fr)', gap: 16, alignItems: 'start' };
  return <div ref={ref} style={{ display: 'flex', flexDirection: 'column', gap: 28, paddingTop: 4 }}>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}><Greeting s={s} /><Prompt s={s} /></div>
    <FocalJourney {...s.focal} breakpoint={1000} />
    <Tiles s={s} />
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <ScoreBlock s={s} />
      {s.empty ? <EmptyNext /> : <><div style={cols}><Pending s={s} /><Activity s={s} /></div><Skills s={s} /></>}
    </div>
  </div>;
}

/* AppShell com altura natural (height="auto"): a página rola, não o painel. AgentPanel recolhido fica fixo (sticky) à direita. */
function InicioScreen({ stateKey, width }) {
  const s = STATES[stateKey];
  const [open, setOpen] = React.useState(false);
  return <div className="inicio-root" style={{ width, display: 'flex', alignItems: 'flex-start', background: 'var(--bg-app)' }}>
    <AppShell active="inicio" title="Início" height="auto" badges={s.badges} agentOpen={open} onAgentToggle={setOpen}
      style={{ flex: '1 1 auto', minWidth: 0, paddingRight: open ? 16 : 0 }}>
      <InicioContent stateKey={stateKey} />
    </AppShell>
    {open || width < 640 ? null : <div className="inicio-rail" style={{ flexShrink: 0, padding: 16, boxSizing: 'border-box' }}>
      <AgentPanel open={false} onToggle={setOpen} screen="Início" />
    </div>}
  </div>;
}

Object.assign(window, { InicioScreen, InicioParts: { STATES, Greeting, Tiles, ScoreBlock } });
