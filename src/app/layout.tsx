import type { Metadata } from "next";
import Script from "next/script";
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
import { siteUrl } from "@/config/site";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Madagascar — Célébrations Voyages & Liberty Roots",
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

  // Mise à jour de l'ID par défaut avec votre nouveau Pixel Code
  const metaPixelId = "1416507340279589";

  return (
    <html lang="fr" className="h-full antialiased">
      <head>
        {/* Noscript conservé dans le <head> pour éviter les erreurs d'hydratation Next.js */}
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src={`https://www.facebook.com/tr?id=${metaPixelId}&ev=PageView&noscript=1`}
            alt=""
          />
        </noscript>
      </head>
      <body className="flex min-h-full flex-col">
        {/* Intégration du nouveau code de script Meta Pixel via next/script */}
        <Script id="meta-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${metaPixelId}');
            fbq('track', 'PageView');
          `}
        </Script>

        <CookieConsent gtmId={gtmId} />
        <RouteTracker />
        <UtmCapture />
        {children}
      </body>
    </html>
  );
}
