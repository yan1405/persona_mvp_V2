import Link from "next/link";
import { notFound } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

import {
  createManualSuggestion,
  deleteDailyLog,
  generateSuggestion,
  rejectSuggestion,
} from "../actions";
import {
  EditDailyLogForm,
  PendingButton,
  SuggestionReviewForm,
} from "../diary-forms";

type DetailSearchParams = {
  tab?: string;
  suggestion?: string;
  notice?: string;
};

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
  "not_configured": "A estruturação por IA ainda não está configurada. O modo manual continua disponível.",
  timeout: "A Groq demorou mais que o limite. Seu registro permanece salvo; tente novamente ou use o modo manual.",
  rate_limit: "O limite temporário da Groq foi atingido. Tente mais tarde ou use o modo manual.",
  invalid_output: "A resposta não passou na validação. Nenhuma evidência foi criada.",
  provider_error: "A Groq está indisponível. Seu registro permanece salvo e editável.",
  "generation-running": "Já existe uma estruturação em andamento para este registro.",
  "generation-failed": "Não foi possível iniciar a estruturação.",
  rejected: "Sugestão rejeitada. O registro original foi preservado.",
  "reject-failed": "Não foi possível rejeitar esta sugestão.",
  "manual-failed": "Não foi possível abrir a revisão manual.",
  "confirm-delete": "Marque a confirmação antes de excluir.",
  "delete-blocked": "Este registro sustenta uma evidência confirmada e não pode ser excluído nesta fase.",
  "delete-failed": "Não foi possível excluir o registro.",
};

const statusLabels: Record<Suggestion["status"], string> = {
  generating: "Gerando",
  for_review: "Para revisar",
  confirmed: "Confirmada",
  rejected: "Rejeitada",
  failed: "Falha",
  no_suggestion: "Sem sugestão útil",
};

