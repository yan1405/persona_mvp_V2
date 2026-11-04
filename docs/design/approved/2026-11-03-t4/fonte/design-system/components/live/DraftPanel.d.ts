/**
 * Persona Live · "Rascunho sugerido": short support answer with target duration and closed AI controls.
 * Durations: objetiva 15–25 s · comportamental/STAR 30–45 s · complexa até 60 s. Never 90 s.
 */
export interface DraftPanelProps {
  state?: 'ready' | 'processing' | 'gap' | 'error' | 'closed';
  kind?: 'objetiva' | 'comportamental' | 'complexa';
  /** Draft built only from the authorized evidence. */
  text?: string;
  /** Origin labels, e.g. ["Evidência 1"]. */
  sources?: string[];
  onShorten?: () => void;
  onDeepen?: () => void;
  onOther?: () => void;
  /** Copies the draft only. */
  onCopy?: (text?: string) => void;
  /** Saves as Resposta STAR in Rascunho. */
  onSave?: () => void;
  /** Closed session action. */
  onDuplicate?: () => void;
  onRetry?: () => void;
  error?: string;
  /** Forces the focus ring on Encurtar (specimens). */
  focused?: boolean;
  style?: React.CSSProperties;
}
export declare const DRAFT_DURATIONS: Record<'objetiva' | 'comportamental' | 'complexa', string>;
export declare function DraftPanel(props: DraftPanelProps): JSX.Element;
