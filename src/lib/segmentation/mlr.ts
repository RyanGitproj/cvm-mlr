import { MLR_PROFILS, type MlrProfil } from "@/config/segmentation";
import type { MlrQualification } from "@/lib/validations/mlr";
import type { Recommendation } from "./types";

const PROFIL_PAR_REPONSE: Record<MlrQualification["pretRoots"], MlrProfil> = {
  oui_local_simple: "roots_pret",
  oui_comprendre_regles: "roots_a_briefer",
  hesite_prefere_confort: "confort_d_abord",
  veut_conseil: "a_conseiller",
};

/**
 * Profil roots MLR (brief §9.3). `orientationCvm` signale honnêtement
 * qu'un profil « confort d'abord » relève plutôt de Célébrations Voyages
 * Madagascar — une donnée pour l'équipe aval, aucune action déclenchée.
 */
export function segmentMlr(data: MlrQualification): Recommendation {
  const profil = PROFIL_PAR_REPONSE[data.pretRoots];
  return {
    profil,
    libelle: MLR_PROFILS[profil],
    orientationCvm: profil === "confort_d_abord",
  };
}
