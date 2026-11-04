import * as React from 'react';
/**
 * Grid for the four Início destination tiles (Diário, Evidências, Persona Live, Artefatos).
 * Measures its OWN width: ≥ 900px → 4 columns; < 900px → 2 × 2. Equal row heights; never an orphan tile.
 */
export interface DestinationGridProps {
  /** DestinationTile elements (4 expected). */
  children?: React.ReactNode;
  /** Container width for 4 columns. Default 900. */
  breakpoint?: number;
  gap?: number;
  style?: React.CSSProperties;
}
export declare function DestinationGrid(props: DestinationGridProps): JSX.Element;
