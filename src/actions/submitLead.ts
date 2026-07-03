"use server";

import { z } from "zod";
import { processLead } from "@/lib/leads/processLead";
import { toLeadRow } from "@/lib/leads/toLeadRow";
import { setMerciCookie } from "@/lib/merci-cookie";
import { insertLead } from "@/lib/supabase/leads";
import { utmSchema } from "@/lib/validations";
import { FUNNEL_TYPES, type FunnelType } from "@/types/lead";

const funnelTypeSchema = z.enum(FUNNEL_TYPES);

export type SubmitLeadResult =
  | { ok: true }
  | {
      ok: false;
      message: string;
      errors?: Record<string, string[] | undefined>;
    };

/**
 * Fin de chaîne du projet (brief §9.2) : revalidation serveur, segmentation,
 * écriture Supabase, cookie merci. Stateless — pas d'email, pas de webhook,
 * pas de scoring : hors scope, géré par l'équipe aval.
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

  const processed = processLead(type.data, raw);
  if (!processed.ok) {
    return {
      ok: false,
      message: "Certaines réponses sont invalides — merci de vérifier le formulaire.",
      errors: processed.errors,
    };
  }

  const utm = utmSchema.safeParse(utmRaw);
  const row = toLeadRow(
    type.data,
    processed.data,
    processed.recommendation,
    utm.success ? utm.data : null,
  );

  const inserted = await insertLead(row);
  if (!inserted.ok) {
    return {
      ok: false,
      message:
        "L'enregistrement est momentanément indisponible. Merci de réessayer dans quelques instants.",
    };
  }

  const reco = processed.recommendation;
  await setMerciCookie({
    prenom:
      typeof processed.data.prenom === "string" ? processed.data.prenom : "",
    funnelType: type.data,
    recommandation:
      typeof reco?.libelle === "string" ? reco.libelle : undefined,
    recommandationHref: typeof reco?.href === "string" ? reco.href : undefined,
  });

  return { ok: true };
}
