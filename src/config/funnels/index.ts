import type { FunnelConfig } from "@/types/funnel";
import type { FunnelType } from "@/types/lead";
import { cvmExplorerFunnel } from "./cvm-explorer";
import { cvmIlesFunnel } from "./cvm-iles";
import { cvmOrientationFunnel } from "./cvm-orientation";
import { cvmTreksFunnel } from "./cvm-treks";
import { cvmUnMoisFunnel } from "./cvm-un-mois";
import { mlrFunnel } from "./mlr";

const FUNNELS: Record<FunnelType, FunnelConfig> = {
  cvm_orientation: cvmOrientationFunnel,
  cvm_explorer: cvmExplorerFunnel,
  cvm_treks: cvmTreksFunnel,
  cvm_iles: cvmIlesFunnel,
  cvm_un_mois: cvmUnMoisFunnel,
  mlr: mlrFunnel,
};

export function getFunnelConfig(funnelType: FunnelType): FunnelConfig {
  return FUNNELS[funnelType];
}

/** Valeurs de route MLR pré-sélectionnées par les pages /mlr/{route}. */
export const MLR_ROUTES = ["nord", "sud", "est", "ouest"] as const;
export type MlrRoute = (typeof MLR_ROUTES)[number];
