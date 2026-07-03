/**
 * Sortie du moteur de segmentation : une donnée stockée dans la colonne
 * `recommendation` du lead et éventuellement affichée au visiteur.
 * Jamais un score chiffré, jamais une action déclenchée (brief §1.2).
 */
export type Recommendation = Record<string, string | boolean>;
