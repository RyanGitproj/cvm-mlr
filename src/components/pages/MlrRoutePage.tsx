import { QuestionnaireSection } from "@/components/forms/QuestionnaireSection";
import { FaqList } from "@/components/sections/FaqList";
import { HeroBackground } from "@/components/sections/HeroBackground";
import { NoteTarifaire } from "@/components/sections/NoteTarifaire";
import { ReassuranceBar } from "@/components/sections/ReassuranceBar";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { TempsForts } from "@/components/sections/TempsForts";
import { Pill, Stamp } from "@/components/ui/Pill";
import { ScrollCtaLink } from "@/components/ui/ScrollCtaLink";
import {
  MLR_SERVICES,
  MLR_STAMP,
  MLR_TARIFS,
  type MlrRouteContent,
} from "@/config/content/mlr";

/**
 * Gabarit des 4 pages de présentation de route MLR (brief §8.3) — reprend
 * la structure des brochures. Le questionnaire unique MLR est intégré en
 * bas de page, route pré-sélectionnée : les CTA scrollent vers lui.
 */
export function MlrRoutePage({ content }: { content: MlrRouteContent }) {
  return (
    <>
      <section className="relative overflow-hidden">
        <HeroBackground
          label={content.imageAmbiance.label}
          alt={content.imageAmbiance.alt}
        />
        <div className="relative z-10 mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 sm:py-20 lg:py-24">
          <div className="animate-fade-rise max-w-2xl">
            <Stamp>{MLR_STAMP}</Stamp>
            <h1 className="mt-4 font-heading text-4xl font-bold uppercase tracking-wide text-ink-strong sm:text-6xl">
              {content.titre}
            </h1>
            <p className="mt-3 max-w-prose text-lg text-ink-soft">
              {content.sousTitre}
            </p>
            <p className="mt-4 font-heading text-lg font-bold uppercase tracking-wide text-accent">
              {MLR_TARIFS.dixJours} · {MLR_TARIFS.quinzeJours}
            </p>
            <div className="mt-2">
              <Pill>{MLR_TARIFS.format}</Pill>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <ScrollCtaLink targetId="questionnaire">
                {content.ctaLabel}
              </ScrollCtaLink>
              <ScrollCtaLink targetId="devis-explicatif" variant="outline">
                Découvrir le devis explicatif
              </ScrollCtaLink>
            </div>
            <p className="mt-4 text-xs text-ink-soft">{MLR_TARIFS.idealPour}</p>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-3xl px-4 pb-6 sm:px-6">
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
        className="accent-forest"
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

      <section
        id="devis-explicatif"
        className="accent-forest mx-auto w-full max-w-6xl scroll-mt-20 px-4 py-12 sm:px-6"
      >
        <SectionHeading
          titre="Le devis explicatif"
          sousTitre="Transparence et liberté : comprendre ce qui est inclus et ce qui reste à prévoir."
          accent
        />
        {content.devis ? (
          <div className="mt-8 max-w-2xl">
            <Stamp>{MLR_STAMP}</Stamp>
            <p className="mt-4 font-heading text-xl font-bold uppercase tracking-wide text-ink-strong">
              {content.devis.titre}
            </p>
            <div className="mt-3 overflow-x-auto rounded-2xl border-2 border-line bg-card">
              <table className="w-full text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-line text-left">
                    <th scope="col" className="px-3 py-3 font-semibold sm:px-4">
                      Prestation
                    </th>
                    <th scope="col" className="px-3 py-3 text-right font-semibold sm:px-4">
                      Montant
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {content.devis.lignes.map((ligne) => (
                    <tr key={ligne.prestation} className="border-b border-line">
                      <td className="px-3 py-2.5 sm:px-4">{ligne.prestation}</td>
                      <td className="whitespace-nowrap px-3 py-2.5 text-right sm:px-4">
                        {ligne.montant}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td className="px-3 py-3 font-bold sm:px-4">Total estimatif</td>
                    <td className="px-3 py-3 text-right font-bold sm:px-4">
                      {content.devis.total}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
            <p className="mt-3 text-xs italic text-ink-soft">{content.devis.note}</p>
          </div>
        ) : (
          <p className="mt-6 max-w-2xl text-sm text-ink-soft">
            Demandez votre road book détaillé et recevez votre devis
            personnalisé, sans engagement.
          </p>
        )}
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
        className="accent-forest"
      />
      <TempsForts titre="Ce qui reste à prévoir" items={content.aPrevoir} accent />
      <NoteTarifaire texte={content.budgetSurPlace} />

      <section className="accent-forest mx-auto grid w-full max-w-6xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-2">
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

      {content.temoignage && (
        <section className="mx-auto w-full max-w-3xl px-4 pb-12 sm:px-6">
          <blockquote className="rounded-2xl border-2 border-accent-soft bg-surface-2 p-6">
            <p className="text-lg italic leading-relaxed">
              « {content.temoignage.texte} »
            </p>
            <footer className="mt-3 text-sm font-semibold text-ink-soft">
              — {content.temoignage.auteur}
            </footer>
          </blockquote>
        </section>
      )}

      <ReassuranceBar items={MLR_SERVICES} />

      {/* Fin de page = le questionnaire, route pré-sélectionnée. */}
      <QuestionnaireSection
        funnelType="mlr"
        defaultValues={{ route: content.slug }}
      />
    </>
  );
}
