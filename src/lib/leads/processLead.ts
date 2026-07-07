import { z } from "zod";
import { segmentDepart } from "@/lib/segmentation/depart";
import { segmentOrientation } from "@/lib/segmentation/orientation";
import type { Recommendation } from "@/lib/segmentation/types";
import { cvmExplorerQualificationSchema } from "@/lib/validations/cvm-explorer";
import { cvmIlesQualificationSchema } from "@/lib/validations/cvm-iles";
import { cvmOrientationQualificationSchema } from "@/lib/validations/cvm-orientation";
import { cvmTreksQualificationSchema } from "@/lib/validations/cvm-treks";
import { cvmUnMoisQualificationSchema } from "@/lib/validations/cvm-un-mois";
import { mlrWizardSchema } from "@/lib/validations/mlr";
import type { FunnelType } from "@/types/lead";

export type ProcessLeadResult =
  | {
      ok: true;
      data: Record<string, unknown>;
      recommendation: Recommendation | null;
    }
  | { ok: false; errors: Record<string, string[] | undefined> };

/**
 * Réponses stockées dans `answers` : la Q1 de projection et la fenêtre de
 * départ (+ compréhension MLR, acceptations Explorer). Le nombre de
 * voyageurs, la route et l'offre vivent en colonnes de la table info —
 * pas de duplication dans le JSONB.
 */
const orientationAnswers = cvmOrientationQualificationSchema.omit({
  nbVoyageurs: true,
});
const treksAnswers = cvmTreksQualificationSchema.omit({ nbVoyageurs: true });
const explorerAnswers = cvmExplorerQualificationSchema.omit({
  nbVoyageurs: true,
});
const ilesAnswers = cvmIlesQualificationSchema.omit({ nbVoyageurs: true });
const unMoisAnswers = cvmUnMoisQualificationSchema.omit({ nbVoyageurs: true });
const mlrAnswers = mlrWizardSchema.pick({
  departFenetre: true,
  comprehension: true,
});

/**
 * Extrait les réponses de qualification du parcours complet (déjà validé par
 * `getFormSchema` côté action — revalidation ici en défense en profondeur) et
 * calcule la `recommendation` : fenêtre de départ commune aux 6 funnels,
 * univers recommandé en plus pour l'orientation. Fonction pure : aucun accès
 * Supabase, cookies ou réseau.
 */
export function processLead(
  funnelType: FunnelType,
  raw: unknown,
): ProcessLeadResult {
  switch (funnelType) {
    case "cvm_orientation": {
      const parsed = orientationAnswers.safeParse(raw);
      if (!parsed.success) return invalid(parsed.error);
      return {
        ok: true,
        data: parsed.data,
        recommendation: segmentOrientation(parsed.data),
      };
    }
    case "cvm_treks": {
      const parsed = treksAnswers.safeParse(raw);
      if (!parsed.success) return invalid(parsed.error);
      return {
        ok: true,
        data: parsed.data,
        recommendation: segmentDepart(parsed.data),
      };
    }
    case "cvm_explorer": {
      const parsed = explorerAnswers.safeParse(raw);
      if (!parsed.success) return invalid(parsed.error);
      return {
        ok: true,
        data: parsed.data,
        recommendation: segmentDepart(parsed.data),
      };
    }
    case "cvm_iles": {
      const parsed = ilesAnswers.safeParse(raw);
      if (!parsed.success) return invalid(parsed.error);
      return {
        ok: true,
        data: parsed.data,
        recommendation: segmentDepart(parsed.data),
      };
    }
    case "cvm_un_mois": {
      const parsed = unMoisAnswers.safeParse(raw);
      if (!parsed.success) return invalid(parsed.error);
      return {
        ok: true,
        data: parsed.data,
        recommendation: segmentDepart(parsed.data),
      };
    }
    case "mlr": {
      const parsed = mlrAnswers.safeParse(raw);
      if (!parsed.success) return invalid(parsed.error);
      return {
        ok: true,
        data: parsed.data,
        recommendation: segmentDepart(parsed.data),
      };
    }
  }
}

function invalid(error: z.ZodError): ProcessLeadResult {
  return { ok: false, errors: z.flattenError(error).fieldErrors };
}
