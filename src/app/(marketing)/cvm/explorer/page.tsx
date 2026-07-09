
import type { Metadata } from "next";
import { CvmUniversPage } from "@/components/pages/CvmUniversPage";
import { CVM_UNIVERS } from "@/config/content/cvm";

const content = CVM_UNIVERS.explorer;

export const metadata: Metadata = {
  title: content.surtitre,
  description: content.sousTitre,
};

export default function ExplorerPage() {
 
  return <CvmUniversPage content={content} />;
}
