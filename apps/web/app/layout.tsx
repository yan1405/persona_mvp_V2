import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import "./ds.css";

// Fontes variáveis (OFL-1.1), subconjunto latin. Licença e hashes: docs/redesign/interface/LICENCAS_FONTES.md.
const inter = localFont({
  src: "../public/fonts/Inter-latin.woff2",
  variable: "--font-inter",
  weight: "400 700",
});

const plusJakartaSans = localFont({
  src: "../public/fonts/PlusJakartaSans-latin.woff2",
  variable: "--font-jakarta",
  weight: "500 800",
});

export const metadata: Metadata = {
  title: "Persona — Registre uma vez. Prove sempre.",
  description:
    "Organize experiências reais e transforme sua trajetória em evidências profissionais.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${inter.variable} ${plusJakartaSans.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
