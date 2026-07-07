import type { Fenetre } from "@/config/segmentation";
import type { FinalCase, RadioStep } from "@/types/funnel";

/**
 * Écrans communs des funnels CVM — gabarit maquette boss 2026-07-07
 * transposé au vouvoiement (le wizard MLR garde ses textes tutoyés).
 * Q3 période et Q4 voyageurs sont identiques pour les 5 funnels CVM.
 */

export const CVM_STEP_PERIODE: RadioStep = {
  kind: "radio",
  id: "depart_fenetre",
  name: "departFenetre",
  question: "Quand sentez-vous que Madagascar vous appelle ?",
  hint: "Plus votre départ approche, plus il est utile de préparer l'itinéraire et les vols au bon moment.",
  message:
    "Réserver plus tôt = plus de choix et souvent de meilleurs prix sur les vols.",
  options: [
    { value: "0_2", label: "0 à 2 mois", description: "Je veux partir très bientôt" },
    { value: "2_4", label: "2 à 4 mois", description: "Je m'organise sérieusement" },
    { value: "4_6", label: "4 à 6 mois", description: "Le bon moment pour préparer intelligemment" },
    { value: "6_10", label: "6 à 10 mois", description: "Je construis mon projet sans me précipiter" },
    { value: "10_plus", label: "+ de 10 mois", description: "Je veux garder le lien et rêver encore" },
  ],
};

export const CVM_STEP_VOYAGEURS: RadioStep = {
  kind: "radio",
  id: "voyageurs",
  name: "nbVoyageurs",
  question: "Combien de places doit-on garder ?",
  options: [
    { value: "1", label: "Je pars seul" },
    { value: "2", label: "Nous sommes 2" },
    { value: "3", label: "Nous sommes 3" },
    { value: "4", label: "Nous sommes 4" },
    // « Plus de 4 » révèle le champ nombre — l'effectif réel est stocké
    // (décision Ryan 2026-07-07 : plus de plancher indicatif).
    {
      value: "plus",
      label: "Plus de 4",
      freeText: true,
      precisionInput: {
        label: "Combien serez-vous environ ?",
        placeholder: "6",
        min: 5,
        max: 20,
      },
    },
  ],
};

/**
 * Écran final commun CVM — adaptation vouvoyée des cas maquette 7/8. Le cas
 * « construction » n'a pas de maquette : wording repris de la directive,
 * à faire valider par le boss (TODO.md).
 */
export const CVM_FINAL_CASES: Record<Fenetre, FinalCase> = {
  proche: {
    titre: "Votre départ approche : c'est le bon moment pour préparer votre voyage.",
    texte:
      "Un expert malgache peut vous aider à affiner votre projet, anticiper les vols et préparer votre itinéraire sans mauvaise surprise.",
    piliers: [
      "Parler avec un vrai Malgache",
      "Vérifier les vols au bon moment",
      "Préparer votre voyage en confiance",
    ],
    reassurance: "Ce rendez-vous ne vous engage à rien.",
    primary: { label: "Choisir mon créneau avec un expert malgache", suite: "rdv" },
    secondary: { label: "Recevoir d'abord la brochure", suite: "brochure" },
  },
  construction: {
    titre: "Vous êtes dans le bon timing pour construire votre voyage.",
    texte:
      "Vous avez encore le temps de préparer votre projet, mais c'est maintenant que les bons choix commencent : itinéraire, rythme, billets d'avion.",
    reassurance:
      "Vous n'avez pas besoin de tout décider maintenant. Mais vous pouvez déjà choisir la bonne direction.",
    primary: { label: "Recevoir ma brochure + réserver un échange", suite: "rdv" },
    secondary: { label: "Recevoir seulement ma proposition", suite: "brochure" },
  },
  lointain: {
    titre: "Madagascar vous appelle… votre projet a encore le temps de mûrir.",
    texte:
      "Nous vous envoyons la brochure et votre proposition personnalisée. Quand votre départ approchera, nous vous proposerons un échange au bon moment.",
    primary: { label: "Recevoir la brochure et garder le lien", suite: "brochure" },
    secondary: { label: "Je préfère quand même parler à un expert malgache", suite: "rdv" },
  },
};
