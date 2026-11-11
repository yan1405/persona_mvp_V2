import { redirect } from "next/navigation";

import { Icon } from "@/components/ds";
import { createClient } from "@/lib/supabase/server";

import { SettingsDataForm } from "./data-form";

export const metadata = {
  title: "Dados e Privacidade | Persona",
};

export default async function SettingsDataPage({ searchParams }: { searchParams: Promise<{ notice?: string }> }) {
  const supabase = await createClient();
  const { data: authData } = await supabase.auth.getClaims();

  if (!authData?.claims) {
    redirect("/entrar");
  }

  const { notice } = await searchParams;

  return (
    <div className="dx-set__stack">
      {notice === "reauth_failed" && (
        <p className="dx-page__notice dx-page__notice--error" role="alert">
          <Icon name="triangle-alert" size={16} />
          Não foi possível confirmar sua identidade. Tente entrar novamente com a Microsoft.
        </p>
      )}
      <SettingsDataForm reauthenticated={notice === "reauthenticated"} />
    </div>
  );
}
