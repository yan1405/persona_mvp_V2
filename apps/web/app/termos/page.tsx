import Link from "next/link";

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <Link className="text-sm text-muted underline underline-offset-4" href="/entrar">
        Voltar para entrar
      </Link>
      <h1 className="mt-8 text-3xl font-semibold tracking-tight">Termos da fase de testes</h1>
      <p className="mt-4 max-w-2xl text-sm leading-6 text-muted">
        Documento jurídico em preparação. O acesso externo só será liberado após
        revisão e publicação dos termos aplicáveis ao teste do Persona.
      </p>
    </main>
  );
}
