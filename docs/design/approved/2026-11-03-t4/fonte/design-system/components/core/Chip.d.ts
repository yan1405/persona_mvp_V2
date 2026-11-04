import * as React from 'react';
import type { PersonaStatus } from './Badge';
/** Pill for competencies, view chips, status filters and quick actions. */
export interface ChipProps {
  /**
   * Semantic product status: tinted pill with the status label and Lucide icon.
   * registrada / rascunho → Slate · documentada / revisado → success · para-revisar / lacuna → attention.
   */
  status?: PersonaStatus;
  /** Lucide icon name; `null` hides the status icon. */
  icon?: string | null;
  /** Generic tone for non-status chips, kept for existing uses. */
  tone?: 'neutral' | 'success' | 'brand';
  /** Ink-filled selected state (exposed as aria-pressed when the chip is a button). */
  selected?: boolean;
  size?: 'sm' | 'md';
  /** When set the chip renders as a focusable button; otherwise a non-focusable span. */
  onClick?: () => void;
  /** Label. Defaults to the status label. */
  children?: React.ReactNode;
  style?: React.CSSProperties;
}
export declare function Chip(props: ChipProps): JSX.Element;
