import { ButtonLink } from "@/components/ui/Button";
import { ScrollCtaLink } from "@/components/ui/ScrollCtaLink";
import { cn } from "@/lib/cn";
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
  /** Alignement du bloc de texte. `center` réservé à la page mère. */
  align?: "left" | "center";
};

/**
 * Hero générique — image en fond plein cadre, identique en mobile et en PC.
 * Le CTA principal reste above the fold en 390×844. Tant qu'aucune photo
 * réelle n'est fournie (`imageSrc`), le texte reste sombre sur le dégradé
 * placeholder clair ; une fois la photo posée, l'image reste pleinement
 * visible (aucun voile global) et le texte bascule en clair sur un cartouche
 * sombre semi-transparent à coins arrondis, qui porte seul le contraste.
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
  align = "left",
}: Props) {
  const hasImage = Boolean(imageSrc);
  const isCenter = align === "center";

  return (
    <section className="relative overflow-hidden">
      <HeroBackground label={imageLabel} alt={imageAlt} src={imageSrc} />
      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 sm:py-20 lg:py-28">
        <div
          className={cn(
            "animate-fade-rise max-w-2xl",
            // Cartouche sombre : porte le contraste du texte clair sans voiler
            // l'image (le reste du cadre photo reste net et pleinement visible).
            hasImage && "rounded-2xl bg-ink-strong/25 p-6 backdrop-blur-sm sm:p-8",
            // Page mère : bloc centré horizontalement + texte centré.
            isCenter && "mx-auto text-center",
          )}
        >
          {surtitre && (
            <p
              className={cn(
                "text-xs font-semibold uppercase tracking-[0.2em]",
                hasImage
                  ? "text-accent-contrast text-shadow-sm text-shadow-ink-strong/70"
                  : "text-accent",
              )}
            >
              {surtitre}
            </p>
          )}
          <h1
            className={cn(
              "mt-3 text-balance font-heading text-3xl font-bold leading-tight sm:text-5xl",
              hasImage
                ? "text-accent-contrast text-shadow-lg text-shadow-ink-strong/80"
                : "text-ink-strong",
            )}
          >
            {titre}
          </h1>
          <p
            className={cn(
              "mt-4 max-w-prose text-base sm:text-lg",
              hasImage
                ? "text-accent-contrast/90 text-shadow-md text-shadow-ink-strong/70"
                : "text-ink-soft",
              isCenter && "mx-auto",
            )}
          >
            {sousTitre}
          </p>
          <div
            className={cn(
              "mt-6 flex flex-wrap gap-3",
              isCenter && "justify-center",
            )}
          >
            {ctas.map((cta) => {
              const variant = cta.variant ?? "primary";
              // Le CTA principal porte le halo lumineux (directive boss
              // 2026-07) ; l'outline sur photo garde son contraste clair.
              const ctaClass = cn(
                variant === "primary" && "cta-pulse",
                hasImage && variant === "outline"
                  ? "!border-accent-contrast !text-accent-contrast hover:!bg-accent-contrast/15"
                  : undefined,
              );
              // Ancre même page → scroll contrôlé (fluide, reduced-motion, focus).
              return cta.href.startsWith("#") ? (
                <ScrollCtaLink
                  key={cta.href + cta.label}
                  targetId={cta.href.slice(1)}
                  variant={variant}
                  className={ctaClass}
                >
                  {cta.label}
                </ScrollCtaLink>
              ) : (
                <ButtonLink
                  key={cta.href + cta.label}
                  href={cta.href}
                  variant={variant}
                  className={ctaClass}
                >
                  {cta.label}
                </ButtonLink>
              );
            })}
          </div>
          {micro && micro.length > 0 && (
            <p
              className={cn(
                "mt-4 text-xs",
                hasImage
                  ? "text-accent-contrast/85 text-shadow-sm text-shadow-ink-strong/70"
                  : "text-ink-soft",
              )}
            >
              {micro.join(" · ")}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
