export const professionalMoments = [
  "estudando",
  "inicio-carreira",
  "transicao",
  "consolidacao",
  "lideranca",
] as const;

type ProfessionalMoment = (typeof professionalMoments)[number];

export type OnboardingInput = {
  displayName: string;
  professionalMoment: ProfessionalMoment;
  mainObjective: string;
  productConsent: true;
  communicationsConsent: boolean;
  reminderEnabled: boolean;
  reminderTime: string | null;
  dailyLogContent: string;
};

export type OnboardingValidation =
  | { success: true; data: OnboardingInput }
  | { success: false; fieldErrors: Record<string, string> };

function cleanText(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

export function validateOnboarding(formData: FormData): OnboardingValidation {
  const displayName = cleanText(formData, "displayName");
  const professionalMoment = cleanText(formData, "professionalMoment");
  const mainObjective = cleanText(formData, "mainObjective");
  const reminderTime = cleanText(formData, "reminderTime");
  const dailyLogContent = cleanText(formData, "dailyLogContent");
  const productConsent = formData.get("productConsent") === "on";
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

  if (!productConsent) {
    fieldErrors.productConsent = "Este consentimento é necessário para usar o produto.";
  }

  if (
    reminderEnabled &&
    !/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(reminderTime)
  ) {
    fieldErrors.reminderTime = "Escolha um horário válido para o lembrete.";
  }

  if (dailyLogContent.length < 40 || dailyLogContent.length > 2000) {
    fieldErrors.dailyLogContent =
      "Escreva entre 40 e 2.000 caracteres sobre a experiência.";
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
      productConsent: true,
      communicationsConsent,
      reminderEnabled,
      reminderTime: reminderEnabled ? reminderTime : null,
      dailyLogContent,
    },
  };
}
