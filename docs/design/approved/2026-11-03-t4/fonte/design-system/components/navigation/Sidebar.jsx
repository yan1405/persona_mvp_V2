import React from 'react';
import { Icon } from '../core/Icon.jsx';
import { IconButton } from '../core/IconButton.jsx';
import { Button } from '../core/Button.jsx';
import { NavItem } from './NavItem.jsx';

export const NAV_DESTINATIONS = [
  { id: 'inicio', icon: 'house', label: 'Início' },
  { id: 'diario', icon: 'notebook-pen', label: 'Diário' },
  { id: 'evidencias', icon: 'badge-check', label: 'Evidências' },
  { id: 'live', icon: 'mic', label: 'Persona Live' },
  { id: 'artefatos', icon: 'file-text', label: 'Artefatos' },
];
export const NAV_SETTINGS = { id: 'configuracoes', icon: 'settings', label: 'Configurações' };

// Geometry copied from assets/logos/persona-logo-compacta.svg.
function Mark({ size = 28 }) {
  const L = [[32, 30], [92, 42], [34, 92], [98, 88]];
  return React.createElement('svg', { width: size, height: size, viewBox: '0 0 120 120', 'aria-hidden': true, style: { flexShrink: 0, display: 'block' } },
    ...L.map(([x, y], i) => React.createElement('line', { key: 'l' + i, x1: x, y1: y, x2: 60, y2: 60, stroke: '#7C3AED', strokeWidth: 11, strokeLinecap: 'round' })),
    ...L.map(([x, y], i) => React.createElement('circle', { key: 'c' + i, cx: x, cy: y, r: 14, fill: '#A78BFA' })),
    React.createElement('circle', { key: 'core', cx: 60, cy: 60, r: 22, fill: '#7C3AED' }));
}

export function Sidebar({ active = 'inicio', onNavigate, collapsed, onToggle, onRegister, resume, onResume, badges = {}, style }) {
  const nav = id => onNavigate && onNavigate(id);
  const register = () => { if (onRegister) onRegister(); else nav('diario'); };
  const w = collapsed ? 76 : 256;
  return (
    <aside aria-label="Navegação principal" style={{ width: w, flexShrink: 0, height: '100%', minHeight: 560, boxSizing: 'border-box', background: 'var(--surface-card)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-soft)', padding: collapsed ? '16px 16px' : '18px 14px', display: 'flex', flexDirection: 'column', alignItems: collapsed ? 'center' : 'stretch', gap: 16, fontFamily: 'var(--font-body)', transition: 'width var(--dur-normal) var(--ease-out)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'space-between', flexDirection: collapsed ? 'column' : 'row', gap: collapsed ? 12 : 8, padding: collapsed ? 0 : '0 4px 0 8px' }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}><Mark size={28} />{collapsed ? null : <span style={{ fontFamily: 'var(--font-display)', fontSize: 19, fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--text-strong)' }}>Persona</span>}</span>
        <IconButton icon="panel-left" size={36} label={collapsed ? 'Expandir menu' : 'Recolher menu'} aria-expanded={!collapsed} onClick={() => onToggle && onToggle(!collapsed)} />
      </div>

      {collapsed
        ? <IconButton icon="square-pen" variant="solid" size={44} label="Registrar agora" onClick={register} />
        : <Button variant="solid" icon="square-pen" fullWidth onClick={register} style={{ height: 44 }}>Registrar agora</Button>}

      <nav aria-label="Destinos" style={{ display: 'flex', flexDirection: 'column', alignItems: collapsed ? 'center' : 'stretch', gap: 2 }}>
        {NAV_DESTINATIONS.map(d => { const b = badges[d.id]; return <NavItem key={d.id} icon={d.icon} label={d.label} collapsed={collapsed} active={active === d.id} badge={b && b.count} badgeLabel={b && b.label} onClick={() => nav(d.id)} />; })}
      </nav>

      <div style={{ flex: 1 }}></div>

      {resume ? (collapsed
        ? <span style={{ position: 'relative', display: 'inline-flex' }}><IconButton icon="history" variant="outline" size={44} label={'Continue de onde parou: ' + resume.title + ' · ' + resume.meta} onClick={onResume} /><span aria-hidden="true" style={{ position: 'absolute', top: 6, right: 6, width: 8, height: 8, borderRadius: 999, background: 'var(--amber-500)', boxShadow: '0 0 0 2px var(--surface-card)' }}></span></span>
        : (
          <section aria-label="Continue de onde parou" style={{ background: 'var(--n-25)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600, color: 'var(--text-muted)' }}><Icon name="history" size={14} />Continue de onde parou</span>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 700, letterSpacing: '-0.01em', color: 'var(--text-strong)', lineHeight: 1.3 }}>{resume.title}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600, color: 'var(--amber-ink)' }}><Icon name="sparkles" size={13} />{resume.meta}</span>
            <Button variant="outline" size="sm" fullWidth onClick={onResume} style={{ marginTop: 2 }}>{resume.action || 'Revisar sugestões'}</Button>
          </section>
        )) : null}

      <div style={{ borderTop: '1px solid var(--divider)', paddingTop: 10, display: 'flex', flexDirection: 'column', alignItems: collapsed ? 'center' : 'stretch', width: collapsed ? '100%' : undefined }}>
        <NavItem icon={NAV_SETTINGS.icon} label={NAV_SETTINGS.label} collapsed={collapsed} active={active === NAV_SETTINGS.id} onClick={() => nav(NAV_SETTINGS.id)} />
      </div>
    </aside>
  );
}
