import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Pastille de libellé (sous-univers, routes, repères). Accepte les attributs
 * natifs du span — notamment data-accent pour colorer une offre.
 */
export function Pill({
  className,
  ...props
}: ComponentPropsWithoutRef<"span">) {
  return (
    <span
      {...props}
      className={cn(
        "inline-flex items-center rounded-full border border-line bg-card px-3 py-1 text-xs font-medium text-ink-soft",
        className,
      )}
    />
  );
}

/** Tampon rotatif signature MLR (« exemple de devis — non nominatif »). */
export function Stamp({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "stamp inline-block px-3 py-1 text-xs font-bold text-accent",
        className,
      )}
    >
      {children}
    </span>
  );
}
