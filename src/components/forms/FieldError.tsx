"use client";

import { useFormContext } from "react-hook-form";

export function FieldError({ name }: { name: string }) {
  const {
    formState: { errors },
  } = useFormContext();
  const message = errors[name]?.message;
  if (typeof message !== "string") return null;
  return (
    <p role="alert" className="text-sm font-medium text-danger">
      {message}
    </p>
  );
}
