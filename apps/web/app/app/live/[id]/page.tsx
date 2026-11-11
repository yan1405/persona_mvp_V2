import { notFound } from "next/navigation";

import { ArgumentPanel, Badge, Button, ButtonLink, Card, DraftPanel, Icon, type ArgumentItem } from "@/components/ds";
import { evidenceLevel } from "@/lib/evidence/validation";
import { recommendEvidences, type RecommendableEvidence } from "@/lib/live/recommendation";
import { createClient } from "@/lib/supabase/server";

import { saveLiveAsArtifact } from "../../artefatos/actions";
import { closeLiveSession, duplicateLiveSession, pauseLiveSession, regenerateLiveQuestion } from "../actions";
import { ConfirmCloseButton, CopyDraftButton, EvidenceSelectionForm, LiveQuestionForm } from "../live-forms";

type Session = { id: string; target_role: string; company: string; opportunity_description: string | null; status: "preparing" | "active" | "paused" | "closed"; created_at: string };
type LinkRow = { evidence_id: string; removed_at: string | null };
type Version = { id: string; version: number; mode: "initial" | "shorter" | "deeper" | "alternative"; target_duration_seconds: number; draft_text: string | null; arguments: { text: string; evidence_id: string; source_field: string; source_excerpt: string }[]; evidence_ids: string[]; gap: { missing_facts: string[]; registration_suggestion: string } | null; created_at: string };
type Question = { id: string; question_text: string; intent: string | null; status: "processing" | "answered" | "gap" | "failed"; primary_evidence_id: string | null; error_code: string | null; created_at: string; live_draft_versions: Version[] };
const statusLabel = { preparing: "Em preparação", active: "Sessão ativa", paused: "Sessão pausada", closed: "Sessão encerrada" } as const;
const modeLabel = { initial: "Inicial", shorter: "Encurtada", deeper: "Aprofundada", alternative: "Outra experiência" } as const;
const noticeText: Record<string, string> = {
  started: "Sessão iniciada. Faça a primeira pergunta.",
  paused: "Sessão pausada. Revise a seleção para continuar.",
  closed: "Sessão encerrada. O histórico agora é somente leitura.",
  "artifact-failed": "Não foi possível salvar nos Artefatos. A resposta do Live continua preservada.",
};

