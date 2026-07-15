import type { CSSProperties } from "react";

/**
 * Style de respiration d'une carte du wizard (flag `breathe` des steps
 * Q1/Q2) : vague en quarts de cycle (1.6s) et échelle réduite à 1.015 —
 * les grilles du wizard sont serrées (demi-gap 6px), la croissance par
 * côté (largeur × (scale−1)/2, soit ~4px sur une carte desktop de 550px)
 * doit rester sous le demi-gap pour que rien ne se chevauche (Ryan
 * 2026-07-15). Les pickers hors wizard gardent le 1.03 par défaut de
 * `@keyframes breathe`.
 */
export function wizardBreatheStyle(index: number): CSSProperties {
  return {
    "--breathe-delay": `${index * -0.4}s`,
    "--breathe-scale": "1.015",
  } as CSSProperties;
}
