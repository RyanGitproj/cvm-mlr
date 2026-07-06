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
 * Ligne écrite dans `public.funnel_cvm_mlr_info` (étape 1) — colonnes indépendantes
 * (voir supabase/schema.sql). `id` et `created_at` sont générés en base.
 */
export type LeadStep1Row = {
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
  // Offre
  offre_ref: string | null;
  offre_label: string | null;
  offre_duree: string | null;
  offre_prix_indicatif: number | null;
  route: string | null;
  // Attribution
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_content: string | null;
  utm_term: string | null;
  referrer: string | null;
};

/**
 * Ligne écrite dans `public.funnel_cvm_mlr_com` (étape 2) — satellite lié
 * par `lead_id`. `answers` regroupe les réponses commerciales (JSONB).
 */
export type LeadStep2Row = {
  lead_id: string;
  answers: Record<string, unknown>;
  recommendation: Record<string, unknown> | null;
  completed: boolean;
};
