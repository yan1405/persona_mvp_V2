import * as React from 'react';
import type { NavDestinationId, SidebarResume } from '../navigation/Sidebar';
/**
 * Persona app shell: Sidebar + main panel (#FAFAFC, radius 28) with a sticky opaque header
 * (AppHeader: "Buscar ou perguntar" + "Agente"), Soft shadow only while scrolled, scroll-padding-top = header height.
 * AgentPanel: docked on the right and PUSHES the content (≥ 1024px container); sheet over the screen below 1024px.
 * Open/closed is remembered in localStorage ("persona.agentPanel.open").
 * Sidebar becomes the rail automatically below 1100px, or below 1280px while the agent is docked.
 * `panel` = a FloatingPanel with `contained`: it is anchored to the main panel, so it always sits LEFT of the AgentPanel.
 */
export interface AppShellProps {
  active?: NavDestinationId;
  onNavigate?: (id: NavDestinationId) => void;
  /** Page title in the header. */
  title?: string;
  children?: React.ReactNode;
  /** <FloatingPanel contained …/> — one at a time. */
  panel?: React.ReactNode;
  resume?: SidebarResume;
  onResume?: () => void;
  badges?: Partial<Record<NavDestinationId, { count: number | string; label: string }>>;
  onRegister?: () => void;
  /** Controlled agent state; omit to use the remembered state. */
  agentOpen?: boolean;
  defaultAgentOpen?: boolean;
  onAgentToggle?: (open: boolean) => void;
  agentScreen?: string;
  agentMessages?: any[];
  onAgentSend?: (text: string) => void;
  onAgentAction?: (action: string) => void;
  /** Force rail (true) or expanded (false); omit for the automatic rule. */
  sidebarCollapsed?: boolean;
  /** Default "100vh". */
  height?: number | string;
  style?: React.CSSProperties;
}
export declare function AppShell(props: AppShellProps): JSX.Element;
