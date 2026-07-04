"use client";

import { useEffect } from "react";
import { pushDataLayerEventOnce } from "@/lib/tracking/gtm";
import type { Brand, FunnelType } from "@/types/lead";

/**
 * Event de conversion posé sur `/merci`, uniquement quand le cookie confirme une
 * vraie soumission (accès direct sans cookie → composant non rendu). Dédupliqué
 * par session pour ne pas recompter un rechargement de la page de confirmation.
 */
export function LeadConversionTracker({
  funnelType,
  brand,
}: {
  funnelType: FunnelType;
  brand: Brand;
}) {
  useEffect(() => {
    pushDataLayerEventOnce(`lead_submitted_${funnelType}`, "lead_submitted", {
      funnel_type: funnelType,
      brand,
    });
  }, [funnelType, brand]);

  return null;
}
