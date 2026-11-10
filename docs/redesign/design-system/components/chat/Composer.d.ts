import * as React from 'react';
/**
 * Agente Persona composer — used only inside AgentPanel (and, later, the central conversation on Início).
 * Contextual chips, auto-growing pill textarea, Ink send button (never brand). Enter sends, Shift+Enter breaks line.
 * No attachment or voice: file upload and audio are out of scope.
 */
export interface ComposerProps {
  value?: string;
  onChange?: (value: string) => void;
  onSend?: (value: string) => void;
  /** Default "Pergunte ao Agente Persona…" */
  placeholder?: string;
  /** Contextual chips. Default: "O que falta para o score observado?", "Organize minhas evidências", "Preparar uma entrevista". Pass [] to hide. */
  suggestions?: string[];
  onSuggestion?: (s: string) => void;
  disabled?: boolean;
  /** Fixed note. Default "O agente só usa as evidências que você registrou. Confira sempre a origem." */
  footer?: React.ReactNode;
  style?: React.CSSProperties;
}
export declare const AGENT_FOOTER: string;
export declare const AGENT_SUGGESTIONS: string[];
export declare function Composer(props: ComposerProps): JSX.Element;
