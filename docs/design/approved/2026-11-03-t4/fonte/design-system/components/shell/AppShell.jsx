import React from 'react';
import { Sidebar } from '../navigation/Sidebar.jsx';
import { AppHeader } from '../navigation/AppHeader.jsx';
import { AgentPanel } from '../agent/AgentPanel.jsx';

const STORE = 'persona.agentPanel.open';
const readStore = () => { try { const v = localStorage.getItem(STORE); return v == null ? null : v === '1'; } catch (e) { return null; } };
const writeStore = v => { try { localStorage.setItem(STORE, v ? '1' : '0'); } catch (e) {} };

function useWidth() {
  const ref = React.useRef(null);
  const [w, setW] = React.useState(0);
  React.useLayoutEffect(() => {
    const el = ref.current; if (!el) return;
    const set = () => setW(el.offsetWidth);
    set();
    const ro = new ResizeObserver(set); ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, w];
}

export function AppShell({ active = 'inicio', onNavigate, title, children, panel, resume, onResume, badges, onRegister, agentOpen, defaultAgentOpen = false, onAgentToggle, agentScreen, agentMessages, onAgentSend, onAgentAction, sidebarCollapsed, height = '100vh', style }) {
  const [rootRef, w] = useWidth();
  const [innerOpen, setInnerOpen] = React.useState(() => { const s = readStore(); return s == null ? defaultAgentOpen : s; });
  const open = agentOpen != null ? agentOpen : innerOpen;
  const setOpen = v => { writeStore(v); if (agentOpen == null) setInnerOpen(v); onAgentToggle && onAgentToggle(v); };
  const [manualRail, setManualRail] = React.useState(null);
  const sheet = w > 0 && w < 1024;
  // < 640 px: sem sidebar inline; navegação por gaveta acessível (foco, trap de Tab, Esc, restauração do foco).
  const phone = w > 0 && w < 640;
  const [navOpen, setNavOpen] = React.useState(false);
  const navRef = React.useRef(null);
  React.useEffect(() => { if (!phone && navOpen) setNavOpen(false); }, [phone]);
  React.useEffect(() => {
    if (!(phone && navOpen)) return;
    const prev = document.activeElement;
    const el = navRef.current;
    el && el.focus({ preventScroll: true });
    const k = e => {
      if (!el || (!el.contains(document.activeElement) && document.activeElement !== el)) return;
      if (e.key === 'Escape') { e.stopPropagation(); setNavOpen(false); return; }
      if (e.key !== 'Tab') return;
      const list = Array.from(el.querySelectorAll('a[href],button:not([disabled]),input:not([disabled]),[tabindex]:not([tabindex="-1"])')).filter(n => n.offsetParent !== null);
      if (!list.length) { e.preventDefault(); return; }
      const a = list[0], z = list[list.length - 1];
      if (e.shiftKey && (document.activeElement === a || document.activeElement === el)) { e.preventDefault(); z.focus(); }
      else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); }
    };
    document.addEventListener('keydown', k, true);
    return () => {
      document.removeEventListener('keydown', k, true);
      const t = rootRef.current && rootRef.current.querySelector('[data-nav-trigger]');
      if (t) t.focus({ preventScroll: true });
      else if (prev && prev.focus && document.contains(prev)) prev.focus({ preventScroll: true });
    };
  }, [phone, navOpen]);
  const autoRail = w < 1280 && (open || w < 1100);
  const rail = sidebarCollapsed != null ? sidebarCollapsed : manualRail != null ? manualRail : autoRail;
  const scrollRef = React.useRef(null);
  const headRef = React.useRef(null);
  const [scrolled, setScrolled] = React.useState(false);
  const [headH, setHeadH] = React.useState(72);
  React.useLayoutEffect(() => { if (headRef.current) setHeadH(headRef.current.offsetHeight); });
  React.useEffect(() => {
    if (!(sheet && open)) return;
    const k = e => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', k);
    return () => document.removeEventListener('keydown', k);
  }, [sheet, open]);
  const agent = <AgentPanel open screen={agentScreen || title} messages={agentMessages} onSend={onAgentSend} onAction={onAgentAction} onToggle={setOpen} composerProps={{ suggestions: [] }}
    style={{ width: sheet ? 'min(400px, calc(100% - 32px))' : 'clamp(340px, 28vw, 400px)', height: '100%', minHeight: 0 }} />;
  return (
    <div ref={rootRef} data-agent={open ? (sheet ? 'sheet' : 'docked') : 'closed'} data-rail={rail ? '1' : '0'}
      style={{ position: 'relative', display: 'flex', gap: phone ? 8 : 16, paddingTop: phone ? 8 : 16, paddingRight: phone ? 8 : 16, paddingBottom: phone ? 8 : 16, paddingLeft: phone ? 8 : 16, height, boxSizing: 'border-box', background: 'var(--bg-app)', overflow: 'hidden', fontFamily: 'var(--font-body)', ...style }}>
      {phone ? null : <Sidebar active={active} onNavigate={onNavigate} collapsed={rail} onToggle={setManualRail} resume={resume} onResume={onResume} badges={badges} onRegister={onRegister} style={{ minHeight: 0 }} />}
      <main style={{ position: 'relative', flex: '1 1 auto', minWidth: 0, background: 'var(--n-25)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <div ref={scrollRef} data-shell-scroll="" onScroll={e => setScrolled(e.currentTarget.scrollTop > 0)}
          style={{ flex: 1, minHeight: 0, overflowY: 'auto', overflowX: 'hidden', scrollPaddingTop: headH + 16 }}>
          <div ref={headRef} data-shell-header="" style={{ position: 'sticky', top: 0, zIndex: 5, background: '#FAFAFC', padding: phone ? '12px 16px' : '14px 28px', boxShadow: scrolled ? 'var(--shadow-soft)' : 'none', transition: 'box-shadow var(--dur-micro)' }}>
            <AppHeader title={title} agentOpen={open} onAgentToggle={setOpen} onMenu={phone ? () => setNavOpen(true) : undefined} />
          </div>
          <div style={{ padding: phone ? '12px 16px 32px' : '12px 28px 40px', maxWidth: 1280, margin: '0 auto', boxSizing: 'border-box', minWidth: 0 }}>{children}</div>
        </div>
        {panel}
      </main>
      {open && !sheet ? agent : null}
      {open && sheet ? (
        <div style={{ position: 'absolute', inset: 0, zIndex: 60 }}>
          <div aria-hidden="true" onClick={() => setOpen(false)} style={{ position: 'absolute', inset: 0, background: 'rgb(26 23 38 / 0.18)' }}></div>
          <div role="dialog" aria-modal="true" aria-label="Agente Persona" style={{ position: 'absolute', top: 16, right: 16, bottom: 16, width: 'min(400px, calc(100% - 32px))', display: 'flex' }}>{agent}</div>
        </div>
      ) : null}
      {phone && navOpen ? (
        <div style={{ position: 'absolute', inset: 0, zIndex: 70 }}>
          <div aria-hidden="true" onClick={() => setNavOpen(false)} style={{ position: 'absolute', inset: 0, background: 'rgb(26 23 38 / 0.18)' }}></div>
          <div ref={navRef} role="dialog" aria-modal="true" aria-label="Navegação" tabIndex={-1} style={{ position: 'absolute', top: 8, left: 8, bottom: 8, width: 'min(280px, calc(100% - 16px))', display: 'flex', outline: 0 }}>
            <Sidebar active={active} onNavigate={id => { setNavOpen(false); onNavigate && onNavigate(id); }} collapsed={false} onToggle={() => setNavOpen(false)} resume={resume} onResume={onResume} badges={badges} onRegister={onRegister ? () => { setNavOpen(false); onRegister(); } : () => { setNavOpen(false); onNavigate && onNavigate('diario'); }} style={{ width: '100%', minHeight: 0 }} />
          </div>
        </div>
      ) : null}
    </div>
  );
}
