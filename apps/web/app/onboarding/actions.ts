"use server";

import { redirect } from "next/navigation";

import { validateOnboarding } from "@/lib/onboarding/validation";
import { createClient } from "@/lib/supabase/server";

export type OnboardingActionState = {
  status: "idle" | "error";
  message?: string;
  fieldErrors?: Record<string, string>;
};

export async function completeOnboarding(
  _previousState: OnboardingActionState,
  formData: FormData,
): Promise<OnboardingActionState> {
  const validation = validateOnboarding(formData);

  if (!validation.success) {
    return {
      status: "error",
      message: "Revise os campos indicados antes de concluir.",
      fieldErrors: validation.fieldErrors,
    };
  }

  const supabase = await createClient();
  const { data: authData } = await supabase.auth.getClaims();

  if (!authData?.claims) {
    redirect("/entrar");
  }

  const input = validation.data;
  const { error } = await supabase.rpc("complete_onboarding", {
    p_display_name: input.displayName,
    p_professional_moment: input.professionalMoment,
    p_main_objective: input.mainObjective,
    p_product_consent: input.productConsent,
    p_communications_consent: input.communicationsConsent,
    p_reminder_enabled: input.reminderEnabled,
    p_reminder_time: input.reminderTime,
    p_daily_log_content: input.dailyLogContent,
  });

  if (error) {
    console.error("Onboarding persistence failed", { code: error.code });
    return {
      status: "error",
      message:
        "Não foi possível salvar seu primeiro registro. O texto continua no formulário; tente novamente.",
    };
  }

  redirect("/app/inicio");
}
