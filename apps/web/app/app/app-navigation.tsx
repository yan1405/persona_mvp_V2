"use client";

import {
  DataBase,
  Document,
  Flash,
  Home,
  Notebook,
  Settings,
} from "@carbon/icons-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const available = [
  { href: "/app/inicio", label: "Início", icon: Home },
  { href: "/app/diario", label: "Diário", icon: Notebook },
  { href: "/app/evidencias", label: "Evidências", icon: DataBase },
];

const upcoming = [
  { label: "Persona Live", icon: Flash },
  { label: "Artefatos", icon: Document },
];

export function AppNavigation() {
  const pathname = usePathname();

  return (
    <nav className="app-rail" aria-label="Navegação principal">
      <div className="app-rail-main">
        {available.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link className="rail-item" data-active={active} href={href} key={href} aria-current={active ? "page" : undefined} title={label}>
              <Icon aria-hidden size={18} />
              <span className="sr-only">{label}</span>
            </Link>
          );
        })}
        {upcoming.map(({ label, icon: Icon }) => (
          <span className="rail-item rail-item-disabled" aria-disabled="true" key={label} title={`${label} — próxima fase`}>
            <Icon aria-hidden size={18} />
            <span className="sr-only">{label} — ainda indisponível</span>
          </span>
        ))}
      </div>
      <span className="rail-item rail-item-disabled" aria-disabled="true" title="Configurações — próxima fase">
        <Settings aria-hidden size={18} />
        <span className="sr-only">Configurações — ainda indisponível</span>
      </span>
    </nav>
  );
}
