import { z } from "zod";
import { commonLeadSchema, cvmBudgetValues, precision } from "./common";

/** Funnel CVM · Îles de Rêve (brief §13.3). */
export const cvmIlesSchema = commonLeadSchema.extend({
  budget: z.enum(cvmBudgetValues, "Merci de choisir une enveloppe budget."),
  destination: z.enum(
    ["nosy_be", "sainte_marie", "combine", "selon_saison", "autre"],
    "Merci de choisir une réponse.",
  ),
  destinationPrecision: precision(),
  ambiance: z.enum(
    ["romantique", "detente", "famille_amis", "festif_chic", "autre"],
    "Merci de choisir une réponse.",
  ),
  ambiancePrecision: precision(),
  activites: z.enum(
    ["spa_bien_etre", "snorkeling", "plongee", "excursions", "autre"],
    "Merci de choisir une réponse.",
  ),
  activitesPrecision: precision(),
  rythme: z.enum(
    ["repos_max", "equilibre", "actif_confortable", "combine", "autre"],
    "Merci de choisir une réponse.",
  ),
  rythmePrecision: precision(),
  confort: z.enum(
    ["charme_simple", "confort_agreable", "premium", "luxe", "autre"],
    "Merci de choisir une réponse.",
  ),
  confortPrecision: precision(),
  voyageurs: z.enum(
    ["couple", "famille", "amis", "solo", "autre"],
    "Merci de choisir une réponse.",
  ),
  voyageursPrecision: precision(),
  duree: z.enum(
    ["7", "10", "14", "14_plus", "autre"],
    "Merci de choisir une réponse.",
  ),
  dureePrecision: precision(),
});

export type CvmIlesLead = z.infer<typeof cvmIlesSchema>;
