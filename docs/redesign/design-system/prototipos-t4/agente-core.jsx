/* T4.8 — Agente Persona: dados (§10), validação fechada, citações, lacuna, falha e sessão efêmera.
   Composer e MessageBubble só aparecem aqui via AgentPanel (painel acoplado) e na conversa central do Início. */
const AGP = window.PersonaDesignSystem_ff1a7b;
const { Chip: AgChip, Badge: AgBadge, Button: AgButton, Icon: AgIcon, FloatingPanel: AgFloat, TraceLine: AgTrace } = AGP;

const AG_SYN = 'Dados sintéticos para demonstração';
const AG_FAIL = 'Não consegui responder agora. Nada foi alterado.';
const AG_GAP = 'Ainda não há registro sobre isso.';
const AG_OWNER = 'yan';

/* Registro de origens citáveis — somente fatos da §10. */
const AG_REG = {
  e1: { kind: 'evidence', owner: AG_OWNER, n: 1, chip: 'Evidência 1', title: 'Automação de relatórios semanais com IA generativa', comp: ['Automação', 'Análise de dados'], level: 'Documentada', proofs: 2, uses: ['Persona Live · sessão Aurora (encerrada)', 'Artefato · Resposta STAR “Problema resolvido com dados” (Revisado)', 'Artefato · Pitch pessoal (Rascunho)'], href: 'T4.3 - Evidências.html?s=det-documentada' },
  e2: { kind: 'evidence', owner: AG_OWNER, n: 2, chip: 'Evidência 2', title: 'Pitch de 5 minutos para banca de empreendedorismo', comp: ['Comunicação', 'Storytelling'], level: 'Documentada', proofs: 1, uses: ['Persona Live · sessão Aurora (encerrada)', 'Artefato · Pitch pessoal (Rascunho)'], href: 'T4.3 - Evidências.html?s=det-e2' },
  e3: { kind: 'evidence', owner: AG_OWNER, n: 3, chip: 'Evidência 3', title: 'Entrevistas com 8 usuários para validar o problema', comp: ['Pesquisa com usuários', 'Análise'], level: 'Documentada', proofs: 1, uses: ['Persona Live · sessão Aurora (encerrada)', 'Artefato · Pitch pessoal (Rascunho)'], href: 'T4.3 - Evidências.html?s=det-e3' },
  e4: { kind: 'evidence', owner: AG_OWNER, n: 4, chip: 'Evidência 4', title: 'Oficina de Python para calouros', comp: ['Ensino', 'Liderança'], level: 'Registrada', proofs: 0, uses: [], href: 'T4.3 - Evidências.html?s=det-registrada' },
  s1: { kind: 'suggestion', owner: AG_OWNER, chip: 'Sugestão · cronograma', title: 'Organização do cronograma de entregas do semestre', href: 'T4.3 - Evidências.html?s=para-revisar' },
  s2: { kind: 'suggestion', owner: AG_OWNER, chip: 'Sugestão · protótipo', title: 'Protótipo de interface para app de carreira', href: 'T4.3 - Evidências.html?s=para-revisar' },
  'sc-cons': { kind: 'score', owner: AG_OWNER, chip: 'Score · Consistência', title: 'Consistência', value: 50, progress: '4 de 6 registros · 2 de 3 semanas', href: 'T4.6 - Narrative Score.html' },
  'sc-coer': { kind: 'score', owner: AG_OWNER, chip: 'Score · Coerência', title: 'Coerência', value: 75, progress: '4 de 5 evidências confirmadas', href: 'T4.6 - Narrative Score.html' },
  'live-aurora': { kind: 'session', owner: AG_OWNER, chip: 'Live · sessão Aurora', title: 'Analista júnior de IA generativa · Empresa Aurora (fictícia)', state: 'Encerrada · evidências 1, 2 e 3 autorizadas por você', href: 'T4.4 - Persona Live.html?s=encerrada' },
  'art-star': { kind: 'artifact', owner: AG_OWNER, chip: 'Artefato · STAR', title: 'Resposta STAR “Problema resolvido com dados”', status: 'revisado', cites: 'Cita a evidência 1.', href: 'T4.5 - Artefatos.html?s=d-star' },
  'art-pitch': { kind: 'artifact', owner: AG_OWNER, chip: 'Artefato · Pitch', title: 'Pitch pessoal', status: 'rascunho', cites: 'Cita as evidências 1, 2 e 3.', href: 'T4.5 - Artefatos.html?s=d-pitch' },
};
/* Existe, mas pertence a outra conta: nunca pode ser citada. */
const AG_FOREIGN = { x7: { owner: 'outra-conta' } };
const AG_KIND_ICON = { evidence: 'badge-check', suggestion: 'sparkles', score: 'target', session: 'mic', artifact: 'file-text' };

