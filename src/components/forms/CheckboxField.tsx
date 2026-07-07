"use client";

import type { ReactNode } from "react";
import { useFormContext } from "react-hook-form";
import { FieldError } from "./FieldError";

/** Case à cocher isolée (consentement RGPD, acceptations Explorer). */
export function CheckboxField({ name, label }: { name: string; label: ReactNode }) {
  const { register } = useFormContext();
  return (
    <div className="grid gap-1.5">
      <label className="flex cursor-pointer items-start gap-2.5">
        <input
          type="checkbox"
          {...register(name)}
          className="mt-0.5 h-4 w-4 shrink-0 accent-accent focus-visible:ring-2 focus-visible:ring-accent"
        />
        <span className="text-sm leading-snug text-ink-soft">{label}</span>
      </label>
      <FieldError name={name} />
    </div>
  );
}
