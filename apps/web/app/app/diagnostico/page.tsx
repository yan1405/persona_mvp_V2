import { Card } from "@/components/ds";
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
    <main className="dx-home">
      <header className="dx-home__head">
        <div className="dx-home__greeting">
          <p className="dx-page__eyebrow">Narrative Score</p>
          <h1 className="dx-home__title">{latest ? "Refazer diagnóstico." : "Diagnóstico inicial."}</h1>
          <p className="dx-home__text">Dez respostas criam uma referência explicável para o Score. Credibilidade ainda não recebe nota nesta fase.</p>
        </div>
      </header>
      <Card padding={24} className="dx-home__block">
        <DiagnosticForm
          initialStep={draft?.current_step ?? 1}
          diagnosticId={draft?.id}
          objective={draft?.professional_objective ?? profile?.main_objective ?? ""}
          answers={(draft?.answers ?? {}) as Record<string, number>}
        />
      </Card>
    </main>
  );
}
