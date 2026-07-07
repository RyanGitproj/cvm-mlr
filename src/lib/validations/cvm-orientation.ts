import { z } from "zod";
import { departFenetreSchema, nbVoyageursSchema, precision } from "./common";

/**
 * Funnel CVM · Orientation — aiguillage (pas d'offre à prix) :
 * Q1 voyage en tête, Q2 période, Q3 voyageurs (gabarit 2026-07-07).
 * La sortie recommande un des 4 univers.
 */

export const cvmOrientationOfferSchema = z.object({});

export const cvmOrientationQualificationSchema = z.object({
  intention: z.enum(
    ["explorer", "treks", "iles", "un_mois", "autre"],
    "Merci de choisir une réponse.",
  ),
  intentionPrecision: precision(),
  departFenetre: departFenetreSchema,
  nbVoyageurs: nbVoyageursSchema,
});

export type CvmOrientationQualification = z.infer<
  typeof cvmOrientationQualificationSchema
>;
