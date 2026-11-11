import type { ReactNode } from "react";

import { Badge } from "./badge";
import { Button } from "./button";
import { cx } from "./cx";
import { Icon } from "./icon";

export const DRAFT_DURATIONS = { objetiva: "15–25 s", comportamental: "30–45 s", complexa: "até 60 s" } as const;
const KIND_LABEL = { objetiva: "objetiva", comportamental: "comportamental · STAR", complexa: "complexa" } as const;

export type DraftPanelProps = {
  state?: "ready" | "processing" | "gap" | "error" | "closed";
  kind?: keyof typeof DRAFT_DURATIONS;
  /** Rótulo de duração próprio (ex.: o alvo real em segundos); sem ele usa o do tipo. */
  durationLabel?: string;
  text?: string;
  sources?: string[];
  /** Controles (encurtar, aprofundar, outra experiência, copiar, salvar): formulários de servidor ou botões. */
  actions?: ReactNode;
  /** Rodapé da sessão encerrada (ex.: Duplicar sessão). */
  closedActions?: ReactNode;
  onRetry?: () => void;
  error?: string;
  className?: string;
};

// "Rascunho sugerido": apoio para a resposta, nunca para leitura literal. Sem fato registrado não há rascunho.
export function DraftPanel({ state = "ready", kind = "comportamental", durationLabel, text, sources = [], actions, closedActions, onRetry, error, className }: DraftPanelProps) {
  const ready = state === "ready";
  const closed = state === "closed";
  return (
    <section className={cx("dx-draft", className)} aria-label="Rascunho sugerido" aria-busy={state === "processing" || undefined}>
      <header className="dx-draft__head">
        <span className="dx-arg__title">
          <Icon name="pen-line" size={18} />
          Rascunho sugerido
        </span>
        <Badge tone="neutral" icon="clock">
          {durationLabel ?? DRAFT_DURATIONS[kind]} · {KIND_LABEL[kind]}
        </Badge>
      </header>

      {ready || closed ? <blockquote className="dx-draft__text">{text}</blockquote> : null}
      {state === "processing" ? (
        <p className="dx-arg__status" role="status">
          Gerando rascunho a partir dos argumentos…
        </p>
      ) : null}
      {state === "gap" ? <p className="dx-arg__text">Sem rascunho: não há evidência para sustentar esta resposta. Nada é gerado sem fato registrado.</p> : null}
      {state === "error" ? (
        <div className="dx-arg__stack" role="alert">
          <p className="dx-arg__error">
            <Icon name="triangle-alert" size={16} />
            {error || "Não foi possível gerar o rascunho. Os argumentos continuam disponíveis."}
          </p>
          {onRetry ? (
            <Button variant="outline" size="sm" icon="refresh-cw" onClick={onRetry}>
              Tentar de novo
            </Button>
          ) : null}
        </div>
      ) : null}

      {(ready || closed) && sources.length ? <span className="dx-draft__sources">Baseado em: <b>{sources.join(" · ")}</b></span> : null}

      {closed ? (
        <footer className="dx-draft__foot">
          <span className="dx-draft__closed">
            <Icon name="lock" size={14} />
            Sessão encerrada · somente leitura
          </span>
          {closedActions}
        </footer>
      ) : actions ? (
        <footer className="dx-draft__foot dx-draft__foot--col">
          <div className="dx-draft__actions">{actions}</div>
          <span className="dx-draft__note">Apoio para a sua resposta, não para leitura literal. O Persona não responde por você.</span>
        </footer>
      ) : null}
    </section>
  );
}
