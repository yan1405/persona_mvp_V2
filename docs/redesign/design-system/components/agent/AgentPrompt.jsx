import React from 'react';
import { Icon } from '../core/Icon.jsx';
import { IconButton } from '../core/IconButton.jsx';
import { Chip } from '../core/Chip.jsx';
import { FIELD_FOCUS } from '../core/focusRing.jsx';
export const HOME_SUGGESTIONS = ['O que falta para o score observado?', 'Organize minhas evidências', 'Preparar uma entrevista', 'Criar um Artefato'];
export function AgentPrompt({ size = 'large', value, onChange, onSubmit, suggestions, onSuggestion, placeholder = 'Buscar ou perguntar', shortcut = '⌘K', style }) {
  const large = size === 'large';
  const [inner, setInner] = React.useState('');
  const [focus, setFocus] = React.useState(false);
  const v = value != null ? value : inner;
  const set = x => { if (value == null) setInner(x); onChange && onChange(x); };
  const submit = () => { if (!v.trim()) return; onSubmit && onSubmit(v.trim()); };
  const chips = (suggestions || (large ? HOME_SUGGESTIONS : [])).slice(0, 4);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: large ? 14 : 0, width: '100%', minWidth: 0, ...style }}>
      <form role="search" onSubmit={e => { e.preventDefault(); submit(); }}
        style={{ display: 'flex', alignItems: 'center', gap: large ? 12 : 8, height: large ? 64 : 40, padding: large ? '0 8px 0 22px' : '0 4px 0 14px', borderRadius: 'var(--radius-pill)', background: 'var(--surface-card)', border: '1px solid ' + (large ? 'transparent' : 'var(--border-subtle)'), boxShadow: large ? 'var(--shadow-float)' : 'none', boxSizing: 'border-box', transition: 'border-color var(--dur-micro), box-shadow var(--dur-micro)', ...(focus ? FIELD_FOCUS : {}) }}>
        <Icon name="search" size={large ? 22 : 18} color="var(--text-muted)" />
        <input type="search" value={v} onChange={e => set(e.target.value)} onFocus={() => setFocus(true)} onBlur={() => setFocus(false)} placeholder={placeholder} aria-label={placeholder}
          style={{ flex: 1, minWidth: 0, border: 0, outline: 0, background: 'transparent', fontFamily: 'var(--font-body)', fontSize: large ? 17 : 14, color: 'var(--text-strong)' }} />
        {!large && shortcut ? <kbd style={{ fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', background: 'var(--n-50)', borderRadius: 6, padding: '3px 6px', whiteSpace: 'nowrap' }}>{shortcut}</kbd> : null}
        <IconButton type="submit" icon="arrow-up" variant="solid" size={large ? 48 : 32} label="Enviar pergunta" disabled={!v.trim()} />
      </form>
      {chips.length ? <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>{chips.map(s => <Chip key={s} icon="sparkles" style={{ maxWidth: '100%', whiteSpace: 'normal', height: 'auto', minHeight: 28, padding: '6px 12px', textAlign: 'left' }} onClick={() => onSuggestion ? onSuggestion(s) : set(s)}>{s}</Chip>)}</div> : null}
    </div>
  );
}
