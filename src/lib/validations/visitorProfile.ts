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
  // Projet actuel : conservé dans le profil et dans `temperature` côté tampon.
  // Il n'influence pas encore la qualification des funnels.
  intention: z.enum(
    [
      "preparation_active",
      "comparaison_destinations",
      "recherche_informations",
      "curiosite",
    ],
    { error: "Choisissez le projet qui vous correspond le mieux." },
  ),
  // Horizon indicatif enregistré dans `depart_prevue` côté tampon, sans
  // influencer pour le moment la qualification du funnel final.
  echeance: z.enum(
    [
      "moins_3_mois",
      "3_6_mois",
      "6_10_mois",
      "plus_1_an",
      "sans_date",
    ],
    { error: "Indiquez quand vous pensez partir." },
  ),
  consentement: z.boolean().refine((value) => value, {
    message: "Votre consentement est nécessaire pour poursuivre.",
  }),
});

export type VisitorProfile = z.infer<typeof visitorProfileSchema>;
