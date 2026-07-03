import {
  BUDGET_LECTURES,
  ORIENTATION_UNIVERS,
  type OrientationUnivers,
} from "@/config/segmentation";
import type { CvmOrientationLead } from "@/lib/validations/cvm-orientation";
import type { Recommendation } from "./types";

/**
 * Logique de sortie du funnel d'orientation (mission Riane) — mapping
 * qualitatif signaux → univers, sans barème chiffré (le document n'en
 * définit pas) :
 *
 * 1. L'intention explicite (question 2) désigne directement l'univers.
 * 2. Garde-fou Explorer : un profil confort/premium ou de niveau physique
 *    modéré n'est jamais orienté vers l'expédition — il bascule vers
 *    Treks Aventure (« éviter d'envoyer un profil confort vers Explorer »).
 * 3. Si l'intention est « autre », l'objectif profond (question 8) décide :
 *    dépassement → Explorer · paysages encadrés → Treks · détente → Îles ·
 *    projet de vie → Un mois.
 * 4. Dernier recours : durée ≈ un mois → Un mois ; confort premium → Îles ;
 *    rustique + sportif → Explorer ; sinon Treks (l'aventure encadrée est
 *    le cœur de gamme CVM).
 */
export function segmentOrientation(data: CvmOrientationLead): Recommendation {
  const univers = resolveUnivers(data);
  const cible = ORIENTATION_UNIVERS[univers];
  return {
    univers,
    libelle: cible.libelle,
    raison: cible.raison,
    href: cible.href,
    budgetLecture: BUDGET_LECTURES[data.budget],
  };
}

function resolveUnivers(data: CvmOrientationLead): OrientationUnivers {
  if (data.intention !== "autre") {
    return guardExplorer(data.intention, data);
  }

  switch (data.objectif) {
    case "depassement":
      return guardExplorer("explorer", data);
    case "paysages_cadre":
      return "treks";
    case "detente":
      return "iles";
    case "projet_de_vie":
      return "un_mois";
    case "autre":
      break;
  }

  if (data.duree === "un_mois") return "un_mois";
  if (data.confort === "premium") return "iles";
  if (
    data.confort === "rustique" &&
    (data.niveauPhysique === "sportive" || data.niveauPhysique === "tres_sportive")
  ) {
    return "explorer";
  }
  return "treks";
}

function guardExplorer(
  univers: OrientationUnivers,
  data: CvmOrientationLead,
): OrientationUnivers {
  if (univers !== "explorer") return univers;
  const profilConfort =
    data.confort === "premium" || data.niveauPhysique === "moderee";
  return profilConfort ? "treks" : "explorer";
}
