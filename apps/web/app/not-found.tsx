import { ButtonLink, Card, Chip, Logo } from "@/components/ds";

export const metadata = { title: "Página não encontrada | Persona" };

export default function NotFound() {
  return (
    <main className="dx-page">
      <div className="dx-page__wrap dx-page__wrap--reading">
        <header className="dx-page__brand">
          <Logo variant="lockup" height={32} title="Persona" />
        </header>
        <Card as="article" elevation="float" radius="lg" className="dx-reading" aria-labelledby="nao-encontrada-titulo">
          <Chip icon="search">Erro 404</Chip>
          <h1 className="dx-page__title" id="nao-encontrada-titulo">
            Não encontramos esta página.
          </h1>
          <p className="dx-page__lead">O endereço pode ter mudado ou não existir mais. Seus registros e evidências continuam guardados.</p>
          <div>
            <ButtonLink href="/app/inicio" variant="brand" iconRight="arrow-right">
              Ir para o início
            </ButtonLink>
          </div>
        </Card>
      </div>
    </main>
  );
}
