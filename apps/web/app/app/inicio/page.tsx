import Link from "next/link";

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

  const hasScore = Boolean(current);
  const trace = [
    ["01", "Diagnóstico", current ? "Base registrada" : "Pendente", hasScore],
    ["02", "Registros", `${score.consistency?.activeLogCount ?? 0} ativos`, Boolean(score.consistency?.eligible)],
    ["03", "Evidências", `${score.coherenceEligibility.evidenceCount} confirmadas`, score.coherenceEligibility.eligible],
    ["04", "Score", current ? originLabel[current.total_state] : "Aguardando", current?.total_state === "observed"],
  ] as const;
  const activeStep = trace.findIndex(([, , , done]) => !done);

  return (
    <main className="app-page ds-surface ds-home">
      {notice === "diagnostic-completed" && <p className="inline-notice" role="status">Diagnóstico concluído. Sua base declarada foi registrada.</p>}
      <header className="ds-home-head">
        <div><p className="eyebrow">Visão narrativa</p><h1>{firstName}, esta é a história que seus dados sustentam hoje.</h1></div>
        <Link className="button-secondary" href="/app/diagnostico">{current ? "Refazer diagnóstico" : "Iniciar diagnóstico"}</Link>
      </header>
      <section className="ds-focal" aria-labelledby="trace-title">
        <div>
          <h2 id="trace-title">Rastreabilidade do Score</h2>
          <ol className="ds-trace">
            {trace.map(([index, label, state, done], position) => (
              <li key={index} data-state={done ? "done" : position === activeStep ? "active" : "locked"} aria-current={position === activeStep ? "step" : undefined}>
                <span aria-hidden>{index}</span><strong>{label}</strong><small>{state}</small>
              </li>
            ))}
          </ol>
        </div>
        <article className="ds-next"><p className="eyebrow">Próximo movimento</p><h2>{next.label}</h2><p>{next.note}</p><Link className="button-primary" href={next.href}>Continuar <span aria-hidden>→</span></Link></article>
      </section>
      <section className="ds-card ds-score" aria-labelledby="score-title">
        <div className="ds-score-main">
          <div>
            <h2 className="ds-label" id="score-title">Narrative Score</h2>
            {current ? <strong className="ds-score-value">{Math.round(current.total_score)}<small>/100</small></strong> : <strong className="ds-score-value ds-score-empty">Sem base inicial</strong>}
          </div>
          <div className="ds-score-origin"><span className="ds-badge">{current ? originLabel[current.total_state] : "Diagnóstico pendente"}</span><time>{current ? `Atualizado em ${date.format(new Date(current.created_at))}` : "Nenhuma nota foi calculada"}</time><Link href="/app/score">Ver cálculo e histórico <span aria-hidden>→</span></Link></div>
        </div>
        <div role="group" aria-label="Dimensões do Narrative Score">
          <dl className="ds-dimensions">
            <div><dt>Coerência</dt><dd><strong>{current ? Math.round(current.coherence_score) : "—"}</strong><small>{current?.coherence_origin === "ai_assisted" ? "Análise assistida" : current ? "Declarada" : "Sem base"}</small></dd></div>
            <div><dt>Consistência</dt><dd><strong>{current ? Math.round(current.consistency_score) : "—"}</strong><small>{current?.consistency_origin === "observed" ? "Observada" : current ? "Declarada" : "Sem base"}</small></dd></div>
            <div><dt>Credibilidade</dt><dd><strong>—</strong><small>Indisponível nesta fase</small></dd></div>
          </dl>
        </div>
      </section>
      <article className="ds-card ds-objective"><h2 className="ds-label">Objetivo atual</h2><p>{score.diagnostic?.professional_objective ?? profile?.main_objective}</p></article>
      <div className="ds-home-grid">
        <article className="ds-card"><div className="ds-card-head"><h2>Registros recentes</h2><Link href="/app/diario">Ver diário</Link></div>{logs?.length ? <ol className="ds-rows">{logs.map((log) => <li key={log.id}><time>{date.format(new Date(`${log.occurred_on}T12:00:00`))}</time><Link href={`/app/diario/${log.id}`}>{log.content}</Link></li>)}</ol> : <p className="ds-empty">Nenhum registro ativo.</p>}</article>
        <article className="ds-card"><div className="ds-card-head"><h2>Competências recorrentes</h2><Link href="/app/evidencias">Ver evidências</Link></div>{competencies.length ? <ol className="ds-rows ds-rows-count">{competencies.map(([name, count]) => <li key={name}><span>{name}</span><strong>{count}</strong></li>)}</ol> : <p className="ds-empty">Confirme evidências para revelar recorrências.</p>}</article>
      </div>
    </main>
  );
}
