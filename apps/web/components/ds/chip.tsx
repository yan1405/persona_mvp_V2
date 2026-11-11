import type { ButtonHTMLAttributes, ReactNode } from "react";

import { STATUSES, type StatusKey } from "./badge";
import { cx } from "./cx";
import { Icon, type IconName } from "./icon";

export type ChipProps = {
  status?: StatusKey;
  icon?: IconName | null;
  tone?: "neutral" | "success" | "brand";
  selected?: boolean;
  size?: "sm" | "md";
  children?: ReactNode;
  className?: string;
} & Pick<ButtonHTMLAttributes<HTMLButtonElement>, "onClick" | "disabled" | "id">;

/** Rótulo; vira botão (aria-pressed) quando recebe `onClick`. */
export function Chip({ status, icon, tone = "neutral", selected, size = "md", onClick, disabled, id, children, className }: ChipProps) {
  const st = status ? STATUSES[status] : null;
  const ic = icon !== undefined ? icon : st ? st.icon : null;
  const cls = cx(
    "dx-chip",
    size === "sm" && "dx-chip--sm",
    st && "dx-chip--status dx-chip--status-" + st.tone,
    !st && tone !== "neutral" && "dx-chip--tone-" + tone,
    selected && "is-selected",
    className,
  );
  const inner = (
    <>
      {ic ? <Icon name={ic} size={size === "sm" ? 14 : 15} className="dx-chip__icon" /> : null}
      {children != null ? children : st ? st.label : null}
    </>
  );
  if (onClick) {
    return (
      <button type="button" id={id} className={cls} onClick={onClick} disabled={disabled} aria-pressed={selected != null ? !!selected : undefined}>
        {inner}
      </button>
    );
  }
  return (
    <span id={id} className={cls}>
      {inner}
    </span>
  );
}
