import * as React from 'react';
/**
 * Pill button. Brand = THE single CTA per screen (indigo gradient + glow). Solid (ink) = one per card. Outline = secondary. Ghost = tertiary.
 * @startingPoint section="Core" subtitle="Brand / solid / outline / ghost pill buttons" viewport="700x320"
 */
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'brand' | 'solid' | 'outline' | 'ghost' | 'onFocal';
  size?: 'sm' | 'md' | 'lg';
  /** Lucide icon name (see Icon) shown before the label */
  icon?: string;
  /** Lucide icon name shown after the label, e.g. "arrow-right" */
  iconRight?: string;
  fullWidth?: boolean;
  disabled?: boolean;
  children?: React.ReactNode;
}
export declare function Button(props: ButtonProps): JSX.Element;
