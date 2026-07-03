"use client";

import { useFormContext } from "react-hook-form";
import { FieldError } from "./FieldError";
import { INPUT_CLASS } from "./field-styles";

type TextFieldProps = {
  name: string;
  label: string;
  type?: "text" | "email" | "tel" | "number";
  placeholder?: string;
  autoComplete?: string;
  optional?: boolean;
  min?: number;
  max?: number;
};

export function TextField({
  name,
  label,
  type = "text",
  placeholder,
  autoComplete,
  optional = false,
  min,
  max,
}: TextFieldProps) {
  const { register } = useFormContext();
  return (
    <div className="grid gap-1.5">
      <label htmlFor={name} className="text-sm font-medium text-ink-strong">
        {label}
        {optional && <span className="text-ink-soft"> (facultatif)</span>}
      </label>
      <input
        id={name}
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        min={min}
        max={max}
        {...register(name)}
        className={INPUT_CLASS}
      />
      <FieldError name={name} />
    </div>
  );
}

type TextAreaFieldProps = {
  name: string;
  label: string;
  placeholder?: string;
  optional?: boolean;
};

export function TextAreaField({
  name,
  label,
  placeholder,
  optional = false,
}: TextAreaFieldProps) {
  const { register } = useFormContext();
  return (
    <div className="grid gap-1.5">
      <label htmlFor={name} className="text-sm font-medium text-ink-strong">
        {label}
        {optional && <span className="text-ink-soft"> (facultatif)</span>}
      </label>
      <textarea
        id={name}
        rows={4}
        placeholder={placeholder}
        {...register(name)}
        className={INPUT_CLASS}
      />
      <FieldError name={name} />
    </div>
  );
}
