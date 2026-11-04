import React from 'react';
export function ScoreRing({ value = 0, size = 96, stroke = 8, label, sublabel, onFocal, style }) {
  const [shown, setShown] = React.useState(0);
  React.useEffect(() => { const id = requestAnimationFrame(() => setShown(value)); return () => cancelAnimationFrame(id); }, [value]);
  const r = (size - stroke) / 2; const c = 2 * Math.PI * r; const gid = React.useId ? React.useId().replace(/:/g, '') : 'g';
  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0, ...style }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)', display: 'block' }}>
        <defs><linearGradient id={'sr' + gid} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#8B5CF6" /><stop offset="1" stopColor="#6D28D9" /></linearGradient></defs>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={onFocal ? 'rgb(255 255 255 / 0.12)' : 'var(--n-100)'} strokeWidth={stroke} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={'url(#sr' + gid + ')'} strokeWidth={stroke} strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - shown / 100)} style={{ transition: 'stroke-dashoffset var(--dur-macro) var(--ease-out)' }} />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: Math.round(size * 0.27), letterSpacing: '-0.03em', color: onFocal ? '#FFFFFF' : 'var(--text-strong)', lineHeight: 1, fontFeatureSettings: "'tnum'" }}>{label ?? value}</span>
        {sublabel ? <span style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: onFocal ? 'var(--indigo-300)' : 'var(--text-muted)', marginTop: 3 }}>{sublabel}</span> : null}
      </div>
    </div>
  );
}
