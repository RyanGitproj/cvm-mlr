import { cn } from "@/lib/cn";

type Ratio = "21/9" | "16/9" | "4/3" | "3/2" | "1/1" | "3/4";

type Props = {
  ratio: Ratio;
  /** Contenu attendu, affiché au centre (guide le remplacement par le vrai asset). */
  label: string;
  /** Alt descriptif définitif — accessibilité + futur SEO. */
  alt: string;
  className?: string;
};

/**
 * Placeholder d'image (brief §10.1) : réserve exactement la place du futur
 * asset (aspect-ratio) pour éviter tout layout shift — aucune image générée.
 */
export function PlaceholderImage({ ratio, label, alt, className }: Props) {
  return (
    <div
      role="img"
      aria-label={alt}
      style={{ aspectRatio: ratio.replace("/", " / ") }}
      className={cn(
        "flex w-full items-center justify-center overflow-hidden rounded-2xl border-2 border-line bg-linear-to-br from-surface-2 via-card to-accent-soft/30",
        className,
      )}
    >
      <span className="flex flex-col items-center gap-2 p-4 text-center">
        <svg
          aria-hidden
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="text-accent"
        >
          <rect x="3" y="4" width="18" height="16" rx="2" />
          <circle cx="9" cy="10" r="1.8" />
          <path d="m3 17 5-5 4 4 3-3 6 6" />
        </svg>
        <span className="max-w-[26ch] text-xs font-medium uppercase tracking-wide text-ink-soft">
          {label}
        </span>
      </span>
    </div>
  );
}
