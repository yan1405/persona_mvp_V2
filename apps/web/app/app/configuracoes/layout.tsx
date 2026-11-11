import { SettingsNavigation } from "./settings-navigation";

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="dx-home">
      <header className="dx-home__head">
        <div className="dx-home__greeting">
          <p className="dx-page__eyebrow">Controle da conta</p>
          <h1 className="dx-home__title">Configurações.</h1>
          <p className="dx-home__text">Atualize seu contexto profissional e controle os dados vinculados à sua conta.</p>
        </div>
      </header>

      <div className="dx-set">
        <SettingsNavigation />
        <div className="dx-set__content">{children}</div>
      </div>
    </main>
  );
}
