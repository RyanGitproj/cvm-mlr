import { z } from "zod";
import type { FunnelType } from "@/types/lead";
import { contactSchema } from "./contact";
import {
  cvmExplorerOfferSchema,
  cvmExplorerQualificationSchema,
} from "./cvm-explorer";
import { cvmIlesOfferSchema, cvmIlesQualificationSchema } from "./cvm-iles";
import {
  cvmOrientationOfferSchema,
  cvmOrientationQualificationSchema,
} from "./cvm-orientation";
import { cvmTreksOfferSchema, cvmTreksQualificationSchema } from "./cvm-treks";
import {
  cvmUnMoisOfferSchema,
  cvmUnMoisQualificationSchema,
} from "./cvm-un-mois";
import { mlrOfferSchema, mlrQualificationSchema } from "./mlr";

/**
 * Étape 1 — contact commun + offre du funnel. Validé au clic « Enregistrer »
 * (client) et à l'insertion en table `funnel_cvm_mlr_info` (serveur).
 */
export function getStep1Schema(funnelType: FunnelType) {
  switch (funnelType) {
    case "cvm_orientation":
      return contactSchema.extend(cvmOrientationOfferSchema.shape);
    case "cvm_explorer":
      return contactSchema.extend(cvmExplorerOfferSchema.shape);
    case "cvm_treks":
      return contactSchema.extend(cvmTreksOfferSchema.shape);
    case "cvm_iles":
      return contactSchema.extend(cvmIlesOfferSchema.shape);
    case "cvm_un_mois":
      return contactSchema.extend(cvmUnMoisOfferSchema.shape);
    case "mlr":
      return contactSchema.extend(mlrOfferSchema.shape);
  }
}

/**
 * Étape 2 — questions de qualification du funnel (sans contact). Validé en
 * `.partial()` à chaque sauvegarde progressive, en entier au save final.
 */
export function getStep2Schema(funnelType: FunnelType) {
  switch (funnelType) {
    case "cvm_orientation":
      return cvmOrientationQualificationSchema;
    case "cvm_explorer":
      return cvmExplorerQualificationSchema;
    case "cvm_treks":
      return cvmTreksQualificationSchema;
    case "cvm_iles":
      return cvmIlesQualificationSchema;
    case "cvm_un_mois":
      return cvmUnMoisQualificationSchema;
    case "mlr":
      return mlrQualificationSchema;
  }
}

/**
 * Schéma complet (étape 1 + étape 2) — resolver unique de react-hook-form
 * côté client. La validation par phase se fait via `form.trigger([...])`.
 */
export function getFormSchema(funnelType: FunnelType) {
  switch (funnelType) {
    case "cvm_orientation":
      return contactSchema
        .extend(cvmOrientationOfferSchema.shape)
        .extend(cvmOrientationQualificationSchema.shape);
    case "cvm_explorer":
      return contactSchema
        .extend(cvmExplorerOfferSchema.shape)
        .extend(cvmExplorerQualificationSchema.shape);
    case "cvm_treks":
      return contactSchema
        .extend(cvmTreksOfferSchema.shape)
        .extend(cvmTreksQualificationSchema.shape);
    case "cvm_iles":
      return contactSchema
        .extend(cvmIlesOfferSchema.shape)
        .extend(cvmIlesQualificationSchema.shape);
    case "cvm_un_mois":
      return contactSchema
        .extend(cvmUnMoisOfferSchema.shape)
        .extend(cvmUnMoisQualificationSchema.shape);
    case "mlr":
      return contactSchema
        .extend(mlrOfferSchema.shape)
        .extend(mlrQualificationSchema.shape);
  }
}

export { contactSchema, type ContactData } from "./contact";
export {
  cvmExplorerQualificationSchema,
  type CvmExplorerQualification,
} from "./cvm-explorer";
export {
  cvmIlesQualificationSchema,
  type CvmIlesQualification,
} from "./cvm-iles";
export {
  cvmOrientationQualificationSchema,
  type CvmOrientationQualification,
} from "./cvm-orientation";
export {
  cvmTreksQualificationSchema,
  type CvmTreksQualification,
} from "./cvm-treks";
export {
  cvmUnMoisQualificationSchema,
  type CvmUnMoisQualification,
} from "./cvm-un-mois";
export { mlrQualificationSchema, type MlrQualification } from "./mlr";

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
