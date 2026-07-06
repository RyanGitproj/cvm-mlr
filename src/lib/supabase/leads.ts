import type { LeadStep1Row, LeadStep2Row } from "@/types/lead";
import { getServiceClient } from "./serverClient";

/**
 * Insertion étape 1 (table `funnel_cvm_mlr_info`) via `service_role` — retourne
 * l'id créé (nécessaire pour lier l'étape 2). Le returning fonctionne car
 * service_role bypasse la RLS.
 */
export async function insertLeadStep1(
  row: LeadStep1Row,
): Promise<{ ok: true; id: string } | { ok: false }> {
  const supabase = getServiceClient();
  if (supabase === null) return { ok: false };

  const { data, error } = await supabase
    .from("funnel_cvm_mlr_info")
    .insert(row)
    .select("id")
    .single();

  if (error !== null || data === null) {
    console.error("[supabase] insertion étape 1 échouée :", error?.message);
    return { ok: false };
  }

  const id = (data as Record<string, unknown>).id;
  if (typeof id !== "string") return { ok: false };
  return { ok: true, id };
}

/**
 * Upsert étape 2 (table `funnel_cvm_mlr_com`) via `service_role` — une ligne
 * par lead (`onConflict: lead_id`). Enregistrement progressif : le client
 * envoie à chaque fois le snapshot complet des réponses (idempotent).
 */
export async function upsertLeadStep2(row: LeadStep2Row): Promise<{ ok: boolean }> {
  const supabase = getServiceClient();
  if (supabase === null) return { ok: false };

  const { error } = await supabase.from("funnel_cvm_mlr_com").upsert(
    {
      lead_id: row.lead_id,
      answers: row.answers,
      recommendation: row.recommendation,
      completed: row.completed,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "lead_id" },
  );

  if (error) {
    console.error("[supabase] upsert étape 2 échoué :", error.message);
    return { ok: false };
  }
  return { ok: true };
}
