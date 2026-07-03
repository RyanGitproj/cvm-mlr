import { ButtonLink } from "@/components/ui/Button";
import { ScrollCtaLink } from "@/components/ui/ScrollCtaLink";
import { HeroBackground } from "./HeroBackground";

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
  /** Chemin de l'asset réel (`public/images/...`) — absent tant que non fourni. */
  imageSrc?: string;
};

/**
 * Hero générique — image en fond plein cadre (voile clair + texte sombre),
 * identique en mobile et en PC. Le CTA principal reste above the fold en
 * 390×844.
 */
export function Hero({
  surtitre,
  titre,
  sousTitre,
  ctas,
  micro,
  imageLabel,
  imageAlt,
  imageSrc,
}: Props) {
  return (
    <section className="relative overflow-hidden">
      <HeroBackground label={imageLabel} alt={imageAlt} src={imageSrc} />
      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 sm:py-20 lg:py-28">
        <div className="animate-fade-rise max-w-2xl">
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
            {ctas.map((cta) =>
              // Ancre même page → scroll contrôlé (fluide, reduced-motion, focus).
              cta.href.startsWith("#") ? (
                <ScrollCtaLink
                  key={cta.href + cta.label}
                  targetId={cta.href.slice(1)}
                  variant={cta.variant ?? "primary"}
                >
                  {cta.label}
                </ScrollCtaLink>
              ) : (
                <ButtonLink
                  key={cta.href + cta.label}
                  href={cta.href}
                  variant={cta.variant ?? "primary"}
                >
                  {cta.label}
                </ButtonLink>
              ),
            )}
          </div>
          {micro && micro.length > 0 && (
            <p className="mt-4 text-xs text-ink-soft">{micro.join(" · ")}</p>
          )}
        </div>
      </div>
    </section>
  );
}
