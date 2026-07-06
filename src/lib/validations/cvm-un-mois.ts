import { z } from "zod";
import { cvmBudgetValues, precision } from "./common";

/**
 * Funnel CVM · Un mois à Madagascar (brief §13.4).
 * Formule unique (« Environ 1 mois ») : pas de choix d'offre en étape 1.
 */

/** Étape 1 — aucune option d'offre (formule unique). */
export const cvmUnMoisOfferSchema = z.object({});

/** Étape 2 — qualification commerciale (sans contact ni offre). */
export const cvmUnMoisQualificationSchema = z.object({
  budget: z.enum(cvmBudgetValues, "Merci de choisir une enveloppe budget."),
  objectifMois: z.enum(
    ["expatriation", "creation_societe", "retraite", "decouverte", "autre"],
    "Merci de choisir une réponse.",
  ),
  objectifMoisPrecision: precision(),
  maturite: z.enum(
    ["premiere_reflexion", "serieux_compare", "avance", "engage", "autre"],
    "Merci de choisir une réponse.",
  ),
  maturitePrecision: precision(),
  // Horizon de départ (réponse guidée) — renommé pour ne pas entrer en
  // collision avec le champ `periode` (texte libre) du contact.
  horizon: z.enum(
    ["2_4_mois", "4_6_mois", "6_10_mois", "1_an_plus", "precise"],
    "Merci de choisir un horizon de départ.",
  ),
  horizonPrecision: precision(),
  sujets: z.enum(
    [
      "cadre_de_vie",
      "activite_partenaires",
      "logement_installation",
      "administratif",
      "autre",
    ],
    "Merci de choisir une réponse.",
  ),
  sujetsPrecision: precision(),
  regions: z.enum(
    ["tana_hautes_terres", "nord", "est", "ouest_sud", "quatre_coins"],
    "Merci de choisir une réponse.",
  ),
  accompagnement: z.enum(
    ["tres_accompagne", "semi_guide", "autonome", "orientation_business", "autre"],
    "Merci de choisir une réponse.",
  ),
  accompagnementPrecision: precision(),
  situation: z.enum(
    ["seul", "couple", "famille", "associe", "autre"],
    "Merci de choisir une réponse.",
  ),
  situationPrecision: precision(),
  confort: z.enum(
    ["simple_eco", "correct", "superieur", "premium", "autre"],
    "Merci de choisir une réponse.",
  ),
  confortPrecision: precision(),
});

export type CvmUnMoisQualification = z.infer<
  typeof cvmUnMoisQualificationSchema
>;
