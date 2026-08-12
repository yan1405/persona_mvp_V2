"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  validateDailyLog,
  validateSuggestion,
  type SuggestionInput,
} from "@/lib/diary/validation";
import { StructureEvidenceError, structureEvidence } from "@/lib/groq/structure-evidence";
import { recordConsistencyIfChanged } from "@/lib/score/record-consistency";
import { createClient } from "@/lib/supabase/server";

export type DiaryActionState = {
  status: "idle" | "error" | "success";
  message?: string;
  fieldErrors?: Record<string, string>;
};

async function authenticatedClient() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const userId = typeof data?.claims?.sub === "string" ? data.claims.sub : null;
  if (!userId) redirect("/entrar");
  return { supabase, userId };
}

function suggestionPayload(data: SuggestionInput) {
  const unsupportedFields = [
    !data.context && "context",
    !data.challenge && "challenge",
    !data.action && "action",
    !data.result && "result",
    !data.competencies.length && "competencies",
    !data.learning && "learning",
  ].filter((field): field is string => Boolean(field));

  return {
    title: data.title || null,
    context: data.context || null,
    challenge: data.challenge,
    action: data.action || null,
    result: data.result,
    competencies: data.competencies,
    learning: data.learning,
    unsupported_fields: unsupportedFields,
    updated_at: new Date().toISOString(),
  };
}

export async function createDailyLog(
  _previousState: DiaryActionState,
  formData: FormData,
): Promise<DiaryActionState> {
  const validation = validateDailyLog(formData);
  if (!validation.success) {
    return { status: "error", message: "Revise o registro.", fieldErrors: validation.fieldErrors };
  }

  const { supabase, userId } = await authenticatedClient();
  const { data, error } = await supabase
    .from("daily_logs")
    .insert({
      user_id: userId,
      entry_key: `daily-${crypto.randomUUID()}`,
      content: validation.data.content,
      context: validation.data.context,
      occurred_on: validation.data.occurredOn,
    })
    .select("id")
    .single();

  if (error || !data) {
    console.error("Daily Log creation failed", { code: error?.code });
    return {
      status: "error",
      message: "Não foi possível salvar. Seu texto continua no formulário; tente novamente.",
    };
  }

  await recordConsistencyIfChanged(supabase);
  revalidatePath("/app/diario");
  redirect(`/app/diario/${data.id}?tab=registro&notice=created`);
}

export async function updateDailyLog(
  logId: string,
  _previousState: DiaryActionState,
  formData: FormData,
): Promise<DiaryActionState> {
  const validation = validateDailyLog(formData);
  if (!validation.success) {
    return { status: "error", message: "Revise o registro.", fieldErrors: validation.fieldErrors };
  }

  const { supabase, userId } = await authenticatedClient();
  const { data, error } = await supabase
    .from("daily_logs")
    .update({
      content: validation.data.content,
      context: validation.data.context,
      occurred_on: validation.data.occurredOn,
      updated_at: new Date().toISOString(),
    })
    .eq("id", logId)
    .eq("user_id", userId)
    .select("id")
    .maybeSingle();

  if (error || !data) {
    console.error("Daily Log update failed", { code: error?.code });
    return { status: "error", message: "Não foi possível salvar as alterações." };
  }

  await recordConsistencyIfChanged(supabase);
  revalidatePath("/app/diario");
  revalidatePath(`/app/diario/${logId}`);
  return { status: "success", message: "Alterações salvas." };
}

export async function deleteDailyLog(logId: string, formData: FormData) {
  if (formData.get("confirmDeletion") !== "yes") {
    redirect(`/app/diario/${logId}?tab=registro&notice=confirm-delete`);
  }

  const { supabase, userId } = await authenticatedClient();
  const { count } = await supabase
    .from("evidences")
    .select("id", { count: "exact", head: true })
    .eq("source_log_id", logId)
    .eq("user_id", userId);

  if (count) redirect(`/app/diario/${logId}?tab=registro&notice=delete-blocked`);

  const { error } = await supabase
    .from("daily_logs")
    .delete()
    .eq("id", logId)
    .eq("user_id", userId);

  if (error) {
    console.error("Daily Log deletion failed", { code: error.code });
    redirect(`/app/diario/${logId}?tab=registro&notice=delete-failed`);
  }

  await recordConsistencyIfChanged(supabase);
  revalidatePath("/app/diario");
  redirect("/app/diario?notice=deleted");
}

export async function createManualSuggestion(logId: string) {
  const { supabase, userId } = await authenticatedClient();
  const { data: log } = await supabase
    .from("daily_logs")
    .select("id, context")
    .eq("id", logId)
    .eq("user_id", userId)
    .maybeSingle();

  if (!log) redirect("/app/diario");

  const { data, error } = await supabase
    .from("evidence_suggestions")
    .insert({
      user_id: userId,
      daily_log_id: logId,
      origin: "manual",
      status: "for_review",
      context: log.context,
      unsupported_fields: ["challenge", "action", "result", "competencies", "learning"],
    })
    .select("id")
    .single();

  if (error || !data) {
    console.error("Manual suggestion creation failed", { code: error?.code });
    redirect(`/app/diario/${logId}?tab=sugestoes&notice=manual-failed`);
  }

  revalidatePath(`/app/diario/${logId}`);
  redirect(`/app/diario/${logId}?tab=sugestoes&suggestion=${data.id}`);
}

