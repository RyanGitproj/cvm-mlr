import type { FunnelType } from "@/types/lead";
import { LeadFunnel } from "./LeadFunnel";

type Props = {
  funnelType: FunnelType;
  /** Pré-remplissage (ex. route MLR sur les pages /mlr/{route}). */
  defaultValues?: Record<string, string>;
};

/**
 * Formulaire intégré en bas d'une page de présentation. Cible des CTA de
 * scroll (id stable « questionnaire ») : tabIndex -1 pour recevoir le focus
 * après le défilement, scroll-mt pour ne pas passer sous le header. Fond
 * distinct : la page se « ferme » sur le formulaire, sans distraction.
 */
export function QuestionnaireSection({ funnelType, defaultValues }: Props) {
  return (
    <section
      id="questionnaire"
      tabIndex={-1}
      // overflow-x-clip (ceinture, pleine largeur donc jamais de rognage
      // visible) : les animations du wizard (step-in, respiration) ne
      // doivent pas propager leurs bounds jusqu'au scrollWidth de la page.
      className="scroll-mt-20 overflow-x-clip border-t-2 border-line bg-surface-2 outline-none"
    >
      {/* max-w-6xl : le questionnaire s'aligne sur la largeur des autres
          sections de la page (NoteTarifaire, TempsForts, Gallery…) —
          demande Ryan 07-08, mêmes bords partout, PC comme mobile. */}
      <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
        <LeadFunnel
          funnelType={funnelType}
          defaultValues={defaultValues}
          headingLevel="h2"
        />
      </div>
    </section>
  );
}
