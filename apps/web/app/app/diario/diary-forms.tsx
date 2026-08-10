"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import {
  createDailyLog,
  reviewSuggestion,
  updateDailyLog,
  type DiaryActionState,
} from "./actions";

const initialState: DiaryActionState = { status: "idle" };

type LogValues = {
  content: string;
  context: string | null;
  occurredOn: string;
};

function FormMessage({ state }: { state: DiaryActionState }) {
  if (!state.message) return null;
  return (
    <p className={state.status === "error" ? "form-error" : "form-success"} role="status">
      {state.message}
    </p>
  );
}

function LogFields({ values }: { values: LogValues }) {
  return (
    <>
      <label className="field-label" htmlFor="daily-content">O que aconteceu hoje?</label>
      <textarea
        className="text-field diary-editor"
        id="daily-content"
        name="content"
        minLength={40}
        maxLength={2000}
        defaultValue={values.content}
        placeholder="Descreva uma situação, o que você fez e o que mudou. Use sua própria voz."
        required
      />
      <p className="field-help">40–2.000 caracteres. O texto original será preservado.</p>

      <div className="diary-meta-fields">
        <div>
          <label className="field-label" htmlFor="daily-date">Data da experiência</label>
          <input
            className="text-field"
            id="daily-date"
            name="occurredOn"
            type="date"
            defaultValue={values.occurredOn}
            required
          />
        </div>
        <div>
          <label className="field-label" htmlFor="daily-context">Contexto opcional</label>
          <input
            className="text-field"
            id="daily-context"
            name="context"
            maxLength={160}
            defaultValue={values.context ?? ""}
            placeholder="Ex.: estágio, projeto escolar, voluntariado"
          />
        </div>
      </div>
    </>
  );
}

export function NewDailyLogForm({ today }: { today: string }) {
  const [state, action, pending] = useActionState(createDailyLog, initialState);

  return (
    <form action={action} className="diary-capture-form">
      <LogFields values={{ content: "", context: null, occurredOn: today }} />
      {state.fieldErrors && (
        <ul className="field-error-list" aria-label="Campos para revisar">
          {Object.values(state.fieldErrors).map((error) => <li key={error}>{error}</li>)}
        </ul>
      )}
      <FormMessage state={state} />
      <div className="diary-form-actions">
        <span>Sugestões só são criadas depois que o registro estiver salvo.</span>
        <button className="button-primary" disabled={pending} type="submit">
          {pending ? "Salvando…" : "Salvar registro"}
        </button>
      </div>
    </form>
  );
}

export function EditDailyLogForm({ id, values }: { id: string; values: LogValues }) {
  const action = updateDailyLog.bind(null, id);
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="diary-edit-form">
      <LogFields values={values} />
      {state.fieldErrors && (
        <ul className="field-error-list" aria-label="Campos para revisar">
          {Object.values(state.fieldErrors).map((error) => <li key={error}>{error}</li>)}
        </ul>
      )}
      <FormMessage state={state} />
      <div className="diary-form-actions diary-form-actions-end">
        <button className="button-primary" disabled={pending} type="submit">
          {pending ? "Salvando…" : "Salvar alterações"}
        </button>
      </div>
    </form>
  );
}

type SuggestionValues = {
  title: string | null;
  context: string | null;
  challenge: string | null;
  action: string | null;
  result: string | null;
  competencies: string[];
  learning: string | null;
};

export function SuggestionReviewForm({
  id,
  values,
}: {
  id: string;
  values: SuggestionValues;
}) {
  const action = reviewSuggestion.bind(null, id);
  const [state, formAction, pending] = useActionState(action, initialState);
  const error = (name: string) => state.fieldErrors?.[name];

  return (
    <form action={formAction} className="suggestion-form">
      <div>
        <label className="field-label" htmlFor={`title-${id}`}>Título da evidência</label>
        <input className="text-field" id={`title-${id}`} name="title" maxLength={100} defaultValue={values.title ?? ""} />
        {error("title") && <p className="field-error">{error("title")}</p>}
      </div>

      <div className="suggestion-field-grid">
        <StructuredField id={id} label="Contexto" name="structuredContext" value={values.context} maxLength={600} error={error("context")} />
        <StructuredField id={id} label="Desafio" name="challenge" value={values.challenge} maxLength={600} error={error("challenge")} />
        <StructuredField id={id} label="Ação" name="structuredAction" value={values.action} maxLength={800} error={error("action")} />
        <StructuredField id={id} label="Resultado" name="result" value={values.result} maxLength={600} error={error("result")} />
        <StructuredField id={id} label="Aprendizado" name="learning" value={values.learning} maxLength={600} error={error("learning")} />
      </div>

      <div>
        <label className="field-label" htmlFor={`competencies-${id}`}>Competências</label>
        <input
          className="text-field"
          id={`competencies-${id}`}
          name="competencies"
          defaultValue={values.competencies.join(", ")}
          placeholder="Ex.: comunicação, organização, análise"
        />
        <p className="field-help">Separe por vírgulas. Confirme somente competências sustentadas pela ação.</p>
        {error("competencies") && <p className="field-error">{error("competencies")}</p>}
      </div>

      <FormMessage state={state} />
      <div className="review-actions">
        <button className="button-secondary" disabled={pending} name="intent" value="save" type="submit">
          {pending ? "Salvando…" : "Salvar revisão"}
        </button>
        <button className="button-primary" disabled={pending} name="intent" value="confirm" type="submit">
          {pending ? "Confirmando…" : "Confirmar como evidência"}
        </button>
      </div>
    </form>
  );
}

function StructuredField({
  id,
  label,
  name,
  value,
  maxLength,
  error,
}: {
  id: string;
  label: string;
  name: string;
  value: string | null;
  maxLength: number;
  error?: string;
}) {
  return (
    <div>
      <label className="field-label" htmlFor={`${name}-${id}`}>{label}</label>
      <textarea
        className="text-field structured-field"
        id={`${name}-${id}`}
        name={name}
        maxLength={maxLength}
        defaultValue={value ?? ""}
        placeholder="Sem suporte no relato"
      />
      {error && <p className="field-error">{error}</p>}
    </div>
  );
}

export function PendingButton({
  children,
  pendingLabel,
  className = "button-secondary",
}: {
  children: React.ReactNode;
  pendingLabel: string;
  className?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button className={className} disabled={pending} type="submit">
      {pending ? pendingLabel : children}
    </button>
  );
}
