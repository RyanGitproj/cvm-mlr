"use server";

import { z } from "zod";
import { setLeadCookie } from "@/lib/lead-cookie";
import { processLead } from "@/lib/leads/processLead";
import { toLeadRow } from "@/lib/leads/toLeadRow";
import { setMerciCookie } from "@/lib/merci-cookie";
import type { Recommendation } from "@/lib/segmentation/types";
import { getLeadTampon, insertLead } from "@/lib/supabase/leads";
import { readTamponCookie } from "@/lib/tampon-cookie";
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
 * Soumission unique depuis la dernière décision : les réponses sont
 * revalidées avec les coordonnées relues dans `funnel_leads_tampon`, puis un
 * INSERT est réalisé dans `funnel_cvm_mlr_leads` avec la relation entre les
 * deux lignes. Les cookies lead et merci permettent ensuite l'écran final et
 * sa suite. Aucun contact envoyé par le navigateur n'est pris comme source de
 * vérité. La recommendation est retournée au client sans nouvel aller-retour.
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

  const tamponId = await readTamponCookie();
  if (tamponId === null) {
    return {
      ok: false,
      message:
        "Vos coordonnées initiales sont introuvables. Revenez à l’accueil pour reprendre votre parcours.",
    };
  }
  const tampon = await getLeadTampon(tamponId);
  if (!tampon.ok) {
    return {
      ok: false,
      message:
        "Nous ne retrouvons pas vos coordonnées. Revenez à l’accueil pour les enregistrer à nouveau.",
    };
  }

  const answers =
    typeof raw === "object" && raw !== null
      ? (raw as Record<string, unknown>)
      : {};
  const parsed = getFormSchema(type.data).safeParse({
    ...answers,
    ...tampon.contact,
  });
  if (!parsed.success) {
    return invalid(parsed.error);
  }

  const utmClient = utmSchema.safeParse(utmRaw);
  // Attribution : les UTM enregistrées avec le tampon (premier touchpoint,
  // écrites dès le sas d'entrée) priment ; celles du navigateur complètent
  // les tampons antérieurs à la capture (sessionStorage encore disponible).
  const utm: typeof tampon.utm = {
    ...(utmClient.success ? utmClient.data : null),
    ...tampon.utm,
  };

  // Qualification + recommendation : un échec ici (théorique, le parcours
  // vient d'être validé) ne perd jamais le lead — colonnes qualif à NULL.
  const processed = processLead(type.data, parsed.data);
  const recommendation = processed.ok ? processed.recommendation : null;

  const row = toLeadRow(
    type.data,
    parsed.data,
    utm,
    processed.ok ? processed.qualif : EMPTY_QUALIF,
    tamponId,
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
