import React from 'react';
import { Icon } from '../core/Icon.jsx';
import { Badge } from '../core/Badge.jsx';

import { FOCUS_RING as RING, NO_OUTLINE, useFocusVisible } from '../core/focusRing.jsx';
export const ARTIFACT_TYPES = {
  star: { label: 'Resposta STAR', icon: 'list-checks', tint: 'var(--tile-indigo)' },
  pitch: { label: 'Pitch pessoal', icon: 'quote', tint: 'var(--tile-blue)' },
  curriculo: { label: 'Currículo ATS', icon: 'file-text', tint: 'var(--tile-green)' },
  portfolio: { label: 'Portfólio por casos', icon: 'layers', tint: 'var(--tile-amber)' },
};

export function ArtifactCard({ type = 'star', title, objective, status = 'rascunho', updated, sources = [], onOpen, focused, disabled, disabledText = 'Gerando rascunho…', error, style }) {
  const t = ARTIFACT_TYPES[type] || ARTIFACT_TYPES.star;
  const [hover, setHover] = React.useState(false);
  const [kf, fh] = useFocusVisible();
  const interactive = !!onOpen && !disabled;
  const Tag = interactive ? 'button' : 'article';
  const lift = interactive && hover;
  return (
    <Tag type={interactive ? 'button' : undefined} onClick={interactive ? onOpen : undefined} aria-label={interactive ? 'Abrir ' + t.label + ': ' + (title || 'sem título') : undefined} aria-disabled={disabled || undefined}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} {...fh}
      style={{ background: disabled ? 'var(--n-25)' : 'var(--surface-card)', borderRadius: 'var(--radius-md)', boxShadow: disabled ? 'none' : lift ? 'var(--shadow-float)' : 'var(--shadow-soft)', border: '1px solid ' + (error ? 'var(--red-500)' : disabled ? 'var(--border-subtle)' : 'transparent'), padding: 20, display: 'flex', flexDirection: 'column', gap: 12, width: '100%', minWidth: 0, boxSizing: 'border-box', textAlign: 'left', fontFamily: 'var(--font-body)', cursor: interactive ? 'pointer' : disabled ? 'not-allowed' : 'default', transform: lift ? 'translateY(-2px)' : 'none', transition: 'transform var(--dur-normal) var(--ease-out), box-shadow var(--dur-normal) var(--ease-out)', ...NO_OUTLINE, ...((kf || focused) ? RING : {}), ...style }}>
      <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, width: '100%' }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
          <span style={{ width: 36, height: 36, borderRadius: 12, background: t.tint, color: disabled ? 'var(--text-disabled)' : 'var(--text-strong)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Icon name={t.icon} size={18} /></span>
          <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-body)', whiteSpace: 'nowrap' }}>{t.label}</span>
        </span>
        {disabled ? <Badge tone="neutral" icon="clock">{disabledText}</Badge> : <Badge status={status} />}
      </span>
      <span style={{ fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 700, letterSpacing: '-0.01em', lineHeight: 1.3, color: disabled ? 'var(--text-disabled)' : 'var(--text-strong)' }}>{title || t.label}</span>
      <span style={{ fontSize: 13, lineHeight: 1.45, color: 'var(--text-body)' }}>{objective ? <>Objetivo: {objective}</> : <span style={{ color: 'var(--text-muted)' }}>Objetivo não informado.</span>}</span>
      <span style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', borderTop: '1px solid var(--divider)', paddingTop: 12, width: '100%' }}>
        <Icon name="link" size={14} color="var(--text-muted)" />
        <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)' }}>Fontes</span>
        {sources.length ? <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-body)' }}>{sources.join(' · ')}</span> : <span style={{ fontSize: 12, color: 'var(--amber-ink)', fontWeight: 600 }}>Nenhuma evidência citada</span>}
        {updated ? <span style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--text-muted)', fontFeatureSettings: "'tnum'" }}>{updated}</span> : null}
      </span>
      {error ? <span role="alert" style={{ display: 'flex', alignItems: 'flex-start', gap: 6, fontSize: 13, fontWeight: 600, color: 'var(--red-ink)', lineHeight: 1.45 }}><Icon name="triangle-alert" size={14} style={{ marginTop: 2 }} />{error}</span> : null}
    </Tag>
  );
}
