"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";

import { Button, Icon, Input, Textarea, type ButtonVariant } from "@/components/ds";

import { createDailyLog, reviewSuggestion, updateDailyLog, type DiaryActionState } from "./actions";

const initialState: DiaryActionState = { status: "idle" };

type LogValues = {
  content: string;
  context: string | null;
  occurredOn: string;
};

// Aviso calmo: o rascunho continua nos campos (eles são controlados), nada é apagado por um erro.
function FormMessage({ state }: { state: DiaryActionState }) {
  if (!state.message) return null;
  const error = state.status === "error";
  return (
    <p className={`dx-page__notice ${error ? "dx-page__notice--error" : "dx-page__notice--ok"}`} role="status">
      <Icon name={error ? "triangle-alert" : "circle-check"} size={16} />
      {state.message}
    </p>
  );
}

function LogFields({ initial, errors }: { initial: LogValues; errors?: Record<string, string> }) {
  const [content, setContent] = useState(initial.content);
  const [occurredOn, setOccurredOn] = useState(initial.occurredOn);
  const [context, setContext] = useState(initial.context ?? "");
  return (
    <>
      <Textarea
        label="O que aconteceu hoje?"
        name="content"
        rows={7}
        minLength={40}
        maxLength={2000}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Descreva uma situação, o que você fez e o que mudou. Use sua própria voz."
        hint="40–2.000 caracteres. O texto original será preservado."
        error={errors?.content}
        required
      />
      <div className="dx-form__row">
        <Input label="Data da experiência" name="occurredOn" type="date" value={occurredOn} onChange={(e) => setOccurredOn(e.target.value)} error={errors?.occurredOn} required />
        <Input label="Contexto opcional" name="context" maxLength={160} value={context} onChange={(e) => setContext(e.target.value)} placeholder="Ex.: estágio, projeto escolar, voluntariado" error={errors?.context} />
      </div>
    </>
  );
}

export function NewDailyLogForm({ today }: { today: string }) {
  const [state, action, pending] = useActionState(createDailyLog, initialState);
  return (
    <form action={action} className="dx-form">
      <LogFields initial={{ content: "", context: null, occurredOn: today }} errors={state.fieldErrors} />
      <FormMessage state={state} />
      <div className="dx-form__actions">
        <span className="dx-form__hint">Sugestões só são criadas depois que o registro estiver salvo.</span>
        <Button variant="brand" type="submit" disabled={pending} icon="check">
          {pending ? "Salvando…" : "Salvar registro"}
        </Button>
      </div>
    </form>
  );
}

export function EditDailyLogForm({ id, values }: { id: string; values: LogValues }) {
  const [state, formAction, pending] = useActionState(updateDailyLog.bind(null, id), initialState);
  return (
    <form action={formAction} className="dx-form">
      <LogFields initial={values} errors={state.fieldErrors} />
      <FormMessage state={state} />
      <div className="dx-form__actions dx-form__actions--end">
        <Button variant="solid" type="submit" disabled={pending}>
          {pending ? "Salvando…" : "Salvar alterações"}
        </Button>
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

export function SuggestionReviewForm({ id, values }: { id: string; values: SuggestionValues }) {
  const [state, formAction, pending] = useActionState(reviewSuggestion.bind(null, id), initialState);
  const [draft, setDraft] = useState({
    title: values.title ?? "",
    structuredContext: values.context ?? "",
    challenge: values.challenge ?? "",
    structuredAction: values.action ?? "",
    result: values.result ?? "",
    learning: values.learning ?? "",
    competencies: values.competencies.join(", "),
  });
  const bind = (key: keyof typeof draft) => ({ value: draft[key], onChange: (e: { target: { value: string } }) => setDraft((d) => ({ ...d, [key]: e.target.value })) });
  const error = (name: string) => state.fieldErrors?.[name];
  return (
    <form action={formAction} className="dx-form">
      <Input label="Título da evidência" name="title" maxLength={100} {...bind("title")} error={error("title")} />
      <Textarea label="Contexto" name="structuredContext" rows={3} maxLength={600} placeholder="Sem suporte no relato" {...bind("structuredContext")} error={error("context")} />
      <Textarea label="Desafio" name="challenge" rows={3} maxLength={600} placeholder="Sem suporte no relato" {...bind("challenge")} error={error("challenge")} />
      <Textarea label="Ação" name="structuredAction" rows={3} maxLength={800} placeholder="Sem suporte no relato" {...bind("structuredAction")} error={error("action")} />
      <Textarea label="Resultado" name="result" rows={3} maxLength={600} placeholder="Sem suporte no relato" {...bind("result")} error={error("result")} />
      <Textarea label="Aprendizado" name="learning" rows={3} maxLength={600} placeholder="Sem suporte no relato" {...bind("learning")} error={error("learning")} />
      <Input
        label="Competências"
        name="competencies"
        placeholder="Ex.: comunicação, organização, análise"
        hint="Separe por vírgulas. Confirme somente competências sustentadas pela ação."
        {...bind("competencies")}
        error={error("competencies")}
      />
      <FormMessage state={state} />
      <div className="dx-form__actions dx-form__actions--end">
        <Button variant="outline" type="submit" name="intent" value="save" disabled={pending}>
          {pending ? "Salvando…" : "Salvar revisão"}
        </Button>
        <Button variant="solid" type="submit" name="intent" value="confirm" disabled={pending} icon="check">
          {pending ? "Confirmando…" : "Confirmar como evidência"}
        </Button>
      </div>
    </form>
  );
}

export function PendingButton({ children, pendingLabel, variant = "outline" }: { children: React.ReactNode; pendingLabel: string; variant?: ButtonVariant }) {
  const { pending } = useFormStatus();
  return (
    <Button variant={variant} size="sm" type="submit" disabled={pending}>
      {pending ? pendingLabel : children}
    </Button>
  );
}
