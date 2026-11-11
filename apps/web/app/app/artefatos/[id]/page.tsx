import { notFound } from "next/navigation";

import { Badge, Button, ButtonLink, Card, EntryCard, Icon } from "@/components/ds";
import { artifactTypeLabel, buildArtifactContent, isArtifactType, validateArtifactContent, type ArtifactContent, type ArtifactSourceMap, type ArtifactType, type SupplementaryData } from "@/lib/artifacts/artifact";
import { createClient } from "@/lib/supabase/server";

import { restoreArtifactVersion } from "../actions";
import { ArtifactEditor } from "../artifact-forms";

type Artifact = { id: string; type: ArtifactType; title: string; objective: string; opportunity_context: string | null; status: "draft" | "reviewed"; revision: number; working_content: unknown; supplementary_data: SupplementaryData; origin_type: string | null; updated_at: string };
type Source = { evidence_id: string; removed_at: string | null; evidences: { id: string; title: string; context: string; status: "confirmed" | "archived" } | { id: string; title: string; context: string; status: "confirmed" | "archived" }[] | null };
type Version = { id: string; version: number; trigger: string; section_key: string | null; source_map: ArtifactSourceMap; created_at: string };
const triggerLabel: Record<string, string> = { initial: "Geração inicial", shorter: "Encurtada", deeper: "Aprofundada", adapted: "Adaptada ao objetivo", alternative: "Alternativa", reviewed: "Marcada como revisada", restored: "Versão restaurada" };
const date = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", timeZone: "America/Sao_Paulo" });
const notices: Record<string, string> = { created: "Primeiro rascunho criado com fontes autorizadas.", gap: "As evidências não sustentam todas as partes necessárias. Registre os fatos ausentes e tente novamente.", timeout: "A geração demorou além do limite. O contexto e as fontes foram preservados.", "not-configured": "A geração está indisponível neste ambiente. O rascunho e as fontes foram preservados.", "generation-failed": "Não foi possível gerar com segurança. Nenhuma edição foi perdida.", generated: "Nova versão criada somente para a seção selecionada.", conflict: "Uma edição mais recente foi preservada. Recarregue antes de tentar novamente.", empty: "Preencha pelo menos uma seção antes de marcar o artefato como revisado.", reviewed: "Artefato marcado como revisado.", restored: "Versão restaurada como novo rascunho.", "live-saved": "Resposta do Persona Live salva como STAR em rascunho.", unavailable: "Esta ação não está disponível para a seção atual." };
const errorNotices = ["gap", "timeout", "not-configured", "generation-failed", "conflict", "empty", "unavailable"];

