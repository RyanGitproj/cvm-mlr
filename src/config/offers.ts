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

/**
 * Ids des lignes de `cv_mada_offres_catalogue` (base live, automatisation
 * aval) par offre Q2 — le code envoie l'id à l'INSERT, le reste (FK,
 * triggers) est géré côté Supabase (décision Ryan 2026-07-10). À mettre à
 * jour si le catalogue est re-seedé. MLR volontairement absent : ses 4
 * lignes (routes Nord/Ouest × 2 durées) n'existent pas encore au catalogue —
 * son futur mapping sera (route, durée) → id, pas durée seule (voir TODO.md).
 */
const CATALOGUE_OFFRE_IDS: Partial<Record<FunnelType, Record<string, number>>> = {
  cvm_explorer: { "12_jours": 1, "15_jours": 2 },
  cvm_treks: { "10_jours": 4, "15_jours": 5 },
  cvm_iles: { "10_jours": 6, "15_jours": 7 },
  cvm_un_mois: { un_mois: 8 },
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
  /** FK `cv_mada_offres_catalogue` — null tant que l'offre n'y a pas de ligne. */
  catalogueOffreId: number | null;
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
      catalogueOffreId: CATALOGUE_OFFRE_IDS[funnelType]?.[d.value] ?? null,
    };
  }

  const slug = CVM_FUNNEL_TO_SLUG[funnelType];
  if (slug === undefined) return null;
  const f = CVM_UNIVERS[slug].formules.find((x) => x.value === offreRef);
  if (f === undefined) return null;
  const ref = f.value ?? offreRef ?? "";
  return {
    ref,
    label: f.duree ?? "Formule",
    duree: f.duree ?? null,
    prixIndicatif: f.prixEuros,
    catalogueOffreId: CATALOGUE_OFFRE_IDS[funnelType]?.[ref] ?? null,
  };
}
