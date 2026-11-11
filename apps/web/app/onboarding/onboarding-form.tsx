"use client";

import { useActionState, useRef, useState } from "react";

import { Card, Chip, Input, StepFlow, Switch, Textarea } from "@/components/ds";

import { completeOnboarding, type OnboardingActionState } from "./actions";

const STEPS = [
  { title: "Conte onde você está agora.", description: "Essas respostas dão contexto aos seus registros. Você poderá ajustá-las depois." },
  { title: "Você decide como seus dados serão usados.", description: "O Persona guarda relatos profissionais privados para organizar evidências. Comunicações são uma escolha separada." },
  { title: "Escolha um horário para registrar.", description: "O lembrete é opcional e poderá ser alterado nas preferências." },
  {
    title: "Conte o que aconteceu na prática.",
    description: "Conte uma situação recente em que você resolveu um problema, entregou algo ou aprendeu. Escreva como lembrar; a estruturação vem depois.",
  },
] as const;
const LAST = STEPS.length - 1;

const MOMENTS = [
  { value: "estudando", label: "Estudando e me preparando" },
  { value: "inicio-carreira", label: "No início da carreira" },
  { value: "transicao", label: "Mudando de área ou função" },
  { value: "consolidacao", label: "Consolidando minha experiência" },
  { value: "lideranca", label: "Assumindo liderança" },
] as const;

// Etapa de cada campo (para voltar à etapa certa quando o servidor devolve um erro).
const FIELD_STEP: Record<string, number> = {
  displayName: 0,
  professionalMoment: 0,
  mainObjective: 0,
  productConsent: 1,
  communicationsConsent: 1,
  reminderTime: 2,
  dailyLogContent: 3,
};
const FIELD_FOCUS: Record<string, string> = {
  displayName: "displayName",
  professionalMoment: "moment-group",
  mainObjective: "mainObjective",
  productConsent: "productConsent",
  reminderTime: "reminderTime",
  dailyLogContent: "dailyLogContent",
};

const initialOnboardingState: OnboardingActionState = { status: "idle" };

type Draft = {
  displayName: string;
  professionalMoment: string;
  mainObjective: string;
  productConsent: boolean;
  communicationsConsent: boolean;
  reminderEnabled: boolean;
  reminderTime: string;
  dailyLogContent: string;
};

// Mesmas regras de lib/onboarding/validation.ts, só para avisar antes do envio (o servidor continua validando tudo).
function validateStep(step: number, draft: Draft): Record<string, string> {
  const errors: Record<string, string> = {};
  if (step === 0) {
    const name = draft.displayName.trim().length;
    if (name < 2 || name > 80) errors.displayName = "Informe um nome entre 2 e 80 caracteres.";
    if (!draft.professionalMoment) errors.professionalMoment = "Escolha o momento que mais se parece com o seu.";
    const objective = draft.mainObjective.trim().length;
    if (objective < 8 || objective > 180) errors.mainObjective = "Descreva seu objetivo em 8 a 180 caracteres.";
  }
  if (step === 1 && !draft.productConsent) {
    errors.productConsent = "Este consentimento é necessário para salvar seu perfil e seus registros.";
  }
  if (step === 2 && draft.reminderEnabled && !/^\d{2}:\d{2}$/.test(draft.reminderTime)) {
    errors.reminderTime = "Informe o horário do lembrete.";
  }
  if (step === 3) {
    const log = draft.dailyLogContent.trim().length;
    if (log < 40 || log > 2000) errors.dailyLogContent = "Escreva entre 40 e 2.000 caracteres para este primeiro registro.";
  }
  return errors;
}

type OnboardingFormProps = {
  defaultName: string;
  email: string;
};

