import { z } from "zod";

/**
 * Profil demandé dans le sas d'entrée de la page mère.
 * Les transformations `trim` évitent de conserver des espaces accidentels et
 * garantissent que le préremplissage des funnels reste propre.
 */
export const visitorProfileSchema = z.object({
  nom: z
    .string()
    .trim()
    .min(2, "Merci d’indiquer votre nom (2 caractères minimum).")
    .max(80, "Votre nom ne peut pas dépasser 80 caractères."),
  prenom: z
    .string()
    .trim()
    .min(2, "Merci d’indiquer votre prénom (2 caractères minimum).")
    .max(80, "Votre prénom ne peut pas dépasser 80 caractères."),
  email: z
    .string()
    .trim()
    .max(254, "Votre adresse email ne peut pas dépasser 254 caractères.")
    .toLowerCase()
    .pipe(z.email("Merci d’indiquer une adresse email valide.")),
  telephone: z
    .string()
    .min(1, "Merci d’indiquer votre numéro de téléphone.")
    .regex(
      /^\+[1-9]\d{6,14}$/,
      "Merci d’indiquer un numéro de téléphone valide avec son indicatif.",
    ),
  // Indicateur de maturité conservé dans le profil et la table tampon ; il
  // n'influence pas encore la qualification des funnels.
  intention: z.enum(["exploration", "idee_precise", "conseil"], {
    error: "Choisissez la situation qui vous correspond le mieux.",
  }),
  consentement: z.boolean().refine((value) => value, {
    message: "Votre consentement est nécessaire pour poursuivre.",
  }),
});

export type VisitorProfile = z.infer<typeof visitorProfileSchema>;
