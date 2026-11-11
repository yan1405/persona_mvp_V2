import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Gallery } from "./gallery";
import { isDsGalleryEnabled } from "./gate";

export const metadata: Metadata = {
  title: "Galeria do Design System",
  robots: { index: false, follow: false },
};

// Lê o ambiente a cada requisição: nunca vira página estática de produção.
export const dynamic = "force-dynamic";

export default function DsGalleryPage() {
  if (!isDsGalleryEnabled(process.env)) notFound();
  return <Gallery />;
}
