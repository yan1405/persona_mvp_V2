import { redirect } from "next/navigation";

// A rota antiga continua valendo (a reautenticação volta para cá): leva à seção da página única e mantém o aviso.
export default async function SettingsDataPage({ searchParams }: { searchParams: Promise<{ notice?: string }> }) {
  const { notice } = await searchParams;
  redirect(`/app/configuracoes${notice ? `?notice=${encodeURIComponent(notice)}` : ""}#cfg-dados`);
}
