import { Badge, Button, ButtonLink, Card, DimensionRow, FocalCard, Icon, ScoreRing } from "@/components/ds";
import { getNarrativeScoreData } from "@/lib/score/data";
import { createClient } from "@/lib/supabase/server";

import { updateCoherence } from "./actions";
import { ScorePanel } from "./score-panel";

const date = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", timeZone: "America/Sao_Paulo" });
const reason = { diagnostic_completed: "Diagnóstico concluído", consistency_observed: "Consistência recalculada", coherence_updated: "Coerência atualizada", method_changed: "Método atualizado" } as Record<string, string>;
const originLabel = { declared: "Base declarada", partially_observed: "Parcialmente observado", observed: "Observado" } as const;

export default async function ScorePage({ searchParams }: { searchParams: Promise<{ abrir?: string; notice?: string }> }) {
  const { abrir, notice } = await searchParams;
  const supabase = await createClient();
  const score = await getNarrativeScoreData(supabase);
  const current = score.current;
  const providerError = ["not_configured", "timeout", "rate_limit", "invalid_output", "provider_error"].includes(notice ?? "");
  const total = current ? Math.round(current.total_score) : 0;
  const declared = score.diagnostic?.initial_score != null ? Math.round(score.diagnostic.initial_score) : null;

  return (
    <main className="dx-home">
      <header className="dx-home__head">
        <div className="dx-home__greeting">
          <p className="dx-page__eyebrow">Narrative Score</p>
          <h1 className="dx-home__title">Cálculo rastreável, sem nota mágica.</h1>
          <p className="dx-home__text">Cada mudança guarda a origem, o período e os dados que a sustentam.</p>
        </div>
        <ButtonLink variant="ghost" size="sm" iconRight="arrow-right" href="/app/score?abrir=calculo">
          Entender o cálculo
        </ButtonLink>
      </header>

      {notice === "updated" && (
        <p className="dx-page__notice dx-page__notice--ok" role="status">
          <Icon name="circle-check" size={16} />
          Análise atualizada e novo snapshot registrado.
        </p>
      )}
      {notice === "not-eligible" && (
        <p className="dx-page__notice dx-page__notice--error" role="alert">
          <Icon name="triangle-alert" size={16} />
          Ainda são necessárias 5 evidências, 2 contextos e 3 competências.
        </p>
      )}
      {providerError && (
        <p className="dx-page__notice dx-page__notice--error" role="alert">
          <Icon name="triangle-alert" size={16} />
          A análise não foi atualizada. O último Score válido foi preservado; tente novamente mais tarde.
        </p>
      )}

      {!current ? (
        <Card padding={24} className="dx-home__block">
          <section className="dx-home__section" aria-labelledby="no-data-title">
            <h2 className="dx-home__h2" id="no-data-title">
              Comece por uma referência inicial.
            </h2>
            <p className="dx-home__text">O diagnóstico leva cerca de três minutos e separa claramente respostas declaradas de dados observados.</p>
            <div>
              <ButtonLink variant="brand" iconRight="arrow-right" href="/app/diagnostico">
                Responder diagnóstico
              </ButtonLink>
            </div>
          </section>
        </Card>
      ) : (
        <>
          <FocalCard aria-labelledby="focal-title">
            <div className="dx-score__focal">
              <ScoreRing value={total} size={112} stroke={11} onFocal sublabel="de 100" />
              <div className="dx-score__focal-copy">
                <h2 className="dx-score__focal-title" id="focal-title">
                  Score declarado × observado.
                </h2>
                <p className="dx-score__focal-text">
                  {originLabel[current.total_state]}. {current.total_state === "declared" ? "Ainda é a base declarada; ela passa a observada com evidências e registros reais." : "Parte do total já vem de dados observados."}
                </p>
                <dl className="dx-score__pair">
                  <div>
                    <dt>Declarado</dt>
                    <dd>{declared != null ? declared : "—"}</dd>
                  </div>
                  <div>
                    <dt>Atual</dt>
                    <dd>{total}</dd>
                  </div>
                </dl>
                <p className="dx-score__focal-meta">Atualizado em {date.format(new Date(current.created_at))}.</p>
              </div>
            </div>
          </FocalCard>

          <section className="dx-home__section" aria-labelledby="dims-title">
            <h2 className="dx-home__h2" id="dims-title">
              Dimensões.
            </h2>
            <div className="dx-score__dims">
              <DimensionRow label="Coerência" value={Math.round(current.coherence_score)} weight="60%" origin={current.coherence_origin === "ai_assisted" ? "observada" : "declarada"} progress={`${score.coherenceEligibility.evidenceCount}/5 evidências · ${score.coherenceEligibility.contextCount}/2 contextos · ${score.coherenceEligibility.competencyCount}/3 competências`} />
              <DimensionRow label="Consistência" value={Math.round(current.consistency_score)} weight="40%" origin={current.consistency_origin === "observed" ? "observada" : "declarada"} progress={`${score.consistency?.activeLogCount ?? 0}/6 registros · ${score.consistency?.activeWeeks ?? 0}/3 semanas mínimas`} />
              <DimensionRow label="Credibilidade" notEvaluated note="Ainda não avaliada: fica fora da nota nesta fase." />
            </div>
          </section>

          <Card padding={24} className="dx-home__block">
            <section className="dx-home__section" aria-labelledby="update-title">
              <h2 className="dx-home__h2" id="update-title">
                Atualizar a coerência.
              </h2>
              <p className="dx-home__text">{score.coherenceEligibility.eligible ? "A análise usa de 5 a 12 evidências e só é executada quando você solicita." : "O botão será liberado quando os três requisitos de evidência forem atingidos."}</p>
              <form action={updateCoherence}>
                <Button variant="brand" type="submit" icon="refresh-cw" disabled={!score.coherenceEligibility.eligible}>
                  Atualizar análise
                </Button>
              </form>
            </section>
          </Card>
        </>
      )}

      {abrir === "calculo" ? (
        <ScorePanel>
          <div className="dx-dp">
            <section className="dx-dp__section" aria-labelledby="method-title">
              <h3 className="dx-dp__h" id="method-title">
                O que entra na conta.
              </h3>
              <dl className="dx-dp__facts">
                <div><dt>Score total</dt><dd>60% coerência + 40% consistência. Credibilidade permanece fora da nota nesta fase.</dd></div>
                <div><dt>Base declarada</dt><dd>Coerência usa as respostas 1–6; consistência usa as respostas 7–8 do diagnóstico.</dd></div>
                <div><dt>Consistência observada</dt><dd>Após 21 dias, 6 registros e 3 semanas ativas: 70% continuidade + 30% frequência, em janela de até 4 semanas.</dd></div>
                <div><dt>Coerência assistida</dt><dd>Com 5 evidências, 2 contextos e 3 competências: alinhamento 35%, conexão 25%, especificidade 25% e recorrência 15%.</dd></div>
                <div><dt>Credibilidade</dt><dd>Ainda não avaliada. Links de fonte já podem ser guardados, mas ainda não formam uma nota.</dd></div>
              </dl>
            </section>
            <section className="dx-dp__section" aria-labelledby="history-title">
              <div className="dx-dp__head">
                <h3 className="dx-dp__h" id="history-title">
                  Histórico de snapshots.
                </h3>
                <span className="dx-dp__count">{score.snapshots.length} eventos</span>
              </div>
              {score.snapshots.length ? (
                <ol className="dx-dp__versions">
                  {score.snapshots.map((snapshot) => (
                    <li key={snapshot.id} className="dx-dp__proof">
                      <span className="dx-dp__version-title">{reason[snapshot.reason] ?? snapshot.reason}</span>
                      <span className="dx-dp__version-meta">
                        <time dateTime={snapshot.created_at}>{date.format(new Date(snapshot.created_at))}</time>
                        <Badge tone="neutral">{Math.round(snapshot.total_score)}/100</Badge>
                        <Badge tone="neutral">{originLabel[snapshot.total_state]}</Badge>
                      </span>
                    </li>
                  ))}
                </ol>
              ) : (
                <div className="dx-empty">
                  <p className="dx-empty__title">Nenhum snapshot ainda.</p>
                  <p className="dx-dp__text">O primeiro aparece depois do diagnóstico.</p>
                </div>
              )}
            </section>
          </div>
        </ScorePanel>
      ) : null}
    </main>
  );
}
