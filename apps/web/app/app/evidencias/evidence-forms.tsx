"use client";

import { useActionState } from "react";

import {
  addEvidenceLink,
  createEvidence,
  updateEvidence,
  type EvidenceActionState,
} from "./actions";

const initialState: EvidenceActionState = { status: "idle" };

export type EvidenceValues = {
  title: string;
  context: string;
  challenge: string | null;
  action: string;
  result: string | null;
  competencies: string[];
  learning: string | null;
};

function FormMessage({ state }: { state: EvidenceActionState }) {
  if (!state.message) return null;
  return <p className={state.status === "error" ? "form-error" : "form-success"} role="status">{state.message}</p>;
}

function EvidenceFields({ id, values, errors }: { id: string; values: EvidenceValues; errors?: Record<string, string> }) {
  const error = (name: string) => errors?.[name];
  const titleError = error("title");
  const competenciesError = error("competencies");
  return (
    <>
      <div>
        <label className="field-label" htmlFor={`evidence-title-${id}`}>Título da evidência</label>
        <input className="text-field" id={`evidence-title-${id}`} name="title" minLength={4} maxLength={100} defaultValue={values.title} required aria-invalid={Boolean(titleError)} aria-describedby={titleError ? `evidence-title-error-${id}` : undefined} />
        {titleError && <p className="field-error" id={`evidence-title-error-${id}`}>{titleError}</p>}
      </div>
      <div className="evidence-field-grid">
        <EvidenceField id={id} label="Contexto" name="structuredContext" value={values.context} maxLength={600} required error={error("context")} />
        <EvidenceField id={id} label="Desafio" name="challenge" value={values.challenge} maxLength={600} error={error("challenge")} />
        <EvidenceField id={id} label="Ação" name="structuredAction" value={values.action} maxLength={800} required error={error("action")} />
        <EvidenceField id={id} label="Resultado" name="result" value={values.result} maxLength={600} error={error("result")} />
        <EvidenceField id={id} label="Aprendizado" name="learning" value={values.learning} maxLength={600} error={error("learning")} />
      </div>
      <div>
        <label className="field-label" htmlFor={`evidence-competencies-${id}`}>Competências</label>
        <input
          className="text-field"
          id={`evidence-competencies-${id}`}
          name="competencies"
          defaultValue={values.competencies.join(", ")}
          placeholder="Ex.: comunicação, organização, análise"
          required
          aria-invalid={Boolean(competenciesError)}
          aria-describedby={competenciesError ? `evidence-competencies-error-${id}` : `evidence-competencies-help-${id}`}
        />
        <p className="field-help" id={`evidence-competencies-help-${id}`}>Separe por vírgulas. Inclua apenas competências demonstradas pela ação.</p>
        {competenciesError && <p className="field-error" id={`evidence-competencies-error-${id}`}>{competenciesError}</p>}
      </div>
    </>
  );
}

export function NewEvidenceForm() {
  const [state, action, pending] = useActionState(createEvidence, initialState);
  const empty: EvidenceValues = { title: "", context: "", challenge: null, action: "", result: null, competencies: [], learning: null };
  return (
    <form action={action} className="evidence-form">
      <EvidenceFields id="new" values={empty} errors={state.fieldErrors} />
      <FormMessage state={state} />
      <div className="evidence-form-actions">
        <span>A evidência nasce Registrada. Adicione um link depois para torná-la Documentada.</span>
        <button className="button-primary" disabled={pending} type="submit">{pending ? "Registrando…" : "Registrar evidência"}</button>
      </div>
    </form>
  );
}

export function EditEvidenceForm({ id, values }: { id: string; values: EvidenceValues }) {
  const [state, action, pending] = useActionState(updateEvidence.bind(null, id), initialState);
  return (
    <form action={action} className="evidence-form evidence-edit-form">
      <EvidenceFields id={id} values={values} errors={state.fieldErrors} />
      <FormMessage state={state} />
      <div className="evidence-form-actions evidence-form-actions-end">
        <button className="button-primary" disabled={pending} type="submit">{pending ? "Salvando…" : "Salvar alterações"}</button>
      </div>
    </form>
  );
}

export function EvidenceLinkForm({ evidenceId }: { evidenceId: string }) {
  const [state, action, pending] = useActionState(addEvidenceLink.bind(null, evidenceId), initialState);
  const titleError = state.fieldErrors?.sourceTitle;
  const urlError = state.fieldErrors?.sourceUrl;
  return (
    <form action={action} className="evidence-link-form">
      <div>
        <label className="field-label" htmlFor={`source-title-${evidenceId}`}>Nome do link <span>opcional</span></label>
        <input className="text-field" id={`source-title-${evidenceId}`} name="sourceTitle" minLength={2} maxLength={100} placeholder="Ex.: apresentação final" aria-invalid={Boolean(titleError)} aria-describedby={titleError ? `source-title-error-${evidenceId}` : undefined} />
        {titleError && <p className="field-error" id={`source-title-error-${evidenceId}`}>{titleError}</p>}
      </div>
      <div>
        <label className="field-label" htmlFor={`source-url-${evidenceId}`}>URL da prova</label>
        <input className="text-field" id={`source-url-${evidenceId}`} name="sourceUrl" type="url" maxLength={2048} placeholder="https://" required aria-invalid={Boolean(urlError)} aria-describedby={urlError ? `source-url-error-${evidenceId}` : undefined} />
        {urlError && <p className="field-error" id={`source-url-error-${evidenceId}`}>{urlError}</p>}
      </div>
      <FormMessage state={state} />
      <button className="button-primary" disabled={pending} type="submit">{pending ? "Adicionando…" : "Adicionar link"}</button>
    </form>
  );
}

function EvidenceField({ id, label, name, value, maxLength, required = false, error }: { id: string; label: string; name: string; value: string | null; maxLength: number; required?: boolean; error?: string }) {
  return (
    <div>
      <label className="field-label" htmlFor={`${name}-${id}`}>{label}</label>
      <textarea className="text-field evidence-structured-field" id={`${name}-${id}`} name={name} maxLength={maxLength} defaultValue={value ?? ""} required={required} placeholder={required ? undefined : "Não informado"} aria-invalid={Boolean(error)} aria-describedby={error ? `${name}-error-${id}` : undefined} />
      {error && <p className="field-error" id={`${name}-error-${id}`}>{error}</p>}
    </div>
  );
}
