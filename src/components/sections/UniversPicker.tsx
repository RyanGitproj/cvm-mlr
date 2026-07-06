import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { ContentImage } from "@/components/ui/ContentImage";
import { Pill } from "@/components/ui/Pill";
import { cvmBrand, mlrBrand } from "@/config/brands";
import { CVM_UNIVERS } from "@/config/content/cvm";
import { formatEuros } from "@/lib/format";
import { SectionHeading } from "./SectionHeading";

const CVM_PRIX_MINI = Math.min(
  ...Object.values(CVM_UNIVERS).flatMap((univers) =>
    univers.formules.map((formule) => formule.prixEuros),
  ),
);

/**
 * Cœur de la page mère — copy et hiérarchie du visuel 1/8 du funnel MLR
 * (« Quel Madagascar voulez-vous vivre ? »). La carte MLR porte
 * data-theme="mlr" (tokens locaux) et data-pick="mlr" (bascule d'accent
 * globale, voir globals.css).
 */
export function UniversPicker() {
  return (
    <section
      id="univers"
      className="mx-auto w-full max-w-6xl scroll-mt-20 px-4 py-12 sm:px-6"
    >
      <SectionHeading
        align="center"
        titre="Choisissez votre univers"
        sousTitre="Deux chemins, pas un de plus — la même équipe locale derrière chacun. Reconnaissez le vôtre."
      />
      <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-5">
        <Reveal className="h-full min-w-0">
          <Link
            href="/cvm"
            className="flex h-full min-w-0 flex-col rounded-2xl border-2 border-line bg-card p-4 transition-colors hover:border-accent motion-safe:transition-transform motion-safe:hover:-translate-y-1 sm:p-6"
          >
            {/* Même visuel que le hero /cvm (demande Ryan 2026-07-06). */}
            <ContentImage
              ratio="16/9"
              src="/images/cvm/hero-cvm.jpeg"
              alt="Triptyque des expériences : plage et bateau turquoise, faune insolite, trek vers les massifs"
              sizes="(min-width: 1152px) 552px, 50vw"
            />
            <p className="mt-5 font-heading text-xl font-bold text-ink-strong sm:text-3xl">
              {cvmBrand.nom}
            </p>
            <p className="mt-2 text-sm text-ink-soft">
              Vous savourez, nous orchestrons : confort, sécurité et zéro
              logistique à gérer.
            </p>
            {/* Chaque offre dans sa couleur ; l'Expédition seule porte la
                lumière (directive boss 2026-07). */}
            <div className="mt-4 flex flex-wrap gap-2">
              <Pill
                data-accent="ember"
                className="cta-pulse-soft pill-accent font-semibold"
              >
                Expédition insolite
              </Pill>
              <Pill className="pill-accent">Trek Aventure</Pill>
              <Pill data-accent="lagon" className="pill-accent">
                Séjour Collection
              </Pill>
              <Pill className="pill-accent">Grand Tour</Pill>
            </div>
            <p className="mt-4 flex-1 text-sm text-ink-soft">
              <span className="text-xs uppercase tracking-wide">À partir de </span>
              <strong className="text-xl font-bold text-ink-strong">
                {formatEuros(CVM_PRIX_MINI)}
              </strong>
              <span className="text-xs uppercase tracking-wide"> / personne</span>
            </p>
            <span className="cta-pulse mt-5 inline-flex w-fit items-center gap-2 rounded-lg bg-ink-strong px-3 py-2 text-xs font-semibold uppercase tracking-wide text-surface sm:px-5 sm:py-2.5 sm:text-sm">
              Choisir ce voyage →
            </span>
          </Link>
        </Reveal>

        <Reveal delay={120} className="h-full min-w-0">
          <div data-theme="mlr" className="h-full min-w-0">
            <Link
              href="/mlr"
              data-pick="mlr"
              className="texture-paper flex h-full min-w-0 flex-col rounded-2xl border-2 border-line bg-card p-4 transition-colors hover:border-accent motion-safe:transition-transform motion-safe:hover:-translate-y-1 sm:p-6"
            >
              <ContentImage
                ratio="16/9"
                src="/images/mere/mlr-univers.jpg"
                alt="Taxi-brousse chargé sur la route, baobabs à l'horizon"
                sizes="(min-width: 1152px) 552px, 50vw"
              />
              <p className="mt-5 font-heading text-xl font-bold uppercase tracking-wide text-ink-strong sm:text-3xl">
                {mlrBrand.nom}
              </p>
              <p className="mt-2 text-sm text-ink-soft">
                La piste, les rencontres, la liberté — l’aventure brute, avec
                un guide local qui connaît chaque village.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Pill>Nord</Pill>
                <Pill>Sud</Pill>
                <Pill>Est</Pill>
                <Pill>Ouest</Pill>
              </div>
              <p className="mt-4 flex-1 text-sm font-semibold uppercase tracking-wide text-ink-soft">
                10 jours dès <strong className="text-lg font-bold text-accent">1 400 €</strong>
                <br />
                15 jours dès <strong className="text-lg font-bold text-accent">1 800 €</strong>
              </p>
              <span className="cta-pulse mt-5 inline-flex w-fit items-center gap-2 rounded-lg bg-accent px-3 py-2 text-xs font-semibold uppercase tracking-wide text-accent-contrast sm:px-5 sm:py-2.5 sm:text-sm">
                Choisir cette aventure →
              </span>
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
