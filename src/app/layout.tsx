import type { Metadata } from "next";
import "@fontsource/poppins/400.css";
import "@fontsource/poppins/400-italic.css";
import "@fontsource/poppins/500.css";
import "@fontsource/poppins/600.css";
import "@fontsource/poppins/700.css";
import "@fontsource-variable/exo/index.css";
import "./globals.css";
import { UtmCapture } from "@/components/layout/UtmCapture";
import { CookieConsent } from "@/components/tracking/CookieConsent";
import { RouteTracker } from "@/components/tracking/RouteTracker";
import MetaPixel from "@/components/MetaPixel"; // 1. On importe le nouveau composant
import { siteUrl } from "@/config/site";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Madagascar · Célébrations Voyages & Liberty Roots",
    template: "%s · Madagascar",
  },
  description:
    "Deux façons de vivre Madagascar : le voyage organisé et serein avec Célébrations Voyages Madagascar, ou le road trip en liberté avec Madagascar Liberty Roots.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID;

  return (
    <html lang="fr" className="h-full antialiased">
      <head />
      <body className="flex min-h-full flex-col">
        {/* 2. On insère le composant ici. Il gère tout le Pixel proprement */}
        <MetaPixel />

        <CookieConsent gtmId={gtmId} />
        <RouteTracker />
        <UtmCapture />
        {children}
      </body>
    </html>
  );
}
