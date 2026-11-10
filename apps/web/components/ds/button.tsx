import type { ButtonHTMLAttributes } from "react";

import { cx } from "./cx";
import { Icon, type IconName } from "./icon";

export type ButtonVariant = "brand" | "solid" | "outline" | "ghost" | "onFocal";
export type ButtonSize = "sm" | "md" | "lg";

const VARIANT: Record<ButtonVariant, string> = {
  brand: "dx-btn--brand",
  solid: "dx-btn--solid",
  outline: "dx-btn--outline",
  ghost: "dx-btn--ghost",
  onFocal: "dx-btn--on-focal",
};
const ICON_SIZE: Record<ButtonSize, number> = { sm: 16, md: 18, lg: 20 };

export type ButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type"> & {
  /** Quatro níveis. `brand` é o único CTA de marca da tela. */
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: IconName;
  iconRight?: IconName;
  fullWidth?: boolean;
  type?: "button" | "submit" | "reset";
};

export function Button({
  variant = "solid",
  size = "md",
  icon,
  iconRight,
  fullWidth,
  type = "button",
  className,
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cx("dx-btn", VARIANT[variant], size !== "md" && "dx-btn--" + size, fullWidth && "dx-btn--full", className)}
      {...rest}
    >
      {icon ? <Icon name={icon} size={ICON_SIZE[size]} /> : null}
      {children}
      {iconRight ? <Icon name={iconRight} size={ICON_SIZE[size]} /> : null}
    </button>
  );
}
