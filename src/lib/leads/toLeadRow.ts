import type { Recommendation } from "@/lib/segmentation/types";
import type { UtmData } from "@/lib/utm";
import type { FunnelType, LeadRow } from "@/types/lead";

/** Clés du commonLeadSchema — tout le reste part dans specific_fields. */
const COMMON_KEYS = new Set([
  "prenom",
  "email",
  "telephone",
  "periode",
  "nbVoyageurs",
  "commentaire",
  "consentement",
]);

/**
 * Répartit un payload validé vers les colonnes de la table `leads`
 * (brief §4.3). Fonction pure, testable sans mock.
 */
export function toLeadRow(
  funnelType: FunnelType,
  data: Record<string, unknown>,
  recommendation: Recommendation | null,
  utm: UtmData | null,
): LeadRow {
  const common: Record<string, unknown> = {};
  const specific: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(data)) {
    if (value === undefined) continue;
    if (COMMON_KEYS.has(key)) {
      common[key] = value;
    } else {
      specific[key] = value;
    }
  }

  return {
    funnel_type: funnelType,
    brand: funnelType === "mlr" ? "mlr" : "cvm",
    common_fields: common,
    specific_fields: specific,
    recommendation,
    utm,
  };
}
