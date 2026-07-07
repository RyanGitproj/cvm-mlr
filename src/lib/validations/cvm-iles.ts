import { z } from "zod";
import { departFenetreSchema, nbVoyageursPrecisionSchema, nbVoyageursSchema, precision } from "./common";

/**
 * Funnel CVM · Séjour Collection — gabarit maquette 2026-07-07 :
 * Q1 destination (projection), Q2 offre, Q3 période, Q4 voyageurs.
 */

export const cvmIlesOfferSchema = z.object({
  offreDuree: z.enum(["10_jours", "15_jours"], "Merci de choisir une formule."),
});

export const cvmIlesQualificationSchema = z.object({
  destination: z.enum(
    // « selon_saison » retirée le 2026-07-07 (demande Ryan).
    ["nosy_be", "sainte_marie", "combine", "autre"],
    "Merci de choisir une réponse.",
  ),
  destinationPrecision: precision(),
  departFenetre: departFenetreSchema,
  nbVoyageurs: nbVoyageursSchema,
  nbVoyageursPrecision: nbVoyageursPrecisionSchema,
});

export type CvmIlesQualification = z.infer<typeof cvmIlesQualificationSchema>;
