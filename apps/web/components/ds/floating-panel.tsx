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
  /** Seletor do elemento que recebe o foco ao fechar (ex.: o cartão que abriu); sem ele, volta a quem estava em foco ao abrir. */
  returnFocusTo?: string;
  children?: ReactNode;
  footer?: ReactNode;
  className?: string;
};

// O <dialog> fica montado mesmo fechado (o conteúdo só existe aberto): assim close() ainda o encontra no DOM e o navegador devolve o foco a quem abriu.
// <dialog> modal nativo: prende o foco, Esc fecha, o resto da página fica inerte e o foco volta a quem abriu.
export function FloatingPanel({ open, onClose, eyebrow, title, subtitle, width, returnFocusTo, children, footer, className }: FloatingPanelProps) {
  const id = useId();
  const ref = useRef<HTMLDialogElement>(null);
  const closeRef = useRef(onClose);
  const returnRef = useRef(returnFocusTo);

  useEffect(() => {
    closeRef.current = onClose;
    returnRef.current = returnFocusTo;
  });

  useEffect(() => {
    const dialog = ref.current;
    if (!open || !dialog) return;
    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const me = { id, close: () => closeRef.current() };
    if (ACTIVE.current && ACTIVE.current.id !== id) ACTIVE.current.close();
    ACTIVE.current = me;
    if (!dialog.open) dialog.showModal();
    return () => {
      if (ACTIVE.current === me) ACTIVE.current = null;
      if (dialog.open) dialog.close();
      // Determinístico: o <dialog> pode já ter saído do DOM, então o foco volta explicitamente (sem temporizador).
      const target = (returnRef.current ? document.querySelector<HTMLElement>(returnRef.current) : null) ?? (opener?.isConnected ? opener : null);
      target?.focus();
    };
  }, [open, id]);

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
      {open ? (
        <>
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
        </>
      ) : null}
    </dialog>
  );
}
