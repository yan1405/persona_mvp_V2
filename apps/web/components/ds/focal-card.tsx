import type { HTMLAttributes } from "react";

import { cx } from "./cx";

export type FocalCardProps = HTMLAttributes<HTMLDivElement> & {
  /** Respiro interno (número). Padrão do DS: 28. */
  padding?: number;
};

/** O único bloco escuro da tela: use no máximo um FocalCard por tela. */
export function FocalCard({ padding, className, style, children, ...rest }: FocalCardProps) {
  return (
    <div className={cx("dx-focal", className)} style={padding != null ? { padding, ...style } : style} {...rest}>
      <div className="dx-focal__body">{children}</div>
    </div>
  );
}
