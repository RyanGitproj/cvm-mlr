/**
 * Liste centralisée des routes publiques — consommée par le sitemap
 * et documentée dans le CLAUDE.md du projet.
 */
export const publicRoutes = [
  "/",
  "/cvm",
  "/cvm/explorer",
  "/cvm/treks",
  "/cvm/iles",
  "/cvm/un-mois",
  // Orientation hors sitemap depuis le retrait de ses CTA (Ryan 2026-07-13) :
  // la page reste accessible par URL directe — décommenter pour la réindexer.
  // "/cvm/orientation/questionnaire",
  "/mlr",
  "/mlr/nord",
  "/mlr/ouest",
  "/faq",
  "/mentions-legales",
  "/confidentialite",
] as const;
