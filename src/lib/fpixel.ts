declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

// Une fonction helper réutilisable
export const fbEvent = (eventName: string, options?: Record<string, unknown>) => {
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("track", eventName, options);
  }
};