/* Ações propostas: só abrir, pré-preencher ou revisar. Toda confirmação acontece na superfície de destino. */
const AG_VERBS = ['abrir', 'pre-preencher', 'revisar'];
const AG_ACTIONS = {
  'Revisar sugestões': { verb: 'revisar', dest: 'Evidências › Para revisar', href: 'T4.3 - Evidências.html?s=para-revisar', rule: 'Nada foi confirmado. Você revisa e confirma cada sugestão lá.' },
  'Abrir no Persona Live': { verb: 'abrir', dest: 'Persona Live › Nova sessão', href: 'T4.4 - Persona Live.html?s=prep-vazia', rule: 'Nenhuma evidência foi autorizada. A oportunidade e a autorização são suas, na preparação.' },
  'Criar Artefato': { verb: 'pre-preencher', dest: 'Artefatos › Novo Artefato, com tipo e objetivo pré-preenchidos', href: 'T4.5 - Artefatos.html?s=c1-agente', rule: 'Nada foi gerado nem salvo. Você confirma cada etapa e revisa o texto lá.' },
  'Registrar no Diário': { verb: 'abrir', dest: 'Diário › editor', href: 'T4.2 - Diário.html?s=editor-vazio', rule: 'Nada foi salvo. Você escreve e salva o registro.' },
  'Ver em Evidências': { verb: 'abrir', dest: 'Evidências', href: 'T4.3 - Evidências.html?s=completa', rule: 'Nada foi alterado.' },
  'Abrir evidência': { verb: 'abrir', dest: 'detalhe da Evidência 4', cite: 'e4', rule: 'Somente leitura. Adicionar link de prova é uma ação sua, no detalhe.' },
};
/* Verbos que o Agente nunca pode propor (buscados no QA). */
const AG_FORBIDDEN = ['confirmar', 'autorizar', 'salvar', 'marcar-revisado', 'exportar', 'excluir', 'alterar-consentimento', 'sair'];

const AG_Q = {
  score: 'O que falta para meu score sair da base declarada?',
  entrevista: 'Quero treinar para a entrevista na Aurora.',
  material: 'Preciso de um pitch pessoal para a vaga de analista júnior de IA generativa.',
  organizar: 'Organize minhas evidências por competência.',
  semLink: 'Quais evidências ainda não têm link de prova?',
  lacuna: 'Fale de um conflito em equipe.',
  semCitacao: 'Já liderei uma equipe em algum projeto?',
};

