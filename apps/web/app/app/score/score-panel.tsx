"use client";

import { useRouter } from "next/navigation";
import type { ReactNode } from "react";

import { FloatingPanel } from "@/components/ds";

// Painel de explicação do cálculo. A rota guarda o estado (?abrir=calculo); fechar devolve o foco a quem abriu.
export function ScorePanel({ children }: { children: ReactNode }) {
  const router = useRouter();
  const close = () => {
    router.replace("/app/score", { scroll: false });
    window.setTimeout(() => document.querySelector<HTMLElement>('a[href="/app/score?abrir=calculo"]')?.focus(), 50);
  };
  return (
    <FloatingPanel open onClose={close} eyebrow="Narrative Score" title="Como o cálculo funciona." subtitle="Cada mudança guarda a origem, o período e os dados que a sustentam." width={600}>
      {children}
    </FloatingPanel>
  );
}
