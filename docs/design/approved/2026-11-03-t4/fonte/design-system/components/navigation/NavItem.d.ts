/** Sidebar row: outline Lucide icon + label; active = #ECEAFB pill, indigo icon, aria-current="page". 44px hit target. */
export interface NavItemProps {
  /** Lucide icon name */
  icon: string;
  label: string;
  active?: boolean;
  /** Short Ink count, e.g. 2. In rail mode it becomes an Ink dot (meaning kept in aria-label). */
  badge?: string | number;
  /** Accessible meaning of the badge, e.g. "2 sugestões para revisar". */
  badgeLabel?: string;
  /** Icon-only rail mode (label becomes tooltip + aria-label). */
  collapsed?: boolean;
  onClick?: () => void;
  /** Forces the double focus ring — inner 2px #A78BFA + outer 2px #6D28D9 (specimens). */
  focused?: boolean;
  style?: React.CSSProperties;
}
export declare function NavItem(props: NavItemProps): JSX.Element;
