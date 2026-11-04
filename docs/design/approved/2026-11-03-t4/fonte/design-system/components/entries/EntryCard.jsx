import React from 'react';
import { Icon } from '../core/Icon.jsx';
import { Badge } from '../core/Badge.jsx';

import { FOCUS_RING as FOCUS, NO_OUTLINE, useFocusVisible } from '../core/focusRing.jsx';
const KIND = {
  registro: { icon: 'notebook-pen', label: 'Registro do Diário' },
  sessao: { icon: 'mic', label: 'Sessão do Persona Live' },
  versao: { icon: 'history', label: 'Versão de Artefato' },
};
const titleStyle = { fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 600, letterSpacing: '-0.01em', lineHeight: 1.35, color: 'var(--text-strong)', margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' };

export function EntryCard({ kind = 'registro', date, title, meta, status, statusLabel, statusIcon, onOpen, openLabel, style }) {
  const k = KIND[kind] || KIND.registro;
  const [hover, setHover] = React.useState(false);
  const [focus, fh] = useFocusVisible();
  const Tag = onOpen ? 'button' : 'article';
  const badge = status
    ? <Badge status={status}>{statusLabel}</Badge>
    : statusLabel ? <Badge tone="neutral" icon={statusIcon || null}>{statusLabel}</Badge> : null;
  return (
    <Tag type={onOpen ? 'button' : undefined} onClick={onOpen} aria-label={onOpen ? (openLabel || 'Abrir') + ': ' + (title || k.label) : undefined}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      {...(onOpen ? fh : {})}
      style={{ background: 'var(--surface-card)', borderRadius: 'var(--radius-md)', boxShadow: onOpen && hover ? 'var(--shadow-float)' : 'var(--shadow-soft)', border: '1px solid transparent', padding: 20, display: 'flex', flexDirection: 'column', gap: 12, width: '100%', minWidth: 0, boxSizing: 'border-box', textAlign: 'left', fontFamily: 'var(--font-body)', cursor: onOpen ? 'pointer' : 'default', transform: onOpen && hover ? 'translateY(-2px)' : 'none', transition: 'transform var(--dur-normal) var(--ease-out), box-shadow var(--dur-normal) var(--ease-out)', ...NO_OUTLINE, ...(focus ? FOCUS : {}), ...style }}>
      <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
          <span style={{ width: 32, height: 32, borderRadius: 10, background: 'var(--n-50)', color: 'var(--text-body)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Icon name={k.icon} size={16} /></span>
          <span style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-body)', whiteSpace: 'nowrap' }}>{k.label}</span>
            {date ? <span style={{ fontSize: 12, color: 'var(--text-muted)', fontFeatureSettings: "'tnum'", whiteSpace: 'nowrap' }}>{date}</span> : null}
          </span>
        </span>
        {onOpen ? <Icon name="arrow-up-right" size={18} color="var(--text-muted)" style={{ flexShrink: 0, transform: hover ? 'translate(2px,-2px)' : 'none', transition: 'transform var(--dur-micro) var(--ease-out)' }} /> : null}
      </span>
      <span style={titleStyle}>{title || 'Sem título'}</span>
      <span style={{ fontSize: 13, lineHeight: 1.45, color: meta ? 'var(--text-body)' : 'var(--text-muted)' }}>{meta || 'Sem detalhes registrados.'}</span>
      {badge ? <span style={{ display: 'flex', borderTop: '1px solid var(--divider)', paddingTop: 12 }}>{badge}</span> : null}
    </Tag>
  );
}
