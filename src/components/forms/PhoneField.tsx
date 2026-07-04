"use client";

import "react-phone-number-input/style.css";
import { forwardRef, type InputHTMLAttributes } from "react";
import { Controller, useFormContext } from "react-hook-form";
import PhoneInput from "react-phone-number-input";
import { cn } from "@/lib/cn";
import { FieldError } from "./FieldError";

/**
 * Input interne de `react-phone-number-input` : transparent, sans cadre propre.
 * La bordure, le fond et le rayon sont portés par le conteneur `PhoneInput`
 * (sélecteur d'indicatif + saisie partagent un seul cadre, aligné sur
 * `INPUT_CLASS`). La `className` explicite écrase celle passée par la lib.
 */
const PhoneNumberInput = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement>
>((props, ref) => (
  <input
    {...props}
    ref={ref}
    className="min-w-0 flex-1 bg-transparent py-3 pr-4 text-base text-ink outline-none placeholder:text-ink-soft/60"
  />
));
PhoneNumberInput.displayName = "PhoneNumberInput";

/**
 * Champ téléphone normé (méthode de réf. `gtm-tracking-setup` / landing) :
 * sélecteur d'indicatif pays + formatage à la saisie, valeur stockée au format
 * international E.164 (`+33…`). Défaut France, la validation E.164 vit dans le
 * schéma Zod partagé (`commonLeadSchema.telephone`).
 */
export function PhoneField({ name, label }: { name: string; label: string }) {
  const {
    control,
    formState: { errors },
  } = useFormContext();
  const hasError = Boolean(errors[name]);

  return (
    <div className="grid gap-1.5">
      <label htmlFor={name} className="text-sm font-medium text-ink-strong">
        {label}
      </label>
      <Controller
        control={control}
        name={name}
        defaultValue=""
        render={({ field }) => (
          <PhoneInput
            id={name}
            defaultCountry="FR"
            placeholder="06 12 34 56 78"
            value={field.value}
            onChange={(value) => field.onChange(value ?? "")}
            onBlur={field.onBlur}
            inputComponent={PhoneNumberInput}
            autoComplete="tel"
            className={cn(
              "flex items-center rounded-lg border-2 bg-card pl-3 transition-colors focus-within:border-accent",
              hasError ? "border-danger" : "border-line",
            )}
          />
        )}
      />
      <FieldError name={name} />
    </div>
  );
}
