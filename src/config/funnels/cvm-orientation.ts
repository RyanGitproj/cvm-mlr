import type { FunnelConfig } from "@/types/funnel";
import { CVM_UNIVERS } from "@/config/content/cvm";
import { NOTE_TARIFAIRE_CVM } from "../brands";
import {
  CVM_FINAL_CASES,
  CVM_STEP_PERIODE,
  CVM_STEP_VOYAGEURS,
} from "./cvm-commun";

/**
 * Funnel 0 · Orientation CVM — sas d'entrée pour les visiteurs indécis,
 * gabarit maquette 2026-07-07 (3 questions, pas d'offre à prix : c'est un
 * aiguillage). La sortie recommande un des 4 univers sur l'écran final.
 * Les cartes reprennent les visuels des cards de la landing /cvm.
 */
export const cvmOrientationFunnel: FunnelConfig = {
  type: "cvm_orientation",
  brand: "cvm",
  label: "Orientation",
  intro: {
    titre: "Quelle expérience à Madagascar correspond vraiment à votre projet ?",
    sousTitre:
      "Expédition, trek encadré, séjour de rêve ou Grand Tour : trois réponses suffisent — vous recevez la brochure, la vidéo et la proposition faites pour votre profil.",
    note: NOTE_TARIFAIRE_CVM,
  },
  steps: [
    {
      kind: "radio",
      id: "intention",
      name: "intention",
      question: "Quel voyage avez-vous en tête ?",
      options: [
        {
          value: "explorer",
          label: "Une aventure insolite hors des circuits touristiques",
          image: CVM_UNIVERS.explorer.card.image,
        },
        {
          value: "treks",
          label: "Un trek ou circuit aventure encadré et sécurisé",
          image: CVM_UNIVERS.treks.card.image,
        },
        {
          value: "iles",
          label: "Des plages paradisiaques, des îles et un séjour détente",
          image: CVM_UNIVERS.iles.card.image,
        },
        {
          value: "un_mois",
          label: "Un Grand Tour d'un mois pour découvrir Madagascar en profondeur",
          image: CVM_UNIVERS["un-mois"].card.image,
        },
        // « Autre projet — je précise » retirée le 2026-07-07 au soir
        // (demande Ryan) : l'aiguillage se fait entre les 4 univers.
      ],
    },
    CVM_STEP_PERIODE,
    CVM_STEP_VOYAGEURS,
  ],
  contact: {
    id: "coordonnees",
    variant: "cvm",
    cta: "Enregistrer mes coordonnées",
    question: "Vos coordonnées",
    hint: "Réponse sous 24 h · recommandation personnalisée · hors vol & assurance.",
    message:
      "Vous recevrez la brochure, la vidéo et la proposition correspondant à votre profil. Le billet d'avion et l'assurance voyage restent à prévoir séparément.",
  },
  final: { cases: CVM_FINAL_CASES, universRecommande: true },
};
