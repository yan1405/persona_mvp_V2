"use client";

import { useRouter } from "next/navigation";
import type { ReactNode } from "react";

import { FloatingPanel } from "@/components/ds";

// Painel de explicação do cálculo. A rota guarda o estado (?abrir=calculo); fechar devolve o foco a quem abriu, sem temporizador.
export function ScorePanel({ children }: { children: ReactNode }) {
  const router = useRouter();
  return (
    <FloatingPanel open onClose={() => router.replace("/app/score", { scroll: false })} returnFocusTo='a[href="/app/score?abrir=calculo"]' eyebrow="Narrative Score" title="Como o cálculo funciona." subtitle="Cada mudança guarda a origem, o período e os dados que a sustentam." width={600}>
      {children}
    </FloatingPanel>
  );
}
