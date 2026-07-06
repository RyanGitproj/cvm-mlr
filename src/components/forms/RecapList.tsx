"use client";

import { useFormContext } from "react-hook-form";
import type { FunnelConfig } from "@/types/funnel";

/** Résumé des réponses de qualification avant l'envoi final (MLR, étape 2). */
export function RecapList({ config }: { config: FunnelConfig }) {
  const { getValues } = useFormContext();

  const rows = config.qualification.flatMap((step) => {
    const raw: unknown = getValues(step.name);
    const values = Array.isArray(raw) ? (raw as string[]) : [raw];
    const labels = step.options
      .filter((option) => values.includes(option.value))
      .map((option) => option.label);
    if (labels.length === 0) return [];
    return [{ id: step.id, question: step.question, reponse: labels.join(" · ") }];
  });

  return (
    <dl className="grid gap-3">
      {rows.map((row) => (
        <div key={row.id} className="rounded-xl border-2 border-line bg-card p-4">
          <dt className="text-xs font-medium uppercase tracking-wide text-ink-soft">
            {row.question}
          </dt>
          <dd className="mt-1 font-medium text-ink-strong">{row.reponse}</dd>
        </div>
      ))}
    </dl>
  );
}
