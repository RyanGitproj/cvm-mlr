import { resolveOffer } from "@/config/offers";
import type { UtmData } from "@/lib/utm";
import type { FunnelType, LeadStep1Row } from "@/types/lead";

const asString = (value: unknown): string =>
  typeof value === "string" ? value : "";

const asOptString = (value: unknown): string | null =>
  typeof value === "string" && value.trim() !== "" ? value : null;

/**
 * Construit la ligne `leads` (étape 1) depuis les données validées du
 * contact + de l'offre. Fonction pure, testable sans mock. L'offre est
 * résolue en label/durée/prix depuis les contenus éditoriaux.
 */
export function toLeadStep1Row(
  funnelType: FunnelType,
  data: Record<string, unknown>,
  utm: UtmData | null,
): LeadStep1Row {
  const offre = resolveOffer(
    funnelType,
    typeof data.offreDuree === "string" ? data.offreDuree : undefined,
  );

  return {
    funnel_type: funnelType,
    brand: funnelType === "mlr" ? "mlr" : "cvm",
    nom: asString(data.nom),
    prenom: asOptString(data.prenom),
    telephone: asString(data.telephone),
    email: asString(data.email),
    nb_voyageurs: typeof data.nbVoyageurs === "number" ? data.nbVoyageurs : null,
    periode: asOptString(data.periode),
    commentaire: asOptString(data.commentaire),
    consentement: data.consentement === true,
    offre_ref: offre?.ref ?? null,
    offre_label: offre?.label ?? null,
    offre_duree: offre?.duree ?? null,
    offre_prix_indicatif: offre?.prixIndicatif ?? null,
    route: typeof data.route === "string" ? data.route : null,
    utm_source: utm?.utm_source ?? null,
    utm_medium: utm?.utm_medium ?? null,
    utm_campaign: utm?.utm_campaign ?? null,
    utm_content: utm?.utm_content ?? null,
    utm_term: utm?.utm_term ?? null,
    referrer: utm?.referrer ?? null,
  };
}
