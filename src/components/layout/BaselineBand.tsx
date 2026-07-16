import { mlrBrand } from "@/config/brands";
import { cn } from "@/lib/cn";

/**
 * Bandeau de devise MLR « ◆ Voyagez autrement, vivez vrai ◆ » — sous le
 * header et en pied de page, comme sur les maquettes 8-visuels (écrans
 * 1, 2, 3, 4 et 7). `tone="light"` pour le footer, dont le fond photo est
 * sombre (texte clair) ; défaut sombre pour l'usage sur surface claire (header).
 */
export function BaselineBand({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const light = tone === "light";
  return (
    <p
      className={cn(
        "mx-auto flex w-full max-w-6xl items-center gap-2 px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.14em] sm:gap-3 sm:px-6 sm:text-[11px] sm:tracking-[0.2em]",
        light ? "text-surface/85" : "text-ink-soft",
      )}
    >
      <span aria-hidden className={cn("h-px flex-1", light ? "bg-surface/25" : "bg-line")} />
      <span aria-hidden className={light ? "text-surface/70" : "text-accent"}>◆</span>
      <span className="shrink-0 text-center">{mlrBrand.baseline}</span>
      <span aria-hidden className={light ? "text-surface/70" : "text-accent"}>◆</span>
      <span aria-hidden className={cn("h-px flex-1", light ? "bg-surface/25" : "bg-line")} />
    </p>
  );
}
