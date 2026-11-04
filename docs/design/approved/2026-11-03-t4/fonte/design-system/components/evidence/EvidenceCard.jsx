import React from 'react';
import { Icon } from '../core/Icon.jsx';
import { Badge } from '../core/Badge.jsx';
import { Chip } from '../core/Chip.jsx';
import { Button } from '../core/Button.jsx';

import { FOCUS_RING as FOCUS, NO_OUTLINE, useFocusVisible as useFocusRing } from '../core/focusRing.jsx';
const LEVEL = {
  Documentada: { tone: 'success', icon: 'badge-check' },
  Registrada: { tone: 'neutral', icon: 'circle-check' },
};
function LevelBadge({ level }) {
  const l = LEVEL[level] || LEVEL.Registrada;
  return <Badge tone={l.tone}><Icon name={l.icon} size={13} />{level || 'Registrada'}</Badge>;
}
function proofText(n) { return n === 1 ? '1 link de prova' : (n || 0) + ' links de prova'; }
function Meta({ origin, updatedAt, proofCount, showProofs = true }) {
  const item = { display: 'inline-flex', alignItems: 'center', gap: 5, whiteSpace: 'nowrap' };
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 14px', fontSize: 12, color: 'var(--text-muted)', fontFeatureSettings: "'tnum'" }}>
      {showProofs ? <span style={item}><Icon name="link" size={13} />{proofText(proofCount)}</span> : null}
      <span style={item}><Icon name={origin === 'Manual' ? 'pen-line' : 'notebook-pen'} size={13} />{origin ? 'Origem: ' + origin : 'Origem não informada'}</span>
      {updatedAt ? <span style={item}><Icon name="calendar" size={13} />{'Atualizada ' + updatedAt}</span> : null}
    </div>
  );
}
function Competencies({ list, emptyText }) {
  if (!list || !list.length) return <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{emptyText}</span>;
  return <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>{list.map(c => <Chip key={c} size="sm">{c}</Chip>)}</div>;
}
const titleStyle = { fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 600, letterSpacing: '-0.01em', lineHeight: 1.35, color: 'var(--text-strong)', margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' };
const shell = { background: 'var(--surface-card)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-soft)', padding: 20, display: 'flex', flexDirection: 'column', gap: 14, fontFamily: 'var(--font-body)', textAlign: 'left', boxSizing: 'border-box', width: '100%', minWidth: 0 };

function GridCard({ title, competencies, level, proofCount, origin, updatedAt, onOpen, style }) {
  const [hover, setHover] = React.useState(false);
  const [focus, fh] = useFocusRing();
  const Tag = onOpen ? 'button' : 'article';
  return (
    <Tag type={onOpen ? 'button' : undefined} onClick={onOpen} {...(onOpen ? fh : {})} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ ...shell, border: '1px solid transparent', cursor: onOpen ? 'pointer' : 'default', transform: onOpen && hover ? 'translateY(-2px)' : 'none', boxShadow: onOpen && hover ? 'var(--shadow-float)' : 'var(--shadow-soft)', transition: 'transform var(--dur-normal) var(--ease-out), box-shadow var(--dur-normal) var(--ease-out)', ...NO_OUTLINE, ...(focus ? FOCUS : {}), ...style }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
        <LevelBadge level={level} />
        {onOpen ? <Icon name="arrow-up-right" size={18} color="var(--text-muted)" style={{ transform: hover ? 'translate(2px,-2px)' : 'none', transition: 'transform var(--dur-micro) var(--ease-out)' }} /> : null}
      </div>
      <h3 style={titleStyle}>{title}</h3>
      <Competencies list={competencies} emptyText="Nenhuma competência registrada." />
      <div style={{ borderTop: '1px solid var(--divider)', paddingTop: 12 }}><Meta origin={origin} updatedAt={updatedAt} proofCount={proofCount} /></div>
    </Tag>
  );
}

