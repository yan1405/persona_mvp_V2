import { ButtonLink } from "@/components/ds";
import { evidenceLevel } from "@/lib/evidence/validation";
import { createClient } from "@/lib/supabase/server";

import { NewArtifactForm, type ArtifactEvidenceOption } from "../artifact-forms";

type Row = { id: string; title: string; context: string; competencies: string[] | null; evidence_sources: { id: string }[] | null };

export default async function NewArtifactPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("evidences").select("id, title, context, competencies, evidence_sources(id)").eq("status", "confirmed").order("updated_at", { ascending: false }).limit(100);
  const evidences: ArtifactEvidenceOption[] = ((data ?? []) as Row[]).map((row) => {
    const proofCount = row.evidence_sources?.length ?? 0;
    return { id: row.id, title: row.title, context: row.context, competencies: row.competencies ?? [], level: evidenceLevel(proofCount), proofCount };
  });
  return (
    <main className="dx-home">
      <header className="dx-home__head">
        <div className="dx-home__greeting">
          <ButtonLink variant="ghost" size="sm" icon="arrow-left" href="/app/artefatos">
            Artefatos
          </ButtonLink>
          <p className="dx-page__eyebrow">Novo Artefato</p>
          <h1 className="dx-home__title">Da evidência para um material utilizável.</h1>
          <p className="dx-home__text">Defina o objetivo, confirme seus dados e autorize os fatos antes da primeira geração.</p>
        </div>
      </header>
      <NewArtifactForm evidences={evidences} />
    </main>
  );
}
