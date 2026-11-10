import { cx } from "./cx";

// Geometria copiada de assets/logos/persona-lockup-h.svg e persona-logo-compacta.svg do DS, sem metadados;
// as cores vêm dos tokens via CSS (classes dx-logo__*).
const MARK_NODES: Array<[number, number]> = [
  [32, 30],
  [92, 42],
  [34, 92],
  [98, 88],
];

export type LogoProps = {
  /** `lockup` = marca + "Persona"; `mark` = só a marca. */
  variant?: "lockup" | "mark";
  /** Altura (número; a largura acompanha a proporção). */
  height?: number;
  /** Texto para leitores de tela; vazio deixa a imagem decorativa. */
  title?: string;
  className?: string;
};

export function Logo({ variant = "lockup", height = 32, title = "Persona", className }: LogoProps) {
  const lockup = variant === "lockup";
  const aria = title ? { role: "img" as const, "aria-label": title } : { "aria-hidden": true as const };
  if (!lockup) {
    return (
      <svg className={cx("dx-logo", className)} style={{ height }} viewBox="0 0 120 120" {...aria}>
        {MARK_NODES.map(([x, y], i) => (
          <line key={"l" + i} className="dx-logo__line" x1={x} y1={y} x2={60} y2={60} strokeWidth={11} />
        ))}
        {MARK_NODES.map(([x, y], i) => (
          <circle key={"c" + i} className="dx-logo__node" cx={x} cy={y} r={14} />
        ))}
        <circle className="dx-logo__core" cx={60} cy={60} r={22} />
      </svg>
    );
  }
  return (
    <svg className={cx("dx-logo", className)} style={{ height }} viewBox="0 0 320 80" {...aria}>
      <g transform="translate(8, 8) scale(0.533)">
        {MARK_NODES.map(([x, y], i) => (
          <line key={"l" + i} className="dx-logo__line" x1={x} y1={y} x2={60} y2={60} strokeWidth={2.5} />
        ))}
        {MARK_NODES.map(([x, y], i) => (
          <circle key={"c" + i} className="dx-logo__node" cx={x} cy={y} r={6} />
        ))}
        <circle className="dx-logo__core" cx={60} cy={60} r={13} />
        <circle className="dx-logo__eye" cx={60} cy={60} r={5} />
      </g>
      <text className="dx-logo__word" x={80} y={53} fontSize={36}>
        Persona
      </text>
    </svg>
  );
}
