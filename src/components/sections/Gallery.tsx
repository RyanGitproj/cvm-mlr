"use client";

import { useState } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { buttonClasses } from "@/components/ui/Button";
import { ContentImage } from "@/components/ui/ContentImage";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { cn } from "@/lib/cn";
import { SectionHeading } from "./SectionHeading";

type Item = { label: string; alt: string; src?: string };

type Props = {
  titre: string;
  items: readonly Item[];
};

/** Largeur d'une vignette selon la grille (3 col ≥ lg, 2 col ≥ sm). */
const VIGNETTE_SIZES = "(min-width: 1024px) 368px, (min-width: 640px) 50vw, 100vw";

/** Vignettes affichées d'emblée en mobile — le reste derrière « Voir plus ». */
const VISIBLES_MOBILE = 3;

/**
 * Galerie « En images ». En mobile, la pile de 6 vignettes forçait ~1 700 px
 * de scroll : seules les 3 premières s'affichent, un bouton révèle les
 * autres (choix Ryan 2026-07-07 soir, pas de repli une fois déployé).
 * En ≥ sm, la grille complète s'affiche sans bouton.
 */
export function Gallery({ titre, items }: Props) {
  const [expanded, setExpanded] = useState(false);
  const masquees = items.length - VISIBLES_MOBILE;

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
      <SectionHeading titre={titre} />
      <div
        id="galerie-vignettes"
        className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {items.map((item, index) => (
          <Reveal
            key={item.label}
            delay={index * 60}
            className={cn(
              index >= VISIBLES_MOBILE && !expanded && "hidden sm:block",
            )}
          >
            {item.src ? (
              <ContentImage
                ratio="4/3"
                src={item.src}
                alt={item.alt}
                sizes={VIGNETTE_SIZES}
              />
            ) : (
              <PlaceholderImage ratio="4/3" label={item.label} alt={item.alt} />
            )}
          </Reveal>
        ))}
      </div>
      {masquees > 0 && !expanded && (
        <button
          type="button"
          aria-expanded={expanded}
          aria-controls="galerie-vignettes"
          onClick={() => setExpanded(true)}
          className={buttonClasses("outline", "mt-4 w-full sm:hidden")}
        >
          Voir plus de photos ↓
        </button>
      )}
    </section>
  );
}
