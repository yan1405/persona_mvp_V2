import React from 'react';
import { IconButton } from '../core/IconButton.jsx';
import { AgentPrompt } from '../agent/AgentPrompt.jsx';

export function AppHeader({ title, agentOpen, onAgentToggle, onMenu, searchValue, onSearchChange, onSearch, style }) {
  const hRef = React.useRef(null);
  const [hw, setHw] = React.useState(0);
  React.useLayoutEffect(() => {
    const el = hRef.current; if (!el) return;
    const set = () => setHw(el.offsetWidth);
    set();
    const ro = new ResizeObserver(set); ro.observe(el);
    return () => ro.disconnect();
  }, []);
  // Em contêiner estreito (< 460 px) a busca passa para a segunda linha, com largura total: nunca encolhe abaixo do alvo mínimo.
  const narrow = hw > 0 && hw < 460;
  return (
    <header ref={hRef} style={{ display: 'flex', flexWrap: narrow ? 'wrap' : 'nowrap', alignItems: 'center', gap: narrow ? 12 : 16, minHeight: 56, width: '100%', boxSizing: 'border-box', fontFamily: 'var(--font-body)', ...style }}>
      {onMenu ? <IconButton data-nav-trigger="" icon="panel-left" variant="outline" size={40} label="Abrir menu" aria-haspopup="dialog" onClick={onMenu} /> : null}
      {title ? <h1 style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, letterSpacing: '-0.015em', color: 'var(--text-strong)', whiteSpace: 'nowrap' }}>{title}</h1> : null}
      <div style={narrow ? { order: 3, flex: '1 1 100%', minWidth: 0 } : { flex: '1 1 auto', minWidth: 0, maxWidth: 520, marginLeft: title ? 'auto' : 0 }}>
        <AgentPrompt size="compact" value={searchValue} onChange={onSearchChange} onSubmit={onSearch} />
      </div>
      <div style={{ marginLeft: narrow ? 'auto' : title ? 0 : 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
        <IconButton icon="sparkles" variant={agentOpen ? 'soft' : 'outline'} size={40} label={agentOpen ? 'Agente (aberto)' : 'Agente'} active={agentOpen} aria-pressed={!!agentOpen} aria-expanded={!!agentOpen} onClick={() => onAgentToggle && onAgentToggle(!agentOpen)} />
      </div>
    </header>
  );
}
