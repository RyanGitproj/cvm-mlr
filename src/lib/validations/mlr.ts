import { z } from "zod";
import { departFenetreSchema, NB_VOYAGEURS } from "./common";

/**
 * Funnel MLR — wizard 4 questions (maquettes boss 2026-07-07, vocal comme
 * source d'autorité) : Q1 route (Nord/Ouest + orientation), Q2 durée (offre),
 * Q3 fenêtre de départ, Q4 voyageurs + case de compréhension des exclusions.
 * Le wizard tutoie le lead (phrases du boss) — messages d'erreur compris.
 */
export const mlrWizardSchema = z.object({
  route: z.enum(["nord", "ouest", "a_orienter"], "Merci de choisir une route."),
  offreDuree: z.enum(["10_jours", "15_jours"], "Merci de choisir une durée."),
  departFenetre: departFenetreSchema,
  nbVoyageurs: z.enum(
    NB_VOYAGEURS,
    "Merci d'indiquer le nombre de voyageurs.",
  ),
  comprehension: z.literal(true, {
    error:
      "Merci de confirmer que tu as compris ce qui est inclus et ce qui ne l'est pas.",
  }),
});

export type MlrWizardData = z.infer<typeof mlrWizardSchema>;

/** Choix de suite enregistré depuis l'écran final (answers.suite). */
export const mlrSuiteSchema = z.enum(["rdv", "brochure"]);

export type MlrSuite = z.infer<typeof mlrSuiteSchema>;
