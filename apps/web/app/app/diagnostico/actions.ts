"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { DIAGNOSTIC_QUESTIONS, DIAGNOSTIC_VERSION, parseDiagnosticAnswers, validateDiagnosticCompletion } from "@/lib/score/diagnostic";
import { createClient } from "@/lib/supabase/server";

export type DiagnosticActionState = {
  status: "idle" | "error" | "saved";
  message?: string;
  currentStep: number;
  diagnosticId?: string;
  fieldErrors?: Record<string, string>;
};

export async function saveDiagnostic(
  previousState: DiagnosticActionState,
  formData: FormData,
): Promise<DiagnosticActionState> {
  const supabase = await createClient();
  const { data: authData } = await supabase.auth.getClaims();
  const userId = typeof authData?.claims?.sub === "string" ? authData.claims.sub : null;
  if (!userId) redirect("/entrar");

  const requestedStep = Math.min(3, Math.max(1, Number(formData.get("currentStep")) || previousState.currentStep));
  const rawIntent = formData.get("intent");
  const intent = rawIntent === "complete" ? "complete" : rawIntent === "back" ? "back" : "continue";
  if (intent === "back") {
    return { ...previousState, status: "idle", message: undefined, currentStep: Math.max(1, requestedStep - 1), fieldErrors: undefined };
  }
  const objectiveValue = formData.get("objective");
  const submittedObjective = typeof objectiveValue === "string" ? objectiveValue.trim() : "";
  const submittedAnswers = parseDiagnosticAnswers(formData);
  const { data: storedDraft } = previousState.diagnosticId
    ? await supabase.from("narrative_diagnostics").select("professional_objective, answers").eq("id", previousState.diagnosticId).eq("status", "draft").maybeSingle()
    : { data: null };
  const objective = submittedObjective || storedDraft?.professional_objective || "";
  const answers = { ...((storedDraft?.answers ?? {}) as Record<string, number>), ...submittedAnswers };
  const fieldErrors: Record<string, string> = {};

  if (requestedStep === 1 && (objective.length < 8 || objective.length > 240)) {
    fieldErrors.objective = "Descreva seu objetivo em 8 a 240 caracteres.";
  }
  const requiredIds = requestedStep === 2
    ? DIAGNOSTIC_QUESTIONS.slice(0, 6).map(({ id }) => id)
    : requestedStep === 3
      ? DIAGNOSTIC_QUESTIONS.slice(6).map(({ id }) => id)
      : [];
  for (const id of requiredIds) if (answers[id] === undefined) fieldErrors[id] = "Escolha uma resposta.";

  if (intent === "complete") {
    const completionForm = new FormData();
    completionForm.set("objective", objective);
    for (const [id, value] of Object.entries(answers)) completionForm.set(id, String(value));
    const validation = validateDiagnosticCompletion(completionForm);
    if (!validation.success) {
      return { status: "error", message: "Revise as respostas indicadas.", currentStep: requestedStep, diagnosticId: previousState.diagnosticId, fieldErrors: validation.fieldErrors };
    }
  } else if (Object.keys(fieldErrors).length) {
    return { status: "error", message: "Complete esta etapa para continuar.", currentStep: requestedStep, diagnosticId: previousState.diagnosticId, fieldErrors };
  }

  let diagnosticId = previousState.diagnosticId;
  if (!diagnosticId) {
    const { data: existing } = await supabase.from("narrative_diagnostics").select("id").eq("status", "draft").maybeSingle();
    diagnosticId = existing?.id;
  }
  if (!diagnosticId) {
    const { data: latest } = await supabase.from("narrative_diagnostics").select("version").order("version", { ascending: false }).limit(1).maybeSingle();
    const { data: created, error } = await supabase.from("narrative_diagnostics").insert({
      user_id: userId,
      version: Math.max(DIAGNOSTIC_VERSION, (latest?.version ?? 0) + 1),
      current_step: requestedStep,
    }).select("id").single();
    if (error || !created) {
      console.error("Diagnostic draft creation failed", { code: error?.code });
      return { status: "error", message: "Não foi possível iniciar o diagnóstico. Tente novamente.", currentStep: requestedStep };
    }
    diagnosticId = created.id;
  }

  if (intent === "complete") {
    const completionForm = new FormData();
    completionForm.set("objective", objective);
    for (const [id, value] of Object.entries(answers)) completionForm.set(id, String(value));
    const validation = validateDiagnosticCompletion(completionForm);
    if (!validation.success) return { status: "error", currentStep: 3, diagnosticId, fieldErrors: validation.fieldErrors };
    const { error } = await supabase.rpc("complete_narrative_diagnostic", {
      p_diagnostic_id: diagnosticId,
      p_professional_objective: validation.data.objective,
      p_answers: validation.data.answers,
    });
    if (error) {
      console.error("Diagnostic completion failed", { code: error.code });
      return { status: "error", message: "O diagnóstico não pôde ser concluído. Seu rascunho foi preservado.", currentStep: 3, diagnosticId };
    }
    revalidatePath("/app/inicio");
    revalidatePath("/app/score");
    redirect("/app/inicio?notice=diagnostic-completed");
  }

  const nextStep = Math.min(3, requestedStep + 1);
  const { error } = await supabase.from("narrative_diagnostics").update({
    current_step: nextStep,
    professional_objective: objective || null,
    answers,
    updated_at: new Date().toISOString(),
  }).eq("id", diagnosticId).eq("status", "draft");
  if (error) {
    console.error("Diagnostic draft update failed", { code: error.code });
    return { status: "error", message: "Não foi possível salvar agora. Suas respostas continuam nesta tela.", currentStep: requestedStep, diagnosticId };
  }
  return { status: "saved", message: "Rascunho salvo.", currentStep: nextStep, diagnosticId };
}
