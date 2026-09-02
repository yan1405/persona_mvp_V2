import "server-only";

import { cache } from "react";

import { createClient } from "@/lib/supabase/server";

export type CurrentProfile = {
  display_name: string | null;
  main_objective: string | null;
  onboarding_completed_at: string | null;
};

export const getCurrentProfile = cache(async () => {
  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("display_name, main_objective, onboarding_completed_at")
    .maybeSingle();

  return data as CurrentProfile | null;
});
