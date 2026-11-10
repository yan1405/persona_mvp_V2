/**
 * Main-panel header: AgentPrompt compact ("Buscar ou perguntar", ⌘K) + IconButton "Agente" that opens/closes the AgentPanel.
 */
export interface AppHeaderProps {
  /** Optional page title on the left. */
  title?: string;
  agentOpen?: boolean;
  onAgentToggle?: (open: boolean) => void;
  searchValue?: string;
  onSearchChange?: (v: string) => void;
  onSearch?: (v: string) => void;
  style?: React.CSSProperties;
}
export declare function AppHeader(props: AppHeaderProps): JSX.Element;
