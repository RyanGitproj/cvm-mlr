"use client";
import { QuestionnaireSection } from "@/components/forms/QuestionnaireSection";
import { FaqList } from "@/components/sections/FaqList";
import { HeroBackground } from "@/components/sections/HeroBackground";
import { NoteTarifaire } from "@/components/sections/NoteTarifaire";
import { ReassuranceBar } from "@/components/sections/ReassuranceBar";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { TempsForts } from "@/components/sections/TempsForts";
import { Pill } from "@/components/ui/Pill";
import { ScrollCtaLink } from "@/components/ui/ScrollCtaLink";
import { cn } from "@/lib/cn";
import {
  MLR_SERVICES,
  MLR_TARIFS,
  type MlrRouteContent,
} from "@/config/content/mlr";

import { fbEvent } from "@/lib/fpixel";
import { useEffect } from "react";

/**
 * Gabarit des pages de présentation de route MLR (Nord / Ouest) — reprend
 * la structure des brochures. Le wizard MLR est intégré en bas de page,
 * route pré-sélectionnée : les CTA scrollent vers lui.
 */
export function MlrRoutePage({ content }: { content: MlrRouteContent }) {

  useEffect(() => {
    fbEvent("ViewContent", {
      content_name: content.soustitre,
      content_category: "Madagascar Liberty Roots",
    });
  }, [content]);
  // Photo posée : texte clair directement sur la photo (sans voile ni
  // cartouche) ; sinon dégradé placeholder clair, texte sombre (voir Hero).
  const hasImage = Boolean(content.imageAmbiance.src);
  return (
    // Couleur dominante de la route (turquoise Nord / terre rouge Ouest) —
    // charte 2026-07-08 : une seule teinte, pas d'alternance kaki.
    <div data-accent={content.slug}>
      <section className="relative overflow-hidden">
        <HeroBackground
          label={content.imageAmbiance.label}
          alt={content.imageAmbiance.alt}
          src={content.imageAmbiance.src}
        />
        <div className="relative z-10 mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 sm:py-20 lg:py-24">
          <div className="animate-fade-rise max-w-2xl">
            <h1
              className={cn(
                "mt-4 font-heading text-4xl font-bold uppercase tracking-wide sm:text-6xl",
                hasImage ? "text-accent-contrast" : "text-ink-strong",
              )}
            >
              {content.titre}
            </h1>
            <p
              className={cn(
                "mt-3 max-w-prose text-lg",
                hasImage ? "text-accent-contrast/90" : "text-ink-soft",
              )}
            >
              {content.sousTitre}
            </p>
            <p
              className={cn(
                "mt-4 font-heading text-lg font-bold uppercase tracking-wide",
                hasImage ? "text-accent-contrast" : "text-accent",
              )}
            >
              {MLR_TARIFS.dixJours} · {MLR_TARIFS.quinzeJours}
            </p>
            <div className="mt-2">
              <Pill>{MLR_TARIFS.format}</Pill>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <ScrollCtaLink targetId="questionnaire">
                {content.ctaLabel}
              </ScrollCtaLink>
            </div>
            <p
              className={cn(
                "mt-4 text-xs",
                hasImage ? "text-accent-contrast/85" : "text-ink-soft",
              )}
            >
              {MLR_TARIFS.idealPour}
            </p>
          </div>
        </div>
      </section>

      {/* max-w-5xl : gouttières réduites (demande Ryan 07-07 soir). */}
      <section className="mx-auto w-full max-w-5xl px-4 pb-6 sm:px-6">
        {content.accroche.map((paragraphe) => (
          <p key={paragraphe} className="mt-4 text-base leading-relaxed sm:text-lg">
            {paragraphe}
          </p>
        ))}
      </section>

      <TempsForts
        titre={content.tempsFortsTitre}
        items={content.tempsForts}
        accent
      />

      <section className="border-y border-line bg-surface-2">
        <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-12 sm:grid-cols-2 sm:px-6">
          <div>
            <h2 className="font-heading text-2xl font-bold uppercase tracking-wide text-ink-strong">
              Ce voyage est fait pour…
            </h2>
            <ul className="mt-4 grid gap-3">
              {content.faitPour.map((item) => (
                <li key={item} className="flex gap-3 text-sm leading-relaxed">
                  <span
                    aria-hidden
                    className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-accent"
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="font-heading text-2xl font-bold uppercase tracking-wide text-ink-strong">
              Ce que vous allez ressentir
            </h2>
            <ul className="mt-4 grid gap-4">
              {content.ressentir.map((item) => (
                <li key={item.titre}>
                  <p className="text-sm font-semibold uppercase tracking-wide text-ink-strong">
                    {item.titre}
                  </p>
                  <p className="mt-1 text-sm text-ink-soft">{item.texte}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-surface-2">
        <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
          <SectionHeading titre="Exemple de déroulé — 10 jours" accent />
          <ol className="mt-8 grid gap-4">
            {content.deroule.map((etape) => (
              <li
                key={etape.jours}
                className="flex gap-4 rounded-2xl border-2 border-line bg-card p-4"
              >
                <span className="h-fit shrink-0 rounded-lg bg-accent px-3 py-1.5 font-heading text-sm font-bold uppercase text-accent-contrast">
                  {etape.jours}
                </span>
                <div>
                  <p className="font-semibold text-ink-strong">{etape.titre}</p>
                  {etape.texte && (
                    <p className="mt-1 text-sm text-ink-soft">{etape.texte}</p>
                  )}
                </div>
              </li>
            ))}
          </ol>
          <h3 className="mt-10 font-heading text-2xl font-bold uppercase tracking-wide text-ink-strong">
            Version 15 jours : aller plus loin
          </h3>
          <ul className="mt-4 grid gap-4 sm:grid-cols-2">
            {content.quinzeJours.map((item) => (
              <li
                key={item.titre}
                className="rounded-2xl border-2 border-line bg-card p-4"
              >
                <p className="font-semibold text-ink-strong">{item.titre}</p>
                <p className="mt-1 text-sm text-ink-soft">{item.texte}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <TempsForts
        titre="Ce que comprend le tarif"
        items={content.inclus}
        accent
      />
      <TempsForts titre="Ce qui reste à prévoir" items={content.aPrevoir} accent />
      <NoteTarifaire texte={content.budgetSurPlace} />

      <section className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-2">
        <div>
          <SectionHeading titre="Trucs & astuces" accent />
          <ul className="mt-6 grid gap-3">
            {content.astuces.map((astuce) => (
              <li key={astuce} className="flex gap-3 text-sm leading-relaxed">
                <span
                  aria-hidden
                  className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-accent"
                />
                {astuce}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <SectionHeading titre="Questions fréquentes" accent />
          <div className="mt-6">
            <FaqList items={content.faq} />
          </div>
        </div>
      </section>

      <ReassuranceBar items={MLR_SERVICES} />

      {/* Fin de page = le questionnaire, route pré-sélectionnée. */}
      <QuestionnaireSection
        funnelType="mlr"
        defaultValues={{ route: content.slug }}
      />
    </div>
  );
}
