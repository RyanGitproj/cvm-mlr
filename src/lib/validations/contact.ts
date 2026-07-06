import { z } from "zod";
import "./common"; // charge z.config(z.locales.fr()) avant usage des messages

/**
 * Coordonnées communes (composant b) — étape 1 de tous les funnels.
 * Écrit dans les colonnes indépendantes de `funnel_cvm_mlr_info`. Source unique
 * de vérité, utilisé côté client (zodResolver) ET serveur (safeParse).
 *
 * `nom` est désormais obligatoire ; `prenom` facultatif (min 2 s'il est saisi).
 */
export const contactSchema = z.object({
  nom: z.string().min(2, "Merci d'indiquer votre nom."),
  // Facultatif : un champ vide est traité comme non renseigné (preprocess),
  // sinon min 2 caractères.
  prenom: z.preprocess(
    (value) =>
      typeof value === "string" && value.trim() === "" ? undefined : value,
    z.string().min(2, "Merci d'indiquer au moins 2 caractères.").optional(),
  ),
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
  // Texte libre (« Octobre 2026 ») — commun à tous les funnels.
  periode: z.string().min(1, "Merci d'indiquer votre période de départ."),
  nbVoyageurs: z.coerce
    .number("Merci d'indiquer le nombre de participants.")
    .int("Merci d'indiquer un nombre entier.")
    .min(1, "Merci d'indiquer le nombre de participants (au moins 1).")
    .max(20, "Pour un groupe de plus de 20 participants, contactez-nous directement."),
  commentaire: z.string().max(1000, "1 000 caractères maximum.").optional(),
  // RGPD : case obligatoire.
  consentement: z.literal(true, {
    error: "Votre consentement est nécessaire pour envoyer votre demande.",
  }),
});

export type ContactData = z.infer<typeof contactSchema>;
