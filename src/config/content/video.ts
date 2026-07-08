/**
 * Contenu d'une section vidéo YouTube intégrée à une page (sous la note
 * tarifaire « Bon à savoir »). Le titre et l'accroche sont éditoriaux
 * (compléter ici, jamais dans le composant) ; l'`youtubeId` est le segment
 * qui suit `youtu.be/` ou `?v=` dans l'URL fournie.
 */
export type VideoContent = {
  /** Identifiant YouTube — ex. `NnmBDtqwbrE` pour https://youtu.be/NnmBDtqwbrE. */
  youtubeId: string;
  titre: string;
  /** Accroche neuro-marketing (projection) affichée sous le titre. */
  description: string;
};
