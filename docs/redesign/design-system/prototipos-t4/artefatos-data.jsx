
/* T4.5 — dados. Fonte literal §10: Yan, objetivo, evidências 1–4 (título, competências, provas 2/1/1/0), Artefatos (STAR Revisado cita 1; Pitch Rascunho cita 1–3).
   Links, datas relativas e e-mail de contato: dados sintéticos para demonstração. Nenhum resultado, número ou empresa foi acrescentado além do §10. */
const A_SYN = 'Dados sintéticos para demonstração';
const A_OBJ = 'Vaga de analista júnior de IA generativa';
const A_EV = {
  e1: { id: 'e1', n: 1, title: 'Automação de relatórios semanais com IA generativa', comp: ['Automação', 'Análise de dados'], links: ['https://exemplo.com/prova-1a', 'https://exemplo.com/prova-1b'], level: 'Documentada', origin: 'Diário' },
  e2: { id: 'e2', n: 2, title: 'Pitch de 5 minutos para banca de empreendedorismo', comp: ['Comunicação', 'Storytelling'], links: ['https://exemplo.com/prova-2'], level: 'Documentada', origin: 'Diário' },
  e3: { id: 'e3', n: 3, title: 'Entrevistas com 8 usuários para validar o problema', comp: ['Pesquisa com usuários', 'Análise'], links: ['https://exemplo.com/prova-3'], level: 'Documentada', origin: 'Diário' },
  e4: { id: 'e4', n: 4, title: 'Oficina de Python para calouros', comp: ['Ensino', 'Liderança'], links: [], level: 'Registrada', origin: 'Diário' },
};
const A_EVIDS = ['e1', 'e2', 'e3', 'e4'];
const A_ROLE = {
  e1: {
    sit: ['Contexto registrado: produção de relatórios semanais.', 'O ponto de partida eram os relatórios semanais.'],
    tar: ['Tarefa: automatizar os relatórios semanais.', 'Precisava automatizar os relatórios semanais.'],
    act: ['Automatizei os relatórios semanais com IA generativa e análise de dados.', 'Usei IA generativa e análise de dados para automatizar os relatórios semanais.'],
    res: ['Resultado registrado: relatórios semanais automatizados com IA generativa. A evidência não traz métrica.', 'Entrega registrada: relatórios semanais automatizados; sem métrica na evidência.'],
  },
  e2: { act: ['Apresentei um pitch de 5 minutos para uma banca de empreendedorismo.', 'Fiz um pitch de 5 minutos diante de uma banca de empreendedorismo.'] },
  e3: { act: ['Conduzi entrevistas com 8 usuários para validar o problema.', 'Entrevistei 8 usuários para validar o problema.'] },
  e4: { act: ['Conduzi uma oficina de Python para calouros.', 'Dei uma oficina de Python para calouros.'] },
};
const A_TYPES = [
  { id: 'star', label: 'Resposta STAR', icon: 'list-checks', desc: 'Situação, Tarefa, Ação e Resultado de uma experiência real.', out: 'Salvar e copiar' },
  { id: 'pitch', label: 'Pitch pessoal', icon: 'quote', desc: 'Três versões independentes: 30, 60 e 90 segundos.', out: 'Salvar e copiar' },
  { id: 'curriculo', label: 'Currículo ATS', icon: 'file-text', desc: 'Texto simples em seções, pronto para triagem automática.', out: 'Pré-visualização e PDF' },
  { id: 'portfolio', label: 'Portfólio por casos', icon: 'layers', desc: 'Casos com ação, resultado registrado e provas.', out: 'Pré-visualização e PDF' },
];
const A_TLABEL = Object.fromEntries(A_TYPES.map(t => [t.id, t.label]));
const A_PDF = { curriculo: true, portfolio: true };

