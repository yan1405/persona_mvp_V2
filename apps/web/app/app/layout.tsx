import Image from "next/image";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

import { AppNavigation } from "./app-navigation";

export default async function ProductLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const supabase = await createClient();
  const { data: authData } = await supabase.auth.getClaims();
  if (!authData?.claims) redirect("/entrar");

  const { data: profile } = await supabase
    .from("profiles")
    .select("onboarding_completed_at")
    .maybeSingle();
  if (!profile?.onboarding_completed_at) redirect("/onboarding");

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
