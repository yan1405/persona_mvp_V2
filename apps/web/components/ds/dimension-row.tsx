import { Badge } from "./badge";
import { cx } from "./cx";
import { Icon } from "./icon";
import { ProgressBar } from "./progress-bar";

const ORIGIN = { declarada: "Declarada", observada: "Observada", parcial: "Parcialmente observada" } as const;

export type DimensionRowProps = {
  label: string;
  value?: number;
  weight?: number | string;
  origin?: keyof typeof ORIGIN;
  progress?: string;
  notEvaluated?: boolean;
  notEvaluatedText?: string;
  note?: string;
  error?: string;
  disabled?: boolean;
  disabledText?: string;
  onOpen?: () => void;
  className?: string;
};

// Estados: valor, não avaliada (fora do total, sem número), erro e bloqueada; cada um com texto próprio, nunca só cor.
export function DimensionRow({
  label,
  value = 0,
  weight,
  origin = "declarada",
  progress,
  notEvaluated,
  notEvaluatedText = "Ainda não avaliada",
  note,
  error,
  disabled,
  disabledText = "Faça o diagnóstico para calcular.",
  onOpen,
  className,
}: DimensionRowProps) {
  const interactive = !!onOpen && !disabled;
  const state = error ? "error" : disabled ? "disabled" : notEvaluated ? "none" : "value";
  const cls = cx("dx-dim", state === "error" && "dx-dim--error", state === "disabled" && "dx-dim--disabled", className);
  const body = (
    <>
      <span className="dx-dim__head">
        <span className="dx-dim__title">
          <span className="dx-dim__label">{label}</span>
          {state === "value" ? <Badge tone="neutral">{ORIGIN[origin] || origin}</Badge> : null}
          {state === "none" ? (
            <Badge tone="neutral" icon="info">
              Fora do total
            </Badge>
          ) : null}
          {weight != null && state === "value" ? <span className="dx-dim__weight">peso {weight}</span> : null}
        </span>
        <span className="dx-dim__side">
          {state === "value" ? (
            <span className="dx-dim__value">
              <b>{value}</b>
              <span>/100</span>
            </span>
          ) : state === "none" ? (
            <span className="dx-dim__state">{notEvaluatedText}</span>
          ) : state === "error" ? (
            <span className="dx-dim__state dx-dim__state--error">Indisponível</span>
          ) : (
            <span className="dx-dim__state dx-dim__state--off">Sem dados</span>
          )}
          {interactive ? <Icon name="chevron-right" size={16} /> : null}
        </span>
      </span>
      {state === "value" ? <ProgressBar value={value} ariaLabel={label} /> : <span className="dx-dim__ghost" aria-hidden="true" />}
      {state === "value" && progress ? (
        <span className="dx-dim__line">
          <Icon name="target" size={14} />
          {progress}
        </span>
      ) : null}
      {state === "none" ? <span className="dx-dim__line dx-dim__line--note">{note || "Não recebe número enquanto não houver validação real."}</span> : null}
      {state === "error" ? (
        <span className="dx-dim__line dx-dim__line--error" role="alert">
          <Icon name="triangle-alert" size={14} />
          {error}
        </span>
      ) : null}
      {state === "disabled" ? (
        <span className="dx-dim__line dx-dim__line--off">
          <Icon name="lock" size={14} />
          {disabledText}
        </span>
      ) : null}
    </>
  );
  if (interactive) {
    return (
      <button type="button" className={cls} onClick={onOpen}>
        {body}
      </button>
    );
  }
  return (
    <div className={cls} aria-disabled={disabled || undefined}>
      {body}
    </div>
  );
}
