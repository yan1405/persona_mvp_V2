import * as React from 'react';
/** The ONE dark surface per screen: ink→indigo-900 gradient with a soft radial indigo glow. Holds the journey / next step. */
export interface FocalCardProps {
  padding?: number | string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}
export declare function FocalCard(props: FocalCardProps): JSX.Element;
