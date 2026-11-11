import { Badge, Card, EntryCard } from "@/components/ds";
import { createClient } from "@/lib/supabase/server";

import { NewLiveSessionForm } from "./live-forms";

type Session = { id: string; target_role: string; company: string; status: "preparing" | "active" | "paused" | "closed"; updated_at: string; live_questions: { count: number }[] | null };
const statusLabel = { preparing: "Preparação", active: "Ativa", paused: "Pausada", closed: "Encerrada" } as const;
const date = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit", timeZone: "America/Sao_Paulo" });

export default async function LivePage() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("live_sessions").select("id, target_role, company, status, updated_at, live_questions(count)").order("updated_at", { ascending: false }).limit(30);
  const sessions = (data ?? []) as Session[];
  return (
    <main className="dx-home">
      <header className="dx-home__head">
        <div className="dx-home__greeting">
          <p className="dx-page__eyebrow">Persona Live</p>
          <h1 className="dx-home__title">Fatos prontos para a conversa.</h1>
          <p className="dx-home__text">Prepare uma oportunidade, autorize seu repertório e transforme perguntas em respostas sustentadas.</p>
        </div>
        <Badge tone="neutral" icon="pen-line">
          Modo manual
        </Badge>
      </header>

      <Card padding={24} className="dx-home__block">
        <section className="dx-home__section" aria-labelledby="new-live-title">
          <h2 className="dx-home__h2" id="new-live-title">
            Qual conversa você vai enfrentar?
          </h2>
          <NewLiveSessionForm />
        </section>
      </Card>

      <section className="dx-home__section" aria-labelledby="live-history-title">
        <div className="dx-home__section-head">
          <h2 className="dx-home__h2" id="live-history-title">
            Sessões recentes.
          </h2>
          <span className="dx-home__row-meta">{sessions.length} de até 30</span>
        </div>
        {error ? (
          <Card padding={24} className="dx-home__block">
            <div className="dx-home__section" role="alert">
              <Badge tone="danger" icon="triangle-alert">
                Sessões indisponíveis
              </Badge>
              <p className="dx-home__text">Não foi possível carregar as sessões. Atualize a página. Nenhuma sessão foi alterada.</p>
            </div>
          </Card>
        ) : !sessions.length ? (
          <div className="dx-empty">
            <p className="dx-empty__title">Nenhuma sessão preparada.</p>
            <p className="dx-home__text">Preencha o contexto acima para escolher as evidências da primeira conversa.</p>
          </div>
        ) : (
          <ul className="dx-grid">
            {sessions.map((session) => (
              <li key={session.id}>
                <EntryCard
                  kind="sessao"
                  date={date.format(new Date(session.updated_at))}
                  title={session.target_role}
                  meta={`${session.company} · ${session.live_questions?.[0]?.count ?? 0} perguntas`}
                  statusLabel={statusLabel[session.status]}
                  statusIcon={session.status === "closed" ? "lock" : "clock"}
                  href={`/app/live/${session.id}`}
                  openLabel="Abrir sessão"
                />
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
