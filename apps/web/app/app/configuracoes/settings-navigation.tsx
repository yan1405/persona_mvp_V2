"use client";

import { Locked, Logout, User } from "@carbon/icons-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/app/configuracoes", label: "Perfil e preferências", icon: User },
  { href: "/app/configuracoes/dados", label: "Dados e privacidade", icon: Locked },
  { href: "/app/configuracoes/conta", label: "Conta e acesso", icon: Logout },
];

export function SettingsNavigation() {
  const pathname = usePathname();

  return (
    <nav className="settings-nav" aria-label="Seções de configurações">
      {items.map(({ href, label, icon: Icon }) => {
        const active =
          pathname === href ||
          (href === "/app/configuracoes" && pathname === "/app/configuracoes/");
        return (
          <Link
            aria-current={active ? "page" : undefined}
            data-active={active}
            href={href}
            key={href}
          >
            <Icon aria-hidden size={18} />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
