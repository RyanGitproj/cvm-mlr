"use server";

import { z } from "zod";
import { setLeadCookie } from "@/lib/lead-cookie";
import { processLead } from "@/lib/leads/processLead";
import { toLeadInfoRow } from "@/lib/leads/toLeadInfoRow";
import { setMerciCookie } from "@/lib/merci-cookie";
import type { Recommendation } from "@/lib/segmentation/types";
import { insertLeadCom, insertLeadInfo } from "@/lib/supabase/leads";
import { getFormSchema, utmSchema } from "@/lib/validations";
import { FUNNEL_TYPES, type FunnelType } from "@/types/lead";

const funnelTypeSchema = z.enum(FUNNEL_TYPES);

function invalid(error: z.ZodError): SubmitLeadResult {
  return {
    ok: false,
    message:
      "Certaines réponses sont invalides — merci de vérifier le formulaire.",
    errors: z.flattenError(error).fieldErrors,
  };
}

export type SubmitLeadResult =
  | { ok: true; recommendation: Recommendation | null }
  | {
      ok: false;
      message: string;
      errors?: Record<string, string[] | undefined>;
    };

/**
 * Soumission unique du parcours (écran coordonnées) : revalidation serveur du
 * formulaire complet, insertion `funnel_cvm_mlr_info` puis
 * `funnel_cvm_mlr_com` (réponses + recommendation + completed), pose des
 * cookies lead (signé — autorise l'update `answers.suite` de l'écran final)
 * et merci (fallback accès direct). Stateless — pas d'email, pas de webhook,
 * pas de scoring (hors scope). La recommendation est retournée au client
 * pour rendre l'écran final sans nouvel aller-retour.
 */
export async function submitLead(
  funnelType: FunnelType,
  raw: unknown,
  utmRaw: unknown,
): Promise<SubmitLeadResult> {
  const type = funnelTypeSchema.safeParse(funnelType);
  if (!type.success) {
    return { ok: false, message: "Demande invalide." };
  }

  const parsed = getFormSchema(type.data).safeParse(raw);
  if (!parsed.success) {
    return invalid(parsed.error);
  }

  const utm = utmSchema.safeParse(utmRaw);
  const row = toLeadInfoRow(
    type.data,
    parsed.data,
    utm.success ? utm.data : null,
  );

  const inserted = await insertLeadInfo(row);
  if (!inserted.ok) {
    return {
      ok: false,
      message:
        "L'enregistrement est momentanément indisponible. Merci de réessayer dans quelques instants.",
    };
  }

  // Réponses + recommendation : un échec ici ne perd jamais le lead info.
  const processed = processLead(type.data, parsed.data);
  const recommendation = processed.ok ? processed.recommendation : null;
  if (processed.ok) {
    const saved = await insertLeadCom({
      lead_id: inserted.id,
      answers: processed.data,
      recommendation,
      completed: true,
    });
    if (!saved.ok) {
      console.error(
        "[submitLead] réponses non enregistrées (lead conservé) :",
        inserted.id,
      );
    }
  } else {
    console.error("[submitLead] qualification invalide (lead conservé) :", inserted.id);
  }

  await setLeadCookie({ id: inserted.id, funnelType: type.data });
  await setMerciCookie({
    nom: typeof parsed.data.nom === "string" ? parsed.data.nom : "",
    prenom:
      typeof parsed.data.prenom === "string" ? parsed.data.prenom : undefined,
    funnelType: type.data,
    recommandation:
      typeof recommendation?.libelle === "string"
        ? recommendation.libelle
        : undefined,
    recommandationHref:
      typeof recommendation?.href === "string" ? recommendation.href : undefined,
  });

  return { ok: true, recommendation };
}
