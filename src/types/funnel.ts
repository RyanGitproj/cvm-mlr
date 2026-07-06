import type { Brand, FunnelType } from "./lead";

export type ChoiceOption = {
  value: string;
  label: string;
  /**
   * Option « Autre — je précise » : révèle un champ texte libre lié au
   * champ `${name}Precision` du schéma Zod du funnel.
   */
  freeText?: boolean;
};

type QuestionBase = {
  /** Identifiant stable d'étape, tracking-ready (step_budget, step_route…). */
  id: string;
  /** Nom du champ dans le schéma Zod. */
  name: string;
  /** Question affichée (une seule décision principale par écran). */
  question: string;
  /** Contexte ou réassurance affiché sous la question. */
  hint?: string;
  /** Message réglementaire affiché sous les réponses. */
  message?: string;
  options: ChoiceOption[];
};

/** Question à choix unique — 4 réponses guidées + 1 réponse libre. */
export type RadioStep = QuestionBase & { kind: "radio" };

/** Question à sélection multiple (santé Explorer). */
export type MultiStep = QuestionBase & { kind: "multi" };

export type Acceptance = {
  name: "acceptCertificat" | "acceptBriefing";
  label: string;
};

/** Métadonnées communes d'un écran sans champ à options. */
type ScreenBase = {
  id: string;
  question: string;
  hint?: string;
  message?: string;
};

/**
 * Choix d'offre (étape 1) — champ inline de l'écran unique, au-dessus du
 * nombre de participants. Les options tarifaires viennent de offerOptionsFor.
 */
export type OfferStep = ScreenBase;

/** Écran unique de l'étape 1 (coordonnées + offre inline). */
export type ContactStep = ScreenBase;

/** Écran conditions (étape 2, Explorer) — âge facultatif + acceptations. */
export type ConditionsStep = ScreenBase & {
  includeAge?: boolean;
  acceptances: Acceptance[];
};

/** Écran de résumé des réponses de qualification (MLR, fin d'étape 2). */
export type RecapStep = ScreenBase;

export type FunnelConfig = {
  type: FunnelType;
  brand: Brand;
  /** Nom affiché dans le questionnaire (« Treks Aventure »…). */
  label: string;
  intro: {
    titre: string;
    sousTitre: string;
    /** Note tarifaire ou avertissement affiché dès l'entrée. */
    note?: string;
  };
  /** Libellé du CTA d'enregistrement (fin de l'étape 1). */
  ctaStep1: string;
  /** Choix d'offre inline (étape 1) — absent si pas de choix (orientation, un-mois). */
  offer?: OfferStep;
  /** Questions inline avant participants — ex. route MLR (masquée si pré-remplie). */
  preContact?: RadioStep[];
  /** Écran unique de l'étape 1 (coordonnées + offre inline). */
  contact: ContactStep;
  /** Questions de qualification commerciale (étape 2). */
  qualification: (RadioStep | MultiStep)[];
  /** Écran conditions (étape 2) — Explorer uniquement. */
  conditions?: ConditionsStep;
  /** Écran récap final (étape 2) — MLR uniquement. */
  recap?: RecapStep;
};
