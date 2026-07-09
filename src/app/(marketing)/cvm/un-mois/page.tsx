
import type { Metadata } from "next";
import { CvmUniversPage } from "@/components/pages/CvmUniversPage";
import { CVM_UNIVERS } from "@/config/content/cvm";


const content = CVM_UNIVERS["un-mois"];

export const metadata: Metadata = {
  title: content.surtitre,
  description: content.sousTitre,
};

export default function UnMoisPage() {

  return <CvmUniversPage content={content} />;
}


