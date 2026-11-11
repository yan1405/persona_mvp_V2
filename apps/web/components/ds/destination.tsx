import Link from "next/link";
import { Children, type ButtonHTMLAttributes, type ReactNode } from "react";

import { cx } from "./cx";
import { Icon, type IconName } from "./icon";

/** 4 colunas com o contêiner >= 900 px, senão 2 × 2; o último cartão ímpar ocupa a linha (nunca fica órfão). */
export function DestinationGrid({ children, className }: { children: ReactNode; className?: string }) {
  const items = Children.toArray(children).filter(Boolean);
  return (
    <div className={cx("dx-dgrid", className)}>
      <ul className="dx-dgrid__list">
        {items.map((child, i) => (
          <li key={i} className="dx-dgrid__item">
            {child}
          </li>
        ))}
      </ul>
    </div>
  );
}

export type TileTone = "indigo" | "blue" | "amber" | "green" | "rose" | "slate";

export type DestinationTileProps = {
  tone?: TileTone;
  title: string;
  status: string;
  meta?: string;
  icon?: IconName;
  /** Com `href` o cartão é um link; sem ele, um botão. */
  href?: string;
  className?: string;
} & Pick<ButtonHTMLAttributes<HTMLButtonElement>, "onClick">;

export function DestinationTile({ tone = "indigo", title, status, meta, icon, href, onClick, className }: DestinationTileProps) {
  const cls = cx("dx-tile", tone !== "indigo" && "dx-tile--" + tone, className);
  const inner = (
    <>
      <span className="dx-tile__top">
        {icon ? (
          <span className="dx-tile__icon">
            <Icon name={icon} size={20} />
          </span>
        ) : (
          <span />
        )}
        <span className="dx-tile__arrow">
          <Icon name="arrow-up-right" size={14} />
        </span>
      </span>
      <span className="dx-tile__text">
        <span className="dx-tile__title">{title}</span>
        <span className="dx-tile__status" title={status}>
          {status}
        </span>
        <span className="dx-tile__meta" title={meta || undefined} aria-hidden={meta ? undefined : true}>
          {meta || " "}
        </span>
      </span>
    </>
  );
  if (href) {
    return (
      <Link href={href} className={cls}>
        {inner}
      </Link>
    );
  }
  return (
    <button type="button" className={cls} onClick={onClick}>
      {inner}
    </button>
  );
}
