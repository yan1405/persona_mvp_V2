import React from 'react';
import { Icon } from '../core/Icon.jsx';
import { FOCUS_RING, NO_OUTLINE, useFocusVisible } from '../core/focusRing.jsx';
export function NavItem({ icon, label, active, badge, badgeLabel, collapsed, onClick, focused, style }) {
  const [hover, setHover] = React.useState(false);
  const [kf, fh] = useFocusVisible();
  return (
    <button type="button" onClick={onClick} title={collapsed ? label : undefined} aria-label={collapsed ? label + (badge != null ? ', ' + (badgeLabel || badge) : '') : undefined} aria-current={active ? 'page' : undefined}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} {...fh}
      style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 12, width: collapsed ? 44 : '100%', height: 44, padding: collapsed ? 0 : '0 12px', justifyContent: collapsed ? 'center' : 'flex-start', borderRadius: 'var(--radius-pill)', border: 0, cursor: 'pointer', background: active ? 'var(--brand-soft)' : hover ? 'var(--n-50)' : 'transparent', color: 'var(--text-strong)', fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: active ? 600 : 500, textAlign: 'left', flexShrink: 0, transition: 'background var(--dur-micro)', ...NO_OUTLINE, ...((kf || focused) ? FOCUS_RING : {}), ...style }}>
      <Icon name={icon} size={18} color={active ? 'var(--brand)' : 'var(--n-600)'} />
      {collapsed ? null : <span style={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{label}</span>}
      {badge != null ? (collapsed
        ? <span aria-hidden="true" style={{ position: 'absolute', top: 7, right: 7, width: 8, height: 8, borderRadius: 999, background: 'var(--ink)', boxShadow: '0 0 0 2px var(--surface-card)' }}></span>
        : <span aria-label={badgeLabel} style={{ minWidth: 20, height: 20, padding: '0 7px', borderRadius: 999, background: 'var(--ink)', color: '#fff', fontSize: 11, fontWeight: 700, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', whiteSpace: 'nowrap', flexShrink: 0, fontFeatureSettings: "'tnum'", boxSizing: 'border-box' }}>{badge}</span>) : null}
    </button>
  );
}
