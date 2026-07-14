/**
 * Capture "tracking-ready" (brief §9.4) : on stocke les UTM du premier
 * touchpoint en sessionStorage pour les écrire en base avec le lead.
 * Aucun pixel, aucun dataLayer — le tracking lui-même est hors scope.
 */

const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
] as const;

export type UtmData = Partial<Record<(typeof UTM_KEYS)[number], string>> & {
  referrer?: string;
};

const STORAGE_KEY = "funnel_utm";

export function captureUtm(): void {
  try {
    if (sessionStorage.getItem(STORAGE_KEY) !== null) return;
    const params = new URLSearchParams(window.location.search);
    const utm: UtmData = {};
    for (const key of UTM_KEYS) {
      const value = params.get(key);
      if (value !== null && value !== "") utm[key] = value;
    }
    if (document.referrer !== "") utm.referrer = document.referrer;
    if (Object.keys(utm).length === 0) return;
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(utm));
  } catch {
    // Le formulaire reste utilisable si le navigateur bloque le stockage web.
  }
}

export function readUtm(): UtmData | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (raw === null) return null;
    return JSON.parse(raw) as UtmData;
  } catch {
    return null;
  }
}
