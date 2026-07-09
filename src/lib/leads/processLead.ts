import { z } from "zod";
import { fenetreFor, segmentDepart } from "@/lib/segmentation/depart";
import { segmentOrientation } from "@/lib/segmentation/orientation";
import type { Recommendation } from "@/lib/segmentation/types";
import type { DepartFenetre } from "@/lib/validations/common";
import { cvmExplorerQualificationSchema } from "@/lib/validations/cvm-explorer";
import { cvmIlesQualificationSchema } from "@/lib/validations/cvm-iles";
import { cvmOrientationQualificationSchema } from "@/lib/validations/cvm-orientation";
import { cvmTreksQualificationSchema } from "@/lib/validations/cvm-treks";
import { cvmUnMoisQualificationSchema } from "@/lib/validations/cvm-un-mois";
import { mlrWizardSchema } from "@/lib/validations/mlr";
import {
  EMPTY_QUALIF,
  type FunnelType,
  type LeadQualifColumns,
} from "@/types/lead";

export type ProcessLeadResult =
  | {
      ok: true;
      qualif: LeadQualifColumns;
      recommendation: Recommendation;
    }
  | { ok: false; errors: Record<string, string[] | undefined> };

// MLR : seule la fenêtre Q3 relève de la qualification — la route et la
// durée sont des colonnes offre/route.
const mlrAnswersSchema = mlrWizardSchema.pick({ departFenetre: true });

/** Fragment commun aux 6 funnels : fenêtre Q3 + fenêtre agrégée recommandée. */
function baseQualif(departFenetre: DepartFenetre): LeadQualifColumns {
  return {
    ...EMPTY_QUALIF,
    depart_fenetre: departFenetre,
    reco_fenetre: fenetreFor(departFenetre),
  };
}

/**
 * Précision « Autre — je précise » : stockée seulement quand l'option
 * « autre » est effectivement retenue — un texte saisi puis abandonné pour
 * une option fermée reste dans le formulaire mais ne va pas en base.
 */
function precisionSiAutre(
  projection: string,
  precision: string | undefined,
): string | null {
  return projection === "autre" &&
    typeof precision === "string" &&
    precision.trim() !== ""
    ? precision
    : null;
}

/**
 * Extrait les colonnes de qualification du parcours complet (déjà validé par
 * `getFormSchema` côté action — revalidation ici en défense en profondeur) et
 * calcule la `recommendation` : fenêtre de départ commune aux 6 funnels,
 * univers recommandé en plus pour l'orientation. La `projection` est la
 * réponse Q1 du funnel (la Q1 MLR est la route, déjà en colonne dédiée).
 * Fonction pure : aucun accès Supabase, cookies ou réseau.
 */
export function processLead(
  funnelType: FunnelType,
  raw: unknown,
): ProcessLeadResult {
  switch (funnelType) {
    case "cvm_orientation": {
      const parsed = cvmOrientationQualificationSchema.safeParse(raw);
      if (!parsed.success) return invalid(parsed.error);
      return {
        ok: true,
        qualif: {
          ...baseQualif(parsed.data.departFenetre),
          projection: parsed.data.intention,
          reco_univers: parsed.data.intention,
        },
        recommendation: segmentOrientation(parsed.data),
      };
    }
    case "cvm_treks": {
      const parsed = cvmTreksQualificationSchema.safeParse(raw);
      if (!parsed.success) return invalid(parsed.error);
      return {
        ok: true,
        qualif: {
          ...baseQualif(parsed.data.departFenetre),
          projection: parsed.data.decor,
        },
        recommendation: segmentDepart(parsed.data),
      };
    }
    case "cvm_explorer": {
      const parsed = cvmExplorerQualificationSchema.safeParse(raw);
      if (!parsed.success) return invalid(parsed.error);
      return {
        ok: true,
        qualif: {
          ...baseQualif(parsed.data.departFenetre),
          projection: parsed.data.terrain,
          projection_precision: precisionSiAutre(
            parsed.data.terrain,
            parsed.data.terrainPrecision,
          ),
        },
        recommendation: segmentDepart(parsed.data),
      };
    }
    case "cvm_iles": {
      const parsed = cvmIlesQualificationSchema.safeParse(raw);
      if (!parsed.success) return invalid(parsed.error);
      return {
        ok: true,
        qualif: {
          ...baseQualif(parsed.data.departFenetre),
          projection: parsed.data.destination,
          projection_precision: precisionSiAutre(
            parsed.data.destination,
            parsed.data.destinationPrecision,
          ),
        },
        recommendation: segmentDepart(parsed.data),
      };
    }
    case "cvm_un_mois": {
      const parsed = cvmUnMoisQualificationSchema.safeParse(raw);
      if (!parsed.success) return invalid(parsed.error);
      return {
        ok: true,
        qualif: {
          ...baseQualif(parsed.data.departFenetre),
          projection: parsed.data.objectifMois,
          projection_precision: precisionSiAutre(
            parsed.data.objectifMois,
            parsed.data.objectifMoisPrecision,
          ),
        },
        recommendation: segmentDepart(parsed.data),
      };
    }
    case "mlr": {
      const parsed = mlrAnswersSchema.safeParse(raw);
      if (!parsed.success) return invalid(parsed.error);
      return {
        ok: true,
        qualif: baseQualif(parsed.data.departFenetre),
        recommendation: segmentDepart(parsed.data),
      };
    }
  }
}

function invalid(error: z.ZodError): ProcessLeadResult {
  return { ok: false, errors: z.flattenError(error).fieldErrors };
}
