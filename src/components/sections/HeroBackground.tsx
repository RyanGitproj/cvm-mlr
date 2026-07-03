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
 * placeholder clair (voile clair, texte sombre par-dessus) réserve la place
 * et porte l'alt. Une fois l'asset fourni, la vraie photo le remplace,
 * nette et pleine résolution ; seul un voile sombre concentré en haut du
 * cadre (là où vit le texte, en mobile comme en PC) assure le contraste —
 * le reste de la photo reste net et pleinement visible, mis en valeur.
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
          quality={90}
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
        className={
          src
            ? "absolute inset-0 bg-linear-to-b from-ink-strong/75 via-ink-strong/20 to-transparent"
            : "absolute inset-0 bg-linear-to-br from-surface/85 via-surface/65 to-surface/50"
        }
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