const aFact = (evId, role, alt) => ({ id: evId + '.' + role, ev: evId, t: A_ROLE[evId][role][0], a: A_ROLE[evId][role][1] });
const aComp = evId => ({ id: evId + '.comp', ev: evId, t: 'Competências registradas: ' + A_EV[evId].comp.join(' · ') + '.', a: 'Competências que esta evidência sustenta: ' + A_EV[evId].comp.join(' · ') + '.' });
const aProof = evId => { const n = A_EV[evId].links.length; return { id: evId + '.proof', ev: evId, t: n ? 'Prova: ' + n + (n === 1 ? ' link' : ' links') + ' de prova associados (' + A_SYN.toLowerCase() + ').' : 'Sem link de prova: evidência Registrada.', a: n ? 'Documentada por ' + n + (n === 1 ? ' link' : ' links') + ' (' + A_SYN.toLowerCase() + ').' : 'Ainda sem link de prova (Registrada).' }; };
const aTitle = evId => ({ id: evId + '.title', ev: evId, t: A_EV[evId].title + '.', a: A_EV[evId].title + '.' });
const aDecl = (id, t, label) => ({ id, ev: null, kind: 'decl', t, a: t, label: label || 'Declaração manual' });
const aHas = (evId, role) => !!(A_ROLE[evId] && A_ROLE[evId][role]);

/* Gera seções somente a partir de evidências autorizadas e dados manuais. Sem fato: lacuna explícita. */
function aGenerate(type, sel, man, objective) {
  const S = A_EVIDS.filter(i => sel.includes(i));
  const m = man || {};
  const gap = (id, title, text, extra) => ({ id, title, facts: [], gap: text, ...extra });
  const sec = (id, title, facts, extra) => ({ id, title, facts, ...extra });
  const acts = () => S.filter(i => aHas(i, 'act')).map(i => aFact(i, 'act'));
  if (type === 'star') {
    const p = S.find(i => aHas(i, 'sit')) || S[0];
    const f = role => p && aHas(p, role) ? [aFact(p, role)] : null;
    return [
      f('sit') ? sec('sit', 'Situação', f('sit')) : gap('sit', 'Situação', 'A evidência escolhida não registra o contexto. Registre a situação no Diário.'),
      f('tar') ? sec('tar', 'Tarefa', f('tar')) : gap('tar', 'Tarefa', 'A evidência escolhida não registra a tarefa. Registre no Diário.'),
      f('act') ? sec('act', 'Ação', f('act')) : gap('act', 'Ação', 'Nenhuma ação registrada nas evidências autorizadas.'),
      f('res') ? sec('res', 'Resultado', f('res')) : gap('res', 'Resultado', 'A evidência escolhida não registra resultado. Nada foi inventado; registre o resultado no Diário.'),
      gap('apr', 'Aprendizado', 'Opcional: nenhuma evidência autorizada registra um aprendizado.', { optional: true }),
    ];
  }
  if (type === 'pitch') {
    const A = acts(); const intro = aDecl('intro', 'Sou Yan, estagiário em IA generativa.');
    const c0 = S.length ? [aComp(S[0])] : [];
    const rest = S.slice(1).map(aComp), res = S.filter(i => aHas(i, 'res')).map(i => aFact(i, 'res'));
    if (!A.length) return ['s30', 's60', 's90'].map((id, k) => gap(id, [30, 60, 90][k] + ' segundos', 'Sem ação registrada nas evidências autorizadas.'));
    return [
      sec('s30', '30 segundos', [intro, ...A.slice(0, 2)], { dur: 30 }),
      sec('s60', '60 segundos', [intro, ...A, ...c0], { dur: 60 }),
      sec('s90', '90 segundos', [intro, ...A, ...c0, ...rest, ...res, aDecl('obj', 'Busco: ' + (objective || A_OBJ).toLowerCase() + '.', 'Objetivo declarado')], { dur: 90 }),
    ];
  }
  const A = acts();
  const needManual = (id, title, val, lab) => val && val.trim() ? sec(id, title, [aDecl(id + '.m', val.trim(), lab || 'Declaração manual')]) : gap(id, title, 'Declaração manual não informada. Preencha na etapa 4 ou na edição antes de exportar.', { manualGap: true });
  if (type === 'curriculo') {
    return [
      m.email && m.email.trim() ? sec('ident', 'Identificação', [aDecl('nome', 'Yan'), aDecl('ident.m', 'E-mail: ' + m.email.trim(), m.synthetic ? A_SYN : 'Declaração manual')]) : sec('ident', 'Identificação', [aDecl('nome', 'Yan')], { note: 'Contato: declaração manual não informada.' }),
      sec('obj', 'Objetivo', [aDecl('obj', objective || A_OBJ, 'Objetivo declarado')]),
      A.length ? sec('resumo', 'Resumo', [aDecl('resumo.i', 'Estagiário em IA generativa.'), ...A.slice(0, 2)]) : gap('resumo', 'Resumo', 'Sem ação registrada nas evidências autorizadas.'),
      A.length ? sec('exp', 'Experiências e projetos', [...A, ...S.filter(i => aHas(i, 'res')).map(i => aFact(i, 'res'))], { list: true }) : gap('exp', 'Experiências e projetos', 'Autorize ao menos uma evidência com ação registrada.'),
      needManual('form', 'Formação', m.formacao),
      sec('comp', 'Competências e idiomas', [...S.map(aComp), ...(m.idiomas && m.idiomas.trim() ? [aDecl('idiomas', 'Idiomas: ' + m.idiomas.trim())] : [])], { list: true, note: m.idiomas && m.idiomas.trim() ? null : 'Idiomas: declaração manual não informada.' }),
    ];
  }
  return [
    sec('capa', 'Capa', [aDecl('capa', 'Portfólio de Yan · ' + (objective || A_OBJ), 'Objetivo declarado')]),
    sec('apres', 'Apresentação', [aDecl('apres', 'Estagiário em IA generativa, com registros rastreáveis em evidências.')]),
    S.length ? sec('comp', 'Competências', S.map(aComp), { list: true }) : gap('comp', 'Competências', 'Nenhuma evidência autorizada.'),
    S.length ? sec('proj', 'Projetos', S.map(aTitle), { list: true }) : gap('proj', 'Projetos', 'Nenhuma evidência autorizada.'),
    S.length ? sec('casos', 'Casos', S.flatMap(i => [aFact(i, 'act'), ...(aHas(i, 'res') ? [aFact(i, 'res')] : []), aProof(i)]).filter(Boolean), { list: true, note: 'Contexto, resultado e aprendizado por caso: apenas o que as evidências registram.' }) : gap('casos', 'Casos', 'Nenhuma evidência autorizada.'),
    m.email && m.email.trim() ? sec('contato', 'Contato', [aDecl('contato.m', 'E-mail: ' + m.email.trim(), m.synthetic ? A_SYN : 'Declaração manual')]) : gap('contato', 'Contato', 'Declaração manual não informada.', { manualGap: true }),
  ];
}

