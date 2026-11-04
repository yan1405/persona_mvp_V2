import React from 'react';
import { Icon } from '../core/Icon.jsx';
import { Avatar } from '../core/Avatar.jsx';
import { Chip } from '../core/Chip.jsx';
import { Button } from '../core/Button.jsx';
function Typing() {
  return <span role="status" aria-label="Agente Persona está respondendo" style={{ display: 'inline-flex', gap: 4, padding: '6px 0' }}>{[0, 1, 2].map(i => <span key={i} style={{ width: 6, height: 6, borderRadius: 999, background: 'var(--n-400)', animation: 'persona-dot 1.2s ' + (i * 0.15) + 's infinite var(--ease-out)' }}></span>)}</span>;
}
const ACTION_ICON = { 'Revisar sugestões': 'list-checks', 'Abrir no Persona Live': 'mic', 'Criar Artefato': 'file-text', 'Registrar no Diário': 'notebook-pen' };
export function MessageBubble({ role = 'agent', time, typing, citations, actions, onAction, onCitation, showAvatar = true, children, style }) {
  const user = role === 'user';
  return (
    <div style={{ display: 'flex', flexDirection: user ? 'row-reverse' : 'row', alignItems: 'flex-start', gap: 10, fontFamily: 'var(--font-body)', ...style }}>
      {!user && showAvatar ? <Avatar variant="ai" name="Agente Persona" size={32} /> : null}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: user ? 'flex-end' : 'flex-start', gap: 6, maxWidth: user ? '82%' : '100%', minWidth: 0, flex: user ? undefined : 1 }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-body)', padding: '0 4px', display: 'flex', gap: 6 }}>{user ? 'Você' : 'Agente Persona'}{time ? <span style={{ fontWeight: 400, color: 'var(--text-muted)', fontFeatureSettings: "'tnum'" }}>{time}</span> : null}</span>
        <div style={{ padding: user ? '12px 16px' : '14px 16px', borderRadius: user ? '22px 22px 8px 22px' : '8px 22px 22px 22px', background: user ? 'var(--bubble-user)' : 'var(--bubble-ai)', color: user ? 'var(--bubble-user-text)' : 'var(--bubble-ai-text)', border: user ? '0' : '1px solid var(--border-subtle)', boxShadow: user ? 'none' : 'var(--shadow-soft)', fontSize: 14, lineHeight: 1.55, textWrap: 'pretty', maxWidth: '100%', boxSizing: 'border-box', alignSelf: user || typing ? undefined : 'stretch' }}>
          {typing ? <Typing /> : children}
          {!user && !typing && citations && citations.length ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 12, paddingTop: 10, borderTop: '1px solid var(--divider)' }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-body)' }}>Origem</span>
              <span style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>{citations.map(c => <Chip key={c} size="sm" icon="link" onClick={onCitation ? () => onCitation(c) : undefined}>{c}</Chip>)}</span>
            </div>
          ) : null}
        </div>
        {!user && !typing && actions && actions.length ? (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {actions.map(a => <Button key={a} variant="outline" size="sm" icon={ACTION_ICON[a] || 'arrow-right'} onClick={() => onAction && onAction(a)}>{a}</Button>)}
          </div>
        ) : null}
      </div>
    </div>
  );
}