/* Respostas brutas simuladas do provedor (antes da validação). */
const AG_RAW = {
  score: () => ({ kind: 'answer', claims: [
    { t: 'Para a Consistência observada faltam 2 registros e 1 semana (hoje: 4 de 6 registros · 2 de 3 semanas).', c: ['sc-cons'] },
    { t: 'Para a Coerência observada falta 1 evidência confirmada (hoje: 4 de 5).', c: ['sc-coer'] },
    { t: 'Revisar as 2 sugestões do Diário resolve a Coerência.', c: ['s1', 's2'] },
  ], actions: [{ label: 'Revisar sugestões', verb: 'revisar' }] }),
  entrevista: () => ({ kind: 'answer', claims: [
    { t: 'Você tem 1 sessão encerrada no Persona Live: Analista júnior de IA generativa · Empresa Aurora (fictícia).', c: ['live-aurora'] },
    { t: 'Nessa sessão, você autorizou as evidências 1, 2 e 3.', c: ['e1', 'e2', 'e3'] },
  ], note: 'Eu abro a preparação. A resposta de entrevista nasce no Persona Live, a partir das evidências que você autorizar.', actions: [{ label: 'Abrir no Persona Live', verb: 'abrir' }] }),
  material: () => ({ kind: 'answer', claims: [
    { t: 'Seu Pitch pessoal está em Rascunho e cita as evidências 1, 2 e 3.', c: ['art-pitch', 'e1', 'e2', 'e3'] },
    { t: 'Sua Resposta STAR “Problema resolvido com dados” está Revisada e cita a evidência 1.', c: ['art-star', 'e1'] },
  ], note: 'Não escrevo o material aqui. Posso iniciar um Artefato com tipo e objetivo pré-preenchidos; o texto é gerado e revisado em Artefatos.', actions: [{ label: 'Criar Artefato', verb: 'pre-preencher' }] }),
  organizar: () => ({ kind: 'answer', claims: [
    { t: 'Automação e análise de dados: Automação de relatórios semanais com IA generativa.', c: ['e1'] },
    { t: 'Comunicação e storytelling: Pitch de 5 minutos para banca de empreendedorismo.', c: ['e2'] },
    { t: 'Pesquisa com usuários e análise: Entrevistas com 8 usuários para validar o problema.', c: ['e3'] },
    { t: 'Ensino e liderança: Oficina de Python para calouros, ainda Registrada.', c: ['e4'] },
  ], actions: [{ label: 'Ver em Evidências', verb: 'abrir' }] }),
  semLink: () => ({ kind: 'answer', claims: [
    { t: 'Oficina de Python para calouros está Registrada, sem link de prova.', c: ['e4'] },
    { t: 'As outras 3 evidências confirmadas são Documentadas.', c: ['e1', 'e2', 'e3'] },
  ], actions: [{ label: 'Abrir evidência', verb: 'abrir' }] }),
  semCitacao: () => ({ kind: 'answer', claims: [{ t: 'Você liderou a equipe de entregas do semestre.', c: [] }], gapTarget: 'evidencias' }),
  lacuna: q => ({ kind: 'gap', target: 'diario', detail: /conflito/.test(agNorm(q)) ? 'Registre uma situação de conflito no Diário.' : 'Sem fato registrado, eu não respondo. Registre a situação no Diário.' }),
  'schema-invalido': () => ({ kind: 'answer', claims: 'Texto solto, sem estrutura nem origem.' }),
  'citacao-invalida': () => ({ kind: 'answer', claims: [{ t: 'Você publicou um artigo sobre IA generativa.', c: ['e9'] }], actions: [] }),
  'citacao-alheia': () => ({ kind: 'answer', claims: [{ t: 'Você coordenou um hackathon.', c: ['x7'] }], actions: [] }),
  'acao-proibida': () => ({ kind: 'answer', claims: [{ t: 'Revisar as 2 sugestões do Diário resolve a Coerência.', c: ['s1', 's2'] }], actions: [{ label: 'Confirmar evidência', verb: 'confirmar' }] }),
};
const AG_FAILS = {
  timeout: 'A resposta demorou mais do que o esperado.',
  'rate-limit': 'Muitas perguntas em pouco tempo. Aguarde um instante e tente de novo.',
  provedor: 'O serviço de IA não respondeu.',
  invalida: 'A resposta não passou na checagem de origem e foi descartada.',
};

