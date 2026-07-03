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

/** Champs additionnels de l'étape coordonnées (prénom/tél/email toujours présents). */
export type ContactField = "periode" | "nbVoyageurs" | "age" | "commentaire";

export type Acceptance = {
  name: "acceptCertificat" | "acceptBriefing";
  label: string;
};

export type ContactStep = {
  kind: "contact";
  id: string;
  question: string;
  hint?: string;
  message?: string;
  fields: ContactField[];
  acceptances?: Acceptance[];
};

/** Écran de résumé des réponses (MLR, étape 6/7) — pas une question. */
export type RecapStep = {
  kind: "recap";
  id: string;
  question: string;
  hint?: string;
  message?: string;
};

export type FunnelStep = RadioStep | MultiStep | ContactStep | RecapStep;

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
  /** Libellé du CTA de soumission finale. */
  cta: string;
  steps: FunnelStep[];
};
