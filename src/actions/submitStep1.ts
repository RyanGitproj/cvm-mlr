"use server";

import { z } from "zod";
import { toLeadStep1Row } from "@/lib/leads/toLeadStep1Row";
import { setLeadCookie } from "@/lib/lead-cookie";
import { setMerciCookie } from "@/lib/merci-cookie";
import { insertLeadStep1 } from "@/lib/supabase/leads";
import { getStep1Schema, utmSchema } from "@/lib/validations";
import { FUNNEL_TYPES, type FunnelType } from "@/types/lead";

const funnelTypeSchema = z.enum(FUNNEL_TYPES);

export type SubmitStep1Result =
  | { ok: true }
  | {
      ok: false;
      message: string;
      errors?: Record<string, string[] | undefined>;
    };

/**
 * Étape 1 : revalidation serveur (contact + offre), insertion table
 * `funnel_cvm_mlr_info`,
 * pose du cookie de session lead (signé) + cookie merci de base (sans reco).
 * Stateless — pas d'email, pas de webhook, pas de scoring (hors scope).
 */
export async function submitStep1(
  funnelType: FunnelType,
  raw: unknown,
  utmRaw: unknown,
): Promise<SubmitStep1Result> {
  const type = funnelTypeSchema.safeParse(funnelType);
  if (!type.success) {
    return { ok: false, message: "Demande invalide." };
  }

  const parsed = getStep1Schema(type.data).safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      message: "Certaines réponses sont invalides — merci de vérifier le formulaire.",
      errors: z.flattenError(parsed.error).fieldErrors,
    };
  }

  const utm = utmSchema.safeParse(utmRaw);
  const row = toLeadStep1Row(
    type.data,
    parsed.data,
    utm.success ? utm.data : null,
  );

  const inserted = await insertLeadStep1(row);
  if (!inserted.ok) {
    return {
      ok: false,
      message:
        "L'enregistrement est momentanément indisponible. Merci de réessayer dans quelques instants.",
    };
  }

  await setLeadCookie({ id: inserted.id, funnelType: type.data });
  await setMerciCookie({
    nom: typeof parsed.data.nom === "string" ? parsed.data.nom : "",
    prenom: typeof parsed.data.prenom === "string" ? parsed.data.prenom : undefined,
    funnelType: type.data,
  });

  return { ok: true };
}
