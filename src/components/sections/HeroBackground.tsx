type Props = {
  /** Décrit l'image attendue — guide le remplacement par le vrai asset. */
  label: string;
  /** Alt définitif de l'image de fond (accessibilité + futur SEO). */
  alt: string;
};

/**
 * Fond plein cadre d'un hero : la future image (placeholder dégradé qui
 * réserve la place et porte l'alt) recouverte d'un voile clair pour garder
 * le texte sombre lisible sur n'importe quelle photo — en mobile comme en PC.
 * Remplacer le dégradé par la vraie image ici, sans toucher aux pages.
 */
export function HeroBackground({ label, alt }: Props) {
  return (
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
