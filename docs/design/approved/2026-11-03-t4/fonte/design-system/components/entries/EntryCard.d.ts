import type { PersonaStatus } from '../core/Badge';
/**
 * Card for a dated item in a history grid — never a list row, inbox or conversation.
 * kind: `registro` (Diário entry) · `sessao` (Persona Live session) · `versao` (Artefato version).
 */
export interface EntryCardProps {
  kind?: 'registro' | 'sessao' | 'versao';
  /** Already formatted date ("ontem", "4 nov"). Missing → the date line is hidden (never invented). */
  date?: string;
  title?: string;
  /** One line of context (suggestions waiting, authorized evidence, cited evidence). Missing → explicit gap. */
  meta?: string;
  /** Semantic status rendered with Badge. */
  status?: PersonaStatus;
  /** Label override, or a neutral label for states outside the six statuses (e.g. "Encerrada"). */
  statusLabel?: string;
  /** Lucide icon for a neutral `statusLabel` without `status`. */
  statusIcon?: string;
  /** Opens the detail floating panel; makes the whole card a focusable button. */
  onOpen?: () => void;
  /** Accessible verb for the open action. Default "Abrir". */
  openLabel?: string;
  style?: React.CSSProperties;
}
export declare function EntryCard(props: EntryCardProps): JSX.Element;
