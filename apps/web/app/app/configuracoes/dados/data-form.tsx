"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
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
    <div className="settings-data-sections">
      <section>
        <span className="settings-section-index">01</span>
        <h3>Exportar dados</h3>
        <p>
          Baixe um JSON com perfil, Diário, evidências, Narrative Score, Persona Live e Artefatos, incluindo fontes e versões.
        </p>
        <button
          className="button-secondary"
          disabled={exportStatus === "loading"}
          onClick={exportData}
          type="button"
        >
          {exportStatus === "loading" ? "Preparando arquivo..." : "Exportar meus dados"}
        </button>
        {exportStatus === "error" && (
          <p className="field-error" role="alert">
            Não foi possível preparar a exportação. Tente novamente.
          </p>
        )}
      </section>

      <section className="settings-danger-zone">
        <span className="settings-section-index">02</span>
        <h3>Excluir conta</h3>
        <p>
          A exclusão é irreversível. Perfil, Diário, evidências, Score, sessões Live e Artefatos serão apagados e não poderão ser recuperados.
        </p>

        {!reauthenticated ? (
          <Link
            className="button-danger"
            href="/auth/iniciar?reauth=delete_account&next=/app/configuracoes/dados"
          >
            Confirmar identidade com Microsoft
          </Link>
        ) : (
          <form action={formAction} className="delete-confirmation">
            <p className="settings-success" role="status">
              Identidade confirmada. Esta autorização expira em cinco minutos.
            </p>
            <div>
              <label className="field-label" htmlFor="confirmation">
                Digite EXCLUIR para confirmar
              </label>
              <input
                className="text-field"
                id="confirmation"
                name="confirmation"
                type="text"
                placeholder="EXCLUIR"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                required
                autoComplete="off"
              />
            </div>

            {state.status === "error" && (
              <p className="field-error" role="alert">
                {state.message}
              </p>
            )}

            <div>
              <button
                type="submit"
                className="button-danger"
                disabled={pending || confirmText !== "EXCLUIR"}
              >
                {pending ? "Excluindo conta..." : "Excluir conta permanentemente"}
              </button>
              <Link
                className="button-secondary"
                href="/app/configuracoes/dados"
                aria-disabled={pending}
              >
                Cancelar
              </Link>
            </div>
          </form>
        )}
      </section>
    </div>
  );
}
