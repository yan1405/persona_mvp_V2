import { redirect } from "next/navigation";

import { Badge, Button, Card } from "@/components/ds";
import { signOut } from "@/lib/settings/actions";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Conta e Acesso | Persona",
};

export default async function SettingsAccountPage() {
  const supabase = await createClient();
  const { data: authData } = await supabase.auth.getClaims();

  if (!authData?.claims) {
    redirect("/entrar");
  }

  const email = typeof authData.claims.email === "string" ? authData.claims.email : "Conta Microsoft conectada";

  return (
    <div className="dx-set__stack">
      <Card padding={24} className="dx-home__block">
        <section className="dx-home__section" aria-labelledby="provider-title">
          <h2 className="dx-home__h2" id="provider-title">
            Conta Microsoft.
          </h2>
          <p className="dx-home__text">Gerencie sua sessão ativa e o provedor de identidade conectado.</p>
          <div className="dx-ws__src-row">
            <div>
              <strong>Microsoft Entra ID</strong>
              <p className="dx-home__text">{email}</p>
            </div>
            <Badge tone="success" icon="circle-check">
              Conectado
            </Badge>
          </div>
        </section>
      </Card>

      <Card padding={24} className="dx-home__block">
        <section className="dx-home__section" aria-labelledby="session-title">
          <h2 className="dx-home__h2" id="session-title">
            Sessão atual.
          </h2>
          <p className="dx-home__text">Encerre sua sessão atual para proteger sua conta ao sair.</p>
          <form action={signOut}>
            <Button variant="outline" type="submit" icon="log-out">
              Encerrar sessão
            </Button>
          </form>
        </section>
      </Card>
    </div>
  );
}
