import React from 'react';
import { Icon } from './Icon.jsx';
import { FOCUS_RING, FOCUS_RING_DARK, NO_OUTLINE, useFocusVisible } from './focusRing.jsx';
const SIZES = { sm: { h: 32, px: 14, fs: 13, ic: 16 }, md: { h: 40, px: 18, fs: 14, ic: 18 }, lg: { h: 48, px: 22, fs: 15, ic: 20 } };
export function Button({ variant = 'solid', size = 'md', icon, iconRight, fullWidth, disabled, children, onClick, type = 'button', style, onFocus, onBlur, ...rest }) {
  const [kf, fh] = useFocusVisible(onFocus, onBlur);
  const [hover, setHover] = React.useState(false);
  const [press, setPress] = React.useState(false);
  const s = SIZES[size] || SIZES.md;
  const V = {
    brand: { background: 'var(--brand-gradient)', color: 'var(--text-on-brand)', border: '1px solid transparent', boxShadow: hover ? '0 10px 24px -6px rgb(124 58 237 / 0.55)' : 'var(--shadow-brand-glow)' },
    solid: { background: hover ? 'var(--n-800)' : 'var(--ink)', color: '#FFFFFF', border: '1px solid transparent' },
    outline: { background: hover ? 'var(--n-25)' : 'var(--surface-card)', color: 'var(--text-strong)', border: '1px solid ' + (hover ? 'var(--border-strong)' : 'var(--border-subtle)') },
    ghost: { background: hover ? 'var(--n-50)' : 'transparent', color: 'var(--text-strong)', border: '1px solid transparent' },
    onFocal: { background: hover ? 'rgb(255 255 255 / 0.16)' : 'rgb(255 255 255 / 0.10)', color: '#FFFFFF', border: '1px solid rgb(255 255 255 / 0.16)' },
  }[variant] || {};
  const dis = disabled ? { background: 'var(--n-100)', color: 'var(--text-disabled)', border: '1px solid transparent', boxShadow: 'none', cursor: 'not-allowed' } : {};
  return (
    <button type={type} disabled={disabled} onClick={onClick}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => { setHover(false); setPress(false); }}
      onMouseDown={() => setPress(true)} onMouseUp={() => setPress(false)} {...fh}
      style={{ display: fullWidth ? 'flex' : 'inline-flex', width: fullWidth ? '100%' : undefined, alignItems: 'center', justifyContent: 'center', gap: 8, height: s.h, padding: '0 ' + s.px + 'px', borderRadius: 'var(--radius-pill)', fontFamily: 'var(--font-body)', fontSize: s.fs, fontWeight: 600, letterSpacing: '-0.005em', whiteSpace: 'nowrap', cursor: 'pointer', transition: 'background var(--dur-micro) var(--ease-out), box-shadow var(--dur-normal) var(--ease-out), transform var(--dur-micro) var(--ease-out), border-color var(--dur-micro)', transform: press && !disabled ? 'scale(0.98)' : 'none', ...NO_OUTLINE, ...V, ...dis, ...(kf ? (variant === 'onFocal' ? FOCUS_RING_DARK : FOCUS_RING) : {}), ...style }}
      {...rest}>
      {icon ? <Icon name={icon} size={s.ic} /> : null}
      {children}
      {iconRight ? <Icon name={iconRight} size={s.ic} /> : null}
    </button>
  );
}
