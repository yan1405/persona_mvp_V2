import React from 'react';
import { FOCUS_RING, NO_OUTLINE, useFocusVisible } from '../core/focusRing.jsx';
// LEGADO — remover na T6.2. Não usar como navegação do produto; sem usos novos.
// WAI-ARIA tabs: roving tabindex, ←/→/Home/End move focus and select.
function Tab({ it, id, active, size, onPick, onKey, btnRef }) {
  const [hover, setHover] = React.useState(false);
  const [kf, fh] = useFocusVisible();
  return (
    <button ref={btnRef} role="tab" aria-selected={active} tabIndex={active ? 0 : -1} type="button" onClick={() => onPick(id)} onKeyDown={onKey} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} {...fh}
      style={{ display: 'inline-flex', alignItems: 'center', gap: 6, height: size === 'sm' ? 28 : 32, padding: '0 ' + (size === 'sm' ? 10 : 12) + 'px', borderRadius: 999, border: 0, cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: size === 'sm' ? 12 : 13, fontWeight: 600, whiteSpace: 'nowrap', background: active ? 'var(--ink)' : hover ? 'var(--n-50)' : 'transparent', color: active ? '#FFFFFF' : 'var(--text-strong)', transition: 'background var(--dur-micro)', ...NO_OUTLINE, ...(kf ? FOCUS_RING : {}) }}>
      {it.label}
      {it.count != null ? <span style={{ fontSize: 11, fontWeight: 700, color: active ? 'var(--indigo-300)' : 'var(--brand)', fontFeatureSettings: "'tnum'" }}>{it.count}</span> : null}
    </button>
  );
}
export function PillTabs({ items = [], value, onChange, size = 'md', label = 'Filtros', style }) {
  const refs = React.useRef([]);
  const ids = items.map(it => it.id ?? it.label);
  const cur = ids.indexOf(value) < 0 ? ids[0] : value;
  const pick = id => onChange && onChange(id);
  const key = i => e => {
    const n = ids.length; let j = null;
    if (e.key === 'ArrowRight') j = (i + 1) % n; else if (e.key === 'ArrowLeft') j = (i - 1 + n) % n; else if (e.key === 'Home') j = 0; else if (e.key === 'End') j = n - 1;
    if (j == null) return; e.preventDefault(); pick(ids[j]); refs.current[j] && refs.current[j].focus();
  };
  return (
    <div role="tablist" aria-label={label} style={{ display: 'flex', gap: 4, alignItems: 'center', flexWrap: 'wrap', ...style }}>
      {items.map((it, i) => <Tab key={ids[i]} it={it} id={ids[i]} active={ids[i] === cur} size={size} onPick={pick} onKey={key(i)} btnRef={el => { refs.current[i] = el; }} />)}
    </div>
  );
}
