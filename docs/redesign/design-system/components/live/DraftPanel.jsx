import React from 'react';
import { Icon } from '../core/Icon.jsx';
import { Badge } from '../core/Badge.jsx';
import { Button } from '../core/Button.jsx';

import { FOCUS_RING as RING, NO_OUTLINE, useFocusVisible } from '../core/focusRing.jsx';
export const DRAFT_DURATIONS = { objetiva: '15–25 s', comportamental: '30–45 s', complexa: 'até 60 s' };
const KIND_LABEL = { objetiva: 'objetiva', comportamental: 'comportamental · STAR', complexa: 'complexa' };

export function DraftPanel({ state = 'ready', kind = 'comportamental', text, sources = [], onShorten, onDeepen, onOther, onCopy, onSave, onDuplicate, onRetry, error, focused, style }) {
  const [copied, setCopied] = React.useState(false);
  const ready = state === 'ready';
  const closed = state === 'closed';
  const copy = () => { onCopy && onCopy(text); setCopied(true); setTimeout(() => setCopied(false), 1600); };
  return (
    <section aria-label="Rascunho sugerido" aria-busy={state === 'processing' || undefined} style={{ background: 'var(--surface-card)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-soft)', padding: 20, display: 'flex', flexDirection: 'column', gap: 14, width: '100%', minWidth: 0, boxSizing: 'border-box', fontFamily: 'var(--font-body)', ...style }}>
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap' }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 700, letterSpacing: '-0.01em', color: 'var(--text-strong)' }}><Icon name="pen-line" size={18} color="var(--brand)" />Rascunho sugerido</span>
        <Badge tone="neutral" icon="clock">{DRAFT_DURATIONS[kind]} · {KIND_LABEL[kind]}</Badge>
      </header>

      {ready || closed ? <p style={{ margin: 0, fontSize: 15, lineHeight: 1.65, color: closed ? 'var(--text-body)' : 'var(--text-strong)', textWrap: 'pretty' }}>{text}</p> : null}
      {state === 'processing' ? <div role="status" aria-label="Gerando rascunho" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>{[100, 92, 64].map(w => <span key={w} style={{ height: 12, width: w + '%', borderRadius: 6, background: 'var(--n-50)' }}></span>)}<span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Gerando rascunho a partir dos argumentos…</span></div> : null}
      {state === 'gap' ? <p style={{ margin: 0, fontSize: 14, lineHeight: 1.5, color: 'var(--n-600)' }}>Sem rascunho: não há evidência para sustentar esta resposta. Nada é gerado sem fato registrado.</p> : null}
      {state === 'error' ? <div role="alert" style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'flex-start' }}><p style={{ margin: 0, display: 'flex', gap: 8, fontSize: 14, fontWeight: 600, color: 'var(--red-ink)', lineHeight: 1.45 }}><Icon name="triangle-alert" size={16} />{error || 'Não foi possível gerar o rascunho. Os argumentos continuam disponíveis.'}</p><Button variant="outline" size="sm" icon="refresh-cw" onClick={onRetry}>Tentar de novo</Button></div> : null}

      {(ready || closed) && sources.length ? <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Baseado em: <b style={{ color: 'var(--text-body)', fontWeight: 600 }}>{sources.join(' · ')}</b></span> : null}

      {closed ? (
        <footer style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap', borderTop: '1px solid var(--divider)', paddingTop: 14 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--n-600)' }}><Icon name="lock" size={14} />Sessão encerrada · somente leitura</span>
          <Button variant="outline" size="sm" icon="copy" onClick={onDuplicate}>Duplicar sessão</Button>
        </footer>
      ) : (
        <footer style={{ display: 'flex', flexDirection: 'column', gap: 10, borderTop: '1px solid var(--divider)', paddingTop: 14 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            <Button variant="outline" size="sm" icon="minus" disabled={!ready} onClick={onShorten} style={focused && ready ? RING : undefined}>Encurtar</Button>
            <Button variant="outline" size="sm" icon="plus" disabled={!ready} onClick={onDeepen}>Aprofundar</Button>
            <Button variant="outline" size="sm" icon="refresh-cw" disabled={!ready} onClick={onOther}>Outra experiência</Button>
            <Button variant="outline" size="sm" icon={copied ? 'check' : 'copy'} disabled={!ready} onClick={copy}>{copied ? 'Copiado' : 'Copiar'}</Button>
            <Button variant="solid" size="sm" icon="file-text" disabled={!ready} onClick={onSave}>Salvar nos Artefatos</Button>
          </div>
          <span style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.45 }}>Apoio para a sua resposta, não para leitura literal. O Persona não responde por você.</span>
        </footer>
      )}
    </section>
  );
}
