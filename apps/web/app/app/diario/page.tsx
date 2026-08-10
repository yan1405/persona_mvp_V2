import Link from "next/link";

import { createClient } from "@/lib/supabase/server";

import { NewDailyLogForm } from "./diary-forms";

type DiarySearchParams = {
  q?: string;
  from?: string;
  to?: string;
  state?: string;
  notice?: string;
};

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

function summary(content: string) {
  return content.length > 150 ? `${content.slice(0, 147)}…` : content;
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

  return (
    <main className="app-page diary-page">
      <section className="diary-capture" aria-labelledby="diary-title">
        <div className="diary-heading">
          <div>
            <p className="eyebrow">Diário</p>
            <h1 id="diary-title">O que aconteceu hoje?</h1>
            <p>Registre primeiro com suas palavras. A estrutura vem depois e só vira evidência quando você confirmar.</p>
          </div>
          <div className="trace-compact" aria-label="Fluxo do registro">
            <span data-current="true">Registro</span>
            <span>Sugestão</span>
            <span>Evidência</span>
          </div>
        </div>
        <NewDailyLogForm today={today} />
      </section>

      <section className="diary-history" aria-labelledby="history-title">
        <div className="section-heading-row">
          <div>
            <p className="eyebrow">Histórico</p>
            <h2 id="history-title">Registros recentes</h2>
          </div>
          <span className="history-count">{logs.length} de até 100</span>
        </div>

        {filters.notice === "deleted" && <p className="inline-notice" role="status">Registro excluído.</p>}

        <form className="diary-filters" method="get" role="search">
          <label>
            <span className="sr-only">Buscar no Diário</span>
            <input className="text-field" name="q" defaultValue={filters.q} placeholder="Buscar no texto ou contexto" />
          </label>
          <label>
            <span className="sr-only">Data inicial</span>
            <input className="text-field" name="from" type="date" defaultValue={filters.from} />
          </label>
          <label>
            <span className="sr-only">Data final</span>
            <input className="text-field" name="to" type="date" defaultValue={filters.to} />
          </label>
          <label>
            <span className="sr-only">Estado</span>
            <select className="text-field" name="state" defaultValue={filters.state ?? "all"}>
              <option value="all">Todos os estados</option>
              <option value="for_review">Para revisar</option>
              <option value="confirmed">Confirmados</option>
              <option value="failed">Falha de estruturação</option>
              <option value="raw">Sem sugestão</option>
            </select>
          </label>
          <button className="button-secondary" type="submit">Aplicar filtros</button>
          {(filters.q || filters.from || filters.to || filters.state) && <Link className="filter-clear" href="/app/diario">Limpar</Link>}
        </form>

        {error ? (
          <div className="empty-state" role="alert">
            <strong>Não foi possível carregar seus registros.</strong>
            <p>Atualize a página. O erro não altera o que já foi salvo.</p>
          </div>
        ) : !rawLogs?.length ? (
          <div className="empty-state">
            <strong>Nenhum registro ainda</strong>
            <p>Use o editor acima para criar a primeira entrada do seu histórico profissional.</p>
          </div>
        ) : !logs.length ? (
          <div className="empty-state">
            <strong>Nenhum resultado com estes filtros</strong>
            <p>Limpe a busca ou amplie o período.</p>
            <Link href="/app/diario">Limpar filtros</Link>
          </div>
        ) : (
          <ol className="diary-list">
            {logs.map((log) => {
              const suggestionState = latestState.get(log.id);
              return (
                <li key={log.id}>
                  <Link href={`/app/diario/${log.id}`}>
                    <time dateTime={log.occurred_on}>{dateFormatter.format(new Date(`${log.occurred_on}T00:00:00Z`))}</time>
                    <div>
                      <strong>{log.context || "Sem contexto declarado"}</strong>
                      <p>{summary(log.content)}</p>
                    </div>
                    <span className="log-state" data-state={suggestionState || log.status}>
                      {suggestionState === "for_review" ? "Para revisar" : suggestionState === "confirmed" ? "Evidência confirmada" : suggestionState === "failed" ? "Falha" : "Registro"}
                    </span>
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
