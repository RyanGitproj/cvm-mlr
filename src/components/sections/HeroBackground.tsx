import Image from "next/image";

type Props = {
  /** Décrit l'image attendue — guide le remplacement par le vrai asset. */
  label: string;
  /** Alt définitif de l'image de fond (accessibilité + futur SEO). */
  alt: string;
  /** Chemin de l'asset réel (`public/images/...`) — absent tant que non fourni. */
  src?: string;
};

/**
 * Fond plein cadre d'un hero : tant que `src` est absent, un dégradé
 * placeholder réserve la place et porte l'alt ; une fois l'asset fourni, la
 * vraie photo le remplace. Un voile clair reste par-dessus pour garder le
 * texte sombre lisible sur n'importe quelle photo — en mobile comme en PC.
 */
export function HeroBackground({ label, alt, src }: Props) {
  return (
    <>
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      ) : (
        <div
          role="img"
          aria-label={alt}
          className="absolute inset-0 bg-linear-to-br from-surface-2 via-card to-accent-soft/40"
        />
      )}
      <div
        aria-hidden
        className="absolute inset-0 bg-linear-to-br from-surface/85 via-surface/65 to-surface/50"
      />
      {!src && (
        <span
          aria-hidden
          className="pointer-events-none absolute bottom-2 right-3 max-w-[45%] truncate text-[10px] font-medium uppercase tracking-wide text-ink-soft/45"
        >
          {label}
        </span>
      )}
    </>
  );
}
