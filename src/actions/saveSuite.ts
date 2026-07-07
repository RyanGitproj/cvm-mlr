"use server";

import { readLeadCookie } from "@/lib/lead-cookie";
import { updateLeadSuite } from "@/lib/supabase/leads";
import { mlrSuiteSchema } from "@/lib/validations/mlr";

/**
 * Enregistre le choix de suite (« rdv » ou « brochure ») depuis l'écran
 * final MLR. Le lead est identifié par le cookie de session signé HMAC —
 * jamais par un id fourni par le client. Best-effort : l'échec (cookie
 * expiré, base indisponible) ne bloque pas l'affichage du contact direct.
 */
export async function saveSuite(rawChoice: unknown): Promise<{ ok: boolean }> {
  const choice = mlrSuiteSchema.safeParse(rawChoice);
  if (!choice.success) return { ok: false };

  const session = await readLeadCookie();
  if (session === null) return { ok: false };

  return updateLeadSuite(session.id, choice.data);
}
