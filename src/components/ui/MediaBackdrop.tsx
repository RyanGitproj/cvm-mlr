import Image from "next/image";
import { cn } from "@/lib/cn";
import type { MediaImage } from "@/types/funnel";

/**
 * Pastille de guidage studio d'un visuel placeholder (icône + libellé du
 * contenu attendu). Posée en coin par MediaBackdrop, ou dans le flux par la
 * carte quand le coin croiserait le texte (cartes Q1 claires).
 */
export function MediaLabelChip({
  label,
  className,
}: {
  label: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex max-w-[24ch] items-center gap-1.5 rounded-md bg-card/85 px-2 py-1 text-[10px] font-medium uppercase tracking-wide text-ink-soft",
        className,
      )}
    >
      <svg
        aria-hidden
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        className="shrink-0 text-accent"
      >
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <circle cx="9" cy="10" r="1.8" />
        <path d="m3 17 5-5 4 4 3-3 6 6" />
      </svg>
      {label}
    </span>
  );
}

type Props = {
  /** Visuel {label, alt, src?, mobileSrc?} — motif placeholder tant que `src`
   *  est absent ; `mobileSrc` prend le relais sous `sm` (art-direction). */
  image: MediaImage;
  /** Largeurs d'affichage responsive transmises à next/image. */
  sizes: string;
  /** Cadrage de la photo (object-position CSS) quand le sujet n'est pas centré. */
  objectPosition?: string;
  /** Pastille studio en coin du placeholder — à désactiver si la carte la rend en flux. */
  showLabel?: boolean;
  className?: string;
};

/**
 * Calque média plein cadre des cartes maquette 2026-07-07 (fond photo des
 * cartes Q1, volet photo des cartes d'offre) : absolu, sans bord ni ratio —
 * le parent positionné clippe et donne sa taille. Sans `src`, le motif
 * placeholder occupe le fond avec le même rôle d'accessibilité qu'une photo
 * (alt définitif).
 */
export function MediaBackdrop({
  image,
  sizes,
  objectPosition,
  showLabel = true,
  className,
}: Props) {
  if (image.src !== undefined) {
    const style = objectPosition ? { objectPosition } : undefined;
    // Art-direction : sous `sm`, un visuel cadré mobile remplace le paysage
    // large (sinon rogné en tranche étroite → flou). Les deux <Image> sont
    // rendus, la visibilité est basculée par média-query ; le second peut être
    // préchargé malgré `hidden` — coût négligeable ici (vignette < 1 Mo).
    if (image.mobileSrc !== undefined) {
      return (
        <span className={cn("absolute inset-0", className)}>
          <Image
            src={image.mobileSrc}
            alt={image.alt}
            fill
            sizes={sizes}
            className="object-cover sm:hidden"
            style={style}
          />
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes={sizes}
            className="hidden object-cover sm:block"
            style={style}
          />
        </span>
      );
    }
    return (
      <span className={cn("absolute inset-0", className)}>
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes={sizes}
          className="object-cover"
          style={style}
        />
      </span>
    );
  }

  return (
    <span
      role="img"
      aria-label={image.alt}
      className={cn(
        "absolute inset-0 bg-linear-to-br from-surface-2 via-card to-accent-soft/30",
        className,
      )}
    >
      {showLabel && (
        <MediaLabelChip label={image.label} className="absolute right-2 top-2" />
      )}
    </span>
  );
}
