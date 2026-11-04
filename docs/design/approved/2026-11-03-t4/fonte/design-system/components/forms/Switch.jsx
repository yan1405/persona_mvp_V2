import React from 'react';
import { FOCUS_RING, NO_OUTLINE, useFocusVisible } from '../core/focusRing.jsx';
// Native <button role="switch">: reachable by Tab, toggles with Space/Enter, real `disabled`.
export function Switch({ checked, defaultChecked, onChange, label, disabled, id, style }) {
  const [inner, setInner] = React.useState(!!defaultChecked);
  const [kf, fh] = useFocusVisible();
  const auto = React.useId ? React.useId() : 'sw';
  const bid = id || auto;
  const on = checked != null ? checked : inner;
  const toggle = () => { if (disabled) return; const v = !on; if (checked == null) setInner(v); onChange && onChange(v); };
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10, opacity: disabled ? 0.5 : 1, fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--text-strong)', ...style }}>
      <button id={bid} type="button" role="switch" aria-checked={on} disabled={disabled} onClick={toggle} {...fh}
        style={{ width: 36, height: 20, padding: 0, border: 0, borderRadius: 999, background: on ? 'var(--brand)' : 'var(--n-200)', position: 'relative', cursor: disabled ? 'not-allowed' : 'pointer', transition: 'background var(--dur-normal) var(--ease-out)', flexShrink: 0, ...NO_OUTLINE, ...(kf ? FOCUS_RING : {}) }}>
        <span aria-hidden="true" style={{ position: 'absolute', top: 2, left: on ? 18 : 2, width: 16, height: 16, borderRadius: 999, background: '#FFFFFF', boxShadow: '0 1px 2px rgb(26 23 38 / 0.2)', transition: 'left var(--dur-normal) var(--ease-out)' }}></span>
      </button>
      {label != null ? <label htmlFor={bid} style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}>{label}</label> : null}
    </span>
  );
}
