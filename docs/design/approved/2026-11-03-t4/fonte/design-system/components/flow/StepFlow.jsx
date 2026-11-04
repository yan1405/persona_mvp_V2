import React from 'react';
import { Icon } from '../core/Icon.jsx';
import { Button } from '../core/Button.jsx';

import { FOCUS_RING as RING, NO_OUTLINE, useFocusVisible } from '../core/focusRing.jsx';

export function StepFlow({ step = 1, total = 4, title, description, children, onBack, onNext, backLabel = 'Voltar', nextLabel = 'Continuar', nextVariant = 'solid', nextDisabled, nextDisabledReason, disabled, error, saving, focused, style }) {
  const id = React.useId ? React.useId() : 'step';
  const s = Math.max(1, Math.min(total, step));
  const blockNext = disabled || nextDisabled || saving;
  return (
    <section aria-labelledby={id + '-t'} style={{ background: 'var(--surface-card)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-soft)', padding: 24, display: 'flex', flexDirection: 'column', gap: 18, width: '100%', minWidth: 0, boxSizing: 'border-box', fontFamily: 'var(--font-body)', ...style }}>
      <header style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--brand-strong)', fontFeatureSettings: "'tnum'" }}>Etapa {s} de {total}</span>
        <div role="progressbar" aria-label={'Etapa ' + s + ' de ' + total} aria-valuemin={1} aria-valuemax={total} aria-valuenow={s} style={{ display: 'grid', gridTemplateColumns: 'repeat(' + total + ', minmax(0,1fr))', gap: 4 }}>
          {Array.from({ length: total }).map((_, i) => <span key={i} style={{ height: 4, borderRadius: 999, background: i < s ? 'var(--brand)' : 'var(--n-100)' }}></span>)}
        </div>
        <h3 id={id + '-t'} style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, letterSpacing: '-0.015em', color: 'var(--text-strong)' }}>{title}</h3>
        {description ? <p style={{ margin: 0, fontSize: 14, lineHeight: 1.5, color: 'var(--text-body)', textWrap: 'pretty' }}>{description}</p> : null}
      </header>
      {children ? <div style={{ display: 'flex', flexDirection: 'column', gap: 12, opacity: disabled ? 0.6 : 1, pointerEvents: disabled ? 'none' : undefined }} aria-disabled={disabled || undefined}>{children}</div> : null}
      {error ? <p role="alert" style={{ margin: 0, display: 'flex', alignItems: 'flex-start', gap: 8, padding: '10px 12px', borderRadius: 'var(--radius-xs)', background: 'var(--red-soft)', color: 'var(--red-ink)', fontSize: 13, fontWeight: 600, lineHeight: 1.45 }}><Icon name="triangle-alert" size={16} />{error}</p> : null}
      <footer style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', borderTop: '1px solid var(--divider)', paddingTop: 16 }}>
        <Button variant="outline" icon="arrow-left" disabled={disabled || s === 1} onClick={onBack}>{backLabel}</Button>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          {blockNext && nextDisabledReason && !saving ? <span style={{ fontSize: 12, color: 'var(--n-600)' }}>{nextDisabledReason}</span> : null}
          <Button variant={nextVariant} iconRight="arrow-right" disabled={blockNext} onClick={onNext} style={focused ? RING : undefined}>{saving ? 'Salvando…' : nextLabel}</Button>
        </span>
      </footer>
    </section>
  );
}
