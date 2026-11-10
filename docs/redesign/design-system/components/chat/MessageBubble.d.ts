import * as React from 'react';
/**
 * A message in the Agente Persona conversation — only inside AgentPanel (and, later, the central conversation on Início).
 * user = Ink bubble labelled "Você"; agent = white bubble labelled "Agente Persona", with cited evidence and named actions.
 */
export interface MessageBubbleProps {
  role?: 'user' | 'agent';
  time?: string;
  /** agent: animated typing dots instead of children */
  typing?: boolean;
  /** agent: evidence cited as the origin of the answer, shown as labelled chips under "Origem". */
  citations?: string[];
  onCitation?: (label: string) => void;
  /** agent: contextual named actions (never all by default). "Revisar sugestões" only when suggestions are pending; "Abrir no Persona Live" only for preparation/interview; "Criar Artefato" only when the request involves professional material. */
  actions?: string[];
  onAction?: (label: string) => void;
  showAvatar?: boolean;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}
export declare function MessageBubble(props: MessageBubbleProps): JSX.Element;
