import * as React from 'react';
/** White content card on the tinted app background. Soft shadow by default; float for the focal object; slab for raised tiles. */
export interface CardProps {
  elevation?: 'none' | 'soft' | 'float' | 'slab';
  radius?: 'sm' | 'md' | 'lg';
  padding?: number | string;
  /** 1px #E4E2EE outline (neutral state) */
  bordered?: boolean;
  /** Hover lifts 2px and swaps soft → float */
  interactive?: boolean;
  onClick?: () => void;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}
export declare function Card(props: CardProps): JSX.Element;
