import { z } from "zod";

// Messages d'erreur par défaut en français pour tous les schémas.
// Chargé par tous les schémas (contact + qualification) via un import de ce module.
z.config(z.locales.fr());

/** Champ texte « Autre — je précise » accompagnant une réponse guidée. */
export const precision = () =>
  z.string().max(300, "300 caractères maximum.").optional();

/**
 * Enveloppes budget CVM — communes aux 5 funnels CVM, toujours en
 * première question (règle non-négociable des sources).
 */
export const cvmBudgetValues = [
  "1800_2200",
  "2200_2500",
  "2500_3000",
  "3000_plus",
  "conseil",
] as const;

export type CvmBudget = (typeof cvmBudgetValues)[number];