export async function generateSuggestion(logId: string) {
  const { supabase, userId } = await authenticatedClient();
  const { data: log } = await supabase
    .from("daily_logs")
    .select("id, content, context")
    .eq("id", logId)
    .eq("user_id", userId)
    .maybeSingle();

  if (!log) redirect("/app/diario");

  const { data: generation, error: generationError } = await supabase
    .from("evidence_suggestions")
    .insert({ user_id: userId, daily_log_id: logId, origin: "ai", status: "generating" })
    .select("id")
    .single();

  if (generationError || !generation) {
    const notice = generationError?.code === "23505" ? "generation-running" : "generation-failed";
    redirect(`/app/diario/${logId}?tab=sugestoes&notice=${notice}`);
  }

  let notice = "generated";

  try {
    const output = await structureEvidence({ content: log.content, context: log.context });

    if (!output.useful) {
      await supabase
        .from("evidence_suggestions")
        .update({ status: "no_suggestion", error_code: "insufficient_content", updated_at: new Date().toISOString() })
        .eq("id", generation.id)
        .eq("user_id", userId);
      notice = "no-suggestion";
    } else {
      const [first, ...remaining] = output.suggestions;
      if (!first) throw new StructureEvidenceError("invalid_output");
      const generatedAt = new Date().toISOString();
      const { error: updateError } = await supabase
        .from("evidence_suggestions")
        .update({
          ...first,
          status: "for_review",
          generated_at: generatedAt,
          updated_at: generatedAt,
        })
        .eq("id", generation.id)
        .eq("user_id", userId);

      if (updateError) throw new Error("persistence_failed");

      if (remaining.length) {
        const { error: insertError } = await supabase.from("evidence_suggestions").insert(
          remaining.map((suggestion) => ({
            ...suggestion,
            user_id: userId,
            daily_log_id: logId,
            origin: "ai",
            status: "for_review",
            generated_at: generatedAt,
          })),
        );
        if (insertError) throw new Error("persistence_failed");
      }
    }
  } catch (error) {
    const code = error instanceof StructureEvidenceError ? error.code : "provider_error";
    console.error("Evidence structure failed", { code });
    await supabase
      .from("evidence_suggestions")
      .update({ status: "failed", error_code: code, updated_at: new Date().toISOString() })
      .eq("id", generation.id)
      .eq("user_id", userId);
    notice = code;
  }

  revalidatePath(`/app/diario/${logId}`);
  redirect(`/app/diario/${logId}?tab=sugestoes&notice=${notice}`);
}

export async function reviewSuggestion(
  suggestionId: string,
  _previousState: DiaryActionState,
  formData: FormData,
): Promise<DiaryActionState> {
  const intent = formData.get("intent") === "confirm" ? "confirm" : "save";
  const validation = validateSuggestion(formData, intent === "confirm");
  if (!validation.success) {
    return { status: "error", message: "Revise os campos indicados.", fieldErrors: validation.fieldErrors };
  }

  const { supabase, userId } = await authenticatedClient();
  const { data: suggestion, error } = await supabase
    .from("evidence_suggestions")
    .update(suggestionPayload(validation.data))
    .eq("id", suggestionId)
    .eq("user_id", userId)
    .eq("status", "for_review")
    .select("daily_log_id")
    .maybeSingle();

  if (error || !suggestion) {
    console.error("Suggestion review failed", { code: error?.code });
    return { status: "error", message: "Não foi possível salvar esta revisão." };
  }

  if (intent === "confirm") {
    const { error: confirmationError } = await supabase.rpc("confirm_evidence_suggestion", {
      p_suggestion_id: suggestionId,
    });
    if (confirmationError) {
      console.error("Evidence confirmation failed", { code: confirmationError.code });
      return {
        status: "error",
        message: "A revisão foi salva, mas a evidência não pôde ser confirmada. Tente novamente.",
      };
    }
  }

  revalidatePath("/app/diario");
  revalidatePath(`/app/diario/${suggestion.daily_log_id}`);
  return {
    status: "success",
    message: intent === "confirm" ? "Evidência confirmada." : "Revisão salva.",
  };
}

export async function rejectSuggestion(suggestionId: string, logId: string) {
  const { supabase, userId } = await authenticatedClient();
  const { error } = await supabase
    .from("evidence_suggestions")
    .update({ status: "rejected", updated_at: new Date().toISOString() })
    .eq("id", suggestionId)
    .eq("daily_log_id", logId)
    .eq("user_id", userId)
    .eq("status", "for_review");

  if (error) console.error("Suggestion rejection failed", { code: error.code });
  revalidatePath(`/app/diario/${logId}`);
  redirect(`/app/diario/${logId}?tab=sugestoes&notice=${error ? "reject-failed" : "rejected"}`);
}
