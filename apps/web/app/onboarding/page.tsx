import Image from "next/image";
import { redirect } from "next/navigation";

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
    <main className="onboarding-shell">
      <header className="onboarding-header">
        <div className="wordmark" aria-label="Persona">
          <Image
            src="/brand/persona-logo-rica-dark.svg"
            className="wordmark-logo"
            width={24}
            height={24}
            alt=""
            priority
          />
          Persona
        </div>
        <span className="phase-label">Configuração inicial</span>
      </header>
      <OnboardingForm defaultName={defaultName} email={email} />
    </main>
  );
}
