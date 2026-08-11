"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { validateSuggestion, type SuggestionInput } from "@/lib/diary/validation";
import { validateEvidenceLink } from "@/lib/evidence/validation";
import { createClient } from "@/lib/supabase/server";

export type EvidenceActionState = {
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

function evidencePayload(data: SuggestionInput) {
  return {
    title: data.title,
    context: data.context,
    challenge: data.challenge,
    action: data.action,
    result: data.result,
    competencies: data.competencies,
    learning: data.learning,
    updated_at: new Date().toISOString(),
  };
}

export async function createEvidence(
  _previousState: EvidenceActionState,
  formData: FormData,
): Promise<EvidenceActionState> {
  const validation = validateSuggestion(formData, true);
  if (!validation.success) {
    return { status: "error", message: "Revise a evidência.", fieldErrors: validation.fieldErrors };
  }

  const { supabase, userId } = await authenticatedClient();
  const { data, error } = await supabase
    .from("evidences")
    .insert({
      ...evidencePayload(validation.data),
      user_id: userId,
      source_log_id: null,
      suggestion_id: null,
      status: "confirmed",
    })
    .select("id")
    .single();

  if (error || !data) {
    console.error("Evidence creation failed", { code: error?.code });
    return { status: "error", message: "Não foi possível registrar. Seus campos continuam no formulário." };
  }

  revalidatePath("/app/evidencias");
  redirect(`/app/evidencias/${data.id}?tab=resumo&notice=created`);
}

export async function updateEvidence(
  evidenceId: string,
  _previousState: EvidenceActionState,
  formData: FormData,
): Promise<EvidenceActionState> {
  const validation = validateSuggestion(formData, true);
  if (!validation.success) {
    return { status: "error", message: "Revise os campos indicados.", fieldErrors: validation.fieldErrors };
  }

  const { supabase, userId } = await authenticatedClient();
  const { data, error } = await supabase
    .from("evidences")
    .update(evidencePayload(validation.data))
    .eq("id", evidenceId)
    .eq("user_id", userId)
    .eq("status", "confirmed")
    .select("id")
    .maybeSingle();

  if (error || !data) {
    console.error("Evidence update failed", { code: error?.code });
    return { status: "error", message: "Não foi possível salvar as alterações." };
  }

  revalidatePath("/app/evidencias");
  revalidatePath(`/app/evidencias/${evidenceId}`);
  return { status: "success", message: "Evidência atualizada." };
}

export async function archiveEvidence(evidenceId: string) {
  await setEvidenceStatus(evidenceId, "archived");
  redirect("/app/evidencias?notice=archived");
}

export async function restoreEvidence(evidenceId: string) {
  await setEvidenceStatus(evidenceId, "confirmed");
  redirect(`/app/evidencias/${evidenceId}?notice=restored`);
}

async function setEvidenceStatus(evidenceId: string, status: "confirmed" | "archived") {
  const { supabase, userId } = await authenticatedClient();
  const { error } = await supabase
    .from("evidences")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", evidenceId)
    .eq("user_id", userId);

  if (error) {
    console.error("Evidence status update failed", { code: error.code });
    redirect(`/app/evidencias/${evidenceId}?notice=status-failed`);
  }

  revalidatePath("/app/evidencias");
  revalidatePath(`/app/evidencias/${evidenceId}`);
}

export async function addEvidenceLink(
  evidenceId: string,
  _previousState: EvidenceActionState,
  formData: FormData,
): Promise<EvidenceActionState> {
  const validation = validateEvidenceLink(formData);
  if (!validation.success) {
    return { status: "error", message: "Revise o link.", fieldErrors: validation.fieldErrors };
  }

  const { supabase, userId } = await authenticatedClient();
  const { error } = await supabase.from("evidence_sources").insert({
    user_id: userId,
    evidence_id: evidenceId,
    source_type: "link",
    title: validation.data.title,
    url: validation.data.url,
  });

  if (error) {
    console.error("Evidence link creation failed", { code: error.code });
    return {
      status: "error",
      message: error.code === "23505" ? "Este link já está vinculado." : "Não foi possível adicionar o link.",
    };
  }

  revalidatePath("/app/evidencias");
  revalidatePath(`/app/evidencias/${evidenceId}`);
  return { status: "success", message: "Link adicionado. A evidência agora está Documentada." };
}

export async function removeEvidenceLink(sourceId: string, evidenceId: string) {
  const { supabase, userId } = await authenticatedClient();
  const { error } = await supabase
    .from("evidence_sources")
    .delete()
    .eq("id", sourceId)
    .eq("evidence_id", evidenceId)
    .eq("user_id", userId);

  if (error) console.error("Evidence link removal failed", { code: error.code });
  revalidatePath("/app/evidencias");
  revalidatePath(`/app/evidencias/${evidenceId}`);
  redirect(`/app/evidencias/${evidenceId}?tab=provas&notice=${error ? "link-remove-failed" : "link-removed"}`);
}
