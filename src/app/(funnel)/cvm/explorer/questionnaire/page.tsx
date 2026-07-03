import type { Metadata } from "next";
import { Questionnaire } from "@/components/forms/Questionnaire";
import { getFunnelConfig } from "@/config/funnels";

const config = getFunnelConfig("cvm_explorer");

export const metadata: Metadata = {
  title: config.intro.titre,
  description: config.intro.sousTitre,
};

export default function ExplorerQuestionnairePage() {
  return <Questionnaire funnelType="cvm_explorer" />;
}
