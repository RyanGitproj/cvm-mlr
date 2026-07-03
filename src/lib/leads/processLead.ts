import { z } from "zod";
import { budgetLectureReco } from "@/lib/segmentation/budget";
import { segmentExplorer } from "@/lib/segmentation/explorer";
import { segmentMlr } from "@/lib/segmentation/mlr";
import { segmentOrientation } from "@/lib/segmentation/orientation";
import { segmentTreks } from "@/lib/segmentation/treks";
import type { Recommendation } from "@/lib/segmentation/types";
import { cvmExplorerSchema } from "@/lib/validations/cvm-explorer";
import { cvmIlesSchema } from "@/lib/validations/cvm-iles";
import { cvmOrientationSchema } from "@/lib/validations/cvm-orientation";
import { cvmTreksSchema } from "@/lib/validations/cvm-treks";
import { cvmUnMoisSchema } from "@/lib/validations/cvm-un-mois";
import { mlrSchema } from "@/lib/validations/mlr";
import type { FunnelType } from "@/types/lead";

export type ProcessLeadResult =
  | {
      ok: true;
      data: Record<string, unknown>;
      recommendation: Recommendation | null;
    }
  | { ok: false; errors: Record<string, string[] | undefined> };

/**
 * Revalidation serveur (même schéma Zod que le client) + segmentation.
 * Fonction pure : aucun accès Supabase, cookies ou réseau — testable sans mock.
 */
export function processLead(
  funnelType: FunnelType,
  raw: unknown,
): ProcessLeadResult {
  switch (funnelType) {
    case "cvm_orientation": {
      const parsed = cvmOrientationSchema.safeParse(raw);
      if (!parsed.success) return invalid(parsed.error);
      return {
        ok: true,
        data: parsed.data,
        recommendation: segmentOrientation(parsed.data),
      };
    }
    case "cvm_treks": {
      const parsed = cvmTreksSchema.safeParse(raw);
      if (!parsed.success) return invalid(parsed.error);
      return {
        ok: true,
        data: parsed.data,
        recommendation: segmentTreks(parsed.data),
      };
    }
    case "cvm_explorer": {
      const parsed = cvmExplorerSchema.safeParse(raw);
      if (!parsed.success) return invalid(parsed.error);
      return {
        ok: true,
        data: parsed.data,
        recommendation: segmentExplorer(parsed.data),
      };
    }
    case "cvm_iles": {
      const parsed = cvmIlesSchema.safeParse(raw);
      if (!parsed.success) return invalid(parsed.error);
      return {
        ok: true,
        data: parsed.data,
        recommendation: budgetLectureReco(parsed.data.budget),
      };
    }
    case "cvm_un_mois": {
      const parsed = cvmUnMoisSchema.safeParse(raw);
      if (!parsed.success) return invalid(parsed.error);
      return {
        ok: true,
        data: parsed.data,
        recommendation: budgetLectureReco(parsed.data.budget),
      };
    }
    case "mlr": {
      const parsed = mlrSchema.safeParse(raw);
      if (!parsed.success) return invalid(parsed.error);
      return {
        ok: true,
        data: parsed.data,
        recommendation: segmentMlr(parsed.data),
      };
    }
  }
}

function invalid(error: z.ZodError): ProcessLeadResult {
  return { ok: false, errors: z.flattenError(error).fieldErrors };
}
