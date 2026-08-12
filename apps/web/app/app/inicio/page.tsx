import Link from "next/link";

import { getNarrativeScoreData } from "@/lib/score/data";
import { createClient } from "@/lib/supabase/server";

const date = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short", year: "numeric", timeZone: "America/Sao_Paulo" });
const originLabel = { declared: "Base declarada", partially_observed: "Parcialmente observado", observed: "Observado" } as const;

export default async function StartPage({ searchParams }: { searchParams: Promise<{ notice?: string }> }) {
  const { notice } = await searchParams;
  const supabase = await createClient();
  const [{ data: profile }, { data: logs }, score] = await Promise.all([
    supabase.from("profiles").select("display_name, main_objective").maybeSingle(),
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

  return (
    <main className="app-page score-home">
      {notice === "diagnostic-completed" && <p className="inline-notice" role="status">Diagnóstico concluído. Sua base declarada foi registrada.</p>}
      <header className="score-home-heading">
        <div><p className="eyebrow">Visão narrativa</p><h1>{firstName}, esta é a história que seus dados sustentam hoje.</h1></div>
        <Link href="/app/diagnostico">{current ? "Refazer diagnóstico" : "Iniciar diagnóstico"}</Link>
      </header>
      <section className="score-hero" aria-labelledby="score-title">
        <div><span className="metric-label" id="score-title">Narrative Score</span>{current ? <strong>{Math.round(current.total_score)}<small>/100</small></strong> : <strong className="score-empty">Sem base inicial</strong>}</div>
        <div className="score-provenance"><span>{current ? originLabel[current.total_state] : "Diagnóstico pendente"}</span><time>{current ? `Atualizado em ${date.format(new Date(current.created_at))}` : "Nenhuma nota foi calculada"}</time><Link href="/app/score">Ver cálculo e histórico <span aria-hidden>→</span></Link></div>
      </section>
      <section className="dimension-strip" aria-label="Dimensões do Narrative Score">
        <div><span>Coerência</span><strong>{current ? Math.round(current.coherence_score) : "—"}</strong><small>{current?.coherence_origin === "ai_assisted" ? "Análise assistida" : current ? "Declarada" : "Sem base"}</small></div>
        <div><span>Consistência</span><strong>{current ? Math.round(current.consistency_score) : "—"}</strong><small>{current?.consistency_origin === "observed" ? "Observada" : current ? "Declarada" : "Sem base"}</small></div>
        <div><span>Credibilidade</span><strong>—</strong><small>Indisponível nesta fase</small></div>
      </section>
      <section className="narrative-trace" aria-label="Rastreabilidade do Score">
        {[["01", "Diagnóstico", current ? "Base registrada" : "Pendente"], ["02", "Registros", `${score.consistency?.activeLogCount ?? 0} ativos`], ["03", "Evidências", `${score.coherenceEligibility.evidenceCount} confirmadas`], ["04", "Score", current ? originLabel[current.total_state] : "Aguardando"]].map(([index, label, state]) => <div key={index}><span>{index}</span><strong>{label}</strong><small>{state}</small></div>)}
      </section>
      <section className="home-workspace">
        <article className="next-action"><p className="eyebrow">Próximo movimento</p><h2>{next.label}</h2><p>{next.note}</p><Link className="button-primary" href={next.href}>Continuar <span aria-hidden>→</span></Link></article>
        <article className="narrative-objective"><span className="metric-label">Objetivo atual</span><p>{score.diagnostic?.professional_objective ?? profile?.main_objective}</p></article>
      </section>
      <section className="home-density">
        <article><div className="section-heading-row"><h2>Registros recentes</h2><Link href="/app/diario">Ver diário</Link></div>{logs?.length ? <ol className="compact-list">{logs.map((log) => <li key={log.id}><time>{date.format(new Date(`${log.occurred_on}T12:00:00`))}</time><Link href={`/app/diario/${log.id}`}>{log.content}</Link></li>)}</ol> : <p className="dense-empty">Nenhum registro ativo.</p>}</article>
        <article><div className="section-heading-row"><h2>Competências recorrentes</h2><Link href="/app/evidencias">Ver evidências</Link></div>{competencies.length ? <ol className="competency-list">{competencies.map(([name, count]) => <li key={name}><span>{name}</span><strong>{count}</strong></li>)}</ol> : <p className="dense-empty">Confirme evidências para revelar recorrências.</p>}</article>
      </section>
    </main>
  );
}
