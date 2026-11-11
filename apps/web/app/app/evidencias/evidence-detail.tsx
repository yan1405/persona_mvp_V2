import Link from "next/link";
import { notFound } from "next/navigation";

import { Badge, Icon, TraceLine } from "@/components/ds";
import { evidenceLevel } from "@/lib/evidence/validation";
import { createClient } from "@/lib/supabase/server";

import { archiveEvidence, removeEvidenceLink, restoreEvidence } from "./actions";
import { EditEvidenceForm, EvidenceLinkForm, type EvidenceValues } from "./evidence-forms";
import { EvidencePanel } from "./evidence-panel";

export type EvidenceDetailQuery = { notice?: string };

type Evidence = EvidenceValues & {
  id: string;
  source_log_id: string | null;
  status: "confirmed" | "archived";
  confirmed_at: string;
  updated_at: string;
};

type EvidenceSource = { id: string; title: string | null; url: string; created_at: string };

const noticeMessages: Record<string, string> = {
  created: "Evidência registrada. Adicione um link de prova quando houver.",
  restored: "Evidência restaurada para a Biblioteca ativa.",
  "status-failed": "Não foi possível alterar o estado da evidência.",
  "link-removed": "Link removido. O nível foi recalculado.",
  "link-remove-failed": "Não foi possível remover o link.",
};
const errorNotices = new Set(["status-failed", "link-remove-failed"]);

function hostname(value: string) {
  try {
    return new URL(value).hostname;
  } catch {
    return "Link indisponível";
  }
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(`${value}T00:00:00Z`));
}

