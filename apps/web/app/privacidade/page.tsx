import { ButtonLink, Card, Chip, Logo } from "@/components/ds";

export default function PrivacyPage() {
  return (
    <main className="dx-page">
      <div className="dx-page__wrap dx-page__wrap--reading">
        <header className="dx-page__brand">
          <Logo variant="lockup" height={32} title="Persona" />
          <ButtonLink href="/entrar" variant="outline" size="sm" icon="arrow-left">
            Voltar para entrar
          </ButtonLink>
        </header>
        <Card as="article" elevation="float" radius="lg" className="dx-reading" aria-labelledby="privacidade-titulo">
          <Chip status="rascunho">Em preparação</Chip>
          <h1 className="dx-page__title" id="privacidade-titulo">
            Privacidade.
          </h1>
          <p className="dx-page__lead">
            Política em preparação. O Persona será construído com minimização de dados, revisão humana e controle do usuário sobre suas evidências profissionais.
          </p>
        </Card>
      </div>
    </main>
  );
}
