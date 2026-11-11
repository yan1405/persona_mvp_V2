"use client";

import { useActionState, useState } from "react";

import { Badge, Button, ButtonLink, Card, Icon, Input } from "@/components/ds";
import { deleteAccount, type SettingsActionState } from "@/lib/settings/actions";

const initialState: SettingsActionState = { status: "idle" };

export function SettingsDataForm({ reauthenticated }: { reauthenticated: boolean }) {
  const [state, formAction, pending] = useActionState(deleteAccount, initialState);
  const [confirmText, setConfirmText] = useState("");
  const [exportStatus, setExportStatus] = useState<"idle" | "loading" | "error">("idle");

  async function exportData() {
    setExportStatus("loading");
    try {
      const response = await fetch("/api/export");
      if (!response.ok) throw new Error("export failed");
      const blobUrl = URL.createObjectURL(await response.blob());
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `persona-export-${new Date().toISOString().slice(0, 10)}.json`;
      link.click();
      URL.revokeObjectURL(blobUrl);
      setExportStatus("idle");
    } catch {
      setExportStatus("error");
    }
  }

  return (
    <>
      <Card padding={24} className="dx-home__block">
        <section className="dx-home__section" aria-labelledby="export-title">
          <h2 className="dx-home__h2" id="export-title">
            Exportar dados.
          </h2>
          <p className="dx-home__text">Baixe um JSON com perfil, Diário, evidências, Narrative Score, Persona Live e Artefatos, incluindo fontes e versões.</p>
          <div>
            <Button variant="outline" icon="download" disabled={exportStatus === "loading"} onClick={exportData}>
              {exportStatus === "loading" ? "Preparando arquivo…" : "Exportar meus dados"}
            </Button>
          </div>
          {exportStatus === "error" && (
            <p className="dx-page__notice dx-page__notice--error" role="alert">
              <Icon name="triangle-alert" size={16} />
              Não foi possível preparar a exportação. Tente novamente.
            </p>
          )}
        </section>
      </Card>

      <Card padding={24} className="dx-home__block">
        <section className="dx-home__section" aria-labelledby="delete-title">
          <div className="dx-home__section-head">
            <h2 className="dx-home__h2" id="delete-title">
              Excluir conta.
            </h2>
            <Badge tone="danger" icon="triangle-alert">
              Irreversível
            </Badge>
          </div>
          <p className="dx-home__text">A exclusão é irreversível. Perfil, Diário, evidências, Score, sessões Live e Artefatos serão apagados e não poderão ser recuperados.</p>

          {!reauthenticated ? (
            <div>
              <ButtonLink variant="outline" icon="lock" href="/auth/iniciar?reauth=delete_account&next=/app/configuracoes/dados" native>
                Confirmar identidade com Microsoft
              </ButtonLink>
            </div>
          ) : (
            <form action={formAction} className="dx-form">
              <p className="dx-page__notice dx-page__notice--ok" role="status">
                <Icon name="circle-check" size={16} />
                Identidade confirmada. Esta autorização expira em cinco minutos.
              </p>
              <Input label="Digite EXCLUIR para confirmar" name="confirmation" type="text" placeholder="EXCLUIR" value={confirmText} onChange={(e) => setConfirmText(e.target.value)} required autoComplete="off" />
              {state.status === "error" && (
                <p className="dx-page__notice dx-page__notice--error" role="alert">
                  <Icon name="triangle-alert" size={16} />
                  {state.message}
                </p>
              )}
              <div className="dx-form__actions">
                <ButtonLink variant="ghost" href="/app/configuracoes/dados">
                  Cancelar
                </ButtonLink>
                <Button variant="solid" type="submit" icon="trash-2" disabled={pending || confirmText !== "EXCLUIR"}>
                  {pending ? "Excluindo conta…" : "Excluir conta permanentemente"}
                </Button>
              </div>
            </form>
          )}
        </section>
      </Card>
    </>
  );
}
