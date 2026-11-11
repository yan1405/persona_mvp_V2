"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Icon, type IconName } from "@/components/ds";

const items: { href: string; label: string; icon: IconName }[] = [
  { href: "/app/configuracoes", label: "Perfil e preferências", icon: "user" },
  { href: "/app/configuracoes/dados", label: "Dados e privacidade", icon: "lock" },
  { href: "/app/configuracoes/conta", label: "Conta e acesso", icon: "log-out" },
];

export function SettingsNavigation() {
  const pathname = usePathname();
  return (
    <nav className="dx-index dx-set__nav" aria-label="Seções de configurações">
      <span className="dx-index__title">Nesta área</span>
      <ul className="dx-set__list">
        {items.map(({ href, label, icon }) => {
          const active = pathname === href || (href === "/app/configuracoes" && pathname === "/app/configuracoes/");
          return (
            <li key={href}>
              <Link className="dx-set__link" aria-current={active ? "page" : undefined} href={href}>
                <Icon name={icon} size={18} />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
