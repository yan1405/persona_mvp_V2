"use client";

import { Button, ButtonLink, Card, Chip, Logo } from "@/components/ds";

// Mensagem calma, sem detalhe técnico: o erro real fica só no registro do servidor.
export default function GlobalRouteError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="dx-page">
      <div className="dx-page__wrap dx-page__wrap--reading">
        <header className="dx-page__brand">
          <Logo variant="lockup" height={32} title="Persona" />
        </header>
        <Card as="article" elevation="float" radius="lg" className="dx-reading" aria-labelledby="erro-titulo" role="alert">
          <Chip icon="triangle-alert">Algo saiu do esperado</Chip>
          <h1 className="dx-page__title" id="erro-titulo">
            Não conseguimos abrir esta página.
          </h1>
          <p className="dx-page__lead">Nada foi perdido. Tente de novo; se continuar, volte ao início e retome de lá.</p>
          <div className="dx-form__actions">
            <Button variant="brand" icon="refresh-cw" onClick={reset}>
              Tentar de novo
            </Button>
            <ButtonLink href="/" variant="outline">
              Voltar ao início
            </ButtonLink>
          </div>
        </Card>
      </div>
    </main>
  );
}
