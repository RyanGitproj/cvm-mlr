import { SectionHeading } from "./SectionHeading";

type Etape = { titre: string; texte: string };

type Props = {
  titre: string;
  sousTitre?: string;
  etapes: readonly Etape[];
};

/** Parcours d'accompagnement en étapes numérotées (projet → proposition → validation). */
export function Etapes({ titre, sousTitre, etapes }: Props) {
  return (
    <section className="border-y border-line bg-surface-2">
      <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
        <SectionHeading titre={titre} sousTitre={sousTitre} />
        <ol className="mt-8 grid gap-6 sm:grid-cols-3">
          {etapes.map((etape, index) => (
            <li key={etape.titre} className="flex gap-4">
              <span
                aria-hidden
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent font-heading text-lg font-bold text-accent-contrast"
              >
                {index + 1}
              </span>
              <div>
                <p className="font-semibold text-ink-strong">{etape.titre}</p>
                <p className="mt-1 text-sm text-ink-soft">{etape.texte}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
