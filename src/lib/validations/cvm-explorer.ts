import { z } from "zod";
import { cvmBudgetValues, precision } from "./common";

/**
 * Funnel CVM · Expédition Explorer (brief §13.2) — questionnaire long,
 * très qualifiant. L'âge et les acceptations (certificat / briefing) sont
 * collectés en étape 2 (qualification), pas au contact minimal de l'étape 1.
 */

/** Étape 1 — choix de formule (12 ou 15 jours, ou conseil). */
export const cvmExplorerOfferSchema = z.object({
  offreDuree: z.enum(
    ["12_jours", "15_jours", "a_conseiller"],
    "Merci de choisir une formule.",
  ),
});

/** Étape 2 — qualification commerciale (sans contact ni offre). */
export const cvmExplorerQualificationSchema = z.object({
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
  // Horizon de départ (réponse guidée) — renommé pour ne pas entrer en
  // collision avec le champ `periode` (texte libre) du contact.
  horizon: z.enum(
    ["2_4_mois", "4_6_mois", "6_10_mois", "1_an_plus", "precise"],
    "Merci de choisir une période.",
  ),
  horizonPrecision: precision(),
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

export type CvmExplorerQualification = z.infer<
  typeof cvmExplorerQualificationSchema
>;
