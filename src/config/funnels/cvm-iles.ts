import type { FunnelConfig } from "@/types/funnel";
import { NOTE_TARIFAIRE_CVM } from "../brands";
import {
  CVM_FINAL_CASES,
  CVM_STEP_PERIODE,
  CVM_STEP_VOYAGEURS,
} from "./cvm-commun";

/** Funnel CVM · Séjour Collection — gabarit maquette 2026-07-07 (4 étapes). */
export const cvmIlesFunnel: FunnelConfig = {
  type: "cvm_iles",
  brand: "cvm",
  label: "Séjour Collection Plages de rêves & îles paradisiaques",
  intro: {
    titre: "Composez votre Séjour Collection",
    sousTitre:
      "Plages, lagons, détente et confort, de Nosy Be à Sainte-Marie ou en séjour combiné : répondez en moins d'une minute, on compose le reste.",
    note: NOTE_TARIFAIRE_CVM,
  },
  steps: [
    {
      kind: "radio",
      id: "destination",
      name: "destination",
      question: "Quelle destination vous fait rêver ?",
      options: [
        {
          value: "nosy_be",
          label: "Nosy Be et ses îles : lagons, excursions, plages, confort balnéaire",
          image: {
            label: "Lagon de Nosy Be",
            alt: "Lagon turquoise et plages de Nosy Be",
            src: "/images/cvm/iles/destination-nosy-be.png",
          },
        },
        {
          value: "sainte_marie",
          label: "Sainte-Marie : plus sauvage, exotique, historique, ancien univers de pirates",
          image: {
            label: "Sainte-Marie sauvage",
            alt: "Côte sauvage et végétation de l'île Sainte-Marie",
            src: "/images/cvm/iles/destination-sainte-marie.png",
          },
        },
        {
          value: "combine",
          label: "Combiné circuit touristique sécurisé + île de rêve : découverte + repos",
          image: {
            label: "Circuit + île de rêve",
            alt: "Route de découverte puis plage paradisiaque en fin de séjour",
            src: "/images/cvm/iles/destination-combine.png",
          },
        },
        // « La meilleure option selon la saison et mon budget » retirée le
        // 2026-07-07 (demande Ryan — carte creuse dans la grille).
        {
          value: "autre",
          label: "Autre envie — je précise",
          freeText: true,
          image: {
            label: "Autre envie",
            alt: "Voyageuse avec sa valise sur fond lagon avec épingle de destination, pour préciser votre envie",
            src: "/images/cvm/iles/autre-envie.png",
          },
        },
      ],
    },
    {
      kind: "offer",
      id: "offre",
      question: "Quelle formule vous correspond ?",
      hint: "Prix indicatif par personne, hors vol international & assurance.",
    },
    CVM_STEP_PERIODE,
    CVM_STEP_VOYAGEURS,
  ],
  contact: {
    cta: "Recevoir ma proposition",
    hint: "Réponse sous 24 h · proposition personnalisée · hors vol & assurance.",
  },
  final: { cases: CVM_FINAL_CASES },
};
