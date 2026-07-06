import { z } from "zod";
import { budgetLectureReco } from "@/lib/segmentation/budget";
import { segmentExplorer } from "@/lib/segmentation/explorer";
import { segmentMlr } from "@/lib/segmentation/mlr";
import { segmentOrientation } from "@/lib/segmentation/orientation";
import { segmentTreks } from "@/lib/segmentation/treks";
import type { Recommendation } from "@/lib/segmentation/types";
import { cvmExplorerQualificationSchema } from "@/lib/validations/cvm-explorer";
import { cvmIlesQualificationSchema } from "@/lib/validations/cvm-iles";
import { cvmOrientationQualificationSchema } from "@/lib/validations/cvm-orientation";
import { cvmTreksQualificationSchema } from "@/lib/validations/cvm-treks";
import { cvmUnMoisQualificationSchema } from "@/lib/validations/cvm-un-mois";
import { mlrQualificationSchema } from "@/lib/validations/mlr";
import type { FunnelType } from "@/types/lead";

export type ProcessStep2Result =
  | {
      ok: true;
      data: Record<string, unknown>;
      recommendation: Recommendation | null;
    }
  | { ok: false; errors: Record<string, string[] | undefined> };

/**
 * Validation stricte de l'étape 2 (qualification) + segmentation. Appelé au
 * save FINAL de l'étape 2 uniquement (la reco n'existe que si l'étape 2 est
 * remplie). Fonction pure : aucun accès Supabase, cookies ou réseau.
 */
export function processStep2(
  funnelType: FunnelType,
  raw: unknown,
): ProcessStep2Result {
  switch (funnelType) {
    case "cvm_orientation": {
      const parsed = cvmOrientationQualificationSchema.safeParse(raw);
      if (!parsed.success) return invalid(parsed.error);
      return {
        ok: true,
        data: parsed.data,
        recommendation: segmentOrientation(parsed.data),
      };
    }
    case "cvm_treks": {
      const parsed = cvmTreksQualificationSchema.safeParse(raw);
      if (!parsed.success) return invalid(parsed.error);
      return {
        ok: true,
        data: parsed.data,
        recommendation: segmentTreks(parsed.data),
      };
    }
    case "cvm_explorer": {
      const parsed = cvmExplorerQualificationSchema.safeParse(raw);
      if (!parsed.success) return invalid(parsed.error);
      return {
        ok: true,
        data: parsed.data,
        recommendation: segmentExplorer(parsed.data),
      };
    }
    case "cvm_iles": {
      const parsed = cvmIlesQualificationSchema.safeParse(raw);
      if (!parsed.success) return invalid(parsed.error);
      return {
        ok: true,
        data: parsed.data,
        recommendation: budgetLectureReco(parsed.data.budget),
      };
    }
    case "cvm_un_mois": {
      const parsed = cvmUnMoisQualificationSchema.safeParse(raw);
      if (!parsed.success) return invalid(parsed.error);
      return {
        ok: true,
        data: parsed.data,
        recommendation: budgetLectureReco(parsed.data.budget),
      };
    }
    case "mlr": {
      const parsed = mlrQualificationSchema.safeParse(raw);
      if (!parsed.success) return invalid(parsed.error);
      return {
        ok: true,
        data: parsed.data,
        recommendation: segmentMlr(parsed.data),
      };
    }
  }
}

function invalid(error: z.ZodError): ProcessStep2Result {
  return { ok: false, errors: z.flattenError(error).fieldErrors };
}
