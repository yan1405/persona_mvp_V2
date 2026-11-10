/**
 * LEGADO — será removido na T6.2. Não é navegação do produto e não deve receber usos novos.
 * Pill filter tabs (WAI-ARIA tabs: roving tabindex, ←/→/Home/End); active pill is ink-filled.
 */
export interface PillTabsItem { id?: string; label: string; count?: number }
export interface PillTabsProps {
  items: PillTabsItem[];
  value?: string;
  onChange?: (id: string) => void;
  size?: 'sm' | 'md';
  /** Accessible name of the tablist. Default "Filtros". */
  label?: string;
  style?: React.CSSProperties;
}
export declare function PillTabs(props: PillTabsProps): JSX.Element;
