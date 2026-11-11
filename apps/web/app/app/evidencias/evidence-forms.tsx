"use client";

import { useActionState, useState } from "react";

import { Button, Icon, Input, Textarea } from "@/components/ds";

import { addEvidenceLink, createEvidence, updateEvidence, type EvidenceActionState } from "./actions";

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

// Aviso calmo: o rascunho continua nos campos (eles são controlados), nada é apagado por um erro.
function FormMessage({ state }: { state: EvidenceActionState }) {
  if (!state.message) return null;
  const error = state.status === "error";
  return (
    <p className={`dx-page__notice ${error ? "dx-page__notice--error" : "dx-page__notice--ok"}`} role="status">
      <Icon name={error ? "triangle-alert" : "circle-check"} size={16} />
      {state.message}
    </p>
  );
}

function EvidenceFields({ values, errors }: { values: EvidenceValues; errors?: Record<string, string> }) {
  const [draft, setDraft] = useState({
    title: values.title,
    structuredContext: values.context,
    challenge: values.challenge ?? "",
    structuredAction: values.action,
    result: values.result ?? "",
    learning: values.learning ?? "",
    competencies: values.competencies.join(", "),
  });
  const bind = (key: keyof typeof draft) => ({ value: draft[key], onChange: (e: { target: { value: string } }) => setDraft((d) => ({ ...d, [key]: e.target.value })) });
  return (
    <>
      <Input label="Título da evidência" name="title" minLength={4} maxLength={100} required {...bind("title")} error={errors?.title} />
      <Textarea label="Contexto" name="structuredContext" rows={3} maxLength={600} required {...bind("structuredContext")} error={errors?.context} />
      <Textarea label="Desafio" name="challenge" rows={3} maxLength={600} placeholder="Não informado" {...bind("challenge")} error={errors?.challenge} />
      <Textarea label="Ação" name="structuredAction" rows={3} maxLength={800} required {...bind("structuredAction")} error={errors?.action} />
      <Textarea label="Resultado" name="result" rows={3} maxLength={600} placeholder="Não informado" {...bind("result")} error={errors?.result} />
      <Textarea label="Aprendizado" name="learning" rows={3} maxLength={600} placeholder="Não informado" {...bind("learning")} error={errors?.learning} />
      <Input
        label="Competências"
        name="competencies"
        placeholder="Ex.: comunicação, organização, análise"
        hint="Separe por vírgulas. Inclua apenas competências demonstradas pela ação."
        required
        {...bind("competencies")}
        error={errors?.competencies}
      />
    </>
  );
}

export function NewEvidenceForm() {
  const [state, action, pending] = useActionState(createEvidence, initialState);
  const empty: EvidenceValues = { title: "", context: "", challenge: null, action: "", result: null, competencies: [], learning: null };
  return (
    <form action={action} className="dx-form">
      <EvidenceFields values={empty} errors={state.fieldErrors} />
      <FormMessage state={state} />
      <div className="dx-form__actions">
        <span className="dx-form__hint">A evidência nasce Registrada. Adicione um link depois para torná-la Documentada.</span>
        <Button variant="solid" type="submit" disabled={pending} icon="check">
          {pending ? "Registrando…" : "Registrar evidência"}
        </Button>
      </div>
    </form>
  );
}

export function EditEvidenceForm({ id, values }: { id: string; values: EvidenceValues }) {
  const [state, action, pending] = useActionState(updateEvidence.bind(null, id), initialState);
  return (
    <form action={action} className="dx-form">
      <EvidenceFields values={values} errors={state.fieldErrors} />
      <FormMessage state={state} />
      <div className="dx-form__actions dx-form__actions--end">
        <Button variant="solid" type="submit" disabled={pending}>
          {pending ? "Salvando…" : "Salvar alterações"}
        </Button>
      </div>
    </form>
  );
}

export function EvidenceLinkForm({ evidenceId }: { evidenceId: string }) {
  const [state, action, pending] = useActionState(addEvidenceLink.bind(null, evidenceId), initialState);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  return (
    <form action={action} className="dx-form">
      <Input label="Nome do link (opcional)" name="sourceTitle" minLength={2} maxLength={100} placeholder="Ex.: apresentação final" value={title} onChange={(e) => setTitle(e.target.value)} error={state.fieldErrors?.sourceTitle} />
      <Input label="URL da prova" name="sourceUrl" type="url" maxLength={2048} placeholder="https://" value={url} onChange={(e) => setUrl(e.target.value)} error={state.fieldErrors?.sourceUrl} required />
      <FormMessage state={state} />
      <div className="dx-form__actions dx-form__actions--end">
        <Button variant="outline" type="submit" disabled={pending} icon="link">
          {pending ? "Adicionando…" : "Adicionar link"}
        </Button>
      </div>
    </form>
  );
}
