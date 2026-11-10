import { useId, type CSSProperties } from "react";

import { cx } from "./cx";

export type ScoreRingProps = {
  /** 0 a 100. */
  value?: number;
  /** Diâmetro (número). */
  size?: number;
  /** Espessura do traço (número). */
  stroke?: number;
  label?: string | number;
  sublabel?: string;
  /** Texto lido por leitores de tela; sem ele usa o texto visível. */
  ariaLabel?: string;
  onFocal?: boolean;
  className?: string;
};

export function ScoreRing({ value = 0, size = 96, stroke = 8, label, sublabel, ariaLabel, onFocal, className }: ScoreRingProps) {
  const v = Math.max(0, Math.min(100, value));
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const gid = "dx-ring" + useId().replace(/:/g, "");
  const shown = label ?? v;
  const vars = { "--dx-ring-c": c } as CSSProperties;
  return (
    <div
      className={cx("dx-ring", onFocal && "dx-ring--on-focal", className)}
      style={{ width: size, height: size }}
      role="img"
      aria-label={ariaLabel ?? (sublabel ? shown + " " + sublabel : String(shown))}
    >
      <svg className="dx-ring__svg" width={size} height={size} aria-hidden="true" focusable="false">
        <defs>
          <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
            <stop className="dx-ring__stop-a" offset="0" />
            <stop className="dx-ring__stop-b" offset="1" />
          </linearGradient>
        </defs>
        <circle className="dx-ring__track" cx={size / 2} cy={size / 2} r={r} strokeWidth={stroke} />
        <circle
          className="dx-ring__arc"
          cx={size / 2}
          cy={size / 2}
          r={r}
          strokeWidth={stroke}
          stroke={"url(#" + gid + ")"}
          strokeDasharray={c}
          strokeDashoffset={c * (1 - v / 100)}
          style={vars}
        />
      </svg>
      <div className="dx-ring__center" aria-hidden="true">
        <span className="dx-ring__value" style={{ fontSize: Math.round(size * 0.27) }}>
          {shown}
        </span>
        {sublabel ? <span className="dx-ring__sub">{sublabel}</span> : null}
      </div>
    </div>
  );
}
