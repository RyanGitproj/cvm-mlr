import type { FunnelConfig } from "@/types/funnel";
import { NOTE_TARIFAIRE_CVM } from "../brands";
import {
  CVM_FINAL_CASES,
  CVM_STEP_PERIODE,
  CVM_STEP_VOYAGEURS,
} from "./cvm-commun";

/** Funnel CVM · Treks Aventure — gabarit maquette 2026-07-07 (4 étapes). */
export const cvmTreksFunnel: FunnelConfig = {
  type: "cvm_treks",
  brand: "cvm",
  label: "Trek Aventure",
  intro: {
    titre: "Composez votre Trek Aventure",
    sousTitre:
      "L'aventure encadrée, à l'intensité maîtrisée. Répondez en moins d'une minute : nous préparons un itinéraire adapté, pas une offre générique.",
    note: NOTE_TARIFAIRE_CVM,
  },
  steps: [
    {
      kind: "radio",
      id: "decor",
      name: "decor",
      question: "Quel grand décor vous fait rêver ?",
      options: [
        {
          value: "nord",
          label: "Nord : Diego, reliefs puissants, îles et extension Nosy Be possible",
          image: {
            label: "Reliefs du Nord — Diego",
            alt: "Reliefs puissants et mer turquoise autour de Diego-Suarez",
            src: "/images/cvm/treks/decor-nord.png",
          },
        },
        {
          value: "ouest",
          label: "Ouest : baobabs, pistes, Morondava, grands espaces et aventure encadrée",
          image: {
            label: "Baobabs de l'Ouest",
            alt: "Allée des baobabs et pistes de l'Ouest malgache",
            src: "/images/cvm/treks/decor-ouest.png",
          },
        },
        {
          value: "sud",
          label: "Sud / Sud-Ouest : Makay, canyons, zones arides, Tuléar et fin de parcours plage",
          image: {
            label: "Massif du Makay",
            alt: "Canyons et zones arides du massif du Makay",
            src: "/images/cvm/treks/decor-sud.png",
          },
        },
        {
          value: "est",
          label: "Est : jungle, végétation dense, ambiance sauvage et Sainte-Marie",
          image: {
            label: "Jungle de l'Est",
            alt: "Végétation dense et sauvage de la côte Est",
            src: "/images/cvm/treks/decor-est.png",
          },
        },
        {
          value: "a_orienter",
          label: "Je ne sais pas encore — je veux être orienté",
          image: {
            label: "Conseil d'un expert",
            alt: "Couple lisant une carte près d'un 4x4 sur fond vert — être orienté vers la bonne route",
            src: "/images/cvm/treks/etre-oriente.png",
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
    id: "coordonnees",
    variant: "cvm",
    cta: "Enregistrer mes coordonnées",
    question: "Vos coordonnées",
    hint: "Réponse sous 24 h · proposition personnalisée · hors vol & assurance.",
  },
  final: { cases: CVM_FINAL_CASES },
};
