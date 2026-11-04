/**
 * Artefato in the library grid: type, title, objective, status (Rascunho · Revisado · Lacuna) and cited sources.
 * Card, never a table row. Missing sources render as an explicit gap.
 */
export interface ArtifactCardProps {
  type?: 'star' | 'pitch' | 'curriculo' | 'portfolio';
  title?: string;
  objective?: string;
  status?: 'rascunho' | 'revisado' | 'lacuna';
  /** Already formatted; omitted when unknown. */
  updated?: string;
  /** Evidence labels, e.g. ["Evidência 1", "Evidência 2"]. */
  sources?: string[];
  /** Opens the detail; makes the card a focusable button. */
  onOpen?: () => void;
  focused?: boolean;
  /** Non-interactive (e.g. while generating). */
  disabled?: boolean;
  disabledText?: string;
  /** Recoverable problem, e.g. a source became unavailable. */
  error?: string;
  style?: React.CSSProperties;
}
export declare const ARTIFACT_TYPES: Record<string, { label: string; icon: string; tint: string }>;
export declare function ArtifactCard(props: ArtifactCardProps): JSX.Element;
