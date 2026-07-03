import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/cn";

// Rectangles arrondis en capitales espacées — style des CTA des visuels
// sources (funnel 8 visuels + brochure CVM), pas de pill.
const BASE =
  "inline-flex items-center justify-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold uppercase tracking-wide transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:pointer-events-none disabled:opacity-60 motion-safe:transition-transform motion-safe:hover:-translate-y-0.5";

const VARIANTS = {
  primary: "bg-accent text-accent-contrast hover:bg-accent-soft",
  outline: "border-2 border-accent bg-transparent text-ink hover:bg-surface-2",
  ghost: "text-ink hover:bg-surface-2",
} as const;

export type ButtonVariant = keyof typeof VARIANTS;

/** Classes partagées des CTA (Button, ButtonLink, ScrollCtaLink). */
export function buttonClasses(
  variant: ButtonVariant = "primary",
  className?: string,
) {
  return cn(BASE, VARIANTS[variant], className);
}

type ButtonProps = ComponentPropsWithoutRef<"button"> & {
  variant?: ButtonVariant;
};

export function Button({ variant = "primary", className, ...props }: ButtonProps) {
  return <button {...props} className={buttonClasses(variant, className)} />;
}

type ButtonLinkProps = ComponentPropsWithoutRef<typeof Link> & {
  variant?: ButtonVariant;
};

export function ButtonLink({
  variant = "primary",
  className,
  ...props
}: ButtonLinkProps) {
  return <Link {...props} className={buttonClasses(variant, className)} />;
}
