import { z } from "zod";
import { commonLeadSchema, cvmBudgetValues, precision } from "./common";

/**
 * Funnel CVM · Un mois à Madagascar (brief §13.4).
 * L'horizon de départ (question 4) alimente le champ commun `periode`.
 */
export const cvmUnMoisSchema = commonLeadSchema.extend({
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
  // Question 4 « Horizon de départ » : réponse guidée qui remplit le champ commun.
  periode: z.enum(
    ["2_4_mois", "4_6_mois", "6_10_mois", "1_an_plus", "precise"],
    "Merci de choisir un horizon de départ.",
  ),
  periodePrecision: precision(),
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

export type CvmUnMoisLead = z.infer<typeof cvmUnMoisSchema>;
