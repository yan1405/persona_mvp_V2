import Image from "next/image";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

export default async function StartPage() {
  const supabase = await createClient();
  const { data: authData } = await supabase.auth.getClaims();

  if (!authData?.claims) {
    redirect("/entrar");
  }

  const [{ data: profile }, { data: firstLog }] = await Promise.all([
    supabase
      .from("profiles")
      .select("display_name, main_objective, onboarding_completed_at")
      .maybeSingle(),
    supabase
      .from("daily_logs")
      .select("content, created_at")
      .eq("entry_key", "onboarding-first")
      .maybeSingle(),
  ]);

  if (!profile?.onboarding_completed_at) {
    redirect("/onboarding");
  }

  const firstName = profile.display_name.split(" ")[0];

  return (
    <main className="product-shell">
      <header className="product-header">
        <div className="wordmark" aria-label="Persona">
          <Image
            src="/brand/persona-logo-rica-dark.svg"
            className="wordmark-logo"
            width={24}
            height={24}
            alt=""
            priority
          />
          Persona
        </div>
        <span className="phase-label">Início</span>
      </header>

      <div className="start-layout">
        <section className="start-intro" aria-labelledby="start-title">
          <p className="eyebrow">Primeiro registro salvo</p>
          <h1 id="start-title">Olá, {firstName}.</h1>
          <p>
            Sua base começou com uma experiência real. Nas próximas etapas, você poderá revisar a estrutura e confirmar o que deve virar evidência.
          </p>
        </section>

        <section className="start-grid" aria-label="Estado inicial do Persona">
          <article className="start-primary-block">
            <div className="block-heading">
              <span className="phase-label">Daily Log 01</span>
              <span className="saved-state">Salvo</span>
            </div>
            <blockquote>{firstLog?.content}</blockquote>
            <p className="block-note">Texto original preservado. Nenhuma IA foi aplicada ainda.</p>
          </article>

          <aside className="start-metrics">
            <div>
              <span className="metric-label">Narrative Score</span>
              <strong>Dados insuficientes</strong>
              <p>O Persona não atribui uma nota antes de existir histórico suficiente e explicável.</p>
            </div>
            <div>
              <span className="metric-label">Objetivo atual</span>
              <strong>{profile.main_objective}</strong>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
