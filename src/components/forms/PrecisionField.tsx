"use client";

import { useFormContext } from "react-hook-form";
import type { ChoiceOption } from "@/types/funnel";
import { FieldError } from "./FieldError";
import { INPUT_CLASS } from "./field-styles";

type Props = {
  name: string;
  /** Variante numérique (« Plus de 4 » → effectif approximatif du groupe). */
  number?: ChoiceOption["precisionInput"];
};

/**
 * Champ révélé par une option `freeText` : texte libre (« Autre — je
 * précise ») par défaut, ou nombre avec libellé visible quand l'option
 * porte un `precisionInput` (« Plus de 4 » → « Combien serez-vous
 * environ ? »).
 */
export function PrecisionField({ name, number }: Props) {
  const { register } = useFormContext();

  if (number) {
    return (
      <div className="grid gap-1.5">
        <label htmlFor={name} className="text-sm font-medium text-ink-strong">
          {number.label}
        </label>
        <input
          id={name}
          type="number"
          inputMode="numeric"
          min={number.min}
          max={number.max}
          placeholder={number.placeholder}
          {...register(name)}
          className={INPUT_CLASS}
        />
        <FieldError name={name} />
      </div>
    );
  }

  return (
    <div className="grid gap-1.5">
      <input
        id={name}
        type="text"
        aria-label="Je précise"
        placeholder="Je précise…"
        {...register(name)}
        className={INPUT_CLASS}
      />
      <FieldError name={name} />
    </div>
  );
}
