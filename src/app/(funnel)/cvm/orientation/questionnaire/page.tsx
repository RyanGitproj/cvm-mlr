import type { Metadata } from "next";
import { LeadFunnel } from "@/components/forms/LeadFunnel";
import { getFunnelConfig } from "@/config/funnels";

const config = getFunnelConfig("cvm_orientation");

export const metadata: Metadata = {
  title: config.intro.titre,
  description: config.intro.sousTitre,
};

export default function OrientationQuestionnairePage() {
  return <LeadFunnel funnelType="cvm_orientation" />;
}
