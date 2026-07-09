"use server";

import { z } from "zod";
import { setLeadCookie } from "@/lib/lead-cookie";
import { processLead } from "@/lib/leads/processLead";
import { toLeadRow } from "@/lib/leads/toLeadRow";
import { setMerciCookie } from "@/lib/merci-cookie";
import type { Recommendation } from "@/lib/segmentation/types";
import { insertLead } from "@/lib/supabase/leads";
import { getFormSchema, utmSchema } from "@/lib/validations";
import { EMPTY_QUALIF, FUNNEL_TYPES, type FunnelType } from "@/types/lead";

const funnelTypeSchema = z.enum(FUNNEL_TYPES);

function invalid(error: z.ZodError): SubmitLeadResult {
  return {
    ok: false,
    message:
      "Certaines réponses sont invalides, merci de vérifier le formulaire.",
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
 * formulaire complet, INSERT unique dans la table plate `funnel_cvm_mlr_leads`
 * (contact + offre + colonnes de qualification + recommendation), pose des
 * cookies lead (signé — autorise l'update de la colonne `suite` depuis
 * l'écran final) et merci (fallback accès direct). Stateless — pas d'email,
 * pas de webhook, pas de scoring (hors scope). La recommendation est
 * retournée au client pour rendre l'écran final sans nouvel aller-retour.
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

  // Qualification + recommendation : un échec ici (théorique, le parcours
  // vient d'être validé) ne perd jamais le lead — colonnes qualif à NULL.
  const processed = processLead(type.data, parsed.data);
  const recommendation = processed.ok ? processed.recommendation : null;

  const row = toLeadRow(
    type.data,
    parsed.data,
    utm.success ? utm.data : null,
    processed.ok ? processed.qualif : EMPTY_QUALIF,
  );

  const inserted = await insertLead(row);
  if (!inserted.ok) {
    return {
      ok: false,
      message:
        "L'enregistrement est momentanément indisponible. Merci de réessayer dans quelques instants.",
    };
  }
  if (!processed.ok) {
    console.error(
      "[submitLead] qualification invalide (lead conservé, qualif à NULL) :",
      inserted.id,
    );
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
