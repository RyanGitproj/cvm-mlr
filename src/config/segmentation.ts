/**
 * Fenêtres de départ (directives boss 2026-07-07) — lectures pour l'équipe
 * aval, jamais une action : départ dans 0–6 mois → rendez-vous conseillé ;
 * au-delà → brochure et suivi au bon moment. Communes aux 6 funnels
 * (gabarit maquette : la période de départ est la Q3 de chaque parcours).
 */
export const FENETRES = {
  proche:
    "Départ dans 0 à 6 mois : la préparation se lance maintenant (vols, guide, itinéraire).",
  construction:
    "Départ dans 6 à 10 mois : le bon timing pour construire le projet sans se précipiter.",
  lointain: "Départ dans plus de 10 mois : un projet à mûrir, en gardant le lien.",
} as const;

export type Fenetre = keyof typeof FENETRES;

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
