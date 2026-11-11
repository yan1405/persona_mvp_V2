import { Badge, Button, ButtonLink, Card, EntryCard, Icon, Input, type StatusKey } from "@/components/ds";
import { createClient } from "@/lib/supabase/server";

import { DiaryDetail } from "./diary-detail";
import { NewDailyLogForm } from "./diary-forms";

type DiarySearchParams = {
  q?: string;
  from?: string;
  to?: string;
  state?: string;
  notice?: string;
  abrir?: string;
  suggestion?: string;
};

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

function summary(content: string) {
  return content.length > 120 ? `${content.slice(0, 117)}…` : content;
}

function cardStatus(state: string | undefined): { status?: StatusKey; statusLabel: string; statusIcon?: "badge-check" | "triangle-alert" | "clock" } {
  if (state === "for_review") return { status: "para-revisar", statusLabel: "Sugestão para revisar" };
  if (state === "confirmed") return { statusLabel: "Evidência confirmada", statusIcon: "badge-check" };
  if (state === "failed") return { statusLabel: "Falha de estruturação", statusIcon: "triangle-alert" };
  return { statusLabel: "Sem sugestões ainda", statusIcon: "clock" };
}

export default async function DiaryPage({
  searchParams,
}: {
  searchParams: Promise<DiarySearchParams>;
}) {
  const filters = await searchParams;
  const supabase = await createClient();
  const [{ data: rawLogs, error }, { data: suggestionStates }] = await Promise.all([
    supabase
      .from("daily_logs")
      .select("id, content, context, occurred_on, status, created_at, updated_at")
      .order("occurred_on", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(100),
    supabase
      .from("evidence_suggestions")
      .select("daily_log_id, status, created_at")
      .order("created_at", { ascending: false })
      .limit(200),
  ]);

  const latestState = new Map<string, string>();
  suggestionStates?.forEach((item) => {
    if (!latestState.has(item.daily_log_id)) latestState.set(item.daily_log_id, item.status);
  });

  const query = filters.q?.trim().toLocaleLowerCase("pt-BR") ?? "";
  // ponytail: 100 registros locais bastam no MVP; migrar para busca paginada no Postgres quando o volume real exigir.
  const logs = (rawLogs ?? []).filter((log) => {
    const matchesText = !query || `${log.content} ${log.context ?? ""}`.toLocaleLowerCase("pt-BR").includes(query);
    const matchesFrom = !filters.from || log.occurred_on >= filters.from;
    const matchesTo = !filters.to || log.occurred_on <= filters.to;
    const state = latestState.get(log.id) ?? "raw";
    const matchesState = !filters.state || filters.state === "all" || state === filters.state;
    return matchesText && matchesFrom && matchesTo && matchesState;
  });

  const today = new Date().toLocaleDateString("en-CA", { timeZone: "America/Sao_Paulo" });

  const hasFilters = Boolean(filters.q || filters.from || filters.to || filters.state);

  return (
    <main className="dx-home">
      <header className="dx-home__greeting">
        <p className="dx-page__eyebrow">Diário</p>
        <h1 className="dx-home__title" id="diary-title">
          Registre o que aconteceu hoje.
        </h1>
        <p className="dx-home__text">Escreva primeiro com suas palavras. A estrutura vem depois e só vira evidência quando você confirmar.</p>
      </header>

      <Card padding={24} className="dx-home__block">
        <section aria-labelledby="diary-title">
          <NewDailyLogForm today={today} />
        </section>
      </Card>

      <section className="dx-home__section" aria-labelledby="history-title">
        <div className="dx-home__section-head">
          <h2 className="dx-home__h2" id="history-title">
            Histórico.
          </h2>
          <span className="dx-home__row-meta">{logs.length} de até 100</span>
        </div>

        {filters.notice === "deleted" && (
          <p className="dx-page__notice dx-page__notice--ok" role="status">
            <Icon name="circle-check" size={16} />
            Registro excluído.
          </p>
        )}

        <form className="dx-filters" method="get" role="search" aria-label="Filtrar o histórico">
          <Input variant="search" name="q" aria-label="Buscar no Diário" placeholder="Buscar no texto ou contexto" defaultValue={filters.q} />
          <Input name="from" type="date" aria-label="Data inicial" defaultValue={filters.from} />
          <Input name="to" type="date" aria-label="Data final" defaultValue={filters.to} />
          <select className="dx-select" name="state" aria-label="Estado" defaultValue={filters.state ?? "all"}>
            <option value="all">Todos os estados</option>
            <option value="for_review">Para revisar</option>
            <option value="confirmed">Confirmados</option>
            <option value="failed">Falha de estruturação</option>
            <option value="raw">Sem sugestão</option>
          </select>
          <Button variant="outline" size="sm" type="submit" icon="filter">
            Aplicar filtros
          </Button>
          {hasFilters && (
            <ButtonLink variant="ghost" size="sm" icon="x" href="/app/diario">
              Limpar
            </ButtonLink>
          )}
        </form>

        {error ? (
          <Card padding={24} className="dx-home__block">
            <div className="dx-home__section" role="alert">
              <Badge tone="danger" icon="triangle-alert">
                Histórico indisponível
              </Badge>
              <p className="dx-home__text">Não foi possível carregar seus registros. Atualize a página. O erro não altera o que já foi salvo.</p>
            </div>
          </Card>
        ) : !rawLogs?.length ? (
          <div className="dx-empty">
            <p className="dx-empty__title">Nenhum registro ainda.</p>
            <p className="dx-home__text">Use o editor acima para criar a primeira entrada do seu histórico profissional.</p>
          </div>
        ) : !logs.length ? (
          <div className="dx-empty" role="status">
            <p className="dx-empty__title">Nenhum registro encontrado.</p>
            <p className="dx-home__text">Limpe a busca ou amplie o período.</p>
            <ButtonLink variant="outline" size="sm" icon="x" href="/app/diario">
              Limpar filtros
            </ButtonLink>
          </div>
        ) : (
          <ul className="dx-grid">
            {logs.map((log) => (
              <li key={log.id}>
                <EntryCard
                  kind="registro"
                  date={dateFormatter.format(new Date(`${log.occurred_on}T00:00:00Z`))}
                  title={summary(log.content)}
                  meta={log.context ?? undefined}
                  href={`/app/diario?abrir=${log.id}`}
                  openLabel="Abrir registro"
                  {...cardStatus(latestState.get(log.id))}
                />
              </li>
            ))}
          </ul>
        )}
      </section>
      {filters.abrir ? <DiaryDetail id={filters.abrir} query={{ suggestion: filters.suggestion, notice: filters.notice }} /> : null}
    </main>
  );
}
