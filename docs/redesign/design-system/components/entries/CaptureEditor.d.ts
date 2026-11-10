/**
 * Diário capture editor: "O que aconteceu hoje?", free text (40–2.000 characters), optional date and context, brand "Salvar registro".
 * A personal log editor — not a chat. The person's text is never replaced by the AI.
 */
export interface CaptureEditorProps {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  /** yyyy-mm-dd */
  date?: string;
  onDateChange?: (date: string) => void;
  context?: string;
  onContextChange?: (context: string) => void;
  /** Called only when 40 ≤ length ≤ 2.000. */
  onSave?: (entry: { text: string; date: string; context: string }) => void;
  saving?: boolean;
  disabled?: boolean;
  /** Error message (e.g. save failed). Red border + message; blocks saving. */
  error?: string;
  /** Forces the focus ring on the text area (documentation of the focus state). */
  focused?: boolean;
  style?: React.CSSProperties;
}
export declare const MIN_CHARS: 40;
export declare const MAX_CHARS: 2000;
export declare function CaptureEditor(props: CaptureEditorProps): JSX.Element;
