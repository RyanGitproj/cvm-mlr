import { z } from "zod";
import { precision } from "./common";

/**
 * Funnel MLR — parcours unique (brief §13.5).
 * La durée (10/15 jours) et la route (Nord/Sud/Est/Ouest) sont des choix
 * d'étape 1 (offre + pré-contact) ; la route pré-remplie depuis /mlr/{route}.
 * Pas de question transport ni hébergement (taxi-brousse inclus, hôtels non).
 */

/** Étape 1 — durée (offre) + route (pré-contact, pré-remplie par la page route). */
export const mlrOfferSchema = z.object({
  offreDuree: z.enum(
    ["10_jours", "15_jours", "a_conseiller"],
    "Merci de choisir une durée.",
  ),
  route: z.enum(
    ["nord", "sud", "est", "ouest", "a_orienter"],
    "Merci de choisir une route.",
  ),
});

/** Étape 2 — qualification commerciale (sans contact ni offre). */
export const mlrQualificationSchema = z.object({
  pretRoots: z.enum(
    [
      "oui_local_simple",
      "oui_comprendre_regles",
      "hesite_prefere_confort",
      "veut_conseil",
    ],
    "Merci de choisir une réponse.",
  ),
  securite: z.enum(
    [
      "respecte_consignes",
      "veut_encadrement",
      "experience_terrain",
      "besoin_briefing",
      "autre",
    ],
    "Merci de choisir une réponse.",
  ),
  securitePrecision: precision(),
  // Tranches de l'écran 7/8 du document 8-visuels (budget conseillé 45-75 €/j).
  budgetJour: z.enum(
    ["moins_35", "35_50", "50_75", "plus_75", "conseil"],
    "Merci de choisir une réponse.",
  ),
});

export type MlrQualification = z.infer<typeof mlrQualificationSchema>;
