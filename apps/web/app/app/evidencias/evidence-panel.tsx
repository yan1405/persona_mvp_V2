"use client";

import { useRouter, useSearchParams } from "next/navigation";
import type { ReactNode } from "react";

import { FloatingPanel } from "@/components/ds";

import { closeHref, EVIDENCE_FILTERS } from "../panel-href";

// Painel flutuante ancorado na Biblioteca. A rota guarda o estado (?abrir=); fechar volta com os mesmos filtros
// e devolve o foco ao cartão que abriu (returnFocusTo), sem temporizador.
export function EvidencePanel({ id, title, eyebrow, subtitle, children }: { id: string; title: string; eyebrow: string; subtitle?: string; children: ReactNode }) {
  const router = useRouter();
  const params = useSearchParams();
  const close = () => router.replace(closeHref("/app/evidencias", params, EVIDENCE_FILTERS), { scroll: false });
  return (
    <FloatingPanel open onClose={close} returnFocusTo={`a[href*="abrir=${id}"]`} eyebrow={eyebrow} title={title} subtitle={subtitle} width={600}>
      {children}
    </FloatingPanel>
  );
}
