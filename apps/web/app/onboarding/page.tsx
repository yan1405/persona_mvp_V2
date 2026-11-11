import { redirect } from "next/navigation";

import { Logo } from "@/components/ds";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

import { OnboardingForm } from "./onboarding-form";

export default async function OnboardingPage() {
  if (!isSupabaseConfigured()) {
    redirect("/auth/erro?codigo=configuracao");
  }

  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();

  if (!data?.claims) {
    redirect("/entrar");
  }

  const email = typeof data.claims.email === "string" ? data.claims.email : "Conta Microsoft";
  const metadata = data.claims.user_metadata as Record<string, unknown> | undefined;
  const defaultName =
    (typeof metadata?.full_name === "string" && metadata.full_name) ||
    (typeof metadata?.name === "string" && metadata.name) ||
    email.split("@")[0];

  const { data: profile } = await supabase
    .from("profiles")
    .select("onboarding_completed_at")
    .maybeSingle();

  if (profile?.onboarding_completed_at) {
    redirect("/app/inicio");
  }

  return (
    <main className="dx-page">
      <div className="dx-page__wrap dx-page__wrap--form">
        <header className="dx-page__brand">
          <Logo variant="lockup" height={32} title="Persona" />
          <span className="dx-page__note">Configuração inicial</span>
        </header>
        <OnboardingForm defaultName={defaultName} email={email} />
      </div>
    </main>
  );
}
