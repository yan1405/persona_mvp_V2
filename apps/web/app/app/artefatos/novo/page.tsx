import Link from "next/link";

import { createClient } from "@/lib/supabase/server";

import { NewArtifactForm, type ArtifactEvidenceOption } from "../artifact-forms";

export default async function NewArtifactPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("evidences").select("id, title, context, competencies").eq("status", "confirmed").order("updated_at", { ascending: false }).limit(100);
  return <main className="app-page artifact-new-page"><header className="artifact-new-heading"><div><Link href="/app/artefatos">← Artefatos</Link><p className="eyebrow">Novo Artefato</p><h1>Da evidência para um material utilizável</h1><p>Defina o objetivo, confirme seus dados e autorize os fatos antes da primeira geração.</p></div><span>4 etapas</span></header><NewArtifactForm evidences={(data ?? []) as ArtifactEvidenceOption[]} /></main>;
}
