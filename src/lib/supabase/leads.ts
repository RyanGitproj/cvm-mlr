import type { MlrSuite } from "@/lib/validations/mlr";
import type { LeadRow } from "@/types/lead";
import { getServiceClient } from "./serverClient";

/**
 * Insertion du lead (table plate `funnel_cvm_mlr_leads`) via `service_role`
 * — une seule écriture au submit final, colonnes de qualification comprises.
 * Retourne l'id créé (cookie lead signé). Le returning fonctionne car
 * service_role bypasse la RLS.
 */
export async function insertLead(
  row: LeadRow,
): Promise<{ ok: true; id: string } | { ok: false }> {
  const supabase = getServiceClient();
  if (supabase === null) return { ok: false };

  const { data, error } = await supabase
    .from("funnel_cvm_mlr_leads")
    .insert(row)
    .select("id")
    .single();

  if (error !== null || data === null) {
    console.error("[supabase] insertion lead échouée :", error?.message);
    return { ok: false };
  }

  const id = (data as Record<string, unknown>).id;
  if (typeof id !== "string") return { ok: false };
  return { ok: true, id };
}

/**
 * Enregistre le choix de suite (colonne `suite`) depuis l'écran final.
 * Le `leadId` vient exclusivement du cookie de session signé HMAC, posé
 * après un insert réussi — la ligne existe donc toujours.
 */
export async function updateLeadSuite(
  leadId: string,
  suite: MlrSuite,
): Promise<{ ok: boolean }> {
  const supabase = getServiceClient();
  if (supabase === null) return { ok: false };

  const { error } = await supabase
    .from("funnel_cvm_mlr_leads")
    .update({ suite })
    .eq("id", leadId);

  if (error) {
    console.error("[supabase] choix de suite non enregistré :", error.message);
    return { ok: false };
  }
  return { ok: true };
}
