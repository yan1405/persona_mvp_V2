import * as React from 'react';
/**
 * Anchored detail panel (560–640px, radius 28, Float shadow) on an ink 18% scrim. Preserves the list behind it.
 * Moves focus to the dialog on open, traps Tab inside, closes with Esc or scrim click, restores focus on close. Only ONE open at a time:
 * opening another FloatingPanel closes the current one.
 */
export interface FloatingPanelProps {
  open: boolean;
  onClose: () => void;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  /** Default 600. */
  width?: number;
  children?: React.ReactNode;
  /** Actions row (one Ink or brand action at most). */
  footer?: React.ReactNode;
  /** Positions inside the nearest positioned ancestor instead of the viewport. */
  contained?: boolean;
  style?: React.CSSProperties;
}
export declare function FloatingPanel(props: FloatingPanelProps): JSX.Element | null;
