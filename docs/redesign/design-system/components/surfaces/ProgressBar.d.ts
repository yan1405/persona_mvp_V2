/** Thin rounded progress bar (6px). */
export interface ProgressBarProps {
  /** 0–100 */
  value: number;
  tone?: 'brand' | 'success' | 'warning' | 'info' | 'ink';
  height?: number;
  /** Translucent track for the dark focal surface */
  onFocal?: boolean;
  /** Optional label row with % on the right */
  label?: string;
  style?: React.CSSProperties;
}
export declare function ProgressBar(props: ProgressBarProps): JSX.Element;
