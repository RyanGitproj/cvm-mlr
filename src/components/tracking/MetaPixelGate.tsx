"use client";

import MetaPixel from "@/components/MetaPixel";
import { useConsentChoice } from "@/lib/tracking/consent";

/**
 * Ne monte le Meta Pixel qu'après consentement (même exigence CNIL que GTM) :
 * sans accord, ni le script fbevents ni le pixel `noscript` ne sont rendus,
 * et les appels `fbEvent` des pages restent des no-op (`window.fbq` absent).
 */
export function MetaPixelGate() {
  const consent = useConsentChoice();
  if (consent !== "granted") return null;
  return <MetaPixel />;
}
