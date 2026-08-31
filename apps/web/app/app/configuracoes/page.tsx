import { redirect } from "next/navigation";
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

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", authData.claims.sub)
    .maybeSingle();

  if (!profile) {
    redirect("/onboarding");
  }

  return (
    <section className="settings-section">
      <header>
        <h2>Perfil e preferências</h2>
        <p>
          Atualize suas informações pessoais e gerencie as preferências do sistema.
        </p>
      </header>
      <SettingsProfileForm profile={profile} />
    </section>
  );
}
