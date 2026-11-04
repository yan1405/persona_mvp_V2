import React from 'react';
import { Icon } from './Icon.jsx';
import { STATUSES } from './Badge.jsx';
import { FOCUS_RING, NO_OUTLINE, useFocusVisible } from './focusRing.jsx';
const STATUS_TONE = {
  neutral: { bg: 'var(--n-50)', fg: 'var(--n-600)', border: 'var(--n-100)' },
  success: { bg: 'var(--green-soft)', fg: 'var(--green-ink)', border: 'var(--green-soft)' },
  warning: { bg: 'var(--amber-soft)', fg: 'var(--amber-ink)', border: 'var(--amber-soft)' },
};
export function Chip({ status, icon, tone = 'neutral', selected, size = 'md', onClick, children, style }) {
  const [hover, setHover] = React.useState(false);
  const [kf, fh] = useFocusVisible();
  const h = size === 'sm' ? 28 : 34;
  const st = status ? STATUSES[status] : null;
  const toneFg = tone === 'success' ? 'var(--green-ink)' : tone === 'brand' ? 'var(--brand)' : 'var(--text-strong)';
  const iconFg = tone === 'success' ? 'var(--green-500)' : tone === 'brand' ? 'var(--brand)' : 'var(--text-muted)';
  let base;
  if (selected) base = { background: 'var(--ink)', color: '#FFFFFF', border: '1px solid var(--ink)' };
  else if (st) { const s = STATUS_TONE[st.tone]; base = { background: s.bg, color: s.fg, border: '1px solid ' + (hover && onClick ? 'var(--border-strong)' : s.border) }; }
  else base = { background: hover && onClick ? 'var(--n-25)' : 'var(--surface-card)', color: toneFg, border: '1px solid ' + (hover && onClick ? 'var(--border-strong)' : 'var(--border-subtle)') };
  const ic = icon !== undefined ? icon : st ? st.icon : null;
  const icColor = selected ? '#FFFFFF' : st ? 'currentColor' : iconFg;
  const Tag = onClick ? 'button' : 'span';
  return (
    <Tag type={onClick ? 'button' : undefined} onClick={onClick} aria-pressed={onClick && selected != null ? !!selected : undefined} {...(onClick ? fh : {})} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ display: 'inline-flex', alignItems: 'center', gap: 6, height: h, padding: '0 ' + (size === 'sm' ? 10 : 13) + 'px', borderRadius: 999, fontFamily: 'var(--font-body)', fontSize: size === 'sm' ? 12 : 13, fontWeight: st ? 600 : 500, whiteSpace: 'nowrap', cursor: onClick ? 'pointer' : 'default', transition: 'background var(--dur-micro), border-color var(--dur-micro)', ...NO_OUTLINE, ...base, ...(kf && onClick ? FOCUS_RING : {}), ...style }}>
      {ic ? <Icon name={ic} size={size === 'sm' ? 14 : 15} strokeWidth={1.75} color={icColor} /> : null}
      {children != null ? children : st ? st.label : null}
    </Tag>
  );
}
