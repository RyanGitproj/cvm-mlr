import type { Metadata } from "next";
import { Questionnaire } from "@/components/forms/Questionnaire";
import { getFunnelConfig, MLR_ROUTES } from "@/config/funnels";

const config = getFunnelConfig("mlr");

export const metadata: Metadata = {
  title: config.intro.titre,
  description: config.intro.sousTitre,
};

/**
 * Questionnaire MLR unique (7 étapes). Une arrivée depuis /mlr/{route}
 * pré-sélectionne la route à l'étape 2 via ?route= — la valeur est
 * validée avant d'être injectée dans le formulaire.
 */
export default async function MlrQuestionnairePage({
  searchParams,
}: {
  searchParams: Promise<{ route?: string }>;
}) {
  const params = await searchParams;
  const route = MLR_ROUTES.find((valeur) => valeur === params.route);
  return (
    <Questionnaire
      funnelType="mlr"
      defaultValues={route === undefined ? undefined : { route }}
    />
  );
}
