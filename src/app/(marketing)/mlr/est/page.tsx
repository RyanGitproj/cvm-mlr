import type { Metadata } from "next";
import { MlrRoutePage } from "@/components/pages/MlrRoutePage";
import { MLR_ROUTES_CONTENT } from "@/config/content/mlr";

const content = MLR_ROUTES_CONTENT.est;

export const metadata: Metadata = {
  title: content.titre,
  description: content.sousTitre,
};

export default function RoadTripEstPage() {
  return <MlrRoutePage content={content} />;
}
