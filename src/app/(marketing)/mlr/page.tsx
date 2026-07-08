import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { QuestionnaireSection } from "@/components/forms/QuestionnaireSection";
import { Reveal } from "@/components/motion/Reveal";
import { Hero } from "@/components/sections/Hero";
import { NoteTarifaire } from "@/components/sections/NoteTarifaire";
import { ReassuranceBar } from "@/components/sections/ReassuranceBar";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { VideoSection } from "@/components/sections/VideoSection";
import { Pill } from "@/components/ui/Pill";
import { NOTE_TARIFAIRE_MLR } from "@/config/brands";
import {
  MLR_LANDING,
  MLR_SERVICES_LANDING,
  MLR_TARIFS,
} from "@/config/content/mlr";

export const metadata: Metadata = {
  title: "Madagascar Liberty Roots — Road trip roots",
  description: MLR_LANDING.hero.sousTitre,
};

export default function MlrLandingPage() {
  return (
    <>
      <Hero
        surtitre={MLR_LANDING.hero.surtitre}
        titre={MLR_LANDING.hero.titre}
        sousTitre={MLR_LANDING.hero.sousTitre}
        ctas={[
          { href: "#questionnaire", label: "Trouver ma route" },
          { href: "#routes", label: "Découvrir les routes", variant: "outline" },
        ]}
        micro={[
          ...MLR_LANDING.hero.badges,
          MLR_TARIFS.dixJours,
          MLR_TARIFS.quinzeJours,
        ]}
        imageLabel={MLR_LANDING.hero.imageLabel}
        imageAlt={MLR_LANDING.hero.imageAlt}
        imageSrc="/images/mlr/hero.png"
      />

      <section className="accent-forest mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
        <SectionHeading
          titre="Choisis ton niveau d'aventure"
          sousTitre="Un repère pour te projeter — tu confirmeras ta durée dans le parcours."
          accent
        />
        {/* Cartes plein cadre : le visuel studio 505×204 porte titre, prix,
            description et note incrustés — aucune carte à texte. Repères non
            cliquables (la durée se confirme dans le parcours). */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 sm:gap-5">
          {MLR_LANDING.durees.map((duree) => (
            <div
              key={duree.value}
              className="relative aspect-[505/204] overflow-hidden rounded-2xl border-2 border-line"
            >
              <Image
                src={duree.studioSrc}
                alt={duree.studioAlt}
                fill
                sizes="(min-width: 640px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </section>

      <section
        id="routes"
        className="scroll-mt-20 border-y border-line bg-surface-2"
      >
        <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
          <SectionHeading
            titre="Deux routes. Deux visages de Madagascar."
            sousTitre="Nord ou Ouest — même format : guide local privé + taxi-brousse. Choisis celle qui t'appelle, on s'occupe du reste."
            accent
          />
          {/* Cartes plein cadre façon UniversPicker (page mère) : le visuel
              studio 505×408 porte titre, description, prix et CTA incrustés —
              aucune carte à texte. Au survol desktop, voile + libellé révélé ;
              sur tactile, image seule, toute la carte cliquable. */}
          <div className="mt-8 grid gap-4 sm:grid-cols-2 sm:gap-5">
            {MLR_LANDING.routes.map((route, index) => (
              <Reveal key={route.slug} delay={index * 80} className="min-w-0">
                <Link
                  href={`/mlr/${route.slug}`}
                  aria-label={route.cta}
                  // Couleur d'accent de la route (turquoise Nord / terre rouge
                  // Ouest) : la bordure de survol et la pastille CTA suivent la
                  // charte respective plutôt que le terracotta par défaut.
                  data-accent={route.slug}
                  className="group relative block aspect-[505/408] overflow-hidden rounded-2xl border-2 border-line transition-colors hover:border-accent"
                >
                  <Image
                    src={route.studioSrc}
                    alt={route.studioAlt}
                    fill
                    sizes="(min-width: 640px) 50vw, 100vw"
                    className="object-cover"
                  />
                  {/* Voile d'assombrissement au survol (desktop uniquement). */}
                  <div className="absolute inset-0 bg-ink-strong/0 motion-safe:transition-colors motion-safe:duration-300 group-hover:bg-ink-strong/55" />
                  {/* Libellé de choix révélé au survol. */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold uppercase tracking-wide text-accent-contrast opacity-0 motion-safe:translate-y-1 motion-safe:transition group-hover:opacity-100 group-hover:motion-safe:translate-y-0">
                      {route.cta} →
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="accent-forest mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
        <SectionHeading titre="Le format Liberty Roots" accent />
        <div className="mt-6 flex flex-wrap gap-2">
          <Pill>{MLR_TARIFS.format}</Pill>
          <Pill>{MLR_TARIFS.idealPour}</Pill>
        </div>
      </section>

      <NoteTarifaire texte={NOTE_TARIFAIRE_MLR} />
      <VideoSection {...MLR_LANDING.video} />
      <ReassuranceBar items={MLR_SERVICES_LANDING} />

      {/* Questionnaire unique MLR, sans pré-remplissage : la route est l'étape 2. */}
      <QuestionnaireSection funnelType="mlr" />
    </>
  );
}
