import type { Brand } from "@/types/lead";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

/**
 * Catégorie Meta par marque — partagée entre les ViewContent des pages et
 * le Lead du funnel, pour que les événements s'agrègent sous les mêmes
 * libellés dans Ads Manager.
 */
export const FB_CONTENT_CATEGORY: Record<Brand, string> = {
  cvm: "Celebrations voyages",
  mlr: "Madagascar Liberty Roots",
};

// Une fonction helper réutilisable
export const fbEvent = (eventName: string, options?: Record<string, unknown>) => {
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("track", eventName, options);
  }
};
