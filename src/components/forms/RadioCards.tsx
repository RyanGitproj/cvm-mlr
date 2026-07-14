"use client";

import type { CSSProperties } from "react";
import { useFormContext } from "react-hook-form";
import { MediaBackdrop } from "@/components/ui/MediaBackdrop";
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
  /** Cartes en respiration déphasée (flag `breathe` du step — Q1/Q2). */
  breathe?: boolean;
};

/**
 * Grandes cartes radio tactiles — une décision par écran. Deux rendus
 * (maquettes boss 2026-07-07) :
 * - option avec image → carte immersive maquette étape 1 : rectangle large,
 *   photo en fond, voile de lisibilité, titre display + phrase d'appui +
 *   pilule CTA posés dessus. Sans photo réelle (placeholder clair), le
 *   contraste s'inverse : texte encre, pilule contour — comme la 3ᵉ carte
 *   de la maquette.
 * - option sans image → carte texte sobre (période, personnes…).
 * Densité (2026-07-07) : l'écran doit se voir d'un bloc — hauteurs au
 * contenu, marges serrées, deux colonnes dès `sm` dès qu'il y a au moins
 * 2 options (les 2 routes MLR se posent côte à côte sur desktop).
 */
export function RadioCards({
  name,
  options,
  labelledBy,
  onSelect,
  breathe,
}: Props) {
  const { register, watch } = useFormContext();
  const selected: unknown = watch(name);
  const selectedOption = options.find((option) => option.value === selected);
  const freeTextActive = selectedOption?.freeText === true;

  return (
    <div
      role="radiogroup"
      aria-labelledby={labelledBy}
      className={cn("grid gap-2", options.length >= 2 && "sm:grid-cols-2")}
    >
      {options.map((option, index) => {
        const isSelected = option.value === selected;
        // Vague en quarts de cycle (1.6s), comme les cards de la landing /cvm.
        const breatheStyle = breathe
          ? ({ "--breathe-delay": `${index * -0.4}s` } as CSSProperties)
          : undefined;
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
              style={breatheStyle}
              className={cn(
                "relative isolate flex cursor-pointer flex-col overflow-hidden rounded-3xl border-2 transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-accent sm:p-5",
                breathe && "animate-breathe",
                // Seules les cartes photo imposent hauteur et cadre larges ;
                // les cartes claires se serrent sur leur contenu (fold mobile).
                hasPhoto ? "min-h-40 p-4 sm:min-h-44" : "p-3",
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
                sizes="(min-width: 640px) 320px, 100vw"
                showLabel={false}
                className="-z-20"
              />
              {hasPhoto && (
                <span aria-hidden className="photo-veil absolute inset-0 -z-10" />
              )}
              {/* Pas de pilule « Je choisis… » : retirée le 2026-07-07
                  (compacité, décision Ryan) — la carte entière est cliquable. */}
              <span className="mt-auto flex max-w-[34ch] flex-col items-start gap-1">
                <span
                  className={cn(
                    "font-heading text-xl font-bold leading-tight sm:text-2xl",
                    hasPhoto ? "text-on-veil" : "text-ink-strong",
                  )}
                >
                  {title}
                </span>
                {description && (
                  <span
                    className={cn(
                      "text-sm leading-snug",
                      hasPhoto ? "text-on-veil/90" : "text-ink-soft",
                    )}
                  >
                    {description}
                  </span>
                )}
              </span>
            </label>
          );
        }

        return (
          <label
            key={option.value}
            style={breatheStyle}
            className={cn(
              // justify-center : dans une grille mixte avec des cartes à
              // image (Îles, Orientation), la carte texte étirée centre son
              // contenu au lieu de paraître creuse.
              "flex cursor-pointer flex-col justify-center gap-2 rounded-xl border-2 bg-card p-3 transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-accent",
              breathe && "animate-breathe",
              isSelected ? "border-accent" : "border-line hover:border-accent-soft",
            )}
          >
            {input}
            <span className="flex items-start gap-2.5">
              <span
                aria-hidden
                className={cn(
                  "mt-0.5 h-4 w-4 shrink-0 rounded-full border-2 transition-colors",
                  isSelected ? "border-accent bg-accent" : "border-line",
                )}
              />
              <span className="grid flex-1 gap-0.5">
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
      {freeTextActive && (
        <div className="sm:col-span-full">
          <PrecisionField
            name={`${name}Precision`}
            number={selectedOption?.precisionInput}
          />
        </div>
      )}
      <div className="sm:col-span-full empty:hidden">
        <FieldError name={name} />
      </div>
    </div>
  );
}
