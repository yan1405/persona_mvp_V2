import React from 'react';
import { Icon } from '../core/Icon.jsx';

import { FOCUS_RING as RING, NO_OUTLINE, useFocusVisible } from '../core/focusRing.jsx';
export const TRACE_KINDS = {
  registro: { icon: 'notebook-pen', label: 'Registro do Diário' },
  sugestao: { icon: 'sparkles', label: 'Sugestão da IA' },
  evidencia: { icon: 'badge-check', label: 'Evidência' },
  prova: { icon: 'link', label: 'Prova' },
  uso: { icon: 'file-text', label: 'Uso' },
};
const NODE = {
  done: { bg: 'var(--surface-card)', fg: 'var(--brand)', border: '1px solid var(--indigo-300)', line: 'var(--indigo-300)', lineStyle: 'solid' },
  gap: { bg: 'var(--amber-soft)', fg: 'var(--amber-ink)', border: '1px dashed var(--amber-500)', line: 'var(--n-200)', lineStyle: 'dashed' },
  error: { bg: 'var(--red-soft)', fg: 'var(--red-ink)', border: '1px solid var(--red-500)', line: 'var(--n-200)', lineStyle: 'dashed' },
  off: { bg: 'var(--n-50)', fg: 'var(--text-disabled)', border: '1px solid var(--n-100)', line: 'var(--n-100)', lineStyle: 'solid' },
};

function Node({ step, i, last, vertical, onStep, focused, archived }) {
  const [kf, fh] = useFocusVisible();
  const k = TRACE_KINDS[step.kind] || TRACE_KINDS.registro;
  const n = NODE[archived ? 'off' : step.state || 'done'] || NODE.done;
  const icon = step.state === 'error' ? 'triangle-alert' : step.state === 'gap' ? 'plus' : k.icon;
  const Tag = onStep && !archived ? 'button' : 'div';
  const next = NODE[archived ? 'off' : 'done'];
  return (
    <li style={{ position: 'relative', listStyle: 'none', minWidth: 0, display: 'flex', flexDirection: vertical ? 'row' : 'column', gap: vertical ? 12 : 8, paddingBottom: vertical && !last ? 18 : 0, paddingRight: vertical ? 0 : 12 }}>
      {!last ? <span aria-hidden="true" style={vertical
        ? { position: 'absolute', left: 15, top: 34, bottom: 2, borderLeft: '2px ' + n.lineStyle + ' ' + (step.state && step.state !== 'done' ? n.line : next.line) }
        : { position: 'absolute', left: 38, right: 6, top: 15, borderTop: '2px ' + n.lineStyle + ' ' + (step.state && step.state !== 'done' ? n.line : next.line) }}></span> : null}
      <Tag type={Tag === 'button' ? 'button' : undefined} onClick={Tag === 'button' ? () => onStep(i, step) : undefined} aria-label={Tag === 'button' ? k.label + ': ' + step.label : undefined}
        {...fh}
        style={{ position: 'relative', zIndex: 1, width: 32, height: 32, flexShrink: 0, borderRadius: 999, boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'center', background: n.bg, color: n.fg, border: n.border, padding: 0, cursor: Tag === 'button' ? 'pointer' : 'default', ...NO_OUTLINE, ...((kf || focused) ? RING : {}) }}>
        <Icon name={icon} size={15} />
      </Tag>
      <span style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
        <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)' }}>{k.label}</span>
        <span style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.35, color: archived ? 'var(--text-disabled)' : step.state === 'error' ? 'var(--red-ink)' : step.state === 'gap' ? 'var(--amber-ink)' : 'var(--text-strong)', textWrap: 'pretty' }}>{step.label}</span>
        {step.meta ? <span style={{ fontSize: 12, lineHeight: 1.4, color: 'var(--text-body)' }}>{step.meta}</span> : null}
      </span>
    </li>
  );
}

export function TraceLine({ steps = [], orientation = 'horizontal', title = 'Rastreabilidade', onStep, focusedIndex, archived, style }) {
  const tlRef = React.useRef(null);
  const [tlW, setTlW] = React.useState(0);
  React.useLayoutEffect(() => {
    const el = tlRef.current; if (!el) return;
    const f = () => setTlW(el.offsetWidth);
    f();
    const ro = new ResizeObserver(f); ro.observe(el);
    return () => ro.disconnect();
  }, []);
  // Horizontal só quando cada passo tem ao menos 104 px; abaixo disso vira vertical (rótulos nunca colidem).
  const vertical = orientation === 'vertical' || (tlW > 0 && tlW / Math.max(1, steps.length) < 104);
  return (
    <section ref={tlRef} aria-label={title} style={{ display: 'flex', flexDirection: 'column', gap: 12, minWidth: 0, fontFamily: 'var(--font-body)', ...style }}>
      <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, fontWeight: 600, color: 'var(--text-body)' }}><Icon name="history" size={14} color="var(--text-muted)" />{title}</span>
      <ol style={{ margin: 0, padding: 0, display: vertical ? 'flex' : 'grid', flexDirection: 'column', gridTemplateColumns: vertical ? undefined : 'repeat(' + Math.max(1, steps.length) + ', minmax(0,1fr))' }}>
        {steps.map((s, i) => <Node key={i} step={s} i={i} last={i === steps.length - 1} vertical={vertical} onStep={onStep} focused={focusedIndex === i} archived={archived} />)}
      </ol>
      {archived ? <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--n-600)' }}><Icon name="lock" size={13} />Evidência arquivada · a rastreabilidade é preservada.</span> : null}
    </section>
  );
}
