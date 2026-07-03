import type { ReactNode } from "react";
import { contact } from "@/config/site";

/**
 * CTA secondaires irréversibles centralisés (brief §9.4, tracking-ready).
 * Tant que la coordonnée n'est pas configurée (config/site.ts), le lien
 * n'est pas rendu — aucune valeur inventée.
 */

export function PhoneLink({
  className,
  children,
}: {
  className?: string;
  children?: ReactNode;
}) {
  if (contact.telephone === null) return null;
  return (
    <a data-cta="call" href={`tel:${contact.telephone}`} className={className}>
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
    <a data-cta="mail" href={`mailto:${contact.email}`} className={className}>
      {children ?? contact.email}
    </a>
  );
}
