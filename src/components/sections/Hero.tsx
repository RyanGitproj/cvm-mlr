import { ButtonLink } from "@/components/ui/Button";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";

type Cta = { href: string; label: string; variant?: "primary" | "outline" };

type Props = {
  surtitre?: string;
  titre: string;
  sousTitre: string;
  ctas: Cta[];
  /** Micro-réassurance sous les CTA (« réponse sous 24 h · … »). */
  micro?: readonly string[];
  imageLabel: string;
  imageAlt: string;
};

/** Hero générique — le CTA principal reste above the fold en 390×844. */
export function Hero({
  surtitre,
  titre,
  sousTitre,
  ctas,
  micro,
  imageLabel,
  imageAlt,
}: Props) {
  return (
    <section className="mx-auto grid w-full max-w-6xl items-center gap-8 px-4 pb-12 pt-8 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12 lg:pt-14">
      <div className="animate-fade-rise">
        {surtitre && (
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            {surtitre}
          </p>
        )}
        <h1 className="mt-3 font-heading text-3xl font-bold leading-tight text-ink-strong sm:text-5xl">
          {titre}
        </h1>
        <p className="mt-4 max-w-prose text-base text-ink-soft sm:text-lg">
          {sousTitre}
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          {ctas.map((cta) => (
            <ButtonLink
              key={cta.href + cta.label}
              href={cta.href}
              variant={cta.variant ?? "primary"}
            >
              {cta.label}
            </ButtonLink>
          ))}
        </div>
        {micro && micro.length > 0 && (
          <p className="mt-4 text-xs text-ink-soft">{micro.join(" · ")}</p>
        )}
      </div>
      <PlaceholderImage ratio="4/3" label={imageLabel} alt={imageAlt} />
    </section>
  );
}
