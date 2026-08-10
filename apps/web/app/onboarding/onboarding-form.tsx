"use client";

import { useActionState, useEffect, useRef, useState } from "react";

import { completeOnboarding, type OnboardingActionState } from "./actions";

const steps = ["Contexto", "Privacidade", "Rotina", "Primeiro registro"];
const initialOnboardingState: OnboardingActionState = { status: "idle" };

type OnboardingFormProps = {
  defaultName: string;
  email: string;
};

export function OnboardingForm({ defaultName, email }: OnboardingFormProps) {
  const [step, setStep] = useState(0);
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [state, formAction, pending] = useActionState(
    completeOnboarding,
    initialOnboardingState,
  );
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    formRef.current
      ?.querySelector<HTMLElement>(`[data-onboarding-step="${step}"] h1`)
      ?.focus();
  }, [step]);

  function continueToNextStep() {
    const section = formRef.current?.querySelector<HTMLElement>(
      `[data-onboarding-step="${step}"]`,
    );
    const controls = section?.querySelectorAll<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >("input, select, textarea");

    for (const control of controls ?? []) {
      if (!control.checkValidity()) {
        control.reportValidity();
        return;
      }
    }

    setStep((current) => Math.min(current + 1, steps.length - 1));
  }

  function returnToPreviousStep() {
    setStep((current) => Math.max(current - 1, 0));
  }

  return (
    <div className="onboarding-layout">
      <aside className="onboarding-progress" aria-label="Progresso do onboarding">
        <p className="phase-label">Primeiro uso</p>
        <ol>
          {steps.map((label, index) => (
            <li
              key={label}
              aria-current={index === step ? "step" : undefined}
              data-state={index < step ? "complete" : index === step ? "current" : "future"}
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              {label}
            </li>
          ))}
        </ol>
        <p className="onboarding-account">
          Conta Microsoft
          <strong>{email}</strong>
        </p>
      </aside>

      <form ref={formRef} action={formAction} className="onboarding-form">
        <div className="onboarding-step-count" aria-live="polite">
          Etapa {step + 1} de {steps.length}
        </div>

        <section data-onboarding-step="0" hidden={step !== 0}>
          <p className="eyebrow">Contexto</p>
          <h1 id="onboarding-context-title" tabIndex={-1}>
            Onde você está agora?
          </h1>
          <p className="onboarding-intro">
            Essas respostas dão contexto aos seus registros. Você poderá ajustá-las depois.
          </p>

          <div className="field-stack">
            <label className="field-label" htmlFor="displayName">
              Nome
            </label>
            <input
              className="text-field"
              id="displayName"
              name="displayName"
              defaultValue={defaultName}
              minLength={2}
              maxLength={80}
              autoComplete="name"
              required
              aria-describedby={state.fieldErrors?.displayName ? "displayName-error" : undefined}
            />
            {state.fieldErrors?.displayName && (
              <p className="field-error" id="displayName-error">
                {state.fieldErrors.displayName}
              </p>
            )}

            <label className="field-label" htmlFor="professionalMoment">
              Momento profissional
            </label>
            <select
              className="text-field"
              id="professionalMoment"
              name="professionalMoment"
              defaultValue=""
              required
            >
              <option value="" disabled>
                Selecione uma opção
              </option>
              <option value="estudando">Estou estudando e me preparando</option>
              <option value="inicio-carreira">Estou no início da carreira</option>
              <option value="transicao">Estou mudando de área ou função</option>
              <option value="consolidacao">Estou consolidando minha experiência</option>
              <option value="lideranca">Estou assumindo responsabilidades de liderança</option>
            </select>

            <label className="field-label" htmlFor="mainObjective">
              Objetivo principal
            </label>
            <textarea
              className="text-field text-area-compact"
              id="mainObjective"
              name="mainObjective"
              minLength={8}
              maxLength={180}
              rows={3}
              placeholder="Ex.: preparar exemplos concretos para entrevistas"
              required
            />
          </div>
        </section>

        <section data-onboarding-step="1" hidden={step !== 1}>
          <p className="eyebrow">Privacidade</p>
          <h1 id="onboarding-privacy-title" tabIndex={-1}>
            Você decide como seus dados serão usados.
          </h1>
          <p className="onboarding-intro">
            O Persona guarda relatos profissionais privados para organizar evidências. Comunicações são uma escolha separada.
          </p>

          <div className="choice-list">
            <label className="choice-row">
              <input type="checkbox" name="productConsent" required />
              <span>
                <strong>Permitir o tratamento dos meus dados para usar o Persona</strong>
                <small>
                  Necessário para salvar perfil e registros. Leia a <a href="/privacidade" target="_blank" rel="noreferrer">Política de Privacidade</a> e os <a href="/termos" target="_blank" rel="noreferrer">Termos</a>.
                </small>
              </span>
            </label>
            <label className="choice-row">
              <input type="checkbox" name="communicationsConsent" />
              <span>
                <strong>Receber novidades e convites de pesquisa</strong>
                <small>Opcional. Não interfere no uso do produto.</small>
              </span>
            </label>
          </div>
          {state.fieldErrors?.productConsent && (
            <p className="field-error">{state.fieldErrors.productConsent}</p>
          )}
        </section>

        <section data-onboarding-step="2" hidden={step !== 2}>
          <p className="eyebrow">Rotina</p>
          <h1 id="onboarding-routine-title" tabIndex={-1}>
            Quer reservar um horário para registrar?
          </h1>
          <p className="onboarding-intro">
            O lembrete é opcional e poderá ser alterado nas preferências.
          </p>

          <label className="choice-row choice-row-single">
            <input
              type="checkbox"
              name="reminderEnabled"
              checked={reminderEnabled}
              onChange={(event) => setReminderEnabled(event.target.checked)}
            />
            <span>
              <strong>Ativar lembrete diário</strong>
              <small>Uma pausa curta para registrar o que aconteceu no dia.</small>
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
                defaultValue="18:00"
                required
              />
            </div>
          )}
        </section>

        <section data-onboarding-step="3" hidden={step !== 3}>
          <p className="eyebrow">Primeiro registro</p>
          <h1 id="onboarding-daily-log-title" tabIndex={-1}>
            O que aconteceu na prática?
          </h1>
          <p className="onboarding-intro">
            Conte uma situação recente em que você resolveu um problema, entregou algo ou aprendeu. Escreva como lembrar; a estruturação vem depois.
          </p>

          <label className="field-label" htmlFor="dailyLogContent">
            Daily Log
          </label>
          <textarea
            className="text-field daily-log-field"
            id="dailyLogContent"
            name="dailyLogContent"
            minLength={40}
            maxLength={2000}
            rows={9}
            placeholder="Ex.: hoje eu precisei revisar..."
            required
            aria-describedby="daily-log-help"
          />
          <p className="field-help" id="daily-log-help">
            Entre 40 e 2.000 caracteres. Este texto será privado na sua conta.
          </p>
          {state.fieldErrors?.dailyLogContent && (
            <p className="field-error">{state.fieldErrors.dailyLogContent}</p>
          )}
        </section>

        <div className="onboarding-actions">
          {step > 0 ? (
            <button
              className="button-secondary"
              type="button"
              onClick={returnToPreviousStep}
              disabled={pending}
            >
              Voltar
            </button>
          ) : (
            <span />
          )}

          {step < steps.length - 1 ? (
            <button className="button-primary" type="button" onClick={continueToNextStep}>
              Continuar
            </button>
          ) : (
            <button className="button-primary" type="submit" disabled={pending}>
              {pending ? "Salvando registro…" : "Salvar primeiro registro"}
            </button>
          )}
        </div>

        {state.status === "error" && (
          <p className="form-error" role="alert">
            {state.message}
          </p>
        )}
      </form>
    </div>
  );
}
