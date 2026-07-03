import type { FunnelType } from "@/types/lead";
import { Questionnaire } from "./Questionnaire";

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
      className="scroll-mt-20 border-t-2 border-line bg-surface-2 outline-none"
    >
      <div className="mx-auto w-full max-w-2xl px-4 py-12 sm:px-6">
        <Questionnaire
          funnelType={funnelType}
          defaultValues={defaultValues}
          headingLevel="h2"
        />
      </div>
    </section>
  );
}
