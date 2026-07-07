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
      "Plages, lagons, détente et confort — Nosy Be, Sainte-Marie ou séjour combiné : répondez en moins d'une minute, on compose le reste.",
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
          ctaLabel: "Je choisis Nosy Be",
          image: {
            label: "Lagon de Nosy Be",
            alt: "Lagon turquoise et plages de Nosy Be",
          },
        },
        {
          value: "sainte_marie",
          label: "Sainte-Marie : plus sauvage, exotique, historique, ancien univers de pirates",
          ctaLabel: "Je choisis Sainte-Marie",
          image: {
            label: "Sainte-Marie sauvage",
            alt: "Côte sauvage et végétation de l'île Sainte-Marie",
          },
        },
        {
          value: "combine",
          label: "Combiné circuit touristique sécurisé + île de rêve : découverte + repos",
          ctaLabel: "Je choisis le combiné",
          image: {
            label: "Circuit + île de rêve",
            alt: "Route de découverte puis plage paradisiaque en fin de séjour",
          },
        },
        {
          value: "selon_saison",
          label: "La meilleure option selon la saison et mon budget",
        },
        { value: "autre", label: "Autre envie — je précise", freeText: true },
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
    id: "coordonnees",
    variant: "cvm",
    cta: "Enregistrer mes coordonnées",
    question: "Vos coordonnées",
    hint: "Réponse sous 24 h · proposition personnalisée · hors vol & assurance.",
  },
  final: { cases: CVM_FINAL_CASES },
};
