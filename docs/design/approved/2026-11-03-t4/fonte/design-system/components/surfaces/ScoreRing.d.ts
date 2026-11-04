/** Circular score ring with indigo gradient stroke, drawn on entrance (360ms). */
export interface ScoreRingProps {
  /** 0–100 */
  value: number;
  size?: number;
  stroke?: number;
  /** Centre text (defaults to value) */
  label?: string;
  sublabel?: string;
  onFocal?: boolean;
  style?: React.CSSProperties;
}
export declare function ScoreRing(props: ScoreRingProps): JSX.Element;
