import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { AppShell } from "@/components/ds";

import { isDsGalleryEnabled } from "../gate";

export const metadata: Metadata = {
  title: "Prévia das telas legadas no shell",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

const hrefs = { inicio: "/app/inicio", diario: "/app/diario", evidencias: "/app/evidencias", live: "/app/live", artefatos: "/app/artefatos", configuracoes: "/app/configuracoes" } as const;

// Prévia local (as telas reais exigem sessão e banco): o AppShell real com conteúdo fictício que usa as classes reais
// das três telas internas sem .ds-surface (diario/[id], evidencias/[id], artefatos/novo). 404 em produção.
export default async function LegacyPreviewPage({ searchParams }: { searchParams: Promise<{ tela?: string }> }) {
  if (!isDsGalleryEnabled(process.env)) notFound();
  const tela = (await searchParams).tela ?? "diario";
  const cls = tela === "evidencia" ? "app-page evidence-detail-page" : tela === "artefato" ? "app-page artifact-new-page" : "app-page diary-detail-page";
  return (
    <AppShell hrefs={hrefs} registerHref="/app/diario" searchAction="/app/evidencias" contentAs="div">
      <main className={cls}>
        <p className="eyebrow">Registro</p>
        <h1>Reunião de alinhamento do trimestre</h1>
        <p>Conduzi a conversa com a equipe e ajustei o plano ao grupo. Este texto herda a cor do painel.</p>
        <label className="field-label" htmlFor="campo-legado">
          Contexto
        </label>
        <input className="text-field" id="campo-legado" defaultValue="Campo de formulário" />
        <p>
          <Link href="/app/diario">Voltar ao Diário</Link>
        </p>
      </main>
    </AppShell>
  );
}
