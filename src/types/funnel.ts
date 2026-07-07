import type { Fenetre } from "@/config/segmentation";
import type { Brand, FunnelType } from "./lead";

export type ChoiceOption = {
  value: string;
  label: string;
  /** Phrase d'appui affichée sous le libellé (maquettes boss 2026-07-07). */
  description?: string;
  /**
   * Visuel de la carte-option (Q1 de projection) — placeholder tant que le
   * studio n'a pas livré, cadre réservé dans tous les cas.
   */
  image?: { label: string; alt: string; src?: string };
  /**
   * Libellé du faux bouton de la carte (« Je choisis le Nord ») — décoratif,
   * la carte entière est cliquable (maquettes : un CTA visible par option).
   */
  ctaLabel?: string;
  /**
   * Option « Autre — je précise » : révèle un champ texte libre lié au
   * champ `${name}Precision` du schéma Zod du funnel.
   */
  freeText?: boolean;
};

type QuestionBase = {
  /** Identifiant stable d'étape, tracking-ready (step_route, step_decor…). */
  id: string;
  /** Nom du champ dans le schéma Zod. */
  name: string;
  /** Question affichée (une seule décision principale par écran). */
  question: string;
  /** Contexte ou réassurance affiché sous la question. */
  hint?: string;
  /** Message réglementaire ou informatif affiché sous les réponses. */
  message?: string;
  options: ChoiceOption[];
};

/**
 * Question à choix unique — le wizard avance automatiquement au clic sur une
 * option, sauf option `freeText` ou présence de `confirm` (bouton explicite).
 */
export type RadioStep = QuestionBase & {
  kind: "radio";
  /**
   * Case de confirmation obligatoire + CTA explicite (Q4 MLR : compréhension
   * des exclusions). Sa présence désactive l'avance automatique de l'écran.
   */
  confirm?: { name: string; label: string; cta: string };
};

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
 * Écran de choix d'offre (Q2 du gabarit) — options tarifaires dérivées de
 * `offerOptionsFor`. MLR : carte de réorientation vers CVM en 3ᵉ choix
 * (simple lien, rien en base).
 */
export type OfferWizardStep = ScreenBase & {
  kind: "offer";
  reorientation?: {
    label: string;
    hint?: string;
    href: string;
    cta: string;
    /** Vignette de la carte (maquette 3 : aperçu de l'univers visé). */
    image?: { label: string; alt: string; src?: string };
  };
};

/** Écran de décision du wizard — un par écran, barre « Étape X/N ». */
export type WizardStep = RadioStep | OfferWizardStep;

/** Écran coordonnées — dernier écran de saisie, submit unique du parcours. */
export type ContactStep = ScreenBase & {
  /** Jeu de champs affiché : coordonnées CVM (socle) ou MLR (maquette 6). */
  variant: "cvm" | "mlr";
  /** Libellé du CTA d'envoi (« Recevoir ma route »…). */
  cta: string;
  /** Acceptations réglementaires (Explorer : certificat + briefing). */
  conditions?: { acceptances: Acceptance[] };
};

export type SuiteCta = {
  label: string;
  /** Choix enregistré en base (`answers.suite`) au clic. */
  suite: "rdv" | "brochure";
};

/** Cas de l'écran final, sélectionné par la fenêtre de départ (Q3). */
export type FinalCase = {
  titre: string;
  texte: string;
  /** Piliers de réassurance affichés entre le texte et les CTA. */
  piliers?: string[];
  reassurance?: string;
  primary: SuiteCta;
  secondary: SuiteCta;
};

/** Écran final in-funnel, affiché après l'enregistrement du lead. */
export type FunnelFinal = {
  cases: Record<Fenetre, FinalCase>;
  /** Orientation : affiche l'univers recommandé au-dessus des CTA. */
  universRecommande?: boolean;
};

export type FunnelConfig = {
  type: FunnelType;
  brand: Brand;
  /** Nom affiché dans le questionnaire (« Trek Aventure »…). */
  label: string;
  intro: {
    titre: string;
    sousTitre: string;
    /** Note tarifaire ou avertissement affiché dès l'entrée. */
    note?: string;
  };
  /** Écrans de décision, dans l'ordre du parcours (avant les coordonnées). */
  steps: WizardStep[];
  contact: ContactStep;
  final: FunnelFinal;
};
