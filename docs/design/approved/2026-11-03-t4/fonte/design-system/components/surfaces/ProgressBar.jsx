import React from 'react';
const C = { brand: 'var(--brand-gradient)', success: 'var(--green-500)', warning: 'var(--amber-500)', info: 'var(--blue-500)', ink: 'var(--ink)' };
export function ProgressBar({ value = 0, tone = 'brand', height = 6, onFocal, label, style }) {
  const v = Math.max(0, Math.min(100, value));
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, ...style }}>
      {label ? <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 500, color: onFocal ? 'var(--indigo-300)' : 'var(--text-muted)' }}><span>{label}</span><span style={{ fontFeatureSettings: "'tnum'" }}>{v}%</span></div> : null}
      <div style={{ height, borderRadius: 999, background: onFocal ? 'rgb(255 255 255 / 0.12)' : 'var(--n-100)', overflow: 'hidden' }}>
        <div style={{ width: v + '%', height: '100%', borderRadius: 999, background: C[tone] || C.brand, transition: 'width var(--dur-macro) var(--ease-out)' }}></div>
      </div>
    </div>
  );
}
