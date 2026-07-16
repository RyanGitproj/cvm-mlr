import type { MediaImage } from "@/types/funnel";

/**
 * Fond image du footer, une bannière par page (fichiers `2155×370` déjà
 * assombris, `public/images/footer/`). Le footer étant rendu par le layout de
 * groupe (mere/cvm/mlr) et non par la page, la sélection se fait côté client
 * par `pathname` (voir `FooterBackdrop`). Les pages sans entrée dédiée
 * (`/faq`, mentions légales, confidentialité) retombent sur la bannière mère.
 */
const FOOTER_IMAGES: Record<string, MediaImage> = {
  "/": {
    label: "Madagascar",
    alt: "Panneaux Célébrations Voyages et Road Trip, plage au couchant, 4x4 et baobabs de Madagascar",
    src: "/images/footer/page-principale.png",
  },
  "/cvm": {
    label: "Célébrations Voyages",
    alt: "Ambiance Célébrations Voyages : lémurien, plage, couple, 4x4 et baobabs de Madagascar",
    src: "/images/footer/cvm.png",
  },
  "/cvm/explorer": {
    label: "Expédition Explorer",
    alt: "Ambiance expédition : reliefs et terrains sauvages de Madagascar",
    src: "/images/footer/explorer.png",
  },
  "/cvm/treks": {
    label: "Trek Aventure",
    alt: "Ambiance trek : reliefs et sentiers de Madagascar",
    src: "/images/footer/treks.png",
  },
  "/cvm/iles": {
    label: "Séjour Collection",
    alt: "Ambiance séjour îles : plages et lagons turquoise de Madagascar",
    src: "/images/footer/iles.png",
  },
  "/cvm/un-mois": {
    label: "Grand Tour",
    alt: "Ambiance Grand Tour : paysages variés de Madagascar",
    src: "/images/footer/un-mois.png",
  },
  "/mlr": {
    label: "Liberty Roots",
    alt: "Ambiance road trip : taxi-brousse sur piste, plage et baobabs de Madagascar",
    src: "/images/footer/mlr.png",
  },
  "/mlr/nord": {
    label: "Road Trip Nord",
    alt: "Baie et côte du Nord de Madagascar",
    src: "/images/footer/nord.png",
  },
  "/mlr/ouest": {
    label: "Road Trip Ouest",
    alt: "Baobabs et pistes de l'Ouest de Madagascar",
    src: "/images/footer/ouest.png",
  },
};

/** Bannière de footer pour un `pathname` ; défaut = page mère. */
export function footerImageFor(pathname: string): MediaImage {
  return FOOTER_IMAGES[pathname] ?? FOOTER_IMAGES["/"];
}
