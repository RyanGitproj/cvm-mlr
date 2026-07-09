"use client";

import { usePathname } from "next/navigation";
import { ScrollCtaLink } from "@/components/ui/ScrollCtaLink";
import { CVM_UNIVERS, type CvmUniversSlug } from "@/config/content/cvm";

/** Libellé unique du bouton navbar des 4 aventures (choix Ryan 2026-07-09). */
const LABEL = "Recevoir ma proposition";

const AVENTURES: readonly CvmUniversSlug[] = [
  "explorer",
  "treks",
  "iles",
  "un-mois",
];

/** Slug d'aventure si la route courante est une des 4 pages, sinon null. */
function aventureSlug(pathname: string): CvmUniversSlug | null {
  const dernier = pathname.split("/").filter(Boolean).at(-1);
  return AVENTURES.find((slug) => slug === dernier) ?? null;
}

/**
 * Bouton de navbar propre aux 4 pages d'aventure CVM (directive Ryan
 * 2026-07-09) : même rôle que le CTA hero — scroller vers le formulaire
 * (#questionnaire) — mais posé dans le header. Rendu uniquement sur les 4
 * routes d'aventure (null ailleurs : landing /cvm, orientation, autres
 * univers). La couleur suit la charte de la page : `data-accent` sur le
 * wrapper redéfinit `--accent`, dont hérite le `bg-accent` du bouton — le
 * header étant hors du `data-accent` posé par CvmUniversPage, on le repose
 * ici localement. Réutilise ScrollCtaLink (scroll fluide, focus, reduced-
 * motion, tracking `cta_click`).
 */
export function CvmHeaderCta() {
  const slug = aventureSlug(usePathname());
  if (slug === null) return null;

  return (
    <div data-accent={CVM_UNIVERS[slug].accent} className="min-w-0">
      <ScrollCtaLink
        targetId="questionnaire"
        variant="primary"
        className="max-w-[60vw] truncate !px-3 !py-2 !text-[11px] sm:max-w-none sm:!px-4 sm:!text-sm"
      >
        {LABEL}
      </ScrollCtaLink>
    </div>
  );
}