export default async function DiaryDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<DetailSearchParams>;
}) {
  const [{ id }, query] = await Promise.all([params, searchParams]);
  const tab = query.tab === "sugestoes" ? "sugestoes" : "registro";
  const supabase = await createClient();
  const [{ data: log }, { data: rawSuggestions }, { data: evidences }] = await Promise.all([
    supabase
      .from("daily_logs")
      .select("id, content, context, occurred_on, status, created_at, updated_at")
      .eq("id", id)
      .maybeSingle(),
    supabase
      .from("evidence_suggestions")
      .select("id, origin, status, title, context, challenge, action, result, competencies, learning, unsupported_fields, error_code, created_at")
      .eq("daily_log_id", id)
      .order("created_at", { ascending: false }),
    supabase
      .from("evidences")
      .select("id, suggestion_id, title, confirmed_at")
      .eq("source_log_id", id),
  ]);

  if (!log) notFound();

  const suggestions = (rawSuggestions ?? []) as Suggestion[];
  const selected = suggestions.find((item) => item.id === query.suggestion)
    ?? suggestions.find((item) => item.status === "for_review")
    ?? suggestions[0];
  const hasEvidence = Boolean(evidences?.length);
  const notice = query.notice ? noticeMessages[query.notice] : null;

  return (
    <main className="app-page diary-detail-page">
      <div className="detail-breadcrumb">
        <Link href="/app/diario">Diário</Link>
        <span aria-hidden>/</span>
        <span>Registro de {formatDate(log.occurred_on)}</span>
      </div>

      <header className="detail-heading">
        <div>
          <p className="eyebrow">Daily Log</p>
          <h1>{log.context || "Experiência sem contexto declarado"}</h1>
          <p>O registro é a fonte. Sugestões ficam separadas até sua confirmação.</p>
        </div>
        <div className="trace-compact trace-detail" aria-label="Rastreabilidade">
          <span data-current={tab === "registro"}>Registro</span>
          <span data-current={tab === "sugestoes" && !hasEvidence}>Sugestão</span>
          <span data-current={hasEvidence}>Evidência</span>
        </div>
      </header>

      {notice && <p className="inline-notice" role="status">{notice}</p>}

      <nav className="detail-tabs" aria-label="Visões do Daily Log">
        <Link aria-current={tab === "registro" ? "page" : undefined} data-active={tab === "registro"} href={`/app/diario/${id}?tab=registro`}>Registro</Link>
        <Link aria-current={tab === "sugestoes" ? "page" : undefined} data-active={tab === "sugestoes"} href={`/app/diario/${id}?tab=sugestoes`}>
          Sugestões <span>{suggestions.length}</span>
        </Link>
      </nav>

      {tab === "registro" ? (
        <section className="detail-panel" aria-labelledby="record-heading">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Fonte original</p>
              <h2 id="record-heading">Editar registro</h2>
            </div>
            <span className="source-state">{log.status === "structured" ? "Com evidência" : "Texto preservado"}</span>
          </div>
          <EditDailyLogForm
            id={id}
            values={{ content: log.content, context: log.context, occurredOn: log.occurred_on }}
          />

          <details className="danger-zone">
            <summary>Excluir registro</summary>
            <div>
              <strong>{hasEvidence ? "Exclusão bloqueada" : "Esta ação não pode ser desfeita"}</strong>
              <p>
                {hasEvidence
                  ? "Uma evidência confirmada depende deste texto. A fonte precisa permanecer rastreável."
                  : "Sugestões ainda não confirmadas serão excluídas junto com o registro."}
              </p>
              {!hasEvidence && (
                <form action={deleteDailyLog.bind(null, id)}>
                  <label className="delete-confirmation">
                    <input name="confirmDeletion" type="checkbox" value="yes" required />
                    Entendo que o registro será removido permanentemente.
                  </label>
                  <PendingButton className="button-danger" pendingLabel="Excluindo…">Excluir registro</PendingButton>
                </form>
              )}
            </div>
          </details>
        </section>
      ) : (
        <section className="suggestions-workspace" aria-labelledby="suggestions-heading">
          <div className="suggestion-tools">
            <div>
              <p className="eyebrow">Estruturação</p>
              <h2 id="suggestions-heading">Sugestões separadas da fonte</h2>
              <p>A IA propõe campos; você decide o que está sustentado pelo relato.</p>
            </div>
            <div className="suggestion-tool-actions">
              <form action={createManualSuggestion.bind(null, id)}>
                <PendingButton pendingLabel="Abrindo…">Estruturar manualmente</PendingButton>
              </form>
              <form action={generateSuggestion.bind(null, id)}>
                <PendingButton className="button-primary" pendingLabel="Estruturando…">Estruturar com IA</PendingButton>
              </form>
            </div>
          </div>

          {!suggestions.length ? (
            <div className="empty-state suggestion-empty">
              <strong>Nenhuma sugestão ainda</strong>
              <p>Use a IA ou comece manualmente. O registro original não será alterado.</p>
            </div>
          ) : (
            <div className="suggestion-layout">
              <ol className="suggestion-list" aria-label="Versões da estruturação">
                {suggestions.map((suggestion, index) => (
                  <li key={suggestion.id}>
                    <Link
                      data-active={selected?.id === suggestion.id}
                      href={`/app/diario/${id}?tab=sugestoes&suggestion=${suggestion.id}`}
                    >
                      <span>{String(suggestions.length - index).padStart(2, "0")}</span>
                      <div>
                        <strong>{suggestion.title || (suggestion.origin === "manual" ? "Estrutura manual" : "Estruturação")}</strong>
                        <small>{suggestion.origin === "ai" ? "Groq" : "Manual"} · {statusLabels[suggestion.status]}</small>
                      </div>
                    </Link>
                  </li>
                ))}
              </ol>

              <div className="suggestion-review-panel">
                {selected?.status === "for_review" ? (
                  <>
                    <div className="review-heading">
                      <div>
                        <span className="phase-label">{selected.origin === "ai" ? "Gerado por IA — revise" : "Estrutura manual"}</span>
                        <h3>{selected.title || "Preencha a estrutura"}</h3>
                      </div>
                      <form action={rejectSuggestion.bind(null, selected.id, id)}>
                        <PendingButton className="button-text" pendingLabel="Rejeitando…">Rejeitar sugestão</PendingButton>
                      </form>
                    </div>
                    {selected.unsupported_fields.length > 0 && (
                      <p className="unsupported-note">
                        Sem suporte suficiente: {selected.unsupported_fields.map(fieldLabel).join(", ")}.
                      </p>
                    )}
                    <SuggestionReviewForm id={selected.id} values={selected} />
                  </>
                ) : selected?.status === "confirmed" ? (
                  <div className="state-panel success-panel">
                    <strong>Evidência confirmada</strong>
                    <p>Esta versão foi revisada e mantém o Daily Log como fonte rastreável.</p>
                    <span>A Biblioteca completa entra na Fase 5.</span>
                  </div>
                ) : selected?.status === "generating" ? (
                  <div className="state-panel" aria-live="polite">
                    <strong>Estruturando o relato</strong>
                    <p>Aguarde a resposta da Groq. O texto original já está salvo.</p>
                  </div>
                ) : selected?.status === "no_suggestion" ? (
                  <div className="state-panel">
                    <strong>Nenhuma sugestão útil</strong>
                    <p>Não há informação suficiente para estruturar sem inferir fatos. Edite o registro ou use o modo manual.</p>
                  </div>
                ) : selected?.status === "failed" ? (
                  <div className="state-panel error-panel">
                    <strong>Estruturação não concluída</strong>
                    <p>{noticeMessages[selected.error_code ?? "provider_error"]}</p>
                  </div>
                ) : (
                  <div className="state-panel">
                    <strong>Sugestão rejeitada</strong>
                    <p>Ela permanece no histórico para registrar a decisão, sem criar evidência.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </section>
      )}
    </main>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value}T00:00:00Z`));
}

function fieldLabel(value: string) {
  return {
    context: "contexto",
    challenge: "desafio",
    action: "ação",
    result: "resultado",
    competencies: "competências",
    learning: "aprendizado",
  }[value] ?? value;
}
