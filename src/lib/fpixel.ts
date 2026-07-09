declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
  }
}

// Une fonction helper réutilisable
export const fbEvent = (eventName: string, options?: Record<string, any>) => {
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("track", eventName, options);
  }
};
