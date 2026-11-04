import React from 'react';
import { Icon } from '../core/Icon.jsx';
import { Badge } from '../core/Badge.jsx';
import { ProgressBar } from '../surfaces/ProgressBar.jsx';

import { FOCUS_RING as RING, NO_OUTLINE, useFocusVisible } from '../core/focusRing.jsx';
const ORIGIN = { declarada: 'Declarada', observada: 'Observada', parcial: 'Parcialmente observada' };

export function DimensionRow({ label, value, weight, origin = 'declarada', progress, notEvaluated, notEvaluatedText = 'Ainda não avaliada', note, error, disabled, disabledText = 'Faça o diagnóstico para calcular.', onOpen, focused, style }) {
  const [kf, fh] = useFocusVisible();
  const [hover, setHover] = React.useState(false);
  const interactive = !!onOpen && !disabled;
  const Tag = interactive ? 'button' : 'div';
  const state = error ? 'error' : disabled ? 'disabled' : notEvaluated ? 'none' : 'value';
  const valueNode = state === 'value'
    ? <span style={{ display: 'inline-flex', alignItems: 'baseline', gap: 2, fontFeatureSettings: "'tnum'" }}><span style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text-strong)' }}>{value}</span><span style={{ fontSize: 13, color: 'var(--text-muted)' }}>/100</span></span>
    : state === 'none' ? <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--n-600)', whiteSpace: 'nowrap' }}>{notEvaluatedText}</span>
    : state === 'error' ? <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--red-ink)', whiteSpace: 'nowrap' }}>Indisponível</span>
    : <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-disabled)', whiteSpace: 'nowrap' }}>Sem dados</span>;
  return (
    <Tag type={interactive ? 'button' : undefined} onClick={interactive ? onOpen : undefined} aria-disabled={disabled || undefined}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      {...fh}
      style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%', minWidth: 0, boxSizing: 'border-box', padding: '14px 16px', borderRadius: 'var(--radius-sm)', border: '1px solid ' + (state === 'error' ? 'var(--red-500)' : 'var(--border-subtle)'), background: disabled ? 'var(--n-25)' : interactive && hover ? 'var(--n-25)' : 'var(--surface-card)', textAlign: 'left', fontFamily: 'var(--font-body)', cursor: interactive ? 'pointer' : 'default', transition: 'background var(--dur-micro)', ...NO_OUTLINE, ...((kf || focused) ? RING : {}), ...style }}>
      <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, width: '100%' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', minWidth: 0 }}>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 700, letterSpacing: '-0.01em', color: disabled ? 'var(--text-disabled)' : 'var(--text-strong)' }}>{label}</span>
          {state === 'value' ? <Badge tone="neutral">{ORIGIN[origin] || origin}</Badge> : null}
          {state === 'none' ? <Badge tone="neutral" icon="info">Fora do total</Badge> : null}
          {weight != null && state === 'value' ? <span style={{ fontSize: 12, color: 'var(--text-muted)', fontFeatureSettings: "'tnum'", whiteSpace: 'nowrap' }}>peso {weight}</span> : null}
        </span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>{valueNode}{interactive ? <Icon name="chevron-right" size={16} color="var(--text-muted)" /> : null}</span>
      </span>
      {state === 'value' ? <ProgressBar value={value} /> : <span style={{ height: 6, borderRadius: 999, border: '1px dashed var(--n-200)', boxSizing: 'border-box' }}></span>}
      {state === 'value' && progress ? <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--text-body)' }}><Icon name="target" size={14} color="var(--text-muted)" />{progress}</span> : null}
      {state === 'none' ? <span style={{ fontSize: 13, color: 'var(--text-body)', lineHeight: 1.45 }}>{note || 'Não recebe número enquanto não houver validação real.'}</span> : null}
      {state === 'error' ? <span role="alert" style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600, color: 'var(--red-ink)' }}><Icon name="triangle-alert" size={14} />{error}</span> : null}
      {state === 'disabled' ? <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--n-600)' }}><Icon name="lock" size={14} />{disabledText}</span> : null}
    </Tag>
  );
}
