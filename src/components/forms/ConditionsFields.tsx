"use client";

import type { Acceptance } from "@/types/funnel";
import { CheckboxField } from "./CheckboxField";

/**
 * Acceptations réglementaires de l'écran coordonnées (Explorer : certificat
 * médical, briefing sécurité) — cases obligatoires, jamais pré-cochées.
 */
export function ConditionsFields({ acceptances }: { acceptances: Acceptance[] }) {
  return (
    <div className="grid gap-4">
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
