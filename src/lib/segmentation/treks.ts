import {
  BUDGET_LECTURES,
  TREKS_NIVEAUX,
  TREKS_NIVEAU_LIBELLES,
  TREKS_NIVEAU_PAR_KM,
  type TreksNiveau,
} from "@/config/segmentation";
import type { CvmTreksQualification } from "@/lib/validations/cvm-treks";
import type { Recommendation } from "./types";

/**
 * Dérive un niveau de trek conseillé (brief §9.3) : base par km/jour,
 * ajustée d'un cran par le dénivelé. Toute réponse « autre » ou
 * « à orienter » renvoie vers un conseiller plutôt que de deviner.
 */
export function segmentTreks(data: CvmTreksQualification): Recommendation {
  const niveau = resolveNiveau(data);
  return {
    niveau,
    libelle: TREKS_NIVEAU_LIBELLES[niveau],
    budgetLecture: BUDGET_LECTURES[data.budget],
  };
}

function resolveNiveau(data: CvmTreksQualification): TreksNiveau {
  const base = TREKS_NIVEAU_PAR_KM[data.kmParJour];
  if (
    base === undefined ||
    data.denivele === "a_orienter" ||
    data.denivele === "autre"
  ) {
    return "a_orienter";
  }

  const echelle: readonly TreksNiveau[] = TREKS_NIVEAUX;
  const index = echelle.indexOf(base);
  if (data.denivele === "soutenu") {
    return echelle[Math.min(index + 1, echelle.indexOf("engage"))];
  }
  if (data.denivele === "faible") {
    return echelle[Math.max(index - 1, 0)];
  }
  return base;
}
