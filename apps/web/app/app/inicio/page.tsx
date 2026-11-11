import Link from "next/link";

import { Badge, ButtonLink, Card, Chip, DestinationGrid, DestinationTile, FocalJourney, Icon, ScoreRing, TraceLine, type JourneyStep } from "@/components/ds";
import { getCurrentProfile } from "@/lib/auth/current-profile";
import { getNarrativeScoreData } from "@/lib/score/data";
import { createClient } from "@/lib/supabase/server";

const date = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short", year: "numeric", timeZone: "America/Sao_Paulo" });
const originLabel = { declared: "Base declarada", partially_observed: "Parcialmente observado", observed: "Observado" } as const;

export default async function StartPage({ searchParams }: { searchParams: Promise<{ notice?: string }> }) {
  const { notice } = await searchParams;
  const supabase = await createClient();
  const [profile, { data: logs }, score] = await Promise.all([
    getCurrentProfile(),
    supabase.from("daily_logs").select("id, content, occurred_on, status").neq("status", "archived").order("occurred_on", { ascending: false }).limit(4),
    getNarrativeScoreData(supabase),
  ]);
  const firstName = profile?.display_name?.split(" ")[0] ?? "você";
  const current = score.current;
  const competencyCounts = new Map<string, number>();
  score.evidences.forEach((evidence) => evidence.competencies.forEach((item) => competencyCounts.set(item, (competencyCounts.get(item) ?? 0) + 1)));
  const competencies = [...competencyCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);
  const next = !current
    ? { href: "/app/diagnostico", label: "Responder diagnóstico", note: "Crie uma base inicial explicável para o Narrative Score." }
    : !score.consistency?.eligible
      ? { href: "/app/diario", label: "Registrar uma experiência", note: `${score.consistency?.activeLogCount ?? 0} de 6 registros ativos; distribua-os por pelo menos 3 semanas.` }
      : !score.coherenceEligibility.eligible
        ? { href: "/app/evidencias", label: "Confirmar evidências", note: `${score.coherenceEligibility.evidenceCount} de 5 evidências; reúna 2 contextos e 3 competências.` }
        : { href: "/app/score", label: "Atualizar análise", note: "A base já permite uma leitura de coerência assistida por IA." };

  const activeLogCount = score.consistency?.activeLogCount ?? 0;
  const evidenceCount = score.coherenceEligibility.evidenceCount;
  const trace = [
    { label: "Diagnóstico", meta: current ? "Base registrada" : "Pendente", done: Boolean(current) },
    { label: "Registros", meta: `${activeLogCount} ativos`, done: Boolean(score.consistency?.eligible) },
    { label: "Evidências", meta: `${evidenceCount} confirmadas`, done: score.coherenceEligibility.eligible },
    { label: "Score", meta: current ? originLabel[current.total_state] : "Aguardando", done: current?.total_state === "observed" },
  ];
  const activeStep = trace.findIndex((step) => !step.done);
  const steps: JourneyStep[] = trace.map((step, position) => ({
    label: step.label,
    meta: step.meta,
    state: step.done ? "done" : position === activeStep ? "active" : "locked",
  }));
  const noLogs = !logs?.length;

  return (
    <main className="dx-home">
      {notice === "diagnostic-completed" && (
        <p className="dx-page__notice dx-page__notice--ok" role="status">
          <Icon name="circle-check" size={16} />
          Diagnóstico concluído. Sua base declarada foi registrada.
        </p>
      )}
      <header className="dx-home__head">
        <div className="dx-home__greeting">
          <p className="dx-page__eyebrow">Visão narrativa</p>
          <h1 className="dx-home__title">{firstName}, esta é a história que seus dados sustentam hoje.</h1>
          <p className="dx-home__status" role="status">
            {activeLogCount} {activeLogCount === 1 ? "registro ativo" : "registros ativos"} e {evidenceCount} {evidenceCount === 1 ? "evidência confirmada" : "evidências confirmadas"}.
          </p>
        </div>
        <ButtonLink variant="ghost" size="sm" href="/app/diagnostico">
          {current ? "Refazer diagnóstico" : "Iniciar diagnóstico"}
        </ButtonLink>
      </header>

      <FocalJourney title="Do score declarado ao observado." steps={steps} nextText={next.note} ctaLabel={next.label} ctaHref={next.href} />

      <DestinationGrid>
        <DestinationTile tone="amber" title="Diário" icon="notebook-pen" href="/app/diario" status={activeLogCount ? `${activeLogCount} registros ativos` : "Nenhum registro ainda"} />
        <DestinationTile tone="green" title="Evidências" icon="badge-check" href="/app/evidencias" status={evidenceCount ? `${evidenceCount} confirmadas` : "Nenhuma evidência ainda"} />
        <DestinationTile tone="indigo" title="Persona Live" icon="mic" href="/app/live" status="Treine uma conversa" />
        <DestinationTile tone="blue" title="Artefatos" icon="file-text" href="/app/artefatos" status="Veja o que você já gerou" />
      </DestinationGrid>

      <Card padding={24} className="dx-home__block">
        <section aria-labelledby="score-title" className="dx-home__section">
          <div className="dx-home__section-head">
            <h2 className="dx-home__h2" id="score-title">
              Narrative Score.
            </h2>
            <Badge tone="neutral" icon={current ? undefined : "lock"}>
              {current ? originLabel[current.total_state] : "Diagnóstico pendente"}
            </Badge>
          </div>
          <div className="dx-home__score">
            <div className="dx-home__score-main">
              {current ? <ScoreRing value={Math.round(current.total_score)} size={84} stroke={9} ariaLabel={`Narrative Score ${Math.round(current.total_score)} de 100`} /> : null}
              <p className="dx-home__text">
                {current
                  ? `Atualizado em ${date.format(new Date(current.created_at))}. `
                  : "O cálculo começa no diagnóstico. Nenhum número aparece antes disso."}
                <Link className="dx-link" href="/app/score">
                  Ver cálculo e histórico
                </Link>
              </p>
            </div>
            <dl className="dx-home__dims" aria-label="Dimensões do Narrative Score">
              <div>
                <dt>Coerência</dt>
                <dd>
                  <strong>{current ? Math.round(current.coherence_score) : "—"}</strong>
                  <small>{current?.coherence_origin === "ai_assisted" ? "Análise assistida" : current ? "Declarada" : "Sem base"}</small>
                </dd>
              </div>
              <div>
                <dt>Consistência</dt>
                <dd>
                  <strong>{current ? Math.round(current.consistency_score) : "—"}</strong>
                  <small>{current?.consistency_origin === "observed" ? "Observada" : current ? "Declarada" : "Sem base"}</small>
                </dd>
              </div>
              <div>
                <dt>Credibilidade</dt>
                <dd>
                  <strong>—</strong>
                  <small>Ainda não avaliada</small>
                </dd>
              </div>
            </dl>
          </div>
        </section>
      </Card>

      {score.diagnostic?.professional_objective ?? profile?.main_objective ? (
        <Card padding={24} className="dx-home__block">
          <section aria-labelledby="goal-title" className="dx-home__section">
            <h2 className="dx-home__h2" id="goal-title">
              Objetivo atual.
            </h2>
            <p className="dx-home__text">{score.diagnostic?.professional_objective ?? profile?.main_objective}</p>
          </section>
        </Card>
      ) : null}

      {noLogs ? (
        <Card padding={24} className="dx-home__block">
          <section aria-labelledby="next-title" className="dx-home__section">
            <h2 className="dx-home__h2" id="next-title">
              Depois do primeiro registro.
            </h2>
            <p className="dx-home__text">Registros recentes e competências aparecem aqui. Cada afirmação aponta para a sua origem.</p>
            <TraceLine
              title="Como uma evidência se forma"
              steps={[
                { kind: "registro", label: "Seu registro", state: "gap" },
                { kind: "sugestao", label: "A IA sugere", state: "gap" },
                { kind: "evidencia", label: "Você confirma", state: "gap" },
                { kind: "uso", label: "Live e Artefatos", state: "gap" },
              ]}
            />
          </section>
        </Card>
      ) : (
        <div className="dx-home__cols">
          <Card padding={24} className="dx-home__block">
            <section aria-labelledby="recent-title" className="dx-home__section">
              <div className="dx-home__section-head">
                <h2 className="dx-home__h2" id="recent-title">
                  Registros recentes.
                </h2>
                <ButtonLink variant="ghost" size="sm" iconRight="arrow-right" href="/app/diario">
                  Ver diário
                </ButtonLink>
              </div>
              <ol className="dx-home__rows">
                {logs.map((log) => (
                  <li key={log.id} className="dx-home__row">
                    <span className="dx-home__row-icon" aria-hidden="true">
                      <Icon name="notebook-pen" size={16} />
                    </span>
                    <Link className="dx-home__row-link" href={`/app/diario/${log.id}`}>
                      {log.content}
                    </Link>
                    <time className="dx-home__row-meta">{date.format(new Date(`${log.occurred_on}T12:00:00`))}</time>
                  </li>
                ))}
              </ol>
            </section>
          </Card>
          <Card padding={24} className="dx-home__block">
            <section aria-labelledby="skills-title" className="dx-home__section">
              <div className="dx-home__section-head">
                <h2 className="dx-home__h2" id="skills-title">
                  Competências recorrentes.
                </h2>
                <ButtonLink variant="ghost" size="sm" iconRight="arrow-right" href="/app/evidencias">
                  Ver evidências
                </ButtonLink>
              </div>
              {competencies.length ? (
                <ul className="dx-home__chips">
                  {competencies.map(([name, count]) => (
                    <li key={name}>
                      <Chip size="sm" icon={null}>
                        {name} · {count}
                      </Chip>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="dx-home__text">Confirme evidências para revelar recorrências.</p>
              )}
            </section>
          </Card>
        </div>
      )}
    </main>
  );
}
