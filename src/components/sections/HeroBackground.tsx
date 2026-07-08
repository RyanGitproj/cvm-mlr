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
 * Fond plein cadre d'un hero. Une fois l'asset fourni (`src`), la photo occupe
 * tout le cadre, nette et pleine résolution, sans voile ni cartouche (les
 * visuels sont fournis déjà prêts pour porter le texte). Tant que `src` est
 * absent, un dégradé placeholder clair réserve la place, porte l'alt et laisse
 * lire le texte sombre par-dessus.
 */
export function HeroBackground({ label, alt, src }: Props) {
  return src ? (
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
    <>
      <div
        role="img"
        aria-label={alt}
        className="absolute inset-0 bg-linear-to-br from-surface-2 via-card to-accent-soft/40"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-linear-to-br from-surface/85 via-surface/65 to-surface/50"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute bottom-2 right-3 max-w-[45%] truncate text-[10px] font-medium uppercase tracking-wide text-ink-soft/45"
      >
        {label}
      </span>
    </>
  );
}
