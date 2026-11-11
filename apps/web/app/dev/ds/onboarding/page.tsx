import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Logo } from "@/components/ds";
import { OnboardingForm } from "@/app/onboarding/onboarding-form";

import { isDsGalleryEnabled } from "../gate";

export const metadata: Metadata = {
  title: "Prévia do onboarding",
  robots: { index: false, follow: false },
};

// Prévia local do /onboarding (a tela real exige sessão e banco): mesmos componentes, dados fictícios. 404 em produção.
export const dynamic = "force-dynamic";

export default function OnboardingPreviewPage() {
  if (!isDsGalleryEnabled(process.env)) notFound();
  return (
    <main className="dx-page">
      <div className="dx-page__wrap dx-page__wrap--form">
        <header className="dx-page__brand">
          <Logo variant="lockup" height={32} title="Persona" />
          <span className="dx-page__note">Configuração inicial</span>
        </header>
        <OnboardingForm defaultName="Ana Souza" email="ana@exemplo.com" />
      </div>
    </main>
  );
}
