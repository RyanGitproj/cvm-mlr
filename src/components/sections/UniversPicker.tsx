import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { cn } from "@/lib/cn";
import { SectionHeading } from "./SectionHeading";

/**
 * Ratio livré par le studio pour les visuels d'univers : 610:687 (≈0,888,
 * portrait presque carré — fichiers `Début CV` / `Début Liberty Roots`).
 * Il vit dans les classes de la carte (`aspect-[610/687]` + les deux `calc`
 * de largeur) : le conteneur est à ce ratio, l'image en object-cover au
 * même ratio → aucun rognage du texte incrusté. Changer le ratio = ajuster
 * ces trois endroits.
 */
type Univers = {
  href: string;
  /** Image studio plein cadre : toutes les infos (titre, prix, offres) y sont
   *  déjà incrustées — la carte ne porte plus aucun texte au repos. */
  src: string;
  alt: string;
  /** Libellé révélé au survol desktop (mobile : image seule, carte cliquable). */
  cta: string;
  ctaClass: string;
  /** Bascule les tokens sur l'univers MLR (accent terracotta) localement. */
  theme?: "mlr";
};

const UNIVERS: Univers[] = [
  {
    href: "/cvm",
    src: "/images/mere/cvm-univers-card.png",
    alt: "Célébrations Voyages Madagascar — confort, sécurité et accompagnement, offres et tarifs",
    cta: "Choisir ce voyage",
    ctaClass: "bg-ink-strong text-surface",
  },
  {
    href: "/mlr",
    src: "/images/mere/mlr-univers-studio.png",
    alt: "Madagascar Liberty Roots — road trip taxi-brousse, routes Nord et Ouest, durées et tarifs",
    cta: "Choisir cette aventure",
    ctaClass: "bg-accent text-accent-contrast",
    theme: "mlr",
  },
];

/**
 * Une carte d'univers : visuel studio plein cadre (infos incrustées), sans
 * texte ni padding. Au survol desktop, la photo s'assombrit et le libellé de
 * choix apparaît ; sur tactile `group-hover` (gaté @media (hover:hover) en
 * Tailwind v4) ne se déclenche pas → image seule, toute la carte cliquable.
 * Carte plafonnée par la HAUTEUR sans jamais rogner l'image : la largeur est
 * pilotée par `min(colonne, hauteur-viewport × 610/687)`, la hauteur suit via
 * aspect-[610/687], `mx-auto` centre → marge latérale sur desktop.
 * Desktop : réserve seulement la navbar sticky + un filet de sous-titre
 * (`10rem`) pour que les 2 cartes soient AUSSI GRANDES QUE POSSIBLE tout en
 * tenant côte à côte sans scroll (le titre de section peut sortir du cadre) ;
 * `max-w-[610px]` = largeur native de l'image → jamais d'upscale flou.
 */
function UniversCard({ univers, delay }: { univers: Univers; delay: number }) {
  return (
    <Reveal delay={delay} className="h-full min-w-0">
      <div data-theme={univers.theme} className="h-full min-w-0">
        <Link
          href={univers.href}
          aria-label={univers.cta}
          className="group relative mx-auto block aspect-[610/687] h-auto w-[min(100%,calc(52svh*610/687))] overflow-hidden rounded-2xl border-2 border-line transition-colors hover:border-accent sm:w-[min(100%,calc((100svh_-_10rem)*610/687))] sm:max-w-[610px]"
        >
          <Image
            src={univers.src}
            alt={univers.alt}
            fill
            sizes="(min-width: 640px) 610px, 100vw"
            className="object-cover"
          />
          {/* Voile d'assombrissement au survol (desktop uniquement). */}
          <div className="absolute inset-0 bg-ink-strong/0 motion-safe:transition-colors motion-safe:duration-300 group-hover:bg-ink-strong/55" />
          {/* Libellé de choix révélé au survol. */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span
              className={cn(
                "inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold uppercase tracking-wide opacity-0 motion-safe:translate-y-1 motion-safe:transition group-hover:opacity-100 group-hover:motion-safe:translate-y-0",
                univers.ctaClass,
              )}
            >
              {univers.cta} →
            </span>
          </div>
        </Link>
      </div>
    </Reveal>
  );
}

/**
 * Cœur de la page mère — copy et hiérarchie du visuel 1/8 du funnel MLR
 * (« Quel Madagascar voulez-vous vivre ? »). Deux visuels studio pleine carte,
 * aussi grands que possible pour tenir côte à côte sans scroll sur PC. La
 * carte MLR porte data-theme="mlr" (tokens locaux) : sa bordure et son CTA
 * passent en terracotta sans déborder sur le reste de la page.
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
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
        <UniversCard univers={UNIVERS[0]} delay={0} />
        <UniversCard univers={UNIVERS[1]} delay={120} />
      </div>
    </section>
  );
}
