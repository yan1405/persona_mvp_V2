import type { ReactNode } from "react";

// Moldura do produto: navegação + painel de conteúdo. Não renderiza <main>: cada página já tem o seu.
export function AppShell({ nav, children }: Readonly<{ nav: ReactNode; children: ReactNode }>) {
  return (
    <div className="app-shell">
      <a className="skip-link" href="#conteudo">
        Ir para o conteúdo
      </a>
      {nav}
      <div className="app-content" id="conteudo" tabIndex={-1}>
        {children}
      </div>
    </div>
  );
}
