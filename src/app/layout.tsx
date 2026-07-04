import type { Metadata } from "next";
import "@fontsource-variable/inter";
import "@fontsource-variable/oswald";
import "@fontsource/cormorant-garamond/500.css";
import "@fontsource/cormorant-garamond/600.css";
import "@fontsource/cormorant-garamond/700.css";
import "./globals.css";
import { UtmCapture } from "@/components/layout/UtmCapture";
import { CookieConsent } from "@/components/tracking/CookieConsent";
import { RouteTracker } from "@/components/tracking/RouteTracker";
import { siteUrl } from "@/config/site";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Madagascar — Célébration Voyages & Liberty Roots",
    template: "%s · Madagascar",
  },
  description:
    "Deux façons de vivre Madagascar : le voyage organisé et serein avec Célébration Voyages Madagascar, ou le road trip en liberté avec Madagascar Liberty Roots.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID;

  return (
    <html lang="fr" className="h-full antialiased">
      <body className="flex min-h-full flex-col">
        <CookieConsent gtmId={gtmId} />
        <RouteTracker />
        <UtmCapture />
        {children}
      </body>
    </html>
  );
}
