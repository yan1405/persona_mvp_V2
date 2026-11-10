import type { HTMLAttributes } from "react";

import { cx } from "./cx";

export type CardProps = Omit<HTMLAttributes<HTMLDivElement>, "onClick"> & {
  elevation?: "none" | "soft" | "float" | "slab";
  radius?: "sm" | "md" | "lg";
  /** Respiro interno (número; a unidade é do React). Sem valor usa o padrão do DS. */
  padding?: number;
  bordered?: boolean;
  /** Apenas o realce ao passar o mouse; ação clicável deve ser um botão/link dentro do cartão. */
  interactive?: boolean;
  as?: "div" | "section" | "article";
};

export function Card({ elevation = "soft", radius = "md", padding, bordered, interactive, as = "div", className, style, children, ...rest }: CardProps) {
  const Tag = as as "div";
  return (
    <Tag
      className={cx(
        "dx-card",
        elevation !== "soft" && "dx-card--elev-" + elevation,
        radius !== "md" && "dx-card--r-" + radius,
        bordered && "dx-card--bordered",
        interactive && "dx-card--interactive",
        className,
      )}
      style={padding != null ? { padding, ...style } : style}
      {...rest}
    >
      {children}
    </Tag>
  );
}
