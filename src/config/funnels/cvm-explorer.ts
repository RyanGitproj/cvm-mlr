import type { FunnelConfig } from "@/types/funnel";
import {
  CVM_FINAL_CASES,
  CVM_STEP_PERIODE,
  CVM_STEP_VOYAGEURS,
} from "./cvm-commun";

/**
 * Funnel CVM · Expédition Explorer — gabarit maquette 2026-07-07 (4 étapes).
 * Règles de texte : jamais de devis ferme, pré-qualification (pas d'avis
 * médical), ne pas glorifier le danger.
 */
export const cvmExplorerFunnel: FunnelConfig = {
  type: "cvm_explorer",
  brand: "cvm",
  label: "Expédition insolite & Missions humanitaires",
  intro: {
    titre: "Expédition insolite & Missions humanitaires",
    sousTitre:
      "Cette expédition n'est pas adaptée à tout le monde. Quatre réponses suffisent pour vérifier que l'expédition est faite pour vous.",
    note: "Participation soumise à validation physique, médicale et logistique. Certificat médical obligatoire. Prix hors billet d'avion et assurance.",
  },
  steps: [
    {
      // Q1 de projection « choix d'endroit » (demande Ryan 07-07 soir) :
      // zones d'expédition de la brochure p.6 (« jungles profondes,
      // canyons, plateaux retirés »), corroborées par la question terrain
      // de la mission Riane. L'ancienne question bivouac est posée par
      // les commerciaux (TODO.md) ; la réalité bivouac reste en hint.
      kind: "radio",
      id: "terrain",
      name: "terrain",
      question: "Quel terrain d'expédition vous appelle ?",
      hint: "Bivouac permanent — deux nuits d'hôtel seulement, le reste sur le terrain.",
      options: [
        {
          value: "jungles",
          label: "Jungles profondes",
          description: "Zones humides, denses, difficiles d'accès",
          image: {
            label: "Zone humide dense",
            alt: "Progression le long d'une rivière ferrugineuse bordée de pandanus",
            src: "/images/cvm/explorer/riviere-rouge-pandanus.jpg",
          },
        },
        {
          value: "canyons",
          label: "Canyons",
          description: "Zones arides, chaleur et effort prolongé",
          image: {
            label: "Traversée aride",
            alt: "Marcheurs dans un canyon aride du Sud malgache",
            src: "/images/cvm/explorer/traversee-canyon-aride.jpg",
          },
        },
        {
          value: "plateaux",
          label: "Plateaux retirés",
          description: "Hors des sentiers, là où peu de voyageurs vont",
          image: {
            label: "Guides & lecture du terrain",
            alt: "Guide local indiquant la direction dans la savane",
            src: "/images/cvm/explorer/guide-lecture-terrain.jpg",
          },
        },
        { value: "autre", label: "Autre terrain — je précise", freeText: true },
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
    message:
      "Cette demande ne confirme pas la participation. Elle permet de vérifier le profil, la motivation et les conditions nécessaires à une expédition sécurisée.",
  },
  final: { cases: CVM_FINAL_CASES },
};
