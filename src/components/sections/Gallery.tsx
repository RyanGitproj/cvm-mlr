import { Reveal } from "@/components/motion/Reveal";
import { ContentImage } from "@/components/ui/ContentImage";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { SectionHeading } from "./SectionHeading";

type Item = { label: string; alt: string; src?: string };

type Props = {
  titre: string;
  items: readonly Item[];
};

/** Largeur d'une vignette selon la grille (3 col ≥ lg, 2 col ≥ sm). */
const VIGNETTE_SIZES = "(min-width: 1024px) 368px, (min-width: 640px) 50vw, 100vw";

export function Gallery({ titre, items }: Props) {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
      <SectionHeading titre={titre} />
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, index) => (
          <Reveal key={item.label} delay={index * 60}>
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
    </section>
  );
}
