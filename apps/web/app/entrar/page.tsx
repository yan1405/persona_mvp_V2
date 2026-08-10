import Image from "next/image";
import Link from "next/link";

function MicrosoftMark() {
  return (
    <span className="microsoft-logo" aria-hidden="true">
      <span />
      <span />
      <span />
      <span />
    </span>
  );
}

export default function SignInPage() {
  return (
    <main className="login-shell">
      <header className="login-header">
        <div className="wordmark" aria-label="Persona">
          <Image
            className="wordmark-logo"
            src="/brand/persona-logo-rica-dark.svg"
            width={24}
            height={24}
            alt=""
            priority
          />
          Persona
        </div>
        <span className="phase-label">Acesso antecipado</span>
      </header>

      <div className="login-grid">
        <section className="positioning-panel" aria-labelledby="persona-title">
          <div className="positioning-copy">
            <p className="eyebrow">Evidências profissionais, não respostas prontas</p>
            <h1 id="persona-title">Registre uma vez. Prove sempre.</h1>
            <p>
              O Persona organiza o que você viveu e recupera os fatos certos
              quando chega a hora de demonstrar sua competência.
            </p>
          </div>

          <div className="evidence-trace" aria-label="Como o Persona trabalha">
            <div className="trace-header">
              <span>trajetória / exemplo</span>
              <span className="trace-status">rastreável</span>
            </div>
            <div className="trace-content">
              <article className="trace-step">
                <span className="trace-index">01 / fonte</span>
                <strong>Experiência registrada</strong>
                <p>Conduzi uma oficina de IA para gestores e adaptei o plano ao grupo.</p>
              </article>
              <article className="trace-step" data-active="true">
                <span className="trace-index">02 / argumento</span>
                <strong>O que isso demonstra</strong>
                <p>Comunicação, adaptação e capacidade de transformar conteúdo técnico.</p>
              </article>
              <article className="trace-step">
                <span className="trace-index">03 / ativação</span>
                <strong>Uso em entrevista</strong>
                <p>Um rascunho curto, sustentado pela fonte e revisado por você.</p>
              </article>
            </div>
          </div>
        </section>

        <section className="auth-panel" aria-labelledby="signin-title">
          <div className="auth-card">
            <h2 id="signin-title">Entre no Persona</h2>
            <p className="auth-intro">
              Use sua conta pessoal, profissional ou educacional da Microsoft.
            </p>

            <a className="microsoft-button" href="/auth/iniciar">
              <MicrosoftMark />
              Entrar com Microsoft
            </a>
            <p className="auth-note">
              Você será redirecionado ao ambiente oficial da Microsoft.
            </p>

            <div className="auth-divider" />

            <ul className="trust-list">
              <li>Você revisa toda sugestão antes de ela virar evidência.</li>
              <li>O Persona não inventa experiências, resultados ou números.</li>
              <li>Seus dados profissionais permanecem privados por padrão.</li>
            </ul>

            <nav className="legal-links" aria-label="Documentos legais">
              <Link href="/termos">Termos</Link>
              <Link href="/privacidade">Privacidade</Link>
            </nav>
          </div>
        </section>
      </div>
    </main>
  );
}
