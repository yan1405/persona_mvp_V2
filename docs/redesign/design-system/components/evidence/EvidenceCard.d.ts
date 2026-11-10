/**
 * Evidence card — the unit of Persona's professional memory. Always a card (never a table row).
 * Variants: `grid` (Evidências grid, 2–3 columns), `suggestion` (AI suggestion pending review),
 * `selectable` (Persona Live authorization and Artefato creation).
 */
export interface EvidenceCardProps {
  variant?: 'grid' | 'suggestion' | 'selectable';
  /** Evidence title. */
  title: string;
  /** Competencies, shown as chips. */
  competencies?: string[];
  /** Evidence level. In `suggestion`, the level the evidence will have once confirmed. */
  level?: 'Registrada' | 'Documentada';
  /** Number of proof links. 0 links → Registrada; 1+ → Documentada. */
  proofCount?: number;
  /** Where the evidence came from. Missing → "Origem não informada". */
  origin?: 'Diário' | 'Manual';
  /** Last update, already formatted (e.g. "ontem", "4 nov"). Missing → the date item is hidden (never invented). */
  updatedAt?: string;
  /** grid: opens the detail floating panel. Makes the card a focusable button. */
  onOpen?: () => void;
  /** suggestion: "Confirmar evidência". */
  onConfirm?: () => void;
  /** suggestion: "Descartar". */
  onDiscard?: () => void;
  /** suggestion: confirm button tier. Default 'solid' (Ink); use 'brand' only when it is the screen's single brand action. */
  confirmVariant?: 'solid' | 'brand';
  /** selectable: why the evidence is recommended. */
  reason?: string;
  /** selectable: checked state (shown by check mark, border and "Selecionada" label — never colour alone). */
  selected?: boolean;
  onSelectedChange?: (selected: boolean) => void;
  disabled?: boolean;
  style?: React.CSSProperties;
}
export declare function EvidenceCard(props: EvidenceCardProps): JSX.Element;
