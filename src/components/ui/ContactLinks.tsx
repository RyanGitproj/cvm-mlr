"use client";

import type { ReactNode } from "react";
import { contact } from "@/config/site";
import { pushDataLayerEvent } from "@/lib/tracking/gtm";

/**
 * CTA secondaires irréversibles centralisés (brief §9.4). Point unique de
 * tracking des clics tel/email : l'event est poussé ici, jamais dupliqué dans
 * les pages. Tant que la coordonnée n'est pas configurée (config/site.ts), le
 * lien n'est pas rendu — aucune valeur inventée.
 */

export function PhoneLink({
  className,
  children,
  onClick,
}: {
  className?: string;
  children?: ReactNode;
  /** Action complémentaire au clic (le tracking reste toujours poussé). */
  onClick?: () => void;
}) {
  if (contact.telephone === null) return null;
  return (
    <a
      data-cta="call"
      href={`tel:${contact.telephone}`}
      className={className}
      onClick={() => {
        pushDataLayerEvent("contact_phone_click");
        onClick?.();
      }}
    >
      {children ?? contact.telephone}
    </a>
  );
}

export function MailLink({
  className,
  children,
}: {
  className?: string;
  children?: ReactNode;
}) {
  if (contact.email === null) return null;
  return (
    <a
      data-cta="mail"
      href={`mailto:${contact.email}`}
      className={className}
      onClick={() => pushDataLayerEvent("contact_email_click")}
    >
      {children ?? contact.email}
    </a>
  );
}
