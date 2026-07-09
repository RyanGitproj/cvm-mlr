"use client";

import type { MouseEvent, ReactNode } from "react";
import { scrollToElement } from "@/lib/scroll";
import { pushDataLayerEvent } from "@/lib/tracking/gtm";
import { buttonClasses, type ButtonVariant } from "./Button";

type Props = {
  /** id de la section cible (sans « # »), ex. "questionnaire". */
  targetId: string;
  variant?: ButtonVariant;
  className?: string;
  children: ReactNode;
};

/**
 * CTA de scroll hybride : href="#…" en filet de sécurité (fonctionne avant
 * hydratation / sans JS), onClick pour un défilement contrôlé — fluide,
 * respectueux de prefers-reduced-motion, avec déplacement du focus vers la
 * cible (navigation clavier cohérente). L'URL reste propre : pas de hash
 * ajouté à l'historique.
 */
export function ScrollCtaLink({ targetId, variant, className, children }: Props) {
  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    // Tous les CTA de scroll sont mesurés — la page distingue les doublons
    // d'id (`questionnaire` sur chaque page) via page_location côté GA4.
    pushDataLayerEvent("cta_click", {
      cta_id: targetId,
      ...(typeof children === "string" ? { cta_label: children } : {}),
    });
    const target = document.getElementById(targetId);
    if (target === null) return; // fallback : ancre native
    event.preventDefault();
    scrollToElement(target);
    target.focus({ preventScroll: true });
  }

  return (
    <a
      href={`#${targetId}`}
      onClick={handleClick}
      className={buttonClasses(variant, className)}
    >
      {children}
    </a>
  );
}
