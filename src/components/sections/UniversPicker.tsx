import Image from "next/image";
import type { CSSProperties } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { TrackedLink } from "@/components/tracking/TrackedLink";
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
  /** Identifiant d'univers poussé dans l'event `select_univers`. */
  slug: "cvm" | "mlr";
  href: string;
  /** Image studio plein cadre : toutes les infos (titre, prix, offres) y sont
   *  déjà incrustées — la carte ne porte plus aucun texte au repos. */
  src: string;
  alt: string;
  /** Libellé accessible du lien (aria-label) — plus aucun bouton visible. */
  cta: string;
  /** Bascule les tokens sur l'univers MLR (accent terracotta) localement. */
  theme?: "mlr";
};

const UNIVERS: Univers[] = [
  {
    slug: "cvm",
    href: "/cvm",
    src: "/images/mere/cvm-picker-card.png",
    alt: "Célébrations Voyages Madagascar : confort, sécurité et accompagnement, offres et tarifs",
    cta: "Choisir ce voyage",
  },
  {
    slug: "mlr",
    href: "/mlr",
    src: "/images/mere/mlr-picker-card.png",
    alt: "Madagascar Liberty Roots : road trip taxi-brousse, routes Nord et Ouest, durées et tarifs",
    cta: "Choisir cette aventure",
    theme: "mlr",
  },
];

/**
 * Une carte d'univers : visuel studio plein cadre (infos incrustées), sans
 * texte ni padding. La carte respire en continu (`animate-breathe`, Ryan
 * 2026-07-14 : gonfle/dégonfle, remplace la lévitation floating) —
 * `breatheDelay` négatif déphase la 2ᵉ carte ; l'animation vit sur le div
 * interne, jamais sur le wrapper Reveal dont la transition d'entrée pilote
 * déjà `transform`. Au survol desktop, la photo s'assombrit (voile seul,
 * sans bouton — décision Ryan 2026-07-09) ; sur tactile `group-hover` (gaté
 * @media (hover:hover) en Tailwind v4) ne se déclenche pas → image seule,
 * toute la carte cliquable.
 * Carte plafonnée par la HAUTEUR sans jamais rogner l'image : la largeur est
 * pilotée par `min(colonne, hauteur-viewport × 610/687)`, la hauteur suit via
 * aspect-[610/687], `mx-auto` centre → marge latérale sur desktop.
 * Desktop : réserve seulement la navbar sticky + un filet de sous-titre
 * (`10rem`) pour que les 2 cartes soient AUSSI GRANDES QUE POSSIBLE tout en
 * tenant côte à côte sans scroll (le titre de section peut sortir du cadre) ;
 * `max-w-[610px]` = largeur native de l'image → jamais d'upscale flou.
 */
function UniversCard({
  univers,
  delay,
  breatheDelay,
}: {
  univers: Univers;
  delay: number;
  breatheDelay?: string;
}) {
  const breatheStyle = breatheDelay
    ? ({ "--breathe-delay": breatheDelay } as CSSProperties)
    : undefined;
  return (
    <Reveal delay={delay} className="h-full min-w-0">
      <div
        data-theme={univers.theme}
        className="animate-breathe h-full min-w-0"
        style={breatheStyle}
      >
        <TrackedLink
          href={univers.href}
          event="select_univers"
          eventParams={{ univers: univers.slug }}
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
        </TrackedLink>
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
      <SectionHeading align="center" titre="Choisissez votre univers" />
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
        <UniversCard univers={UNIVERS[0]} delay={0} />
        <UniversCard univers={UNIVERS[1]} delay={120} breatheDelay="-0.8s" />
      </div>
    </section>
  );
}