function SuggestionCard({ title, competencies, level = 'Registrada', proofCount, origin, updatedAt, onConfirm, onDiscard, confirmVariant = 'solid', style }) {
    return (
    <article style={{ ...shell, background: 'var(--surface-subtle)', border: '1px dashed var(--border-strong)', boxShadow: 'none', ...style }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        <Badge tone="warning"><Icon name="sparkles" size={13} />Para revisar</Badge>
        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Sugerida pela IA · nada é salvo sem sua confirmação</span>
      </div>
      <h3 style={titleStyle}>{title}</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-body)' }}>Competências sugeridas</span>
        <Competencies list={competencies} emptyText="A IA ainda não sugeriu competências. Você pode adicioná-las ao revisar." />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-body)' }}>
        <span style={{ whiteSpace: 'nowrap' }}>Nível ao confirmar:</span><LevelBadge level={level} />
      </div>
      <Meta origin={origin} updatedAt={updatedAt} proofCount={proofCount} />
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', borderTop: '1px solid var(--divider)', paddingTop: 14 }}>
        <Button variant={confirmVariant} size="sm" icon="check" onClick={onConfirm}>Confirmar evidência</Button>
        <Button variant="ghost" size="sm" icon="x" onClick={onDiscard}>Descartar</Button>
      </div>
    </article>
  );
}

function SelectableCard({ title, competencies, level, proofCount, origin, updatedAt, reason, selected, onSelectedChange, disabled, style }) {
  const [focus, fh] = useFocusRing();
  const id = React.useId ? React.useId() : 'ev-' + Math.random().toString(36).slice(2);
  return (
    <label htmlFor={id} style={{ ...shell, flexDirection: 'row', gap: 14, alignItems: 'flex-start', cursor: disabled ? 'not-allowed' : 'pointer', border: selected ? '2px solid var(--brand-strong)' : '2px solid transparent', padding: 18, opacity: disabled ? 0.6 : 1, ...style }}>
      <span style={{ position: 'relative', flexShrink: 0, width: 22, height: 22, marginTop: 1 }}>
        <input id={id} type="checkbox" checked={!!selected} disabled={disabled} onChange={e => onSelectedChange && onSelectedChange(e.target.checked)} {...fh}
          style={{ position: 'absolute', inset: 0, margin: 0, opacity: 0, cursor: 'inherit' }} />
        <span aria-hidden="true" style={{ width: 22, height: 22, borderRadius: 7, boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid ' + (selected ? 'var(--brand-strong)' : 'var(--n-500)'), background: selected ? 'var(--brand-strong)' : 'var(--surface-card)', pointerEvents: 'none', ...(focus ? FOCUS : {}) }}>
          {selected ? <Icon name="check" size={15} color="#FFFFFF" strokeWidth={1.75} /> : null}
        </span>
      </span>
      <span style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap' }}>
          <LevelBadge level={level} />
          <span style={{ fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap', color: selected ? 'var(--brand-strong)' : 'var(--text-muted)' }}>{selected ? 'Selecionada' : 'Não selecionada'}</span>
        </span>
        <span style={titleStyle}>{title}</span>
        <Competencies list={competencies} emptyText="Nenhuma competência registrada." />
        <span style={{ display: 'flex', flexDirection: 'column', gap: 4, background: 'var(--n-25)', borderRadius: 'var(--radius-sm)', padding: '10px 12px' }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-body)' }}>Motivo da recomendação</span>
          <span style={{ fontSize: 13, lineHeight: 1.45, color: reason ? 'var(--text-body)' : 'var(--text-muted)' }}>{reason || 'Motivo não informado.'}</span>
        </span>
        <Meta origin={origin} updatedAt={updatedAt} proofCount={proofCount} />
      </span>
    </label>
  );
}

export function EvidenceCard({ variant = 'grid', ...props }) {
  if (variant === 'suggestion') return <SuggestionCard {...props} />;
  if (variant === 'selectable') return <SelectableCard {...props} />;
  return <GridCard {...props} />;
}
