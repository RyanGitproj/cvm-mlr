import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { Hero } from "@/components/sections/Hero";
import { NoteTarifaire } from "@/components/sections/NoteTarifaire";
import { ReassuranceBar } from "@/components/sections/ReassuranceBar";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { ButtonLink } from "@/components/ui/Button";
import { ContentImage } from "@/components/ui/ContentImage";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { NOTE_TARIFAIRE_CVM } from "@/config/brands";
import {
  CVM_LANDING,
  CVM_UNIVERS,
  type CvmUniversSlug,
} from "@/config/content/cvm";
import { cn } from "@/lib/cn";

export const metadata: Metadata = {
  title: "Célébrations Voyages Madagascar — 4 expériences encadrées",
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
        imageSrc="/images/cvm/hero-cvm-cover.png"
      />

      <section
        id="experiences"
        className="mx-auto w-full max-w-6xl scroll-mt-20 px-4 py-12 sm:px-6"
      >
        <SectionHeading
          titre="Quatre expériences. Un seul choix : votre éveil."
          sousTitre="À chacun son rythme, à chacun son aventure. Madagascar, selon vos envies."
        />
        {/* Cards maquette avant_vocale (2026-07-07) : l'image studio porte le
            titre et les badges incrustés — le code porte les 4 puces. */}
        <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {UNIVERS_ORDER.map((slug, index) => {
            const univers = CVM_UNIVERS[slug];
            return (
              <Reveal key={slug} delay={index * 80} className="h-full min-w-0">
                <Link
                  href={`/cvm/${slug}`}
                  data-accent={univers.accent}
                  className={cn(
                    "flex h-full min-w-0 flex-col rounded-2xl border-2 bg-card p-3 transition-colors hover:border-accent sm:p-4",
                    // L'Expédition porte couleur + lumière (directive boss
                    // 2026-07) ; les trois autres restent en bordure neutre.
                    slug === "explorer"
                      ? "cta-pulse-soft border-accent"
                      : "border-line",
                  )}
                >
                  <h3 className="sr-only">{univers.titre}</h3>
                  {univers.card.image.src ? (
                    <ContentImage
                      ratio="3/4"
                      src={univers.card.image.src}
                      alt={univers.card.image.alt}
                      sizes="(min-width: 1024px) 264px, 50vw"
                    />
                  ) : (
                    <PlaceholderImage
                      ratio="3/4"
                      label={univers.card.image.label}
                      alt={univers.card.image.alt}
                    />
                  )}
                  <ul className="mt-3 grid flex-1 content-start gap-1.5 text-[11px] leading-snug sm:gap-2 sm:text-sm">
                    {univers.card.puces.map((puce) => (
                      <li key={puce} className="flex gap-1.5 sm:gap-2">
                        <svg
                          aria-hidden
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="mt-0.5 shrink-0 text-accent"
                        >
                          <path d="m4 12.5 5.5 5.5L20 6.5" />
                        </svg>
                        {puce}
                      </li>
                    ))}
                  </ul>
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
