import type { ReactNode } from "react";

import { cx } from "./cx";
import { Icon, type IconName } from "./icon";

export type Tone = "neutral" | "brand" | "success" | "warning" | "danger" | "info" | "ink";
export type StatusKey = "registrada" | "documentada" | "para-revisar" | "rascunho" | "revisado" | "lacuna";

// Estados do produto: o rótulo sempre aparece (nunca só cor).
export const STATUSES: Record<StatusKey, { tone: "neutral" | "success" | "warning"; icon: IconName; label: string }> = {
  registrada: { tone: "neutral", icon: "circle-check", label: "Registrada" },
  documentada: { tone: "success", icon: "badge-check", label: "Documentada" },
  "para-revisar": { tone: "warning", icon: "sparkles", label: "Para revisar" },
  rascunho: { tone: "neutral", icon: "pencil", label: "Rascunho" },
  revisado: { tone: "success", icon: "check-check", label: "Revisado" },
  lacuna: { tone: "warning", icon: "triangle-alert", label: "Lacuna" },
};

export type BadgeProps = {
  status?: StatusKey;
  tone?: Tone;
  dot?: boolean;
  /** `null` remove o ícone do estado. */
  icon?: IconName | null;
  children?: ReactNode;
  className?: string;
};

export function Badge({ status, tone, dot, icon, children, className }: BadgeProps) {
  const st = status ? STATUSES[status] : null;
  const ic = icon !== undefined ? icon : st ? st.icon : null;
  return (
    <span className={cx("dx-badge", "dx-badge--" + ((st && st.tone) || tone || "neutral"), className)}>
      {dot ? <span className="dx-badge__dot" aria-hidden="true" /> : null}
      {ic ? <Icon name={ic} size={13} /> : null}
      {children != null ? children : st ? st.label : null}
    </span>
  );
}

export type CountProps = { tone?: Tone; children: ReactNode; className?: string };

/** Contador numérico (variante `count` do Badge no DS). */
export function Count({ tone = "brand", children, className }: CountProps) {
  return <span className={cx("dx-count", tone !== "brand" && tone !== "neutral" && "dx-count--" + tone, className)}>{children}</span>;
}
