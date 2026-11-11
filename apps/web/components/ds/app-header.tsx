import { IconButton } from "./icon-button";
import { Input } from "./input";

export type AppHeaderProps = {
  title?: string;
  /** Só aparece em telas estreitas (o shell abre a gaveta de navegação). */
  onMenu?: () => void;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  onSearch?: (value: string) => void;
  /** Envio nativo (GET) quando não há JavaScript: destino e nome do campo. */
  searchAction?: string;
  searchName?: string;
};

// "Buscar ou perguntar" é o único campo do cabeçalho. Não há botão do Agente: o Agente Persona não existe neste produto.
export function AppHeader({ title, onMenu, searchValue, onSearchChange, onSearch, searchAction, searchName = "q" }: AppHeaderProps) {
  return (
    <div className="dx-header-wrap">
      <header className="dx-header">
        {onMenu ? (
          <span className="dx-header__menu">
            <IconButton icon="panel-left" variant="outline" size={40} label="Abrir menu" aria-haspopup="dialog" data-nav-trigger="" onClick={onMenu} />
          </span>
        ) : null}
        {title ? <h1 className="dx-header__title">{title}</h1> : null}
        <form
          className="dx-header__search"
          role="search"
          action={searchAction}
          method={searchAction ? "get" : undefined}
          onSubmit={
            onSearch
              ? (e) => {
                  e.preventDefault();
                  onSearch(searchValue ?? String(new FormData(e.currentTarget).get(searchName) ?? ""));
                }
              : undefined
          }
        >
          <Input
            variant="search"
            name={searchName}
            type="search"
            placeholder="Buscar ou perguntar"
            aria-label="Buscar ou perguntar"
            autoComplete="off"
            value={searchValue}
            onChange={onSearchChange ? (e) => onSearchChange(e.target.value) : undefined}
          />
        </form>
      </header>
    </div>
  );
}
