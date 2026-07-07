import { z } from "zod";
import { departFenetreSchema, nbVoyageursPrecisionSchema, nbVoyageursSchema, precision } from "./common";

/**
 * Funnel CVM · Expédition Explorer — gabarit maquette 2026-07-07 :
 * Q1 terrain d'expédition (zones brochure p.6 — remplace la question
 * bivouac le 07-07 au soir, demande Ryan), Q2 offre, Q3 période,
 * Q4 voyageurs.
 */

export const cvmExplorerOfferSchema = z.object({
  offreDuree: z.enum(["12_jours", "15_jours"], "Merci de choisir une formule."),
});

export const cvmExplorerQualificationSchema = z.object({
  terrain: z.enum(
    ["jungles", "canyons", "plateaux", "autre"],
    "Merci de choisir une réponse.",
  ),
  terrainPrecision: precision(),
  departFenetre: departFenetreSchema,
  nbVoyageurs: nbVoyageursSchema,
  nbVoyageursPrecision: nbVoyageursPrecisionSchema,
});

export type CvmExplorerQualification = z.infer<
  typeof cvmExplorerQualificationSchema
>;
