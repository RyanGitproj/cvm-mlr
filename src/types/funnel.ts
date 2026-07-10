import type { Fenetre } from "@/config/segmentation";
import type { Brand, FunnelType } from "./lead";

/**
 * Visuel d'une carte : motif placeholder tant que `src` est absent (cadre
 * réservé dans tous les cas). `mobileSrc`, s'il est fourni, remplace `src`
 * sous le breakpoint `sm` (art-direction) — évite le rognage d'un paysage
 * large dans une vignette étroite sur mobile, source de flou.
 */
export type MediaImage = {
  label: string;
  alt: string;
  src?: string;
  mobileSrc?: string;
};

export type ChoiceOption = {
  value: string;
  label: string;
  /** Phrase d'appui affichée sous le libellé (maquettes boss 2026-07-07). */
  description?: string;
  /**
   * Visuel de la carte-option (Q1 de projection) — placeholder tant que le
   * studio n'a pas livré, cadre réservé dans tous les cas.
   */
  image?: MediaImage;
  /**
   * Option qui révèle un champ de précision (`${name}Precision`) et exige
   * le bouton « Continuer » au lieu de l'avance automatique : « Autre — je
   * précise » (texte libre) ou « Plus de 4 » (effectif du groupe).
   */
  freeText?: boolean;
  /**
   * Rend le champ de précision numérique (« Plus de 4 » → « environ
   * combien ? ») au lieu du texte libre par défaut.
   */
  precisionInput?: {
    label: string;
    placeholder?: string;
    min: number;
    max: number;
  };
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
  /**
   * Message réglementaire ou informatif affiché sous les réponses — un
   * paragraphe par entrée du tableau (Q4 MLR : rappel des inclusions puis
   * info exclusions, simple texte depuis le 2026-07-09).
   */
  message?: string | string[];
  options: ChoiceOption[];
};

/**
 * Question à choix unique — le wizard avance automatiquement au clic sur une
 * option, sauf option `freeText` (bouton explicite).
 */
export type RadioStep = QuestionBase & {
  kind: "radio";
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
    image?: MediaImage;
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
};

export type SuiteCta = {
  label: string;
  /** Choix enregistré en base (colonne `suite`) au clic. */
  suite: "rdv" | "brochure";
};

/** Cas de l'écran final, sélectionné par la fenêtre de départ (Q3). */
export type FinalCase = {
  titre: string;
  texte: string;
  /** Piliers de réassurance affichés entre le texte et le CTA. */
  piliers?: string[];
  reassurance?: string;
  /**
   * CTA de suite unique. Les boutons brochure ont été retirés le 2026-07-10
   * (décision Ryan) : la brochure part automatiquement via l'automatisation
   * aval dès l'enregistrement, il n'y a plus rien à demander.
   */
  cta: SuiteCta;
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
