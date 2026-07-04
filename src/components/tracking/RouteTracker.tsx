"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { pushDataLayerEvent } from "@/lib/tracking/gtm";

/**
 * Pousse `page_view` à chaque navigation App Router. Monté une seule fois dans
 * le layout racine — capte les changements de route côté client que la balise
 * GA4 seule ne verrait pas (navigation SPA sans rechargement).
 */
export function RouteTracker() {
  const pathname = usePathname();

  useEffect(() => {
    pushDataLayerEvent("page_view", { page_path: pathname });
  }, [pathname]);

  return null;
}
