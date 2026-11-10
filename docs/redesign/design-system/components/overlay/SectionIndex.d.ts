/**
 * Anchor index for long details stacked in sections ("Nesta página"). Vertical list of numbered text links
 * with a dot marker — NOT tabs: no pills, no fills, no underline bar; every section stays on the same page.
 */
export interface SectionIndexItem {
  /** id of the target section element. */
  id: string;
  label: string;
  /** Short live count, e.g. "2 links". */
  meta?: string;
  /** Section without content yet (muted, not focusable). */
  disabled?: boolean;
}
export interface SectionIndexProps {
  items: SectionIndexItem[];
  /** Controlled current section. */
  activeId?: string;
  onSelect?: (id: string) => void;
  title?: string;
  /** Forces the focus ring on one item (specimens). */
  focusedId?: string;
  style?: React.CSSProperties;
}
export declare function SectionIndex(props: SectionIndexProps): JSX.Element;
