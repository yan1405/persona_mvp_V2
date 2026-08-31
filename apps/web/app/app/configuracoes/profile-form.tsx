"use client";

import { useActionState, useState } from "react";
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
  const [reminderEnabled, setReminderEnabled] = useState(
    profile.daily_log_reminder_enabled
  );

  return (
    <form action={formAction} className="settings-form">
      <div className="field-stack">
        <label className="field-label" htmlFor="displayName">
          Nome
        </label>
        <input
          className="text-field"
          id="displayName"
          name="displayName"
          defaultValue={profile.display_name}
          minLength={2}
          maxLength={80}
          autoComplete="name"
          aria-describedby={state.fieldErrors?.displayName ? "displayName-error" : undefined}
          aria-invalid={Boolean(state.fieldErrors?.displayName)}
          required
        />
        {state.fieldErrors?.displayName && (
          <p className="field-error" id="displayName-error">{state.fieldErrors.displayName}</p>
        )}

        <label className="field-label" htmlFor="professionalMoment">
          Momento profissional
        </label>
        <select
          className="text-field"
          id="professionalMoment"
          name="professionalMoment"
          defaultValue={profile.professional_moment}
          aria-describedby={state.fieldErrors?.professionalMoment ? "professionalMoment-error" : undefined}
          aria-invalid={Boolean(state.fieldErrors?.professionalMoment)}
          required
        >
          <option value="estudando">Estou estudando e me preparando</option>
          <option value="inicio-carreira">Estou no início da carreira</option>
          <option value="transicao">Estou mudando de área ou função</option>
          <option value="consolidacao">Estou consolidando minha experiência</option>
          <option value="lideranca">Estou assumindo responsabilidades de liderança</option>
        </select>
        {state.fieldErrors?.professionalMoment && (
          <p className="field-error" id="professionalMoment-error">{state.fieldErrors.professionalMoment}</p>
        )}

        <label className="field-label" htmlFor="mainObjective">
          Objetivo principal
        </label>
        <textarea
          className="text-field text-area-compact"
          id="mainObjective"
          name="mainObjective"
          defaultValue={profile.main_objective}
          aria-describedby={state.fieldErrors?.mainObjective ? "mainObjective-error" : undefined}
          aria-invalid={Boolean(state.fieldErrors?.mainObjective)}
          minLength={8}
          maxLength={180}
          rows={3}
          required
        />
        {state.fieldErrors?.mainObjective && (
          <p className="field-error" id="mainObjective-error">{state.fieldErrors.mainObjective}</p>
        )}
      </div>

      <section className="settings-form-section">
        <h3>Preferências</h3>

        <label className="choice-row choice-row-single">
          <input
            type="checkbox"
            name="reminderEnabled"
            checked={reminderEnabled}
            onChange={(event) => setReminderEnabled(event.target.checked)}
          />
          <span>
            <strong>Guardar horário preferido</strong>
            <small>O horário fica salvo. O Persona ainda não envia notificações.</small>
          </span>
        </label>

        {reminderEnabled && (
          <div className="reminder-time">
            <label className="field-label" htmlFor="reminderTime">
              Horário
            </label>
            <input
              className="text-field time-field"
              id="reminderTime"
              name="reminderTime"
              type="time"
              defaultValue={profile.daily_log_reminder_time?.slice(0, 5) || "18:00"}
              aria-describedby={state.fieldErrors?.reminderTime ? "reminderTime-error" : undefined}
              aria-invalid={Boolean(state.fieldErrors?.reminderTime)}
              required={reminderEnabled}
            />
            {state.fieldErrors?.reminderTime && (
              <p className="field-error" id="reminderTime-error">{state.fieldErrors.reminderTime}</p>
            )}
          </div>
        )}

        <label className="choice-row choice-row-single">
          <input
            type="checkbox"
            name="communicationsConsent"
            defaultChecked={profile.communications_consent}
          />
          <span>
            <strong>Receber novidades e convites de pesquisa</strong>
            <small>Opcional. Não interfere no uso do produto.</small>
          </span>
        </label>
        <p className="settings-language-note">
          Idioma do produto: Português (Brasil). Outros idiomas ainda não estão disponíveis.
        </p>
      </section>

      <footer className="settings-form-actions">
        <button
          className="button-primary"
          type="submit"
          disabled={pending}
        >
          {pending ? "Salvando..." : "Salvar alterações"}
        </button>

        {state.status === "success" && (
          <span className="settings-success" role="status">
            {state.message}
          </span>
        )}
        {state.status === "error" && (
          <span className="field-error" role="alert">
            {state.message}
          </span>
        )}
      </footer>
    </form>
  );
}
