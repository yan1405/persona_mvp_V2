import Image from "next/image";
import { redirect } from "next/navigation";

import { getCurrentProfile } from "@/lib/auth/current-profile";
import { createClient } from "@/lib/supabase/server";

import { AppNavigation } from "./app-navigation";

export default async function ProductLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const profile = await getCurrentProfile();
  if (!profile) {
    const supabase = await createClient();
    const { data: authData } = await supabase.auth.getClaims();
    if (!authData?.claims) redirect("/entrar");
    redirect("/onboarding");
  }
  if (!profile.onboarding_completed_at) redirect("/onboarding");

  return (
    <div className="app-shell">
      <header className="app-header">
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
        <span className="phase-label">Base profissional</span>
      </header>
      <AppNavigation />
      <div className="app-content">{children}</div>
    </div>
  );
}
