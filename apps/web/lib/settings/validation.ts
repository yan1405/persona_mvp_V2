import { professionalMoments } from "../onboarding/validation.ts";

type ProfessionalMoment = (typeof professionalMoments)[number];

export type SettingsProfileInput = {
  displayName: string;
  professionalMoment: ProfessionalMoment;
  mainObjective: string;
  communicationsConsent: boolean;
  reminderEnabled: boolean;
  reminderTime: string | null;
};

export type SettingsProfileValidation =
  | { success: true; data: SettingsProfileInput }
  | { success: false; fieldErrors: Record<string, string> };

function cleanText(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

export function validateSettingsProfile(
  formData: FormData,
): SettingsProfileValidation {
  const displayName = cleanText(formData, "displayName");
  const professionalMoment = cleanText(formData, "professionalMoment");
  const mainObjective = cleanText(formData, "mainObjective");
  const reminderTime = cleanText(formData, "reminderTime");
  const communicationsConsent =
    formData.get("communicationsConsent") === "on";
  const reminderEnabled = formData.get("reminderEnabled") === "on";
  const fieldErrors: Record<string, string> = {};

  if (displayName.length < 2 || displayName.length > 80) {
    fieldErrors.displayName = "Informe um nome entre 2 e 80 caracteres.";
  }

  if (!professionalMoments.includes(professionalMoment as ProfessionalMoment)) {
    fieldErrors.professionalMoment = "Escolha seu momento profissional.";
  }

  if (mainObjective.length < 8 || mainObjective.length > 180) {
    fieldErrors.mainObjective = "Descreva seu objetivo em 8 a 180 caracteres.";
  }

  if (
    reminderEnabled &&
    !/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(reminderTime)
  ) {
    fieldErrors.reminderTime = "Escolha um horário válido para o lembrete.";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { success: false, fieldErrors };
  }

  return {
    success: true,
    data: {
      displayName,
      professionalMoment: professionalMoment as ProfessionalMoment,
      mainObjective,
      communicationsConsent,
      reminderEnabled,
      reminderTime: reminderEnabled ? reminderTime : null,
    },
  };
}
