import type { SupabaseClient } from "@supabase/supabase-js";

import { saoPauloDate } from "./consistency";
import { getNarrativeScoreData } from "./data";

function subtractDays(date: string, days: number) {
  const value = new Date(`${date}T12:00:00Z`);
  value.setUTCDate(value.getUTCDate() - days);
  return value.toISOString().slice(0, 10);
}

export async function recordConsistencyIfChanged(supabase: SupabaseClient) {
  const data = await getNarrativeScoreData(supabase);
  const { diagnostic, current, consistency } = data;
  if (!diagnostic?.completed_at || !current || !consistency) return;
  if (current.consistency_origin === "declared" && !consistency.eligible) return;

  const today = saoPauloDate();
  if (current.consistency_origin === "observed" && current.consistency_score === consistency.score && current.period_end === today) return;
  const completedOn = saoPauloDate(new Date(diagnostic.completed_at));
  const candidateStart = subtractDays(today, 27);
  const periodStart = candidateStart < completedOn ? completedOn : candidateStart;

  const { error } = await supabase.rpc("record_narrative_score_snapshot", {
    p_diagnostic_id: diagnostic.id,
    p_consistency_score: consistency.score,
    p_consistency_origin: "observed",
    p_coherence_score: current.coherence_score,
    p_coherence_origin: current.coherence_origin,
    p_period_start: periodStart,
    p_period_end: today,
    p_rubric_version: current.coherence_origin === "ai_assisted" ? "coherence-v1" : null,
    p_explanation: { consistency: { continuity: consistency.continuity, frequency: consistency.frequency, active_weeks: consistency.activeWeeks, eligible_weeks: consistency.eligibleWeeks, distinct_days: consistency.distinctDays } },
    p_evidence_ids: current.evidence_ids,
    p_reason: "consistency_observed",
  });
  if (error) console.error("Consistency snapshot failed", { code: error.code });
}
