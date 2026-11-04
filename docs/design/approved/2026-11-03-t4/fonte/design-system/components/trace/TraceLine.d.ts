/**
 * Signature element: the chain Registro → Sugestão → Evidência → Prova → Uso that proves where every text came from.
 * `gap` = missing link (dashed, amber) · `error` = broken link (e.g. invalid proof URL).
 */
export interface TraceStep {
  kind: 'registro' | 'sugestao' | 'evidencia' | 'prova' | 'uso';
  label: string;
  meta?: string;
  state?: 'done' | 'gap' | 'error';
}
export interface TraceLineProps {
  steps: TraceStep[];
  orientation?: 'horizontal' | 'vertical';
  title?: string;
  /** Makes each node a focusable button. */
  onStep?: (index: number, step: TraceStep) => void;
  /** Forces the focus ring on one node (specimens). */
  focusedIndex?: number;
  /** Archived evidence: muted, non-interactive, trace preserved. */
  archived?: boolean;
  style?: React.CSSProperties;
}
export declare const TRACE_KINDS: Record<string, { icon: string; label: string }>;
export declare function TraceLine(props: TraceLineProps): JSX.Element;
