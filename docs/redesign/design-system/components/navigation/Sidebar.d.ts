/**
 * App sidebar: Persona mark, "Registrar agora" (Ink → Diário), the five destinations,
 * "Continue de onde parou" (last registro with pending suggestions, outline button) and Configurações isolated in the footer.
 * `collapsed` = 76px icon rail.
 */
export type NavDestinationId = 'inicio' | 'diario' | 'evidencias' | 'live' | 'artefatos' | 'configuracoes';
export interface SidebarResume {
  /** e.g. "Registro de ontem" */
  title: string;
  /** e.g. "2 sugestões para revisar" */
  meta: string;
  /** Outline button label. Default "Revisar sugestões". */
  action?: string;
}
export interface SidebarProps {
  active?: NavDestinationId;
  onNavigate?: (id: NavDestinationId) => void;
  collapsed?: boolean;
  onToggle?: (collapsed: boolean) => void;
  /** Default: navigates to "diario". */
  onRegister?: () => void;
  /** Omit when there is nothing pending — the block is hidden, never empty. */
  resume?: SidebarResume;
  onResume?: () => void;
  badges?: Partial<Record<NavDestinationId, { count: number | string; label: string }>>;
  style?: React.CSSProperties;
}
export declare const NAV_DESTINATIONS: { id: NavDestinationId; icon: string; label: string }[];
export declare const NAV_SETTINGS: { id: 'configuracoes'; icon: string; label: string };
export declare function Sidebar(props: SidebarProps): JSX.Element;
