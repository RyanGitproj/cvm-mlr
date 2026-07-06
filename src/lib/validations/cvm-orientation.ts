import { z } from "zod";
import { cvmBudgetValues, precision } from "./common";

/**
 * Funnel CVM · Orientation (Funnel 0, mission Riane) — pour les visiteurs
 * indécis. Aucune offre à choisir : étape 1 = contact seul ; les 8 questions
 * d'aiguillage forment l'étape 2. La sortie recommande un des 4 univers
 * (voir lib/segmentation).
 */

/** Étape 1 — aucune option d'offre (aiguillage sans produit). */
export const cvmOrientationOfferSchema = z.object({});

/** Étape 2 — questions d'aiguillage (sans contact). */
export const cvmOrientationQualificationSchema = z.object({
  budget: z.enum(cvmBudgetValues, "Merci de choisir une enveloppe budget."),
  intention: z.enum(
    ["explorer", "treks", "iles", "un_mois", "autre"],
    "Merci de choisir une réponse.",
  ),
  intentionPrecision: precision(),
  delai: z.enum(
    ["2_4_mois", "4_6_mois", "6_10_mois", "1_an_plus", "precise"],
    "Merci de choisir une réponse.",
  ),
  delaiPrecision: precision(),
  duree: z.enum(
    ["7_10", "10_15", "15_21", "un_mois", "autre"],
    "Merci de choisir une réponse.",
  ),
  dureePrecision: precision(),
  confort: z.enum(
    ["rustique", "simple_encadre", "mixte", "premium", "autre"],
    "Merci de choisir une réponse.",
  ),
  confortPrecision: precision(),
  niveauPhysique: z.enum(
    ["moderee", "active", "sportive", "tres_sportive", "autre"],
    "Merci de choisir une réponse.",
  ),
  niveauPhysiquePrecision: precision(),
  imprevu: z.enum(
    [
      "tres_organise",
      "accepte_imprevus",
      "adapte_terrain",
      "comprendre_pays",
      "autre",
    ],
    "Merci de choisir une réponse.",
  ),
  imprevuPrecision: precision(),
  objectif: z.enum(
    ["depassement", "paysages_cadre", "detente", "projet_de_vie", "autre"],
    "Merci de choisir une réponse.",
  ),
  objectifPrecision: precision(),
});

export type CvmOrientationQualification = z.infer<
  typeof cvmOrientationQualificationSchema
>;
