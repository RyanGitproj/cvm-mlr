"use client";

import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";
import { pushDataLayerEvent } from "@/lib/tracking/gtm";

type Props = ComponentPropsWithoutRef<typeof Link> & {
  /** Nom de l'event dataLayer poussé au clic (`select_univers`, `cta_click`…). */
  event: string;
  eventParams?: Record<string, unknown>;
};

/**
 * `next/link` tracé : pousse un event dataLayer au clic puis laisse la
 * navigation se faire. Point unique des navigations mesurées — jamais
 * d'`onClick` de tracking dupliqué dans les pages (méthode gtm-tracking-setup).
 */
export function TrackedLink({ event, eventParams, onClick, ...props }: Props) {
  return (
    <Link
      {...props}
      onClick={(mouseEvent) => {
        pushDataLayerEvent(event, eventParams);
        onClick?.(mouseEvent);
      }}
    />
  );
}
