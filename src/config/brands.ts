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
  nom: "Célébration Voyage Madagascar",
  baseline: "On garde l'émotion, nous gérons la logistique.",
  positionnement:
    "Agence locale, encadrée, rassurante. Organisation complète, premium accessible.",
  ctaPrincipal: "Trouver mon expérience",
  pricing: "2 000 € – 5 300 € sur place, selon l'expérience et la durée",
} as const;

export const mlrBrand = {
  slug: "mlr",
  nom: "Madagascar Liberty Routes",
  baseline: "Voyager autrement, vivre l'essentiel.",
  positionnement:
    "Aventure, liberté, immersion, roots. Libre mais encadré, sécurité terrain.",
  ctaPrincipal: "Recevoir mon itinéraire Liberty",
  pricing: "Road trip 10 jours dès 1 442 € · 15 jours dès 1 855 €",
  signature: "Une marque opérée par Célébration Voyages Madagascar",
} as const;

/** Réassurance commune de la page mère (brief §6.1). */
export const REASSURANCE_COMMUNE = [
  { titre: "Réponse rapide", texte: "Un retour sous 24 h ouvrées." },
  { titre: "Proposition personnalisée", texte: "Un projet construit sur vos réponses." },
  { titre: "Accompagnement dédié", texte: "Un interlocuteur qui suit votre dossier." },
  { titre: "Opérateur local", texte: "Une équipe présente sur le terrain malgache." },
] as const;
