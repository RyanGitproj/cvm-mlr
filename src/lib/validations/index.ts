import { z } from "zod";
import type { FunnelType } from "@/types/lead";
import { exigeEffectifGroupe } from "./common";
import { contactCoreSchema, mlrContactSchema } from "./contact";
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
import { mlrWizardSchema } from "./mlr";

/**
 * Schéma complet du parcours wizard — resolver react-hook-form côté client
 * ET validation serveur (submitLead). La validation par écran se fait via
 * `form.trigger([...])` ; l'enregistrement n'a lieu qu'au submit final.
 * La règle transverse « Plus de 4 » ⇒ effectif approximatif requis est
 * posée ici, une seule fois pour les 6 funnels.
 */
export function getFormSchema(funnelType: FunnelType) {
  switch (funnelType) {
    case "cvm_orientation":
      return contactCoreSchema
        .extend(cvmOrientationOfferSchema.shape)
        .extend(cvmOrientationQualificationSchema.shape)
        .superRefine(exigeEffectifGroupe);
    case "cvm_explorer":
      return contactCoreSchema
        .extend(cvmExplorerOfferSchema.shape)
        .extend(cvmExplorerQualificationSchema.shape)
        .superRefine(exigeEffectifGroupe);
    case "cvm_treks":
      return contactCoreSchema
        .extend(cvmTreksOfferSchema.shape)
        .extend(cvmTreksQualificationSchema.shape)
        .superRefine(exigeEffectifGroupe);
    case "cvm_iles":
      return contactCoreSchema
        .extend(cvmIlesOfferSchema.shape)
        .extend(cvmIlesQualificationSchema.shape)
        .superRefine(exigeEffectifGroupe);
    case "cvm_un_mois":
      return contactCoreSchema
        .extend(cvmUnMoisOfferSchema.shape)
        .extend(cvmUnMoisQualificationSchema.shape)
        .superRefine(exigeEffectifGroupe);
    case "mlr":
      return mlrContactSchema
        .extend(mlrWizardSchema.shape)
        .superRefine(exigeEffectifGroupe);
  }
}

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
