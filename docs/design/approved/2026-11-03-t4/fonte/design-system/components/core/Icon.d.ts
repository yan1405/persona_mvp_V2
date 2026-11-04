/** Lucide outline icon (stroke 1.75). Names: see ICON_NAMES — house, messages-square, book-open, library, search, sparkles, quote, graduation-cap, flask-conical, … */
export interface IconProps {
  name: string;
  size?: number;
  strokeWidth?: number;
  color?: string;
  style?: React.CSSProperties;
}
export declare function Icon(props: IconProps): JSX.Element | null;
export declare const ICON_NAMES: string[];
