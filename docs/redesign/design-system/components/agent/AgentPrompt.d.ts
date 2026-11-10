/**
 * The single "Buscar ou perguntar" field: searches entries and evidence; a question goes to the Agente Persona.
 * `large` — main field on Início, with up to four suggestion chips. `compact` — header field with ⌘K hint.
 */
export interface AgentPromptProps {
  size?: 'large' | 'compact';
  value?: string;
  onChange?: (value: string) => void;
  onSubmit?: (value: string) => void;
  /** Up to 4 chips (extra items are ignored). Default on `large`: the four Início suggestions; none on `compact`. */
  suggestions?: string[];
  onSuggestion?: (s: string) => void;
  /** Default "Buscar ou perguntar" */
  placeholder?: string;
  /** compact only. Default "⌘K"; pass "" to hide. */
  shortcut?: string;
  style?: React.CSSProperties;
}
export declare const HOME_SUGGESTIONS: string[];
export declare function AgentPrompt(props: AgentPromptProps): JSX.Element;
