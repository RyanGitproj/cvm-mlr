import type { LeadComRow, LeadInfoRow } from "@/types/lead";
import type { MlrSuite } from "@/lib/validations/mlr";
import { getServiceClient } from "./serverClient";

/**
 * Insertion du lead (table `funnel_cvm_mlr_info`) via `service_role` —
 * retourne l'id créé (nécessaire pour lier la table com). Le returning
 * fonctionne car service_role bypasse la RLS.
 */
export async function insertLeadInfo(
  row: LeadInfoRow,
): Promise<{ ok: true; id: string } | { ok: false }> {
  const supabase = getServiceClient();
  if (supabase === null) return { ok: false };

  const { data, error } = await supabase
    .from("funnel_cvm_mlr_info")
    .insert(row)
    .select("id")
    .single();

  if (error !== null || data === null) {
    console.error("[supabase] insertion lead info échouée :", error?.message);
    return { ok: false };
  }

  const id = (data as Record<string, unknown>).id;
  if (typeof id !== "string") return { ok: false };
  return { ok: true, id };
}

/**
 * Écriture des réponses de qualification (table `funnel_cvm_mlr_com`) via
 * `service_role` — une ligne par lead. Upsert `onConflict: lead_id` par
 * idempotence (re-submit après erreur réseau côté client).
 */
export async function insertLeadCom(row: LeadComRow): Promise<{ ok: boolean }> {
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
    console.error("[supabase] écriture réponses échouée :", error.message);
    return { ok: false };
  }
  return { ok: true };
}

/**
 * Enregistre le choix de suite (`answers.suite`) depuis l'écran final MLR.
 * Le `lead_id` vient exclusivement du cookie de session signé HMAC. Upsert :
 * si l'écriture des réponses avait échoué au submit, le choix crée la ligne
 * plutôt que d'être perdu.
 */
export async function updateLeadSuite(
  leadId: string,
  suite: MlrSuite,
): Promise<{ ok: boolean }> {
  const supabase = getServiceClient();
  if (supabase === null) return { ok: false };

  const { data, error } = await supabase
    .from("funnel_cvm_mlr_com")
    .select("answers")
    .eq("lead_id", leadId)
    .maybeSingle();

  if (error) {
    console.error("[supabase] lecture réponses échouée :", error.message);
    return { ok: false };
  }

  const existing =
    data !== null && typeof data.answers === "object" && data.answers !== null
      ? (data.answers as Record<string, unknown>)
      : {};

  const { error: upsertError } = await supabase
    .from("funnel_cvm_mlr_com")
    .upsert(
      {
        lead_id: leadId,
        answers: { ...existing, suite },
        updated_at: new Date().toISOString(),
      },
      { onConflict: "lead_id" },
    );

  if (upsertError) {
    console.error("[supabase] choix de suite non enregistré :", upsertError.message);
    return { ok: false };
  }
  return { ok: true };
}
