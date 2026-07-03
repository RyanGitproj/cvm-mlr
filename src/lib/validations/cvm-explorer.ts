import { z } from "zod";
import { commonLeadSchema, cvmBudgetValues, precision } from "./common";

/**
 * Funnel CVM · Expédition Explorer (brief §13.2) — questionnaire long,
 * très qualifiant. La période (question 11) alimente le champ commun
 * `periode` ; l'âge est optionnel (« si utile commercialement »).
 */
export const cvmExplorerSchema = commonLeadSchema.extend({
  budget: z.enum(cvmBudgetValues, "Merci de choisir une enveloppe budget."),
  capaciteMarche: z.enum(
    ["moins_10", "10_15", "15_20", "20_25", "autre"],
    "Merci de choisir une réponse.",
  ),
  capaciteMarchePrecision: precision(),
  terrainDifficile: z.enum(
    ["sentiers_stables", "irregulier", "aride", "humide", "autre"],
    "Merci de choisir une réponse.",
  ),
  terrainDifficilePrecision: precision(),
  bivouac: z.enum(
    [
      "oui_pleinement",
      "oui_liste_materiel",
      "jamais_teste",
      "besoin_confort",
      "autre",
    ],
    "Merci de choisir une réponse.",
  ),
  bivouacPrecision: precision(),
  sante: z
    .array(
      z.enum(["allergies", "articulaire", "cardiaque_respiratoire", "aucun", "autre"]),
    )
    .min(1, "Merci de sélectionner au moins une réponse."),
  santePrecision: precision(),
  certificat: z.enum(
    ["oui_recent", "rdv_a_prendre", "infos_medecin", "pas_certain", "autre"],
    "Merci de choisir une réponse.",
  ),
  certificatPrecision: precision(),
  faune: z.enum(
    [
      "respecte_consignes",
      "impressionnable_encadre",
      "forte_apprehension",
      "pas_exposition",
      "autre",
    ],
    "Merci de choisir une réponse.",
  ),
  faunePrecision: precision(),
  motivation: z.enum(
    [
      "rencontrer_comprendre",
      "action_utile",
      "observer_documenter",
      "explorer_respect",
      "autre",
    ],
    "Merci de choisir une réponse.",
  ),
  motivationPrecision: precision(),
  discipline: z.enum(
    [
      "respecte_consignes",
      "accepte_changement",
      "groupe_solidaire",
      "besoin_briefing",
      "autre",
    ],
    "Merci de choisir une réponse.",
  ),
  disciplinePrecision: precision(),
  materiel: z.enum(
    ["equipe", "partiel", "besoin_liste", "pas_equipe", "autre"],
    "Merci de choisir une réponse.",
  ),
  materielPrecision: precision(),
  // Question 11 « Période » : réponse guidée qui remplit le champ commun.
  periode: z.enum(
    ["2_4_mois", "4_6_mois", "6_10_mois", "1_an_plus", "precise"],
    "Merci de choisir une période.",
  ),
  periodePrecision: precision(),
  age: z.preprocess(
    (value) => (value === "" || value === null ? undefined : value),
    z.coerce
      .number("Merci d'indiquer un âge valide.")
      .int("Merci d'indiquer un âge valide.")
      .min(16, "L'expédition est réservée aux adultes.")
      .max(99, "Merci d'indiquer un âge valide.")
      .optional(),
  ),
  acceptCertificat: z.literal(true, {
    error: "L'acceptation du principe de certificat médical est requise.",
  }),
  acceptBriefing: z.literal(true, {
    error: "L'acceptation du briefing sécurité est requise.",
  }),
});

export type CvmExplorerLead = z.infer<typeof cvmExplorerSchema>;
