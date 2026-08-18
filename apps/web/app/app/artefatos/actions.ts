"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  buildArtifactContent, generatedBlockKeys, isArtifactType, validateArtifactContent, validateArtifactCreation,
  type ArtifactContent, type ArtifactEvidenceInput, type ArtifactMode, type ArtifactSourceMap, type ArtifactType, type SupplementaryData,
} from "@/lib/artifacts/artifact";
import { ARTIFACT_PROMPT_VERSION, ArtifactGenerationError, generateArtifactSelection } from "@/lib/groq/generate-artifact";
import { createClient } from "@/lib/supabase/server";

export type ArtifactActionState = { status: "idle" | "error"; message?: string; fieldErrors?: Record<string, string> };
export type ArtifactSaveResult = { ok: boolean; revision: number; message: string };

async function authenticatedClient() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const userId = typeof data?.claims?.sub === "string" ? data.claims.sub : null;
  if (!userId) redirect("/entrar");
  return { supabase, userId };
}

const evidenceSelect = "id, title, context, challenge, action, result, learning, competencies";

function noticeFor(error: unknown) {
  if (error instanceof ArtifactGenerationError) {
    if (error.code === "gap") return "gap";
    if (error.code === "timeout") return "timeout";
    if (error.code === "not_configured") return "not-configured";
  }
  return "generation-failed";
}

export async function createArtifact(_state: ArtifactActionState, formData: FormData): Promise<ArtifactActionState> {
  const validation = validateArtifactCreation(formData);
  if (!validation.success) return { status: "error", message: "Revise os campos e as evidências selecionadas.", fieldErrors: validation.fieldErrors };
  const { supabase, userId } = await authenticatedClient();
  const { data: evidences } = await supabase.from("evidences").select(evidenceSelect).eq("user_id", userId).eq("status", "confirmed").in("id", validation.data.evidenceIds);
  if (!evidences || evidences.length !== validation.data.evidenceIds.length) return { status: "error", message: "Uma evidência selecionada não está mais disponível." };
  const { data: artifactId, error } = await supabase.rpc("create_artifact", {
    p_type: validation.data.type,
    p_title: validation.data.title,
    p_objective: validation.data.objective,
    p_opportunity_context: validation.data.context,
    p_supplementary_data: validation.data.supplementary,
    p_evidence_ids: validation.data.evidenceIds,
  });
  if (error || typeof artifactId !== "string") {
    console.error("Artifact creation failed", { code: error?.code });
    return { status: "error", message: "Não foi possível criar o rascunho. Seus dados continuam no formulário." };
  }
  let notice = "created";
  try {
    const evidenceInputs = evidences as ArtifactEvidenceInput[];
    const { sourceMap, model } = await generateArtifactSelection({ type: validation.data.type, objective: validation.data.objective, context: validation.data.context, evidences: evidenceInputs, mode: "initial" });
    const content = buildArtifactContent({ type: validation.data.type, title: validation.data.title, objective: validation.data.objective, supplementary: validation.data.supplementary, sourceMap, evidences: evidenceInputs });
    const { error: versionError } = await supabase.rpc("apply_artifact_version", {
      p_artifact_id: artifactId, p_expected_revision: 1, p_content: content, p_source_map: sourceMap,
      p_trigger: "initial", p_section_key: null, p_model: model, p_prompt_version: ARTIFACT_PROMPT_VERSION,
    });
    if (versionError) throw new ArtifactGenerationError("invalid_output");
  } catch (generationError) {
    console.error("Artifact generation failed", { code: generationError instanceof ArtifactGenerationError ? generationError.code : "provider_error" });
    notice = noticeFor(generationError);
  }
  revalidatePath("/app/artefatos");
  redirect(`/app/artefatos/${artifactId}?notice=${notice}`);
}

type ArtifactRow = {
  id: string; type: ArtifactType; title: string; objective: string; opportunity_context: string | null; revision: number;
  working_content: unknown; supplementary_data: SupplementaryData;
};

async function generationContext(artifactId: string) {
  const { supabase, userId } = await authenticatedClient();
  const [{ data: artifact }, { data: sources }, { data: latest }] = await Promise.all([
    supabase.from("artifacts").select("id, type, title, objective, opportunity_context, revision, working_content, supplementary_data").eq("id", artifactId).eq("user_id", userId).maybeSingle(),
    supabase.from("artifact_sources").select("evidence_id").eq("artifact_id", artifactId).eq("user_id", userId).is("removed_at", null),
    supabase.from("artifact_versions").select("source_map").eq("artifact_id", artifactId).eq("user_id", userId).order("version", { ascending: false }).limit(1).maybeSingle(),
  ]);
  if (!artifact || !isArtifactType(artifact.type)) return null;
  const ids = (sources ?? []).map((item) => item.evidence_id);
  const { data: evidences } = ids.length ? await supabase.from("evidences").select(evidenceSelect).eq("user_id", userId).eq("status", "confirmed").in("id", ids) : { data: [] };
  if (!evidences?.length) return null;
  return { supabase, artifact: artifact as ArtifactRow, evidences: evidences as ArtifactEvidenceInput[], sourceMap: (latest?.source_map ?? {}) as ArtifactSourceMap };
}

