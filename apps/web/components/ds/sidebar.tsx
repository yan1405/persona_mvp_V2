import Link from "next/link";

import { Button, ButtonLink } from "./button";
import { cx } from "./cx";
import { Icon, type IconName } from "./icon";
import { IconButton, IconLink } from "./icon-button";
import { Logo } from "./logo";
import { NavItem } from "./nav-item";

export type NavId = "inicio" | "diario" | "evidencias" | "live" | "artefatos" | "configuracoes";

// Cinco destinos + Configurações no rodapé. Sem Score, Diagnóstico, planos ou preços no menu.
export const NAV_DESTINATIONS: Array<{ id: NavId; icon: IconName; label: string }> = [
  { id: "inicio", icon: "house", label: "Início" },
  { id: "diario", icon: "notebook-pen", label: "Diário" },
  { id: "evidencias", icon: "badge-check", label: "Evidências" },
  { id: "live", icon: "mic", label: "Persona Live" },
  { id: "artefatos", icon: "file-text", label: "Artefatos" },
];
export const NAV_SETTINGS: { id: NavId; icon: IconName; label: string } = { id: "configuracoes", icon: "settings", label: "Configurações" };

export type SidebarProps = {
  active?: NavId;
  /** Rotas de cada destino (links do Next). Sem rota, o item é um botão e usa `onNavigate`. */
  hrefs?: Partial<Record<NavId, string>>;
  onNavigate?: (id: NavId) => void;
  /** `undefined` = automático (trilho quando o shell é estreito); `true` = trilho; `false` = expandida. */
  collapsed?: boolean;
  onToggle?: (collapsed: boolean) => void;
  onRegister?: () => void;
  registerHref?: string;
  resume?: { title: string; meta: string; action?: string };
  onResume?: () => void;
  badges?: Partial<Record<NavId, { count: number | string; label: string }>>;
  className?: string;
};

export function Sidebar({ active = "inicio", hrefs = {}, onNavigate, collapsed, onToggle, onRegister, registerHref, resume, onResume, badges = {}, className }: SidebarProps) {
  const mode = collapsed === undefined ? "auto" : collapsed ? "rail" : "expanded";
  const item = (d: { id: NavId; icon: IconName; label: string }) => {
    const b = badges[d.id];
    return (
      <NavItem
        key={d.id}
        icon={d.icon}
        label={d.label}
        href={hrefs[d.id]}
        active={active === d.id}
        badge={b?.count}
        badgeLabel={b?.label}
        onClick={onNavigate ? () => onNavigate(d.id) : undefined}
      />
    );
  };
  return (
    <aside className={cx("dx-side", className)} data-mode={mode} aria-label="Navegação principal">
      <div className="dx-side__top">
        <span className="dx-side__logo-full">
          <Link href={hrefs.inicio || "/"} aria-label="Persona, ir ao início">
            <Logo variant="lockup" height={30} title="" />
          </Link>
        </span>
        <span className="dx-side__logo-mark">
          <Logo variant="mark" height={28} title="Persona" />
        </span>
        <IconButton icon="panel-left" size={36} label={collapsed ? "Expandir menu" : "Recolher menu"} aria-expanded={!collapsed} onClick={onToggle ? () => onToggle(!collapsed) : undefined} />
      </div>

      <span className="dx-side__register">
        {registerHref ? (
          <ButtonLink href={registerHref} variant="solid" icon="square-pen" fullWidth>
            Registrar agora
          </ButtonLink>
        ) : (
          <Button variant="solid" icon="square-pen" fullWidth onClick={onRegister}>
            Registrar agora
          </Button>
        )}
      </span>
      <span className="dx-side__register-icon">
        {registerHref ? <IconLink href={registerHref} icon="square-pen" variant="solid" size={44} label="Registrar agora" /> : <IconButton icon="square-pen" variant="solid" size={44} label="Registrar agora" onClick={onRegister} />}
      </span>

      <nav aria-label="Destinos">
        <ul className="dx-side__nav">{NAV_DESTINATIONS.map((d) => <li key={d.id}>{item(d)}</li>)}</ul>
      </nav>

      <div className="dx-side__spacer" />

      {resume ? (
        <>
          <section className="dx-resume" aria-label="Continue de onde parou">
            <span className="dx-resume__eyebrow">
              <Icon name="history" size={14} />
              Continue de onde parou
            </span>
            <span className="dx-resume__title">{resume.title}</span>
            <span className="dx-resume__meta">
              <Icon name="sparkles" size={13} />
              {resume.meta}
            </span>
            <Button variant="outline" size="sm" fullWidth onClick={onResume}>
              {resume.action || "Revisar sugestões"}
            </Button>
          </section>
          <span className="dx-resume__rail">
            <IconButton icon="history" variant="outline" size={44} label={"Continue de onde parou: " + resume.title + " · " + resume.meta} onClick={onResume} />
            <span className="dx-resume__rail-dot" aria-hidden="true" />
          </span>
        </>
      ) : null}

      <div className="dx-side__foot">{item(NAV_SETTINGS)}</div>
    </aside>
  );
}
