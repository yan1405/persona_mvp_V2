"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { generateLiveResponse, LIVE_PROMPT_VERSION, LiveGenerationError } from "@/lib/groq/generate-live-response";
import { recommendEvidences, type RecommendableEvidence } from "@/lib/live/recommendation";
import { validateEvidenceSelection, validateLiveContext, validateLiveQuestion } from "@/lib/live/validation";
import { createClient } from "@/lib/supabase/server";

export type LiveActionState = { status: "idle" | "error"; message?: string; fieldErrors?: Record<string, string> };

async function authenticatedClient() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const userId = typeof data?.claims?.sub === "string" ? data.claims.sub : null;
  if (!userId) redirect("/entrar");
  return { supabase, userId };
}

export async function createLiveSession(_state: LiveActionState, formData: FormData): Promise<LiveActionState> {
  const validation = validateLiveContext(formData);
  if (!validation.success) return { status: "error", message: "Revise o contexto da oportunidade.", fieldErrors: validation.fieldErrors };
  const { supabase, userId } = await authenticatedClient();
  const { data, error } = await supabase.from("live_sessions").insert({
    user_id: userId,
    target_role: validation.data.targetRole,
    company: validation.data.company,
    opportunity_description: validation.data.description,
  }).select("id").single();
  if (error || !data) {
    console.error("Live session creation failed", { code: error?.code });
    return { status: "error", message: "Não foi possível criar a preparação. Seus campos continuam aqui." };
  }
  redirect(`/app/live/${data.id}`);
}

async function activeRecommendations(sessionId: string, ids?: string[]) {
  const { supabase, userId } = await authenticatedClient();
  const [{ data: session }, { data: evidences }] = await Promise.all([
    supabase.from("live_sessions").select("target_role, company, opportunity_description, status").eq("id", sessionId).eq("user_id", userId).maybeSingle(),
    supabase.from("evidences").select("id, title, context, action, result, learning, competencies, updated_at").eq("user_id", userId).eq("status", "confirmed"),
  ]);
  if (!session) return null;
  const ranked = recommendEvidences({ targetRole: session.target_role, company: session.company, description: session.opportunity_description }, (evidences ?? []) as RecommendableEvidence[]);
  return { supabase, userId, session, ranked: ids ? ranked.filter((item) => ids.includes(item.id)) : ranked };
}

export async function authorizeAndActivate(sessionId: string, _state: LiveActionState, formData: FormData): Promise<LiveActionState> {
  const selection = validateEvidenceSelection(formData);
  if (!selection.success) return { status: "error", message: "Selecione entre 1 e 8 evidências." };
  const context = await activeRecommendations(sessionId, selection.ids);
  if (!context || context.ranked.length !== selection.ids.length || !["preparing", "paused"].includes(context.session.status)) {
    return { status: "error", message: "A sessão ou uma evidência não está mais disponível." };
  }
  const { error: selectionError } = await context.supabase.rpc("set_live_evidences", {
    p_session_id: sessionId,
    p_evidences: context.ranked.map(({ id, score, reasons }) => ({ id, score, reasons })),
  });
  if (selectionError) {
    console.error("Live evidence authorization failed", { code: selectionError.code });
    return { status: "error", message: "Não foi possível autorizar as evidências." };
  }
  const { error } = await context.supabase.rpc("change_live_session_status", { p_session_id: sessionId, p_next_status: "active" });
  if (error) {
    console.error("Live activation failed", { code: error.code });
    return { status: "error", message: "Não foi possível iniciar a sessão." };
  }
  revalidatePath("/app/live");
  revalidatePath(`/app/live/${sessionId}`);
  redirect(`/app/live/${sessionId}?notice=started`);
}

type EvidenceRow = RecommendableEvidence & { live_session_evidences?: { recommendation_score: number; removed_at: string | null }[] };

async function generateVersion(questionId: string, mode: "initial" | "shorter" | "deeper" | "alternative") {
  const { supabase, userId } = await authenticatedClient();
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
    const { response, model } = await generateLiveResponse({
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
    const code = error instanceof LiveGenerationError ? error.code : "provider_error";
    if (mode === "initial") await supabase.rpc("fail_live_question", { p_question_id: question.id, p_error_code: code });
    console.error("Live generation failed", { code });
    return { error: code === "timeout" ? "A geração demorou além do limite. A pergunta foi preservada." : "Não foi possível gerar com segurança. A pergunta foi preservada." };
  }
}

export async function askLiveQuestion(sessionId: string, _state: LiveActionState, formData: FormData): Promise<LiveActionState> {
  const question = validateLiveQuestion(formData.get("question"));
  if (!question) return { status: "error", message: "Escreva uma pergunta entre 8 e 500 caracteres." };
  const { supabase } = await authenticatedClient();
  const { data: failedQuestion } = await supabase.from("live_questions").select("id").eq("session_id", sessionId).eq("question_text", question).eq("status", "failed").order("created_at", { ascending: false }).limit(1).maybeSingle();
  const { data: createdQuestionId, error } = failedQuestion
    ? { data: null, error: null }
    : await supabase.rpc("create_live_question", { p_session_id: sessionId, p_question_text: question });
  const questionId = failedQuestion?.id ?? createdQuestionId;
  if (error || !questionId) return { status: "error", message: "A sessão precisa estar ativa para receber perguntas." };
  const result = await generateVersion(questionId, "initial");
  revalidatePath(`/app/live/${sessionId}`);
  if (result.error) return { status: "error", message: result.error };
  redirect(`/app/live/${sessionId}#question-${questionId}`);
}

export async function regenerateLiveQuestion(questionId: string, sessionId: string, mode: "shorter" | "deeper" | "alternative") {
  await generateVersion(questionId, mode);
  revalidatePath(`/app/live/${sessionId}`);
  redirect(`/app/live/${sessionId}#question-${questionId}`);
}

export async function pauseLiveSession(sessionId: string) { await changeStatus(sessionId, "paused"); redirect(`/app/live/${sessionId}?notice=paused`); }
export async function closeLiveSession(sessionId: string) { await changeStatus(sessionId, "closed"); redirect(`/app/live/${sessionId}?notice=closed`); }

async function changeStatus(sessionId: string, status: "paused" | "closed") {
  const { supabase } = await authenticatedClient();
  const { error } = await supabase.rpc("change_live_session_status", { p_session_id: sessionId, p_next_status: status });
  if (error) console.error("Live status change failed", { code: error.code });
  revalidatePath("/app/live"); revalidatePath(`/app/live/${sessionId}`);
}

export async function duplicateLiveSession(sessionId: string) {
  const { supabase } = await authenticatedClient();
  const { data, error } = await supabase.rpc("duplicate_live_session", { p_session_id: sessionId });
  if (error || !data) redirect(`/app/live/${sessionId}?notice=duplicate-failed`);
  revalidatePath("/app/live"); redirect(`/app/live/${data}`);
}
