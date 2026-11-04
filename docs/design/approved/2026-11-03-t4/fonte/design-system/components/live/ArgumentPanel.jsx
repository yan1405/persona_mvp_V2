import React from 'react';
import { Icon } from '../core/Icon.jsx';
import { Badge } from '../core/Badge.jsx';
import { Chip } from '../core/Chip.jsx';
import { Button } from '../core/Button.jsx';

import { FOCUS_RING as RING, NO_OUTLINE, useFocusVisible } from '../core/focusRing.jsx';
const shell = { background: 'var(--surface-card)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-soft)', padding: 20, display: 'flex', flexDirection: 'column', gap: 16, width: '100%', minWidth: 0, boxSizing: 'border-box', fontFamily: 'var(--font-body)' };
const field = { fontSize: 12, fontWeight: 600, color: 'var(--text-muted)' };

function Dots() {
  return <span aria-hidden="true" style={{ display: 'inline-flex', gap: 4 }}>{[0, 1, 2].map(i => <span key={i} style={{ width: 6, height: 6, borderRadius: 999, background: 'var(--n-400)', animation: 'persona-dot 1.2s ' + (i * 0.15) + 's infinite var(--ease-out)' }}></span>)}</span>;
}

function SourceButton({ label, onClick, focused, disabled }) {
  const [kf, fh] = useFocusVisible();
  return (
    <button type="button" disabled={disabled} onClick={onClick} {...fh}
      style={{ display: 'inline-flex', alignItems: 'center', gap: 6, height: 28, padding: '0 10px', borderRadius: 999, border: '1px solid var(--border-subtle)', background: 'var(--surface-card)', color: disabled ? 'var(--text-disabled)' : 'var(--brand-strong)', fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 600, cursor: disabled ? 'default' : 'pointer', whiteSpace: 'nowrap', ...NO_OUTLINE, ...((kf || focused) ? RING : {}) }}>
      <Icon name="link" size={14} />{label}
    </button>
  );
}

export function ArgumentPanel({ state = 'sustained', question, items = [], avoid, missing = [], onRegister, onSource, onRetry, error, focused, style }) {
  const closed = state === 'closed';
  return (
    <section aria-label="Argumentos reais" aria-busy={state === 'processing' || undefined} style={{ ...shell, ...style }}>
      <header style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 700, letterSpacing: '-0.01em', color: 'var(--text-strong)' }}><Icon name="list-checks" size={18} color="var(--brand)" />Argumentos reais</span>
          {state === 'gap' ? <Badge status="lacuna" /> : closed ? <Badge tone="neutral" icon="lock">Somente leitura</Badge> : null}
        </span>
        {question ? <span style={{ fontSize: 13, color: 'var(--text-body)', lineHeight: 1.45 }}>Pergunta: “{question}”</span> : null}
      </header>

      {state === 'processing' ? <p role="status" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: 'var(--text-body)' }}><Dots />Buscando fatos nas evidências autorizadas…</p> : null}

      {state === 'error' ? (
        <div role="alert" style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-start' }}>
          <p style={{ margin: 0, display: 'flex', gap: 8, fontSize: 14, fontWeight: 600, color: 'var(--red-ink)', lineHeight: 1.45 }}><Icon name="triangle-alert" size={16} />{error || 'Não foi possível montar os argumentos agora. Sua pergunta continua aqui.'}</p>
          <Button variant="outline" size="sm" icon="refresh-cw" onClick={onRetry}>Tentar de novo</Button>
        </div>
      ) : null}

      {state === 'gap' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-start' }}>
          <p style={{ margin: 0, fontSize: 15, fontWeight: 600, color: 'var(--text-strong)', lineHeight: 1.45 }}>Ainda não há evidência para sustentar esta resposta.</p>
          {missing.length ? <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}><span style={field}>O que falta registrar</span><ul style={{ margin: 0, paddingLeft: 18, fontSize: 14, lineHeight: 1.55, color: 'var(--text-body)' }}>{missing.map(m => <li key={m}>{m}</li>)}</ul></div> : null}
          <Button variant="solid" size="sm" icon="notebook-pen" onClick={onRegister} style={focused ? RING : undefined}>Registrar no Diário</Button>
        </div>
      ) : null}

      {(state === 'sustained' || closed) ? items.map((it, i) => (
        <article key={i} style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingTop: i ? 14 : 0, borderTop: i ? '1px solid var(--divider)' : 0 }}>
          <span style={{ display: 'flex', flexDirection: 'column', gap: 4 }}><span style={field}>Fato</span><span style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-strong)', lineHeight: 1.4 }}>{it.fact}</span></span>
          {it.action ? <span style={{ display: 'flex', flexDirection: 'column', gap: 4 }}><span style={field}>Ação</span><span style={{ fontSize: 14, color: 'var(--text-body)', lineHeight: 1.5 }}>{it.action}</span></span> : null}
          {it.result ? <span style={{ display: 'flex', flexDirection: 'column', gap: 4 }}><span style={field}>Resultado</span><span style={{ fontSize: 14, color: 'var(--text-body)', lineHeight: 1.5 }}>{it.result}</span></span> : null}
          {it.competencies && it.competencies.length ? <span style={{ display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center' }}><span style={{ ...field, marginRight: 4 }}>Competências</span>{it.competencies.map(c => <Chip key={c} size="sm">{c}</Chip>)}</span> : null}
          <span style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}><span style={field}>Origem</span><SourceButton label={it.source} focused={focused && i === 0} disabled={closed && !onSource} onClick={() => onSource && onSource(it.source)} />{it.level ? <Badge status={it.level} /> : null}</span>
        </article>
      )) : null}

      {(state === 'sustained' || closed) && avoid ? <p style={{ margin: 0, display: 'flex', gap: 8, padding: '10px 12px', borderRadius: 'var(--radius-xs)', background: 'var(--amber-soft)', color: 'var(--amber-ink)', fontSize: 13, lineHeight: 1.45 }}><Icon name="triangle-alert" size={16} style={{ marginTop: 1 }} /><span style={{ flex: 1, minWidth: 0 }}><b>Não afirme:</b> {avoid}</span></p> : null}
    </section>
  );
}
