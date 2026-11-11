import { redirect } from "next/navigation";

import { AppShell } from "@/components/ds";
import { getCurrentProfile } from "@/lib/auth/current-profile";
import { createClient } from "@/lib/supabase/server";

const hrefs = {
  inicio: "/app/inicio",
  diario: "/app/diario",
  evidencias: "/app/evidencias",
  live: "/app/live",
  artefatos: "/app/artefatos",
  configuracoes: "/app/configuracoes",
} as const;

export default async function ProductLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const profile = await getCurrentProfile();
  if (!profile) {
    const supabase = await createClient();
    const { data: authData } = await supabase.auth.getClaims();
    if (!authData?.claims) redirect("/entrar");
    redirect("/onboarding");
  }
  if (!profile.onboarding_completed_at) redirect("/onboarding");

  // contentAs="div": as telas internas (legado, Lotes 10 a 12) ainda trazem o próprio <main>.
  return (
    <AppShell hrefs={hrefs} registerHref="/app/diario" searchAction="/app/evidencias" searchName="q" contentAs="div">
      {children}
    </AppShell>
  );
}
