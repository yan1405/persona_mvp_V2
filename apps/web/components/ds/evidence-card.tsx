import Link from "next/link";
import { useId } from "react";

import { Badge } from "./badge";
import { Button, type ButtonVariant } from "./button";
import { Chip } from "./chip";
import { cx } from "./cx";
import { Icon } from "./icon";

export type EvidenceLevel = "Documentada" | "Registrada";

type Common = {
  title: string;
  competencies?: string[];
  level?: EvidenceLevel;
  proofCount?: number;
  origin?: string;
  updatedAt?: string;
  className?: string;
};

export type EvidenceCardProps =
  | (Common & { variant?: "grid"; onOpen?: () => void; /** Rota de detalhe: o cartão vira link. */ href?: string })
  | (Common & { variant: "suggestion"; onConfirm?: () => void; onDiscard?: () => void; confirmVariant?: ButtonVariant })
  | (Common & { variant: "selectable"; reason?: string; selected?: boolean; onSelectedChange?: (value: boolean) => void; disabled?: boolean });

function LevelBadge({ level }: { level?: EvidenceLevel }) {
  return level === "Documentada" ? (
    <Badge tone="success" icon="badge-check">
      Documentada
    </Badge>
  ) : (
    <Badge tone="neutral" icon="circle-check">
      {level || "Registrada"}
    </Badge>
  );
}

const proofText = (n?: number) => (n === 1 ? "1 link de prova" : (n || 0) + " links de prova");

function Meta({ origin, updatedAt, proofCount }: Pick<Common, "origin" | "updatedAt" | "proofCount">) {
  return (
    <div className="dx-meta">
      <span className="dx-meta__item">
        <Icon name="link" size={13} />
        {proofText(proofCount)}
      </span>
      <span className="dx-meta__item">
        <Icon name={origin === "Manual" ? "pen-line" : "notebook-pen"} size={13} />
        {origin ? "Origem: " + origin : "Origem não informada"}
      </span>
      {updatedAt ? (
        <span className="dx-meta__item">
          <Icon name="calendar" size={13} />
          {"Atualizada " + updatedAt}
        </span>
      ) : null}
    </div>
  );
}

function Competencies({ list, emptyText }: { list?: string[]; emptyText: string }) {
  if (!list || !list.length) return <span className="dx-card-note">{emptyText}</span>;
  return (
    <div className="dx-chips">
      {list.map((c) => (
        <Chip key={c} size="sm">
          {c}
        </Chip>
      ))}
    </div>
  );
}

function Selectable(p: Common & { reason?: string; selected?: boolean; onSelectedChange?: (value: boolean) => void; disabled?: boolean }) {
  const id = useId();
  return (
    <label htmlFor={id} className={cx("dx-ev", "dx-ev--selectable", p.selected && "is-selected", p.disabled && "is-disabled", p.className)}>
      <span className="dx-check">
        <input
          id={id}
          className="dx-check__input"
          type="checkbox"
          checked={!!p.selected}
          disabled={p.disabled}
          onChange={(e) => p.onSelectedChange?.(e.target.checked)}
        />
        <span className="dx-check__box" aria-hidden="true">
          <Icon name="check" size={15} />
        </span>
      </span>
      <span className="dx-ev__body">
        <span className="dx-card-top">
          <LevelBadge level={p.level} />
          <span className="dx-ev__state">{p.selected ? "Selecionada" : "Não selecionada"}</span>
        </span>
        <span className="dx-card-title">{p.title}</span>
        <Competencies list={p.competencies} emptyText="Nenhuma competência registrada." />
        <span className="dx-ev__reason">
          <span className="dx-ev__label">Motivo da recomendação</span>
          <span className="dx-ev__reason-text">{p.reason || "Motivo não informado."}</span>
        </span>
        <Meta origin={p.origin} updatedAt={p.updatedAt} proofCount={p.proofCount} />
      </span>
    </label>
  );
}

export function EvidenceCard(props: EvidenceCardProps) {
  if (props.variant === "suggestion") {
    const { title, competencies, level = "Registrada", proofCount, origin, updatedAt, onConfirm, onDiscard, confirmVariant = "solid", className } = props;
    return (
      <article className={cx("dx-ev", "dx-ev--suggestion", className)}>
        <div className="dx-card-top">
          <Badge tone="warning" icon="sparkles">
            Para revisar
          </Badge>
          <span className="dx-ev__hint">Sugerida pela IA · nada é salvo sem sua confirmação</span>
        </div>
        <h3 className="dx-card-title">{title}</h3>
        <div className="dx-ev__stack">
          <span className="dx-ev__label">Competências sugeridas</span>
          <Competencies list={competencies} emptyText="A IA ainda não sugeriu competências. Você pode adicioná-las ao revisar." />
        </div>
        <div className="dx-ev__level">
          <span>Nível ao confirmar:</span>
          <LevelBadge level={level} />
        </div>
        <Meta origin={origin} updatedAt={updatedAt} proofCount={proofCount} />
        <div className="dx-ev__actions">
          <Button variant={confirmVariant} size="sm" icon="check" onClick={onConfirm}>
            Confirmar evidência
          </Button>
          <Button variant="ghost" size="sm" icon="x" onClick={onDiscard}>
            Descartar
          </Button>
        </div>
      </article>
    );
  }
  if (props.variant === "selectable") return <Selectable {...props} />;
  const { title, competencies, level, proofCount, origin, updatedAt, onOpen, href, className } = props;
  const inner = (
    <>
      <span className="dx-card-top">
        <LevelBadge level={level} />
        {onOpen || href ? <Icon name="arrow-up-right" size={18} /> : null}
      </span>
      {onOpen || href ? <span className="dx-card-title">{title}</span> : <h3 className="dx-card-title">{title}</h3>}
      <Competencies list={competencies} emptyText="Nenhuma competência registrada." />
      <span className="dx-card-rule">
        <Meta origin={origin} updatedAt={updatedAt} proofCount={proofCount} />
      </span>
    </>
  );
  if (href) {
    return (
      <Link href={href} className={cx("dx-ev", className)} aria-label={"Abrir evidência: " + title}>
        {inner}
      </Link>
    );
  }
  return onOpen ? (
    <button type="button" className={cx("dx-ev", className)} onClick={onOpen}>
      {inner}
    </button>
  ) : (
    <article className={cx("dx-ev", className)}>{inner}</article>
  );
}
