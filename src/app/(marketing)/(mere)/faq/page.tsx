import type { Metadata } from "next";
import { FaqList } from "@/components/sections/FaqList";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { FAQ_CVM, FAQ_MLR } from "@/config/content/faq";

export const metadata: Metadata = {
  title: "Questions fréquentes",
  description:
    "Niveau physique, budget, ce qui est inclus, réservation : les réponses aux questions fréquentes sur les voyages Célébration Voyages Madagascar et Madagascar Liberty Roots.",
};

export default function FaqPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
      <h1 className="font-heading text-4xl font-bold text-ink-strong">
        Questions fréquentes
      </h1>
      <p className="mt-3 max-w-2xl text-ink-soft">
        Les réponses aux questions les plus posées, univers par univers.
      </p>
      <div className="mt-10 grid gap-12 lg:grid-cols-2">
        <section>
          <SectionHeading titre="Célébration Voyages Madagascar" />
          <div className="mt-6">
            <FaqList items={FAQ_CVM} />
          </div>
        </section>
        <section data-theme="mlr">
          <SectionHeading titre="Madagascar Liberty Roots" />
          <div className="mt-6">
            <FaqList items={FAQ_MLR} />
          </div>
        </section>
      </div>
    </div>
  );
}
