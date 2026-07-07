import { resolveOffer } from "@/config/offers";
import type { UtmData } from "@/lib/utm";
import type { FunnelType, LeadInfoRow } from "@/types/lead";

const asString = (value: unknown): string =>
  typeof value === "string" ? value : "";

const asOptString = (value: unknown): string | null =>
  typeof value === "string" && value.trim() !== "" ? value : null;

/** Booléen explicite ou null — null = information non demandée (leads CVM). */
const asOptBool = (value: unknown): boolean | null =>
  typeof value === "boolean" ? value : null;

/**
 * Q4 : radios « 1 »–« 4 » (chaîne) ou « plus » — auquel cas l'effectif
 * approximatif saisi (`nbVoyageursPrecision`, nombre coercé par Zod) fait
 * foi. Conversion centralisée ici.
 */
const asNbVoyageurs = (value: unknown): number | null => {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && /^\d+$/.test(value)) return Number(value);
  return null;
};

const nbVoyageursFrom = (data: Record<string, unknown>): number | null =>
  data.nbVoyageurs === "plus"
    ? asNbVoyageurs(data.nbVoyageursPrecision)
    : asNbVoyageurs(data.nbVoyageurs);

/**
 * Construit la ligne `funnel_cvm_mlr_info` depuis les données validées du
 * parcours complet. Fonction pure, testable sans mock. L'offre est résolue
 * en label/durée/prix depuis les contenus éditoriaux.
 */
export function toLeadInfoRow(
  funnelType: FunnelType,
  data: Record<string, unknown>,
  utm: UtmData | null,
): LeadInfoRow {
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
    nb_voyageurs: nbVoyageursFrom(data),
    // Depuis le gabarit 2026-07-07, seul le « Mois de départ » facultatif
    // MLR alimente cette colonne (la fenêtre Q3 vit dans answers).
    periode: asOptString(data.moisDepart),
    commentaire: asOptString(data.commentaire),
    consentement: data.consentement === true,
    optin_newsletter: asOptBool(data.optinNewsletter),
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
