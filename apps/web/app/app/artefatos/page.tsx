import { ArtifactCard, Badge, Button, ButtonLink, Card, Input, type ArtifactType as DsArtifactType } from "@/components/ds";
import { artifactTypeLabel, isArtifactType, type ArtifactType } from "@/lib/artifacts/artifact";
import { createClient } from "@/lib/supabase/server";

type Params = { q?: string; type?: string; state?: string; from?: string; to?: string };
type Row = { id: string; type: ArtifactType; title: string; objective: string; status: "draft" | "reviewed"; updated_at: string; artifact_sources: { count: number }[] | null };
const date = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short", year: "numeric", timeZone: "America/Sao_Paulo" });
const dsType = (type: ArtifactType): DsArtifactType => (type === "resume" ? "curriculo" : type);

export default async function ArtifactsPage({ searchParams }: { searchParams: Promise<Params> }) {
  const filters = await searchParams;
  const supabase = await createClient();
  const { data, error } = await supabase.from("artifacts").select("id, type, title, objective, status, updated_at, artifact_sources(count)").order("updated_at", { ascending: false }).limit(100);
  const raw = (data ?? []).filter((item) => isArtifactType(item.type)) as Row[];
  const query = filters.q?.trim().toLocaleLowerCase("pt-BR") ?? "";
  const rows = raw.filter(
    (item) =>
      (!query || `${item.title} ${item.objective}`.toLocaleLowerCase("pt-BR").includes(query)) &&
      (!filters.type || filters.type === "all" || item.type === filters.type) &&
      (!filters.state || filters.state === "all" || item.status === filters.state) &&
      (!filters.from || item.updated_at.slice(0, 10) >= filters.from) &&
      (!filters.to || item.updated_at.slice(0, 10) <= filters.to),
  );
  const hasFilters = Boolean(filters.q || filters.type || filters.state || filters.from || filters.to);
  return (
    <main className="dx-home">
      <header className="dx-home__head">
        <div className="dx-home__greeting">
          <p className="dx-page__eyebrow">Artefatos</p>
          <h1 className="dx-home__title">Materiais que você consegue sustentar.</h1>
          <p className="dx-home__text">Crie, revise e recupere documentos profissionais conectados ao seu repertório real.</p>
        </div>
        <ButtonLink variant="brand" icon="plus" href="/app/artefatos/novo">
          Novo Artefato
        </ButtonLink>
      </header>

      <section className="dx-home__section" aria-labelledby="artifacts-list-title">
        <div className="dx-home__section-head">
          <h2 className="dx-home__h2" id="artifacts-list-title">
            Artefatos recentes.
          </h2>
          <span className="dx-home__row-meta">{rows.length} de até 100</span>
        </div>

        <form className="dx-filters" method="get" role="search" aria-label="Filtrar artefatos">
          <Input variant="search" name="q" aria-label="Buscar artefatos" placeholder="Buscar título ou objetivo" defaultValue={filters.q} />
          <select className="dx-select" name="type" aria-label="Tipo" defaultValue={filters.type ?? "all"}>
            <option value="all">Todos os tipos</option>
            {(["star", "pitch", "resume", "portfolio"] as ArtifactType[]).map((type) => (
              <option key={type} value={type}>
                {artifactTypeLabel[type]}
              </option>
            ))}
          </select>
          <select className="dx-select" name="state" aria-label="Estado" defaultValue={filters.state ?? "all"}>
            <option value="all">Todos os estados</option>
            <option value="draft">Rascunhos</option>
            <option value="reviewed">Revisados</option>
          </select>
          <Input name="from" type="date" aria-label="Data inicial" defaultValue={filters.from} />
          <Input name="to" type="date" aria-label="Data final" defaultValue={filters.to} />
          <Button variant="outline" size="sm" type="submit" icon="filter">
            Aplicar
          </Button>
          {hasFilters && (
            <ButtonLink variant="ghost" size="sm" icon="x" href="/app/artefatos">
              Limpar
            </ButtonLink>
          )}
        </form>

        {error ? (
          <Card padding={24} className="dx-home__block">
            <div className="dx-home__section" role="alert">
              <Badge tone="danger" icon="triangle-alert">
                Artefatos indisponíveis
              </Badge>
              <p className="dx-home__text">Não foi possível carregar os Artefatos. Atualize a página. Nenhum conteúdo foi alterado.</p>
            </div>
          </Card>
        ) : !raw.length ? (
          <div className="dx-empty">
            <p className="dx-empty__title">Nenhum Artefato criado.</p>
            <p className="dx-home__text">Comece por uma Resposta STAR ou escolha outro material profissional.</p>
            <ButtonLink variant="outline" size="sm" href="/app/artefatos/novo">
              Criar primeiro Artefato
            </ButtonLink>
          </div>
        ) : !rows.length ? (
          <div className="dx-empty" role="status">
            <p className="dx-empty__title">Nenhum Artefato encontrado.</p>
            <p className="dx-home__text">Limpe a busca ou amplie o período.</p>
            <ButtonLink variant="outline" size="sm" icon="x" href="/app/artefatos">
              Limpar filtros
            </ButtonLink>
          </div>
        ) : (
          <ul className="dx-grid">
            {rows.map((artifact) => {
              const count = artifact.artifact_sources?.[0]?.count ?? 0;
              return (
                <li key={artifact.id}>
                  <ArtifactCard
                    type={dsType(artifact.type)}
                    title={artifact.title}
                    objective={artifact.objective}
                    status={artifact.status === "reviewed" ? "revisado" : "rascunho"}
                    updated={date.format(new Date(artifact.updated_at))}
                    sources={count ? [`${count} ${count === 1 ? "evidência" : "evidências"}`] : []}
                    href={`/app/artefatos/${artifact.id}`}
                  />
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </main>
  );
}
