import React from 'react';
import { Icon } from '../core/Icon.jsx';
import { FIELD_FOCUS } from '../core/focusRing.jsx';
export function Input({ variant = 'field', icon, label, hint, error, value, defaultValue, onChange, placeholder, trailing, disabled, style, inputStyle, ...rest }) {
  const [focus, setFocus] = React.useState(false);
  const isSearch = variant === 'search';
  const border = error ? 'var(--danger)' : 'var(--border-subtle)';
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 6, fontFamily: 'var(--font-body)', ...style }}>
      {label ? <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-strong)' }}>{label}</span> : null}
      <span style={{ display: 'flex', alignItems: 'center', gap: 10, height: 44, padding: '0 ' + (isSearch ? 16 : 14) + 'px', borderRadius: isSearch ? 'var(--radius-pill)' : 'var(--radius-sm)', background: disabled ? 'var(--n-50)' : 'var(--surface-card)', border: '1px solid ' + border, boxShadow: 'none', transition: 'border-color var(--dur-micro), box-shadow var(--dur-micro)', ...(focus && !disabled ? FIELD_FOCUS : {}) }}>
        {icon || isSearch ? <Icon name={icon || 'search'} size={18} color="var(--text-muted)" /> : null}
        <input value={value} defaultValue={defaultValue} onChange={onChange} placeholder={placeholder} disabled={disabled}
          onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
          style={{ flex: 1, minWidth: 0, border: 0, outline: 0, background: 'transparent', fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--text-strong)', ...inputStyle }} {...rest} />
        {trailing}
      </span>
      {error || hint ? <span style={{ fontSize: 12, color: error ? 'var(--red-ink)' : 'var(--text-muted)' }}>{error || hint}</span> : null}
    </label>
  );
}
