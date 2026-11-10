import type { ButtonHTMLAttributes } from "react";

import { cx } from "./cx";
import { Icon, type IconName } from "./icon";

export type IconButtonVariant = "ghost" | "outline" | "soft" | "solid" | "brand";

export type IconButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type" | "aria-label"> & {
  icon: IconName;
  /** Nome acessível (obrigatório): vira aria-label e title. */
  label: string;
  variant?: IconButtonVariant;
  /** Lado do botão (número; a unidade é do React). */
  size?: number;
  /** Contador no canto. */
  badge?: number | string;
  /** Ponto de aviso (nunca sozinho: o rótulo deve dizer o que mudou). */
  dot?: boolean;
  active?: boolean;
};

export function IconButton({
  icon,
  label,
  variant = "ghost",
  size = 40,
  badge,
  dot,
  active,
  className,
  style,
  ...rest
}: IconButtonProps) {
  const iconSize = size <= 32 ? 16 : size <= 40 ? 18 : 20;
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={cx("dx-iconbtn", "dx-iconbtn--" + variant, active && "is-active", className)}
      style={{ width: size, height: size, ...style }}
      {...rest}
    >
      <Icon name={icon} size={iconSize} />
      {badge != null ? <span className="dx-iconbtn__count">{badge}</span> : null}
      {dot ? <span className="dx-iconbtn__dot" aria-hidden="true" /> : null}
    </button>
  );
}
