import { redirect } from "next/navigation";

// A rota antiga continua valendo: leva à seção da página única.
export default function SettingsAccountPage() {
  redirect("/app/configuracoes#cfg-conta");
}
