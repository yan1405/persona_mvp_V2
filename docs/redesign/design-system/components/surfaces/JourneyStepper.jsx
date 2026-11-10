import React from 'react';
import { Icon } from '../core/Icon.jsx';
export function JourneyStepper({ steps = [], onFocal = true, onSelect, style }) {
  const fgStrong = onFocal ? '#FFFFFF' : 'var(--text-strong)';
  const fgMuted = onFocal ? 'var(--indigo-300)' : 'var(--text-muted)';
  const line = onFocal ? 'rgb(255 255 255 / 0.14)' : 'var(--n-100)';
  return (
    <ol style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', ...style }}>
      {steps.map((s, i) => {
        const st = s.state || 'todo'; const last = i === steps.length - 1;
        const node = st === 'done'
          ? { bg: onFocal ? 'rgb(255 255 255 / 0.10)' : 'var(--green-soft)', fg: onFocal ? 'var(--green-on-dark)' : 'var(--green-ink)', icon: 'check' }
          : st === 'active' ? { bg: 'var(--brand-gradient)', fg: '#FFFFFF', icon: s.icon || 'sparkles' }
          : st === 'locked' ? { bg: onFocal ? 'rgb(255 255 255 / 0.06)' : 'var(--n-50)', fg: onFocal ? 'rgb(255 255 255 / 0.45)' : 'var(--n-400)', icon: 'lock' }
          : { bg: onFocal ? 'rgb(255 255 255 / 0.06)' : 'var(--n-50)', fg: fgMuted, icon: s.icon || 'clock' };
        return (
          <li key={i} onClick={onSelect ? () => onSelect(i) : undefined} style={{ display: 'flex', gap: 12, cursor: onSelect ? 'pointer' : undefined, padding: st === 'active' ? '8px 10px' : '0 10px', margin: st === 'active' ? '0 0 4px' : 0, borderRadius: 16, background: st === 'active' ? (onFocal ? 'rgb(255 255 255 / 0.07)' : 'var(--brand-soft)') : 'transparent' }}>
            <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ width: 36, height: 36, borderRadius: 999, background: node.bg, color: node.fg, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: st === 'active' ? '0 0 0 3px rgb(124 58 237 / 0.35)' : 'none', animation: st === 'active' ? 'persona-pulse 2.4s var(--ease-out) infinite' : 'none', flexShrink: 0 }}><Icon name={node.icon} size={16} /></span>
              {!last && st !== 'active' ? <span style={{ width: 2, flex: 1, minHeight: 14, background: line, margin: '4px 0' }}></span> : null}
            </span>
            <span style={{ display: 'flex', flexDirection: 'column', gap: 2, paddingTop: 7, paddingBottom: last ? 0 : 14, fontFamily: 'var(--font-body)' }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: st === 'locked' ? fgMuted : fgStrong }}>{s.label}</span>
              {s.meta ? <span style={{ fontSize: 12, color: st === 'active' ? (onFocal ? '#C4B5FD' : 'var(--brand)') : fgMuted }}>{s.meta}</span> : null}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
