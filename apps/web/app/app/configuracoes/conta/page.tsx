import { redirect } from "next/navigation";
import { signOut } from "@/lib/settings/actions";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Conta e Acesso | Persona",
};

export default async function SettingsAccountPage() {
  const supabase = await createClient();
  const { data: authData } = await supabase.auth.getClaims();
  
  if (!authData?.claims) {
    redirect("/entrar");
  }

  const email =
    typeof authData.claims.email === "string"
      ? authData.claims.email
      : "Conta Microsoft conectada";

  return (
    <section className="settings-section">
      <header>
        <h2>Conta e acesso</h2>
        <p>
          Gerencie sua sessão ativa e o provedor de identidade conectado.
        </p>
      </header>
      
      <div className="account-row">
        <div>
          <span className="settings-section-index">01</span>
          <h3>Conta Microsoft</h3>
        </div>
        <div className="account-provider">
          <div>
            <p>Microsoft Entra ID</p>
            <p>{email}</p>
          </div>
          <span className="account-status">
            Conectado
          </span>
        </div>
      </div>

      <div className="account-row">
        <div>
          <span className="settings-section-index">02</span>
          <h3>Sessão atual</h3>
        </div>
        <div>
          <p>
          Encerre sua sessão atual para proteger sua conta ao sair.
          </p>
          <form action={signOut}>
            <button type="submit" className="button-secondary">
              Encerrar sessão
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
