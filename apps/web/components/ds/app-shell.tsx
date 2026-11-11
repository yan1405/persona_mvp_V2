"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";

import { AppHeader, type AppHeaderProps } from "./app-header";
import { NAV_DESTINATIONS, NAV_SETTINGS, Sidebar, type NavId, type SidebarProps } from "./sidebar";

export type AppShellProps = Pick<SidebarProps, "active" | "hrefs" | "onNavigate" | "onRegister" | "registerHref" | "resume" | "onResume" | "badges"> &
  Pick<AppHeaderProps, "title" | "searchValue" | "onSearchChange" | "onSearch" | "searchAction" | "searchName"> & {
    children: ReactNode;
    /** Força trilho (`true`) ou barra expandida (`false`); sem valor, segue a largura do shell. */
    sidebarCollapsed?: boolean;
    /** Altura do shell (número). Sem valor ocupa a altura da janela. */
    height?: number;
    /** Elemento do conteúdo. `div` quando a página já traz o próprio <main> (telas ainda não migradas); o padrão é <main>. */
    contentAs?: "main" | "div";
  };

// Destino ativo pela rota: o item cuja rota é igual à atual ou prefixo dela. Sem `active` explícito e com `hrefs`.
function activeFromPath(pathname: string | null, hrefs: SidebarProps["hrefs"]): NavId | undefined {
  if (!pathname || !hrefs) return undefined;
  return [...NAV_DESTINATIONS, NAV_SETTINGS].find((d) => {
    const href = hrefs[d.id];
    return href ? pathname === href || pathname.startsWith(href + "/") : false;
  })?.id;
}

// Barra lateral branca flutuante (raio 22) + painel (raio 28) sobre --ds-bg-app. A largura vem do próprio shell
// (container query), então funciona dentro de qualquer contêiner. Abaixo de 40 rem a navegação vira uma gaveta <dialog>.
export function AppShell({ children, sidebarCollapsed, height, contentAs = "main", title, searchValue, onSearchChange, onSearch, searchAction, searchName, onNavigate, ...sidebarProps }: AppShellProps) {
  const pathname = usePathname();
  const sidebar = { ...sidebarProps, active: sidebarProps.active ?? activeFromPath(pathname, sidebarProps.hrefs) };
  const Content = contentAs;
  const rootRef = useRef<HTMLDivElement>(null);
  const drawerRef = useRef<HTMLDialogElement>(null);
  const [size, setSize] = useState<{ narrow: boolean; phone: boolean } | null>(null);
  const [manual, setManual] = useState<boolean | null>(null);
  const [navOpen, setNavOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const rem = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
    const measure = () => setSize({ narrow: el.clientWidth < 68.75 * rem, phone: el.clientWidth < 40 * rem });
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const phone = size?.phone ?? false;
  const drawerOpen = navOpen && phone;

  useEffect(() => {
    const d = drawerRef.current;
    if (!d) return;
    if (drawerOpen && !d.open) d.showModal();
    if (!drawerOpen && d.open) d.close();
  }, [drawerOpen]);

  const collapsed = sidebarCollapsed ?? manual ?? (size ? size.narrow : undefined);
  const closeDrawer = () => setNavOpen(false);

  return (
    <div ref={rootRef} className="dx-shell" style={height != null ? { height } : undefined}>
      <a className="dx-skip" href="#conteudo">
        Ir para o conteúdo
      </a>
      <div className="dx-shell__frame">
        <Sidebar {...sidebar} onNavigate={onNavigate} collapsed={collapsed} onToggle={(next) => setManual(next)} />
        <Content className="dx-shell__main" id="conteudo" tabIndex={-1}>
          <div className="dx-shell__scroll" onScroll={(e) => setScrolled(e.currentTarget.scrollTop > 0)}>
            <div className="dx-shell__head" data-scrolled={scrolled}>
              <AppHeader
                title={title}
                onMenu={() => setNavOpen(true)}
                searchValue={searchValue}
                onSearchChange={onSearchChange}
                onSearch={onSearch}
                searchAction={searchAction}
                searchName={searchName}
              />
            </div>
            <div className="dx-shell__content">{children}</div>
          </div>
        </Content>
      </div>
      <dialog
        ref={drawerRef}
        className="dx-drawer"
        aria-label="Navegação"
        onClose={closeDrawer}
        onClick={(e) => {
          if (e.target === e.currentTarget) closeDrawer();
        }}
      >
        <Sidebar
          {...sidebar}
          collapsed={false}
          onToggle={closeDrawer}
          onNavigate={(id) => {
            closeDrawer();
            onNavigate?.(id);
          }}
          onRegister={
            sidebar.onRegister
              ? () => {
                  closeDrawer();
                  sidebar.onRegister?.();
                }
              : undefined
          }
        />
      </dialog>
    </div>
  );
}
