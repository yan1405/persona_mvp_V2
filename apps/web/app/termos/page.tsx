import { ButtonLink, Card, Chip, Logo } from "@/components/ds";

export default function TermsPage() {
  return (
    <main className="dx-page">
      <div className="dx-page__wrap dx-page__wrap--reading">
        <header className="dx-page__brand">
          <Logo variant="lockup" height={32} title="Persona" />
          <ButtonLink href="/entrar" variant="outline" size="sm" icon="arrow-left">
            Voltar para entrar
          </ButtonLink>
        </header>
        <Card as="article" elevation="float" radius="lg" className="dx-reading" aria-labelledby="termos-titulo">
          <Chip status="rascunho">Em preparação</Chip>
          <h1 className="dx-page__title" id="termos-titulo">
            Termos da fase de testes.
          </h1>
          <p className="dx-page__lead">
            Documento jurídico em preparação. O acesso externo só será liberado após revisão e publicação dos termos aplicáveis ao teste do Persona.
          </p>
        </Card>
      </div>
    </main>
  );
}
