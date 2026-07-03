import { getFunnelConfig } from "@/config/funnels";
import type { FunnelType } from "@/types/lead";
import { MultiStepForm } from "./MultiStepForm";

type Props = {
  funnelType: FunnelType;
  defaultValues?: Record<string, string>;
  /** h1 sur page dédiée (défaut), h2 quand le formulaire est intégré sous un Hero. */
  headingLevel?: "h1" | "h2";
};

/** En-tête d'entrée du questionnaire (titre, promesse, note) + formulaire. */
export function Questionnaire({
  funnelType,
  defaultValues,
  headingLevel: Heading = "h1",
}: Props) {
  const config = getFunnelConfig(funnelType);
  return (
    <>
      <header className="mb-8">
        <Heading className="font-heading text-3xl font-bold leading-tight text-ink-strong">
          {config.intro.titre}
        </Heading>
        <p className="mt-2 text-ink-soft">{config.intro.sousTitre}</p>
        {config.intro.note && (
          <p className="mt-4 rounded-lg border-2 border-accent-soft bg-surface-2 px-4 py-3 text-sm text-ink-soft">
            {config.intro.note}
          </p>
        )}
      </header>
      <MultiStepForm funnelType={funnelType} defaultValues={defaultValues} />
    </>
  );
}
