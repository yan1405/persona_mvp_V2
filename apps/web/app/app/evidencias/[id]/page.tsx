import { Launch } from "@carbon/icons-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { evidenceLevel } from "@/lib/evidence/validation";
import { createClient } from "@/lib/supabase/server";

import { archiveEvidence, removeEvidenceLink, restoreEvidence } from "../actions";
import { EditEvidenceForm, EvidenceLinkForm, type EvidenceValues } from "../evidence-forms";

type DetailSearchParams = { tab?: string; notice?: string };

type Evidence = EvidenceValues & {
  id: string;
  source_log_id: string | null;
  status: "confirmed" | "archived";
  confirmed_at: string;
  updated_at: string;
};

type EvidenceSource = {
  id: string;
  title: string | null;
  url: string;
  created_at: string;
};

const noticeMessages: Record<string, string> = {
  created: "Evidência registrada. Adicione um link de prova quando houver.",
  restored: "Evidência restaurada para a Biblioteca ativa.",
  "status-failed": "Não foi possível alterar o estado da evidência.",
  "link-removed": "Link removido. O nível foi recalculado.",
  "link-remove-failed": "Não foi possível remover o link.",
};

export default async function EvidenceDetailPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<DetailSearchParams> }) {
  const [{ id }, query] = await Promise.all([params, searchParams]);
  const tab = query.tab === "provas" || query.tab === "uso" ? query.tab : "resumo";
  const supabase = await createClient();
  const [{ data: rawEvidence }, { data: rawSources }] = await Promise.all([
    supabase
      .from("evidences")
      .select("id, source_log_id, title, context, challenge, action, result, competencies, learning, status, confirmed_at, updated_at")
      .eq("id", id)
      .maybeSingle(),
    supabase
      .from("evidence_sources")
      .select("id, title, url, created_at")
      .eq("evidence_id", id)
      .order("created_at", { ascending: false }),
  ]);

  if (!rawEvidence) notFound();
  const evidence = rawEvidence as Evidence;
  const sources = (rawSources ?? []) as EvidenceSource[];
  const sourceLog = evidence.source_log_id
    ? await supabase.from("daily_logs").select("id, occurred_on, context").eq("id", evidence.source_log_id).maybeSingle()
    : null;
  const notice = query.notice ? noticeMessages[query.notice] : null;

  return (
    <main className="app-page evidence-detail-page">
      <div className="detail-breadcrumb">
        <Link href="/app/evidencias">Evidências</Link>
        <span aria-hidden>/</span>
        <span>{evidence.title}</span>
      </div>

      <header className="detail-heading evidence-detail-heading">
        <div>
          <p className="eyebrow">{evidence.status === "archived" ? "Evidência arquivada" : "Evidência profissional"}</p>
          <h1>{evidence.title}</h1>
          <p>{evidenceLevel(sources.length)} · {evidence.source_log_id ? "originada no Diário" : "registrada manualmente"}</p>
        </div>
        <div className="trace-compact trace-detail" aria-label="Rastreabilidade da evidência">
          <span data-current="true">Origem</span>
          <span data-current="true">Estrutura</span>
          <span data-current={sources.length > 0}>Prova</span>
        </div>
      </header>

      {notice && <p className="inline-notice" role="status">{notice}</p>}
      {evidence.status === "archived" && (
        <div className="archived-banner">
          <p>Esta evidência não aparece nas visões ativas, mas sua estrutura e provas foram preservadas.</p>
          <form action={restoreEvidence.bind(null, id)}><button className="button-secondary" type="submit">Restaurar evidência</button></form>
        </div>
      )}

      <nav className="detail-tabs" aria-label="Visões da evidência">
        <Link aria-current={tab === "resumo" ? "page" : undefined} data-active={tab === "resumo"} href={`/app/evidencias/${id}?tab=resumo`}>Resumo</Link>
        <Link aria-current={tab === "provas" ? "page" : undefined} data-active={tab === "provas"} href={`/app/evidencias/${id}?tab=provas`}>Provas <span>{sources.length}</span></Link>
        <Link aria-current={tab === "uso" ? "page" : undefined} data-active={tab === "uso"} href={`/app/evidencias/${id}?tab=uso`}>Uso</Link>
      </nav>

      {tab === "resumo" ? (
        <section className="detail-panel" aria-labelledby="evidence-summary-title">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Estrutura confirmada</p>
              <h2 id="evidence-summary-title">Editar evidência</h2>
            </div>
            <span className="evidence-level" data-level={sources.length ? "documented" : "registered"}>{evidenceLevel(sources.length)}</span>
          </div>
          {evidence.status === "confirmed" ? <EditEvidenceForm id={id} values={evidence} /> : <EvidenceReadOnly evidence={evidence} />}
          {evidence.status === "confirmed" && (
            <details className="danger-zone evidence-archive-zone">
              <summary>Arquivar evidência</summary>
              <div>
                <strong>A estrutura e as provas serão preservadas</strong>
                <p>A evidência sairá da Biblioteca ativa e poderá ser restaurada pelo filtro Arquivadas.</p>
                <form action={archiveEvidence.bind(null, id)}><button className="button-danger" type="submit">Arquivar evidência</button></form>
              </div>
            </details>
          )}
        </section>
      ) : tab === "provas" ? (
        <section className="evidence-sources-panel" aria-labelledby="evidence-sources-title">
          <div className="source-column">
            <p className="eyebrow">Rastreabilidade</p>
            <h2 id="evidence-sources-title">Origem e provas</h2>
            <p>Links documentam a evidência, mas não significam validação por terceiros.</p>
            <dl className="evidence-origin-data">
              <div><dt>Origem</dt><dd>{evidence.source_log_id ? "Daily Log confirmado" : "Registro manual"}</dd></div>
              {sourceLog?.data && <div><dt>Data do registro</dt><dd>{formatDate(sourceLog.data.occurred_on)}</dd></div>}
              <div><dt>Nível atual</dt><dd>{evidenceLevel(sources.length)}</dd></div>
            </dl>
            {evidence.source_log_id && <Link className="source-log-link" href={`/app/diario/${evidence.source_log_id}`}>Abrir registro original</Link>}
          </div>
          <div className="proof-column">
            {sources.length ? (
              <ul className="evidence-source-list">
                {sources.map((source) => (
                  <li key={source.id}>
                    <div>
                      <a href={source.url} target="_blank" rel="noreferrer">
                        <strong>{source.title || hostname(source.url)}</strong>
                        <Launch aria-hidden size={14} />
                      </a>
                      <span>{hostname(source.url)}</span>
                    </div>
                    {evidence.status === "confirmed" && (
                      <form action={removeEvidenceLink.bind(null, source.id, id)}>
                        <button className="button-text" type="submit">Remover</button>
                      </form>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="empty-state evidence-proof-empty">
                <strong>Nenhuma prova vinculada</strong>
                <p>A evidência está Registrada. Adicione um link para documentar um resultado, entrega ou referência.</p>
              </div>
            )}
            {evidence.status === "confirmed" && <EvidenceLinkForm evidenceId={id} />}
          </div>
        </section>
      ) : (
        <section className="evidence-use-panel" aria-labelledby="evidence-use-title">
          <p className="eyebrow">Ativação</p>
          <h2 id="evidence-use-title">Ainda não utilizada</h2>
          <p>As sessões do Persona Live e os Artefatos que usarem esta evidência aparecerão aqui quando essas áreas forem implementadas.</p>
          <div className="future-use-grid" aria-label="Usos planejados">
            <div><strong>Persona Live</strong><span>Planejado para a Fase 7</span></div>
            <div><strong>Artefatos</strong><span>Planejado para a Fase 8</span></div>
          </div>
        </section>
      )}
    </main>
  );
}

function EvidenceReadOnly({ evidence }: { evidence: Evidence }) {
  return (
    <dl className="evidence-readonly">
      <div><dt>Contexto</dt><dd>{evidence.context}</dd></div>
      <div><dt>Desafio</dt><dd>{evidence.challenge || "Não informado"}</dd></div>
      <div><dt>Ação</dt><dd>{evidence.action}</dd></div>
      <div><dt>Resultado</dt><dd>{evidence.result || "Não informado"}</dd></div>
      <div><dt>Aprendizado</dt><dd>{evidence.learning || "Não informado"}</dd></div>
      <div><dt>Competências</dt><dd>{evidence.competencies.join(", ")}</dd></div>
    </dl>
  );
}

function hostname(value: string) {
  try { return new URL(value).hostname; } catch { return "Link indisponível"; }
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "long", year: "numeric", timeZone: "UTC" })
    .format(new Date(`${value}T00:00:00Z`));
}
