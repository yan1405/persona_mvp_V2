import { cx } from "./cx";
import { Icon, type IconName } from "./icon";

export type TraceKind = "registro" | "sugestao" | "evidencia" | "prova" | "uso";
export type TraceState = "done" | "gap" | "error";
export type TraceStep = { kind: TraceKind; label: string; meta?: string; state?: TraceState };

export const TRACE_KINDS: Record<TraceKind, { icon: IconName; label: string }> = {
  registro: { icon: "notebook-pen", label: "Registro do Diário" },
  sugestao: { icon: "sparkles", label: "Sugestão da IA" },
  evidencia: { icon: "badge-check", label: "Evidência" },
  prova: { icon: "link", label: "Prova" },
  uso: { icon: "file-text", label: "Uso" },
};

export type TraceLineProps = {
  steps: TraceStep[];
  orientation?: "horizontal" | "vertical";
  title?: string;
  /** Torna cada nó um botão (recebe o índice e o passo). */
  onStep?: (index: number, step: TraceStep) => void;
  archived?: boolean;
  className?: string;
};

/** Registro → sugestão → evidência → prova → uso. Horizontal só com >= 6,5 rem por passo; senão vertical. */
export function TraceLine({ steps, orientation = "horizontal", title = "Rastreabilidade", onStep, archived, className }: TraceLineProps) {
  return (
    <div className={cx("dx-trace", className)}>
      <section className="dx-trace__box" aria-label={title}>
        <span className="dx-trace__title">
          <Icon name="history" size={14} />
          {title}
        </span>
        <ol className="dx-trace__list" data-steps={steps.length} data-orient={orientation}>
          {steps.map((step, i) => {
            const kind = TRACE_KINDS[step.kind] || TRACE_KINDS.registro;
            const state = archived ? "off" : step.state || "done";
            const icon: IconName = step.state === "error" ? "triangle-alert" : step.state === "gap" ? "plus" : kind.icon;
            const node = <Icon name={icon} size={15} />;
            return (
              <li key={i} className={cx("dx-trace__item", state !== "done" && "dx-trace__item--" + state)}>
                {onStep && !archived ? (
                  <button type="button" className="dx-trace__node" aria-label={kind.label + ": " + step.label} onClick={() => onStep(i, step)}>
                    {node}
                  </button>
                ) : (
                  <span className="dx-trace__node">{node}</span>
                )}
                <span className="dx-trace__text">
                  <span className="dx-trace__kind">{kind.label}</span>
                  <span className="dx-trace__label">{step.label}</span>
                  {step.meta ? <span className="dx-trace__meta">{step.meta}</span> : null}
                </span>
              </li>
            );
          })}
        </ol>
        {archived ? (
          <span className="dx-trace__archived">
            <Icon name="lock" size={13} />
            Evidência arquivada · a rastreabilidade é preservada.
          </span>
        ) : null}
      </section>
    </div>
  );
}
