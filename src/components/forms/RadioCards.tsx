"use client";

import { useFormContext } from "react-hook-form";
import { cn } from "@/lib/cn";
import type { ChoiceOption } from "@/types/funnel";
import { FieldError } from "./FieldError";
import { PrecisionField } from "./PrecisionField";

type Props = {
  name: string;
  options: ChoiceOption[];
  labelledBy: string;
};

/** Grandes cartes radio tactiles, mobile-first — une décision par écran. */
export function RadioCards({ name, options, labelledBy }: Props) {
  const { register, watch } = useFormContext();
  const selected: unknown = watch(name);
  const freeTextActive = options.some(
    (option) => option.freeText === true && option.value === selected,
  );

  return (
    <div role="radiogroup" aria-labelledby={labelledBy} className="grid gap-3">
      {options.map((option) => {
        const isSelected = option.value === selected;
        return (
          <label
            key={option.value}
            className={cn(
              "flex cursor-pointer items-center gap-3 rounded-xl border-2 bg-card p-4 transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-accent",
              isSelected ? "border-accent" : "border-line hover:border-accent-soft",
            )}
          >
            <input
              type="radio"
              value={option.value}
              {...register(name)}
              className="sr-only"
            />
            <span
              aria-hidden
              className={cn(
                "h-4 w-4 shrink-0 rounded-full border-2 transition-colors",
                isSelected ? "border-accent bg-accent" : "border-line",
              )}
            />
            <span className="text-sm leading-snug sm:text-base">{option.label}</span>
          </label>
        );
      })}
      {freeTextActive && <PrecisionField name={`${name}Precision`} />}
      <FieldError name={name} />
    </div>
  );
}
