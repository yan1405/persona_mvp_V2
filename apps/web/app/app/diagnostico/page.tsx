import { createClient } from "@/lib/supabase/server";

import { DiagnosticForm } from "./diagnostic-form";

export default async function DiagnosticPage() {
  const supabase = await createClient();
  const [{ data: draft }, { data: profile }, { data: latest }] = await Promise.all([
    supabase.from("narrative_diagnostics").select("id, current_step, professional_objective, answers").eq("status", "draft").maybeSingle(),
    supabase.from("profiles").select("main_objective").maybeSingle(),
    supabase.from("narrative_diagnostics").select("version").eq("status", "completed").order("version", { ascending: false }).limit(1).maybeSingle(),
  ]);

  return (
    <main className="app-page diagnostic-page">
      <aside className="diagnostic-context">
        <p className="eyebrow">Narrative Score</p>
        <h2>{latest ? "Refazer diagnóstico" : "Diagnóstico inicial"}</h2>
        <p>Dez respostas criam uma referência explicável para o Score. Credibilidade ainda não recebe nota nesta fase.</p>
        <ol>
          <li data-active={(draft?.current_step ?? 1) === 1}><span>01</span>Objetivo</li>
          <li data-active={draft?.current_step === 2}><span>02</span>Clareza</li>
          <li data-active={draft?.current_step === 3}><span>03</span>Prática</li>
        </ol>
      </aside>
      <DiagnosticForm
        initialStep={draft?.current_step ?? 1}
        diagnosticId={draft?.id}
        objective={draft?.professional_objective ?? profile?.main_objective ?? ""}
        answers={(draft?.answers ?? {}) as Record<string, number>}
      />
    </main>
  );
}
