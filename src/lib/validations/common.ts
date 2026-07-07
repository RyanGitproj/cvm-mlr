import { z } from "zod";

// Messages d'erreur par défaut en français pour tous les schémas.
// Chargé par tous les schémas (contact + qualification) via un import de ce module.
z.config(z.locales.fr());

/** Champ texte « Autre — je précise » accompagnant une réponse guidée. */
export const precision = () =>
  z.string().max(300, "300 caractères maximum.").optional();

/**
 * Fenêtres de départ — Q3 de TOUS les funnels (gabarit maquette boss
 * 2026-07-07). Pilotent la segmentation commune (écran final RDV/brochure).
 */
export const DEPART_FENETRES = [
  "0_2",
  "2_4",
  "4_6",
  "6_10",
  "10_plus",
] as const;

export type DepartFenetre = (typeof DEPART_FENETRES)[number];

export const departFenetreSchema = z.enum(
  DEPART_FENETRES,
  "Merci de choisir une période de départ.",
);

/**
 * Nombre de voyageurs — Q4 de tous les funnels, 4 cartes maquette.
 * « 4 » se libelle « Nous sommes 4 ou plus » (plancher indicatif, le
 * commercial précise pour les grands groupes — décision Ryan 2026-07-07).
 */
export const NB_VOYAGEURS = ["1", "2", "3", "4"] as const;

export const nbVoyageursSchema = z.enum(
  NB_VOYAGEURS,
  "Merci d'indiquer le nombre de voyageurs.",
);
