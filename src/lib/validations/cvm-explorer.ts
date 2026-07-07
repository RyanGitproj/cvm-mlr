import { z } from "zod";
import { departFenetreSchema, nbVoyageursSchema, precision } from "./common";

/**
 * Funnel CVM · Expédition Explorer — gabarit maquette 2026-07-07 :
 * Q1 bivouac (le marqueur de l'expédition), Q2 offre, Q3 période,
 * Q4 voyageurs. Les acceptations réglementaires (certificat médical,
 * briefing sécurité) vivent sur l'écran coordonnées.
 */

export const cvmExplorerOfferSchema = z.object({
  offreDuree: z.enum(["12_jours", "15_jours"], "Merci de choisir une formule."),
});

export const cvmExplorerQualificationSchema = z.object({
  bivouac: z.enum(
    ["oui_pleinement", "oui_liste_materiel", "jamais_teste", "besoin_confort", "autre"],
    "Merci de choisir une réponse.",
  ),
  bivouacPrecision: precision(),
  departFenetre: departFenetreSchema,
  nbVoyageurs: nbVoyageursSchema,
  acceptCertificat: z.literal(true, {
    error: "L'acceptation du certificat médical est nécessaire.",
  }),
  acceptBriefing: z.literal(true, {
    error: "L'acceptation du briefing sécurité est nécessaire.",
  }),
});

export type CvmExplorerQualification = z.infer<
  typeof cvmExplorerQualificationSchema
>;
