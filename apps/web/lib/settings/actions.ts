"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { validateSettingsProfile } from "./validation";

export type SettingsActionState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Record<string, string>;
};

export async function updateProfile(
  _prevState: SettingsActionState,
  formData: FormData,
): Promise<SettingsActionState> {
  const supabase = await createClient();
  const { data: authData } = await supabase.auth.getClaims();

  if (!authData?.claims) {
    return { status: "error", message: "Sessão expirada. Faça login novamente." };
  }

  const validation = validateSettingsProfile(formData);
  if (!validation.success) {
    return {
      status: "error",
      message: "Revise os campos indicados e tente novamente.",
      fieldErrors: validation.fieldErrors,
    };
  }

  const {
    displayName,
    professionalMoment,
    mainObjective,
    communicationsConsent,
    reminderEnabled,
    reminderTime,
  } = validation.data;

  const updates = {
    display_name: displayName,
    professional_moment: professionalMoment,
    main_objective: mainObjective,
    communications_consent: communicationsConsent,
    daily_log_reminder_enabled: reminderEnabled,
    daily_log_reminder_time: reminderEnabled ? reminderTime : null,
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", authData.claims.sub);

  if (error) {
    console.error("Settings profile update failed:", error.code);
    return {
      status: "error",
      message: "Não foi possível salvar o perfil. Tente novamente.",
    };
  }

  revalidatePath("/app/configuracoes");
  revalidatePath("/app/inicio");
  return { status: "success", message: "Perfil atualizado com sucesso." };
}

export async function deleteAccount(
  _prevState: SettingsActionState,
  formData: FormData,
): Promise<SettingsActionState> {
  const supabase = await createClient();
  const { data: authData } = await supabase.auth.getClaims();

  if (!authData?.claims) {
    return { status: "error", message: "Sessão expirada. Faça login novamente." };
  }

  const confirmation = formData.get("confirmation");
  if (confirmation !== "EXCLUIR") {
    return { status: "error", message: "A confirmação não corresponde." };
  }

  const { error } = await supabase.rpc("delete_own_account", {
    p_confirmation: confirmation,
  });

  if (error) {
    console.error("Account deletion failed:", error.code);
    return {
      status: "error",
      message:
        error.code === "42501"
          ? "A confirmação Microsoft expirou. Confirme sua identidade novamente."
          : "Não foi possível excluir a conta. Nenhum dado foi removido.",
    };
  }

  await supabase.auth.signOut();
  redirect("/entrar?conta=excluida");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/entrar");
}
