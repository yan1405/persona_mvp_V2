const DPDS = window.PersonaDesignSystem_ff1a7b;
const { FloatingPanel: DFloat, SectionIndex: DIndex, TraceLine: DTrace, EvidenceCard: DEvidence, Badge: DBadge, Button: DButton, Input: DInput, Icon: DIcon, FIELD_FOCUS: D_FIELD_FOCUS } = DPDS;

const dpCss = {
  h3: { margin: 0, fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, letterSpacing: '-0.01em', color: 'var(--text-strong)' },
  p: { margin: 0, fontSize: 13, lineHeight: 1.55, color: 'var(--text-body)', textWrap: 'pretty' },
  label: { fontSize: 12, fontWeight: 600, color: 'var(--text-muted)' },
  row: { display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' },
  quote: { margin: 0, padding: '14px 16px', borderRadius: 'var(--radius-sm)', background: 'var(--n-25)', border: '1px solid var(--border-subtle)', fontSize: 15, lineHeight: 1.6, color: 'var(--text-strong)', whiteSpace: 'pre-wrap', textWrap: 'pretty' },
  notice: { display: 'flex', flexDirection: 'column', gap: 10, padding: 16, borderRadius: 'var(--radius-sm)', background: 'var(--n-25)', border: '1px solid var(--border-subtle)' },
};

function DNotice({ tone, icon, badge, children, actions, role }) {
  return <div role={role} style={dpCss.notice}>
    <div style={dpCss.row}><DBadge tone={tone} icon={icon}>{badge}</DBadge></div>
    <p style={dpCss.p}>{children}</p>
    {actions ? <div style={dpCss.row}>{actions}</div> : null}
  </div>;
}

function traceFor(rec, ui) {
  if (rec.evidence) return [
    { kind: 'registro', label: 'Registro', meta: rec.date, state: 'done' },
    { kind: 'sugestao', label: 'Sugestão', meta: 'Revisada', state: 'done' },
    { kind: 'evidencia', label: 'Evidência', meta: rec.evidence.level, state: 'done' },
    { kind: 'prova', label: 'Prova', meta: rec.evidence.proofs ? rec.evidence.proofs + (rec.evidence.proofs === 1 ? ' link' : ' links') : 'Sem link', state: rec.evidence.proofs ? 'done' : 'gap' },
    { kind: 'uso', label: 'Uso', meta: rec.evidence.use || 'Ainda não usada', state: rec.evidence.use ? 'done' : 'gap' },
  ];
  const conf = ui.items.filter(i => i.st === 'confirmed').length;
  const sug = { none: ['Não gerada', 'gap'], generating: ['Gerando', 'gap'], empty: ['Nenhuma útil', 'gap'], failed: ['Falha da IA', 'error'], manual: ['Manual', 'done'], ready: [ui.items.filter(i => i.st === 'pending').length + ' para revisar', 'done'] }[ui.sug];
  return [
    { kind: 'registro', label: 'Registro', meta: rec.date, state: 'done' },
    { kind: 'sugestao', label: 'Sugestão', meta: sug[0], state: sug[1] },
    { kind: 'evidencia', label: 'Evidência', meta: conf ? conf + ' confirmada' : 'Aguarda você', state: conf ? 'done' : 'gap' },
    { kind: 'uso', label: 'Uso', meta: 'Ainda não usada', state: 'gap' },
  ];
}

function RegistroSection({ rec, ui, set, onDelete }) {
  const ed = ui.edit;
  const dirty = ed && ed.text !== rec.text;
  const [f, setF] = React.useState(false);
  const pendings = ui.items.filter(i => i.st === 'pending').length;
  return <section id="dp-registro" aria-labelledby="dp-registro-h" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
    <div style={{ ...dpCss.row, justifyContent: 'space-between' }}>
      <h3 id="dp-registro-h" style={dpCss.h3}>Registro</h3>
      {dirty ? <DBadge tone="warning" icon="pencil">Alterações não salvas</DBadge> : null}
    </div>
    {ed ? <>
      {ed.conflict ? <DNotice role="alert" tone="warning" icon="triangle-alert" badge="Conflito de versão"
        actions={ed.showSaved ? null : <DButton variant="ghost" size="sm" icon="history" onClick={() => set({ edit: { ...ed, showSaved: true } })}>Ver versão salva</DButton>}>
        Este registro foi alterado em outra aba depois que você começou a editar. Seu texto abaixo foi mantido; escolha qual versão fica.
      </DNotice> : null}
      {ed.conflict && ed.showSaved ? <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}><span style={dpCss.label}>Versão salva na outra aba</span><p style={{ ...dpCss.quote, fontSize: 14, background: 'var(--surface-card)' }}>{rec.text}</p></div> : null}
      <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <span style={dpCss.label}>Sua versão</span>
        <textarea value={ed.text} onChange={e => set({ edit: { ...ed, text: e.target.value.slice(0, 2000) } })} onFocus={() => setF(true)} onBlur={() => setF(false)}
          style={{ width: '100%', boxSizing: 'border-box', minHeight: 120, resize: 'vertical', padding: '12px 14px', fontFamily: 'var(--font-body)', fontSize: 15, lineHeight: 1.6, color: 'var(--text-strong)', background: 'var(--surface-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', outline: 0, ...(f ? D_FIELD_FOCUS : {}) }} />
      </label>
      <div style={dpCss.row}>
        <DButton variant="solid" size="sm" icon="check" disabled={ed.text.length < 40} onClick={() => set({ edit: null, savedText: ed.text })}>{ed.conflict ? 'Salvar minha versão' : 'Salvar alterações'}</DButton>
        <DButton variant="ghost" size="sm" icon="x" onClick={() => set({ edit: null })}>{ed.conflict ? 'Manter versão salva' : 'Cancelar edição'}</DButton>
      </div>
    </> : <>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <span style={dpCss.label}>{rec.synthetic ? 'Texto original · dados sintéticos para demonstração' : 'Texto original · como você escreveu'}</span>
        <p style={dpCss.quote}>{ui.savedText || rec.text}</p>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 16px', fontSize: 12, color: 'var(--text-muted)', fontFeatureSettings: "'tnum'" }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}><DIcon name="calendar" size={13} />{rec.dateLong}</span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}><DIcon name="folder" size={13} />{rec.context ? 'Contexto: ' + rec.context : 'Sem contexto'}</span>
        <span style={{ whiteSpace: 'nowrap' }}>{(ui.savedText || rec.text).length.toLocaleString('pt-BR')} caracteres</span>
      </div>
      {!ui.del ? <div style={dpCss.row}>
        <DButton variant="ghost" size="sm" icon="pencil" onClick={() => set({ edit: { text: ui.savedText || rec.text, conflict: false } })}>Editar registro</DButton>
        <DButton variant="ghost" size="sm" icon="trash-2" onClick={() => set({ del: rec.evidence ? 'blocked' : 'confirm' })}>Excluir registro</DButton>
      </div> : null}
      {ui.del === 'blocked' ? <DNotice role="alert" tone="neutral" icon="lock" badge="Exclusão bloqueada"
        actions={<DButton variant="ghost" size="sm" icon="x" onClick={() => set({ del: null })}>Entendi</DButton>}>
        {'Este registro originou a evidência confirmada “' + rec.evidence.title + '”' + (rec.evidence.use ? ', usada em ' + rec.evidence.use : '') + '. Excluí-lo quebraria a rastreabilidade, por isso ele fica preservado.'}
      </DNotice> : null}
      {ui.del === 'confirm' ? <DNotice role="alertdialog" tone="warning" icon="trash-2" badge="Excluir registro?"
        actions={<><DButton variant="solid" size="sm" icon="trash-2" onClick={onDelete}>Excluir registro</DButton><DButton variant="ghost" size="sm" onClick={() => set({ del: null })}>Cancelar</DButton></>}>
        {(pendings ? 'As ' + pendings + ' sugestões pendentes deste registro também serão descartadas. ' : '') + 'Nenhuma evidência confirmada depende dele. Esta ação não pode ser desfeita.'}
      </DNotice> : null}
      {ui.del === 'failed' ? <DNotice role="alert" tone="danger" icon="triangle-alert" badge="Exclusão não concluída"
        actions={<><DButton variant="outline" size="sm" icon="refresh-cw" onClick={onDelete}>Tentar excluir de novo</DButton><DButton variant="ghost" size="sm" onClick={() => set({ del: null })}>Manter registro</DButton></>}>
        Não foi possível excluir agora. O registro continua salvo e nada foi alterado.
      </DNotice> : null}
    </>}
    <DTrace title="Rastreabilidade" steps={traceFor(rec, ui)} />
  </section>;
}

