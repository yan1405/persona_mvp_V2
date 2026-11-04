import React from 'react';

import { FOCUS_RING as RING, NO_OUTLINE, useFocusVisible } from '../core/focusRing.jsx';

function scrollParent(el) {
  let p = el && el.parentElement;
  while (p) { const o = getComputedStyle(p).overflowY; if ((o === 'auto' || o === 'scroll') && p.scrollHeight > p.clientHeight) return p; p = p.parentElement; }
  return document.scrollingElement;
}

function Item({ it, n, active, onGo, focused }) {
  const [kf, fh] = useFocusVisible();
  const [hover, setHover] = React.useState(false);
  const num = String(n).padStart(2, '0');
  const inner = <>
    <span aria-hidden="true" style={{ width: 6, height: 6, borderRadius: 999, flexShrink: 0, background: active ? 'var(--brand)' : 'transparent', border: active ? 0 : '1px solid var(--n-200)', boxSizing: 'border-box' }}></span>
    <span style={{ fontSize: 12, color: 'var(--text-muted)', fontFeatureSettings: "'tnum'", flexShrink: 0 }}>{num}</span>
    <span style={{ flex: 1, minWidth: 0 }}>{it.label}</span>
    {it.meta ? <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 400, whiteSpace: 'nowrap' }}>{it.meta}</span> : null}
  </>;
  const base = { display: 'flex', alignItems: 'center', gap: 10, padding: '6px 4px', borderRadius: 6, fontFamily: 'var(--font-body)', fontSize: 14, lineHeight: 1.35, textDecoration: 'none' };
  if (it.disabled) return <li style={{ listStyle: 'none' }}><span aria-disabled="true" style={{ ...base, color: 'var(--text-disabled)', cursor: 'default' }}>{inner}</span></li>;
  return (
    <li style={{ listStyle: 'none' }}>
      <a href={'#' + it.id} aria-current={active ? 'location' : undefined} onClick={e => { e.preventDefault(); onGo(it.id); }}
        onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} {...fh}
        style={{ ...base, color: active || hover ? 'var(--text-strong)' : 'var(--text-body)', fontWeight: active ? 600 : 400, textDecoration: hover && !active ? 'underline' : 'none', textUnderlineOffset: 3, ...NO_OUTLINE, ...((kf || focused) ? RING : {}) }}>{inner}</a>
    </li>
  );
}

export function SectionIndex({ items = [], activeId, onSelect, title = 'Nesta página', focusedId, style }) {
  const [inner, setInner] = React.useState(activeId || (items[0] && items[0].id));
  const current = activeId != null ? activeId : inner;
  const go = id => {
    const el = document.getElementById(id);
    if (el) { const p = scrollParent(el); const pad = parseFloat(getComputedStyle(p).scrollPaddingTop) || 0; const top = el.getBoundingClientRect().top - (p === document.scrollingElement ? 0 : p.getBoundingClientRect().top) + p.scrollTop - Math.max(8, pad); p.scrollTo({ top, behavior: 'smooth' }); }
    if (activeId == null) setInner(id);
    onSelect && onSelect(id);
  };
  return (
    <nav aria-label={title} style={{ display: 'flex', flexDirection: 'column', gap: 6, minWidth: 0, fontFamily: 'var(--font-body)', ...style }}>
      <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', padding: '0 4px' }}>{title}</span>
      <ol style={{ margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
        {items.map((it, i) => <Item key={it.id} it={it} n={i + 1} active={current === it.id} onGo={go} focused={focusedId === it.id} />)}
      </ol>
    </nav>
  );
}
