import React from 'react';
import { Icon } from './Icon.jsx';
const TONES = {
  neutral: { bg: 'var(--n-50)', fg: 'var(--n-600)', dot: 'var(--n-400)' },
  brand: { bg: 'var(--brand-soft)', fg: 'var(--indigo-700)', dot: 'var(--brand)' },
  success: { bg: 'var(--green-soft)', fg: 'var(--green-ink)', dot: 'var(--green-500)' },
  warning: { bg: 'var(--amber-soft)', fg: 'var(--amber-ink)', dot: 'var(--amber-500)' },
  danger: { bg: 'var(--red-soft)', fg: 'var(--red-ink)', dot: 'var(--red-500)' },
  info: { bg: 'var(--blue-soft)', fg: 'var(--blue-ink)', dot: 'var(--blue-500)' },
  ink: { bg: 'var(--ink)', fg: '#FFFFFF', dot: '#FFFFFF' },
};
// Product statuses: label is always rendered (never colour alone). Neutral = Slate, success = green ink on green soft, attention = amber ink on amber soft.
export const STATUSES = {
  registrada: { tone: 'neutral', icon: 'circle-check', label: 'Registrada' },
  documentada: { tone: 'success', icon: 'badge-check', label: 'Documentada' },
  'para-revisar': { tone: 'warning', icon: 'sparkles', label: 'Para revisar' },
  rascunho: { tone: 'neutral', icon: 'pencil', label: 'Rascunho' },
  revisado: { tone: 'success', icon: 'check-check', label: 'Revisado' },
  lacuna: { tone: 'warning', icon: 'triangle-alert', label: 'Lacuna' },
};
export function Badge({ status, tone, variant = 'soft', dot, icon, children, style }) {
  const st = status ? STATUSES[status] : null;
  const t = TONES[(st && st.tone) || tone || 'neutral'] || TONES.neutral;
  const ic = icon !== undefined ? icon : st ? st.icon : null;
  if (variant === 'count') {
    return <span style={{ minWidth: 20, height: 20, padding: '0 6px', borderRadius: 999, background: (tone || 'neutral') === 'neutral' ? 'var(--brand)' : t.dot, color: '#FFFFFF', fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 700, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontFeatureSettings: "'tnum'", ...style }}>{children}</span>;
  }
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, height: 22, padding: '0 9px', borderRadius: 999, background: t.bg, color: t.fg, fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 600, lineHeight: 1, whiteSpace: 'nowrap', ...style }}>
      {dot ? <span style={{ width: 6, height: 6, borderRadius: 999, background: t.dot }}></span> : null}
      {ic ? <Icon name={ic} size={13} strokeWidth={1.75} /> : null}
      {children != null ? children : st ? st.label : null}
    </span>
  );
}
