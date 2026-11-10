import React from 'react';
export function FocalCard({ padding = 28, children, style }) {
  return (
    <div style={{ position: 'relative', overflow: 'hidden', borderRadius: 'var(--radius-lg)', background: 'var(--surface-focal)', color: 'var(--text-on-focal)', padding, boxShadow: 'var(--shadow-slab)', ...style }}>
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: 'var(--surface-focal-glow)', pointerEvents: 'none' }}></div>
      <div style={{ position: 'relative' }}>{children}</div>
    </div>
  );
}
