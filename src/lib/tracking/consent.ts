"use client";

import { useSyncExternalStore } from "react";

/**
 * Store du consentement cookies (CNIL) — source unique lue par le bandeau
 * (`CookieConsent`) et par toute brique de mesure qui doit attendre l'accord
 * (GTM, Meta Pixel). État hors React : `localStorage` + event custom pour
 * notifier les abonnés du même onglet, event `storage` pour les autres onglets.
 */

export type ConsentChoice = "granted" | "denied";

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

/** Enregistre le choix et notifie les composants abonnés de l'onglet courant. */
export function saveConsentChoice(choice: ConsentChoice): void {
  window.localStorage.setItem(STORAGE_KEY, choice);
  window.dispatchEvent(new Event(CONSENT_EVENT));
}

/**
 * Choix de consentement courant, réactif. `null` = aucun choix encore fait
 * (le serveur renvoie toujours `null` : React resynchronise après hydratation,
 * sans mismatch — voir `CookieConsent`).
 */
export function useConsentChoice(): ConsentChoice | null {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
