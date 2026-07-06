import { z } from "zod";
import { cvmBudgetValues, precision } from "./common";

/** Funnel CVM · Îles de Rêve (brief §13.3). */

/** Étape 1 — choix de formule (10 ou 15 jours, ou conseil). */
export const cvmIlesOfferSchema = z.object({
  offreDuree: z.enum(
    ["10_jours", "15_jours", "a_conseiller"],
    "Merci de choisir une formule.",
  ),
});

/** Étape 2 — qualification commerciale (sans contact ni offre). */
export const cvmIlesQualificationSchema = z.object({
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
});

export type CvmIlesQualification = z.infer<typeof cvmIlesQualificationSchema>;
