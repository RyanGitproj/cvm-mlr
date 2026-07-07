import { FENETRES, type Fenetre } from "@/config/segmentation";
import type { DepartFenetre } from "@/lib/validations/common";
import type { Recommendation } from "./types";

const FENETRE_PAR_DEPART: Record<DepartFenetre, Fenetre> = {
  "0_2": "proche",
  "2_4": "proche",
  "4_6": "proche",
  "6_10": "construction",
  "10_plus": "lointain",
};

/** Fenêtre agrégée à partir de la Q3 période — pilote l'écran final. */
export function fenetreFor(departFenetre: DepartFenetre): Fenetre {
  return FENETRE_PAR_DEPART[departFenetre];
}

/**
 * Segmentation commune des 6 funnels (directives boss 2026-07-07) : la
 * fenêtre de départ est la seule entrée — départ dans 0–6 mois →
 * rendez-vous conseillé, 6–10 mois → projet à construire, au-delà → garder
 * le lien. Une donnée pour l'équipe aval, aucune action déclenchée.
 */
export function segmentDepart(data: {
  departFenetre: DepartFenetre;
}): Recommendation {
  const fenetre = fenetreFor(data.departFenetre);
  return { fenetre, libelle: FENETRES[fenetre] };
}
