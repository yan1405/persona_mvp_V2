import { redirect } from "next/navigation";

import { AppShell } from "@/components/shell/app-shell";
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

  return <AppShell nav={<AppNavigation />}>{children}</AppShell>;
}
