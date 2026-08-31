import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SettingsDataForm } from "./data-form";

export const metadata = {
  title: "Dados e Privacidade | Persona",
};

export default async function SettingsDataPage({
  searchParams,
}: {
  searchParams: Promise<{ notice?: string }>;
}) {
  const supabase = await createClient();
  const { data: authData } = await supabase.auth.getClaims();
  
  if (!authData?.claims) {
    redirect("/entrar");
  }

  const { notice } = await searchParams;

  return (
    <section className="settings-section">
      <header>
        <h2>Dados e privacidade</h2>
        <p>
          Baixe uma cópia dos seus registros ou exclua permanentemente a conta e os dados vinculados.
        </p>
      </header>
      {notice === "reauth_failed" && (
        <p className="form-error" role="alert">
          Não foi possível confirmar sua identidade. Tente entrar novamente com a Microsoft.
        </p>
      )}
      <SettingsDataForm reauthenticated={notice === "reauthenticated"} />
    </section>
  );
}
