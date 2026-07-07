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
 * Nombre de voyageurs — Q4 de tous les funnels. « plus » (Plus de 4)
 * révèle un champ nombre « environ combien ? » : l'effectif réel est
 * stocké en base, plus de plancher indicatif (décision Ryan 2026-07-07).
 */
export const NB_VOYAGEURS = ["1", "2", "3", "4", "plus"] as const;

export const nbVoyageursSchema = z.enum(
  NB_VOYAGEURS,
  "Merci d'indiquer le nombre de voyageurs.",
);

/**
 * Effectif approximatif du groupe, saisi quand « Plus de 4 » est choisi.
 * Optionnel ici : l'obligation conditionnelle est portée par
 * `exigeEffectifGroupe` au niveau du schéma complet. Bornes alignées sur la
 * contrainte SQL (`nb_voyageurs between 1 and 20`).
 */
export const nbVoyageursPrecisionSchema = z.preprocess(
  // Input nombre vide → champ non renseigné (et non 0).
  (value) => (typeof value === "string" && value.trim() === "" ? undefined : value),
  z.coerce
    .number("Merci d'indiquer un nombre.")
    .int("Merci d'indiquer un nombre entier.")
    .min(5, "Au moins 5 — sinon, choisissez une carte au-dessus.")
    .max(20, "20 maximum — au-delà, parlons-en de vive voix.")
    .optional(),
);

export const MESSAGE_EFFECTIF_GROUPE =
  "Merci d'indiquer environ combien vous serez.";

/**
 * « Plus de 4 » sans effectif saisi → erreur sur le champ de précision.
 * Posé sur le schéma complet (submit final + serveur) ; un refinement
 * d'objet ne tournant que si le parse de base réussit, l'écran Q4 applique
 * la même règle via sa garde locale (LeadFunnel) pendant le parcours.
 */
export function exigeEffectifGroupe(
  data: { nbVoyageurs?: unknown; nbVoyageursPrecision?: unknown },
  ctx: z.RefinementCtx,
): void {
  if (data.nbVoyageurs === "plus" && data.nbVoyageursPrecision === undefined) {
    ctx.addIssue({
      code: "custom",
      path: ["nbVoyageursPrecision"],
      message: MESSAGE_EFFECTIF_GROUPE,
    });
  }
}
