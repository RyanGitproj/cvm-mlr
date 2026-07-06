"use client";

import type { Acceptance } from "@/types/funnel";
import { CheckboxField } from "./CheckboxField";
import { TextField } from "./TextField";

/**
 * Écran conditions (étape 2, Explorer) : âge facultatif + acceptations
 * obligatoires (certificat médical, briefing sécurité). Collecté en étape 2
 * car ces champs sont spécifiques au funnel (pas dans les colonnes contact).
 */
export function ConditionsFields({
  includeAge = false,
  acceptances,
}: {
  includeAge?: boolean;
  acceptances: Acceptance[];
}) {
  return (
    <div className="grid gap-4">
      {includeAge && (
        <TextField name="age" label="Âge" type="number" min={16} max={99} optional />
      )}
      {acceptances.map((acceptance) => (
        <CheckboxField
          key={acceptance.name}
          name={acceptance.name}
          label={acceptance.label}
        />
      ))}
    </div>
  );
}
