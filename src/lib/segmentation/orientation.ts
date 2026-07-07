import {
  ORIENTATION_UNIVERS,
  type OrientationUnivers,
} from "@/config/segmentation";
import type { CvmOrientationQualification } from "@/lib/validations/cvm-orientation";
import { segmentDepart } from "./depart";
import type { Recommendation } from "./types";

/**
 * Orientation (gabarit 2026-07-07) : l'intention désigne directement
 * l'univers recommandé, en plus de la fenêtre de départ commune.
 * Depuis le retrait de l'option « autre » (07-07 au soir), chaque
 * intention correspond à un univers.
 */
export function segmentOrientation(
  data: Pick<CvmOrientationQualification, "intention" | "departFenetre">,
): Recommendation {
  const base = segmentDepart(data);
  const univers: OrientationUnivers = data.intention;
  const cible = ORIENTATION_UNIVERS[univers];
  return {
    ...base,
    univers,
    universLibelle: cible.libelle,
    href: cible.href,
    raison: cible.raison,
  };
}
