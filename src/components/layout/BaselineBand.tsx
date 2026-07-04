import { mlrBrand } from "@/config/brands";

/**
 * Bandeau de devise MLR « ◆ Voyagez autrement, vivez vrai ◆ » — sous le
 * header et en pied de page, comme sur les maquettes 8-visuels (écrans
 * 1, 2, 3, 4 et 7).
 */
export function BaselineBand() {
  return (
    <p className="mx-auto flex w-full max-w-6xl items-center gap-2 px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-soft sm:gap-3 sm:px-6 sm:text-[11px] sm:tracking-[0.2em]">
      <span aria-hidden className="h-px flex-1 bg-line" />
      <span aria-hidden className="text-accent">◆</span>
      <span className="shrink-0 text-center">{mlrBrand.baseline}</span>
      <span aria-hidden className="text-accent">◆</span>
      <span aria-hidden className="h-px flex-1 bg-line" />
    </p>
  );
}