export async function EvidenceDetail({ id, query }: { id: string; query: EvidenceDetailQuery }) {
  const supabase = await createClient();
  const [{ data: rawEvidence }, { data: rawSources }] = await Promise.all([
    supabase
      .from("evidences")
      .select("id, source_log_id, title, context, challenge, action, result, competencies, learning, status, confirmed_at, updated_at")
      .eq("id", id)
      .maybeSingle(),
    supabase.from("evidence_sources").select("id, title, url, created_at").eq("evidence_id", id).order("created_at", { ascending: false }),
  ]);
  if (!rawEvidence) notFound();
  const evidence = rawEvidence as Evidence;
  const sources = (rawSources ?? []) as EvidenceSource[];
  const sourceLog = evidence.source_log_id ? await supabase.from("daily_logs").select("id, occurred_on, context").eq("id", evidence.source_log_id).maybeSingle() : null;
  const notice = query.notice ? noticeMessages[query.notice] : null;
  const noticeError = query.notice ? errorNotices.has(query.notice) : false;
  const level = evidenceLevel(sources.length);
  const archived = evidence.status === "archived";

  return (
    <EvidencePanel id={id} eyebrow={archived ? "Evidência arquivada" : "Evidência profissional"} title={`${evidence.title}.`} subtitle={`${level} · ${evidence.source_log_id ? "originada no Diário" : "registrada manualmente"}`}>
      <div className="dx-dp">
        {notice && (
          <p className={`dx-page__notice ${noticeError ? "dx-page__notice--error" : "dx-page__notice--ok"}`} role="status">
            <Icon name={noticeError ? "triangle-alert" : "circle-check"} size={16} />
            {notice}
          </p>
        )}

        <TraceLine
          title="Rastreabilidade da evidência"
          archived={archived}
          steps={[
            { kind: "registro", label: evidence.source_log_id ? "Registro do Diário" : "Registro manual" },
            { kind: "evidencia", label: "Estrutura confirmada" },
            { kind: "prova", label: sources.length ? `${sources.length} ${sources.length === 1 ? "link de prova" : "links de prova"}` : "Sem prova ainda", state: sources.length ? "done" : "gap" },
          ]}
        />

        {archived && (
          <section className="dx-dp__section" aria-labelledby="archived-heading">
            <h3 className="dx-dp__h" id="archived-heading">
              Evidência arquivada.
            </h3>
            <p className="dx-dp__text">Ela não aparece nas visões ativas, mas sua estrutura e provas foram preservadas.</p>
            <form action={restoreEvidence.bind(null, id)}>
              <button className="button-secondary" type="submit">
                Restaurar evidência
              </button>
            </form>
          </section>
        )}

        <section className="dx-dp__section" aria-labelledby="evidence-summary-title">
          <div className="dx-dp__head">
            <h3 className="dx-dp__h" id="evidence-summary-title">
              {archived ? "Estrutura confirmada." : "Editar evidência."}
            </h3>
            <Badge tone={sources.length ? "success" : "neutral"} icon={sources.length ? "badge-check" : "circle-check"}>
              {level}
            </Badge>
          </div>
          {archived ? (
            <dl className="dx-dp__facts">
              <div><dt>Contexto</dt><dd>{evidence.context}</dd></div>
              <div><dt>Desafio</dt><dd>{evidence.challenge || "Não informado"}</dd></div>
              <div><dt>Ação</dt><dd>{evidence.action}</dd></div>
              <div><dt>Resultado</dt><dd>{evidence.result || "Não informado"}</dd></div>
              <div><dt>Aprendizado</dt><dd>{evidence.learning || "Não informado"}</dd></div>
              <div><dt>Competências</dt><dd>{evidence.competencies.join(", ")}</dd></div>
            </dl>
          ) : (
            <EditEvidenceForm id={id} values={evidence} />
          )}
        </section>

        <section className="dx-dp__section" aria-labelledby="evidence-sources-title">
          <h3 className="dx-dp__h" id="evidence-sources-title">
            Origem e provas.
          </h3>
          <p className="dx-dp__text">Links documentam a evidência, mas não significam validação por terceiros.</p>
          <dl className="dx-dp__facts">
            <div><dt>Origem</dt><dd>{evidence.source_log_id ? "Registro do Diário confirmado" : "Registro manual"}</dd></div>
            {sourceLog?.data && <div><dt>Data do registro</dt><dd>{formatDate(sourceLog.data.occurred_on)}</dd></div>}
            <div><dt>Nível atual</dt><dd>{level}</dd></div>
          </dl>
          {evidence.source_log_id && (
            <Link className="dx-link" href={`/app/diario?abrir=${evidence.source_log_id}`}>
              Abrir registro original
            </Link>
          )}
          {sources.length ? (
            <ul className="dx-dp__versions">
              {sources.map((source) => (
                <li key={source.id} className="dx-dp__proof">
                  <a className="dx-link" href={source.url} target="_blank" rel="noreferrer">
                    {source.title || hostname(source.url)}
                    <Icon name="external-link" size={14} />
                  </a>
                  <span className="dx-dp__version-meta">{hostname(source.url)}</span>
                  {!archived && (
                    <form action={removeEvidenceLink.bind(null, source.id, id)}>
                      <button className="button-text" type="submit">
                        Remover
                      </button>
                    </form>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <div className="dx-empty">
              <p className="dx-empty__title">Nenhuma prova vinculada.</p>
              <p className="dx-dp__text">A evidência está Registrada. Adicione um link para documentar um resultado, entrega ou referência.</p>
            </div>
          )}
          {!archived && <EvidenceLinkForm evidenceId={id} />}
        </section>

        <section className="dx-dp__section" aria-labelledby="evidence-use-title">
          <h3 className="dx-dp__h" id="evidence-use-title">
            Ainda não utilizada.
          </h3>
          <p className="dx-dp__text">As sessões do Persona Live e os Artefatos que usarem esta evidência aparecerão aqui quando essas áreas forem implementadas.</p>
        </section>

        {!archived && (
          <section className="dx-dp__section" aria-labelledby="archive-heading">
            <h3 className="dx-dp__h" id="archive-heading">
              Arquivar evidência.
            </h3>
            <p className="dx-dp__text">A estrutura e as provas serão preservadas. A evidência sairá da Biblioteca ativa e poderá ser restaurada pelo filtro Arquivadas.</p>
            <form action={archiveEvidence.bind(null, id)}>
              <button className="button-danger" type="submit">
                Arquivar evidência
              </button>
            </form>
          </section>
        )}
      </div>
    </EvidencePanel>
  );
}
