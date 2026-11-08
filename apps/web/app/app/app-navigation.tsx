"use client";

import {
  DataBase,
  Document,
  Edit,
  Flash,
  Home,
  Notebook,
  Settings,
  SidePanelClose,
  SidePanelOpen,
} from "@carbon/icons-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const destinations = [
  { href: "/app/inicio", label: "Início", icon: Home },
  { href: "/app/diario", label: "Diário", icon: Notebook },
  { href: "/app/evidencias", label: "Evidências", icon: DataBase },
  { href: "/app/live", label: "Persona Live", icon: Flash },
  { href: "/app/artefatos", label: "Artefatos", icon: Document },
];
const settings = { href: "/app/configuracoes", label: "Configurações", icon: Settings };

export function AppNavigation() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const item = ({ href, label, icon: Icon }: typeof settings) => {
    const active = pathname === href || pathname.startsWith(`${href}/`);
    return (
      <li key={href}>
        <Link className="nav-item" href={href} aria-current={active ? "page" : undefined} title={collapsed ? label : undefined}>
          <Icon aria-hidden size={20} />
          <span className="nav-label">{label}</span>
        </Link>
      </li>
    );
  };

  return (
    <div className="app-sidebar" data-collapsed={collapsed}>
      <div className="app-sidebar-top">
        <span className="app-sidebar-brand">
          <Image src="/brand/persona-logo-compacta.svg" width={28} height={28} alt="" priority />
          <span>Persona</span>
        </span>
        <button
          className="nav-toggle"
          type="button"
          aria-expanded={!collapsed}
          aria-label={collapsed ? "Expandir menu" : "Recolher menu"}
          onClick={() => setCollapsed((value) => !value)}
        >
          {collapsed ? <SidePanelOpen aria-hidden size={20} /> : <SidePanelClose aria-hidden size={20} />}
        </button>
      </div>
      <Link className="nav-register" href="/app/diario" title={collapsed ? "Registrar agora" : undefined}>
        <Edit aria-hidden size={20} />
        <span className="nav-label">Registrar agora</span>
      </Link>
      <nav className="app-sidebar-nav" aria-label="Navegação principal">
        <ul>{destinations.map(item)}</ul>
        <ul className="app-sidebar-settings">{item(settings)}</ul>
      </nav>
    </div>
  );
}
