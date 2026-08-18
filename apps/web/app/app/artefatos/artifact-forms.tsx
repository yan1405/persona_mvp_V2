"use client";

import { useActionState, useEffect, useRef, useState, useTransition } from "react";

import { artifactTypeLabel, reorderBlocks, type ArtifactContent, type ArtifactSourceMap, type ArtifactType, type SupplementaryData } from "@/lib/artifacts/artifact";

import { createArtifact, markArtifactReviewed, regenerateArtifact, saveArtifactContent, type ArtifactActionState } from "./actions";

const initialState: ArtifactActionState = { status: "idle" };

export type ArtifactEvidenceOption = { id: string; title: string; context: string; competencies: string[] };

export function NewArtifactForm({ evidences }: { evidences: ArtifactEvidenceOption[] }) {
  const [state, action, pending] = useActionState(createArtifact, initialState);
  const [type, setType] = useState<ArtifactType>("star");
  const [selected, setSelected] = useState<Set<string>>(new Set(evidences.slice(0, Math.min(3, evidences.length)).map((item) => item.id)));
  return (
    <form action={action} className="artifact-create-form">
      <fieldset className="artifact-type-picker"><legend><span>01</span> Escolha o material</legend><div>{(["star", "pitch", "resume", "portfolio"] as ArtifactType[]).map((item) => <label key={item} data-selected={type === item}><input type="radio" name="type" value={item} checked={type === item} onChange={() => setType(item)} /><strong>{artifactTypeLabel[item]}</strong><small>{item === "star" ? "Entrevistas e perguntas comportamentais" : item === "pitch" ? "Versões de 30, 60 e 90 segundos" : item === "resume" ? "Modelo oficial legível por ATS" : "Documento editorial organizado por casos"}</small></label>)}</div>{state.fieldErrors?.type && <p className="field-error">{state.fieldErrors.type}</p>}</fieldset>
      <fieldset className="artifact-context-fields"><legend><span>02</span> Defina o objetivo</legend><div className="artifact-form-grid"><label><span className="field-label">Título do artefato</span><input className="text-field" name="title" minLength={2} maxLength={120} required placeholder={`Ex.: ${artifactTypeLabel[type]} para processo seletivo`} aria-invalid={Boolean(state.fieldErrors?.title)} />{state.fieldErrors?.title && <small className="field-error">{state.fieldErrors.title}</small>}</label><label><span className="field-label">Objetivo profissional</span><input className="text-field" name="objective" minLength={2} maxLength={240} required placeholder="Ex.: vaga de consultoria em inteligência artificial" aria-invalid={Boolean(state.fieldErrors?.objective)} />{state.fieldErrors?.objective && <small className="field-error">{state.fieldErrors.objective}</small>}</label><label className="artifact-context-wide"><span className="field-label">Contexto da oportunidade <small>opcional</small></span><textarea className="text-field" name="context" maxLength={2000} rows={4} placeholder="Empresa, requisitos ou situação em que este material será usado." />{state.fieldErrors?.context && <small className="field-error">{state.fieldErrors.context}</small>}</label></div></fieldset>
      <fieldset className="artifact-supplementary"><legend><span>03</span> Confirme dados complementares</legend><p>Estes dados são declarações suas. O Persona não os trata como evidências profissionais.</p><div className="artifact-form-grid"><SupplementaryField name="contact" label="Contato" placeholder="Nome, e-mail e telefone" error={state.fieldErrors?.contact} /><SupplementaryField name="education" label="Formação" placeholder="Curso, instituição e período" error={state.fieldErrors?.education} /><SupplementaryField name="languages" label="Idiomas" placeholder="Idioma e nível confirmado" error={state.fieldErrors?.languages} /><SupplementaryField name="links" label="Links profissionais" placeholder="LinkedIn, GitHub ou site" error={state.fieldErrors?.links} /></div></fieldset>
      <fieldset className="artifact-evidence-picker"><legend><span>04</span> Autorize as evidências</legend><div className="artifact-selection-summary" aria-live="polite"><strong>{selected.size} selecionada{selected.size === 1 ? "" : "s"}</strong><span>Escolha de 1 a 12 evidências. Somente elas poderão sustentar o texto.</span></div>{evidences.length ? <ol>{evidences.map((evidence, index) => <li key={evidence.id} data-selected={selected.has(evidence.id)}><label><input type="checkbox" name="evidenceId" value={evidence.id} checked={selected.has(evidence.id)} disabled={!selected.has(evidence.id) && selected.size >= 12} onChange={(event) => setSelected((current) => { const next = new Set(current); if (event.target.checked) next.add(evidence.id); else next.delete(evidence.id); return next; })} /><span>{String(index + 1).padStart(2, "0")}</span><span><strong>{evidence.title}</strong><small>{evidence.context}</small></span><small>{evidence.competencies.slice(0, 3).join(" · ") || "Sem competência declarada"}</small></label></li>)}</ol> : <div className="empty-state"><strong>Nenhuma evidência disponível</strong><p>Confirme uma evidência antes de criar um material profissional.</p></div>}{state.fieldErrors?.evidenceId && <p className="field-error">{state.fieldErrors.evidenceId}</p>}</fieldset>
      {state.message && <p className="form-error" role="status">{state.message}</p>}
      <footer className="artifact-create-footer"><p>A primeira geração cria o artefato completo. Depois, a IA atua somente na seção escolhida.</p><button className="button-primary" type="submit" disabled={pending || selected.size < 1}>{pending ? "Criando rascunho…" : `Criar ${artifactTypeLabel[type]}`}</button></footer>
    </form>
  );
}

