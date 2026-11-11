"use client";

import { useActionState, useRef, useState } from "react";

import { Chip, Icon, StepFlow, Textarea } from "@/components/ds";
import { DIAGNOSTIC_OPTIONS, DIAGNOSTIC_QUESTIONS } from "@/lib/score/diagnostic";

import { saveDiagnostic, type DiagnosticActionState } from "./actions";

const copy = [
  { title: "Qual narrativa você quer construir?", description: "Seu objetivo orienta a leitura inicial. Ele pode mudar depois; aqui precisamos apenas de uma direção concreta." },
  { title: "O quanto sua história já está clara?", description: "Responda pelo que você consegue explicar hoje, não pelo nível que gostaria de alcançar." },
  { title: "Como essa narrativa aparece nos seus registros?", description: "As duas primeiras respostas formam a consistência declarada. As demais orientam suas próximas ações." },
];

export function DiagnosticForm({
  initialStep,
  diagnosticId,
  objective,
  answers,
}: {
  initialStep: number;
  diagnosticId?: string;
  objective: string;
  answers: Record<string, number>;
}) {
  const initialState: DiagnosticActionState = { status: "idle", currentStep: initialStep, diagnosticId };
  const [state, action, pending] = useActionState(saveDiagnostic, initialState);
  const [goal, setGoal] = useState(objective);
  const [chosen, setChosen] = useState<Record<string, number>>(answers);
  const formRef = useRef<HTMLFormElement>(null);
  const intentRef = useRef<HTMLInputElement>(null);
  const step = state.currentStep;

  const send = (intent: "back" | "continue" | "complete") => {
    if (intentRef.current) intentRef.current.value = intent;
    formRef.current?.requestSubmit();
  };

  const questionRows = (from: number, to: number) =>
    DIAGNOSTIC_QUESTIONS.slice(from, to).map((question, index) => (
      <fieldset className="dx-diag__q" key={question.id}>
        <legend className="dx-diag__legend">
          <span className="dx-ws__num">{String(from + index + 1).padStart(2, "0")}</span> {question.text}
        </legend>
        <div className="dx-diag__opts">
          {DIAGNOSTIC_OPTIONS.map((option) => (
            <Chip key={option.value} selected={chosen[question.id] === option.value} onClick={() => setChosen((current) => ({ ...current, [question.id]: option.value }))}>
              {option.label}
            </Chip>
          ))}
        </div>
        {state.fieldErrors?.[question.id] && (
          <p className="dx-page__notice dx-page__notice--error" role="alert">
            <Icon name="triangle-alert" size={16} />
            {state.fieldErrors[question.id]}
          </p>
        )}
      </fieldset>
    ));

  return (
    <form action={action} ref={formRef} noValidate>
      <input name="currentStep" type="hidden" value={step} />
      <input name="intent" type="hidden" defaultValue="continue" ref={intentRef} />
      <input name="objective" type="hidden" value={goal} />
      {Object.entries(chosen).map(([id, value]) => (
        <input key={id} name={id} type="hidden" value={value} />
      ))}
      <StepFlow
        step={step}
        total={3}
        headingLevel={2}
        title={copy[step - 1].title}
        description={copy[step - 1].description}
        error={state.status === "error" ? state.message : undefined}
        saving={pending}
        onBack={() => send("back")}
        onNext={() => send(step === 3 ? "complete" : "continue")}
        nextVariant="brand"
        nextLabel={step === 3 ? "Concluir diagnóstico" : "Salvar e continuar"}
      >
        {step === 1 && (
          <Textarea
            label="Objetivo profissional atual"
            rows={4}
            minLength={8}
            maxLength={240}
            value={goal}
            onChange={(event) => setGoal(event.target.value)}
            placeholder="Ex.: consolidar meu posicionamento em IA aplicada e demonstrar resultados reais dos projetos em que atuo."
            hint="8 a 240 caracteres."
            error={state.fieldErrors?.objective}
          />
        )}
        {step === 2 && <div className="dx-form">{questionRows(0, 6)}</div>}
        {step === 3 && (
          <div className="dx-form">
            {questionRows(6, 10)}
            <p className="dx-form__hint">O resultado inicial é uma base declarada, não uma avaliação definitiva. Registros e evidências substituirão essas respostas quando houver dados suficientes.</p>
          </div>
        )}
        {state.status === "saved" && state.message && (
          <p className="dx-page__notice dx-page__notice--ok" role="status">
            <Icon name="circle-check" size={16} />
            {state.message}
          </p>
        )}
      </StepFlow>
    </form>
  );
}
