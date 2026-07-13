"use server";

import { insertLeadTampon } from "@/lib/supabase/leads";
import { setTamponCookie } from "@/lib/tampon-cookie";
import { visitorProfileSchema } from "@/lib/validations/visitorProfile";

export type SubmitLeadTamponResult =
  | { ok: true }
  | { ok: false; message: string };

/**
 * Premier point de collecte : valide et insère les coordonnées dans
 * `funnel_leads_tampon`, puis conserve l'id côté serveur pour le rattacher à
 * l'INSERT final dans `funnel_cvm_mlr_leads`.
 */
export async function submitLeadTampon(
  raw: unknown,
): Promise<SubmitLeadTamponResult> {
  const parsed = visitorProfileSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      message: "Certaines informations sont invalides. Merci de les vérifier.",
    };
  }

  const inserted = await insertLeadTampon({
    nom: parsed.data.nom,
    prenom: parsed.data.prenom,
    telephone: parsed.data.telephone,
    email: parsed.data.email,
    temperature: parsed.data.intention,
    depart_prevue: parsed.data.echeance,
    consentement: parsed.data.consentement,
  });
  if (!inserted.ok) {
    return {
      ok: false,
      message:
        "L’enregistrement est momentanément indisponible. Merci de réessayer.",
    };
  }

  await setTamponCookie(inserted.id);
  return { ok: true };
}
