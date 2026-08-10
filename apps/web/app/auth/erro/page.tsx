import Image from "next/image";
import Link from "next/link";

const messages = {
  configuracao: {
    eyebrow: "Configuração necessária",
    title: "A conexão com o Supabase ainda não está pronta.",
    description:
      "Adicione a URL e a chave publicável do projeto para habilitar o acesso Microsoft.",
  },
  provedor: {
    eyebrow: "Microsoft indisponível",
    title: "Não foi possível iniciar o acesso.",
    description:
      "Tente novamente. Se o problema continuar, revise o provedor Azure no Supabase.",
  },
  retorno: {
    eyebrow: "Retorno incompleto",
    title: "A Microsoft não devolveu uma autorização válida.",
    description: "Volte para a entrada e inicie o acesso novamente.",
  },
  sessao: {
    eyebrow: "Sessão não concluída",
    title: "Não foi possível confirmar sua sessão.",
    description: "Sua conta não foi conectada. Tente entrar novamente.",
  },
} as const;

type ErrorCode = keyof typeof messages;

export default async function AuthErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ codigo?: string | string[] }>;
}) {
  const value = (await searchParams).codigo;
  const code = typeof value === "string" && value in messages ? value : "retorno";
  const message = messages[code as ErrorCode];

  return (
    <main className="status-shell">
      <section className="status-card" aria-labelledby="auth-error-title">
        <div className="status-brand" aria-label="Persona">
          <Image
            src="/brand/persona-logo-rica-dark.svg"
            width={28}
            height={28}
            alt=""
            priority
          />
          Persona
        </div>
        <p className="eyebrow">{message.eyebrow}</p>
        <h1 id="auth-error-title">{message.title}</h1>
        <p>{message.description}</p>
        <Link className="status-action" href="/entrar">
          Voltar para entrar
        </Link>
      </section>
    </main>
  );
}