function agNorm(s) { return String(s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase(); }
function agRoute(q) {
  const s = agNorm(q);
  if (/score|base declarada|observad/.test(s)) return 'score';
  if (/entrevista|aurora|treinar/.test(s)) return 'entrevista';
  if (/artefato|pitch|curriculo|material/.test(s)) return 'material';
  if (/link|prova/.test(s)) return 'semLink';
  if (/organiz|competencia/.test(s)) return 'organizar';
  if (/lider/.test(s)) return 'semCitacao';
  return 'lacuna';
}

/* Validação fechada: schema, origem (existe e é da pessoa), ações permitidas; sem citação → lacuna. */
function agValidate(raw) {
  const fail = why => ({ status: 'fail', reason: 'invalida', why });
  if (!raw || (raw.kind !== 'answer' && raw.kind !== 'gap')) return fail('schema');
  if (raw.kind === 'gap') return { status: 'gap', target: raw.target === 'evidencias' ? 'evidencias' : 'diario', detail: raw.detail };
  if (!Array.isArray(raw.claims) || !raw.claims.length) return fail('schema');
  const actions = raw.actions || [];
  if (!Array.isArray(actions)) return fail('schema');
  for (const a of actions) {
    const def = a && AG_ACTIONS[a.label];
    if (!def || def.verb !== a.verb || AG_VERBS.indexOf(a.verb) < 0) return fail('acao');
  }
  for (const c of raw.claims) {
    if (!c || typeof c.t !== 'string' || !Array.isArray(c.c)) return fail('schema');
    for (const id of c.c) {
      if (AG_FOREIGN[id]) return fail('alheia');
      const src = AG_REG[id];
      if (!src) return fail('inexistente');
      if (src.owner !== AG_OWNER) return fail('alheia');
    }
  }
  if (raw.claims.some(c => !c.c.length)) return { status: 'gap', target: raw.gapTarget || 'diario', detail: 'Uma afirmação sem origem foi descartada antes de chegar até você.', discarded: true };
  return { status: 'ok', claims: raw.claims, actions: actions.map(a => a.label), note: raw.note };
}

/* ---------- Peças visuais ---------- */
const agTxt = { margin: 0, fontSize: 13, lineHeight: 1.5, color: 'var(--text-body)', textWrap: 'pretty' };
const agRow = { display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center' };

function CitationChip({ id, onOpen }) {
  const src = AG_REG[id];
  if (!src || src.owner !== AG_OWNER) return null; /* falha fechada também na renderização */
  return <AgChip size="sm" icon={AG_KIND_ICON[src.kind]} onClick={() => onOpen && onOpen(id)}>{src.chip}</AgChip>;
}

function AgReply({ r, upto, onCite }) {
  const claims = upto != null ? r.claims.slice(0, upto) : r.claims;
  const act = upto == null && r.actions[0] ? AG_ACTIONS[r.actions[0]] : null;
  return <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
    <ol style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12 }}>
      {claims.map((c, i) => <li key={i} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <span style={{ fontFeatureSettings: "'tnum'" }}>{c.t}</span>
        <span style={agRow} aria-label="Origem">{c.c.map(id => <CitationChip key={id} id={id} onOpen={onCite} />)}</span>
      </li>)}
    </ol>
    {upto == null && r.note ? <p style={agTxt}>{r.note}</p> : null}
    {act ? <p style={{ ...agTxt, fontSize: 12, color: 'var(--text-muted)' }}>{'Ação proposta: abre ' + act.dest + '. Exige sua confirmação lá.'}</p> : null}
  </div>;
}

function GapNotice({ g }) {
  return <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: 12, borderRadius: 'var(--radius-sm)', border: '1px dashed var(--border-strong)' }}>
    <span style={agRow}><AgBadge status="lacuna" /><strong style={{ fontSize: 14, color: 'var(--text-strong)' }}>{AG_GAP}</strong></span>
    {g.detail ? <p style={agTxt}>{g.detail}</p> : null}
    <p style={{ ...agTxt, fontSize: 12, color: 'var(--text-muted)' }}>{g.target === 'evidencias' ? 'Ação proposta: abre Evidências. Nada é confirmado sem você.' : 'Ação proposta: abre o editor do Diário. Você escreve e salva.'}</p>
  </div>;
}

function FailNotice({ reason, onRetry }) {
  return <div role="alert" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
    <span style={agRow}><AgBadge tone="danger" icon="triangle-alert">Falha recuperável</AgBadge></span>
    <strong style={{ fontSize: 14, color: 'var(--text-strong)' }}>{AG_FAIL}</strong>
    <p style={agTxt}>{AG_FAILS[reason] + ' Sua pergunta continua aqui.'}</p>
    <span><AgButton variant="outline" size="sm" icon="refresh-cw" onClick={onRetry}>Tentar de novo</AgButton></span>
  </div>;
}

function Handoff({ label }) {
  const a = AG_ACTIONS[label];
  return <div role="status" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
    <span style={{ fontSize: 14, color: 'var(--text-strong)' }}>{'Pronto para abrir ' + a.dest + '.'}</span>
    <p style={agTxt}>{a.rule}</p>
    {a.href ? <span><a className="t48-link" href={a.href}><AgIcon name="arrow-up-right" size={14} />{'Ir para ' + a.dest.split(' ›')[0].split(',')[0]}</a></span> : null}
  </div>;
}

