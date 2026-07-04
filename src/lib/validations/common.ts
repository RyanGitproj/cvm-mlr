import { z } from "zod";

// Messages d'erreur par défaut en français pour tous les schémas.
z.config(z.locales.fr());

/**
 * Tronc commun de tous les funnels (brief §4.3) — source unique de vérité,
 * utilisé côté client (zodResolver) ET côté serveur (safeParse).
 * Chaque funnel l'étend via `.extend()`.
 */
export const commonLeadSchema = z.object({
  prenom: z.string().min(2, "Merci d'indiquer votre prénom."),
  email: z.email("Merci d'indiquer un email valide."),
  // Numéro au format international E.164 (`+33…`) produit par le champ
  // `PhoneField` (react-phone-number-input). Regex plutôt que libphonenumber
  // pour garder ce schéma partagé client/serveur léger et sans dépendance.
  telephone: z
    .string()
    .min(1, "Merci d'indiquer votre numéro de téléphone.")
    .regex(
      /^\+[1-9]\d{6,14}$/,
      "Merci d'indiquer un numéro de téléphone valide (avec l'indicatif pays).",
    ),
  periode: z.string().min(1, "Merci d'indiquer votre période de départ."),
  nbVoyageurs: z.coerce
    .number("Merci d'indiquer le nombre de voyageurs.")
    .int("Merci d'indiquer un nombre entier.")
    .min(1, "Merci d'indiquer le nombre de voyageurs (au moins 1).")
    .max(20, "Pour un groupe de plus de 20 voyageurs, contactez-nous directement."),
  commentaire: z.string().max(1000, "1 000 caractères maximum.").optional(),
  // RGPD : case obligatoire.
  consentement: z.literal(true, {
    error: "Votre consentement est nécessaire pour envoyer votre demande.",
  }),
});

/** Champ texte « Autre — je précise » accompagnant une réponse guidée. */
export const precision = () =>
  z.string().max(300, "300 caractères maximum.").optional();

/**
 * Enveloppes budget CVM — communes aux 5 funnels CVM, toujours en
 * première question (règle non-négociable des sources).
 */
export const cvmBudgetValues = [
  "1800_2200",
  "2200_2500",
  "2500_3000",
  "3000_plus",
  "conseil",
] as const;

export type CvmBudget = (typeof cvmBudgetValues)[number];
