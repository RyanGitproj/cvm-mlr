import { CVM_UNIVERS, type CvmUniversSlug } from "@/config/content/cvm";
import { MLR_LANDING } from "@/config/content/mlr";
import { formatEuros } from "@/lib/format";
import type { FunnelType } from "@/types/lead";

/**
 * Offres du parcours (composant a) — source unique reliant l'UI (OfferCards),
 * l'enum Zod (`offreDuree`) et les colonnes `offre_*` de `funnel_cvm_mlr_info`.
 * Les prix/durées viennent des contenus éditoriaux (config/content).
 */

const CVM_FUNNEL_TO_SLUG: Partial<Record<FunnelType, CvmUniversSlug>> = {
  cvm_treks: "treks",
  cvm_explorer: "explorer",
  cvm_iles: "iles",
  cvm_un_mois: "un-mois",
};

const ADVISORY_VALUE = "a_conseiller";
// Libellé court : la carte vit dans une rangée de 3 colonnes, même à 390px.
const ADVISORY_LABEL_UI = "Conseillez-moi";
const ADVISORY_LABEL_STORE = "À conseiller sur mesure";

/** Option d'offre présentée dans OfferCards (étape 1). */
export type OfferOption = {
  value: string;
  /** Libellé principal (durée) affiché sur la carte. */
  label: string;
  /** Prix affiché, ou null pour l'option « conseil ». */
  priceText: string | null;
  advisory: boolean;
};

/** Offre résolue pour stockage dans la table `funnel_cvm_mlr_info`. */
export type ResolvedOffer = {
  ref: string;
  label: string;
  duree: string | null;
  prixIndicatif: number | null;
};

function advisoryOption(): OfferOption {
  return {
    value: ADVISORY_VALUE,
    label: ADVISORY_LABEL_UI,
    priceText: null,
    advisory: true,
  };
}

/**
 * Options d'offre à afficher pour un funnel. Vide pour orientation (aucune
 * offre) et un-mois (formule unique, affichée sans choix).
 */
export function offerOptionsFor(funnelType: FunnelType): OfferOption[] {
  if (funnelType === "mlr") {
    return [
      ...MLR_LANDING.durees.map((d) => ({
        value: d.value,
        label: d.titre,
        // Version compacte de d.prix (« dès 1 400 € / pers ») pour la carte.
        priceText: `dès ${formatEuros(d.prixDes)}`,
        advisory: false,
      })),
      advisoryOption(),
    ];
  }

  const slug = CVM_FUNNEL_TO_SLUG[funnelType];
  if (slug === undefined || slug === "un-mois") return [];

  return [
    ...CVM_UNIVERS[slug].formules.flatMap<OfferOption>((f) =>
      f.value === undefined
        ? []
        : [
            {
              value: f.value,
              label: f.duree ?? "Formule",
              priceText: formatEuros(f.prixEuros),
              advisory: false,
            },
          ],
    ),
    advisoryOption(),
  ];
}

/**
 * Résout l'offre choisie (ou implicite) en données de stockage. `offreRef`
 * vient du champ `offreDuree` validé ; ignoré pour un-mois (formule unique)
 * et orientation (aucune offre).
 */
export function resolveOffer(
  funnelType: FunnelType,
  offreRef: string | undefined,
): ResolvedOffer | null {
  if (funnelType === "cvm_orientation") return null;

  if (offreRef === ADVISORY_VALUE) {
    return {
      ref: ADVISORY_VALUE,
      label: ADVISORY_LABEL_STORE,
      duree: null,
      prixIndicatif: null,
    };
  }

  if (funnelType === "cvm_un_mois") {
    const f = CVM_UNIVERS["un-mois"].formules[0];
    return {
      ref: f.value ?? "un_mois",
      label: f.duree ?? "Formule unique",
      duree: f.duree ?? null,
      prixIndicatif: f.prixEuros,
    };
  }

  if (funnelType === "mlr") {
    const d = MLR_LANDING.durees.find((x) => x.value === offreRef);
    if (d === undefined) return null;
    return {
      ref: d.value,
      label: `${d.titre} — ${d.prix}`,
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

/** Offre à afficher quand il n'y a pas de choix (un-mois) — sinon null. */
export function singleOfferFor(funnelType: FunnelType): ResolvedOffer | null {
  if (funnelType === "cvm_un_mois") return resolveOffer(funnelType, undefined);
  return null;
}
