import React from 'react';
import { Icon } from '../core/Icon.jsx';
import { Button } from '../core/Button.jsx';
import { FocalCard } from './FocalCard.jsx';
import { JourneyStepper } from './JourneyStepper.jsx';

function useWidth() {
  const ref = React.useRef(null);
  const [w, setW] = React.useState(0);
  React.useLayoutEffect(() => {
    const el = ref.current; if (!el) return;
    const set = () => setW(el.offsetWidth);
    set();
    const ro = new ResizeObserver(set); ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, w];
}

export const FOCAL_STEPS = [
  { label: 'Diagnóstico', meta: 'Concluído', state: 'done' },
  { label: 'Primeiro registro', meta: 'Concluído', state: 'done' },
  { label: '5 evidências confirmadas', meta: 'Em andamento · 4 de 5', state: 'active', icon: 'badge-check' },
  { label: 'Score observado', meta: 'Bloqueado', state: 'locked' },
];

// The ONE dark block of Início. Two columns only when its container is ≥ 1000px (next action ≥ 320px); otherwise stacked.
export function FocalJourney({ title = 'Do score declarado ao observado', steps = FOCAL_STEPS, nextText = 'Revise as 2 sugestões do Diário', ctaLabel = 'Revisar sugestões', ctaIcon = 'arrow-right', onCta, breakpoint = 1000, style }) {
  const [ref, w] = useWidth();
  const wide = w >= breakpoint;
  return (
    <div ref={ref} data-layout={wide ? 'columns' : 'stacked'} style={{ width: '100%', minWidth: 0, ...style }}>
      <FocalCard padding={wide ? 28 : 24}>
        <div style={{ display: 'grid', gridTemplateColumns: wide ? 'minmax(0,1fr) minmax(320px, 360px)' : 'minmax(0,1fr)', gap: wide ? 32 : 20, alignItems: 'stretch' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, minWidth: 0 }}>
            <h2 style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, letterSpacing: '-0.015em', color: '#FFFFFF', textWrap: 'pretty' }}>{title}</h2>
            <JourneyStepper steps={steps} />
          </div>
          <section aria-label="Próxima ação" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 16, minWidth: 0, padding: 20, borderRadius: 'var(--radius-md)', background: 'rgb(255 255 255 / 0.08)', border: '1px solid rgb(255 255 255 / 0.12)', boxSizing: 'border-box' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 600, color: 'var(--indigo-300)' }}><Icon name="target" size={14} />Próxima ação</span>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, letterSpacing: '-0.01em', lineHeight: 1.3, color: '#FFFFFF', textWrap: 'pretty' }}>{nextText}</span>
            </div>
            <Button variant="brand" size="lg" iconRight={ctaIcon} onClick={onCta} style={{ alignSelf: 'flex-start', flexShrink: 0, maxWidth: '100%' }}>{ctaLabel}</Button>
          </section>
        </div>
      </FocalCard>
    </div>
  );
}
