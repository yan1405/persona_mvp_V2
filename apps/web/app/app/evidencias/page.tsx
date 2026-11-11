import { Badge, ButtonLink, Button, Card, EvidenceCard, Icon, Input } from "@/components/ds";
import { evidenceLevel } from "@/lib/evidence/validation";
import { createClient } from "@/lib/supabase/server";

import { EvidenceDetail } from "./evidence-detail";
import { NewEvidenceForm } from "./evidence-forms";

type EvidenceSearchParams = {
  q?: string;
  view?: string;
  competency?: string;
  from?: string;
  to?: string;
  level?: string;
  state?: string;
  new?: string;
  notice?: string;
  abrir?: string;
};

type EvidenceRow = {
  id: string;
  source_log_id: string | null;
  title: string;
  context: string;
  action: string;
  result: string | null;
  competencies: string[];
  status: "confirmed" | "archived";
  confirmed_at: string;
  updated_at: string;
  evidence_sources: { id: string }[] | null;
};

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  timeZone: "America/Sao_Paulo",
});

export default async function EvidenceLibraryPage({ searchParams }: { searchParams: Promise<EvidenceSearchParams> }) {
  const filters = await searchParams;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("evidences")
    .select("id, source_log_id, title, context, action, result, competencies, status, confirmed_at, updated_at, evidence_sources(id)")
    .order("updated_at", { ascending: false })
    .limit(100);

  const rawEvidences = (data ?? []) as EvidenceRow[];
  const query = filters.q?.trim().toLocaleLowerCase("pt-BR") ?? "";
  const competency = filters.competency?.trim().toLocaleLowerCase("pt-BR") ?? "";
  const requestedState = filters.state ?? "confirmed";

  // ponytail: 100 registros locais bastam no MVP; migrar filtros para Postgres quando o volume real exigir paginação.
  const evidences = rawEvidences.filter((evidence) => {
    const sourceCount = evidence.evidence_sources?.length ?? 0;
    const level = sourceCount ? "documented" : "registered";
    const text = [evidence.title, evidence.context, evidence.action, evidence.result ?? "", ...evidence.competencies]
      .join(" ")
      .toLocaleLowerCase("pt-BR");
    const matchesView = filters.view !== "review" || (!sourceCount && evidence.status === "confirmed");
    const matchesState = requestedState === "all" || evidence.status === requestedState;
    const matchesLevel = !filters.level || filters.level === "all" || filters.level === level;
    const matchesCompetency = !competency || evidence.competencies.some((item) => item.toLocaleLowerCase("pt-BR") === competency);
    const confirmedDate = evidence.confirmed_at.slice(0, 10);
    return matchesView
      && matchesState
      && matchesLevel
      && matchesCompetency
      && (!query || text.includes(query))
      && (!filters.from || confirmedDate >= filters.from)
      && (!filters.to || confirmedDate <= filters.to);
  });

  const competencies = [...new Set(rawEvidences.flatMap((item) => item.competencies))]
    .sort((a, b) => a.localeCompare(b, "pt-BR"));
  const hasFilters = Boolean(filters.q || filters.view || filters.competency || filters.from || filters.to || filters.level || filters.state);

  return (
    <main className="dx-home">
      <header className="dx-home__head">
        <div className="dx-home__greeting">
          <p className="dx-page__eyebrow">Evidências</p>
          <h1 className="dx-home__title">Biblioteca profissional.</h1>
          <p className="dx-home__text">Consulte fatos que você confirmou e veja quais já possuem uma prova vinculada.</p>
        </div>
        <ButtonLink variant="brand" icon="plus" href="/app/evidencias?new=1#new-evidence">
          Registrar evidência
        </ButtonLink>
      </header>

      {filters.notice === "archived" && !filters.abrir && (
        <p className="dx-page__notice dx-page__notice--ok" role="status">
          <Icon name="circle-check" size={16} />
          Evidência arquivada. Ela continua disponível pelo filtro de estado.
        </p>
      )}

      {filters.new === "1" && (
        <Card padding={24} className="dx-home__block">
          <section className="dx-home__section" id="new-evidence" aria-labelledby="new-evidence-title">
            <div className="dx-home__section-head">
              <h2 className="dx-home__h2" id="new-evidence-title">
                O que esta experiência demonstra?
              </h2>
              <ButtonLink variant="ghost" size="sm" icon="x" href="/app/evidencias">
                Fechar
              </ButtonLink>
            </div>
            <NewEvidenceForm />
          </section>
        </Card>
      )}

      <section className="dx-home__section" aria-labelledby="evidence-list-title">
        <div className="dx-home__section-head">
          <h2 className="dx-home__h2" id="evidence-list-title">
            Evidências confirmadas.
          </h2>
          <span className="dx-home__row-meta">{evidences.length} de até 100</span>
        </div>

        <div className="dx-filters" role="group" aria-label="Filtros salvos">
          <ButtonLink variant={filters.view !== "review" ? "solid" : "outline"} size="sm" href="/app/evidencias">
            Todas
          </ButtonLink>
          <ButtonLink variant={filters.view === "review" ? "solid" : "outline"} size="sm" href="/app/evidencias?view=review">
            Para revisar
          </ButtonLink>
        </div>

        <form className="dx-filters" method="get" role="search" aria-label="Filtrar evidências">
          {filters.view && <input name="view" type="hidden" value={filters.view} />}
          <Input variant="search" name="q" aria-label="Buscar evidências" placeholder="Buscar título, contexto ou competência" defaultValue={filters.q} />
          <select className="dx-select" name="competency" aria-label="Competência" defaultValue={filters.competency ?? ""}>
            <option value="">Todas as competências</option>
            {competencies.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <select className="dx-select" name="level" aria-label="Nível" defaultValue={filters.level ?? "all"}>
            <option value="all">Todos os níveis</option>
            <option value="registered">Registradas</option>
            <option value="documented">Documentadas</option>
          </select>
          <select className="dx-select" name="state" aria-label="Estado" defaultValue={requestedState}>
            <option value="confirmed">Ativas</option>
            <option value="archived">Arquivadas</option>
            <option value="all">Todos os estados</option>
          </select>
          <Input name="from" type="date" aria-label="Data inicial" defaultValue={filters.from} />
          <Input name="to" type="date" aria-label="Data final" defaultValue={filters.to} />
          <Button variant="outline" size="sm" type="submit" icon="filter">
            Aplicar
          </Button>
          {hasFilters && (
            <ButtonLink variant="ghost" size="sm" icon="x" href="/app/evidencias">
              Limpar
            </ButtonLink>
          )}
        </form>

        {error ? (
          <Card padding={24} className="dx-home__block">
            <div className="dx-home__section" role="alert">
              <Badge tone="danger" icon="triangle-alert">
                Biblioteca indisponível
              </Badge>
              <p className="dx-home__text">Não foi possível carregar a Biblioteca. Atualize a página. Nenhuma evidência salva foi alterada.</p>
            </div>
          </Card>
        ) : !rawEvidences.length ? (
          <div className="dx-empty">
            <p className="dx-empty__title">Nenhuma evidência registrada.</p>
            <p className="dx-home__text">Confirme uma sugestão no Diário ou registre uma experiência diretamente.</p>
          </div>
        ) : !evidences.length ? (
          <div className="dx-empty" role="status">
            <p className="dx-empty__title">Nenhuma evidência encontrada.</p>
            <p className="dx-home__text">Limpe a busca ou amplie o período para recuperar outros fatos.</p>
            <ButtonLink variant="outline" size="sm" icon="x" href="/app/evidencias">
              Limpar filtros
            </ButtonLink>
          </div>
        ) : (
          <ul className="dx-grid">
            {evidences.map((evidence) => {
              const sourceCount = evidence.evidence_sources?.length ?? 0;
              return (
                <li key={evidence.id}>
                  <EvidenceCard
                    title={evidence.title}
                    competencies={evidence.competencies.slice(0, 3)}
                    level={evidenceLevel(sourceCount) === "Documentada" ? "Documentada" : "Registrada"}
                    proofCount={sourceCount}
                    origin={evidence.source_log_id ? "Diário" : "Manual"}
                    updatedAt={dateFormatter.format(new Date(evidence.updated_at))}
                    href={`/app/evidencias?abrir=${evidence.id}`}
                  />
                </li>
              );
            })}
          </ul>
        )}
      </section>
      {filters.abrir ? <EvidenceDetail id={filters.abrir} query={{ notice: filters.notice }} /> : null}
    </main>
  );
}
