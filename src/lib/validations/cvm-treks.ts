import { z } from "zod";
import { departFenetreSchema, nbVoyageursSchema } from "./common";

/**
 * Funnel CVM · Treks Aventure — gabarit maquette 2026-07-07 :
 * Q1 décor (projection), Q2 offre, Q3 période, Q4 voyageurs.
 */

export const cvmTreksOfferSchema = z.object({
  offreDuree: z.enum(["10_jours", "15_jours"], "Merci de choisir une formule."),
});

export const cvmTreksQualificationSchema = z.object({
  decor: z.enum(
    ["nord", "ouest", "sud", "est", "a_orienter"],
    "Merci de choisir une réponse.",
  ),
  departFenetre: departFenetreSchema,
  nbVoyageurs: nbVoyageursSchema,
});

export type CvmTreksQualification = z.infer<typeof cvmTreksQualificationSchema>;
