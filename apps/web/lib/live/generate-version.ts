import type { createClient } from "../supabase/server.ts";
import { describeLiveFailure, LIVE_PROMPT_VERSION, LiveGenerationError, type generateLiveResponse } from "./nvidia-chat.ts";
import { recommendEvidences, type RecommendableEvidence } from "./recommendation.ts";

type EvidenceRow = RecommendableEvidence & { live_session_evidences?: { recommendation_score: number; removed_at: string | null }[] };

export type LiveMode = "initial" | "shorter" | "deeper" | "alternative";
export type GenerateVersionDeps = { supabase: Awaited<ReturnType<typeof createClient>>; userId: string; generate: typeof generateLiveResponse };

// Orquestração da geração de uma versão, extraída de actions.ts ("use server" só exporta async) para ser testável com fakes.
export async function runGenerateVersion({ supabase, userId, generate }: GenerateVersionDeps, questionId: string, mode: LiveMode) {
  const { data: question } = await supabase.from("live_questions").select("id, session_id, question_text, primary_evidence_id, live_sessions!inner(target_role, company, opportunity_description, status)").eq("id", questionId).eq("user_id", userId).maybeSingle();
  const sessionValue = question?.live_sessions;
  const session = (Array.isArray(sessionValue) ? sessionValue[0] : sessionValue) as { target_role: string; company: string; opportunity_description: string | null; status: string } | undefined;
  if (!question || !session || session.status !== "active") return { error: "A sessão precisa estar ativa." };
  const { data: links } = await supabase.from("live_session_evidences").select("evidence_id, recommendation_score").eq("session_id", question.session_id).eq("user_id", userId).is("removed_at", null);
  const ids = (links ?? []).map((item) => item.evidence_id);
  if (!ids.length) return { error: "Nenhuma evidência está autorizada." };
  const { data } = await supabase.from("evidences").select("id, title, context, action, result, learning, competencies, updated_at").in("id", ids).eq("status", "confirmed");
  const ranked = recommendEvidences({ targetRole: question.question_text, company: session.company, description: `${session.target_role} ${session.opportunity_description ?? ""}` }, (data ?? []) as EvidenceRow[]);
  const previousPrimary = question.primary_evidence_id;
  const alternative = mode === "alternative" ? ranked.find((item) => item.id !== previousPrimary)?.id : null;
  if (mode === "alternative" && !alternative) return { error: "Não há outra experiência autorizada para esta pergunta." };
  const preferredEvidenceId = alternative ?? previousPrimary;
  const ordered = preferredEvidenceId ? [...ranked.filter((item) => item.id === preferredEvidenceId), ...ranked.filter((item) => item.id !== preferredEvidenceId)] : ranked;
  const evidenceInputs = ordered.slice(0, 5).map(({ id, title, context, action, result, learning, competencies }) => ({ id, title, context, action, result, learning, competencies }));
  try {
    const { response, model } = await generate({
      question: question.question_text, targetRole: session.target_role, company: session.company,
      description: session.opportunity_description, evidences: evidenceInputs, mode, preferredEvidenceId,
    });
    const { error } = await supabase.rpc("finish_live_question", {
      p_question_id: question.id, p_intent: response.intent, p_status: response.supported ? "answered" : "gap",
      p_primary_evidence_id: response.primary_evidence_id, p_mode: mode, p_target_duration_seconds: response.target_duration_seconds,
      p_draft_text: response.draft, p_arguments: response.arguments, p_evidence_ids: [...new Set(response.arguments.map((item) => item.evidence_id))],
      p_gap: response.gap, p_model: model, p_prompt_version: LIVE_PROMPT_VERSION,
    });
    if (error) throw new LiveGenerationError("invalid_output");
    return {};
  } catch (error) {
    const failure = describeLiveFailure(mode, error);
    if (failure.markQuestionFailed) await supabase.rpc("fail_live_question", { p_question_id: question.id, p_error_code: failure.code });
    console.error("Live generation failed", { code: failure.code });
    return { error: failure.message };
  }
}
