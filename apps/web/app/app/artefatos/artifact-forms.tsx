"use client";

import { useActionState, useEffect, useRef, useState, useTransition } from "react";

import { ARTIFACT_TYPES, Button, Card, EvidenceCard, Icon, IconButton, Input, Textarea, TraceLine, type ArtifactType as DsArtifactType, type EvidenceLevel, type TraceStep } from "@/components/ds";
import { artifactTypeLabel, reorderBlocks, type ArtifactContent, type ArtifactSourceMap, type ArtifactType, type SupplementaryData } from "@/lib/artifacts/artifact";

import { createArtifact, markArtifactReviewed, regenerateArtifact, saveArtifactContent, type ArtifactActionState } from "./actions";

const initialState: ArtifactActionState = { status: "idle" };
const dsType = (type: ArtifactType): DsArtifactType => (type === "resume" ? "curriculo" : type);

export type ArtifactEvidenceOption = { id: string; title: string; context: string; competencies: string[]; level: EvidenceLevel; proofCount: number };

const typeHint: Record<ArtifactType, string> = {
  star: "Entrevistas e perguntas comportamentais.",
  pitch: "Versões de 30, 60 e 90 segundos.",
  resume: "Modelo oficial legível por ATS.",
  portfolio: "Documento editorial organizado por casos.",
};

