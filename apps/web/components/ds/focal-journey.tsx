import { Button, ButtonLink } from "./button";
import { cx } from "./cx";
import { FocalCard } from "./focal-card";
import { Icon, type IconName } from "./icon";
import { JourneyStepper, type JourneyStep } from "./journey-stepper";

export type FocalJourneyProps = {
  title: string;
  steps: JourneyStep[];
  nextText: string;
  ctaLabel: string;
  ctaIcon?: IconName;
  onCta?: () => void;
  /** Com `href` a ação é um link (telas de servidor); sem ele, um botão. */
  ctaHref?: string;
  className?: string;
};

/** O único bloco escuro do Início. Duas colunas só com o contêiner >= 1000 px; abaixo, empilhado. */
export function FocalJourney({ title, steps, nextText, ctaLabel, ctaIcon = "arrow-right", onCta, ctaHref, className }: FocalJourneyProps) {
  return (
    <div className={cx("dx-journey", className)}>
      <FocalCard>
        <div className="dx-journey__grid">
          <div className="dx-journey__main">
            <h2 className="dx-journey__title">{title}</h2>
            <JourneyStepper steps={steps} />
          </div>
          <section className="dx-journey__next" aria-label="Próxima ação">
            <div className="dx-journey__next-copy">
              <span className="dx-journey__next-eyebrow">
                <Icon name="target" size={14} />
                Próxima ação
              </span>
              <span className="dx-journey__next-text">{nextText}</span>
            </div>
            {ctaHref ? (
              <ButtonLink variant="brand" size="lg" iconRight={ctaIcon} href={ctaHref} className="dx-journey__cta">
                {ctaLabel}
              </ButtonLink>
            ) : (
              <Button variant="brand" size="lg" iconRight={ctaIcon} onClick={onCta} className="dx-journey__cta">
                {ctaLabel}
              </Button>
            )}
          </section>
        </div>
      </FocalCard>
    </div>
  );
}
