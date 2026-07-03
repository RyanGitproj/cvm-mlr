import { z } from "zod";
import { commonLeadSchema, cvmBudgetValues, precision } from "./common";

/** Funnel CVM · Treks Aventure — gabarit de référence (brief §13.1). */
export const cvmTreksSchema = commonLeadSchema.extend({
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
  duree: z.enum(
    ["7_10", "10_15", "15_21", "21_plus", "autre"],
    "Merci de choisir une réponse.",
  ),
  dureePrecision: precision(),
});

export type CvmTreksLead = z.infer<typeof cvmTreksSchema>;
