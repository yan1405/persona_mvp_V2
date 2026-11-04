import React from 'react';
import { Icon } from './Icon.jsx';
const TONE_BG = { neutral: 'var(--n-50)', indigo: 'var(--tile-indigo)', blue: 'var(--tile-blue)', amber: 'var(--tile-amber)', green: 'var(--tile-green)', rose: 'var(--tile-rose)' };
const TONE_FG = { neutral: 'var(--text-strong)', indigo: 'var(--indigo-700)', blue: 'var(--blue-ink)', amber: 'var(--amber-ink)', green: 'var(--green-ink)', rose: '#9F1239' };
const STATUS = { online: 'var(--green-500)', away: 'var(--amber-500)', offline: 'var(--n-200)' };
export function Avatar({ name = '', src, size = 40, tone = 'neutral', variant = 'person', icon, status, style }) {
  const initials = name.split(' ').filter(Boolean).slice(0, 2).map(w => w[0]).join('').toUpperCase();
  const isAi = variant === 'ai';
  const dotSize = Math.max(8, Math.round(size * 0.26));
  return (
    <span style={{ position: 'relative', width: size, height: size, flexShrink: 0, display: 'inline-block', ...style }}>
      <span style={{ width: size, height: size, borderRadius: 999, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', background: isAi ? 'var(--surface-focal)' : (TONE_BG[tone] || TONE_BG.neutral), color: isAi ? '#FFFFFF' : (TONE_FG[tone] || TONE_FG.neutral), fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: Math.round(size * 0.36), letterSpacing: '-0.01em' }}>
        {src ? <img src={src} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : isAi || icon ? <Icon name={icon || 'sparkles'} size={Math.round(size * 0.48)} color={isAi ? 'var(--indigo-300)' : 'currentColor'} /> : initials}
      </span>
      {status ? <span style={{ position: 'absolute', right: -1, bottom: -1, width: dotSize, height: dotSize, borderRadius: 999, background: STATUS[status], boxShadow: '0 0 0 2px var(--surface-card)' }}></span> : null}
    </span>
  );
}
