"use client";

import { useRouter } from "next/navigation";
import type { ReactNode } from "react";

import { FloatingPanel } from "@/components/ds";

// Painel flutuante ancorado na Biblioteca. A rota guarda o estado (?abrir=); fechar devolve o foco ao cartão que abriu.
export function EvidencePanel({ id, title, eyebrow, subtitle, children }: { id: string; title: string; eyebrow: string; subtitle?: string; children: ReactNode }) {
  const router = useRouter();
  const close = () => {
    router.replace("/app/evidencias", { scroll: false });
    window.setTimeout(() => document.querySelector<HTMLElement>(`a[href="/app/evidencias?abrir=${id}"]`)?.focus(), 50);
  };
  return (
    <FloatingPanel open onClose={close} eyebrow={eyebrow} title={title} subtitle={subtitle} width={600}>
      {children}
    </FloatingPanel>
  );
}
