/**
 * Brouillon de parcours persisté côté navigateur.
 *
 * Le wizard `LeadFunnel` garde son état (écran + réponses) en mémoire React et
 * n'écrit le lead qu'au submit final. Dans les navigateurs in-app (webview
 * Meta/Google, iOS comme Android), un rechargement du document remet le
 * parcours à zéro et fait perdre le visiteur avant l'enregistrement. On
 * sérialise donc le brouillon dans `localStorage` pour le restaurer après un
 * reload — stockage strictement fonctionnel (saisie de l'utilisateur), donc
 * exempté de consentement, borné par un TTL court et effacé au submit.
 *
 * Découpage : logique pure (clé, encode/decode, TTL) testable sans mock ;
 * accès storage isolé dans de fins wrappers gardés (dégradation propre si
 * `localStorage` est indisponible — mode privé strict).
 */
import type { UtmData } from "@/lib/utm";

/** Version du format : un incrément invalide les brouillons d'un ancien schéma. */
const VERSION = 1 as const;

/** Durée de vie d'un brouillon (6 h) — borne le PII au repos. */
export const DRAFT_TTL_MS = 6 * 60 * 60 * 1000;

const KEY_PREFIX = "funnel-draft";

export type LeadDraft = {
  v: typeof VERSION;
  savedAt: number;
  screenIndex: number;
  values: Record<string, unknown>;
  utm: UtmData | null;
};

/**
 * Clé de stockage. La route (MLR) fait partie de la clé : un brouillon `/mlr`
 * générique ne doit pas se restaurer sur `/mlr/nord`, où l'écran route est
 * sauté et les index d'écran diffèrent.
 */
export function draftKey(funnelType: string, route?: string): string {
  return `${KEY_PREFIX}:${funnelType}:${route ?? ""}`;
}

export function createDraft(
  screenIndex: number,
  values: Record<string, unknown>,
  utm: UtmData | null,
  now: number,
): LeadDraft {
  return { v: VERSION, savedAt: now, screenIndex, values, utm };
}

export function encodeDraft(draft: LeadDraft): string {
  return JSON.stringify(draft);
}

/**
 * Décode un brouillon sérialisé. Renvoie `null` (jamais d'exception) si l'entrée
 * est absente, corrompue, d'une version inconnue, mal formée, ou expirée
 * (`now - savedAt > DRAFT_TTL_MS`). `now` est injecté pour rester pur/testable.
 */
export function decodeDraft(raw: string | null, now: number): LeadDraft | null {
  if (raw === null) return null;

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return null;
  }
  if (typeof parsed !== "object" || parsed === null) return null;

  const record = parsed as Record<string, unknown>;
  if (record.v !== VERSION) return null;
  if (typeof record.savedAt !== "number") return null;
  if (typeof record.screenIndex !== "number") return null;
  if (typeof record.values !== "object" || record.values === null) return null;
  if (now - record.savedAt > DRAFT_TTL_MS) return null;

  const utm =
    typeof record.utm === "object" && record.utm !== null
      ? (record.utm as UtmData)
      : null;

  return {
    v: VERSION,
    savedAt: record.savedAt,
    screenIndex: record.screenIndex,
    values: record.values as Record<string, unknown>,
    utm,
  };
}

function localStore(): Storage | null {
  try {
    if (typeof window === "undefined") return null;
    return window.localStorage;
  } catch {
    // Accès à localStorage refusé (mode privé strict, cookies bloqués).
    return null;
  }
}

export function readDraft(key: string, now: number): LeadDraft | null {
  const store = localStore();
  if (store === null) return null;
  try {
    return decodeDraft(store.getItem(key), now);
  } catch {
    return null;
  }
}

export function writeDraft(key: string, draft: LeadDraft): void {
  const store = localStore();
  if (store === null) return;
  try {
    store.setItem(key, encodeDraft(draft));
  } catch {
    // Quota dépassé ou écriture refusée : le parcours continue sans filet.
  }
}

export function clearDraft(key: string): void {
  const store = localStore();
  if (store === null) return;
  try {
    store.removeItem(key);
  } catch {
    // Rien à faire : au pire le brouillon expirera via son TTL.
  }
}
