import React from 'react';
import { IconButton } from '../core/IconButton.jsx';
import { Chip } from '../core/Chip.jsx';
import { FIELD_FOCUS } from '../core/focusRing.jsx';
export const AGENT_FOOTER = 'O agente só usa as evidências que você registrou. Confira sempre a origem.';
export const AGENT_SUGGESTIONS = ['O que falta para o score observado?', 'Organize minhas evidências', 'Preparar uma entrevista'];
export function Composer({ value, onChange, onSend, placeholder = 'Pergunte ao Agente Persona…', suggestions = AGENT_SUGGESTIONS, onSuggestion, disabled, footer = AGENT_FOOTER, style }) {
  const [inner, setInner] = React.useState('');
  const [focus, setFocus] = React.useState(false);
  const v = value != null ? value : inner;
  const set = (x) => { if (value == null) setInner(x); onChange && onChange(x); };
  const send = () => { if (!v.trim() || disabled) return; onSend && onSend(v.trim()); if (value == null) setInner(''); };
  const ref = React.useRef(null);
  React.useEffect(() => { const el = ref.current; if (!el) return; el.style.height = 'auto'; el.style.height = Math.min(el.scrollHeight, 160) + 'px'; }, [v]);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, ...style }}>
      {suggestions && suggestions.length ? (
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {suggestions.map(s => <Chip key={s} size="sm" onClick={() => onSuggestion ? onSuggestion(s) : set(s)}>{s}</Chip>)}
        </div>
      ) : null}
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, padding: '6px 6px 6px 18px', borderRadius: 26, background: 'var(--surface-card)', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-soft)', transition: 'border-color var(--dur-micro), box-shadow var(--dur-micro)', ...(focus ? FIELD_FOCUS : {}) }}>
        <textarea ref={ref} rows={1} value={v} placeholder={placeholder} aria-label="Mensagem para o Agente Persona" disabled={disabled} onChange={e => set(e.target.value)} onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
          style={{ flex: 1, minWidth: 0, resize: 'none', border: 0, outline: 0, background: 'transparent', padding: '10px 0', fontFamily: 'var(--font-body)', fontSize: 15, lineHeight: 1.45, color: 'var(--text-strong)', maxHeight: 160 }} />
        <IconButton icon="arrow-up" variant="solid" size={40} label="Enviar ao Agente Persona" onClick={send} disabled={!v.trim() || disabled} />
      </div>
      {footer ? <div style={{ textAlign: 'center', fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--text-muted)', textWrap: 'pretty' }}>{footer}</div> : null}
    </div>
  );
}
