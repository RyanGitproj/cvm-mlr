import { z } from "zod";
import { departFenetreSchema, nbVoyageursPrecisionSchema, nbVoyageursSchema, precision } from "./common";

/**
 * Funnel CVM · Grand Tour Madagascar — gabarit maquette 2026-07-07 :
 * Q1 objectif du Grand Tour (projection de vie), Q2 formule unique
 * (carte à prix), Q3 période, Q4 voyageurs.
 */

export const cvmUnMoisOfferSchema = z.object({
  offreDuree: z.enum(["un_mois"], "Merci de confirmer la formule."),
});

export const cvmUnMoisQualificationSchema = z.object({
  objectifMois: z.enum(
    ["decouverte", "expatriation", "creation_societe", "retraite", "autre"],
    "Merci de choisir une réponse.",
  ),
  objectifMoisPrecision: precision(),
  departFenetre: departFenetreSchema,
  nbVoyageurs: nbVoyageursSchema,
  nbVoyageursPrecision: nbVoyageursPrecisionSchema,
});

export type CvmUnMoisQualification = z.infer<
  typeof cvmUnMoisQualificationSchema
>;
