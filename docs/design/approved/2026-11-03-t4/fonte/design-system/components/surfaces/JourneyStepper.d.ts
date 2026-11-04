/** Vertical journey stepper: done (check) · active (gradient node + ring + pulse) · locked (lock). Designed for the dark FocalCard. */
export interface JourneyStep { label: string; meta?: string; state?: 'done' | 'active' | 'locked' | 'todo'; icon?: string }
export interface JourneyStepperProps {
  steps: JourneyStep[];
  /** true = colours for the dark focal surface (default) */
  onFocal?: boolean;
  onSelect?: (index: number) => void;
  style?: React.CSSProperties;
}
export declare function JourneyStepper(props: JourneyStepperProps): JSX.Element;
