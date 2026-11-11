import Link from "next/link";
import { notFound } from "next/navigation";

import { Badge, Icon, type Tone } from "@/components/ds";
import { createClient } from "@/lib/supabase/server";

import { createManualSuggestion, deleteDailyLog, generateSuggestion, rejectSuggestion } from "./actions";
import { DiaryPanel } from "./diary-panel";
import { EditDailyLogForm, PendingButton, SuggestionReviewForm } from "./diary-forms";

export type DetailQuery = { suggestion?: string; notice?: string };

type Suggestion = {
  id: string;
  origin: "ai" | "manual";
  status: "generating" | "for_review" | "confirmed" | "rejected" | "failed" | "no_suggestion";
  title: string | null;
  context: string | null;
  challenge: string | null;
  action: string | null;
  result: string | null;
  competencies: string[];
  learning: string | null;
  unsupported_fields: string[];
  error_code: string | null;
  created_at: string;
};

const noticeMessages: Record<string, string> = {
  created: "Registro salvo. Agora você pode preservar apenas o texto ou estruturar uma evidência.",
  generated: "Sugestão criada. Revise cada campo antes de confirmar.",
  "no-suggestion": "A IA não encontrou uma experiência estruturável sem inventar informações. Use o modo manual ou detalhe melhor o registro.",
  not_configured: "A estruturação por IA ainda não está configurada. O modo manual continua disponível.",
  timeout: "A IA demorou mais que o limite. Seu registro permanece salvo; tente novamente ou use o modo manual.",
  rate_limit: "O limite temporário do provedor de IA foi atingido. Tente mais tarde ou use o modo manual.",
  invalid_output: "A resposta não passou na validação. Nenhuma evidência foi criada.",
  provider_error: "O provedor de IA está indisponível. Seu registro permanece salvo e editável.",
  "generation-running": "Já existe uma estruturação em andamento para este registro.",
  "generation-failed": "Não foi possível iniciar a estruturação.",
  rejected: "Sugestão rejeitada. O registro original foi preservado.",
  "reject-failed": "Não foi possível rejeitar esta sugestão.",
  "manual-failed": "Não foi possível abrir a revisão manual.",
  "confirm-delete": "Marque a confirmação antes de excluir.",
  "delete-blocked": "Este registro sustenta uma evidência confirmada e não pode ser excluído nesta fase.",
  "delete-failed": "Não foi possível excluir o registro.",
};
const errorNotices = new Set(["generation-failed", "reject-failed", "manual-failed", "confirm-delete", "delete-blocked", "delete-failed", "timeout", "rate_limit", "invalid_output", "provider_error", "not_configured", "no-suggestion"]);

const statusLabels: Record<Suggestion["status"], { label: string; tone: Tone }> = {
  generating: { label: "Gerando", tone: "neutral" },
  for_review: { label: "Para revisar", tone: "warning" },
  confirmed: { label: "Confirmada", tone: "success" },
  rejected: { label: "Rejeitada", tone: "neutral" },
  failed: { label: "Falha", tone: "danger" },
  no_suggestion: { label: "Sem sugestão útil", tone: "neutral" },
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(`${value}T00:00:00Z`));
}

function fieldLabel(value: string) {
  return { context: "contexto", challenge: "desafio", action: "ação", result: "resultado", competencies: "competências", learning: "aprendizado" }[value] ?? value;
}

