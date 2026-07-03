import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { Hero } from "@/components/sections/Hero";
import { NoteTarifaire } from "@/components/sections/NoteTarifaire";
import { ReassuranceBar } from "@/components/sections/ReassuranceBar";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { ButtonLink } from "@/components/ui/Button";
import { NOTE_TARIFAIRE_CVM } from "@/config/brands";
import {
  CVM_LANDING,
  CVM_UNIVERS,
  type CvmUniversSlug,
} from "@/config/content/cvm";
import { formatEuros } from "@/lib/format";

export const metadata: Metadata = {
  title: "Célébration Voyage Madagascar — 4 expériences encadrées",
  description: CVM_LANDING.hero.sousTitre,
};

const UNIVERS_ORDER: readonly CvmUniversSlug[] = [
  "explorer",
  "treks",
  "iles",
  "un-mois",
];

export default function CvmLandingPage() {
  return (
    <>
      <Hero
        surtitre={CVM_LANDING.hero.surtitre}
        titre={CVM_LANDING.hero.titre}
        sousTitre={CVM_LANDING.hero.sousTitre}
        ctas={[
          { href: CVM_LANDING.orientation.href, label: CVM_LANDING.orientation.cta },
          { href: "#experiences", label: "Voir les 4 expériences", variant: "outline" },
        ]}
        imageLabel={CVM_LANDING.hero.imageLabel}
        imageAlt={CVM_LANDING.hero.imageAlt}
      />

      <section
        id="experiences"
        className="mx-auto w-full max-w-6xl scroll-mt-20 px-4 py-12 sm:px-6"
      >
        <SectionHeading
          titre="Quatre expériences, un seul interlocuteur"
          sousTitre="Chaque univers a son ambiance, son rythme et son questionnaire dédié."
        />
        <div className="mt-8 grid grid-cols-4 gap-2 sm:gap-4">
          {UNIVERS_ORDER.map((slug, index) => {
            const univers = CVM_UNIVERS[slug];
            const prixMini = Math.min(
              ...univers.formules.map((formule) => formule.prixEuros),
            );
            const prixLabel =
              univers.formules.length > 1
                ? `dès ${formatEuros(prixMini)}`
                : formatEuros(prixMini);
            return (
              <Reveal key={slug} delay={index * 80} className="h-full min-w-0">
                <Link
                  href={`/cvm/${slug}`}
                  data-accent={univers.accent}
                  className="flex h-full min-w-0 flex-col rounded-2xl border-2 border-line bg-card p-3 transition-colors hover:border-accent sm:p-6"
                >
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-accent sm:text-xs sm:tracking-[0.2em]">
                    {univers.surtitre}
                  </p>
                  <p className="mt-2 break-words font-heading text-sm font-bold text-ink-strong sm:text-2xl">
                    {univers.titre}
                  </p>
                  <p className="mt-2 hidden flex-1 break-words text-sm text-ink-soft sm:block">
                    {univers.sousTitre}
                  </p>
                  <div className="mt-auto flex flex-col gap-1 pt-3 sm:flex-row sm:items-center sm:justify-between">
                    <span className="text-xs font-semibold text-accent sm:text-sm">
                      Découvrir →
                    </span>
                    <span className="text-xs font-semibold text-ink-strong sm:text-sm">
                      {prixLabel}
                    </span>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 pb-12 sm:px-6">
        <div className="rounded-2xl border-2 border-accent-soft bg-surface-2 p-6 sm:flex sm:items-center sm:justify-between sm:gap-6">
          <div>
            <p className="font-heading text-2xl font-bold text-ink-strong">
              {CVM_LANDING.orientation.titre}
            </p>
            <p className="mt-2 max-w-prose text-sm text-ink-soft">
              {CVM_LANDING.orientation.texte}
            </p>
          </div>
          <ButtonLink
            href={CVM_LANDING.orientation.href}
            className="mt-4 shrink-0 sm:mt-0"
          >
            {CVM_LANDING.orientation.cta}
          </ButtonLink>
        </div>
      </section>

      <NoteTarifaire texte={NOTE_TARIFAIRE_CVM} />
      <ReassuranceBar items={CVM_LANDING.reassurance} />
    </>
  );
}
