export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="dx-home">
      <header className="dx-home__head">
        <div className="dx-home__greeting">
          <p className="dx-page__eyebrow">Controle da conta</p>
          <h1 className="dx-home__title">Configurações.</h1>
          <p className="dx-home__text">Aqui você ajusta o que é seu. Salvar, exportar, excluir e sair só acontecem quando você pede.</p>
        </div>
      </header>
      {children}
    </main>
  );
}
