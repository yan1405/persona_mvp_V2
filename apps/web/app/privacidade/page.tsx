import Link from "next/link";

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <Link className="text-sm text-muted underline underline-offset-4" href="/entrar">
        Voltar para entrar
      </Link>
      <h1 className="mt-8 text-3xl font-semibold tracking-tight">Privacidade</h1>
      <p className="mt-4 max-w-2xl text-sm leading-6 text-muted">
        Política em preparação. O Persona será construído com minimização de dados,
        revisão humana e controle do usuário sobre suas evidências profissionais.
      </p>
    </main>
  );
}
