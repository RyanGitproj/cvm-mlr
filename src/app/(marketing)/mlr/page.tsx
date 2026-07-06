import type { Metadata } from "next";
import Link from "next/link";
import { QuestionnaireSection } from "@/components/forms/QuestionnaireSection";
import { Reveal } from "@/components/motion/Reveal";
import { Hero } from "@/components/sections/Hero";
import { NoteTarifaire } from "@/components/sections/NoteTarifaire";
import { ReassuranceBar } from "@/components/sections/ReassuranceBar";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { ContentImage } from "@/components/ui/ContentImage";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { Pill } from "@/components/ui/Pill";
import { NOTE_TARIFAIRE_MLR } from "@/config/brands";
import {
  MLR_LANDING,
  MLR_ROUTES_CONTENT,
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
        micro={[MLR_TARIFS.dixJours, MLR_TARIFS.quinzeJours]}
        imageLabel={MLR_LANDING.hero.imageLabel}
        imageAlt={MLR_LANDING.hero.imageAlt}
        imageSrc="/images/mlr/hero.jpg"
      />

      <section className="accent-forest mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
        <SectionHeading
          titre="Choisissez votre durée"
          sousTitre="Un repère pour vous projeter — vous confirmerez votre durée dans le questionnaire."
          accent
        />
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {MLR_LANDING.durees.map((duree) => (
            <div
              key={duree.titre}
              className="rounded-2xl border-2 border-line bg-card p-6"
            >
              <p className="font-heading text-3xl font-bold uppercase tracking-wide text-ink-strong">
                {duree.titre}
              </p>
              <p className="mt-1 font-semibold text-accent">{duree.prix}</p>
              <p className="mt-2 text-sm text-ink-soft">{duree.texte}</p>
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
            titre="Les 4 roots"
            sousTitre="Quatre ambiances, un même format : guide local privé + taxi-brousse. Choisissez celle qui vous appelle — on s'occupe du reste."
            accent
          />
          {/* 2×2 en mobile, 4 sur une ligne dès sm — aligné sur la grille des
              univers CVM (grid-cols-2 → sm:grid-cols-4). */}
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
            {MLR_LANDING.routes.map((route, index) => {
              const content = MLR_ROUTES_CONTENT[route.slug];
              return (
                <Reveal key={route.slug} delay={index * 80} className="h-full">
                  <Link
                    href={`/mlr/${route.slug}`}
                    className="flex h-full flex-col rounded-2xl border-2 border-line bg-card p-5 transition-colors hover:border-accent"
                  >
                    {content.imageAmbiance.src ? (
                      <ContentImage
                        ratio="16/9"
                        src={content.imageAmbiance.src}
                        alt={content.imageAmbiance.alt}
                        sizes="(min-width: 1152px) 552px, (min-width: 640px) 50vw, 100vw"
                      />
                    ) : (
                      <PlaceholderImage
                        ratio="16/9"
                        label={content.imageAmbiance.label}
                        alt={content.imageAmbiance.alt}
                      />
                    )}
                    <p className="mt-4 font-heading text-2xl font-bold uppercase tracking-wide text-ink-strong">
                      Road Trip {route.titre}
                    </p>
                    <p className="mt-1 flex-1 text-sm text-ink-soft">{route.texte}</p>
                    <span className="mt-3 text-sm font-semibold text-accent">
                      Voir la route →
                    </span>
                  </Link>
                </Reveal>
              );
            })}
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
      <ReassuranceBar items={MLR_SERVICES_LANDING} />

      {/* Questionnaire unique MLR, sans pré-remplissage : la route est l'étape 2. */}
      <QuestionnaireSection funnelType="mlr" />
    </>
  );
}
