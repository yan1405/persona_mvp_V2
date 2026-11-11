import { redirect } from "next/navigation";

// Link direto: o detalhe é o painel flutuante da lista; esta rota só leva até ele, preservando o aviso e a sugestão escolhida.
export default async function DiaryDetailRoute({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ suggestion?: string; notice?: string }> }) {
  const [{ id }, query] = await Promise.all([params, searchParams]);
  const next = new URLSearchParams({ abrir: id });
  if (query.suggestion) next.set("suggestion", query.suggestion);
  if (query.notice) next.set("notice", query.notice);
  redirect(`/app/diario?${next.toString()}`);
}
