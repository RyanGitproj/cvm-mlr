import {
  BUDGET_LECTURES,
  EXPLORER_LIBELLES,
  type ExplorerCompatibilite,
} from "@/config/segmentation";
import type { CvmExplorerLead } from "@/lib/validations/cvm-explorer";
import type { Recommendation } from "./types";

/**
 * Compatibilité expédition (brief §9.3) : compatible / à évaluer /
 * réorienter — jamais de validation ferme, la décision finale reste
 * humaine (pré-validation commerciale + certificat médical).
 */
export function segmentExplorer(data: CvmExplorerLead): Recommendation {
  const compatibilite = resolveCompatibilite(data);
  return {
    compatibilite,
    libelle: EXPLORER_LIBELLES[compatibilite],
    budgetLecture: BUDGET_LECTURES[data.budget],
  };
}

function resolveCompatibilite(data: CvmExplorerLead): ExplorerCompatibilite {
  // Signaux de réorientation explicites des sources : marche < 10 km/j
  // (« réorientation probable »), besoin de confort régulier, refus
  // d'exposition à la faune.
  if (
    data.capaciteMarche === "moins_10" ||
    data.bivouac === "besoin_confort" ||
    data.faune === "pas_exposition"
  ) {
    return "reorienter";
  }

  // Signaux « à évaluer » : marche 10–15 (« possible Trek Aventure »),
  // bivouac jamais testé, certificat incertain, forte appréhension faune,
  // ou réponse libre sur un critère déterminant.
  if (
    data.capaciteMarche === "10_15" ||
    data.capaciteMarche === "autre" ||
    data.bivouac === "jamais_teste" ||
    data.bivouac === "autre" ||
    data.certificat === "pas_certain" ||
    data.certificat === "autre" ||
    data.faune === "forte_apprehension" ||
    data.faune === "autre"
  ) {
    return "a_evaluer";
  }

  return "compatible";
}
