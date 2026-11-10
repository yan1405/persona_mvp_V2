import React from 'react';
import { Icon } from '../core/Icon.jsx';
import { Button } from '../core/Button.jsx';
import { FIELD_FOCUS } from '../core/focusRing.jsx';

export const MIN_CHARS = 40;
export const MAX_CHARS = 2000;
const fmt = n => n.toLocaleString('pt-BR');
const fieldBase = { width: '100%', boxSizing: 'border-box', fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--text-strong)', background: 'var(--surface-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', outline: 0, transition: 'border-color var(--dur-micro), box-shadow var(--dur-micro)' };
const focusStyle = FIELD_FOCUS;

function useField() {
  const [f, setF] = React.useState(false);
  return [f, { onFocus: () => setF(true), onBlur: () => setF(false) }];
}

export function CaptureEditor({ value, defaultValue = '', onChange, date, onDateChange, context, onContextChange, onSave, saving, disabled, error, focused, style }) {
  const [inner, setInner] = React.useState(defaultValue);
  const [innerDate, setInnerDate] = React.useState('');
  const [innerCtx, setInnerCtx] = React.useState('');
  const v = value != null ? value : inner;
  const d = date != null ? date : innerDate;
  const c = context != null ? context : innerCtx;
  const [fT, hT] = useField();
  const [fD, hD] = useField();
  const [fC, hC] = useField();
  const n = v.length;
  const state = error ? 'error' : disabled ? 'disabled' : n === 0 ? 'empty' : n < MIN_CHARS ? 'short' : n >= MAX_CHARS ? 'limit' : 'valid';
  const id = React.useId ? React.useId() : 'cap';
  const counter = {
    empty: { color: 'var(--text-muted)', icon: null, text: 'Mínimo de ' + MIN_CHARS + ' caracteres', nowrap: true },
    short: { color: 'var(--amber-ink)', icon: 'info', text: 'Faltam ' + (MIN_CHARS - n) + ' caracteres para salvar' },
    valid: { color: 'var(--green-ink)', icon: 'circle-check', text: 'Pronto para salvar' },
    limit: { color: 'var(--amber-ink)', icon: 'triangle-alert', text: 'Limite de ' + fmt(MAX_CHARS) + ' caracteres atingido' },
    error: { color: 'var(--red-ink)', icon: 'triangle-alert', text: error },
    disabled: { color: 'var(--n-600)', icon: 'lock', text: 'Edição indisponível' },
  }[state];
  const disStyle = disabled ? { background: 'var(--n-50)', color: 'var(--n-600)', cursor: 'not-allowed' } : {};
  const errStyle = state === 'error' ? { borderColor: 'var(--danger)' } : {};
  const canSave = !disabled && !saving && !error && n >= MIN_CHARS && n <= MAX_CHARS;
  return (
    <section aria-labelledby={id + '-l'} style={{ background: 'var(--surface-card)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-soft)', padding: 24, display: 'flex', flexDirection: 'column', gap: 16, fontFamily: 'var(--font-body)', boxSizing: 'border-box', width: '100%', minWidth: 0, ...style }}>
      <label id={id + '-l'} htmlFor={id + '-t'} style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, letterSpacing: '-0.015em', color: 'var(--text-strong)' }}>O que aconteceu hoje?</label>
      <textarea id={id + '-t'} value={v} maxLength={MAX_CHARS} disabled={disabled} aria-describedby={id + '-c'} aria-invalid={state === 'error' || undefined}
        onChange={e => { const x = e.target.value.slice(0, MAX_CHARS); if (value == null) setInner(x); onChange && onChange(x); }} {...hT}
        style={{ ...fieldBase, minHeight: 168, resize: 'vertical', padding: '14px 16px', fontSize: 15, lineHeight: 1.6, background: 'var(--n-25)', ...errStyle, ...((fT || focused) && !disabled ? focusStyle : {}), ...disStyle }} />
      <div id={id + '-c'} aria-live="polite" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, fontSize: 13, flexWrap: 'wrap' }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: counter.color, fontWeight: state === 'empty' || state === 'disabled' ? 400 : 600, flex: '1 1 260px', minWidth: 0, whiteSpace: counter.nowrap ? 'nowrap' : undefined }}>{counter.icon ? <Icon name={counter.icon} size={15} /> : null}{counter.text}</span>
        <span style={{ color: state === 'limit' ? 'var(--amber-ink)' : 'var(--text-muted)', fontWeight: state === 'limit' ? 600 : 400, whiteSpace: 'nowrap', fontFeatureSettings: "'tnum'" }}>{fmt(n)} / {fmt(MAX_CHARS)}</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,180px) minmax(0,1fr)', gap: 12 }}>
        <label style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 13, fontWeight: 600, color: 'var(--text-body)' }}>Data (opcional)
          <input type="date" value={d} disabled={disabled} onChange={e => { if (date == null) setInnerDate(e.target.value); onDateChange && onDateChange(e.target.value); }} {...hD} style={{ ...fieldBase, height: 40, padding: '0 12px', fontWeight: 400, ...(fD ? focusStyle : {}), ...disStyle }} />
        </label>
        <label style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 13, fontWeight: 600, color: 'var(--text-body)' }}>Contexto (opcional)
          <input type="text" value={c} disabled={disabled} placeholder="Ex.: estágio, projeto, curso" onChange={e => { if (context == null) setInnerCtx(e.target.value); onContextChange && onContextChange(e.target.value); }} {...hC} style={{ ...fieldBase, height: 40, padding: '0 12px', fontWeight: 400, ...(fC ? focusStyle : {}), ...disStyle }} />
        </label>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', borderTop: '1px solid var(--divider)', paddingTop: 16 }}>
        <span style={{ fontSize: 12, color: 'var(--text-muted)', maxWidth: 360 }}>Seu texto fica como você escreveu. As sugestões da IA aparecem depois, separadas.</span>
        <Button variant="brand" icon="check" disabled={!canSave} onClick={() => canSave && onSave && onSave({ text: v, date: d, context: c })}>{saving ? 'Salvando…' : 'Salvar registro'}</Button>
      </div>
    </section>
  );
}
