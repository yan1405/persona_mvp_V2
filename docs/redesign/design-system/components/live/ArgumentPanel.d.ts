import type { PersonaStatus } from '../core/Badge';
/**
 * Persona Live · "Argumentos reais": facts from authorized evidence, each with its origin and an alert of what not to claim.
 * Editorial, never chat bubbles. `gap` = honest lacuna with "Registrar no Diário".
 */
export interface ArgumentItem {
  /** Fact exactly as registered in the evidence. */
  fact: string;
  /** Only when registered — never inferred. */
  action?: string;
  result?: string;
  competencies?: string[];
  /** Origin evidence label, e.g. "Evidência 1". Required. */
  source: string;
  level?: PersonaStatus;
}
export interface ArgumentPanelProps {
  state?: 'sustained' | 'processing' | 'gap' | 'error' | 'closed';
  question?: string;
  items?: ArgumentItem[];
  /** What the evidence does not support. */
  avoid?: string;
  /** Facts missing for the gap state. */
  missing?: string[];
  onRegister?: () => void;
  onSource?: (source: string) => void;
  onRetry?: () => void;
  error?: string;
  /** Forces the focus ring on the first interactive control (specimens). */
  focused?: boolean;
  style?: React.CSSProperties;
}
export declare function ArgumentPanel(props: ArgumentPanelProps): JSX.Element;
