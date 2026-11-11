import { cx } from "./cx";
import { Icon, type IconName } from "./icon";

export type AvatarTone = "neutral" | "indigo" | "blue" | "amber" | "green" | "rose";

export type AvatarProps = {
  name?: string;
  src?: string;
  /** Diâmetro (número; a unidade é do React). */
  size?: number;
  tone?: AvatarTone;
  variant?: "person" | "ai";
  icon?: IconName;
  status?: "online" | "away" | "offline";
  className?: string;
};

export function Avatar({ name = "", src, size = 40, tone = "neutral", variant = "person", icon, status, className }: AvatarProps) {
  const initials = name.split(" ").filter(Boolean).slice(0, 2).map((w) => w[0]).join("").toUpperCase();
  const isAi = variant === "ai";
  const dot = Math.max(8, Math.round(size * 0.26));
  return (
    <span className={cx("dx-avatar", isAi ? "dx-avatar--ai" : tone !== "neutral" && "dx-avatar--" + tone, className)} style={{ width: size, height: size }}>
      <span className="dx-avatar__face" style={{ fontSize: Math.round(size * 0.36) }}>
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element -- avatar de origem arbitrária; sem otimização de imagem
          <img src={src} alt={name} />
        ) : isAi || icon ? (
          <Icon name={icon || "sparkles"} size={Math.round(size * 0.48)} />
        ) : (
          initials
        )}
      </span>
      {status ? <span className={"dx-avatar__status dx-avatar__status--" + status} style={{ width: dot, height: dot }} role="img" aria-label={status} /> : null}
    </span>
  );
}
