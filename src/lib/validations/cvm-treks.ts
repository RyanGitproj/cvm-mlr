import { z } from "zod";
import { cvmBudgetValues, precision } from "./common";

/** Funnel CVM · Treks Aventure — gabarit de référence (brief §13.1). */

/** Étape 1 — choix de formule (10 ou 15 jours, ou conseil). */
export const cvmTreksOfferSchema = z.object({
  offreDuree: z.enum(
    ["10_jours", "15_jours", "a_conseiller"],
    "Merci de choisir une formule.",
  ),
});

/** Étape 2 — qualification commerciale (sans contact ni offre). */
export const cvmTreksQualificationSchema = z.object({
  budget: z.enum(cvmBudgetValues, "Merci de choisir une enveloppe budget."),
  kmParJour: z.enum(
    ["5_8", "8_12", "12_18", "18_plus", "autre"],
    "Merci de choisir une réponse.",
  ),
  kmParJourPrecision: precision(),
  denivele: z.enum(
    ["faible", "modere", "soutenu", "a_orienter", "autre"],
    "Merci de choisir une réponse.",
  ),
  denivelePrecision: precision(),
  terrain: z.enum(
    ["accessible", "rocheux", "pistes", "jungle", "autre"],
    "Merci de choisir une réponse.",
  ),
  terrainPrecision: precision(),
  passagesRocheux: z.enum(
    ["aucun", "faciles", "engages", "a_conseiller", "autre"],
    "Merci de choisir une réponse.",
  ),
  passagesRocheuxPrecision: precision(),
  decor: z.enum(
    ["nord", "ouest", "sud", "est", "a_orienter"],
    "Merci de choisir une réponse.",
  ),
  confort: z.enum(
    ["simple", "mixte", "confort", "rustique_ponctuel", "autre"],
    "Merci de choisir une réponse.",
  ),
  confortPrecision: precision(),
});

export type CvmTreksQualification = z.infer<typeof cvmTreksQualificationSchema>;