export async function regenerateArtifact(artifactId: string, sectionKey: string, mode: Exclude<ArtifactMode, "initial">) {
  const context = await generationContext(artifactId);
  if (!context || !generatedBlockKeys(context.artifact.type).includes(sectionKey)) redirect(`/app/artefatos/${artifactId}?notice=unavailable`);
  let current: ArtifactContent;
  try { current = validateArtifactContent(context.artifact.working_content, context.artifact.type); }
  catch { redirect(`/app/artefatos/${artifactId}?notice=unavailable`); }
  let notice = "generated";
  try {
    const currentBody = current.blocks.find((item) => item.key === sectionKey)?.body ?? "";
    const generated = await generateArtifactSelection({ type: context.artifact.type, objective: context.artifact.objective, context: context.artifact.opportunity_context, evidences: context.evidences, mode, sectionKey, currentBody });
    const sourceMap = { ...context.sourceMap, ...generated.sourceMap };
    const content = buildArtifactContent({ type: context.artifact.type, title: context.artifact.title, objective: context.artifact.objective, supplementary: context.artifact.supplementary_data, sourceMap, evidences: context.evidences, current, sectionKey });
    const { error } = await context.supabase.rpc("apply_artifact_version", {
      p_artifact_id: artifactId, p_expected_revision: context.artifact.revision, p_content: content, p_source_map: sourceMap,
      p_trigger: mode, p_section_key: sectionKey, p_model: generated.model, p_prompt_version: ARTIFACT_PROMPT_VERSION,
    });
    if (error) notice = "conflict";
  } catch (error) {
    notice = noticeFor(error);
  }
  revalidatePath(`/app/artefatos/${artifactId}`); revalidatePath("/app/artefatos");
  redirect(`/app/artefatos/${artifactId}?notice=${notice}#block-${sectionKey}`);
}

export async function saveArtifactContent(artifactId: string, expectedRevision: number, contentValue: unknown, supplementary: SupplementaryData): Promise<ArtifactSaveResult> {
  const { supabase, userId } = await authenticatedClient();
  const { data: artifact } = await supabase.from("artifacts").select("type").eq("id", artifactId).eq("user_id", userId).maybeSingle();
  if (!artifact || !isArtifactType(artifact.type)) return { ok: false, revision: expectedRevision, message: "Artefato indisponível." };
  let content: ArtifactContent;
  try { content = validateArtifactContent(contentValue, artifact.type); }
  catch { return { ok: false, revision: expectedRevision, message: "O conteúdo contém uma seção inválida." }; }
  const { data, error } = await supabase.rpc("autosave_artifact", { p_artifact_id: artifactId, p_expected_revision: expectedRevision, p_content: content, p_supplementary_data: supplementary });
  if (error || typeof data !== "number") return { ok: false, revision: expectedRevision, message: error?.code === "40001" ? "Há uma versão mais recente. Recarregue antes de editar." : "Não foi possível salvar. Seu texto continua nesta tela." };
  return { ok: true, revision: data, message: "Salvo" };
}

export async function markArtifactReviewed(artifactId: string) {
  const { supabase, userId } = await authenticatedClient();
  const { data: artifact } = await supabase.from("artifacts").select("revision").eq("id", artifactId).eq("user_id", userId).maybeSingle();
  if (!artifact) redirect("/app/artefatos");
  const { error } = await supabase.rpc("mark_artifact_reviewed", { p_artifact_id: artifactId, p_expected_revision: artifact.revision });
  if (error) console.error("Artifact review failed", { code: error.code, message: error.message });
  revalidatePath(`/app/artefatos/${artifactId}`); revalidatePath("/app/artefatos");
  const notice = !error ? "reviewed" : error.code === "22023" ? "empty" : "conflict";
  redirect(`/app/artefatos/${artifactId}?notice=${notice}`);
}

export async function restoreArtifactVersion(artifactId: string, versionId: string) {
  const { supabase, userId } = await authenticatedClient();
  const { data: artifact } = await supabase.from("artifacts").select("revision").eq("id", artifactId).eq("user_id", userId).maybeSingle();
  if (!artifact) redirect("/app/artefatos");
  const { error } = await supabase.rpc("restore_artifact_version", { p_artifact_id: artifactId, p_version_id: versionId, p_expected_revision: artifact.revision });
  revalidatePath(`/app/artefatos/${artifactId}`); revalidatePath("/app/artefatos");
  redirect(`/app/artefatos/${artifactId}?notice=${error ? "conflict" : "restored"}`);
}

export async function saveLiveAsArtifact(sessionId: string, questionId: string, versionId: string) {
  const { supabase } = await authenticatedClient();
  const { data, error } = await supabase.rpc("create_artifact_from_live", { p_question_id: questionId, p_version_id: versionId });
  if (error || typeof data !== "string") redirect(`/app/live/${sessionId}?notice=artifact-failed#question-${questionId}`);
  revalidatePath("/app/artefatos"); redirect(`/app/artefatos/${data}?notice=live-saved`);
}
