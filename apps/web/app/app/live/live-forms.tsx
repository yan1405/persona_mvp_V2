"use client";

import { useActionState, useState } from "react";

import { Button, EvidenceCard, Icon, Input, Textarea } from "@/components/ds";

import { askLiveQuestion, authorizeAndActivate, createLiveSession, type LiveActionState } from "./actions";

const initialState: LiveActionState = { status: "idle" };

// Aviso calmo: o que a pessoa digitou continua nos campos (controlados).
function Message({ state }: { state: LiveActionState }) {
  if (!state.message) return null;
  return (
    <p className="dx-page__notice dx-page__notice--error" role="status">
      <Icon name="triangle-alert" size={16} />
      {state.message}
    </p>
  );
}

export function NewLiveSessionForm() {
  const [state, action, pending] = useActionState(createLiveSession, initialState);
  const [draft, setDraft] = useState({ targetRole: "", company: "", description: "" });
  const bind = (key: keyof typeof draft) => ({ value: draft[key], onChange: (e: { target: { value: string } }) => setDraft((d) => ({ ...d, [key]: e.target.value })) });
  return (
    <form action={action} className="dx-form">
      <div className="dx-form__row">
        <Input label="Vaga ou objetivo" name="targetRole" minLength={4} maxLength={120} required placeholder="Ex.: Consultor de IA" {...bind("targetRole")} error={state.fieldErrors?.targetRole} />
        <Input label="Empresa" name="company" minLength={2} maxLength={120} required placeholder="Ex.: Empresa da entrevista" {...bind("company")} error={state.fieldErrors?.company} />
      </div>
      <Textarea label="Descrição da oportunidade (opcional)" name="description" maxLength={2000} rows={4} placeholder="Cole responsabilidades ou temas que podem aparecer na conversa." {...bind("description")} error={state.fieldErrors?.description} />
      <Message state={state} />
      <div className="dx-form__actions">
        <span className="dx-form__hint">Você escolherá as evidências antes de iniciar.</span>
        <Button variant="brand" type="submit" disabled={pending} iconRight="arrow-right">
          {pending ? "Criando…" : "Preparar sessão"}
        </Button>
      </div>
    </form>
  );
}

export type LiveEvidenceOption = { id: string; title: string; context: string; competencies: string[]; level: string; score: number; reasons: string[]; selected: boolean };

export function EvidenceSelectionForm({ sessionId, evidences, resume }: { sessionId: string; evidences: LiveEvidenceOption[]; resume: boolean }) {
  const [state, action, pending] = useActionState(authorizeAndActivate.bind(null, sessionId), initialState);
  const [selected, setSelected] = useState(() => new Set(evidences.filter((item) => item.selected).map((item) => item.id)));
  const toggle = (id: string, on: boolean) =>
    setSelected((current) => {
      const next = new Set(current);
      if (on) next.add(id);
      else next.delete(id);
      return next;
    });
  return (
    <form action={action} className="dx-form">
      <p className="dx-home__text" aria-live="polite">
        <b>{selected.size} selecionada{selected.size === 1 ? "" : "s"}.</b> Escolha de 1 a 8 fatos que podem sustentar suas respostas.
      </p>
      <ul className="dx-grid">
        {evidences.map((evidence) => (
          <li key={evidence.id}>
            <EvidenceCard
              variant="selectable"
              title={evidence.title}
              competencies={evidence.competencies.slice(0, 3)}
              level={evidence.level === "Documentada" ? "Documentada" : "Registrada"}
              reason={evidence.reasons[0]}
              selected={selected.has(evidence.id)}
              disabled={!selected.has(evidence.id) && selected.size >= 8}
              onSelectedChange={(on) => toggle(evidence.id, on)}
            />
            {selected.has(evidence.id) ? <input type="hidden" name="evidenceId" value={evidence.id} /> : null}
          </li>
        ))}
      </ul>
      <Message state={state} />
      <div className="dx-form__actions">
        <span className="dx-form__hint">A seleção pode ser revista depois ao pausar a sessão.</span>
        <Button variant="brand" type="submit" disabled={pending || selected.size < 1}>
          {pending ? "Confirmando…" : resume ? "Confirmar e retomar" : "Confirmar e iniciar"}
        </Button>
      </div>
    </form>
  );
}

export function LiveQuestionForm({ sessionId }: { sessionId: string }) {
  const [state, action, pending] = useActionState(askLiveQuestion.bind(null, sessionId), initialState);
  const [question, setQuestion] = useState("");
  return (
    <form action={action} className="dx-form">
      <Textarea
        label="Pergunta da entrevista"
        name="question"
        minLength={8}
        maxLength={500}
        rows={3}
        required
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Ex.: Conte sobre uma situação em que você precisou explicar uma solução complexa."
        hint="O Persona consulta somente as evidências autorizadas nesta sessão."
      />
      <Message state={state} />
      <div className="dx-form__actions dx-form__actions--end">
        <Button variant="brand" type="submit" disabled={pending} icon="list-checks">
          {pending ? "Recuperando fatos…" : "Preparar resposta"}
        </Button>
      </div>
    </form>
  );
}

export function CopyDraftButton({ draft }: { draft: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <Button
      variant="outline"
      size="sm"
      icon={copied ? "check" : "copy"}
      onClick={async () => {
        await navigator.clipboard.writeText(draft);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1500);
      }}
    >
      {copied ? "Copiado" : "Copiar"}
    </Button>
  );
}

export function ConfirmCloseButton({ action }: { action: () => Promise<void> }) {
  return (
    <form
      action={action}
      onSubmit={(event) => {
        if (!window.confirm("Encerrar esta sessão? O histórico ficará somente para leitura.")) event.preventDefault();
      }}
    >
      <Button variant="outline" size="sm" type="submit" icon="lock">
        Encerrar sessão
      </Button>
    </form>
  );
}
