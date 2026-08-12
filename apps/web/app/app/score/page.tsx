import Link from "next/link";

import { getNarrativeScoreData } from "@/lib/score/data";
import { createClient } from "@/lib/supabase/server";

import { updateCoherence } from "./actions";

const date = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", timeZone: "America/Sao_Paulo" });
const reason = { diagnostic_completed: "Diagnóstico concluído", consistency_observed: "Consistência recalculada", coherence_updated: "Coerência atualizada", method_changed: "Método atualizado" } as Record<string, string>;

export default async function ScorePage({ searchParams }: { searchParams: Promise<{ tab?: string; notice?: string }> }) {
  const { tab = "summary", notice } = await searchParams;
  const supabase = await createClient();
  const score = await getNarrativeScoreData(supabase);
  const current = score.current;
  const providerError = ["not_configured", "timeout", "rate_limit", "invalid_output", "provider_error"].includes(notice ?? "");

  return (
    <main className="app-page score-page">
      <header className="score-page-heading">
        <div><p className="eyebrow">Narrative Score</p><h1>Cálculo rastreável, sem nota mágica.</h1><p>Cada mudança guarda a origem, o período e os dados que a sustentam.</p></div>
        {current && <strong>{Math.round(current.total_score)}<small>/100</small></strong>}
      </header>
      <nav className="score-tabs" aria-label="Seções do Score">
        <Link data-active={tab === "summary"} href="/app/score?tab=summary">Resumo</Link>
        <Link data-active={tab === "history"} href="/app/score?tab=history">Histórico</Link>
        <Link data-active={tab === "method"} href="/app/score?tab=method">Como é calculado</Link>
      </nav>
      {notice === "updated" && <p className="inline-notice" role="status">Análise atualizada e novo snapshot registrado.</p>}
      {notice === "not-eligible" && <p className="form-error" role="alert">Ainda são necessárias 5 evidências, 2 contextos e 3 competências.</p>}
      {providerError && <p className="form-error" role="alert">A análise não foi atualizada. O último Score válido foi preservado; tente novamente mais tarde.</p>}

      {!current ? (
        <section className="score-no-data"><h2>Comece por uma referência inicial.</h2><p>O diagnóstico leva cerca de três minutos e separa claramente respostas declaradas de dados observados.</p><Link className="button-primary" href="/app/diagnostico">Responder diagnóstico</Link></section>
      ) : tab === "history" ? (
        <section className="score-history">
          <div className="section-heading-row"><h2>Snapshots</h2><span className="history-count">{score.snapshots.length} eventos</span></div>
          <ol>{score.snapshots.map((snapshot) => <li key={snapshot.id}><time>{date.format(new Date(snapshot.created_at))}</time><strong>{reason[snapshot.reason] ?? snapshot.reason}</strong><span>{Math.round(snapshot.total_score)}/100</span><small>{snapshot.total_state === "declared" ? "Base declarada" : snapshot.total_state === "observed" ? "Observado" : "Parcialmente observado"}</small></li>)}</ol>
        </section>
      ) : tab === "method" ? (
        <section className="score-method"><h2>O que entra na conta</h2><dl><div><dt>Score total</dt><dd>60% coerência + 40% consistência. Credibilidade permanece fora da nota nesta fase.</dd></div><div><dt>Base declarada</dt><dd>Coerência usa as respostas 1–6; consistência usa as respostas 7–8 do diagnóstico.</dd></div><div><dt>Consistência observada</dt><dd>Após 21 dias, 6 registros e 3 semanas ativas: 70% continuidade + 30% frequência, em janela de até 4 semanas.</dd></div><div><dt>Coerência assistida</dt><dd>Com 5 evidências, 2 contextos e 3 competências: alinhamento 35%, conexão 25%, especificidade 25% e recorrência 15%.</dd></div><div><dt>Credibilidade</dt><dd>Indisponível. Links de fonte já podem ser guardados, mas ainda não formam uma nota.</dd></div></dl></section>
      ) : (
        <section className="score-summary">
          <div className="score-dimensions-detail"><article><span>Coerência · 60%</span><strong>{Math.round(current.coherence_score)}</strong><p>{current.coherence_origin === "ai_assisted" ? "Observada por análise assistida e validada contra evidências permitidas." : "Declarada no diagnóstico inicial."}</p></article><article><span>Consistência · 40%</span><strong>{Math.round(current.consistency_score)}</strong><p>{current.consistency_origin === "observed" ? "Observada em registros ativos das últimas quatro semanas." : "Declarada no diagnóstico; ainda aguarda histórico suficiente."}</p></article><article><span>Credibilidade</span><strong>—</strong><p>Dimensão ainda indisponível e fora do total.</p></article></div>
          <div className="score-readiness"><div><h2>Consistência observável</h2><p>{score.consistency?.activeLogCount ?? 0}/6 registros · {score.consistency?.activeWeeks ?? 0}/3 semanas mínimas</p></div><div><h2>Coerência analisável</h2><p>{score.coherenceEligibility.evidenceCount}/5 evidências · {score.coherenceEligibility.contextCount}/2 contextos · {score.coherenceEligibility.competencyCount}/3 competências</p></div></div>
          <form action={updateCoherence}><button className="button-primary" disabled={!score.coherenceEligibility.eligible} type="submit">Atualizar análise</button><p>{score.coherenceEligibility.eligible ? "A análise usa de 5 a 12 evidências e só é executada quando você solicita." : "O botão será liberado quando os três requisitos de evidência forem atingidos."}</p></form>
        </section>
      )}
    </main>
  );
}
