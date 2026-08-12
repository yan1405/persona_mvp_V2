"use client";

import { useActionState } from "react";

import { DIAGNOSTIC_OPTIONS, DIAGNOSTIC_QUESTIONS } from "@/lib/score/diagnostic";

import { saveDiagnostic, type DiagnosticActionState } from "./actions";

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
  const step = state.currentStep;

  const questionRows = (from: number, to: number) => DIAGNOSTIC_QUESTIONS.slice(from, to).map((question, index) => (
    <fieldset className="diagnostic-question" key={question.id}>
      <legend><span>{String(from + index + 1).padStart(2, "0")}</span>{question.text}</legend>
      <div className="diagnostic-options">
        {DIAGNOSTIC_OPTIONS.map((option) => (
          <label key={option.value}>
            <input name={question.id} type="radio" value={option.value} defaultChecked={answers[question.id] === option.value} />
            <span>{option.label}</span>
          </label>
        ))}
      </div>
      {state.fieldErrors?.[question.id] && <p className="field-error">{state.fieldErrors[question.id]}</p>}
    </fieldset>
  ));

  return (
    <form action={action} className="diagnostic-form" noValidate>
      <input name="currentStep" type="hidden" value={step} />
      <header className="diagnostic-step-header">
        <span>Etapa {step} de 3</span>
        <span>{state.status === "saved" ? "Rascunho salvo" : pending ? "Salvando…" : "Salvamento por etapa"}</span>
      </header>

      <section hidden={step !== 1}>
        <p className="eyebrow">Ponto de partida</p>
        <h1>Qual narrativa você quer construir?</h1>
        <p className="diagnostic-intro">Seu objetivo orienta a leitura inicial. Ele pode mudar depois; aqui precisamos apenas de uma direção concreta.</p>
        <label className="field-label" htmlFor="diagnostic-objective">Objetivo profissional atual</label>
        <textarea className="text-field diagnostic-objective" id="diagnostic-objective" name="objective" minLength={8} maxLength={240} defaultValue={objective} placeholder="Ex.: consolidar meu posicionamento em IA aplicada e demonstrar resultados reais dos projetos em que atuo." />
        {state.fieldErrors?.objective && <p className="field-error">{state.fieldErrors.objective}</p>}
      </section>

      <section hidden={step !== 2}>
        <p className="eyebrow">Direção e repertório</p>
        <h1>O quanto sua história já está clara?</h1>
        <p className="diagnostic-intro">Responda pelo que você consegue explicar hoje, não pelo nível que gostaria de alcançar.</p>
        {questionRows(0, 6)}
      </section>

      <section hidden={step !== 3}>
        <p className="eyebrow">Prática e prontidão</p>
        <h1>Como essa narrativa aparece nos seus registros?</h1>
        <p className="diagnostic-intro">As duas primeiras respostas formam a consistência declarada. As demais orientam suas próximas ações.</p>
        {questionRows(6, 10)}
        <aside className="diagnostic-review">
          <strong>Antes de concluir</strong>
          <p>O resultado inicial é uma base declarada, não uma avaliação definitiva. Registros e evidências substituirão essas respostas quando houver dados suficientes.</p>
        </aside>
      </section>

      {state.message && <p className={state.status === "error" ? "form-error" : "form-success"} role="status">{state.message}</p>}
      <footer className="diagnostic-actions">
        <button className="button-secondary" disabled={pending || step === 1} name="intent" value="back" type="submit">Voltar</button>
        <button className="button-primary" disabled={pending} name="intent" value={step === 3 ? "complete" : "continue"} type="submit">
          {pending ? "Salvando…" : step === 3 ? "Concluir diagnóstico" : "Salvar e continuar"}
        </button>
      </footer>
    </form>
  );
}
