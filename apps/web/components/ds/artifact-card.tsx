import Link from "next/link";

import { Badge, type StatusKey } from "./badge";
import { cx } from "./cx";
import { Icon, type IconName } from "./icon";

export type ArtifactType = "star" | "pitch" | "curriculo" | "portfolio";

export const ARTIFACT_TYPES: Record<ArtifactType, { label: string; icon: IconName; tint: string }> = {
  star: { label: "Resposta STAR", icon: "list-checks", tint: "" },
  pitch: { label: "Pitch pessoal", icon: "quote", tint: "dx-art--blue" },
  curriculo: { label: "Currículo ATS", icon: "file-text", tint: "dx-art--green" },
  portfolio: { label: "Portfólio por casos", icon: "layers", tint: "dx-art--amber" },
};

export type ArtifactCardProps = {
  type?: ArtifactType;
  title?: string;
  objective?: string;
  status?: StatusKey;
  updated?: string;
  sources?: string[];
  onOpen?: () => void;
  /** Rota de detalhe: o cartão vira link. */
  href?: string;
  disabled?: boolean;
  disabledText?: string;
  error?: string;
  className?: string;
};

export function ArtifactCard({ type = "star", title, objective, status = "rascunho", updated, sources = [], onOpen, href, disabled, disabledText = "Gerando rascunho…", error, className }: ArtifactCardProps) {
  const t = ARTIFACT_TYPES[type] || ARTIFACT_TYPES.star;
  const interactive = !!onOpen && !disabled;
  const cls = cx("dx-art", t.tint, disabled && "dx-art--disabled", error && "dx-art--error", className);
  const inner = (
    <>
      <span className="dx-card-top">
        <span className="dx-art__kind">
          <span className="dx-art__icon">
            <Icon name={t.icon} size={18} />
          </span>
          {t.label}
        </span>
        {disabled ? (
          <Badge tone="neutral" icon="clock">
            {disabledText}
          </Badge>
        ) : (
          <Badge status={status} />
        )}
      </span>
      <span className="dx-art__title">{title || t.label}</span>
      <span className={cx("dx-art__obj", !objective && "is-empty")}>{objective ? "Objetivo: " + objective : "Objetivo não informado."}</span>
      <span className="dx-art__sources">
        <Icon name="link" size={14} />
        Fontes
        {sources.length ? <span className="dx-art__src">{sources.join(" · ")}</span> : <span className="dx-art__src is-warning">Nenhuma evidência citada</span>}
        {updated ? <span className="dx-art__updated">{updated}</span> : null}
      </span>
      {error ? (
        <span className="dx-art__error" role="alert">
          <Icon name="triangle-alert" size={14} />
          {error}
        </span>
      ) : null}
    </>
  );
  if (href && !disabled) {
    return (
      <Link href={href} className={cls} aria-label={"Abrir " + t.label + ": " + (title || "sem título")}>
        {inner}
      </Link>
    );
  }
  return interactive ? (
    <button type="button" className={cls} onClick={onOpen} aria-label={"Abrir " + t.label + ": " + (title || "sem título")}>
      {inner}
    </button>
  ) : (
    <article className={cls}>
      {inner}
    </article>
  );
}
