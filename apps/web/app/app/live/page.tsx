import Link from "next/link";

import { createClient } from "@/lib/supabase/server";

import { NewLiveSessionForm } from "./live-forms";

type Session = { id: string; target_role: string; company: string; status: "preparing" | "active" | "paused" | "closed"; updated_at: string; live_questions: { count: number }[] | null };
const statusLabel = { preparing: "Preparação", active: "Ativa", paused: "Pausada", closed: "Encerrada" };
const date = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit", timeZone: "America/Sao_Paulo" });

export default async function LivePage() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("live_sessions").select("id, target_role, company, status, updated_at, live_questions(count)").order("updated_at", { ascending: false }).limit(30);
  const sessions = (data ?? []) as Session[];
  return (
    <main className="app-page live-index-page">
      <header className="live-index-heading"><div><p className="eyebrow">Persona Live</p><h1>Fatos prontos para a conversa</h1><p>Prepare uma oportunidade, autorize seu repertório e transforme perguntas em respostas sustentadas.</p></div><span className="live-manual-tag">Modo manual</span></header>
      <section className="live-new-session" aria-labelledby="new-live-title"><div className="section-heading-row"><div><p className="eyebrow">Nova preparação</p><h2 id="new-live-title">Qual conversa você vai enfrentar?</h2></div><span className="history-count">Contexto primeiro</span></div><NewLiveSessionForm /></section>
      <section className="live-history" aria-labelledby="live-history-title"><div className="section-heading-row"><div><p className="eyebrow">Histórico</p><h2 id="live-history-title">Sessões recentes</h2></div><span className="history-count">{sessions.length} de até 30</span></div>
        {error ? <div className="empty-state" role="alert"><strong>Não foi possível carregar as sessões.</strong><p>Atualize a página. Nenhuma sessão foi alterada.</p></div>
          : !sessions.length ? <div className="empty-state"><strong>Nenhuma sessão preparada</strong><p>Preencha o contexto acima para escolher as evidências da primeira conversa.</p></div>
          : <ol className="live-session-list">{sessions.map((session) => <li key={session.id}><Link href={`/app/live/${session.id}`}><span className="live-session-state" data-state={session.status}>{statusLabel[session.status]}</span><span><strong>{session.target_role}</strong><small>{session.company}</small></span><span>{session.live_questions?.[0]?.count ?? 0} perguntas</span><time dateTime={session.updated_at}>{date.format(new Date(session.updated_at))}</time><span aria-hidden>→</span></Link></li>)}</ol>}
      </section>
    </main>
  );
}
