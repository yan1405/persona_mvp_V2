import { ButtonLink, Card, Icon, Logo } from "@/components/ds";

// Mensagens calmas: dizem o que aconteceu sem culpar a pessoa e sem jargão técnico, e apontam um próximo passo.
const messages = {
  configuracao: {
    eyebrow: "Acesso em preparação",
    title: "O acesso ainda não está disponível.",
    description: "Estamos terminando de preparar o ambiente. Nada foi feito na sua conta; tente de novo em alguns minutos.",
  },
  provedor: {
    eyebrow: "Microsoft indisponível",
    title: "Não conseguimos abrir o acesso com a Microsoft.",
    description: "Isso costuma passar sozinho. Sua conta não foi alterada; tente entrar de novo e, se continuar, volte daqui a pouco.",
  },
  retorno: {
    eyebrow: "Acesso não concluído",
    title: "A Microsoft não confirmou o acesso.",
    description: "Pode acontecer quando a janela é fechada ou a página fica aberta por muito tempo. Volte para a entrada e comece de novo.",
  },
  sessao: {
    eyebrow: "Sessão não concluída",
    title: "Não conseguimos confirmar sua sessão.",
    description: "Sua conta não foi conectada e nada foi salvo. Tente entrar novamente.",
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
    <main className="dx-page">
      <div className="dx-page__wrap dx-page__wrap--narrow">
        <header className="dx-page__brand">
          <Logo variant="lockup" height={32} title="Persona" />
        </header>
        <Card as="section" elevation="float" radius="lg" className="dx-status" aria-labelledby="auth-error-title">
          <span className="dx-status__icon" aria-hidden="true">
            <Icon name="info" size={22} />
          </span>
          <p className="dx-page__eyebrow">{message.eyebrow}</p>
          <h1 className="dx-page__title" id="auth-error-title">
            {message.title}
          </h1>
          <p className="dx-page__lead">{message.description}</p>
          <ButtonLink href="/entrar" variant="brand" size="lg" fullWidth iconRight="arrow-right">
            Voltar para entrar
          </ButtonLink>
        </Card>
      </div>
    </main>
  );
}
