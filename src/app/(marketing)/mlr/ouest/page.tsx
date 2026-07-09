"use client";

import type { Metadata } from "next";
import { MlrRoutePage } from "@/components/pages/MlrRoutePage";
import { MLR_ROUTES_CONTENT } from "@/config/content/mlr";
import { fbEvent } from "@/lib/fpixel";

const content = MLR_ROUTES_CONTENT.ouest;

export const metadata: Metadata = {
  title: content.titre,
  description: content.sousTitre,
};

export default function RoadTripOuestPage() {
   useEffect(() => {
    fbEvent("ViewContent", {
      content_name: content.surtitre,
      content_category: "Madagascar Liberty Roots",
    });
  }, []);
  return <MlrRoutePage content={content} />;
}




