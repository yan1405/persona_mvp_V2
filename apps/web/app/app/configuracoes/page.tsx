import { redirect } from "next/navigation";

import { Card } from "@/components/ds";
import { createClient } from "@/lib/supabase/server";

import { SettingsProfileForm } from "./profile-form";

export const metadata = {
  title: "Perfil e Preferências | Persona",
};

export default async function SettingsProfilePage() {
  const supabase = await createClient();
  const { data: authData } = await supabase.auth.getClaims();

  if (!authData?.claims) {
    redirect("/entrar");
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", authData.claims.sub).maybeSingle();

  if (!profile) {
    redirect("/onboarding");
  }

  return (
    <Card padding={24} className="dx-home__block">
      <section className="dx-home__section" aria-labelledby="profile-title">
        <h2 className="dx-home__h2" id="profile-title">
          Perfil e preferências.
        </h2>
        <p className="dx-home__text">Atualize suas informações pessoais e gerencie as preferências do sistema.</p>
        <SettingsProfileForm profile={profile} />
      </section>
    </Card>
  );
}