const aCited = s => [...new Set([...s.facts.filter(f => f.ev).map(f => f.ev), ...(s.srcs || [])])];
const aAllCited = secs => [...new Set(secs.flatMap(aCited))].sort();
const aText = (s, plain) => s.facts.map(f => (s.alt ? f.a : f.t)).join(plain === 'list' ? '\n' : ' ');

/* Ações fechadas por seção: Encurtar · Aprofundar · Adaptar ao objetivo · Gerar alternativa. Só reorganizam fatos autorizados. */
function aApply(s, kind, objective, avail) {
  const cited = s.facts.filter(f => f.ev);
  if (kind === 'shorten') {
    if (cited.length <= 1) return { msg: 'Esta seção já está no menor tamanho com fonte.' };
    const keep = new Set(cited.slice(0, Math.ceil(cited.length / 2)).map(f => f.id));
    return { s: { ...s, facts: s.facts.filter(f => !f.ev || keep.has(f.id)) }, msg: 'Seção encurtada: ficaram os fatos com fonte mais diretos.' };
  }
  if (kind === 'deepen') {
    const have = new Set(s.facts.map(f => f.id));
    const pool = aCited(s).filter(e => avail.includes(e)).flatMap(e => [aComp(e), aProof(e)]).filter(f => !have.has(f.id));
    if (!pool.length) return { msg: 'Nada a aprofundar: todos os fatos das evidências autorizadas já aparecem nesta seção.' };
    return { s: { ...s, facts: [...s.facts, ...pool.slice(0, 2)] }, msg: 'Seção aprofundada com ' + Math.min(2, pool.length) + (pool.length === 1 ? ' fato' : ' fatos') + ' das mesmas evidências.' };
  }
  if (kind === 'adapt') {
    if (s.adapted) return { msg: 'Esta seção já está adaptada ao objetivo declarado.' };
    const score = f => /IA generativa/.test(A_EV[f.ev] ? A_EV[f.ev].title : '') ? 0 : 1;
    const sorted = [...s.facts.filter(f => f.ev)].sort((x, y) => score(x) - score(y));
    const decl = s.facts.filter(f => !f.ev);
    return { s: { ...s, adapted: true, facts: [...decl, aDecl('foco', 'Foco na vaga: ' + (objective || A_OBJ).toLowerCase() + '.', 'Objetivo declarado'), ...sorted] }, msg: 'Seção adaptada ao objetivo declarado. Nenhum fato novo foi acrescentado.' };
  }
  return { s: { ...s, alt: !s.alt }, msg: 'Alternativa de redação gerada com os mesmos fatos e as mesmas fontes.' };
}

