/**
 * Point de sortie unique des events vers le dataLayer GTM (tracking-ready →
 * tracking actif). GA4 est branché côté GTM, jamais dans le repo : ici on ne
 * fait que pousser des events. No-op côté serveur.
 */

type DataLayerEvent = { event: string; [key: string]: unknown };

declare global {
  interface Window {
    dataLayer?: DataLayerEvent[];
  }
}

/** Pousse un event dans le dataLayer GTM. No-op côté serveur (SSR). */
export function pushDataLayerEvent(
  event: string,
  params?: Record<string, unknown>,
): void {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push({ event, ...params });
}

/**
 * Pousse un event au plus une fois par session (dédup via sessionStorage) —
 * pour les jalons non répétables : `funnel_start`, conversion. Évite les
 * doublons si l'utilisateur revient sur l'écran ou recharge la page merci.
 */
export function pushDataLayerEventOnce(
  dedupKey: string,
  event: string,
  params?: Record<string, unknown>,
): void {
  if (typeof window === "undefined") return;
  if (sessionStorage.getItem(dedupKey) !== null) return;
  sessionStorage.setItem(dedupKey, "1");
  pushDataLayerEvent(event, params);
}
