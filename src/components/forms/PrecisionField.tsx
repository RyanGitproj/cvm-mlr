"use client";

import { useFormContext } from "react-hook-form";
import { FieldError } from "./FieldError";
import { INPUT_CLASS } from "./field-styles";

/** Champ texte révélé par l'option « Autre — je précise » d'une question. */
export function PrecisionField({ name }: { name: string }) {
  const { register } = useFormContext();
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
