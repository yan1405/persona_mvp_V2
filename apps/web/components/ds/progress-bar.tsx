import { cx } from "./cx";

export type ProgressBarProps = {
  /** 0 a 100. */
  value?: number;
  tone?: "brand" | "success" | "warning" | "info" | "ink";
  /** Altura da barra (número). Padrão do DS: 6. */
  height?: number;
  onFocal?: boolean;
  label?: string;
  /** Nome acessível quando não há `label` visível. */
  ariaLabel?: string;
  className?: string;
};

export function ProgressBar({ value = 0, tone = "brand", height, onFocal, label, ariaLabel, className }: ProgressBarProps) {
  const v = Math.max(0, Math.min(100, value));
  return (
    <div className={cx("dx-progress", tone !== "brand" && "dx-progress--" + tone, onFocal && "dx-progress--on-focal", className)}>
      {label ? (
        <div className="dx-progress__head">
          <span>{label}</span>
          <span>{v}%</span>
        </div>
      ) : null}
      <div className="dx-progress__track" role="progressbar" aria-label={label || ariaLabel} aria-valuemin={0} aria-valuemax={100} aria-valuenow={v} style={height != null ? { height } : undefined}>
        <div className="dx-progress__fill" style={{ width: v + "%" }} />
      </div>
    </div>
  );
}
