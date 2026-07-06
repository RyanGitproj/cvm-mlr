"use server";

import { readLeadCookie } from "@/lib/lead-cookie";
import { processStep2 } from "@/lib/leads/processStep2";
import { readMerciCookie, setMerciCookie } from "@/lib/merci-cookie";
import { upsertLeadStep2 } from "@/lib/supabase/leads";
import { getStep2Schema } from "@/lib/validations";

export type SaveStep2Result =
  | { ok: true }
  | { ok: false; errors?: Record<string, string[] | undefined> };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * Étape 2, enregistrement progressif. `funnelType` vient du cookie de session
 * signé (jamais du client). Mode progressif = tolérant (best-effort, ne bloque
 * jamais la navigation) ; mode `final` = validation stricte + segmentation.
 */
export async function saveStep2Progress(
  rawAnswers: unknown,
  opts: { final?: boolean } = {},
): Promise<SaveStep2Result> {
  const session = await readLeadCookie();
  if (session === null) return { ok: false };

  if (opts.final === true) {
    const processed = processStep2(session.funnelType, rawAnswers);
    if (!processed.ok) return { ok: false, errors: processed.errors };

    const saved = await upsertLeadStep2({
      lead_id: session.id,
      answers: processed.data,
      recommendation: processed.recommendation,
      completed: true,
    });
    if (!saved.ok) return { ok: false };

    const reco = processed.recommendation;
    const existing = await readMerciCookie();
    await setMerciCookie({
      nom: existing?.nom ?? "",
      prenom: existing?.prenom,
      funnelType: session.funnelType,
      recommandation:
        typeof reco?.libelle === "string" ? reco.libelle : undefined,
      recommandationHref:
        typeof reco?.href === "string" ? reco.href : undefined,
    });
    return { ok: true };
  }

  // Progressif : on filtre aux clés connues de l'étape 2 (sans revalider les
  // valeurs — une réponse à moitié saisie ne doit pas effacer les autres).
  const allowed = new Set(Object.keys(getStep2Schema(session.funnelType).shape));
  const answers: Record<string, unknown> = {};
  if (isRecord(rawAnswers)) {
    for (const [key, value] of Object.entries(rawAnswers)) {
      if (allowed.has(key) && value !== undefined) answers[key] = value;
    }
  }

  await upsertLeadStep2({
    lead_id: session.id,
    answers,
    recommendation: null,
    completed: false,
  });
  return { ok: true };
}
