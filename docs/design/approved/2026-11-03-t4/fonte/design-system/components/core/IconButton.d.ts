import * as React from 'react';
/** Circular icon-only button (toolbar actions, header utilities, composer). */
export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Lucide icon name */
  icon: string;
  variant?: 'ghost' | 'outline' | 'soft' | 'solid' | 'brand';
  /** Diameter in px (default 40) */
  size?: number;
  /** Count bubble in brand indigo */
  badge?: number | string;
  /** Small red attention dot */
  dot?: boolean;
  /** Accessible label + tooltip */
  label?: string;
  active?: boolean;
  disabled?: boolean;
}
export declare function IconButton(props: IconButtonProps): JSX.Element;
