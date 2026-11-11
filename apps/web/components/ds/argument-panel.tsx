import type { ReactNode } from "react";

import { Badge, type StatusKey } from "./badge";
import { Button, ButtonLink } from "./button";
import { Chip } from "./chip";
import { cx } from "./cx";
import { Icon } from "./icon";

export type ArgumentItem = {
  fact: string;
  action?: string;
  result?: string;
  competencies?: string[];
  /** Origem rastreável (título da evidência e campo). */
  source: string;
  /** Trecho do relato que sustenta o fato. */
  excerpt?: string;
  level?: StatusKey;
};

export type ArgumentPanelProps = {
  state?: "sustained" | "processing" | "gap" | "error" | "closed";
  question?: string;
  items?: ArgumentItem[];
  /** "Não afirme": o que o repertório não sustenta. */
  avoid?: string;
  /** Lacuna: o que falta registrar. */
  missing?: string[];
  /** Mensagem da lacuna sugerida pelo sistema (sem número, sem invenção). */
  gapNote?: string;
  /** Lacuna: link para registrar no Diário. */
  registerHref?: string;
  onRetry?: () => void;
  error?: string;
  className?: string;
};

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <span className="dx-arg__field">
      <span className="dx-arg__label">{label}</span>
      {children}
    </span>
  );
}

// "Argumentos reais": só fatos que a pessoa registrou, cada um com a origem. Lacuna aparece como lacuna.
export function ArgumentPanel({ state = "sustained", question, items = [], avoid, missing = [], gapNote, registerHref, onRetry, error, className }: ArgumentPanelProps) {
  const closed = state === "closed";
  return (
    <section className={cx("dx-arg", className)} aria-label="Argumentos reais" aria-busy={state === "processing" || undefined}>
      <header className="dx-arg__head">
        <span className="dx-arg__title">
          <Icon name="list-checks" size={18} />
          Argumentos reais
        </span>
        {state === "gap" ? <Badge status="lacuna" /> : closed ? <Badge tone="neutral" icon="lock">Somente leitura</Badge> : null}
      </header>
      {question ? <p className="dx-arg__question">Pergunta: “{question}”</p> : null}

      {state === "processing" ? (
        <p className="dx-arg__status" role="status">
          Buscando fatos nas evidências autorizadas…
        </p>
      ) : null}

      {state === "error" ? (
        <div className="dx-arg__stack" role="alert">
          <p className="dx-arg__error">
            <Icon name="triangle-alert" size={16} />
            {error || "Não foi possível montar os argumentos agora. Sua pergunta continua aqui."}
          </p>
          {onRetry ? (
            <Button variant="outline" size="sm" icon="refresh-cw" onClick={onRetry}>
              Tentar de novo
            </Button>
          ) : null}
        </div>
      ) : null}

      {state === "gap" ? (
        <div className="dx-arg__stack">
          <p className="dx-arg__lead">Ainda não há evidência para sustentar esta resposta.</p>
          {missing.length ? (
            <Field label="O que falta registrar">
              <ul className="dx-arg__list">
                {missing.map((m) => (
                  <li key={m}>{m}</li>
                ))}
              </ul>
            </Field>
          ) : null}
          {gapNote ? <p className="dx-arg__text">{gapNote}</p> : null}
          {registerHref ? (
            <ButtonLink variant="solid" size="sm" icon="notebook-pen" href={registerHref}>
              Registrar no Diário
            </ButtonLink>
          ) : null}
        </div>
      ) : null}

      {state === "sustained" || closed
        ? items.map((it, i) => (
            <article key={i} className="dx-arg__item">
              <Field label="Fato">
                <span className="dx-arg__fact">{it.fact}</span>
              </Field>
              {it.action ? (
                <Field label="Ação">
                  <span className="dx-arg__text">{it.action}</span>
                </Field>
              ) : null}
              {it.result ? (
                <Field label="Resultado">
                  <span className="dx-arg__text">{it.result}</span>
                </Field>
              ) : null}
              {it.competencies?.length ? (
                <span className="dx-arg__chips">
                  <span className="dx-arg__label">Competências</span>
                  {it.competencies.map((c) => (
                    <Chip key={c} size="sm">
                      {c}
                    </Chip>
                  ))}
                </span>
              ) : null}
              <span className="dx-arg__chips">
                <span className="dx-arg__label">Origem</span>
                <span className="dx-arg__source">
                  <Icon name="link" size={14} />
                  {it.source}
                </span>
                {it.level ? <Badge status={it.level} /> : null}
              </span>
              {it.excerpt ? <q className="dx-arg__quote">{it.excerpt}</q> : null}
            </article>
          ))
        : null}

      {(state === "sustained" || closed) && avoid ? (
        <p className="dx-arg__avoid">
          <Icon name="triangle-alert" size={16} />
          <span>
            <b>Não afirme:</b> {avoid}
          </span>
        </p>
      ) : null}
    </section>
  );
}
