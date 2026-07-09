import { z } from "zod";
import {
  departFenetreSchema,
  NB_VOYAGEURS,
  nbVoyageursPrecisionSchema,
} from "./common";

/**
 * Funnel MLR — wizard 4 questions (maquettes boss 2026-07-07, vocal comme
 * source d'autorité) : Q1 route (Nord/Ouest — « je ne sais pas encore »
 * retirée le 07-07 au soir, demande Ryan), Q2 durée (offre), Q3 fenêtre de
 * départ, Q4 voyageurs — les exclusions y sont un simple texte d'info (case
 * de compréhension retirée le 2026-07-09, demande Ryan). Le wizard tutoie
 * le lead (phrases du boss) — messages d'erreur compris.
 */
export const mlrWizardSchema = z.object({
  route: z.enum(["nord", "ouest"], "Merci de choisir une route."),
  offreDuree: z.enum(["10_jours", "15_jours"], "Merci de choisir une durée."),
  departFenetre: departFenetreSchema,
  nbVoyageurs: z.enum(
    NB_VOYAGEURS,
    "Merci d'indiquer le nombre de voyageurs.",
  ),
  nbVoyageursPrecision: nbVoyageursPrecisionSchema,
});

export type MlrWizardData = z.infer<typeof mlrWizardSchema>;

/** Choix de suite enregistré depuis l'écran final (colonne `suite`). */
export const mlrSuiteSchema = z.enum(["rdv", "brochure"]);

export type MlrSuite = z.infer<typeof mlrSuiteSchema>;