export default async function LiveSessionPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ notice?: string }> }) {
  const { id } = await params;
  const { notice } = await searchParams;
  const supabase = await createClient();
  const [{ data: session }, { data: allEvidence }, { data: links }, { data: rawQuestions }] = await Promise.all([
    supabase.from("live_sessions").select("id, target_role, company, opportunity_description, status, created_at").eq("id", id).maybeSingle(),
    supabase.from("evidences").select("id, title, context, action, result, learning, competencies, updated_at, evidence_sources(id)").eq("status", "confirmed").order("updated_at", { ascending: false }),
    supabase.from("live_session_evidences").select("evidence_id, removed_at").eq("session_id", id),
    supabase.from("live_questions").select("id, question_text, intent, status, primary_evidence_id, error_code, created_at, live_draft_versions(id, version, mode, target_duration_seconds, draft_text, arguments, evidence_ids, gap, created_at)").eq("session_id", id).order("created_at", { ascending: true }),
  ]);
  if (!session) notFound();
  const currentSession = session as Session;
  const evidenceRows = (allEvidence ?? []) as (RecommendableEvidence & { evidence_sources: { id: string }[] | null })[];
  const ranked = recommendEvidences({ targetRole: currentSession.target_role, company: currentSession.company, description: currentSession.opportunity_description }, evidenceRows);
  const activeIds = new Set(((links ?? []) as LinkRow[]).filter((item) => !item.removed_at).map((item) => item.evidence_id));
  const options = ranked.map((item, index) => ({ ...item, level: evidenceLevel(evidenceRows.find((row) => row.id === item.id)?.evidence_sources?.length ?? 0), selected: activeIds.has(item.id) || (!links?.length && index < Math.min(3, ranked.length)) }));
  const questions = ((rawQuestions ?? []) as Question[]).map((question) => ({ ...question, live_draft_versions: [...question.live_draft_versions].sort((a, b) => a.version - b.version) }));
  const titles = new Map(evidenceRows.map((item) => [item.id, item.title]));
  const preparation = currentSession.status === "preparing" || currentSession.status === "paused";
  const closed = currentSession.status === "closed";
  const active = currentSession.status === "active";
  const noticeMessage = notice ? (noticeText[notice] ?? "Não foi possível duplicar a sessão.") : null;

  return (
    <main className="dx-home">
      <header className="dx-home__head">
        <div className="dx-home__greeting">
          <ButtonLink variant="ghost" size="sm" icon="arrow-left" href="/app/live">
            Persona Live
          </ButtonLink>
          <p className="dx-page__eyebrow">{currentSession.company}</p>
          <h1 className="dx-home__title">{currentSession.target_role}</h1>
          <p className="dx-home__text">{currentSession.opportunity_description || "Sem descrição adicional para esta oportunidade."}</p>
        </div>
        <div className="dx-live__controls">
          <Badge tone={active ? "success" : "neutral"} icon={closed ? "lock" : "clock"}>
            {statusLabel[currentSession.status]}
          </Badge>
          {active && (
            <>
              <form action={pauseLiveSession.bind(null, id)}>
                <Button variant="outline" size="sm" type="submit">
                  Pausar e revisar
                </Button>
              </form>
              <ConfirmCloseButton action={closeLiveSession.bind(null, id)} />
            </>
          )}
          {currentSession.status === "paused" && <ConfirmCloseButton action={closeLiveSession.bind(null, id)} />}
          {closed && (
            <form action={duplicateLiveSession.bind(null, id)}>
              <Button variant="brand" size="sm" type="submit" icon="copy">
                Duplicar preparação
              </Button>
            </form>
          )}
        </div>
      </header>

      {noticeMessage && (
        <p className={`dx-page__notice ${notice === "artifact-failed" || !noticeText[notice ?? ""] ? "dx-page__notice--error" : "dx-page__notice--ok"}`} role="status">
          <Icon name="circle-check" size={16} />
          {noticeMessage}
        </p>
      )}

      {preparation ? (
        <section className="dx-home__section" aria-labelledby="prep-title">
          <div className="dx-home__section-head">
            <h2 className="dx-home__h2" id="prep-title">
              {currentSession.status === "paused" ? "Revise as evidências futuras." : "Escolha os fatos para esta conversa."}
            </h2>
            <span className="dx-home__row-meta">{options.length} disponíveis</span>
          </div>
          <p className="dx-home__text">O ranking é objetivo: correspondência temática primeiro, recência apenas no desempate.</p>
          {options.length ? (
            <EvidenceSelectionForm sessionId={id} evidences={options} resume={currentSession.status === "paused"} />
          ) : (
            <div className="dx-empty">
              <p className="dx-empty__title">Você ainda não tem evidências ativas.</p>
              <p className="dx-home__text">Registre ou confirme uma experiência antes de iniciar uma sessão. O Persona não gera respostas sem fatos.</p>
              <ButtonLink variant="outline" size="sm" href="/app/evidencias?new=1#new-evidence">
                Registrar evidência
              </ButtonLink>
            </div>
          )}
        </section>
      ) : (
        <>
          {active && (
            <Card padding={24} className="dx-home__block">
              <section className="dx-home__section" aria-labelledby="ask-title">
                <h2 className="dx-home__h2" id="ask-title">
                  Qual é a pergunta?
                </h2>
                <LiveQuestionForm sessionId={id} />
              </section>
            </Card>
          )}
          <section className="dx-home__section" aria-labelledby="history-title">
            <div className="dx-home__section-head">
              <h2 className="dx-home__h2" id="history-title">
                {questions.length ? `${questions.length} pergunta${questions.length === 1 ? "" : "s"}.` : "Aguardando a primeira pergunta."}
              </h2>
              <span className="dx-home__row-meta">Argumentos reais sempre aparecem antes do texto sugerido.</span>
            </div>
            {!questions.length ? (
              <div className="dx-empty">
                <p className="dx-empty__title">Nenhuma pergunta nesta sessão.</p>
                <p className="dx-home__text">{closed ? "A sessão foi encerrada sem perguntas." : "Cole uma pergunta acima para recuperar os fatos mais relevantes."}</p>
              </div>
            ) : (
              <ol className="dx-live__questions">
                {questions.map((question, questionIndex) => {
                  const version = question.live_draft_versions.at(-1);
                  const items: ArgumentItem[] = (version?.arguments ?? []).map((argument) => ({
                    fact: argument.text,
                    source: `${titles.get(argument.evidence_id) ?? "Evidência"} · ${argument.source_field}`,
                    excerpt: argument.source_excerpt,
                  }));
                  const hasArguments = items.length > 0;
                  const argState = !version ? (question.status === "processing" ? "processing" : "error") : hasArguments ? (closed ? "closed" : "sustained") : "gap";
                  const draftState = !version ? (question.status === "processing" ? "processing" : "error") : version.draft_text ? (closed ? "closed" : "ready") : "gap";
                  return (
                    <li id={`question-${question.id}`} key={question.id} className="dx-live__question">
                      <header className="dx-live__question-head">
                        <h3 className="dx-live__question-title">
                          {String(questionIndex + 1).padStart(2, "0")} · {question.question_text}
                        </h3>
                        <Badge status={question.status === "gap" ? "lacuna" : undefined} tone={question.status === "failed" ? "danger" : "neutral"} icon={question.status === "answered" ? "circle-check" : undefined}>
                          {question.status === "answered" ? "Sustentada" : question.status === "gap" ? "Lacuna" : question.status === "failed" ? "Falha preservada" : "Processando"}
                        </Badge>
                      </header>
                      <div className="dx-live__pair">
                        <ArgumentPanel
                          state={argState}
                          items={items}
                          missing={version?.gap?.missing_facts ?? []}
                          gapNote={version?.gap?.registration_suggestion}
                          registerHref="/app/diario"
                          error="A pergunta foi preservada. A geração falhou com segurança; envie a pergunta novamente quando o serviço estiver disponível."
                        />
                        <DraftPanel
                          state={draftState}
                          durationLabel={version ? `${version.target_duration_seconds} s` : undefined}
                          text={version?.draft_text ?? undefined}
                          sources={version ? [`Versão ${version.version} · ${modeLabel[version.mode]}`] : []}
                          error="Não foi possível gerar o rascunho. A pergunta foi preservada."
                          actions={
                            version?.draft_text ? (
                              <>
                                {active && (
                                  <>
                                    <form action={regenerateLiveQuestion.bind(null, question.id, id, "shorter")}>
                                      <Button variant="outline" size="sm" type="submit" icon="minus">
                                        Encurtar
                                      </Button>
                                    </form>
                                    <form action={regenerateLiveQuestion.bind(null, question.id, id, "deeper")}>
                                      <Button variant="outline" size="sm" type="submit" icon="plus">
                                        Aprofundar
                                      </Button>
                                    </form>
                                    <form action={regenerateLiveQuestion.bind(null, question.id, id, "alternative")}>
                                      <Button variant="outline" size="sm" type="submit" icon="refresh-cw" disabled={activeIds.size < 2}>
                                        Outra experiência
                                      </Button>
                                    </form>
                                  </>
                                )}
                                <CopyDraftButton draft={version.draft_text} />
                                <form action={saveLiveAsArtifact.bind(null, id, question.id, version.id)}>
                                  <Button variant="solid" size="sm" type="submit" icon="file-text">
                                    Salvar nos Artefatos
                                  </Button>
                                </form>
                              </>
                            ) : undefined
                          }
                        />
                      </div>
                    </li>
                  );
                })}
              </ol>
            )}
          </section>
        </>
      )}
    </main>
  );
}
