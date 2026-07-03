import type { UtmData } from "@/lib/utm";

export type Brand = "cvm" | "mlr";

export const FUNNEL_TYPES = [
  "cvm_orientation",
  "cvm_explorer",
  "cvm_treks",
  "cvm_iles",
  "cvm_un_mois",
  "mlr",
] as const;

export type FunnelType = (typeof FUNNEL_TYPES)[number];

/** Ligne écrite dans public.leads (voir supabase/schema.sql). */
export type LeadRow = {
  funnel_type: FunnelType;
  brand: Brand;
  common_fields: Record<string, unknown>;
  specific_fields: Record<string, unknown>;
  recommendation: Record<string, unknown> | null;
  utm: UtmData | null;
};
