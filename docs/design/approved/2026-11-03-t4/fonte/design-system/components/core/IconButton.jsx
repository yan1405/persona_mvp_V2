import React from 'react';
import { Icon } from './Icon.jsx';
import { FOCUS_RING, NO_OUTLINE, useFocusVisible } from './focusRing.jsx';
export function IconButton({ icon, variant = 'ghost', size = 40, badge, dot, label, active, disabled, onClick, style, onFocus, onBlur, ...rest }) {
  const [kf, fh] = useFocusVisible(onFocus, onBlur);
  const [hover, setHover] = React.useState(false);
  const V = {
    ghost: { background: active ? 'var(--brand-soft)' : hover ? 'var(--n-50)' : 'transparent', color: active ? 'var(--brand)' : 'var(--text-strong)', border: '1px solid transparent' },
    outline: { background: hover ? 'var(--n-25)' : 'var(--surface-card)', color: 'var(--text-strong)', border: '1px solid var(--border-subtle)' },
    soft: { background: hover ? 'var(--indigo-200)' : 'var(--brand-soft)', color: 'var(--brand)', border: '1px solid transparent' },
    solid: { background: hover ? 'var(--n-800)' : 'var(--ink)', color: '#FFFFFF', border: '1px solid transparent' },
    brand: { background: 'var(--brand-gradient)', color: '#FFFFFF', border: '1px solid transparent', boxShadow: 'var(--shadow-brand-glow)' },
  }[variant] || {};
  const ic = size <= 32 ? 16 : size <= 40 ? 18 : 20;
  return (
    <button type="button" aria-label={label} title={label} disabled={disabled} onClick={onClick}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} {...fh}
      style={{ position: 'relative', width: size, height: size, flexShrink: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', borderRadius: 'var(--radius-pill)', cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.45 : 1, padding: 0, transition: 'background var(--dur-micro) var(--ease-out)', ...NO_OUTLINE, ...V, ...(kf ? FOCUS_RING : {}), ...style }} {...rest}>
      <Icon name={icon} size={ic} />
      {badge != null ? <span style={{ position: 'absolute', top: -3, right: -3, minWidth: 18, height: 18, padding: '0 5px', borderRadius: 999, background: 'var(--brand)', color: '#fff', fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 0 2px var(--surface-card)', fontFeatureSettings: "'tnum'" }}>{badge}</span> : null}
      {dot ? <span style={{ position: 'absolute', top: 8, right: 9, width: 8, height: 8, borderRadius: 999, background: 'var(--danger)', boxShadow: '0 0 0 2px var(--surface-card)' }}></span> : null}
    </button>
  );
}
