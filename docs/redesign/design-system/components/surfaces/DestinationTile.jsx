import React from 'react';
import { Icon } from '../core/Icon.jsx';
const T = {
  indigo: { bg: 'var(--tile-indigo)', fg: 'var(--indigo-700)' },
  blue: { bg: 'var(--tile-blue)', fg: 'var(--blue-ink)' },
  amber: { bg: 'var(--tile-amber)', fg: 'var(--amber-ink)' },
  green: { bg: 'var(--tile-green)', fg: 'var(--green-ink)' },
  rose: { bg: 'var(--tile-rose)', fg: '#9F1239' },
  slate: { bg: 'var(--tile-slate)', fg: 'var(--n-600)' },
};
export function DestinationTile({ tone = 'indigo', title, status, meta, icon, onClick, style }) {
  const [hover, setHover] = React.useState(false);
  const t = T[tone] || T.indigo;
  return (
    <button type="button" onClick={onClick} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ position: 'relative', textAlign: 'left', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 14, minHeight: 124, height: '100%', width: '100%', minWidth: 0, boxSizing: 'border-box', padding: '16px 16px 14px', borderRadius: 'var(--radius-md)', border: '1px solid rgb(255 255 255 / 0.6)', background: t.bg, cursor: 'pointer', fontFamily: 'var(--font-body)', boxShadow: hover ? 'var(--shadow-float)' : 'var(--shadow-soft)', transform: hover ? 'translateY(-2px)' : 'none', transition: 'transform var(--dur-normal) var(--ease-out), box-shadow var(--dur-normal) var(--ease-out)', overflow: 'hidden', ...style }}>
      <span style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
        {icon ? <span style={{ width: 36, height: 36, flexShrink: 0, borderRadius: 12, background: 'rgb(255 255 255 / 0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: t.fg }}><Icon name={icon} size={20} /></span> : <span></span>}
        <span style={{ width: 24, height: 24, flexShrink: 0, borderRadius: 999, background: 'rgb(255 255 255 / 0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-strong)', transform: hover ? 'translate(2px,-2px)' : 'none', transition: 'transform var(--dur-normal) var(--ease-out)' }}><Icon name="arrow-up-right" size={14} /></span>
      </span>
      <span style={{ display: 'flex', flexDirection: 'column', gap: 3, minWidth: 0, width: '100%' }}>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 700, color: 'var(--text-strong)', letterSpacing: '-0.01em', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{title}</span>
        <span title={status} style={{ fontSize: 13, fontWeight: 600, color: t.fg, minWidth: 0, overflowWrap: 'anywhere' }}>{status}</span>
        <span title={meta || undefined} aria-hidden={meta ? undefined : true} style={{ fontSize: 12, lineHeight: '16px', minHeight: 16, color: 'var(--text-muted)', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{meta || '\u00a0'}</span>
      </span>
    </button>
  );
}
