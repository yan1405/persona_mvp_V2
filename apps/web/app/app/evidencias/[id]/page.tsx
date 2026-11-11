import { redirect } from "next/navigation";

// Link direto: o detalhe é o painel flutuante da Biblioteca; esta rota só leva até ele, preservando o aviso.
export default async function EvidenceDetailRoute({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ notice?: string }> }) {
  const [{ id }, query] = await Promise.all([params, searchParams]);
  const next = new URLSearchParams({ abrir: id });
  if (query.notice) next.set("notice", query.notice);
  redirect(`/app/evidencias?${next.toString()}`);
}
