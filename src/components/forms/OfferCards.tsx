"use client";

import { useFormContext } from "react-hook-form";
import { offerOptionsFor } from "@/config/offers";
import { cn } from "@/lib/cn";
import type { FunnelType } from "@/types/lead";
import { FieldError } from "./FieldError";

/**
 * Choix de formule (composant a) — rangée compacte 1 ligne / 3 colonnes,
 * conservée même à 390px (typo réduite en mobile). Les options viennent de
 * la config partagée (offerOptionsFor) alignée sur l'enum Zod `offreDuree`.
 */
export function OfferCards({
  funnelType,
  labelledBy,
}: {
  funnelType: FunnelType;
  labelledBy: string;
}) {
  const { register, watch } = useFormContext();
  const options = offerOptionsFor(funnelType);
  const selected: unknown = watch("offreDuree");

  return (
    <div className="grid gap-1.5">
      <div
        role="radiogroup"
        aria-labelledby={labelledBy}
        className="grid grid-cols-3 gap-2 sm:gap-3"
      >
        {options.map((option) => {
          const isSelected = option.value === selected;
          return (
            <label
              key={option.value}
              className={cn(
                "flex cursor-pointer flex-col gap-1 rounded-xl border-2 bg-card p-2.5 transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-accent sm:p-4",
                isSelected ? "border-accent" : "border-line hover:border-accent-soft",
              )}
            >
              <input
                type="radio"
                value={option.value}
                {...register("offreDuree")}
                className="sr-only"
              />
              <span className="text-[11px] font-semibold uppercase tracking-wide text-accent sm:text-xs">
                {option.label}
              </span>
              <span
                className={cn(
                  "font-heading",
                  option.priceText !== null
                    ? "text-base font-bold text-ink-strong sm:text-xl"
                    : "text-sm text-ink-soft sm:text-base",
                )}
              >
                {option.priceText ?? "Sur mesure"}
              </span>
            </label>
          );
        })}
      </div>
      <FieldError name="offreDuree" />
    </div>
  );
}
