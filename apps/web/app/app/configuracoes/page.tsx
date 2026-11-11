import { redirect } from "next/navigation";

import { Badge, Button, Card, Icon, SectionIndex } from "@/components/ds";
import { signOut } from "@/lib/settings/actions";
import { createClient } from "@/lib/supabase/server";

import { SettingsDataForm } from "./dados/data-form";
import { SettingsProfileForm } from "./profile-form";

export const metadata = {
  title: "Configurações | Persona",
};

const items = [
  { id: "cfg-perfil", label: "Perfil e preferências" },
  { id: "cfg-dados", label: "Dados e privacidade" },
  { id: "cfg-conta", label: "Conta e acesso" },
];

export default async function SettingsPage({ searchParams }: { searchParams: Promise<{ notice?: string }> }) {
  const supabase = await createClient();
  const { data: authData } = await supabase.auth.getClaims();

  if (!authData?.claims) {
    redirect("/entrar");
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", authData.claims.sub).maybeSingle();

  if (!profile) {
    redirect("/onboarding");
  }

  const { notice } = await searchParams;
  const email = typeof authData.claims.email === "string" ? authData.claims.email : "Conta Microsoft conectada";

  return (
    <div className="dx-set">
      <div className="dx-set__nav">
        <SectionIndex title="Nesta página" items={items} />
      </div>
      <div className="dx-set__content">
        <section className="dx-set__stack" id="cfg-perfil" aria-labelledby="profile-title">
          <Card padding={24} className="dx-home__block">
            <div className="dx-home__section">
              <h2 className="dx-home__h2" id="profile-title">
                Perfil e preferências.
              </h2>
              <p className="dx-home__text">Atualize suas informações pessoais e gerencie as preferências do sistema.</p>
              <SettingsProfileForm profile={profile} />
            </div>
          </Card>
        </section>

        <section className="dx-set__stack" id="cfg-dados" aria-label="Dados e privacidade">
          {notice === "reauth_failed" && (
            <p className="dx-page__notice dx-page__notice--error" role="alert">
              <Icon name="triangle-alert" size={16} />
              Não foi possível confirmar sua identidade. Tente entrar novamente com a Microsoft.
            </p>
          )}
          <SettingsDataForm reauthenticated={notice === "reauthenticated"} />
        </section>

        <section className="dx-set__stack" id="cfg-conta" aria-labelledby="account-title">
          <Card padding={24} className="dx-home__block">
            <div className="dx-home__section">
              <h2 className="dx-home__h2" id="account-title">
                Conta e acesso.
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
              <form action={signOut}>
                <Button variant="outline" type="submit" icon="log-out">
                  Encerrar sessão
                </Button>
              </form>
            </div>
          </Card>
        </section>
      </div>
    </div>
  );
}
