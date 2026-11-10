import * as React from 'react';
/**
 * Sequential flow shell: "Etapa N de M", segmented progress, body, Voltar (outline) / Continuar (Ink).
 * Used by Onboarding (4 etapas), Diagnóstico (3 etapas) and Novo Artefato (6 etapas).
 */
export interface StepFlowProps {
  /** 1-based current step. */
  step: number;
  total: number;
  title: string;
  description?: string;
  children?: React.ReactNode;
  onBack?: () => void;
  onNext?: () => void;
  backLabel?: string;
  /** Default "Continuar"; use the step's real action on the last step (e.g. "Gerar rascunho"). */
  nextLabel?: string;
  /** 'solid' (Ink, default) for Continuar; 'brand' only when the step's action is the screen's single brand action (e.g. "Gerar rascunho"). */
  nextVariant?: 'solid' | 'brand';
  nextDisabled?: boolean;
  /** Why Continuar is blocked, e.g. "Selecione de 1 a 8 evidências". */
  nextDisabledReason?: string;
  /** Whole step read-only. */
  disabled?: boolean;
  error?: string;
  saving?: boolean;
  /** Forces the focus ring on Continuar (specimens). */
  focused?: boolean;
  style?: React.CSSProperties;
}
export declare function StepFlow(props: StepFlowProps): JSX.Element;
