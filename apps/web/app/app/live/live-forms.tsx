"use client";

import { useActionState, useState } from "react";

import { askLiveQuestion, authorizeAndActivate, createLiveSession, type LiveActionState } from "./actions";

const initialState: LiveActionState = { status: "idle" };

function Message({ state }: { state: LiveActionState }) {
  return state.message ? <p className="form-error" role="status">{state.message}</p> : null;
}

export function NewLiveSessionForm() {
  const [state, action, pending] = useActionState(createLiveSession, initialState);
  return (
    <form action={action} className="live-context-form">
      <div>
        <label className="field-label" htmlFor="live-target">Vaga ou objetivo</label>
        <input className="text-field" id="live-target" name="targetRole" minLength={4} maxLength={120} required placeholder="Ex.: Consultor de IA" aria-invalid={Boolean(state.fieldErrors?.targetRole)} />
        {state.fieldErrors?.targetRole && <p className="field-error">{state.fieldErrors.targetRole}</p>}
      </div>
      <div>
        <label className="field-label" htmlFor="live-company">Empresa</label>
        <input className="text-field" id="live-company" name="company" minLength={2} maxLength={120} required placeholder="Ex.: Empresa da entrevista" aria-invalid={Boolean(state.fieldErrors?.company)} />
        {state.fieldErrors?.company && <p className="field-error">{state.fieldErrors.company}</p>}
      </div>
      <div className="live-context-description">
        <label className="field-label" htmlFor="live-description">Descrição da oportunidade <span>opcional</span></label>
        <textarea className="text-field" id="live-description" name="description" maxLength={2000} rows={4} placeholder="Cole responsabilidades ou temas que podem aparecer na conversa." aria-invalid={Boolean(state.fieldErrors?.description)} />
        {state.fieldErrors?.description && <p className="field-error">{state.fieldErrors.description}</p>}
      </div>
      <Message state={state} />
      <footer><span>Você escolherá as evidências antes de iniciar.</span><button className="button-primary" disabled={pending} type="submit">{pending ? "Criando…" : "Preparar sessão"}</button></footer>
    </form>
  );
}

export type LiveEvidenceOption = { id: string; title: string; context: string; competencies: string[]; level: string; score: number; reasons: string[]; selected: boolean };

export function EvidenceSelectionForm({ sessionId, evidences, resume }: { sessionId: string; evidences: LiveEvidenceOption[]; resume: boolean }) {
  const [state, action, pending] = useActionState(authorizeAndActivate.bind(null, sessionId), initialState);
  const [selected, setSelected] = useState(() => new Set(evidences.filter((item) => item.selected).map((item) => item.id)));
  return (
    <form action={action} className="live-evidence-form">
      <div className="live-selection-summary" aria-live="polite"><strong>{selected.size} selecionada{selected.size === 1 ? "" : "s"}</strong><span>Escolha de 1 a 8 fatos que podem sustentar suas respostas.</span></div>
      <ol className="live-evidence-options">
        {evidences.map((evidence, index) => (
          <li key={evidence.id} data-selected={selected.has(evidence.id)}>
            <label>
              <input type="checkbox" name="evidenceId" value={evidence.id} checked={selected.has(evidence.id)} disabled={!selected.has(evidence.id) && selected.size >= 8} onChange={(event) => setSelected((current) => { const next = new Set(current); if (event.target.checked) next.add(evidence.id); else next.delete(evidence.id); return next; })} />
              <span className="live-evidence-rank">{String(index + 1).padStart(2, "0")}</span>
              <span className="live-evidence-copy"><strong>{evidence.title}</strong><span>{evidence.context}</span><small>{evidence.competencies.slice(0, 3).join(" · ") || "Sem competência declarada"}</small></span>
              <span className="live-evidence-meta"><small>{evidence.level}</small><span>{evidence.reasons[0]}</span></span>
            </label>
          </li>
        ))}
      </ol>
      <Message state={state} />
      <footer><span>A seleção pode ser revista depois ao pausar a sessão.</span><button className="button-primary" disabled={pending || selected.size < 1} type="submit">{pending ? "Confirmando…" : resume ? "Confirmar e retomar" : "Confirmar e iniciar"}</button></footer>
    </form>
  );
}

export function LiveQuestionForm({ sessionId }: { sessionId: string }) {
  const [state, action, pending] = useActionState(askLiveQuestion.bind(null, sessionId), initialState);
  return (
    <form action={action} className="live-question-form">
      <label className="field-label" htmlFor="live-question">Pergunta da entrevista</label>
      <div><textarea className="text-field" id="live-question" name="question" minLength={8} maxLength={500} rows={3} required placeholder="Ex.: Conte sobre uma situação em que você precisou explicar uma solução complexa." /><button className="button-primary" disabled={pending} type="submit">{pending ? "Recuperando fatos…" : "Preparar resposta"}</button></div>
      <p className="field-help">O Persona consulta somente as evidências autorizadas nesta sessão.</p>
      <Message state={state} />
    </form>
  );
}

export function CopyDraftButton({ draft }: { draft: string }) {
  const [copied, setCopied] = useState(false);
  return <button className="button-secondary" type="button" onClick={async () => { await navigator.clipboard.writeText(draft); setCopied(true); window.setTimeout(() => setCopied(false), 1500); }}>{copied ? "Copiado" : "Copiar rascunho"}</button>;
}

export function ConfirmCloseButton({ action }: { action: () => Promise<void> }) {
  return <form action={action} onSubmit={(event) => { if (!window.confirm("Encerrar esta sessão? O histórico ficará somente para leitura.")) event.preventDefault(); }}><button className="button-secondary" type="submit">Encerrar sessão</button></form>;
}
