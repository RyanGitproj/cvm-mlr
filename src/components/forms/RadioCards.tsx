"use client";

import { useFormContext } from "react-hook-form";
import { MediaBackdrop, MediaLabelChip } from "@/components/ui/MediaBackdrop";
import { cn } from "@/lib/cn";
import { splitOptionLabel } from "@/lib/optionLabel";
import type { ChoiceOption } from "@/types/funnel";
import { FieldError } from "./FieldError";
import { PrecisionField } from "./PrecisionField";

type Props = {
  name: string;
  options: ChoiceOption[];
  labelledBy: string;
  /**
   * Avance automatique du wizard, branchée sur le `click` de l'input (souris,
   * Espace, Entrée) — jamais sur `change` : les flèches clavier naviguent
   * entre options sans quitter l'écran. Ignorée pour une option `freeText`
   * (le champ précision doit être rempli avant de continuer).
   */
  onSelect?: (option: ChoiceOption) => void;
};

/**
 * Grandes cartes radio tactiles — une décision par écran. Deux rendus
 * (maquettes boss 2026-07-07) :
 * - option avec image → carte immersive maquette étape 1 : large rectangle,
 *   photo en fond, voile de lisibilité, titre display + phrase d'appui +
 *   pilule CTA posés dessus. Sans photo réelle (placeholder clair), le
 *   contraste s'inverse : texte encre, pilule contour — comme la 3ᵉ carte
 *   de la maquette.
 * - option sans image → carte texte sobre (période, personnes…).
 * La phrase d'appui vient de `option.description`, sinon de la scission du
 * libellé source (« Nord : Diego, reliefs… »).
 */
export function RadioCards({ name, options, labelledBy, onSelect }: Props) {
  const { register, watch } = useFormContext();
  const selected: unknown = watch(name);
  const freeTextActive = options.some(
    (option) => option.freeText === true && option.value === selected,
  );

  return (
    <div role="radiogroup" aria-labelledby={labelledBy} className="grid gap-3">
      {options.map((option) => {
        const isSelected = option.value === selected;
        const { title, description } =
          option.description !== undefined
            ? { title: option.label, description: option.description }
            : splitOptionLabel(option.label);
        const input = (
          <input
            type="radio"
            value={option.value}
            {...register(name)}
            onClick={() => {
              if (option.freeText !== true) onSelect?.(option);
            }}
            className="sr-only"
          />
        );

        if (option.image !== undefined) {
          const hasPhoto = option.image.src !== undefined;
          return (
            <label
              key={option.value}
              className={cn(
                "relative isolate flex min-h-52 cursor-pointer flex-col overflow-hidden rounded-3xl border-2 p-5 transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-accent sm:min-h-56 sm:p-6",
                isSelected
                  ? "border-accent"
                  : hasPhoto
                    ? "border-transparent shadow-lg hover:border-accent-soft"
                    : "border-line hover:border-accent-soft",
              )}
            >
              {input}
              <MediaBackdrop
                image={option.image}
                sizes="(min-width: 640px) 640px, 100vw"
                showLabel={false}
                className="-z-20"
              />
              {hasPhoto && (
                <span aria-hidden className="photo-veil absolute inset-0 -z-10" />
              )}
              {!hasPhoto && (
                // Pastille studio dans le flux : en coin absolu, elle
                // croiserait les titres longs (cartes claires Orientation).
                <MediaLabelChip label={option.image.label} className="self-end" />
              )}
              <span className="mt-auto flex max-w-[34ch] flex-col items-start gap-1.5 pt-3">
                <span
                  className={cn(
                    "font-heading text-2xl font-bold leading-tight sm:text-3xl",
                    hasPhoto ? "text-on-veil" : "text-ink-strong",
                  )}
                >
                  {title}
                </span>
                {description && (
                  <span
                    className={cn(
                      "text-sm leading-snug sm:text-base",
                      hasPhoto ? "text-on-veil/90" : "text-ink-soft",
                    )}
                  >
                    {description}
                  </span>
                )}
                {option.ctaLabel && (
                  <span
                    aria-hidden
                    className={cn(
                      "mt-3 inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold",
                      hasPhoto
                        ? "bg-accent text-accent-contrast"
                        : "border-2 border-accent text-accent",
                    )}
                  >
                    {option.ctaLabel} →
                  </span>
                )}
              </span>
            </label>
          );
        }

        return (
          <label
            key={option.value}
            className={cn(
              "flex cursor-pointer flex-col gap-3 rounded-xl border-2 bg-card p-4 transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-accent",
              isSelected ? "border-accent" : "border-line hover:border-accent-soft",
            )}
          >
            {input}
            <span className="flex items-start gap-3">
              <span
                aria-hidden
                className={cn(
                  "mt-0.5 h-4 w-4 shrink-0 rounded-full border-2 transition-colors",
                  isSelected ? "border-accent bg-accent" : "border-line",
                )}
              />
              <span className="grid flex-1 gap-1">
                <span className="text-sm font-semibold leading-snug text-ink-strong sm:text-base">
                  {title}
                </span>
                {description && (
                  <span className="text-sm leading-snug text-ink-soft">
                    {description}
                  </span>
                )}
              </span>
            </span>
          </label>
        );
      })}
      {freeTextActive && <PrecisionField name={`${name}Precision`} />}
      <FieldError name={name} />
    </div>
  );
}
