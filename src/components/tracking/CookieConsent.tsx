"use client";

import Link from "next/link";
import Script from "next/script";
import { useEffect, useRef, useSyncExternalStore } from "react";

type ConsentChoice = "granted" | "denied";

const STORAGE_KEY = "cookie_consent";
const CONSENT_EVENT = "cookie-consent-change";

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(CONSENT_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(CONSENT_EVENT, callback);
  };
}

function getSnapshot(): ConsentChoice | null {
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return stored === "granted" || stored === "denied" ? stored : null;
}

function getServerSnapshot(): ConsentChoice | null {
  return null;
}

/**
 * Charge GTM uniquement après consentement, et affiche le bandeau tant qu'aucun
 * choix n'a été fait (exigence CNIL : aucun cookie de mesure sans accord). Sans
 * `gtmId` (env vide) rien ne charge de toute façon.
 *
 * `useSyncExternalStore` lit le `localStorage` (état hors React) : le serveur
 * n'y a pas accès, donc `getServerSnapshot` renvoie `null` (= premier visiteur)
 * et React resynchronise juste après l'hydratation, sans warning de mismatch.
 */
export function CookieConsent({ gtmId }: { gtmId?: string }) {
  const consent = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const bannerRef = useRef<HTMLDivElement>(null);

  // Le bandeau est `fixed` au bas du viewport : il recouvrirait les ~180 px du
  // bas de page (dont le CTA d'un formulaire court, ex. l'orientation). Tant
  // qu'il est affiché, on réserve sa hauteur en bas du document pour que tout
  // contenu puisse défiler au-dessus. Recalcul au resize (le bandeau passe en
  // colonne sous `sm`, sa hauteur change).
  useEffect(() => {
    if (consent !== null) return;
    const banner = bannerRef.current;
    if (!banner) return;
    const reserveSpace = () => {
      document.body.style.paddingBottom = `${banner.offsetHeight}px`;
    };
    reserveSpace();
    window.addEventListener("resize", reserveSpace);
    return () => {
      window.removeEventListener("resize", reserveSpace);
      document.body.style.paddingBottom = "";
    };
  }, [consent]);

  function handleChoice(choice: ConsentChoice) {
    window.localStorage.setItem(STORAGE_KEY, choice);
    window.dispatchEvent(new Event(CONSENT_EVENT));
  }

  return (
    <>
      {gtmId && consent === "granted" && (
        <>
          <Script id="gtm-script" strategy="afterInteractive">
            {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtmId}');`}
          </Script>
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            />
          </noscript>
        </>
      )}

      {consent === null && (
        <div
          ref={bannerRef}
          role="dialog"
          aria-label="Consentement aux cookies"
          className="fixed inset-x-0 bottom-0 z-50 border-t-2 border-line bg-card px-4 py-4 sm:px-6"
        >
          <div className="mx-auto flex max-w-5xl flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm leading-relaxed text-ink-soft">
              Nous utilisons des cookies de mesure d’audience (Google Analytics)
              pour comprendre l’usage du site. Vous pouvez accepter ou refuser à
              tout moment.{" "}
              <Link href="/confidentialite" className="font-medium text-accent underline">
                En savoir plus
              </Link>
            </p>
            <div className="flex shrink-0 gap-3">
              <button
                type="button"
                onClick={() => handleChoice("denied")}
                className="rounded-lg border-2 border-line px-5 py-2 text-sm font-medium text-ink transition-colors hover:border-accent-soft"
              >
                Refuser
              </button>
              <button
                type="button"
                onClick={() => handleChoice("granted")}
                className="rounded-lg bg-accent px-5 py-2 text-sm font-semibold text-accent-contrast transition-colors hover:opacity-90"
              >
                Accepter
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
