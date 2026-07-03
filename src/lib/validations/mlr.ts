import { z } from "zod";
import { commonLeadSchema, precision } from "./common";

/**
 * Funnel MLR — parcours unique en 7 étapes (brief §13.5).
 * La route (Nord/Sud/Est/Ouest) est l'étape 2, une réponse du formulaire —
 * jamais un sous-funnel. Pas de question transport ni hébergement :
 * confirmé par les brochures (taxi-brousse inclus, hôtels non inclus).
 */
export const mlrSchema = commonLeadSchema.extend({
  duree: z.enum(
    ["10_jours", "15_jours", "a_conseiller"],
    "Merci de choisir une durée.",
  ),
  route: z.enum(
    ["nord", "sud", "est", "ouest", "a_orienter"],
    "Merci de choisir une route.",
  ),
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

export type MlrLead = z.infer<typeof mlrSchema>;
