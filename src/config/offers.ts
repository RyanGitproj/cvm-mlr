import { CVM_UNIVERS, type CvmUniversSlug } from "@/config/content/cvm";
import { MLR_DUREES_NOTE, MLR_LANDING } from "@/config/content/mlr";
import { formatEuros } from "@/lib/format";
import type { FunnelType } from "@/types/lead";

/**
 * Offres du parcours (Q2 du gabarit maquette) — source unique reliant l'UI
 * (OfferCards), l'enum Zod (`offreDuree`) et les colonnes `offre_*` de
 * `funnel_cvm_mlr_leads`. Les prix/durées viennent des contenus éditoriaux
 * (config/content). Cartes sèches à prix, sans option « Conseillez-moi »
 * (décision Ryan 2026-07-07).
 */

const CVM_FUNNEL_TO_SLUG: Partial<Record<FunnelType, CvmUniversSlug>> = {
  cvm_treks: "treks",
  cvm_explorer: "explorer",
  cvm_iles: "iles",
  cvm_un_mois: "un-mois",
};

/** Pictogramme du badge rond de la carte d'offre (maquette 3, décoratif). */
export type OfferIcon = "bus" | "jeep" | "trek" | "plage" | "bivouac" | "grand-tour";

/** Icône par univers CVM — MLR distingue ses durées (bus / jeep) en contenu. */
const CVM_OFFER_ICONS: Record<CvmUniversSlug, OfferIcon> = {
  treks: "trek",
  iles: "plage",
  explorer: "bivouac",
  "un-mois": "grand-tour",
};

/** Option d'offre présentée dans OfferCards. */
export type OfferOption = {
  value: string;
  /** Libellé principal (durée / formule) affiché sur la carte. */
  label: string;
  /** Phrase d'appui de la carte — textes propres à chaque aventure. */
  description?: string;
  /** Prix nu (« 1 400 € ») — la carte l'habille en « À partir de … / personne ». */
  priceText: string;
  /** Note d'exclusion affichée sous le prix (« Hors vols… »). */
  priceNote?: string;
  /** Visuel du volet photo — placeholder si src absent. */
  image?: { label: string; alt: string; src?: string };
  icon?: OfferIcon;
};

/** Offre résolue pour stockage dans la table `funnel_cvm_mlr_leads`. */
export type ResolvedOffer = {
  ref: string;
  label: string;
  duree: string | null;
  prixIndicatif: number | null;
};

/**
 * Options d'offre à afficher pour un funnel. Vide pour l'orientation
 * (aiguillage sans produit). Grand Tour : une carte unique — le prix
 * s'affiche d'entrée (vocal boss).
 */
export function offerOptionsFor(funnelType: FunnelType): OfferOption[] {
  if (funnelType === "mlr") {
    return MLR_LANDING.durees.map((d) => ({
      value: d.value,
      label: d.titre,
      description: d.texte,
      priceText: formatEuros(d.prixDes),
      priceNote: MLR_DUREES_NOTE,
      image: d.image,
      icon: d.icon,
    }));
  }

  const slug = CVM_FUNNEL_TO_SLUG[funnelType];
  if (slug === undefined) return [];

  return CVM_UNIVERS[slug].formules.flatMap<OfferOption>((f) =>
    f.value === undefined
      ? []
      : [
          {
            value: f.value,
            label: f.duree ?? "Formule",
            description: f.texte,
            priceText: formatEuros(f.prixEuros),
            image: f.image,
            icon: CVM_OFFER_ICONS[slug],
          },
        ],
  );
}

/**
 * Résout l'offre choisie en données de stockage. `offreRef` vient du champ
 * `offreDuree` validé ; null pour l'orientation (aucune offre).
 */
export function resolveOffer(
  funnelType: FunnelType,
  offreRef: string | undefined,
): ResolvedOffer | null {
  if (funnelType === "mlr") {
    const d = MLR_LANDING.durees.find((x) => x.value === offreRef);
    if (d === undefined) return null;
    return {
      ref: d.value,
      label: `${d.titre}, ${d.prix}`,
      duree: d.titre,
      prixIndicatif: d.prixDes,
    };
  }

  const slug = CVM_FUNNEL_TO_SLUG[funnelType];
  if (slug === undefined) return null;
  const f = CVM_UNIVERS[slug].formules.find((x) => x.value === offreRef);
  if (f === undefined) return null;
  return {
    ref: f.value ?? offreRef ?? "",
    label: f.duree ?? "Formule",
    duree: f.duree ?? null,
    prixIndicatif: f.prixEuros,
  };
}
