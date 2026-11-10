import { cx } from "./cx";
import { Icon, type IconName } from "./icon";

export type JourneyState = "done" | "active" | "locked" | "todo";
export type JourneyStep = { label: string; meta?: string; state?: JourneyState; icon?: IconName };

export type JourneyStepperProps = {
  steps: JourneyStep[];
  /** Sobre o FocalCard (padrão do DS) ou sobre superfície clara. */
  onFocal?: boolean;
  className?: string;
};

// O estado nunca é só cor: o ícone muda (check, cadeado, relógio) e o passo ativo leva aria-current.
export function JourneyStepper({ steps, onFocal = true, className }: JourneyStepperProps) {
  return (
    <ol className={cx("dx-steps", onFocal && "dx-steps--on-focal", className)}>
      {steps.map((s, i) => {
        const st = s.state || "todo";
        const last = i === steps.length - 1;
        const icon: IconName = st === "done" ? "check" : st === "active" ? s.icon || "sparkles" : st === "locked" ? "lock" : s.icon || "clock";
        return (
          <li key={i} className={cx("dx-step", "dx-step--" + st)} aria-current={st === "active" ? "step" : undefined}>
            <span className="dx-step__rail">
              <span className="dx-step__node">
                <Icon name={icon} size={16} />
              </span>
              {!last && st !== "active" ? <span className="dx-step__line" aria-hidden="true" /> : null}
            </span>
            <span className="dx-step__text">
              <span className="dx-step__label">{s.label}</span>
              {s.meta ? <span className="dx-step__meta">{s.meta}</span> : null}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
