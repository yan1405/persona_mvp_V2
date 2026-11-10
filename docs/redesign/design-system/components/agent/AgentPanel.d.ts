import type { MessageBubbleProps } from '../chat/MessageBubble';
import type { ComposerProps } from '../chat/Composer';
/**
 * Agente Persona docked panel (right side of internal screens): 380–420px, radius 28, Float shadow, open or collapsed (64px rail).
 * Header "Agente Persona" + "Você está em: <tela>" + accessible collapse/expand button. Content = MessageBubble list (role="log", own scroll region, keeps the latest message in view, keyboard-scrollable) + Composer. No tabs.
 * Examples without contextual chips pass composerProps={{ suggestions: [] }}.
 */
export interface AgentPanelProps {
  open?: boolean;
  onToggle?: (open: boolean) => void;
  /** Current screen, shown as "Você está em: <tela>" (e.g. "Evidências"). */
  screen?: string;
  /** Conversation; `text` becomes the bubble content. */
  messages?: Array<MessageBubbleProps & { text?: React.ReactNode }>;
  onSend?: (value: string) => void;
  /** Named action clicked in an agent message. */
  onAction?: (label: string) => void;
  /** Extra props for the inner Composer (e.g. contextual suggestions). */
  composerProps?: ComposerProps;
  /** Text shown when there are no messages yet. */
  emptyText?: string;
  style?: React.CSSProperties;
}
export declare function AgentPanel(props: AgentPanelProps): JSX.Element;
