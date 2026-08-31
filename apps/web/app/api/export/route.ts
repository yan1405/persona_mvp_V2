import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const { data: authData } = await supabase.auth.getClaims();

  if (!authData?.claims) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const userId = authData.claims.sub;

  const [
    profile,
    dailyLogs,
    evidenceSuggestions,
    evidences,
    evidenceSources,
    narrativeDiagnostics,
    narrativeScoreSnapshots,
    liveSessions,
    liveSessionEvidences,
    liveQuestions,
    liveDraftVersions,
    artifacts,
    artifactSources,
    artifactVersions,
  ] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", userId).maybeSingle(),
    supabase.from("daily_logs").select("*").eq("user_id", userId),
    supabase.from("evidence_suggestions").select("*").eq("user_id", userId),
    supabase.from("evidences").select("*").eq("user_id", userId),
    supabase.from("evidence_sources").select("*").eq("user_id", userId),
    supabase.from("narrative_diagnostics").select("*").eq("user_id", userId),
    supabase.from("narrative_score_snapshots").select("*").eq("user_id", userId),
    supabase.from("live_sessions").select("*").eq("user_id", userId),
    supabase.from("live_session_evidences").select("*").eq("user_id", userId),
    supabase.from("live_questions").select("*").eq("user_id", userId),
    supabase.from("live_draft_versions").select("*").eq("user_id", userId),
    supabase.from("artifacts").select("*").eq("user_id", userId),
    supabase.from("artifact_sources").select("*").eq("user_id", userId),
    supabase.from("artifact_versions").select("*").eq("user_id", userId),
  ]);

  const results = {
    profile,
    dailyLogs,
    evidenceSuggestions,
    evidences,
    evidenceSources,
    narrativeDiagnostics,
    narrativeScoreSnapshots,
    liveSessions,
    liveSessionEvidences,
    liveQuestions,
    liveDraftVersions,
    artifacts,
    artifactSources,
    artifactVersions,
  };
  const failed = Object.entries(results).find(([, result]) => result.error);

  if (failed) {
    console.error("Data export query failed:", failed[0], failed[1].error?.code);
    return NextResponse.json(
      { message: "Não foi possível preparar a exportação. Tente novamente." },
      { status: 500 },
    );
  }

  const exportData = {
    schemaVersion: 1,
    exportDate: new Date().toISOString(),
    profile: profile.data,
    dailyLogs: dailyLogs.data,
    evidenceSuggestions: evidenceSuggestions.data,
    evidences: evidences.data,
    evidenceSources: evidenceSources.data,
    narrativeDiagnostics: narrativeDiagnostics.data,
    narrativeScoreSnapshots: narrativeScoreSnapshots.data,
    liveSessions: liveSessions.data,
    liveSessionEvidences: liveSessionEvidences.data,
    liveQuestions: liveQuestions.data,
    liveDraftVersions: liveDraftVersions.data,
    artifacts: artifacts.data,
    artifactSources: artifactSources.data,
    artifactVersions: artifactVersions.data,
  };

  return new NextResponse(JSON.stringify(exportData, null, 2), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="persona-export-${new Date().toISOString().split("T")[0]}.json"`,
      "Cache-Control": "private, no-store",
    },
  });
}
