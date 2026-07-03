import { Reveal } from "@/components/motion/Reveal";
import { cn } from "@/lib/cn";
import { SectionHeading } from "./SectionHeading";

type Item = { titre: string; texte?: string };

type Props = {
  titre: string;
  sousTitre?: string;
  items: readonly Item[];
  /** Filet d'accent sur le titre (support de l'alternance MLR). */
  accent?: boolean;
  /** Ajouté sur la section — ex. `accent-forest` pour basculer au vert. */
  className?: string;
};

/** Grille de temps forts / inclus — reveal on scroll avec stagger. */
export function TempsForts({ titre, sousTitre, items, accent, className }: Props) {
  return (
    <section className={cn("mx-auto w-full max-w-6xl px-4 py-12 sm:px-6", className)}>
      <SectionHeading titre={titre} sousTitre={sousTitre} accent={accent} />
      <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, index) => (
          <li key={item.titre}>
            <Reveal delay={index * 80} className="h-full">
              <div className="h-full rounded-2xl border-2 border-line bg-card p-5">
                <span aria-hidden className="block h-1 w-8 rounded-full bg-accent" />
                <p className="mt-3 font-semibold text-ink-strong">{item.titre}</p>
                {item.texte && (
                  <p className="mt-1.5 text-sm text-ink-soft">{item.texte}</p>
                )}
              </div>
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  );
}
