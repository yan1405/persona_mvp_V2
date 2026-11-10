import React from 'react';
const SH = { none: 'none', soft: 'var(--shadow-soft)', float: 'var(--shadow-float)', slab: 'var(--shadow-slab)' };
const R = { sm: 'var(--radius-sm)', md: 'var(--radius-md)', lg: 'var(--radius-lg)' };
export function Card({ elevation = 'soft', radius = 'md', padding = 24, bordered, interactive, onClick, children, style }) {
  const [hover, setHover] = React.useState(false);
  const lift = interactive && hover;
  return (
    <div onClick={onClick} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ background: 'var(--surface-card)', borderRadius: R[radius] || radius, padding, boxShadow: lift ? SH.float : SH[elevation], border: bordered ? '1px solid var(--border-subtle)' : '1px solid transparent', transform: lift ? 'translateY(-2px)' : 'none', transition: 'transform var(--dur-normal) var(--ease-out), box-shadow var(--dur-normal) var(--ease-out)', cursor: onClick ? 'pointer' : undefined, ...style }}>
      {children}
    </div>
  );
}
