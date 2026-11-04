/**
 * Início focal block "Do score declarado ao observado": JourneyStepper + next action with the screen's brand CTA.
 * Measures its OWN width: ≥ 1000px → two columns (next action 320–360px); below → stacked. CTA never shrinks.
 */
import type { JourneyStep } from './JourneyStepper';
export interface FocalJourneyProps {
  title?: string;
  /** Default: section 10 stepper (Diagnóstico ✓ · Primeiro registro ✓ · 5 evidências confirmadas 4 de 5 · Score observado bloqueado). */
  steps?: JourneyStep[];
  /** Default "Revise as 2 sugestões do Diário". */
  nextText?: string;
  /** Brand CTA. Default "Revisar sugestões". */
  ctaLabel?: string;
  ctaIcon?: string;
  onCta?: () => void;
  breakpoint?: number;
  style?: React.CSSProperties;
}
export declare const FOCAL_STEPS: JourneyStep[];
export declare function FocalJourney(props: FocalJourneyProps): JSX.Element;
