import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/** Pastille de libellé (sous-univers, routes, repères). */
export function Pill({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-line bg-card px-3 py-1 text-xs font-medium text-ink-soft",
        className,
      )}
    >
      {children}
    </span>
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
