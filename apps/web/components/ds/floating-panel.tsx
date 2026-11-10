"use client";

import { useEffect, useId, useRef, type CSSProperties, type ReactNode } from "react";

import { cx } from "./cx";
import { IconButton } from "./icon-button";

// Um painel flutuante por vez: abrir um fecha o que já estava aberto.
const ACTIVE: { current: { id: string; close: () => void } | null } = { current: null };

export type FloatingPanelProps = {
  open: boolean;
  onClose: () => void;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  /** Largura máxima (número); em telas estreitas ocupa a largura menos as margens. */
  width?: number;
  children?: ReactNode;
  footer?: ReactNode;
  className?: string;
};

// <dialog> modal nativo: prende o foco, Esc fecha, o resto da página fica inerte e o foco volta a quem abriu.
export function FloatingPanel({ open, onClose, eyebrow, title, subtitle, width, children, footer, className }: FloatingPanelProps) {
  const id = useId();
  const ref = useRef<HTMLDialogElement>(null);
  const closeRef = useRef(onClose);

  useEffect(() => {
    closeRef.current = onClose;
  });

  useEffect(() => {
    const dialog = ref.current;
    if (!open || !dialog) return;
    const me = { id, close: () => closeRef.current() };
    if (ACTIVE.current && ACTIVE.current.id !== id) ACTIVE.current.close();
    ACTIVE.current = me;
    if (!dialog.open) dialog.showModal();
    return () => {
      if (ACTIVE.current === me) ACTIVE.current = null;
      if (dialog.open) dialog.close();
    };
  }, [open, id]);

  if (!open) return null;
  const vars = width != null ? ({ "--dx-panel-w": width } as CSSProperties) : undefined;
  return (
    <dialog
      ref={ref}
      className={cx("dx-panel", className)}
      style={vars}
      aria-labelledby={id + "-t"}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <header className="dx-panel__head">
        <div className="dx-panel__titles">
          {eyebrow ? <span className="dx-panel__eyebrow">{eyebrow}</span> : null}
          <h2 id={id + "-t"} className="dx-panel__title">
            {title}
          </h2>
          {subtitle ? <span className="dx-panel__sub">{subtitle}</span> : null}
        </div>
        <IconButton icon="x" variant="ghost" size={40} label="Fechar painel (Esc)" onClick={onClose} />
      </header>
      <div className="dx-panel__body">{children}</div>
      {footer ? <footer className="dx-panel__foot">{footer}</footer> : null}
    </dialog>
  );
}
