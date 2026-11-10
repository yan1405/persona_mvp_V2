import * as React from 'react';
/** On/off toggle, indigo when on. Native <button role="switch" aria-checked>: Tab-reachable, Space/Enter toggle, real `disabled`; the label is a <label for>. */
export interface SwitchProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: React.ReactNode;
  /** id of the inner switch button (auto-generated when omitted). */
  id?: string;
  disabled?: boolean;
  style?: React.CSSProperties;
}
export declare function Switch(props: SwitchProps): JSX.Element;
