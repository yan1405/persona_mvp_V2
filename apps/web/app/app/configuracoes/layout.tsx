import { SettingsNavigation } from "./settings-navigation";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="app-page settings-page ds-surface">
      <header className="settings-heading">
        <p className="eyebrow">Controle da conta</p>
        <h1>Configurações</h1>
        <p>
          Atualize seu contexto profissional e controle os dados vinculados à sua conta.
        </p>
      </header>

      <div className="settings-layout">
        <SettingsNavigation />
        <div className="settings-content">{children}</div>
      </div>
    </main>
  );
}
