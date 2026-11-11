"use client";

import { useRouter } from "next/navigation";
import type { ReactNode } from "react";

import { FloatingPanel } from "@/components/ds";

// Painel flutuante ancorado na lista do Diário. A rota guarda o estado (?abrir=): link direto, voltar e recarregar funcionam.
// Fechar volta à lista e devolve o foco ao cartão que abriu o painel.
export function DiaryPanel({ id, title, eyebrow, subtitle, children }: { id: string; title: string; eyebrow: string; subtitle?: string; children: ReactNode }) {
  const router = useRouter();
  const close = () => {
    router.replace("/app/diario", { scroll: false });
    window.setTimeout(() => document.querySelector<HTMLElement>(`a[href="/app/diario?abrir=${id}"]`)?.focus(), 50);
  };
  return (
    <FloatingPanel open onClose={close} eyebrow={eyebrow} title={title} subtitle={subtitle} width={600}>
      {children}
    </FloatingPanel>
  );
}
