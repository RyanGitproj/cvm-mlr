import { z } from "zod";
import "./common"; // charge z.config(z.locales.fr()) avant usage des messages

/**
 * Coordonnées collectées dans le sas d'entrée puis relues depuis le tampon au
 * submit final. Ce socle reste partagé par le resolver client et la validation
 * serveur du parcours complet. `nom` est obligatoire ; `prenom` facultatif
 * (minimum 2 caractères lorsqu'il est renseigné).
 */
export const contactCoreSchema = z.object({
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
  // RGPD simplifié (décision Ryan 2026-07-07 soir) : UNE case obligatoire
  // qui couvre l'utilisation des données pour préparer le voyage et le
  // recontact — les anciennes cases brochure/conseils sont fusionnées.
  consentement: z.literal(true, {
    error: "Votre consentement est nécessaire pour envoyer votre demande.",
  }),
  // Newsletter : seule case facultative, jamais pré-cochée.
  optinNewsletter: z.boolean().optional(),
});

/**
 * Données de clôture MLR. Le mois de départ précis reste facultatif lorsqu'il
 * est fourni par un ancien brouillon ou un autre point d'entrée.
 */
export const mlrContactSchema = contactCoreSchema.extend({
  moisDepart: z.string().max(100, "100 caractères maximum.").optional(),
});

export type MlrContactData = z.infer<typeof mlrContactSchema>;