export function NewArtifactForm({ evidences }: { evidences: ArtifactEvidenceOption[] }) {
  const [state, action, pending] = useActionState(createArtifact, initialState);
  const [type, setType] = useState<ArtifactType>("star");
  const [selected, setSelected] = useState<Set<string>>(new Set(evidences.slice(0, Math.min(3, evidences.length)).map((item) => item.id)));
  const errors = state.fieldErrors;
  return (
    <form action={action} className="dx-ws__screen dx-home__section">
      <Card padding={24} className="dx-home__block">
        <fieldset className="dx-pick">
          <legend className="dx-home__h2">01 · Escolha o material.</legend>
          {(["star", "pitch", "resume", "portfolio"] as ArtifactType[]).map((item) => (
            <label key={item} className="dx-pick__opt">
              <input type="radio" name="type" value={item} checked={type === item} onChange={() => setType(item)} />
              <span className="dx-pick__name">
                <Icon name={ARTIFACT_TYPES[dsType(item)].icon} size={18} />
                {artifactTypeLabel[item]}
              </span>
              <span className="dx-pick__text">{typeHint[item]}</span>
            </label>
          ))}
        </fieldset>
        {errors?.type && (
          <p className="dx-page__notice dx-page__notice--error" role="alert">
            <Icon name="triangle-alert" size={16} />
            {errors.type}
          </p>
        )}
      </Card>

      <Card padding={24} className="dx-home__block">
        <section className="dx-home__section" aria-labelledby="ctx-title">
          <h2 className="dx-home__h2" id="ctx-title">
            02 · Defina o objetivo.
          </h2>
          <div className="dx-form">
            <div className="dx-form__row">
              <Input label="Título do artefato" name="title" minLength={2} maxLength={120} required placeholder={`Ex.: ${artifactTypeLabel[type]} para processo seletivo`} error={errors?.title} />
              <Input label="Objetivo profissional" name="objective" minLength={2} maxLength={240} required placeholder="Ex.: vaga de consultoria em inteligência artificial" error={errors?.objective} />
            </div>
            <Textarea label="Contexto da oportunidade (opcional)" name="context" maxLength={2000} rows={4} placeholder="Empresa, requisitos ou situação em que este material será usado." error={errors?.context} />
          </div>
        </section>
      </Card>

      <Card padding={24} className="dx-home__block">
        <section className="dx-home__section" aria-labelledby="sup-title">
          <h2 className="dx-home__h2" id="sup-title">
            03 · Confirme dados complementares.
          </h2>
          <p className="dx-home__text">Estes dados são declarações suas. O Persona não os trata como evidências profissionais.</p>
          <div className="dx-form">
            <div className="dx-form__row">
              <Textarea label="Contato (opcional)" name="contact" maxLength={1200} rows={3} placeholder="Nome, e-mail e telefone" error={errors?.contact} />
              <Textarea label="Formação (opcional)" name="education" maxLength={1200} rows={3} placeholder="Curso, instituição e período" error={errors?.education} />
            </div>
            <div className="dx-form__row">
              <Textarea label="Idiomas (opcional)" name="languages" maxLength={1200} rows={3} placeholder="Idioma e nível confirmado" error={errors?.languages} />
              <Textarea label="Links profissionais (opcional)" name="links" maxLength={1200} rows={3} placeholder="LinkedIn, GitHub ou site" error={errors?.links} />
            </div>
          </div>
        </section>
      </Card>

      <section className="dx-home__section" aria-labelledby="ev-title">
        <div className="dx-home__section-head">
          <h2 className="dx-home__h2" id="ev-title">
            04 · Autorize as evidências.
          </h2>
          <span className="dx-home__row-meta" aria-live="polite">
            {selected.size} selecionada{selected.size === 1 ? "" : "s"} de 12
          </span>
        </div>
        <p className="dx-home__text">Escolha de 1 a 12 evidências. Somente elas poderão sustentar o texto.</p>
        {evidences.length ? (
          <ul className="dx-grid">
            {evidences.map((evidence) => {
              const on = selected.has(evidence.id);
              return (
                <li key={evidence.id}>
                  {on && <input type="hidden" name="evidenceId" value={evidence.id} />}
                  <EvidenceCard
                    variant="selectable"
                    title={evidence.title}
                    competencies={evidence.competencies.slice(0, 3)}
                    level={evidence.level}
                    proofCount={evidence.proofCount}
                    reason={evidence.context}
                    selected={on}
                    disabled={!on && selected.size >= 12}
                    onSelectedChange={(value) =>
                      setSelected((current) => {
                        const next = new Set(current);
                        if (value) next.add(evidence.id);
                        else next.delete(evidence.id);
                        return next;
                      })
                    }
                  />
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="dx-empty">
            <p className="dx-empty__title">Nenhuma evidência disponível.</p>
            <p className="dx-home__text">Confirme uma evidência antes de criar um material profissional.</p>
          </div>
        )}
        {errors?.evidenceId && (
          <p className="dx-page__notice dx-page__notice--error" role="alert">
            <Icon name="triangle-alert" size={16} />
            {errors.evidenceId}
          </p>
        )}
      </section>

      {state.message && (
        <p className="dx-page__notice dx-page__notice--error" role="status">
          <Icon name="triangle-alert" size={16} />
          {state.message}
        </p>
      )}
      <div className="dx-form__actions">
        <span className="dx-form__hint">A primeira geração cria o artefato completo. Depois, a IA atua somente na seção escolhida e você confirma o que fica.</span>
        <Button variant="brand" type="submit" icon="sparkles" disabled={pending || selected.size < 1}>
          {pending ? "Criando rascunho…" : `Criar ${artifactTypeLabel[type]}`}
        </Button>
      </div>
    </form>
  );
}

const aiKeys = ["star", "pitch_30", "pitch_60", "pitch_90", "summary", "experience", "skills", "profile", "cases"];
const modes = [
  { mode: "shorter", label: "Encurtar", icon: "minus" },
  { mode: "deeper", label: "Aprofundar", icon: "plus" },
  { mode: "adapted", label: "Adaptar ao objetivo", icon: "target" },
  { mode: "alternative", label: "Gerar alternativa", icon: "refresh-cw" },
] as const;

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

  const failed = message.includes("Não") || message.includes("mais recente");
  return (
    <div className="dx-ws">
      <div className="dx-ws__main dx-ws__screen">
        <div className={`dx-ws__status${failed ? " dx-ws__status--error" : ""}`} aria-live="polite">
          <Icon name={failed ? "triangle-alert" : "circle-check"} size={16} />
          <span>{saving ? "Salvando…" : message}.</span>
          <span>Edições posteriores devolvem um item revisado para Rascunho.</span>
        </div>
        {content.blocks.map((block, index) => {
          const used = sourceMap[block.key] ?? [];
          const steps: TraceStep[] = used.length
            ? [...used.map((source): TraceStep => ({ kind: "evidencia", label: sourceTitles[source.evidence_id] ?? "Evidência", meta: source.source_field })), { kind: "uso", label: block.label }]
            : [{ kind: "evidencia", label: "Sem fonte registrada", meta: "lacuna", state: "gap" }, { kind: "uso", label: block.label }];
          return (
            <Card padding={24} className="dx-home__block" key={block.key}>
              <section className="dx-home__section" id={`block-${block.key}`} aria-labelledby={`title-${block.key}`}>
                <div className="dx-ws__head">
                  <div className="dx-ws__title">
                    <span className="dx-ws__num">{String(index + 1).padStart(2, "0")}</span>
                    <h2 className="dx-home__h2" id={`title-${block.key}`}>{block.label}.</h2>
                  </div>
                  {structured && (
                    <div className="dx-ws__order">
                      <IconButton icon="arrow-up" label={`Mover ${block.label} para cima`} size={32} onClick={() => move(block.key, "up")} disabled={index === 0 || saving} />
                      <IconButton icon="arrow-up" label={`Mover ${block.label} para baixo`} size={32} className="dx-ws__down" onClick={() => move(block.key, "down")} disabled={index === content.blocks.length - 1 || saving} />
                    </div>
                  )}
                </div>
                <Textarea aria-label={`Conteúdo de ${block.label}`} value={block.body} onChange={(event) => changeBody(block.key, event.target.value)} rows={Math.max(5, Math.min(14, block.body.split("\n").length + 4))} maxLength={6000} />
                <TraceLine steps={steps} orientation="vertical" title="De onde vem este trecho" />
                {used.length ? (
                  <details>
                    <summary>{used.length} fonte{used.length === 1 ? "" : "s"} utilizada{used.length === 1 ? "" : "s"}</summary>
                    <ol className="dx-ws__src">
                      {used.map((source, sourceIndex) => (
                        <li key={`${source.evidence_id}-${source.source_field}-${sourceIndex}`}>
                          <strong>{sourceTitles[source.evidence_id] ?? "Evidência"}</strong>
                          <span>{source.source_field}</span>
                          <q>{source.source_excerpt}</q>
                        </li>
                      ))}
                    </ol>
                  </details>
                ) : null}
                {aiKeys.includes(block.key) && (
                  <div className="dx-ws__ai" role="group" aria-label={`Ações de IA para ${block.label}`}>
                    {modes.map((item) => (
                      <form action={regenerateArtifact.bind(null, artifactId, block.key, item.mode)} key={item.mode}>
                        <Button variant="outline" size="sm" type="submit" icon={item.icon} disabled={saving}>
                          {item.label}
                        </Button>
                      </form>
                    ))}
                  </div>
                )}
              </section>
            </Card>
          );
        })}
      </div>

      <aside className="dx-ws__side dx-ws__screen">
        <Card padding={24} className="dx-home__block">
          <section className="dx-home__section" aria-labelledby="control-title">
            <p className="dx-page__eyebrow">Controle humano</p>
            <h2 className="dx-home__h2" id="control-title">O texto continua sendo seu.</h2>
            <p className="dx-home__text">As fontes mostram de onde vieram os fatos. A IA sugere; você revisa linguagem, contexto e dados antes de usar.</p>
            <form action={markArtifactReviewed.bind(null, artifactId)}>
              <Button variant="brand" type="submit" icon="check" disabled={saving || reviewed}>
                {reviewed ? "Artefato revisado" : "Marcar como revisado"}
              </Button>
            </form>
            {type === "star" || type === "pitch" ? <CopyArtifactButton content={content} /> : <PrintArtifactButton />}
          </section>
        </Card>
      </aside>

      {structured && (
        <article className="dx-ws__sheet" aria-label={`Pré-visualização de ${artifactTypeLabel[type]}`}>
          <header><strong>{artifactTypeLabel[type]}</strong></header>
          {content.blocks.map((block) => (
            <section key={block.key}>
              <h2>{block.label}</h2>
              <p>{block.body || "Seção sem conteúdo confirmado."}</p>
            </section>
          ))}
        </article>
      )}
    </div>
  );
}

function CopyArtifactButton({ content }: { content: ArtifactContent }) {
  const [copied, setCopied] = useState(false);
  return (
    <Button variant="outline" type="button" icon={copied ? "check" : "copy"} onClick={async () => { await navigator.clipboard.writeText(content.blocks.map((block) => block.body).filter(Boolean).join("\n\n")); setCopied(true); window.setTimeout(() => setCopied(false), 1500); }}>
      {copied ? "Copiado" : "Copiar conteúdo"}
    </Button>
  );
}

function PrintArtifactButton() {
  return (
    <Button variant="outline" type="button" icon="download" onClick={() => window.print()}>
      Exportar PDF
    </Button>
  );
}
