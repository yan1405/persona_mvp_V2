"use client";

import { useRouter, useSearchParams } from "next/navigation";
import type { ReactNode } from "react";

import { FloatingPanel } from "@/components/ds";

import { closeHref, DIARY_FILTERS } from "../panel-href";

// Painel flutuante ancorado na lista do Diário. A rota guarda o estado (?abrir=): link direto, voltar e recarregar funcionam.
// Fechar volta à lista com os mesmos filtros e o foco retorna ao cartão que abriu (returnFocusTo), sem temporizador.
export function DiaryPanel({ id, title, eyebrow, subtitle, children }: { id: string; title: string; eyebrow: string; subtitle?: string; children: ReactNode }) {
  const router = useRouter();
  const params = useSearchParams();
  const close = () => router.replace(closeHref("/app/diario", params, DIARY_FILTERS), { scroll: false });
  return (
    <FloatingPanel open onClose={close} returnFocusTo={`a[href*="abrir=${id}"]`} eyebrow={eyebrow} title={title} subtitle={subtitle} width={600}>
      {children}
    </FloatingPanel>
  );
}
