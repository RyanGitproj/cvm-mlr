/**
 * Libellés, CTA et repères tarifaires des deux marques — jamais de nombre
 * magique ni de texte dupliqué dans les composants.
 */

export const NOTE_TARIFAIRE_CVM =
  "Votre enveloppe concerne l'expérience sur place à Madagascar. Le billet d'avion international et l'assurance voyage ne sont pas inclus.";

export const NOTE_TARIFAIRE_MLR =
  "Hors vols internationaux. Budget quotidien sur place : environ 45 à 75 € par jour (repas, extras, petites dépenses).";

export const cvmBrand = {
  slug: "cvm",
  nom: "Célébrations Voyages Madagascar",
  baseline: "Vous gardez l'émotion, nous gérons la logistique.",
  positionnement:
    "Agence locale, encadrée, rassurante. Organisation complète, premium accessible.",
  ctaPrincipal: "Trouver mon expérience",
  pricing: "2 000 € – 5 300 € sur place, selon l'expérience et la durée",
} as const;

export const mlrBrand = {
  slug: "mlr",
  nom: "Madagascar Liberty Roots",
  // Libellé des brochures officielles (bandeau sous le logo, 4 routes +
  // fiches devis). Les maquettes 8-visuels disent « Voyagez autrement,
  // vivez vrai » — dérive de maquette, les brochures font foi (Ryan
  // 2026-07-04). Affichée sous le header et en pied de page MLR.
  baseline: "Voyager autrement, vivre l'essentiel",
  positionnement:
    "Aventure, liberté, immersion, roots. Libre mais encadré, sécurité terrain.",
  ctaPrincipal: "Recevoir mon itinéraire Liberty",
  pricing: "Road trip 10 jours dès 1 400 € · 15 jours dès 1 800 €",
  signature: "Une marque opérée par Célébrations Voyages Madagascar",
} as const;

/**
 * Les deux univers du funnel (directive boss 2026-07) — jamais de liens de
 * routes ou de FAQ dans la nav. La page mère les affiche tous les deux ;
 * à l'intérieur d'un univers, `navFor` masque la marque concurrente (voir
 * ci-dessous, directive Ryan 2026-07-09 qui abroge « toujours les deux »).
 */
export const NAV_DEUX_UNIVERS: { href: string; label: string }[] = [
  { href: "/cvm", label: cvmBrand.nom },
  { href: "/mlr", label: mlrBrand.nom },
];

/**
 * Navigation par univers (directive Ryan 2026-07-09) : la page mère montre
 * les deux univers ; à l'intérieur d'un univers, on masque le lien de la
 * marque concurrente pour ne pas disperser le visiteur (le logo ramène
 * toujours à la page mère).
 */
export function navFor(theme: "mere" | "cvm" | "mlr"): typeof NAV_DEUX_UNIVERS {
  if (theme === "cvm") return NAV_DEUX_UNIVERS.filter((l) => l.href !== "/mlr");
  if (theme === "mlr") return NAV_DEUX_UNIVERS.filter((l) => l.href !== "/cvm");
  return NAV_DEUX_UNIVERS;
}

/** Réassurance commune de la page mère (brief §6.1). */
export const REASSURANCE_COMMUNE = [
  { titre: "Réponse rapide", texte: "Un retour sous 24 h ouvrées." },
  { titre: "Proposition personnalisée", texte: "Un projet construit sur vos réponses." },
  { titre: "Accompagnement dédié", texte: "Un interlocuteur qui suit votre projet." },
  { titre: "Opérateur local", texte: "Une équipe présente sur le terrain malgache." },
] as const;
