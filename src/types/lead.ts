import type { Fenetre, OrientationUnivers } from "@/config/segmentation";
import type { DepartFenetre } from "@/lib/validations/common";

export type Brand = "cvm" | "mlr";

export const FUNNEL_TYPES = [
  "cvm_orientation",
  "cvm_explorer",
  "cvm_treks",
  "cvm_iles",
  "cvm_un_mois",
  "mlr",
] as const;

export type FunnelType = (typeof FUNNEL_TYPES)[number];

/**
 * Colonnes de qualification de la table unique — extraites du parcours par
 * `processLead`. Toutes nullables : null = non demandé par ce funnel
 * (projection pour MLR dont la Q1 est la colonne `route`, reco_univers hors
 * orientation) ou qualification invalide (théorique — le lead est conservé
 * quand même).
 */
export type LeadQualifColumns = {
  /** Réponse Q1 de projection (intention/decor/terrain/destination/objectifMois). */
  projection: string | null;
  /** Texte libre « Autre — je précise », seulement si projection = "autre". */
  projection_precision: string | null;
  depart_fenetre: DepartFenetre | null;
  reco_fenetre: Fenetre | null;
  reco_univers: OrientationUnivers | null;
};

/** Fragment qualif vide — insert de secours quand la qualification échoue. */
export const EMPTY_QUALIF: LeadQualifColumns = {
  projection: null,
  projection_precision: null,
  depart_fenetre: null,
  reco_fenetre: null,
  reco_univers: null,
};

/**
 * Ligne écrite dans `public.funnel_cvm_mlr_leads` — table plate unique
 * (voir supabase/schema.sql). `id` et `created_at` sont générés en base ;
 * la colonne `suite` est écrite après coup par `updateLeadSuite` (écran
 * final), jamais à l'insert.
 */
export type LeadRow = {
  funnel_type: FunnelType;
  brand: Brand;
  // Contact
  nom: string;
  prenom: string | null;
  telephone: string;
  email: string;
  nb_voyageurs: number | null;
  periode: string | null;
  commentaire: string | null;
  consentement: boolean;
  // Newsletter facultative (les 2 marques) — null = non demandé (anciens
  // leads) ; false = décochée. RGPD simplifié, décision Ryan 2026-07-07.
  optin_newsletter: boolean | null;
  // Offre
  offre_ref: string | null;
  offre_label: string | null;
  offre_duree: string | null;
  offre_prix_indicatif: number | null;
  // FK vers cv_mada_offres_catalogue (automatisation aval, table live hors
  // repo) — mapping en dur dans src/config/offers.ts.
  // NULL = orientation, MLR (lignes catalogue à venir) ou offre inconnue.
  catalogue_offre_id: number | null;
  route: string | null;
  // Attribution
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_content: string | null;
  utm_term: string | null;
  referrer: string | null;
} & LeadQualifColumns;
