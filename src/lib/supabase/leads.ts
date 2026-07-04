import type { LeadRow } from "@/types/lead";
import { getSupabaseClient } from "./client";

/** Insertion du lead — seule écriture en base du projet (fin de chaîne). */
export async function insertLead(row: LeadRow): Promise<{ ok: boolean }> {
  const supabase = getSupabaseClient();
  if (supabase === null) return { ok: false };

  const { error } = await supabase.from("cvm_mlr_leads").insert(row);
  if (error) {
    console.error("[supabase] insertion du lead échouée :", error.message);
    return { ok: false };
  }
  return { ok: true };
}
