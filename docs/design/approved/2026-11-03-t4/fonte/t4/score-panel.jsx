
const NPDS = window.PersonaDesignSystem_ff1a7b;
const { FloatingPanel: NFloat, SectionIndex: NIndex, TraceLine: NTrace, EntryCard: NEntry, DimensionRow: NDim, ScoreRing: NRing, Badge: NBadge, Button: NBtn, Icon: NIcon } = NPDS;

/* Números aprovados (únicos permitidos). O Score exibido é CALCULADO a partir deles. */
const NS = { coer: 75, cons: 50, wC: 0.6, wK: 0.4 };
const nsFmt = n => String(n).replace('.', ',');
const NS_SCORE = Math.round(NS.wC * NS.coer + NS.wK * NS.cons); // 65
const NS_FORMULA = nsFmt(NS.wC) + ' × ' + NS.coer + ' + ' + nsFmt(NS.wK) + ' × ' + NS.cons + ' = ' + NS_SCORE;

const nCss = {
  h3: { margin: 0, fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, letterSpacing: '-0.01em', color: 'var(--text-strong)' },
  p: { margin: 0, fontSize: 13, lineHeight: 1.55, color: 'var(--text-body)', textWrap: 'pretty' },
  label: { fontSize: 12, fontWeight: 600, color: 'var(--text-muted)' },
  row: { display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' },
  sec: { display: 'flex', flexDirection: 'column', gap: 14 },
  box: { display: 'flex', flexDirection: 'column', gap: 10, padding: 16, borderRadius: 'var(--radius-sm)', background: 'var(--n-25)', border: '1px solid var(--border-subtle)' },
};
function NNotice({ tone, icon, badge, children, actions, role }) {
  return <div role={role} style={nCss.box}>
    <div style={nCss.row}><NBadge tone={tone} icon={icon}>{badge}</NBadge></div>
    {children ? <p style={nCss.p}>{children}</p> : null}
    {actions ? <div style={nCss.row}>{actions}</div> : null}
  </div>;
}
function Fact({ label, value, note }) {
  return <div style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 0 }}>
    <dt style={nCss.label}>{label}</dt>
    <dd style={{ margin: 0, fontSize: 14, fontWeight: 600, lineHeight: 1.4, color: 'var(--text-strong)', fontFeatureSettings: "'tnum'", textWrap: 'pretty' }}>{value}</dd>
    {note ? <dd style={{ margin: 0, ...nCss.p, fontSize: 12 }}>{note}</dd> : null}
  </div>;
}
const factsGrid = { margin: 0, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px 20px' };

const SNAP0 = { id: 's0', date: '26 out', title: 'Snapshot de 26 out', meta: 'Score ' + NS_SCORE + ' · Coerência ' + NS.coer + ' · Consistência ' + NS.cons + '. Origem: Base declarada, vinda do diagnóstico. Confiança: Inicial.' };
const SNAP1 = { id: 's1', date: 'hoje', title: 'Snapshot de hoje', meta: 'Score ' + NS_SCORE + ' · Coerência ' + NS.coer + ' · Consistência ' + NS.cons + '. Origem: atualização da Coerência feita por você. Os valores e o método não mudaram.' };

const N_SCN = {
  snapshot: { snaps: [SNAP0], elig: true },
  elegivel: { snaps: [SNAP0], elig: true },
  'nao-elegivel': { snaps: [SNAP0], elig: false },
  calculando: { snaps: [SNAP0], elig: true, upd: 'busy', hold: true },
  concluido: { snaps: [SNAP1, SNAP0], elig: false, upd: 'done' },
  'falha-coerencia': { snaps: [SNAP0], elig: true, upd: 'fail', agentDown: true },
  'agente-off': { snaps: [SNAP0], elig: true, agentDown: true },
  'dados-insuficientes': { snaps: [], elig: false, insufficient: true },
  'historico-vazio': { snaps: [], elig: false, insufficient: true, noRecords: true },
};

function NarrativePanel({ scn, onClose, onDiario }) {
  const cfg = N_SCN[scn] || N_SCN.snapshot;
  const [snaps, setSnaps] = React.useState(cfg.snaps);
  const [upd, setUpd] = React.useState(cfg.upd || 'idle');
  const [elig, setElig] = React.useState(cfg.elig);
  const timer = React.useRef(null);
  React.useEffect(() => () => clearTimeout(timer.current), []);
  const ins = !!cfg.insufficient;
  const agentDown = !!cfg.agentDown;
  const busy = upd === 'busy';
  const run = () => {
    setUpd('busy');
    timer.current = setTimeout(() => { setSnaps(s => [SNAP1, ...s.filter(x => x.id !== 's1')]); setElig(false); setUpd('done'); }, 1400);
  };
  const cancel = () => { clearTimeout(timer.current); setUpd('idle'); };
  const idxItems = [
    { id: 'ns-resumo', label: 'Resumo', meta: ins ? 'Dados insuficientes' : 'Score ' + NS_SCORE },
    { id: 'ns-historico', label: 'Histórico', meta: snaps.length ? (snaps.length === 1 ? '1 snapshot' : snaps.length + ' snapshots') : 'Vazio' },
    { id: 'ns-calculo', label: 'Como é calculado', meta: 'Método e origem' },
  ];
  const trace = ins
    ? [{ kind: 'registro', label: 'Diagnóstico', meta: cfg.noRecords ? 'Concluído' : 'Concluído', state: 'done' }, { kind: 'evidencia', label: 'Coerência e Consistência', meta: 'Dados insuficientes', state: 'gap' }, { kind: 'uso', label: 'Snapshot', meta: 'Ainda não gerado', state: 'gap' }]
    : [{ kind: 'registro', label: 'Diagnóstico', meta: 'Base declarada', state: 'done' }, { kind: 'evidencia', label: 'Coerência e Consistência', meta: NS.coer + ' e ' + NS.cons, state: 'done' }, { kind: 'uso', label: 'Snapshot', meta: 'Score ' + NS_SCORE, state: 'done' }];

  const resumo = <section id="ns-resumo" aria-labelledby="ns-resumo-h" style={nCss.sec}>
    <h3 id="ns-resumo-h" style={nCss.h3}>Resumo</h3>
    {agentDown ? <div role="status" style={nCss.row}><NBadge tone="warning" icon="triangle-alert">Agente indisponível</NBadge><span style={nCss.p}>O histórico e a explicação do cálculo seguem disponíveis.</span></div> : null}
    {ins ? <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
      <span aria-hidden="true" style={{ width: 88, height: 88, flexShrink: 0, borderRadius: 999, border: '2px dashed var(--n-200)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-disabled)' }}><NIcon name="clock" size={22} /></span>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: '1 1 220px', minWidth: 0 }}>
        <NBadge tone="neutral" icon="clock">Dados insuficientes</NBadge>
        <p style={nCss.p}>{cfg.noRecords ? 'Ainda não há registros. Nenhum número aparece antes do primeiro registro no Diário.' : 'Ainda não há evidências e registros suficientes para um número honesto. Nenhum valor é estimado.'}</p>
      </div>
    </div> : <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
        <NRing value={NS_SCORE} size={96} stroke={10} sublabel="" />
        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-strong)', fontFeatureSettings: "'tnum'" }}>{'Score ' + NS_SCORE}</span>
      </div>
      <dl style={{ ...factsGrid, flex: '1 1 260px' }}>
        <Fact label="Origem" value="Base declarada" note="Vem do diagnóstico, não de registros observados." />
        <Fact label="Confiança" value="Inicial" note="Parte do que você declarou." />
      </dl>
    </div>}
    <dl style={factsGrid}>
      <Fact label="Método" value="Média ponderada de Coerência e Consistência" />
      <Fact label="Período" value={ins ? 'Sem período calculado' : 'Período do diagnóstico'} note={ins ? null : 'Snapshot de 26 out (data sintética).'} />
    </dl>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <NDim label="Coerência" value={NS.coer} origin="declarada" notEvaluated={ins} notEvaluatedText="Dados insuficientes" />
      <NDim label="Consistência" value={NS.cons} origin="declarada" notEvaluated={ins} notEvaluatedText="Dados insuficientes" />
      <NDim label="Credibilidade" notEvaluated />
    </div>
    <p style={nCss.p}>Credibilidade fica sem número nesta versão e não entra no cálculo.</p>
    <NTrace title="Rastreabilidade" steps={trace} />

    <div style={nCss.box}>
      <span style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 700, color: 'var(--text-strong)' }}>Atualizar Coerência</span>
      {upd === 'busy' ? <div role="status" style={nCss.row}><NBadge tone="info" icon="loader">Calculando</NBadge><span style={nCss.p}>Calculando a Coerência. O snapshot anterior continua valendo até terminar.</span></div> : null}
      {upd === 'done' ? <div role="status" style={nCss.row}><NBadge tone="success" icon="circle-check">Cálculo concluído</NBadge><span style={nCss.p}>Novo snapshot gerado e registrado no Histórico. Coerência {NS.coer}, Consistência {NS.cons}, Score {NS_SCORE}: os valores e o método não mudaram.</span></div> : null}
      {upd === 'fail' ? <div role="alert" style={nCss.row}><NBadge tone="danger" icon="triangle-alert">Coerência não atualizada</NBadge><span style={nCss.p}>Não foi possível atualizar agora. O snapshot anterior continua valendo (Score {NS_SCORE}) e nada foi alterado.</span></div> : null}
      {upd !== 'busy' ? <p style={nCss.p}>{ins ? 'Fica disponível quando houver evidências confirmadas e registros em semanas diferentes.' : elig ? 'Há evidências confirmadas depois do último snapshot. A atualização só acontece quando você pede e sempre gera um novo snapshot.' : 'Nenhuma evidência nova desde o último snapshot. A ação fica disponível quando houver.'}</p> : null}
      <div style={nCss.row}>
        {busy ? <><NBtn variant="outline" size="sm" icon="loader" disabled>Calculando…</NBtn>{cfg.hold ? <NBtn variant="ghost" size="sm" onClick={cancel}>Cancelar</NBtn> : null}</>
          : <NBtn variant="outline" size="sm" icon="refresh-cw" disabled={!elig} onClick={run}>{upd === 'fail' ? 'Tentar de novo' : 'Atualizar Coerência'}</NBtn>}
        <NBtn variant="brand" size="sm" icon="notebook-pen" onClick={onDiario}>Registrar no Diário</NBtn>
      </div>
      <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Registrar no Diário só abre o Diário; não altera o Score.</span>
    </div>
  </section>;

  const hist = <section id="ns-historico" aria-labelledby="ns-historico-h" style={nCss.sec}>
    <h3 id="ns-historico-h" style={nCss.h3}>Histórico</h3>
    {snaps.length ? <>
      <p style={nCss.p}>Cada snapshot guarda o Score, as dimensões, a origem e a confiança do momento. Datas sintéticas para demonstração.</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {snaps.map((s, i) => <NEntry key={s.id} kind="versao" date={s.date} title={s.title} meta={s.meta} statusLabel={i === 0 ? 'Atual' : 'Anterior'} statusIcon={i === 0 ? 'circle-check' : 'history'} />)}
      </div>
    </> : <div style={{ ...nCss.box, borderStyle: 'dashed' }}>
      <span style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 700, color: 'var(--text-strong)' }}>Nenhum snapshot ainda.</span>
      <p style={nCss.p}>O primeiro snapshot aparece aqui quando houver dados suficientes e você atualizar a Coerência. {cfg.noRecords ? 'Comece pelo Diário.' : ''}</p>
    </div>}
  </section>;

  const calc = <section id="ns-calculo" aria-labelledby="ns-calculo-h" style={nCss.sec}>
    <h3 id="ns-calculo-h" style={nCss.h3}>Como é calculado</h3>
    <p style={nCss.p}>O Narrative Score explica de onde vem o número e como ele avança. Ele descreve o que está registrado; não é um julgamento sobre você.</p>
    <div style={{ ...nCss.box, background: 'var(--surface-card)' }}>
      <span style={nCss.label}>Fórmula</span>
      <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-strong)' }}>Score = {nsFmt(NS.wC)} × Coerência + {nsFmt(NS.wK)} × Consistência</span>
      {ins ? <p style={nCss.p}>Sem dados suficientes, a conta não é feita e nenhum número é estimado.</p>
        : <><span style={nCss.label}>Com os seus valores</span>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text-strong)', fontFeatureSettings: "'tnum'", overflowWrap: 'anywhere' }}>{NS_FORMULA}</span></>}
    </div>
    {ins ? null : <>
      <dl style={factsGrid}>
        <Fact label="Consistência observada" value="4 registros em 2 semanas" note="Meta de referência: 6 registros em 3 semanas. A meta não é o resultado atual." />
        <Fact label="Coerência observada" value="4 evidências" note="Referência do que as evidências sustentam." />
      </dl>
      <p style={nCss.p}>Esses dados observados são referência. O Score só muda quando você atualiza a Coerência, e isso gera um novo snapshot no Histórico. Nada é recalculado em segundo plano.</p>
    </>}
    <div style={nCss.row}>
      <NBtn variant="ghost" size="sm" icon="sparkles" disabled={agentDown}>Pedir explicação ao Agente</NBtn>
      {agentDown ? <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Agente indisponível agora. Esta explicação continua válida.</span> : <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Agente em protótipo; responde só com o que você registrou.</span>}
    </div>
  </section>;

  return <NFloat open onClose={onClose} contained width={640} eyebrow="Narrative Score" title="Como o seu Score se formou.">
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <NIndex title="Neste painel" items={idxItems} />
      {resumo}
      <div style={{ borderTop: '1px solid var(--divider)' }}></div>
      {hist}
      <div style={{ borderTop: '1px solid var(--divider)' }}></div>
      {calc}
    </div>
  </NFloat>;
}
Object.assign(window, { NarrativePanel, N_SCN, NS_SCORE, NS_FORMULA });
