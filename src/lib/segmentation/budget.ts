import { BUDGET_LECTURES } from "@/config/segmentation";
import type { CvmBudget } from "@/lib/validations/common";
import type { Recommendation } from "./types";

/**
 * Îles de Rêve et Un mois n'affichent aucune recommandation au visiteur :
 * on ne calcule rien (brief §1.2) — seule la lecture de l'enveloppe budget
 * (§13.6) est stockée comme donnée pour l'équipe aval.
 */
export function budgetLectureReco(budget: CvmBudget): Recommendation {
  return { budgetLecture: BUDGET_LECTURES[budget] };
}
