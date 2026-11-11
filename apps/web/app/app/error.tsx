"use client";

import { Button, ButtonLink, Card, Chip } from "@/components/ds";

// Dentro do app: mantém o menu lateral e oferece o próximo passo, sem detalhe técnico.
export default function AppRouteError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="dx-home">
      <Card padding={24} className="dx-home__block" role="alert">
        <section className="dx-home__section" aria-labelledby="app-erro-titulo">
          <Chip icon="triangle-alert">Algo saiu do esperado</Chip>
          <h1 className="dx-home__title" id="app-erro-titulo">
            Não conseguimos carregar esta tela.
          </h1>
          <p className="dx-home__text">Nada foi perdido. Tente de novo; se continuar, volte ao início e retome de lá.</p>
          <div className="dx-form__actions">
            <Button variant="brand" icon="refresh-cw" onClick={reset}>
              Tentar de novo
            </Button>
            <ButtonLink href="/app/inicio" variant="outline">
              Ir para o início
            </ButtonLink>
          </div>
        </section>
      </Card>
    </main>
  );
}