export function OnboardingForm({ defaultName, email }: OnboardingFormProps) {
  const [step, setStep] = useState(0);
  // O rascunho fica em estado (campos controlados): um erro do servidor não apaga o que a pessoa escreveu.
  const [draft, setDraft] = useState<Draft>({
    displayName: defaultName,
    professionalMoment: "",
    mainObjective: "",
    productConsent: false,
    communicationsConsent: false,
    reminderEnabled: false,
    reminderTime: "18:00",
    dailyLogContent: "",
  });
  const [localErrors, setLocalErrors] = useState<Record<string, string>>({});
  const [state, formAction, pending] = useActionState(completeOnboarding, initialOnboardingState);
  const [seenState, setSeenState] = useState(state);
  const formRef = useRef<HTMLFormElement>(null);

  // Erro do servidor: volta à primeira etapa com problema e foca o campo (ajuste de estado na renderização, sem efeito).
  if (state !== seenState) {
    setSeenState(state);
    const keys = Object.keys(state.fieldErrors ?? {});
    if (state.status === "error" && keys.length > 0) {
      const target = Math.min(...keys.map((k) => FIELD_STEP[k] ?? LAST));
      setStep(target);
      setLocalErrors({});
    }
  }

  const errors: Record<string, string> = { ...(state.fieldErrors ?? {}), ...localErrors };
  const set = <K extends keyof Draft>(key: K, value: Draft[K]) => {
    setDraft((current) => ({ ...current, [key]: value }));
    setLocalErrors((current) => {
      if (!(key in current)) return current;
      const rest = { ...current };
      delete rest[key];
      return rest;
    });
  };

  function focusFirst(found: Record<string, string>) {
    const key = Object.keys(found)[0];
    if (!key) return;
    const id = FIELD_FOCUS[key] ?? key;
    window.setTimeout(() => document.getElementById(id)?.focus(), 0);
  }

  function advance() {
    const found = validateStep(step, draft);
    if (Object.keys(found).length > 0) {
      setLocalErrors(found);
      focusFirst(found);
      return;
    }
    setLocalErrors({});
    if (step < LAST) setStep(step + 1);
    else formRef.current?.requestSubmit();
  }

  const current = STEPS[step];
  const stepErrors = Object.keys(errors).some((k) => FIELD_STEP[k] === step);
  const summary = state.status === "error" && state.message ? state.message : stepErrors ? "Revise os campos indicados para continuar." : undefined;

  return (
    <form
      ref={formRef}
      action={formAction}
      noValidate
      onSubmit={(event) => {
        // Enter num campo não envia antes da última etapa: segue o mesmo caminho do botão Continuar.
        if (step < LAST) {
          event.preventDefault();
          advance();
        }
      }}
    >
      <StepFlow
        headingLevel={1}
        step={step + 1}
        total={STEPS.length}
        title={current.title}
        description={current.description}
        onBack={() => {
          setLocalErrors({});
          setStep((value) => Math.max(0, value - 1));
        }}
        onNext={advance}
        nextLabel={step === LAST ? "Salvar primeiro registro" : "Continuar"}
        nextVariant={step === LAST ? "brand" : "solid"}
        saving={pending}
        disabled={pending}
        error={summary}
      >
        <div className="dx-ob__step" hidden={step !== 0}>
          <Input
            label="Nome"
            id="displayName"
            name="displayName"
            value={draft.displayName}
            onChange={(e) => set("displayName", e.target.value)}
            minLength={2}
            maxLength={80}
            autoComplete="name"
            required
            error={errors.displayName}
          />
          <fieldset className="dx-ob__group" aria-describedby={errors.professionalMoment ? "moment-error" : undefined}>
            <legend className="dx-ob__group-label">Momento profissional</legend>
            <div className="dx-ob__chips" id="moment-group" tabIndex={-1}>
              {MOMENTS.map((m) => (
                <Chip key={m.value} selected={draft.professionalMoment === m.value} onClick={() => set("professionalMoment", m.value)}>
                  {m.label}
                </Chip>
              ))}
            </div>
            <input type="hidden" name="professionalMoment" value={draft.professionalMoment} />
            {errors.professionalMoment ? (
              <p className="dx-ob__error" id="moment-error" role="alert">
                {errors.professionalMoment}
              </p>
            ) : null}
          </fieldset>
          <Textarea
            label="Objetivo principal"
            id="mainObjective"
            name="mainObjective"
            value={draft.mainObjective}
            onChange={(e) => set("mainObjective", e.target.value)}
            minLength={8}
            maxLength={180}
            rows={3}
            placeholder="Ex.: preparar exemplos concretos para entrevistas"
            hint="Em uma ou duas frases."
            required
            error={errors.mainObjective}
          />
        </div>

        <div className="dx-ob__step" hidden={step !== 1}>
          <Card bordered elevation="none" className="dx-ob__choice">
            <Switch
              id="productConsent"
              label="Permitir o tratamento dos meus dados para usar o Persona"
              checked={draft.productConsent}
              onChange={(value) => set("productConsent", value)}
            />
            {draft.productConsent ? <input type="hidden" name="productConsent" value="on" /> : null}
            <p className="dx-ob__help">
              Necessário para salvar perfil e registros. Leia a{" "}
              <a className="dx-link" href="/privacidade" target="_blank" rel="noreferrer">
                Política de Privacidade
              </a>{" "}
              e os{" "}
              <a className="dx-link" href="/termos" target="_blank" rel="noreferrer">
                Termos
              </a>
              .
            </p>
            {errors.productConsent ? (
              <p className="dx-ob__error" role="alert">
                {errors.productConsent}
              </p>
            ) : null}
          </Card>
          <Card bordered elevation="none" className="dx-ob__choice">
            <Switch
              id="communicationsConsent"
              label="Receber novidades e convites de pesquisa"
              checked={draft.communicationsConsent}
              onChange={(value) => set("communicationsConsent", value)}
            />
            {draft.communicationsConsent ? <input type="hidden" name="communicationsConsent" value="on" /> : null}
            <p className="dx-ob__help">Opcional. Não interfere no uso do produto.</p>
          </Card>
        </div>

        <div className="dx-ob__step" hidden={step !== 2}>
          <Card bordered elevation="none" className="dx-ob__choice">
            <Switch
              id="reminderEnabled"
              label="Ativar lembrete diário"
              checked={draft.reminderEnabled}
              onChange={(value) => set("reminderEnabled", value)}
            />
            {draft.reminderEnabled ? <input type="hidden" name="reminderEnabled" value="on" /> : null}
            <p className="dx-ob__help">Uma pausa curta para registrar o que aconteceu no dia.</p>
          </Card>
          {draft.reminderEnabled ? (
            <Input
              label="Horário"
              id="reminderTime"
              name="reminderTime"
              type="time"
              value={draft.reminderTime}
              onChange={(e) => set("reminderTime", e.target.value)}
              required
              error={errors.reminderTime}
            />
          ) : null}
        </div>

        <div className="dx-ob__step" hidden={step !== 3}>
          <Textarea
            label="Daily Log"
            id="dailyLogContent"
            name="dailyLogContent"
            value={draft.dailyLogContent}
            onChange={(e) => set("dailyLogContent", e.target.value)}
            minLength={40}
            maxLength={2000}
            rows={9}
            placeholder="Ex.: hoje eu precisei revisar..."
            hint="Entre 40 e 2.000 caracteres. Este texto será privado na sua conta."
            required
            error={errors.dailyLogContent}
          />
        </div>
      </StepFlow>
      <p className="dx-page__note">
        Conta Microsoft: <strong>{email}</strong>
      </p>
    </form>
  );
}
