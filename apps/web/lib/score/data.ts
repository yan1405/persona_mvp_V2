import type { SupabaseClient } from "@supabase/supabase-js";

import { calculateObservedConsistency, saoPauloDate } from "./consistency";

export type DiagnosticRow = {
  id: string;
  version: number;
  status: "draft" | "completed";
  current_step: number;
  professional_objective: string | null;
  answers: Record<string, number>;
  declared_consistency: number | null;
  declared_coherence: number | null;
  initial_score: number | null;
  completed_at: string | null;
};

export type ScoreSnapshot = {
  id: string;
  diagnostic_id: string;
  consistency_score: number;
  consistency_origin: "declared" | "observed";
  coherence_score: number;
  coherence_origin: "declared" | "ai_assisted";
  total_score: number;
  total_state: "declared" | "partially_observed" | "observed";
  period_start: string | null;
  period_end: string | null;
  explanation: Record<string, unknown>;
  evidence_ids: string[];
  reason: string;
  created_at: string;
};

export async function getNarrativeScoreData(supabase: SupabaseClient) {
  const [{ data: diagnosticData }, { data: snapshotData }, { data: logsData }, { data: evidenceData }] = await Promise.all([
    supabase.from("narrative_diagnostics").select("id, version, status, current_step, professional_objective, answers, declared_consistency, declared_coherence, initial_score, completed_at").eq("status", "completed").order("completed_at", { ascending: false }).limit(1).maybeSingle(),
    supabase.from("narrative_score_snapshots").select("id, diagnostic_id, consistency_score, consistency_origin, coherence_score, coherence_origin, total_score, total_state, period_start, period_end, explanation, evidence_ids, reason, created_at").order("created_at", { ascending: false }).limit(40),
    supabase.from("daily_logs").select("occurred_on, status").order("occurred_on", { ascending: false }).limit(100),
    supabase.from("evidences").select("id, title, context, action, result, competencies, learning, confirmed_at, updated_at").eq("status", "confirmed").order("confirmed_at", { ascending: false }).limit(12),
  ]);

  const diagnostic = diagnosticData as DiagnosticRow | null;
  const allSnapshots = (snapshotData ?? []) as ScoreSnapshot[];
  const snapshots = diagnostic ? allSnapshots.filter((snapshot) => snapshot.diagnostic_id === diagnostic.id) : [];
  const evidences = (evidenceData ?? []) as Array<{
    id: string; title: string; context: string; action: string; result: string | null;
    competencies: string[]; learning: string | null; confirmed_at: string; updated_at: string;
  }>;
  const contexts = new Set(evidences.map((evidence) => evidence.context.trim().toLocaleLowerCase("pt-BR")).filter(Boolean));
  const competencies = new Set(evidences.flatMap((evidence) => evidence.competencies.map((item) => item.trim().toLocaleLowerCase("pt-BR"))).filter(Boolean));
  const consistency = diagnostic?.completed_at
    ? calculateObservedConsistency({ diagnosticCompletedOn: saoPauloDate(new Date(diagnostic.completed_at)), today: saoPauloDate(), logs: logsData ?? [] })
    : null;

  return {
    diagnostic,
    snapshots,
    current: snapshots[0] ?? null,
    consistency,
    evidences,
    coherenceEligibility: {
      eligible: evidences.length >= 5 && contexts.size >= 2 && competencies.size >= 3,
      evidenceCount: evidences.length,
      contextCount: contexts.size,
      competencyCount: competencies.size,
    },
  };
}
