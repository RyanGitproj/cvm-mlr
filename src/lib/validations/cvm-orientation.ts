import { z } from "zod";
import { departFenetreSchema, nbVoyageursPrecisionSchema, nbVoyageursSchema } from "./common";

/**
 * Funnel CVM · Orientation — aiguillage (pas d'offre à prix) :
 * Q1 voyage en tête, Q2 période, Q3 voyageurs (gabarit 2026-07-07).
 * La sortie recommande un des 4 univers. L'option « autre » a été retirée
 * le 07-07 au soir (demande Ryan) : chaque intention désigne un univers.
 */

export const cvmOrientationOfferSchema = z.object({});

export const cvmOrientationQualificationSchema = z.object({
  intention: z.enum(
    ["explorer", "treks", "iles", "un_mois"],
    "Merci de choisir une réponse.",
  ),
  departFenetre: departFenetreSchema,
  nbVoyageurs: nbVoyageursSchema,
  nbVoyageursPrecision: nbVoyageursPrecisionSchema,
});

export type CvmOrientationQualification = z.infer<
  typeof cvmOrientationQualificationSchema
>;