export default async function ArtifactDetailPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ notice?: string }> }) {
  const { id } = await params;
  const query = await searchParams;
  const supabase = await createClient();
  const [{ data: artifactValue }, { data: sourceValue }, { data: versionValue }] = await Promise.all([
    supabase.from("artifacts").select("id, type, title, objective, opportunity_context, status, revision, working_content, supplementary_data, origin_type, updated_at").eq("id", id).maybeSingle(),
    supabase.from("artifact_sources").select("evidence_id, removed_at, evidences(id, title, context, status)").eq("artifact_id", id).order("authorized_at", { ascending: true }),
    supabase.from("artifact_versions").select("id, version, trigger, section_key, source_map, created_at").eq("artifact_id", id).order("version", { ascending: false }),
  ]);
  if (!artifactValue || !isArtifactType(artifactValue.type)) notFound();
  const artifact = artifactValue as Artifact;
  const sources = (sourceValue ?? []) as Source[];
  const versions = (versionValue ?? []) as Version[];
  const latestSourceMap = versions[0]?.source_map ?? {};
  const sourceTitles = Object.fromEntries(sources.map((source) => { const evidence = Array.isArray(source.evidences) ? source.evidences[0] : source.evidences; return [source.evidence_id, evidence?.title ?? "Evidência indisponível"]; }));
  let content: ArtifactContent;
  try { content = validateArtifactContent(artifact.working_content, artifact.type); }
  catch { content = buildArtifactContent({ type: artifact.type, title: artifact.title, objective: artifact.objective, supplementary: artifact.supplementary_data, sourceMap: {}, evidences: [] }); }
  const notice = query.notice ?? "";
  const message = notices[notice];
  const failed = errorNotices.includes(notice);

  return (
    <main className="dx-home">
      <header className="dx-home__head">
        <div className="dx-home__greeting">
          <ButtonLink variant="ghost" size="sm" icon="arrow-left" href="/app/artefatos">
            Artefatos
          </ButtonLink>
          <p className="dx-page__eyebrow">{artifactTypeLabel[artifact.type]}</p>
          <h1 className="dx-home__title">{artifact.title}.</h1>
          <p className="dx-home__text">
            {artifact.objective}
            {artifact.opportunity_context ? ` · ${artifact.opportunity_context}` : ""}
          </p>
        </div>
        <Badge status={artifact.status === "reviewed" ? "revisado" : "rascunho"} />
      </header>

      {message && (
        <p className={`dx-page__notice ${failed ? "dx-page__notice--error" : "dx-page__notice--ok"}`} role="status">
          <Icon name={failed ? "triangle-alert" : "circle-check"} size={16} />
          {message}
        </p>
      )}

      <ArtifactEditor artifactId={id} type={artifact.type} initialContent={content} initialRevision={artifact.revision} supplementary={artifact.supplementary_data} sourceMap={latestSourceMap} sourceTitles={sourceTitles} reviewed={artifact.status === "reviewed"} />

      <section className="dx-home__section dx-ws__screen" aria-labelledby="sources-title">
        <div className="dx-home__section-head">
          <h2 className="dx-home__h2" id="sources-title">
            Fontes autorizadas.
          </h2>
          <span className="dx-home__row-meta">{sources.length} fontes</span>
        </div>
        <p className="dx-home__text">Dados complementares confirmados manualmente não aparecem como evidências.</p>
        {sources.length ? (
          <Card padding={24} className="dx-home__block">
            <ol className="dx-ws__src">
              {sources.map((source) => {
                const evidence = Array.isArray(source.evidences) ? source.evidences[0] : source.evidences;
                const unavailable = evidence?.status === "archived" || Boolean(source.removed_at);
                return (
                  <li key={source.evidence_id}>
                    <div className="dx-ws__src-row">
                      <strong>{evidence?.title ?? "Evidência indisponível"}</strong>
                      <Badge tone={unavailable ? "neutral" : "success"} icon={unavailable ? "lock" : "badge-check"}>
                        {unavailable ? "Indisponível para nova geração" : "Autorizada"}
                      </Badge>
                    </div>
                    <span>{evidence?.context ?? "A fonte histórica foi preservada, mas o conteúdo não está acessível."}</span>
                    {evidence && (
                      <div>
                        <ButtonLink variant="ghost" size="sm" iconRight="arrow-right" href={`/app/evidencias?abrir=${evidence.id}`}>
                          Abrir fonte
                        </ButtonLink>
                      </div>
                    )}
                  </li>
                );
              })}
            </ol>
          </Card>
        ) : (
          <div className="dx-empty">
            <p className="dx-empty__title">Nenhuma fonte autorizada.</p>
            <p className="dx-home__text">Este Artefato não tem evidências vinculadas.</p>
          </div>
        )}
      </section>

      <section className="dx-home__section dx-ws__screen" aria-labelledby="versions-title">
        <div className="dx-home__section-head">
          <h2 className="dx-home__h2" id="versions-title">
            Versões do Artefato.
          </h2>
          <span className="dx-home__row-meta">{versions.length} versões</span>
        </div>
        <p className="dx-home__text">Autosaves não criam versões. Aqui aparecem apenas os checkpoints aprovados.</p>
        {versions.length ? (
          <ol className="dx-ws__versions">
            {versions.map((version, index) => (
              <li key={version.id} className="dx-ws__version">
                <EntryCard
                  kind="versao"
                  date={date.format(new Date(version.created_at))}
                  title={triggerLabel[version.trigger] ?? version.trigger}
                  meta={version.section_key ? `Seção: ${version.section_key}` : "Artefato completo"}
                  statusLabel={`Versão ${String(version.version).padStart(2, "0")}`}
                  statusIcon="history"
                />
                {index > 0 && (
                  <form action={restoreArtifactVersion.bind(null, id, version.id)}>
                    <Button variant="outline" size="sm" type="submit" icon="refresh-cw">
                      Restaurar
                    </Button>
                  </form>
                )}
              </li>
            ))}
          </ol>
        ) : (
          <div className="dx-empty">
            <p className="dx-empty__title">Nenhuma versão gerada.</p>
            <p className="dx-home__text">O contexto e as fontes estão preservados. Tente a geração novamente quando o serviço estiver disponível.</p>
          </div>
        )}
      </section>
    </main>
  );
}
