import React from 'react';
import { Icon } from '../core/Icon.jsx';
import { IconButton } from '../core/IconButton.jsx';
import { Avatar } from '../core/Avatar.jsx';
import { MessageBubble } from '../chat/MessageBubble.jsx';
import { Composer } from '../chat/Composer.jsx';
import { FOCUS_RING, NO_OUTLINE, useFocusVisible } from '../core/focusRing.jsx';
export function AgentPanel({ open = true, onToggle, screen, messages = [], onSend, onAction, composerProps, emptyText = 'Pergunte sobre suas evidências, seu score ou a próxima entrevista. Eu só uso o que você registrou.', style }) {
  const id = React.useId ? React.useId() : 'agent';
  const logRef = React.useRef(null);
  const [kf, fh] = useFocusVisible();
  const last = messages.length ? messages[messages.length - 1] : null;
  // Keep the latest message in view (scrolls only the log, never the page).
  React.useLayoutEffect(() => { const el = logRef.current; if (el) el.scrollTop = el.scrollHeight; }, [open, messages.length, last && last.typing]);
  if (!open) {
    return (
      <aside aria-label="Agente Persona (recolhido)" style={{ width: 64, height: '100%', minHeight: 240, flexShrink: 0, background: 'var(--surface-card)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-float)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, padding: '14px 0', boxSizing: 'border-box', ...style }}>
        <IconButton icon="chevron-left" variant="outline" size={40} label="Expandir Agente Persona" aria-expanded={false} aria-controls={id} onClick={() => onToggle && onToggle(true)} />
        <Avatar variant="ai" name="Agente Persona" size={32} />
        <span style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)', fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 600, color: 'var(--text-body)', whiteSpace: 'nowrap' }}>Agente Persona</span>
      </aside>
    );
  }
  return (
    <aside id={id} aria-label="Agente Persona" style={{ width: 'clamp(380px, 30vw, 420px)', height: '100%', minHeight: 480, flexShrink: 0, background: 'var(--surface-card)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-float)', display: 'flex', flexDirection: 'column', boxSizing: 'border-box', overflow: 'hidden', fontFamily: 'var(--font-body)', ...style }}>
      <header style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 12, padding: '16px 16px 14px 20px', borderBottom: '1px solid var(--divider)' }}>
        <Avatar variant="ai" name="Agente Persona" size={36} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, letterSpacing: '-0.01em', color: 'var(--text-strong)' }}>Agente Persona</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}><Icon name="target" size={13} />Você está em: <span style={{ fontWeight: 600, color: 'var(--text-body)' }}>{screen || 'tela não informada'}</span></div>
        </div>
        <IconButton icon="chevron-right" variant="ghost" size={36} label="Recolher Agente Persona" aria-expanded={true} aria-controls={id} onClick={() => onToggle && onToggle(false)} />
      </header>
      <div ref={logRef} role="log" aria-live="polite" aria-label="Conversa com o Agente Persona" tabIndex={0} {...fh} style={{ flex: 1, minHeight: 0, minWidth: 0, overflowY: 'auto', overflowX: 'hidden', padding: '18px 16px', display: 'flex', flexDirection: 'column', gap: 16, borderRadius: 4, ...NO_OUTLINE, ...(kf ? { boxShadow: 'inset 0 0 0 2px var(--focus-ring), inset 0 0 0 4px var(--brand-strong)' } : {}) }}>
        {messages.length ? messages.map((m, i) => <MessageBubble key={i} {...m} style={{ flexShrink: 0, ...m.style }} onAction={m.onAction || onAction}>{m.text}</MessageBubble>)
          : <p style={{ margin: 0, fontSize: 14, lineHeight: 1.55, color: 'var(--text-body)' }}>{emptyText}</p>}
      </div>
      <div style={{ flexShrink: 0, padding: '12px 16px 14px', borderTop: '1px solid var(--divider)' }}>
        <Composer onSend={onSend} {...composerProps} />
      </div>
    </aside>
  );
}