/* Converte itens da sessão em props de MessageBubble. */
function agBubbles(items, h) {
  const out = [];
  items.forEach((it, i) => {
    if (it.kind === 'user') out.push({ role: 'user', text: it.text });
    else if (it.kind === 'typing') out.push({ role: 'agent', typing: true, showAvatar: !it.cont });
    else if (it.kind === 'reply') out.push({ role: 'agent', text: <AgReply r={it.r} upto={it.upto} onCite={h.onCite} />, actions: it.upto != null ? [] : it.r.actions, onAction: l => h.onAction(l) });
    else if (it.kind === 'gap') out.push({ role: 'agent', text: <GapNotice g={it.g} />, actions: [it.g.target === 'evidencias' ? 'Ver em Evidências' : 'Registrar no Diário'], onAction: l => h.onAction(l) });
    else if (it.kind === 'fail') out.push({ role: 'agent', text: <FailNotice reason={it.reason} onRetry={() => h.onRetry(it.q)} /> });
    else if (it.kind === 'handoff') out.push({ role: 'agent', showAvatar: false, text: <Handoff label={it.label} /> });
  });
  return out;
}

/* Resultado validado de uma pergunta (ou falha forçada). */
function agResolve(q, force) {
  if (force && AG_FAILS[force]) return { kind: 'fail', reason: force, q };
  const key = force && AG_RAW[force] ? force : agRoute(q);
  const v = agValidate(AG_RAW[key](q));
  if (v.status === 'fail') return { kind: 'fail', reason: 'invalida', why: v.why, q };
  if (v.status === 'gap') return { kind: 'gap', g: v, q };
  return { kind: 'reply', r: v, q };
}

/* Estado inicial por cenário da revisão. Nada é lido nem gravado entre sessões. */
const AG_SEED = {
  vazio: () => ({ items: [] }),
  digitando: () => ({ items: [], draft: AG_Q.score }),
  respondendo: () => ({ items: [{ kind: 'user', text: AG_Q.score }, { kind: 'typing' }], busy: true }),
  parcial: () => { const r = agResolve(AG_Q.score); return { items: [{ kind: 'user', text: AG_Q.score }, { ...r, upto: 1 }, { kind: 'typing', cont: true }], busy: true, finish: r }; },
  completa: () => ({ items: [{ kind: 'user', text: AG_Q.score }, agResolve(AG_Q.score)] }),
  entrevista: () => ({ items: [{ kind: 'user', text: AG_Q.entrevista }, agResolve(AG_Q.entrevista)] }),
  material: () => ({ items: [{ kind: 'user', text: AG_Q.material }, agResolve(AG_Q.material)] }),
  organizar: () => ({ items: [{ kind: 'user', text: AG_Q.organizar }, agResolve(AG_Q.organizar)] }),
  lacuna: () => ({ items: [{ kind: 'user', text: AG_Q.lacuna }, agResolve(AG_Q.lacuna)] }),
  'sem-citacao': () => ({ items: [{ kind: 'user', text: AG_Q.semCitacao }, agResolve(AG_Q.semCitacao)] }),
  'schema-invalido': () => ({ items: [{ kind: 'user', text: AG_Q.score }, agResolve(AG_Q.score, 'schema-invalido')] }),
  'citacao-invalida': () => ({ items: [{ kind: 'user', text: AG_Q.score }, agResolve(AG_Q.score, 'citacao-invalida')] }),
  'citacao-alheia': () => ({ items: [{ kind: 'user', text: AG_Q.score }, agResolve(AG_Q.score, 'citacao-alheia')] }),
  'acao-proibida': () => ({ items: [{ kind: 'user', text: AG_Q.score }, agResolve(AG_Q.score, 'acao-proibida')] }),
  timeout: () => ({ items: [{ kind: 'user', text: AG_Q.score }, agResolve(AG_Q.score, 'timeout')] }),
  'rate-limit': () => ({ items: [{ kind: 'user', text: AG_Q.score }, agResolve(AG_Q.score, 'rate-limit')] }),
  provedor: () => ({ items: [{ kind: 'user', text: AG_Q.score }, agResolve(AG_Q.score, 'provedor')] }),
  'acao-proposta': () => ({ items: [{ kind: 'user', text: AG_Q.score }, agResolve(AG_Q.score), { kind: 'handoff', label: 'Revisar sugestões' }] }),
  indisponivel: () => ({ items: [], unavailable: true }),
  recolhido: () => ({ items: [{ kind: 'user', text: AG_Q.score }, agResolve(AG_Q.score)] }),
};

