"use client";
import type { Metadata } from "next";
import { CvmUniversPage } from "@/components/pages/CvmUniversPage";
import { CVM_UNIVERS } from "@/config/content/cvm";
import { fbEvent } from "@/lib/fpixel";

const content = CVM_UNIVERS.iles;

export const metadata: Metadata = {
  title: content.surtitre,
  description: content.sousTitre,
};

export default function IlesPage() {
   useEffect(() => {
    fbEvent("ViewContent", {
      content_name: content.surtitre,
      content_category: "Celebrations voyages",
    });
  }, []);
  return <CvmUniversPage content={content} />;
}




