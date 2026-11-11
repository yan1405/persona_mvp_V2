"use client";

import { useActionState, useState } from "react";

import { Button, Icon, Input, Switch, Textarea } from "@/components/ds";
import { updateProfile, type SettingsActionState } from "@/lib/settings/actions";

type SettingsProfileFormProps = {
  profile: {
    display_name: string;
    professional_moment: string;
    main_objective: string;
    communications_consent: boolean;
    daily_log_reminder_enabled: boolean;
    daily_log_reminder_time: string | null;
  };
};

const initialState: SettingsActionState = { status: "idle" };

export function SettingsProfileForm({ profile }: SettingsProfileFormProps) {
  const [state, formAction, pending] = useActionState(updateProfile, initialState);
  const [reminderEnabled, setReminderEnabled] = useState(profile.daily_log_reminder_enabled);
  const [consent, setConsent] = useState(profile.communications_consent);
  const errors = state.fieldErrors;

  return (
    <form action={formAction} className="dx-form">
      <Input label="Nome" name="displayName" defaultValue={profile.display_name} minLength={2} maxLength={80} autoComplete="name" error={errors?.displayName} required />

      <div className="dx-field">
        <label className="dx-field__label" htmlFor="professionalMoment">
          Momento profissional
        </label>
        <select className="dx-select" id="professionalMoment" name="professionalMoment" defaultValue={profile.professional_moment} aria-invalid={Boolean(errors?.professionalMoment)} required>
          <option value="estudando">Estou estudando e me preparando</option>
          <option value="inicio-carreira">Estou no início da carreira</option>
          <option value="transicao">Estou mudando de área ou função</option>
          <option value="consolidacao">Estou consolidando minha experiência</option>
          <option value="lideranca">Estou assumindo responsabilidades de liderança</option>
        </select>
        {errors?.professionalMoment && (
          <span className="dx-field__note" role="alert">
            {errors.professionalMoment}
          </span>
        )}
      </div>

      <Textarea label="Objetivo principal" name="mainObjective" defaultValue={profile.main_objective} minLength={8} maxLength={180} rows={3} error={errors?.mainObjective} required />

      <h3 className="dx-dp__h">Preferências.</h3>

      {reminderEnabled && <input type="hidden" name="reminderEnabled" value="on" />}
      <Switch checked={reminderEnabled} onChange={setReminderEnabled} label="Guardar horário preferido. O horário fica salvo; o Persona ainda não envia notificações." />
      {reminderEnabled && <Input label="Horário" name="reminderTime" type="time" defaultValue={profile.daily_log_reminder_time?.slice(0, 5) || "18:00"} error={errors?.reminderTime} required />}

      {consent && <input type="hidden" name="communicationsConsent" value="on" />}
      <Switch checked={consent} onChange={setConsent} label="Receber novidades e convites de pesquisa. Opcional; não interfere no uso do produto." />

      <p className="dx-form__hint">Idioma do produto: Português (Brasil). Outros idiomas ainda não estão disponíveis.</p>

      {state.status === "error" && (
        <p className="dx-page__notice dx-page__notice--error" role="alert">
          <Icon name="triangle-alert" size={16} />
          {state.message}
        </p>
      )}
      {state.status === "success" && (
        <p className="dx-page__notice dx-page__notice--ok" role="status">
          <Icon name="circle-check" size={16} />
          {state.message}
        </p>
      )}
      <div className="dx-form__actions dx-form__actions--end">
        <Button variant="brand" type="submit" icon="check" disabled={pending}>
          {pending ? "Salvando…" : "Salvar alterações"}
        </Button>
      </div>
    </form>
  );
}
