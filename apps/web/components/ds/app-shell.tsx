"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

import { AppHeader, type AppHeaderProps } from "./app-header";
import { Sidebar, type SidebarProps } from "./sidebar";

export type AppShellProps = Pick<SidebarProps, "active" | "hrefs" | "onNavigate" | "onRegister" | "registerHref" | "resume" | "onResume" | "badges"> &
  Pick<AppHeaderProps, "title" | "searchValue" | "onSearchChange" | "onSearch" | "searchAction" | "searchName"> & {
    children: ReactNode;
    /** Força trilho (`true`) ou barra expandida (`false`); sem valor, segue a largura do shell. */
    sidebarCollapsed?: boolean;
    /** Altura do shell (número). Sem valor ocupa a altura da janela. */
    height?: number;
  };

// Barra lateral branca flutuante (raio 22) + painel (raio 28) sobre --ds-bg-app. A largura vem do próprio shell
// (container query), então funciona dentro de qualquer contêiner. Abaixo de 40 rem a navegação vira uma gaveta <dialog>.
export function AppShell({ children, sidebarCollapsed, height, title, searchValue, onSearchChange, onSearch, searchAction, searchName, onNavigate, ...sidebar }: AppShellProps) {
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
      <div className="dx-shell__frame">
        <Sidebar {...sidebar} onNavigate={onNavigate} collapsed={collapsed} onToggle={(next) => setManual(next)} />
        <main className="dx-shell__main">
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
        </main>
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