function SupplementaryField({ name, label, placeholder, error }: { name: string; label: string; placeholder: string; error?: string }) {
  return <label><span className="field-label">{label} <small>opcional</small></span><textarea className="text-field" name={name} maxLength={1200} rows={3} placeholder={placeholder} aria-invalid={Boolean(error)} />{error && <small className="field-error">{error}</small>}</label>;
}

export function ArtifactEditor({ artifactId, type, initialContent, initialRevision, supplementary, sourceMap, sourceTitles, reviewed }: {
  artifactId: string; type: ArtifactType; initialContent: ArtifactContent; initialRevision: number; supplementary: SupplementaryData;
  sourceMap: ArtifactSourceMap; sourceTitles: Record<string, string>; reviewed: boolean;
}) {
  const [content, setContent] = useState(initialContent);
  const [revision, setRevision] = useState(initialRevision);
  const [message, setMessage] = useState(reviewed ? "Revisado" : "Salvo");
  const [saving, startSaving] = useTransition();
  const savedRef = useRef(JSON.stringify(initialContent));
  const structured = type === "resume" || type === "portfolio";

  useEffect(() => {
    const serialized = JSON.stringify(content);
    if (serialized === savedRef.current || saving) return;
    const timer = window.setTimeout(() => {
      const payload = JSON.stringify(content);
      setMessage("Salvando…");
      startSaving(() => { void saveArtifactContent(artifactId, revision, content, supplementary).then((result) => {
        if (result.ok) { savedRef.current = payload; setRevision(result.revision); }
        setMessage(result.message);
      }); });
    }, 700);
    return () => window.clearTimeout(timer);
  }, [artifactId, content, revision, saving, supplementary]);

  function changeBody(key: string, body: string) { setContent((current) => ({ blocks: current.blocks.map((block) => block.key === key ? { ...block, body } : block) })); }
  function move(key: string, direction: "up" | "down") { setContent((current) => reorderBlocks(current, key, direction)); }

  return <div className="artifact-editor-shell">
    <div className="artifact-editor-status" aria-live="polite"><span data-error={message.includes("Não") || message.includes("mais recente")}>{saving ? "Salvando…" : message}</span><small>Edições posteriores devolvem um item revisado para Rascunho.</small></div>
    <div className="artifact-editor-grid"><div className="artifact-blocks">{content.blocks.map((block, index) => <section className="artifact-block" id={`block-${block.key}`} key={block.key}><header><div><span>{String(index + 1).padStart(2, "0")}</span><h2>{block.label}</h2></div>{structured && <div className="artifact-order-actions"><button type="button" onClick={() => move(block.key, "up")} disabled={index === 0 || saving} aria-label={`Mover ${block.label} para cima`}>↑</button><button type="button" onClick={() => move(block.key, "down")} disabled={index === content.blocks.length - 1 || saving} aria-label={`Mover ${block.label} para baixo`}>↓</button></div>}</header><label><span className="sr-only">Conteúdo de {block.label}</span><textarea value={block.body} onChange={(event) => changeBody(block.key, event.target.value)} rows={Math.max(5, Math.min(14, block.body.split("\n").length + 4))} maxLength={6000} /></label>{sourceMap[block.key]?.length ? <details className="artifact-inline-sources"><summary>{sourceMap[block.key].length} fonte{sourceMap[block.key].length === 1 ? "" : "s"} utilizada{sourceMap[block.key].length === 1 ? "" : "s"}</summary><ol>{sourceMap[block.key].map((source, sourceIndex) => <li key={`${source.evidence_id}-${source.source_field}-${sourceIndex}`}><strong>{sourceTitles[source.evidence_id] ?? "Evidência"}</strong><span>{source.source_field}</span><q>{source.source_excerpt}</q></li>)}</ol></details> : null}{(["star", "pitch_30", "pitch_60", "pitch_90", "summary", "experience", "skills", "profile", "cases"].includes(block.key)) && <div className="artifact-ai-actions" aria-label={`Ações de IA para ${block.label}`}>{(["shorter", "deeper", "adapted", "alternative"] as const).map((mode) => <form action={regenerateArtifact.bind(null, artifactId, block.key, mode)} key={mode}><button type="submit" disabled={saving}>{mode === "shorter" ? "Encurtar" : mode === "deeper" ? "Aprofundar" : mode === "adapted" ? "Adaptar ao objetivo" : "Gerar alternativa"}</button></form>)}</div>}</section>)}</div><aside className="artifact-editor-aside"><p className="eyebrow">Controle humano</p><h2>O texto continua sendo seu</h2><p>As fontes mostram de onde vieram os fatos. Revise linguagem, contexto e dados antes de usar.</p><form action={markArtifactReviewed.bind(null, artifactId)}><button className="button-primary" disabled={saving || reviewed} type="submit">{reviewed ? "Artefato revisado" : "Marcar como revisado"}</button></form>{type === "star" || type === "pitch" ? <CopyArtifactButton content={content} /> : <PrintArtifactButton />}</aside></div>
    {structured && <article className={`artifact-print-sheet artifact-print-${type}`} aria-label={`Pré-visualização de ${artifactTypeLabel[type]}`}><header><span>Persona · documento profissional</span><strong>{artifactTypeLabel[type]}</strong></header>{content.blocks.map((block) => <section key={block.key}><h2>{block.label}</h2><p>{block.body || "Seção sem conteúdo confirmado."}</p></section>)}</article>}
  </div>;
}

function CopyArtifactButton({ content }: { content: ArtifactContent }) {
  const [copied, setCopied] = useState(false);
  return <button className="button-secondary" type="button" onClick={async () => { await navigator.clipboard.writeText(content.blocks.map((block) => block.body).filter(Boolean).join("\n\n")); setCopied(true); window.setTimeout(() => setCopied(false), 1500); }}>{copied ? "Copiado" : "Copiar conteúdo"}</button>;
}

function PrintArtifactButton() { return <button className="button-secondary" type="button" onClick={() => window.print()}>Exportar PDF</button>; }
