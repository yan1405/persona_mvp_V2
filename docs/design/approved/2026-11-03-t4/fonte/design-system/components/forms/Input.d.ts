import * as React from 'react';
/** Text input. search = white pill with leading magnifier; field = 16px-radius labelled field with indigo focus ring. */
export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'style'> {
  variant?: 'field' | 'search';
  /** Lucide icon name (search defaults to "search") */
  icon?: string;
  label?: string;
  hint?: string;
  error?: string;
  /** Node rendered at the right end (e.g. kbd hint, IconButton) */
  trailing?: React.ReactNode;
  style?: React.CSSProperties;
  inputStyle?: React.CSSProperties;
}
export declare function Input(props: InputProps): JSX.Element;
