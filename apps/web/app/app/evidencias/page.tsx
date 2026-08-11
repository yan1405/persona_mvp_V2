import Link from "next/link";

import { evidenceLevel } from "@/lib/evidence/validation";
import { createClient } from "@/lib/supabase/server";

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
    <main className="app-page evidence-page">
      <header className="evidence-heading">
        <div>
          <p className="eyebrow">Evidências</p>
          <h1>Biblioteca profissional</h1>
          <p>Consulte fatos que você confirmou e veja quais já possuem uma prova vinculada.</p>
        </div>
        <Link className="button-primary evidence-new-link" href="/app/evidencias?new=1#new-evidence">Registrar evidência</Link>
      </header>

      {filters.notice === "archived" && <p className="inline-notice" role="status">Evidência arquivada. Ela continua disponível pelo filtro de estado.</p>}

      {filters.new === "1" && (
        <section className="evidence-create" id="new-evidence" aria-labelledby="new-evidence-title">
          <div className="section-heading-row">
            <div>
              <p className="eyebrow">Registro manual</p>
              <h2 id="new-evidence-title">O que esta experiência demonstra?</h2>
            </div>
            <Link className="filter-clear" href="/app/evidencias">Fechar</Link>
          </div>
          <NewEvidenceForm />
        </section>
      )}

      <section className="evidence-library" aria-labelledby="evidence-list-title">
        <div className="section-heading-row">
          <div>
            <p className="eyebrow">Acervo</p>
            <h2 id="evidence-list-title">Evidências confirmadas</h2>
          </div>
          <span className="history-count">{evidences.length} de até 100</span>
        </div>

        <nav className="saved-filters" aria-label="Filtros salvos">
          <Link data-active={filters.view !== "review"} href="/app/evidencias">Todas</Link>
          <Link data-active={filters.view === "review"} href="/app/evidencias?view=review">Para revisar</Link>
        </nav>

        <form className="evidence-filters" method="get" role="search">
          {filters.view && <input name="view" type="hidden" value={filters.view} />}
          <label>
            <span className="sr-only">Buscar evidências</span>
            <input className="text-field" name="q" defaultValue={filters.q} placeholder="Buscar título, contexto ou competência" />
          </label>
          <label>
            <span className="sr-only">Competência</span>
            <select className="text-field" name="competency" defaultValue={filters.competency ?? ""}>
              <option value="">Todas as competências</option>
              {competencies.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </label>
          <label>
            <span className="sr-only">Nível</span>
            <select className="text-field" name="level" defaultValue={filters.level ?? "all"}>
              <option value="all">Todos os níveis</option>
              <option value="registered">Registradas</option>
              <option value="documented">Documentadas</option>
            </select>
          </label>
          <label>
            <span className="sr-only">Estado</span>
            <select className="text-field" name="state" defaultValue={requestedState}>
              <option value="confirmed">Ativas</option>
              <option value="archived">Arquivadas</option>
              <option value="all">Todos os estados</option>
            </select>
          </label>
          <label>
            <span className="sr-only">Data inicial</span>
            <input className="text-field" name="from" type="date" defaultValue={filters.from} />
          </label>
          <label>
            <span className="sr-only">Data final</span>
            <input className="text-field" name="to" type="date" defaultValue={filters.to} />
          </label>
          <button className="button-secondary" type="submit">Aplicar</button>
          {hasFilters && <Link className="filter-clear" href="/app/evidencias">Limpar</Link>}
        </form>

        {error ? (
          <div className="empty-state" role="alert">
            <strong>Não foi possível carregar a Biblioteca.</strong>
            <p>Atualize a página. Nenhuma evidência salva foi alterada.</p>
          </div>
        ) : !rawEvidences.length ? (
          <div className="empty-state">
            <strong>Nenhuma evidência registrada</strong>
            <p>Confirme uma sugestão no Diário ou registre uma experiência diretamente.</p>
            <Link href="/app/evidencias?new=1#new-evidence">Registrar primeira evidência</Link>
          </div>
        ) : !evidences.length ? (
          <div className="empty-state">
            <strong>Nenhuma evidência com estes filtros</strong>
            <p>Limpe a busca ou amplie o período para recuperar outros fatos.</p>
            <Link href="/app/evidencias">Limpar filtros</Link>
          </div>
        ) : (
          <ol className="evidence-list">
            {evidences.map((evidence) => {
              const sourceCount = evidence.evidence_sources?.length ?? 0;
              return (
                <li key={evidence.id}>
                  <Link href={`/app/evidencias/${evidence.id}`}>
                    <div className="evidence-list-main">
                      <strong>{evidence.title}</strong>
                      <p>{evidence.context}</p>
                      <span>{evidence.competencies.slice(0, 3).join(" · ")}</span>
                    </div>
                    <span className="evidence-origin">{evidence.source_log_id ? "Diário" : "Manual"}</span>
                    <span className="evidence-level" data-level={sourceCount ? "documented" : "registered"}>{evidenceLevel(sourceCount)}</span>
                    <time dateTime={evidence.updated_at}>{dateFormatter.format(new Date(evidence.updated_at))}</time>
                    <span aria-hidden>→</span>
                  </Link>
                </li>
              );
            })}
          </ol>
        )}
      </section>
    </main>
  );
}
