import { getFunnelConfig } from "@/config/funnels";
import type { FunnelType } from "@/types/lead";
import { LeadFunnel } from "./LeadFunnel";

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
      {/* La note tarifaire (intro.note) est affichée par LeadFunnel, sous le
          CTA d'enregistrement de l'étape 1 — pas dans l'en-tête. */}
      <header className="mb-8">
        <Heading className="font-heading text-3xl font-bold leading-tight text-ink-strong">
          {config.intro.titre}
        </Heading>
        <p className="mt-2 text-ink-soft">{config.intro.sousTitre}</p>
      </header>
      <LeadFunnel funnelType={funnelType} defaultValues={defaultValues} />
    </>
  );
}
