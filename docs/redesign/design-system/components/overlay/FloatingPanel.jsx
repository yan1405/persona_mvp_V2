import React from 'react';
import { IconButton } from '../core/IconButton.jsx';

// One floating panel at a time: opening a panel closes the one already open.
const ACTIVE = { current: null };
const FOCUSABLE = 'a[href],button:not([disabled]),input:not([disabled]),textarea:not([disabled]),select:not([disabled]),[tabindex]:not([tabindex="-1"])';

export function FloatingPanel({ open, onClose, eyebrow, title, subtitle, width = 600, children, footer, contained, style }) {
  const id = React.useId ? React.useId() : 'fp';
  const ref = React.useRef(null);
  const wrapRef = React.useRef(null);
  const closeRef = React.useRef(onClose);
  closeRef.current = onClose;
  React.useEffect(() => {
    if (!open) return;
    const me = { id, close: () => closeRef.current && closeRef.current() };
    if (ACTIVE.current && ACTIVE.current.id !== id) ACTIVE.current.close();
    ACTIVE.current = me;
    const prev = document.activeElement;
    const el = ref.current;
    // Conteúdo de fundo inerte enquanto o painel está aberto: nenhum CTA da página fica focável ou clicável por trás do painel.
    const wrap = wrapRef.current;
    const made = [];
    if (wrap && wrap.parentNode) Array.from(wrap.parentNode.children).forEach(c => { if (c !== wrap && !c.hasAttribute('inert')) { c.setAttribute('inert', ''); made.push(c); } });
    el && el.focus({ preventScroll: true });
    const onKey = e => {
      if (!el || !el.contains(document.activeElement) && document.activeElement !== el) return;
      if (e.key === 'Escape') { e.stopPropagation(); me.close(); return; }
      if (e.key !== 'Tab') return;
      const list = Array.from(el.querySelectorAll(FOCUSABLE)).filter(n => n.offsetParent !== null);
      if (!list.length) { e.preventDefault(); return; }
      const a = list[0], z = list[list.length - 1];
      if (e.shiftKey && (document.activeElement === a || document.activeElement === el)) { e.preventDefault(); z.focus(); }
      else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); }
    };
    document.addEventListener('keydown', onKey, true);
    return () => {
      document.removeEventListener('keydown', onKey, true);
      made.forEach(c => c.removeAttribute('inert'));
      if (ACTIVE.current === me) ACTIVE.current = null;
      if (prev && prev.focus && document.contains(prev)) prev.focus({ preventScroll: true });
    };
  }, [open]);
  if (!open) return null;
  return (
    <div ref={wrapRef} style={{ position: contained ? 'absolute' : 'fixed', inset: 0, zIndex: 50 }}>
      <div aria-hidden="true" onClick={() => onClose && onClose()} style={{ position: 'absolute', inset: 0, background: 'rgb(26 23 38 / 0.18)' }}></div>
      <div ref={ref} role="dialog" aria-modal="true" aria-labelledby={id + '-t'} tabIndex={-1}
        style={{ position: 'absolute', top: 16, right: 16, bottom: 16, width: 'min(' + width + 'px, calc(100% - 32px))', background: 'var(--surface-card)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-float)', display: 'flex', flexDirection: 'column', overflow: 'hidden', outline: 0, fontFamily: 'var(--font-body)', animation: 'persona-rise var(--dur-normal) var(--ease-out)', ...style }}>
        <header style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '20px 16px 16px 24px', borderBottom: '1px solid var(--divider)' }}>
          <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
            {eyebrow ? <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)' }}>{eyebrow}</span> : null}
            <h2 id={id + '-t'} style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, letterSpacing: '-0.015em', lineHeight: 1.3, color: 'var(--text-strong)', textWrap: 'pretty' }}>{title}</h2>
            {subtitle ? <span style={{ fontSize: 13, color: 'var(--text-body)' }}>{subtitle}</span> : null}
          </div>
          <IconButton icon="x" variant="ghost" size={40} label="Fechar painel (Esc)" onClick={() => onClose && onClose()} />
        </header>
        <div data-fp-body="" style={{ flex: 1, minHeight: 0, overflowY: 'auto', overflowX: 'hidden', padding: 24 }}>{children}</div>
        {footer ? <footer style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, flexWrap: 'wrap', padding: '14px 24px', borderTop: '1px solid var(--divider)' }}>{footer}</footer> : null}
      </div>
    </div>
  );
}
