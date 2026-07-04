import type { CvmBudget } from "@/lib/validations/common";

/**
 * Lectures des enveloppes budget CVM (brief §13.6) — alimentent uniquement
 * le champ `recommendation` du lead (donnée), jamais une action.
 */
export const BUDGET_LECTURES: Record<CvmBudget, string> = {
  "1800_2200":
    "À qualifier avec prudence — souvent serré pour Explorer ou un mois complet.",
  "2200_2500":
    "Exploitable pour un trek, des îles simples ou un circuit structuré.",
  "2500_3000": "Solide pour Treks, Îles ou Explorer encadré.",
  "3000_plus": "Premium — expériences longues ou très accompagnées.",
  conseil: "Budget à définir — souhaite être conseillé.",
};

/** Niveaux de trek dérivés des réponses (segmentation Treks). */
export const TREKS_NIVEAUX = [
  "decouverte",
  "intermediaire",
  "soutenu",
  "engage",
  "a_orienter",
] as const;

export type TreksNiveau = (typeof TREKS_NIVEAUX)[number];

export const TREKS_NIVEAU_LIBELLES: Record<TreksNiveau, string> = {
  decouverte: "Trek découverte — rythme tranquille, étapes courtes.",
  intermediaire: "Trek intermédiaire — étapes modérées, effort régulier.",
  soutenu: "Trek soutenu — effort physique assumé.",
  engage: "Trek engagé — longues étapes, profil sportif.",
  a_orienter: "Niveau à orienter avec un conseiller.",
};

/** Base de niveau par kilomètres/jour (le dénivelé ajuste ensuite). */
export const TREKS_NIVEAU_PAR_KM: Record<string, TreksNiveau> = {
  "5_8": "decouverte",
  "8_12": "intermediaire",
  "12_18": "soutenu",
  "18_plus": "engage",
};

/** Compatibilités Explorer (segmentation Explorer). */
export const EXPLORER_LIBELLES = {
  compatible: "Profil compatible avec l'expédition, sous certificat médical.",
  a_evaluer: "Profil à évaluer lors de la pré-validation.",
  reorienter:
    "Profil à réorienter — un Trek Aventure encadré correspond probablement mieux.",
} as const;

export type ExplorerCompatibilite = keyof typeof EXPLORER_LIBELLES;

/** Profils roots MLR (segmentation MLR). */
export const MLR_PROFILS = {
  roots_pret: "Prêt pour l'aventure roots — voyage local simple et encadré.",
  roots_a_briefer: "Prêt, avec un briefing clair des règles avant départ.",
  confort_d_abord:
    "Préfère le confort — une expérience Célébration Voyages Madagascar est sans doute plus adaptée.",
  a_conseiller: "Souhaite être conseillé avant de choisir.",
} as const;

export type MlrProfil = keyof typeof MLR_PROFILS;

/** Univers CVM recommandés par le funnel d'orientation. */
export const ORIENTATION_UNIVERS = {
  explorer: {
    libelle: "Expédition insolite & Missions humanitaires",
    href: "/cvm/explorer",
    raison: "Aventure insolite, confort rustique accepté, profil sportif.",
  },
  treks: {
    libelle: "Trek Aventure",
    href: "/cvm/treks",
    raison: "Aventure encadrée et sécurisée, adaptée à votre niveau.",
  },
  iles: {
    libelle: "Séjour Collection Plages de rêves & îles paradisiaques",
    href: "/cvm/iles",
    raison: "Détente, confort et décors paradisiaques.",
  },
  un_mois: {
    libelle: "Grand Tour Madagascar",
    href: "/cvm/un-mois",
    raison: "Immersion culturelle, paysages variés, découverte complète.",
  },
} as const;

export type OrientationUnivers = keyof typeof ORIENTATION_UNIVERS;
