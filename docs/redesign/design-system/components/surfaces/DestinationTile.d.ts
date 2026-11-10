/**
 * Destination tile: pastel semantic tint; icon + ↗ arrow on top; title and ONE live status line (single line, ellipsis) below. Fills its grid cell (equal heights). Four in a row on Início (Diário, Evidências, Persona Live, Artefatos).
 * @startingPoint section="Surfaces" subtitle="Pastel destination tiles with one live status line" viewport="700x360"
 */
export interface DestinationTileProps {
  tone?: 'indigo' | 'blue' | 'amber' | 'green' | 'rose' | 'slate';
  title: string;
  /** The single live status line, e.g. "4 confirmadas · 2 para revisar" */
  status: string;
  meta?: string;
  /** Lucide icon name for the corner glyph */
  icon?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
}
export declare function DestinationTile(props: DestinationTileProps): JSX.Element;