function ManualForm({ set }) {
  const [t, setT] = React.useState('');
  return <div style={{ display: 'flex', flexDirection: 'column', gap: 14, padding: 16, borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', background: 'var(--surface-card)' }}>
    <p style={dpCss.p}>Você descreve a evidência com suas palavras. O texto original do registro continua acima, sem alteração.</p>
    <DInput label="Título da evidência" value={t} onChange={e => setT(e.target.value)} placeholder="O que você fez, em uma frase" />
    <DInput label="Competências (opcional)" placeholder="Separe por vírgula" hint="Só as que o registro sustenta." />
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-body)' }}>Nível ao confirmar:<DBadge status="registrada">Registrada</DBadge></div>
    <div style={{ ...dpCss.row, borderTop: '1px solid var(--divider)', paddingTop: 14 }}>
      <DButton variant="solid" size="sm" icon="check" disabled={t.trim().length < 3} onClick={() => set({ sug: 'manual-done', manualTitle: t.trim() })}>Confirmar evidência</DButton>
      <DButton variant="ghost" size="sm" onClick={() => set({ sug: set.prevSug || 'none' })}>Cancelar</DButton>
    </div>
  </div>;
}

function SugestoesSection({ rec, ui, set, gen }) {
  const manual = <DButton variant="ghost" size="sm" icon="pen-line" onClick={() => set({ sug: 'manual', prevSug: ui.sug })}>Estruturar manualmente</DButton>;
  const setItem = (id, st) => set({ items: ui.items.map(i => i.id === id ? { ...i, st } : i) });
  let body;
  if (rec.evidence) body = <DEvidence variant="grid" title={rec.evidence.title} competencies={rec.evidence.comp} level={rec.evidence.level} proofCount={rec.evidence.proofs} origin="Diário" updatedAt={rec.date} />;
  else if (ui.sug === 'none') body = <DNotice tone="neutral" icon="sparkles" badge="Nenhuma sugestão gerada"
    actions={<><DButton variant="solid" size="sm" icon="sparkles" onClick={gen}>Gerar sugestões</DButton>{manual}</>}>
    A IA lê só este registro e propõe de 1 a 3 evidências. Nada vira evidência sem a sua confirmação.
  </DNotice>;
  else if (ui.sug === 'generating') body = <div role="status" aria-busy="true"><DNotice tone="info" icon="clock" badge="Gerando sugestões…" actions={manual}>
    Lendo o registro. Você pode fechar o painel, editar ou buscar no histórico enquanto isso.
  </DNotice></div>;
  else if (ui.sug === 'empty') body = <DNotice role="status" tone="neutral" icon="info" badge="Nenhuma sugestão útil"
    actions={<><DButton variant="outline" size="sm" icon="pen-line" onClick={() => set({ sug: 'manual', prevSug: 'empty' })}>Estruturar manualmente</DButton><DButton variant="ghost" size="sm" icon="refresh-cw" onClick={gen}>Gerar de novo</DButton></>}>
    A IA não encontrou uma ação ou resultado concreto neste registro. Se houver algo a provar, edite o texto ou estruture manualmente.
  </DNotice>;
  else if (ui.sug === 'failed') body = <DNotice role="alert" tone="danger" icon="triangle-alert" badge="IA indisponível"
    actions={<><DButton variant="outline" size="sm" icon="pen-line" onClick={() => set({ sug: 'manual', prevSug: 'failed' })}>Estruturar manualmente</DButton><DButton variant="ghost" size="sm" icon="refresh-cw" onClick={gen}>Tentar gerar de novo</DButton></>}>
    Não foi possível gerar sugestões agora — seu registro está salvo e você pode estruturar manualmente.
  </DNotice>;
  else if (ui.sug === 'manual') body = <ManualForm set={Object.assign(p => set(p), { prevSug: ui.prevSug })} />;
  else if (ui.sug === 'manual-done') body = <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
    <div style={dpCss.row}><DBadge tone="success" icon="circle-check">Confirmada por você</DBadge><span style={dpCss.p}>Estruturada manualmente · já está em Evidências.</span></div>
    <DEvidence variant="grid" title={ui.manualTitle} level="Registrada" proofCount={0} origin="Manual" updatedAt="hoje" />
  </div>;
  else body = <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
    {ui.items.map(it => it.st === 'pending'
      ? <DEvidence key={it.id} variant="suggestion" title={it.title} level="Registrada" proofCount={0} origin="Diário" updatedAt={rec.date} onConfirm={() => setItem(it.id, 'confirmed')} onDiscard={() => setItem(it.id, 'discarded')} />
      : it.st === 'confirmed'
        ? <div key={it.id} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={dpCss.row}><DBadge tone="success" icon="circle-check">Confirmada por você</DBadge><span style={dpCss.p}>Já está em Evidências, como Registrada.</span></div>
            <DEvidence variant="grid" title={it.title} level="Registrada" proofCount={0} origin="Diário" updatedAt="hoje" />
          </div>
        : <div key={it.id} style={{ ...dpCss.notice, flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 12, padding: '12px 16px' }}>
            <DBadge tone="neutral" icon="x">Descartada</DBadge>
            <span style={{ flex: '1 1 200px', minWidth: 0, fontSize: 14, color: 'var(--text-body)' }}>{it.title}</span>
            <DButton variant="ghost" size="sm" icon="history" onClick={() => setItem(it.id, 'pending')}>Desfazer</DButton>
          </div>)}
    {ui.items.some(i => i.st === 'pending') ? <div style={dpCss.row}>{manual}</div> : null}
  </div>;
  return <section id="dp-sugestoes" aria-labelledby="dp-sugestoes-h" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
    <h3 id="dp-sugestoes-h" style={dpCss.h3}>{rec.evidence ? 'Evidência originada' : 'Sugestões'}</h3>
    {body}
  </section>;
}

function sugMeta(rec, ui) {
  if (rec.evidence) return '1 confirmada';
  if (ui.sug === 'ready') { const p = ui.items.filter(i => i.st === 'pending').length; return p ? p + ' para revisar' : 'Revisadas'; }
  return { none: 'Não geradas', generating: 'Gerando', empty: 'Nenhuma útil', failed: 'Falha da IA', manual: 'Manual', 'manual-done': '1 confirmada' }[ui.sug];
}

function DiarioPanel({ rec, ui, set, onClose, onDelete, gen }) {
  if (!rec) return null;
  return <DFloat contained open onClose={onClose} width={600} eyebrow="Registro do Diário" title={rec.dateLong} subtitle={rec.context ? 'Contexto: ' + rec.context : undefined}>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <DIndex title="Neste registro" items={[{ id: 'dp-registro', label: 'Registro', meta: ui.edit ? 'Editando' : rec.date }, { id: 'dp-sugestoes', label: rec.evidence ? 'Evidência originada' : 'Sugestões', meta: sugMeta(rec, ui) }]} />
      <RegistroSection rec={rec} ui={ui} set={set} onDelete={onDelete} />
      <div style={{ borderTop: '1px solid var(--divider)' }}></div>
      <SugestoesSection rec={rec} ui={ui} set={set} gen={gen} />
    </div>
  </DFloat>;
}

Object.assign(window, { DiarioPanel });
