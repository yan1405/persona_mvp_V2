"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";

import { Button, type ButtonVariant } from "./button";
import { cx } from "./cx";
import { Icon } from "./icon";

export type StepFlowProps = {
  step?: number;
  total?: number;
  title: string;
  description?: string;
  children?: ReactNode;
  onBack?: () => void;
  onNext?: () => void;
  backLabel?: string;
  nextLabel?: string;
  nextVariant?: ButtonVariant;
  nextDisabled?: boolean;
  /** Por que o botão está desativado (texto visível ao lado do botão). */
  nextDisabledReason?: string;
  disabled?: boolean;
  error?: string;
  saving?: boolean;
  /** Nível do título (padrão 3). Use 1 quando o fluxo é a página inteira. O título recebe o foco a cada troca de etapa. */
  headingLevel?: 1 | 2 | 3;
  className?: string;
};

// "Etapa N de M" com barra segmentada; Voltar à esquerda, avançar à direita; erro em linha com role="alert".
export function StepFlow({
  step = 1,
  total = 4,
  title,
  description,
  children,
  onBack,
  onNext,
  backLabel = "Voltar",
  nextLabel = "Continuar",
  nextVariant = "solid",
  nextDisabled,
  nextDisabledReason,
  disabled,
  error,
  saving,
  headingLevel = 3,
  className,
}: StepFlowProps) {
  const id = useId();
  const titleRef = useRef<HTMLHeadingElement>(null);
  const shown = useRef(step);
  useEffect(() => {
    if (shown.current === step) return; // só quando a etapa muda (não no primeiro desenho)
    shown.current = step;
    titleRef.current?.focus();
  }, [step]);
  const Heading = ("h" + headingLevel) as "h3";
  const s = Math.max(1, Math.min(total, step));
  const blockNext = disabled || nextDisabled || saving;
  return (
    <section className={cx("dx-flow", className)} aria-labelledby={id + "-t"}>
      <header className="dx-flow__head">
        <span className="dx-flow__count">
          Etapa {s} de {total}
        </span>
        <div
          className="dx-flow__bar"
          style={{ gridTemplateColumns: "repeat(" + total + ", minmax(0, 1fr))" }}
          role="progressbar"
          aria-label={"Etapa " + s + " de " + total}
          aria-valuemin={1}
          aria-valuemax={total}
          aria-valuenow={s}
        >
          {Array.from({ length: total }).map((_, i) => (
            <span key={i} className={cx("dx-flow__seg", i < s && "is-done")} />
          ))}
        </div>
        <Heading ref={titleRef} id={id + "-t"} className="dx-flow__title" tabIndex={-1}>
          {title}
        </Heading>
        {description ? <p className="dx-flow__desc">{description}</p> : null}
      </header>
      {children ? (
        <div className={cx("dx-flow__body", disabled && "is-disabled")} aria-disabled={disabled || undefined}>
          {children}
        </div>
      ) : null}
      {error ? (
        <p className="dx-flow__error" role="alert">
          <Icon name="triangle-alert" size={16} />
          {error}
        </p>
      ) : null}
      <footer className="dx-flow__foot">
        <Button variant="outline" icon="arrow-left" disabled={disabled || s === 1} onClick={onBack}>
          {backLabel}
        </Button>
        <span className="dx-flow__next">
          {blockNext && nextDisabledReason && !saving ? <span className="dx-flow__reason">{nextDisabledReason}</span> : null}
          <Button variant={nextVariant} iconRight="arrow-right" disabled={blockNext} onClick={onNext}>
            {saving ? "Salvando…" : nextLabel}
          </Button>
        </span>
      </footer>
    </section>
  );
}