const aSnap = secs => JSON.parse(JSON.stringify(secs));
function aMake(id, type, title, status, sel, man, objective, versions, updated) {
  const secs = aGenerate(type, sel, man, objective);
  return { id, type, title, status, objective, sel, man, sections: secs, versions: versions || [{ n: 1, label: 'Geração inicial', detail: 'Gerada pelo Persona só com as evidências autorizadas.', age: updated, sections: aSnap(secs) }], updated };
}
function aSeed() {
  const star = aMake('a1', 'star', 'Problema resolvido com dados', 'revisado', ['e1'], {}, A_OBJ, null, 'há 12 dias');
  const s2 = aSnap(star.sections); star.versions = [{ n: 1, label: 'Geração inicial', detail: 'Gerada pelo Persona só com a evidência 1.', age: 'há 12 dias', sections: star.versions[0].sections }];
  star.versions.push({ n: 2, label: 'Alternativa de redação · Ação', detail: 'Seção Ação com redação alternativa; mesmos fatos e fonte.', age: 'há 12 dias', sections: s2.map(x => x.id === 'act' ? { ...x, alt: true } : x) });
  star.sections = star.versions[1].sections;
  const pitch = aMake('a2', 'pitch', 'Pitch pessoal', 'rascunho', ['e1', 'e2', 'e3'], {}, A_OBJ, null, 'há 3 dias');
  const p1 = pitch.versions[0].sections; pitch.versions[0].age = 'há 3 dias'; pitch.versions[0].detail = 'Gerada pelo Persona só com as evidências 1, 2 e 3.';
  pitch.versions.push({ n: 2, label: 'Adaptada ao objetivo · 60 segundos', detail: 'Seção de 60 segundos adaptada à vaga declarada.', age: 'há 3 dias', sections: p1.map(x => x.id === 's60' ? aApply(x, 'adapt', A_OBJ, ['e1', 'e2', 'e3']).s : x) });
  pitch.sections = aSnap(pitch.versions[1].sections);
  return [star, pitch];
}
function aUseW() {
  const ref = React.useRef(null); const [w, setW] = React.useState(0);
  React.useLayoutEffect(() => { const el = ref.current; if (!el) return; const f = () => setW(el.offsetWidth); f(); const ro = new ResizeObserver(f); ro.observe(el); return () => ro.disconnect(); }, []);
  return [ref, w];
}
window.aUseW = aUseW;
const A_MAN0 = { email: 'yan@exemplo.com', synthetic: true, formacao: '', idiomas: '' };
Object.assign(window, { A_SYN, A_OBJ, A_EV, A_EVIDS, A_TYPES, A_TLABEL, A_PDF, aGenerate, aCited, aAllCited, aText, aApply, aSnap, aMake, aSeed, A_MAN0, aComp, aProof });
