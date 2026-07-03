import { z } from "zod";
import type { FunnelType } from "@/types/lead";
import { cvmExplorerSchema } from "./cvm-explorer";
import { cvmIlesSchema } from "./cvm-iles";
import { cvmOrientationSchema } from "./cvm-orientation";
import { cvmTreksSchema } from "./cvm-treks";
import { cvmUnMoisSchema } from "./cvm-un-mois";
import { mlrSchema } from "./mlr";

/** Schéma Zod du funnel — le même côté client (zodResolver) et serveur. */
export function getSchema(funnelType: FunnelType): z.ZodType {
  switch (funnelType) {
    case "cvm_orientation":
      return cvmOrientationSchema;
    case "cvm_explorer":
      return cvmExplorerSchema;
    case "cvm_treks":
      return cvmTreksSchema;
    case "cvm_iles":
      return cvmIlesSchema;
    case "cvm_un_mois":
      return cvmUnMoisSchema;
    case "mlr":
      return mlrSchema;
  }
}

export { commonLeadSchema } from "./common";
export { cvmExplorerSchema, type CvmExplorerLead } from "./cvm-explorer";
export { cvmIlesSchema, type CvmIlesLead } from "./cvm-iles";
export { cvmOrientationSchema, type CvmOrientationLead } from "./cvm-orientation";
export { cvmTreksSchema, type CvmTreksLead } from "./cvm-treks";
export { cvmUnMoisSchema, type CvmUnMoisLead } from "./cvm-un-mois";
export { mlrSchema, type MlrLead } from "./mlr";

/** UTM du premier touchpoint — validé côté serveur comme le reste du payload. */
export const utmSchema = z
  .object({
    utm_source: z.string().max(200).optional(),
    utm_medium: z.string().max(200).optional(),
    utm_campaign: z.string().max(200).optional(),
    utm_content: z.string().max(200).optional(),
    utm_term: z.string().max(200).optional(),
    referrer: z.string().max(500).optional(),
  })
  .nullable();
