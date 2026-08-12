"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { analyzeCoherence, CoherenceAnalysisError } from "@/lib/score/coherence";
import { COHERENCE_RUBRIC_VERSION } from "@/lib/score/coherence-schema";
import { getNarrativeScoreData } from "@/lib/score/data";
import { recordConsistencyIfChanged } from "@/lib/score/record-consistency";
import { createClient } from "@/lib/supabase/server";

export async function updateCoherence() {
  const supabase = await createClient();
  const { data: authData } = await supabase.auth.getClaims();
  if (!authData?.claims) redirect("/entrar");
  await recordConsistencyIfChanged(supabase);
  const data = await getNarrativeScoreData(supabase);
  if (!data.diagnostic || !data.current) redirect("/app/diagnostico");
  if (!data.coherenceEligibility.eligible) redirect("/app/score?notice=not-eligible");

  try {
    const output = await analyzeCoherence({ objective: data.diagnostic.professional_objective ?? "", evidences: data.evidences });
    const { error } = await supabase.rpc("record_narrative_score_snapshot", {
      p_diagnostic_id: data.diagnostic.id,
      p_consistency_score: data.current.consistency_score,
      p_consistency_origin: data.current.consistency_origin,
      p_coherence_score: output.score,
      p_coherence_origin: "ai_assisted",
      p_period_start: null,
      p_period_end: null,
      p_rubric_version: COHERENCE_RUBRIC_VERSION,
      p_explanation: { summary: output.summary, criteria: output.criteria },
      p_evidence_ids: output.evidenceIds,
      p_reason: "coherence_updated",
    });
    if (error) throw new Error("persistence_failed");
  } catch (error) {
    const code = error instanceof CoherenceAnalysisError ? error.code : "provider_error";
    console.error("Coherence analysis failed", { code });
    redirect(`/app/score?notice=${code}`);
  }
  revalidatePath("/app/inicio");
  revalidatePath("/app/score");
  redirect("/app/score?notice=updated");
}
