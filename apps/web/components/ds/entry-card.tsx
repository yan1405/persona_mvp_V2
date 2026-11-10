import { Badge, type StatusKey } from "./badge";
import { cx } from "./cx";
import { Icon, type IconName } from "./icon";

export type EntryKind = "registro" | "sessao" | "versao";

const KIND: Record<EntryKind, { icon: IconName; label: string }> = {
  registro: { icon: "notebook-pen", label: "Registro do Diário" },
  sessao: { icon: "mic", label: "Sessão do Persona Live" },
  versao: { icon: "history", label: "Versão de Artefato" },
};

export type EntryCardProps = {
  kind?: EntryKind;
  date?: string;
  title?: string;
  meta?: string;
  /** Estado do produto (selo com ícone e rótulo). */
  status?: StatusKey;
  /** Rótulo livre do selo, ou texto do estado quando `status` não é usado. */
  statusLabel?: string;
  statusIcon?: IconName;
  onOpen?: () => void;
  /** Verbo do nome acessível do botão (padrão "Abrir"). */
  openLabel?: string;
  className?: string;
};

export function EntryCard({ kind = "registro", date, title, meta, status, statusLabel, statusIcon, onOpen, openLabel, className }: EntryCardProps) {
  const k = KIND[kind] || KIND.registro;
  const badge = status ? <Badge status={status}>{statusLabel}</Badge> : statusLabel ? <Badge tone="neutral" icon={statusIcon || null}>{statusLabel}</Badge> : null;
  const inner = (
    <>
      <span className="dx-card-top">
        <span className="dx-entry__kind">
          <span className="dx-entry__icon">
            <Icon name={k.icon} size={16} />
          </span>
          <span className="dx-entry__kind-text">
            <b>{k.label}</b>
            {date ? <span>{date}</span> : null}
          </span>
        </span>
        {onOpen ? <Icon name="arrow-up-right" size={18} /> : null}
      </span>
      <span className="dx-card-title">{title || "Sem título"}</span>
      <span className={cx("dx-entry__meta", !meta && "is-empty")}>{meta || "Sem detalhes registrados."}</span>
      {badge ? <span className="dx-card-rule">{badge}</span> : null}
    </>
  );
  return onOpen ? (
    <button type="button" className={cx("dx-entry", className)} onClick={onOpen} aria-label={(openLabel || "Abrir") + ": " + (title || k.label)}>
      {inner}
    </button>
  ) : (
    <article className={cx("dx-entry", className)}>{inner}</article>
  );
}
