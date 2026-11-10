import React from 'react';

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

// 4 columns when the container is ≥ 900px, otherwise 2 × 2. Rows share one height; a trailing odd tile spans the row (never orphaned).
export function DestinationGrid({ children, breakpoint = 900, gap = 12, style }) {
  const [ref, w] = useWidth();
  const items = React.Children.toArray(children).filter(Boolean);
  const cols = w >= breakpoint ? 4 : 2;
  const rest = items.length % cols;
  return (
    <div ref={ref} data-cols={cols} style={{ display: 'grid', gridTemplateColumns: 'repeat(' + cols + ', minmax(0,1fr))', gridAutoRows: '1fr', gap, width: '100%', minWidth: 0, ...style }}>
      {items.map((c, i) => {
        const last = rest && i >= items.length - rest;
        return <div key={i} style={{ minWidth: 0, display: 'flex', gridColumn: last && i === items.length - 1 ? 'span ' + (cols - rest + 1) : undefined }}>{c}</div>;
      })}
    </div>
  );
}