/* Sessão efêmera: só memória do componente; some ao recarregar. */
function useAgentSession(stateKey) {
  const seed = React.useMemo(() => (AG_SEED[stateKey] || AG_SEED.vazio)(), [stateKey]);
  const [items, setItems] = React.useState(seed.items);
  const [draft, setDraft] = React.useState(seed.draft || '');
  const [busy, setBusy] = React.useState(!!seed.busy);
  const [cite, setCite] = React.useState(null);
  const timers = React.useRef([]);
  const later = (fn, ms) => { timers.current.push(setTimeout(fn, ms)); };
  React.useEffect(() => () => timers.current.forEach(clearTimeout), []);
  const settle = res => {
    if (res.kind === 'reply' && res.r.claims.length > 1) {
      setItems(a => [...a.filter(x => x.kind !== 'typing'), { ...res, upto: 1 }, { kind: 'typing', cont: true }]);
      later(() => { setItems(a => [...a.filter(x => x.kind !== 'typing' && !(x.kind === 'reply' && x.upto != null)), res]); setBusy(false); }, 700);
    } else { setItems(a => [...a.filter(x => x.kind !== 'typing'), res]); setBusy(false); }
  };
  React.useEffect(() => {
    if (stateKey === 'respondendo') later(() => settle(agResolve(AG_Q.score)), 1600);
    if (stateKey === 'parcial') later(() => { setItems(a => [...a.filter(x => x.kind !== 'typing' && !(x.kind === 'reply' && x.upto != null)), seed.finish]); setBusy(false); }, 1600);
  }, []);
  const ask = (q, force) => {
    const text = String(q || '').trim();
    if (!text || busy || seed.unavailable) return;
    setDraft(''); setBusy(true);
    setItems(a => [...a, { kind: 'user', text }, { kind: 'typing' }]);
    later(() => settle(agResolve(text, force)), 900);
  };
  const retry = q => {
    if (busy) return;
    setBusy(true);
    setItems(a => [...a.filter(x => x.kind !== 'fail'), { kind: 'typing' }]);
    later(() => settle(agResolve(q)), 900);
  };
  const act = label => {
    const a = AG_ACTIONS[label]; if (!a) return;
    if (a.cite) { setCite(a.cite); return; }
    setItems(x => [...x.filter(i => i.kind !== 'handoff'), { kind: 'handoff', label }]);
  };
  const reset = () => { timers.current.forEach(clearTimeout); setItems([]); setBusy(false); setDraft(''); };
  const bubbles = agBubbles(items, { onCite: setCite, onAction: act, onRetry: retry });
  return { items, bubbles, draft, setDraft, busy, ask, retry, act, reset, cite, setCite, unavailable: !!seed.unavailable };
}

const AG_FOOTER = <span style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
  <span>O agente só usa as evidências que você registrou. Confira sempre a origem.</span>
  <span>{'Protótipo · conversa só desta sessão, não fica salva · ' + AG_SYN.toLowerCase() + '.'}</span>
</span>;

