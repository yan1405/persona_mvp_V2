/**
 * One dimension of the Narrative Score (Coerência, Consistência, Credibilidade).
 * value + origin + progress toward observed data. `notEvaluated` renders text, never a number.
 */
export interface DimensionRowProps {
  label: string;
  /** 0–100. Ignored when notEvaluated, error or disabled. */
  value?: number;
  /** Weight in the total, e.g. "0,6". */
  weight?: string;
  origin?: 'declarada' | 'parcial' | 'observada';
  /** Concrete progress line, e.g. "Rumo ao dado observado: 4 de 5 evidências confirmadas". */
  progress?: string;
  /** Credibilidade: shows "Ainda não avaliada" and "Fora do total" — no number. */
  notEvaluated?: boolean;
  notEvaluatedText?: string;
  note?: string;
  /** Analysis failure message. */
  error?: string;
  /** Diagnóstico não iniciado. */
  disabled?: boolean;
  disabledText?: string;
  /** Makes the row a button (opens the Score panel). */
  onOpen?: () => void;
  /** Forces the double focus ring — inner 2px #A78BFA + outer 2px #6D28D9 (specimens). */
  focused?: boolean;
  style?: React.CSSProperties;
}
export declare function DimensionRow(props: DimensionRowProps): JSX.Element;
