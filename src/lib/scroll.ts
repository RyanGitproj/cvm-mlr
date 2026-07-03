/**
 * Défilement vers un élément en respectant prefers-reduced-motion :
 * fluide par défaut, saut direct si l'utilisateur a réduit les animations.
 * (Client uniquement — scrollIntoView ne lit pas la préférence tout seul.)
 */
export function scrollToElement(target: HTMLElement) {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  target.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
}