export async function DiaryDetail({ id, query }: { id: string; query: DetailQuery }) {
  const supabase = await createClient();
  const [{ data: log }, { data: rawSuggestions }, { data: evidences }] = await Promise.all([
    supabase.from("daily_logs").select("id, content, context, occurred_on, status, created_at, updated_at").eq("id", id).maybeSingle(),
    supabase
      .from("evidence_suggestions")
      .select("id, origin, status, title, context, challenge, action, result, competencies, learning, unsupported_fields, error_code, created_at")
      .eq("daily_log_id", id)
      .order("created_at", { ascending: false }),
    supabase.from("evidences").select("id, suggestion_id, title, confirmed_at").eq("source_log_id", id),
  ]);
  if (!log) notFound();

  const suggestions = (rawSuggestions ?? []) as Suggestion[];
  const selected = suggestions.find((item) => item.id === query.suggestion) ?? suggestions.find((item) => item.status === "for_review") ?? suggestions[0];
  const hasEvidence = Boolean(evidences?.length);
  const notice = query.notice ? noticeMessages[query.notice] : null;
  const noticeError = query.notice ? errorNotices.has(query.notice) : false;
  const base = `/app/diario?abrir=${id}`;

  return (
    <DiaryPanel id={id} eyebrow="Registro do Diário" title={`Registro de ${formatDate(log.occurred_on)}.`} subtitle={log.context || "Experiência sem contexto declarado"}>
      <div className="dx-dp">
        {notice && (
          <p className={`dx-page__notice ${noticeError ? "dx-page__notice--error" : "dx-page__notice--ok"}`} role="status">
            <Icon name={noticeError ? "triangle-alert" : "circle-check"} size={16} />
            {notice}
          </p>
        )}

        <section className="dx-dp__section" aria-labelledby="record-heading">
          <div className="dx-dp__head">
            <h3 className="dx-dp__h" id="record-heading">
              Editar registro.
            </h3>
            <Badge tone={log.status === "structured" ? "success" : "neutral"} icon={log.status === "structured" ? "badge-check" : "lock"}>
              {log.status === "structured" ? "Com evidência" : "Texto preservado"}
            </Badge>
          </div>
          <p className="dx-dp__text">O registro é a fonte. Sugestões ficam separadas até sua confirmação.</p>
          <EditDailyLogForm id={id} values={{ content: log.content, context: log.context, occurredOn: log.occurred_on }} />
        </section>

        <section className="dx-dp__section" aria-labelledby="suggestions-heading">
          <div className="dx-dp__head">
            <h3 className="dx-dp__h" id="suggestions-heading">
              Sugestões separadas da fonte.
            </h3>
            <span className="dx-dp__count">{suggestions.length}</span>
          </div>
          <p className="dx-dp__text">A IA propõe campos; você decide o que está sustentado pelo relato.</p>
          <div className="dx-dp__actions">
            <form action={createManualSuggestion.bind(null, id)}>
              <PendingButton pendingLabel="Abrindo…">Estruturar manualmente</PendingButton>
            </form>
            <form action={generateSuggestion.bind(null, id)}>
              <PendingButton pendingLabel="Estruturando…">Estruturar com IA</PendingButton>
            </form>
          </div>

          {!suggestions.length ? (
            <div className="dx-empty">
              <p className="dx-empty__title">Nenhuma sugestão ainda.</p>
              <p className="dx-dp__text">Use a IA ou comece manualmente. O registro original não será alterado.</p>
            </div>
          ) : (
            <>
              <ol className="dx-dp__versions" aria-label="Versões da estruturação">
                {suggestions.map((suggestion, index) => {
                  const st = statusLabels[suggestion.status];
                  return (
                    <li key={suggestion.id}>
                      <Link className="dx-dp__version" aria-current={selected?.id === suggestion.id ? "true" : undefined} href={`${base}&suggestion=${suggestion.id}`}>
                        <span className="dx-dp__version-title">
                          {String(suggestions.length - index).padStart(2, "0")} · {suggestion.title || (suggestion.origin === "manual" ? "Estrutura manual" : "Estruturação")}
                        </span>
                        <span className="dx-dp__version-meta">
                          {suggestion.origin === "ai" ? "Sugestão da IA" : "Manual"}
                          <Badge tone={st.tone}>{st.label}</Badge>
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ol>

              <div className="dx-dp__review">
                {selected?.status === "for_review" ? (
                  <>
                    <div className="dx-dp__head">
                      <h4 className="dx-dp__h dx-dp__h--sm">{selected.title || "Preencha a estrutura."}</h4>
                      <form action={rejectSuggestion.bind(null, selected.id, id)}>
                        <PendingButton variant="ghost" pendingLabel="Rejeitando…">
                          Rejeitar sugestão
                        </PendingButton>
                      </form>
                    </div>
                    <p className="dx-dp__text">{selected.origin === "ai" ? "Sugestão para revisar: a IA propôs, você decide." : "Estrutura manual."}</p>
                    {selected.unsupported_fields.length > 0 && (
                      <p className="dx-page__notice dx-page__notice--error" role="status">
                        <Icon name="triangle-alert" size={16} />
                        Sem suporte suficiente: {selected.unsupported_fields.map(fieldLabel).join(", ")}.
                      </p>
                    )}
                    <SuggestionReviewForm id={selected.id} values={selected} />
                  </>
                ) : selected?.status === "confirmed" ? (
                  <div className="dx-empty">
                    <p className="dx-empty__title">Evidência confirmada.</p>
                    <p className="dx-dp__text">Esta versão foi revisada e mantém o registro como fonte rastreável.</p>
                  </div>
                ) : selected?.status === "generating" ? (
                  <div className="dx-empty" aria-live="polite">
                    <p className="dx-empty__title">Estruturando o relato.</p>
                    <p className="dx-dp__text">Aguarde a resposta da IA. O texto original já está salvo.</p>
                  </div>
                ) : selected?.status === "no_suggestion" ? (
                  <div className="dx-empty">
                    <p className="dx-empty__title">Nenhuma sugestão útil.</p>
                    <p className="dx-dp__text">Não há informação suficiente para estruturar sem inferir fatos. Edite o registro ou use o modo manual.</p>
                  </div>
                ) : selected?.status === "failed" ? (
                  <div className="dx-empty" role="alert">
                    <p className="dx-empty__title">Estruturação não concluída.</p>
                    <p className="dx-dp__text">{noticeMessages[selected.error_code ?? "provider_error"]}</p>
                  </div>
                ) : (
                  <div className="dx-empty">
                    <p className="dx-empty__title">Sugestão rejeitada.</p>
                    <p className="dx-dp__text">Ela permanece no histórico para registrar a decisão, sem criar evidência.</p>
                  </div>
                )}
              </div>
            </>
          )}
        </section>

        <section className="dx-dp__section" aria-labelledby="delete-heading">
          <h3 className="dx-dp__h" id="delete-heading">
            Excluir registro.
          </h3>
          <p className="dx-dp__text">
            {hasEvidence
              ? "Exclusão bloqueada: uma evidência confirmada depende deste texto. A fonte precisa permanecer rastreável."
              : "Esta ação não pode ser desfeita. Sugestões ainda não confirmadas serão excluídas junto com o registro."}
          </p>
          {!hasEvidence && (
            <form action={deleteDailyLog.bind(null, id)} className="dx-dp__delete">
              <label className="dx-dp__check">
                <input name="confirmDeletion" type="checkbox" value="yes" required />
                Entendo que o registro será removido permanentemente.
              </label>
              <PendingButton pendingLabel="Excluindo…">
                Excluir registro
              </PendingButton>
            </form>
          )}
        </section>
      </div>
    </DiaryPanel>
  );
}