/* Detalhe da origem citada — somente leitura, painel flutuante (um por vez). */
function SourceDetail({ id, onClose }) {
  const src = id ? AG_REG[id] : null;
  const open = !!id;
  if (!open) return null;
  if (!src || src.owner !== AG_OWNER) return <AgFloat open contained onClose={onClose} eyebrow="Origem" title="Origem indisponível." width={560}><p style={agTxt}>Esta origem não existe ou não é sua. Nada foi exibido.</p></AgFloat>;
  const sec = { display: 'flex', flexDirection: 'column', gap: 8 };
  const h3 = { margin: 0, fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 700, color: 'var(--text-strong)' };
  const footer = <a className="t48-link" href={src.href}><AgIcon name="arrow-up-right" size={14} />Abrir na superfície</a>;
  let body, eyebrow, sub;
  if (src.kind === 'evidence') {
    eyebrow = 'Evidência ' + src.n + ' · origem citada'; sub = 'Confirmada por você';
    body = <>
      <div style={sec}><span style={agRow}><AgBadge status={src.level.toLowerCase()} />{src.comp.map(c => <AgChip key={c} size="sm">{c}</AgChip>)}</span></div>
      <div style={sec}><h3 style={h3}>Provas</h3><p style={{ ...agTxt, fontFeatureSettings: "'tnum'" }}>{src.proofs ? src.proofs + (src.proofs === 1 ? ' link de prova' : ' links de prova') + ' · endereços: ' + AG_SYN.toLowerCase() + '.' : 'Nenhum link de prova. Por isso, o nível é Registrada.'}</p></div>
      <div style={sec}><h3 style={h3}>Uso</h3>{src.uses.length ? <ul style={{ margin: 0, paddingLeft: 18, ...agTxt }}>{src.uses.map(u => <li key={u}>{u}</li>)}</ul> : <p style={agTxt}>Ainda não usada no Live nem em Artefatos.</p>}</div>
      <AgTrace title="Rastreabilidade" steps={[{ kind: 'registro', label: 'Registro', state: 'done' }, { kind: 'evidencia', label: 'Confirmada por você', state: 'done' }, { kind: 'prova', label: src.proofs ? 'Link de prova' : 'Sem link', state: src.proofs ? 'done' : 'gap' }, { kind: 'uso', label: src.uses.length ? 'Live e Artefatos' : 'Sem uso', state: src.uses.length ? 'done' : 'gap' }]} />
    </>;
  } else if (src.kind === 'suggestion') {
    eyebrow = 'Sugestão para revisar · origem citada'; sub = 'Diário · registro de ontem';
    body = <>
      <span style={agRow}><AgBadge status="para-revisar" /></span>
      <p style={agTxt}>Ainda não é evidência. Ela só nasce quando você confirma em Evidências › Para revisar.</p>
      <AgTrace title="Rastreabilidade" steps={[{ kind: 'registro', label: 'Registro de ontem', state: 'done' }, { kind: 'sugestao', label: 'Sugestão da IA', state: 'done' }, { kind: 'evidencia', label: 'Aguarda sua confirmação', state: 'gap' }]} />
    </>;
  } else if (src.kind === 'score') {
    eyebrow = 'Narrative Score · origem citada'; sub = 'Base declarada · confiança Inicial';
    body = <>
      <p style={{ ...agTxt, fontSize: 14, color: 'var(--text-strong)', fontFeatureSettings: "'tnum'" }}>{src.title + ' ' + src.value + ' · declarada'}</p>
      <div style={sec}><h3 style={h3}>Rumo ao dado observado</h3><p style={{ ...agTxt, fontFeatureSettings: "'tnum'" }}>{src.progress}</p></div>
      <div style={sec}><h3 style={h3}>Como é calculado</h3><p style={{ ...agTxt, fontFeatureSettings: "'tnum'" }}>Total = 0,6 × Coerência + 0,4 × Consistência = 0,6 × 75 + 0,4 × 50 = 65. Credibilidade fica fora do total: ainda não avaliada.</p></div>
    </>;
  } else if (src.kind === 'session') {
    eyebrow = 'Persona Live · origem citada'; sub = src.state;
    body = <p style={agTxt}>Sessão somente leitura. Uma nova sessão exige que você autorize as evidências na preparação.</p>;
  } else {
    eyebrow = 'Artefato · origem citada'; sub = src.cites;
    body = <><span style={agRow}><AgBadge status={src.status} /></span><p style={agTxt}>Somente leitura aqui. Edição, revisão e exportação acontecem em Artefatos, por você.</p></>;
  }
  return <AgFloat open contained onClose={onClose} eyebrow={eyebrow} title={src.title} subtitle={sub} width={560} footer={footer}>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>{body}</div>
  </AgFloat>;
}

/* Busca simples (agente indisponível): só títulos de evidências e sugestões. */
function agSearch(q) {
  const s = agNorm(q).trim(); if (!s) return [];
  return Object.keys(AG_REG).filter(id => ['evidence', 'suggestion'].indexOf(AG_REG[id].kind) >= 0 && agNorm(AG_REG[id].title).includes(s));
}

Object.assign(window, { AG_REG, AG_ACTIONS, AG_VERBS, AG_FORBIDDEN, AG_Q, AG_RAW, AG_SEED, AG_FAIL, AG_GAP, AG_SYN, AG_FOOTER, agValidate, agResolve, agRoute, agSearch, useAgentSession, CitationChip, GapNotice, FailNotice, SourceDetail });
