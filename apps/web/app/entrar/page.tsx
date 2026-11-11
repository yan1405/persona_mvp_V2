import { headers } from "next/headers";
import Link from "next/link";

import { ButtonLink, Button, Card, FocalCard, Icon, Input, Logo } from "@/components/ds";
import { isQaPasswordLoginEnabled } from "@/lib/auth/qa-login-gate";

const TRUST = [
  "Você revisa toda sugestão antes de ela virar evidência.",
  "O Persona não inventa experiências, resultados ou números.",
  "Seus dados profissionais permanecem privados por padrão.",
];

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ conta?: string; erro?: string }>;
}) {
  const { conta, erro } = await searchParams;
  const qaLogin = isQaPasswordLoginEnabled(process.env, (await headers()).get("host"));

  return (
    <main className="dx-page">
      <div className="dx-page__wrap">
        <header className="dx-page__brand">
          <Logo variant="lockup" height={32} title="Persona" />
        </header>

        <div className="dx-signin__grid">
          <FocalCard className="dx-signin__promise" aria-labelledby="persona-title">
            <h1 className="dx-signin__headline" id="persona-title">
              Registre uma vez. Prove sempre.
            </h1>
            <p className="dx-signin__promise-text">
              O Persona organiza o que você viveu e recupera os fatos certos quando chega a hora de demonstrar sua competência.
            </p>
            <ul className="dx-signin__trust" aria-label="Como o Persona trabalha">
              {TRUST.map((line) => (
                <li key={line}>
                  <Icon name="circle-check" size={18} />
                  {line}
                </li>
              ))}
            </ul>
          </FocalCard>

          <Card as="section" elevation="float" radius="lg" className="dx-signin__card" aria-labelledby="signin-title">
            <h2 className="dx-signin__card-title" id="signin-title">
              Entre no Persona.
            </h2>
            {conta === "excluida" && (
              <p className="dx-page__notice dx-page__notice--ok" role="status">
                <Icon name="circle-check" size={16} />
                Sua conta e os dados vinculados foram excluídos.
              </p>
            )}
            <p className="dx-page__lead">Use sua conta pessoal, profissional ou educacional da Microsoft.</p>

            <ButtonLink native href="/auth/iniciar" variant="brand" size="lg" fullWidth iconRight="arrow-right">
              Entrar com Microsoft
            </ButtonLink>
            <p className="dx-page__note">Você será redirecionado ao ambiente oficial da Microsoft.</p>

            {qaLogin && (
              <form action="/auth/qa-entrar" method="post" className="dx-signin__qa">
                <p className="dx-page__note">{process.env.VERCEL_ENV === "preview" ? "Acesso de QA (conta descartável)." : "Acesso de QA local (conta descartável)."}</p>
                {erro === "qa" && (
                  <p className="dx-page__notice dx-page__notice--error" role="alert">
                    <Icon name="triangle-alert" size={16} />
                    Não foi possível entrar.
                  </p>
                )}
                <Input label="E-mail" id="qa-email" name="email" type="email" autoComplete="username" maxLength={254} required />
                <Input label="Senha" id="qa-password" name="password" type="password" autoComplete="current-password" maxLength={200} required />
                <Button type="submit" variant="outline" fullWidth>
                  Entrar (QA)
                </Button>
              </form>
            )}

            <nav aria-label="Documentos legais">
              <ul className="dx-page__legal">
                <li>
                  <Link className="dx-link" href="/termos">
                    Termos
                  </Link>
                </li>
                <li>
                  <Link className="dx-link" href="/privacidade">
                    Privacidade
                  </Link>
                </li>
              </ul>
            </nav>
          </Card>
        </div>
      </div>
    </main>
  );
}
