import Link from "next/link";

import { cx } from "./cx";
import { Icon, type IconName } from "./icon";

export type NavItemProps = {
  icon: IconName;
  label: string;
  active?: boolean;
  /** Contador de pendências. No trilho vira um ponto; o nome acessível continua completo. */
  badge?: number | string;
  badgeLabel?: string;
  /** Com `href` é um link (navegação do Next); sem ele, um botão. */
  href?: string;
  onClick?: () => void;
  className?: string;
};

export function NavItem({ icon, label, active, badge, badgeLabel, href, onClick, className }: NavItemProps) {
  const inner = (
    <>
      <Icon name={icon} size={18} />
      <span className="dx-nav__label">{label}</span>
      {badge != null ? (
        <span className="dx-nav__count">
          <span aria-hidden="true">{badge}</span>
          <span className="dx-sr">{", " + (badgeLabel || badge)}</span>
        </span>
      ) : null}
    </>
  );
  const cls = cx("dx-nav", className);
  const current = active ? ("page" as const) : undefined;
  if (href) {
    return (
      <Link href={href} className={cls} aria-current={current} title={label} onClick={onClick}>
        {inner}
      </Link>
    );
  }
  return (
    <button type="button" className={cls} aria-current={current} title={label} onClick={onClick}>
      {inner}
    </button>
  );
}
