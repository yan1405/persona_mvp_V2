
const EPDS = window.PersonaDesignSystem_ff1a7b;
const { FloatingPanel: EFloat, SectionIndex: EIndex, TraceLine: ETrace, Badge: EBadge, Button: EButton, Input: EInput, Chip: EChip, Icon: EIcon, FIELD_FOCUS: E_FIELD_FOCUS } = EPDS;

const epCss = {
  h3: { margin: 0, fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, letterSpacing: '-0.01em', color: 'var(--text-strong)' },
  p: { margin: 0, fontSize: 13, lineHeight: 1.55, color: 'var(--text-body)', textWrap: 'pretty' },
  label: { fontSize: 12, fontWeight: 600, color: 'var(--text-muted)' },
  row: { display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' },
  notice: { display: 'flex', flexDirection: 'column', gap: 10, padding: 16, borderRadius: 'var(--radius-sm)', background: 'var(--n-25)', border: '1px solid var(--border-subtle)' },
  sec: { display: 'flex', flexDirection: 'column', gap: 14 },
};
const levelOf = ev => (ev.links.length ? 'Documentada' : 'Registrada');
const validUrl = u => /^https?:\/\/[^\s/$.?#][^\s]*\.[^\s]{2,}$/i.test(u.trim());

function ENotice({ tone, icon, badge, children, actions, role }) {
  return <div role={role} style={epCss.notice}>
    <div style={epCss.row}><EBadge tone={tone} icon={icon}>{badge}</EBadge></div>
    {children ? <p style={epCss.p}>{children}</p> : null}
    {actions ? <div style={epCss.row}>{actions}</div> : null}
  </div>;
}

function LevelsExplain({ level }) {
  return <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
    <span style={epCss.label}>Níveis de evidência</span>
    <div style={epCss.row}>
      <EChip status={undefined} icon="circle-check" style={level === 'Registrada' ? { borderColor: 'var(--text-strong)' } : null}>Registrada · sem link</EChip>
      <EChip icon="badge-check" tone="success" style={level === 'Documentada' ? { borderColor: 'var(--green-ink)' } : null}>Documentada · com link</EChip>
      <EChip icon="lock">Validada · indisponível nesta versão</EChip>
      <EChip icon="lock">Certificada · indisponível nesta versão</EChip>
    </div>
  </div>;
}

function scrollPanelTo(id) {
  setTimeout(() => {
    const el = document.getElementById(id); if (!el) return;
    let p = el.parentElement;
    while (p && !(p.scrollHeight > p.clientHeight + 4 && /(auto|scroll)/.test(getComputedStyle(p).overflowY))) p = p.parentElement;
    if (p) p.scrollTop += el.getBoundingClientRect().top - p.getBoundingClientRect().top - 12;
  }, 80);
}

function ResumoSection({ ev, st, up }) {
  const ed = st.edit;
  const dirty = ed && (ed.title !== ev.title || ed.comp !== ev.comp.join(', '));
  const [f, setF] = React.useState(false);
  const lvl = levelOf(ev);
  return <section id="ev-resumo" aria-labelledby="ev-resumo-h" style={epCss.sec}>
    <div style={{ ...epCss.row, justifyContent: 'space-between' }}>
      <h3 id="ev-resumo-h" style={epCss.h3}>Resumo</h3>
      {dirty ? <EBadge tone="warning" icon="pencil">Alterações não salvas</EBadge> : null}
    </div>
    {ed ? <>
      {ed.conflict ? <ENotice role="alert" tone="warning" icon="triangle-alert" badge="Conflito de versão"
        actions={ed.showSaved ? null : <EButton variant="ghost" size="sm" icon="history" onClick={() => up({ edit: { ...ed, showSaved: true } })}>Ver versão salva</EButton>}>
        Esta evidência foi alterada em outra aba depois que você começou a editar. Sua versão foi mantida; escolha qual fica.
      </ENotice> : null}
      {ed.conflict && ed.showSaved ? <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}><span style={epCss.label}>Versão salva na outra aba</span><p style={{ ...epCss.p, padding: '12px 14px', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', background: 'var(--surface-card)' }}>{ev.title}</p></div> : null}
      <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-strong)' }}>Título da evidência</span>
        <textarea value={ed.title} onChange={e => up({ edit: { ...ed, title: e.target.value.slice(0, 160) } })} onFocus={() => setF(true)} onBlur={() => setF(false)} rows={2}
          style={{ width: '100%', boxSizing: 'border-box', resize: 'vertical', padding: '10px 14px', fontFamily: 'var(--font-body)', fontSize: 15, lineHeight: 1.5, color: 'var(--text-strong)', background: 'var(--surface-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', outline: 0, ...(f ? E_FIELD_FOCUS : {}) }} />
      </label>
      <EInput label="Competências" hint="Separe por vírgula. Só as que a evidência sustenta." value={ed.comp} onChange={e => up({ edit: { ...ed, comp: e.target.value } })} />
      <div style={epCss.row}>
        <EButton variant="solid" size="sm" icon="check" disabled={ed.title.trim().length < 3} onClick={() => up({ title: ed.title.trim(), comp: ed.comp.split(',').map(s => s.trim()).filter(Boolean), edit: null, notice: 'edited' })}>{ed.conflict ? 'Salvar minha versão' : 'Salvar alterações'}</EButton>
        <EButton variant="ghost" size="sm" icon="x" onClick={() => up({ edit: null })}>{ed.conflict ? 'Manter versão salva' : 'Cancelar edição'}</EButton>
      </div>
    </> : <>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <span style={epCss.label}>Título</span>
        <p style={{ ...epCss.p, fontSize: 15, color: 'var(--text-strong)' }}>{ev.title}</p>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <span style={epCss.label}>Competências</span>
        {ev.comp.length ? <div style={epCss.row}>{ev.comp.map(c => <EChip key={c} size="sm">{c}</EChip>)}</div> : <p style={epCss.p}>Nenhuma competência registrada.</p>}
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 16px', alignItems: 'center' }}>
        <EBadge tone={lvl === 'Documentada' ? 'success' : 'neutral'} icon={lvl === 'Documentada' ? 'badge-check' : 'circle-check'}>{lvl}</EBadge>
        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{ev.origin ? 'Origem: ' + ev.origin : 'Origem não informada'}{ev.age != null ? ' · atualizada há ' + ev.age + ' dias (data sintética)' : ''}</span>
      </div>
      <LevelsExplain level={lvl} />
      {!st.confirmArchive ? <div style={epCss.row}>
        <EButton variant="ghost" size="sm" icon="pencil" onClick={() => up({ edit: { title: ev.title, comp: ev.comp.join(', '), conflict: false } })}>Editar evidência</EButton>
        <EButton variant="ghost" size="sm" icon="archive" onClick={() => up({ confirmArchive: true })}>Arquivar evidência</EButton>
      </div> : <ENotice role="alertdialog" tone="warning" icon="archive" badge="Arquivar evidência?"
        actions={<><EButton variant="solid" size="sm" icon="archive" onClick={() => up({ archived: true, confirmArchive: false })}>Arquivar evidência</EButton><EButton variant="ghost" size="sm" onClick={() => up({ confirmArchive: false })}>Cancelar</EButton></>}>
        Ela sai da biblioteca, mas a rastreabilidade com o Persona Live e os Artefatos é preservada. Você pode restaurá-la depois.
      </ENotice>}
    </>}
  </section>;
}

function ProvasSection({ ev, st, up }) {
  const n = ev.links.length;
  const [url, setUrl] = React.useState(st.url || '');
  const [open, setOpen] = React.useState(!!st.addOpen);
  const [touched, setTouched] = React.useState(false);
  const [rm, setRm] = React.useState(st.rmIdx != null ? st.rmIdx : null);
  const invalid = touched && url.trim() && !validUrl(url);
  const add = () => {
    setTouched(true);
    if (!validUrl(url)) return;
    up({ adding: true, addError: false });
    setTimeout(() => { up({ adding: false, addError: false, links: [...ev.links, url.trim()], notice: n === 0 ? 'documented' : 'linkadded' }); setUrl(''); setOpen(false); setTouched(false); }, 700);
  };
  const addField = <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: 16, borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', background: 'var(--surface-card)' }}>
    <EInput label="Link de prova" placeholder="https://" value={url} disabled={st.adding} error={invalid ? 'Link inválido. Use um endereço que comece com http:// ou https://.' : null} hint={invalid ? null : 'Só links HTTP ou HTTPS. Não há envio de arquivo.'}
      onChange={e => { setUrl(e.target.value); up({ addError: false }); }} onBlur={() => setTouched(true)} aria-invalid={invalid ? 'true' : undefined} inputMode="url" />
    {st.addError ? <div role="alert" style={epCss.row}><EBadge tone="danger" icon="triangle-alert">Link não adicionado</EBadge><span style={epCss.p}>Não foi possível salvar agora. O link continua no campo; tente de novo.</span></div> : null}
    <div style={epCss.row}>
      <EButton variant={n === 0 ? 'brand' : 'solid'} size="sm" icon={st.adding ? 'loader' : 'link'} disabled={st.adding || !url.trim()} onClick={add}>{st.adding ? 'Adicionando…' : 'Adicionar link'}</EButton>
      {!st.adding ? <EButton variant="ghost" size="sm" onClick={() => { setOpen(false); setUrl(''); setTouched(false); up({ addError: false }); }}>Cancelar</EButton> : null}
    </div>
  </div>;
  return <section id="ev-provas" aria-labelledby="ev-provas-h" style={epCss.sec}>
    <h3 id="ev-provas-h" style={epCss.h3}>Provas</h3>
    {st.notice === 'removed' ? <div role="status" style={epCss.row}><EBadge tone="neutral" icon="link-2-off">Link removido</EBadge><span style={epCss.p}>Sem links, a evidência voltou para Registrada.</span></div> : null}
    {st.notice === 'documented' ? <div role="status" style={epCss.row}><EBadge tone="success" icon="badge-check">Link adicionado</EBadge><span style={epCss.p}>Com um link de prova, a evidência passou para Documentada.</span></div> : null}
    {st.notice === 'linkadded' ? <div role="status" style={epCss.row}><EBadge tone="success" icon="circle-check">Link adicionado</EBadge></div> : null}
    {n === 0 ? <div style={{ ...epCss.notice, borderStyle: 'dashed' }}>
      <span style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 700, color: 'var(--text-strong)' }}>Nenhum link de prova.</span>
      <p style={epCss.p}>Esta evidência está como Registrada. Com ao menos um link, ela passa para Documentada.</p>
      {!open ? <div style={epCss.row}><EButton variant="brand" size="sm" icon="link" onClick={() => setOpen(true)}>Adicionar link de prova</EButton></div> : null}
    </div> : <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {ev.links.map((l, i) => <div key={l + i} style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '12px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', background: 'var(--surface-card)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <EIcon name="link" size={16} color="var(--text-muted)" />
          <div style={{ flex: '1 1 200px', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-strong)' }}>{'Link de prova ' + (i + 1)}</span>
            <a href={l} onClick={e => e.preventDefault()} style={{ fontSize: 12, overflowWrap: 'anywhere' }}>{l}</a>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Dado sintético para demonstração</span>
          </div>
          {rm !== i ? <EButton variant="ghost" size="sm" icon="trash-2" onClick={() => setRm(i)}>Remover link</EButton> : null}
        </div>
        {rm === i ? <ENotice role="alertdialog" tone="warning" icon="link-2-off" badge="Remover este link?"
          actions={<><EButton variant="solid" size="sm" icon="trash-2" onClick={() => { up({ links: ev.links.filter((_, j) => j !== i), notice: n === 1 ? 'removed' : null }); setRm(null); }}>Remover link</EButton><EButton variant="ghost" size="sm" onClick={() => setRm(null)}>Cancelar</EButton></>}>
          {n === 1 ? 'Este é o único link. Sem ele, a evidência volta para Registrada.' : 'A evidência continua Documentada, com o outro link.'}
        </ENotice> : null}
      </div>)}
      {!open ? <div style={epCss.row}><EButton variant="outline" size="sm" icon="plus" onClick={() => setOpen(true)}>Adicionar outro link</EButton></div> : null}
    </div>}
    {open ? addField : null}
  </section>;
}

function UsoSection({ ev }) {
  return <section id="ev-uso" aria-labelledby="ev-uso-h" style={epCss.sec}>
    <h3 id="ev-uso-h" style={epCss.h3}>Uso</h3>
    {ev.uses.length ? <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {ev.uses.map(u => <div key={u} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', background: 'var(--surface-card)', fontSize: 14, color: 'var(--text-strong)' }}><EIcon name="corner-down-right" size={16} color="var(--text-muted)" />{u}</div>)}
    </div> : <div style={{ ...epCss.notice, borderStyle: 'dashed' }}>
      <span style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 700, color: 'var(--text-strong)' }}>Ainda não usada.</span>
      <p style={epCss.p}>Esta evidência não aparece em nenhuma sessão do Persona Live nem em Artefatos. O uso é sempre autorizado por você nessas telas.</p>
    </div>}
  </section>;
}

function traceSteps(ev) {
  const n = ev.links.length;
  return [
    { kind: 'registro', label: 'Registro', meta: ev.origin || 'Origem não informada', state: ev.origin ? 'done' : 'gap' },
    { kind: 'evidencia', label: 'Evidência', meta: levelOf(ev), state: 'done' },
    { kind: 'prova', label: 'Prova', meta: n ? n + (n === 1 ? ' link' : ' links') : 'Sem link', state: n ? 'done' : 'gap' },
    { kind: 'uso', label: 'Uso', meta: ev.uses.length ? ev.uses.length + (ev.uses.length === 1 ? ' uso' : ' usos') : 'Ainda não usada', state: ev.uses.length ? 'done' : 'gap' },
  ];
}

function EvidenciaPanel({ ev, init, onChange, onClose }) {
  const [st, setSt] = React.useState(init || {});
  const up = p => {
    setSt(s => ({ ...s, ...p }));
    const evp = {}; ['title', 'comp', 'links', 'archived'].forEach(k => { if (k in p) evp[k] = p[k]; });
    if (Object.keys(evp).length) onChange(evp);
  };
  React.useEffect(() => { if (st.scroll) scrollPanelTo(st.scroll); }, []);
  const archived = ev.archived;
  return <EFloat contained open onClose={onClose} width={600} eyebrow="Evidência" title={ev.title}>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {st.notice === 'edited' ? <div role="status" style={epCss.row}><EBadge tone="success" icon="circle-check">Alterações salvas</EBadge></div> : null}
      {archived ? <ENotice role="status" tone="neutral" icon="archive" badge="Arquivada"
        actions={<EButton variant="outline" size="sm" icon="archive-restore" onClick={() => { up({ archived: false, notice: 'restored' }); }}>Restaurar evidência</EButton>}>
        Fora da biblioteca ativa. A rastreabilidade foi preservada e nada foi apagado.
      </ENotice> : null}
      {st.notice === 'restored' && !archived ? <div role="status" style={epCss.row}><EBadge tone="success" icon="archive-restore">Evidência restaurada</EBadge><span style={epCss.p}>Ela voltou para a biblioteca com os mesmos links e usos.</span></div> : null}
      <EIndex title="Nesta evidência" items={[{ id: 'ev-resumo', label: 'Resumo', meta: levelOf(ev) }, { id: 'ev-provas', label: 'Provas', meta: ev.links.length ? ev.links.length + (ev.links.length === 1 ? ' link' : ' links') : 'Sem link' }, { id: 'ev-uso', label: 'Uso', meta: ev.uses.length ? String(ev.uses.length) : 'Vazio' }]} />
      <ETrace title="Rastreabilidade" steps={traceSteps(ev)} />
      {archived ? null : <>
        <ResumoSection ev={ev} st={st} up={up} />
        <div style={{ borderTop: '1px solid var(--divider)' }}></div>
        <ProvasSection key={ev.id} ev={ev} st={st} up={up} />
        <div style={{ borderTop: '1px solid var(--divider)' }}></div>
        <UsoSection ev={ev} />
      </>}
    </div>
  </EFloat>;
}

function ErroPanel({ kind, onClose }) {
  const nf = kind === 'notfound';
  return <EFloat contained open onClose={onClose} width={600} eyebrow="Evidência" title={nf ? 'Evidência não encontrada.' : 'Você não tem acesso a esta evidência.'}>
    <ENotice role="alert" tone={nf ? 'neutral' : 'warning'} icon={nf ? 'search-x' : 'lock'} badge={nf ? 'Não encontrada' : 'Sem permissão'}
      actions={<EButton variant="outline" size="sm" icon="arrow-left" onClick={onClose}>Voltar para Evidências</EButton>}>
      {nf ? 'Ela pode ter sido arquivada ou removida em outra aba. Nada foi alterado na sua biblioteca.' : 'Esta evidência pertence a outra conta. Nada foi alterado na sua biblioteca.'}
    </ENotice>
  </EFloat>;
}

function NovaPanel({ init, onClose, onSave }) {
  const i = init || {};
  const [title, setTitle] = React.useState(i.title || '');
  const [comp, setComp] = React.useState(i.comp || '');
  const [step, setStep] = React.useState(i.step || 'form');
  const [saving, setSaving] = React.useState(!!i.saving);
  const [failed, setFailed] = React.useState(!!i.failed);
  const ok = title.trim().length >= 3;
  const list = comp.split(',').map(s => s.trim()).filter(Boolean);
  const save = () => { setSaving(true); setFailed(false); setTimeout(() => { setSaving(false); onSave({ title: title.trim(), comp: list }); }, 900); };
  return <EFloat contained open onClose={onClose} width={600} eyebrow="Registrar evidência" title={step === 'form' ? 'Descreva a evidência.' : 'Revise antes de salvar.'}>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <EBadge tone="info" icon="info">Etapa {step === 'form' ? '1' : '2'} de 2</EBadge>
      {step === 'form' ? <>
        <p style={epCss.p}>Registro manual, com as suas palavras. Nada é salvo até você revisar e confirmar na próxima etapa.</p>
        <EInput label="Título da evidência" placeholder="O que você fez, em uma frase" value={title} onChange={e => setTitle(e.target.value.slice(0, 160))} hint={title && !ok ? 'Escreva ao menos 3 caracteres.' : null} />
        <EInput label="Competências (opcional)" placeholder="Separe por vírgula" hint="Só as que a evidência sustenta." value={comp} onChange={e => setComp(e.target.value)} />
        <div style={{ ...epCss.row, fontSize: 13, color: 'var(--text-body)' }}>Nível ao salvar:<EBadge tone="neutral" icon="circle-check">Registrada</EBadge><span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Para documentar, adicione um link depois.</span></div>
        <div style={{ ...epCss.row, borderTop: '1px solid var(--divider)', paddingTop: 14 }}>
          <EButton variant="brand" size="sm" icon="arrow-right" disabled={!ok} onClick={() => setStep('review')}>Revisar antes de salvar</EButton>
          <EButton variant="ghost" size="sm" onClick={onClose}>Cancelar</EButton>
        </div>
      </> : <>
        <div style={{ ...epCss.notice, background: 'var(--surface-card)', gap: 12 }}>
          <span style={epCss.label}>Título</span><p style={{ ...epCss.p, fontSize: 15, color: 'var(--text-strong)' }}>{title}</p>
          <span style={epCss.label}>Competências</span>{list.length ? <div style={epCss.row}>{list.map(c => <EChip key={c} size="sm">{c}</EChip>)}</div> : <p style={epCss.p}>Nenhuma competência informada.</p>}
          <span style={epCss.label}>Nível e origem</span><div style={epCss.row}><EBadge tone="neutral" icon="circle-check">Registrada</EBadge><span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Origem: Manual · sem links de prova</span></div>
        </div>
        {failed ? <div role="alert" style={epCss.row}><EBadge tone="danger" icon="triangle-alert">Evidência não salva</EBadge><span style={epCss.p}>Não foi possível salvar agora. Seus campos foram preservados; tente de novo.</span></div> : null}
        <div style={{ ...epCss.row, borderTop: '1px solid var(--divider)', paddingTop: 14 }}>
          <EButton variant="brand" size="sm" icon={saving ? 'loader' : 'check'} disabled={saving} onClick={save}>{saving ? 'Salvando…' : failed ? 'Tentar salvar de novo' : 'Salvar evidência'}</EButton>
          {!saving ? <EButton variant="ghost" size="sm" icon="arrow-left" onClick={() => setStep('form')}>Voltar e editar</EButton> : null}
        </div>
      </>}
    </div>
  </EFloat>;
}

Object.assign(window, { EvidenciaPanel, ErroPanel, NovaPanel, evLevelOf: levelOf });
