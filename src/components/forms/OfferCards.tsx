"use client";

import type { ReactNode } from "react";
import { useFormContext } from "react-hook-form";
import { MediaBackdrop } from "@/components/ui/MediaBackdrop";
import { offerOptionsFor, type OfferIcon } from "@/config/offers";
import { cn } from "@/lib/cn";
import type { FunnelType } from "@/types/lead";
import { FieldError } from "./FieldError";

type Props = {
  funnelType: FunnelType;
  labelledBy: string;
  /** Avance automatique du wizard au clic (voir RadioCards.onSelect). */
  onSelect?: (value: string) => void;
};

/** Pictogrammes décoratifs du badge rond des cartes d'offre (maquette 3). */
const OFFER_ICON_PATHS: Record<OfferIcon, ReactNode> = {
  bus: (
    <>
      <rect x="3.5" y="6" width="17" height="11" rx="2" />
      <path d="M3.5 11.5h17" />
      <path d="M7 6V4h10v2" />
      <circle cx="8" cy="19.2" r="1.4" />
      <circle cx="16" cy="19.2" r="1.4" />
    </>
  ),
  jeep: (
    <>
      <path d="M3 16v-4.4L5.2 11l2.1-4h7.2l2.3 4 4.2.9V16" />
      <path d="M3 16h18" />
      <circle cx="7.5" cy="18.2" r="1.6" />
      <circle cx="16.5" cy="18.2" r="1.6" />
    </>
  ),
  trek: (
    <>
      <circle cx="17.5" cy="6.5" r="1.8" />
      <path d="m2.8 18.5 6-10 4.4 7.2 3.3-4.7 4.7 7.5z" />
    </>
  ),
  plage: (
    <>
      <path d="M4 12a8 8 0 0 1 16 0Z" />
      <path d="M12 12v8" />
      <path d="M7.5 20h9" />
    </>
  ),
  bivouac: (
    <>
      <path d="M12 4.8 3.4 19h17.2Z" />
      <path d="m12 12.5 3.8 6.5H8.2Z" />
    </>
  ),
  "grand-tour": (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="m15.6 8.4-2.1 5.1-5.1 2.1 2.1-5.1z" />
    </>
  ),
};

/**
 * Choix de formule — Q2 du gabarit, carte scindée maquette 3 (2026-07-07) :
 * volet photo rectangle pleine hauteur à gauche, panneau texte à droite
 * (badge icône rond, titre, phrase d'appui, filet, prix accent, note, CTA
 * décoratif pleine largeur). Côte à côte même en mobile — la maquette est
 * un mockup 390 px. Les options viennent de la config partagée
 * (offerOptionsFor) alignée sur l'enum Zod `offreDuree` ; chaque funnel y
 * porte ses propres textes.
 */
export function OfferCards({ funnelType, labelledBy, onSelect }: Props) {
  const { register, watch } = useFormContext();
  const options = offerOptionsFor(funnelType);
  const selected: unknown = watch("offreDuree");

  return (
    <div className="grid gap-1.5">
      <div
        role="radiogroup"
        aria-labelledby={labelledBy}
        // Empilées en mobile ; côte à côte en PC dès qu'il y a 2 offres
        // (demande Ryan 2026-07-08). Une offre seule (Grand Tour) reste
        // pleine largeur — jamais une carte orpheline en demi-colonne.
        className={cn("grid gap-3", options.length >= 2 && "sm:grid-cols-2")}
      >
        {options.map((option) => {
          const isSelected = option.value === selected;
          return (
            <label
              key={option.value}
              className={cn(
                "grid cursor-pointer grid-cols-[minmax(0,4fr)_minmax(0,5fr)] overflow-hidden rounded-3xl border-2 bg-card transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-accent",
                isSelected ? "border-accent" : "border-line hover:border-accent-soft",
              )}
            >
              <input
                type="radio"
                value={option.value}
                {...register("offreDuree")}
                onClick={() => onSelect?.(option.value)}
                className="sr-only"
              />
              <span className="p-2.5 pr-0 sm:p-3 sm:pr-0">
                <span className="relative block h-full min-h-36 overflow-hidden rounded-2xl">
                  {option.image ? (
                    <MediaBackdrop
                      image={option.image}
                      sizes="(min-width: 640px) 280px, 45vw"
                    />
                  ) : (
                    <span
                      aria-hidden
                      className="absolute inset-0 bg-linear-to-br from-surface-2 via-card to-accent-soft/30"
                    />
                  )}
                </span>
              </span>
              <span className="flex flex-col items-start gap-1.5 p-3.5 sm:p-4">
                {/* Badge aligné avec le titre : une rangée de moins par
                    carte (compacité 2026-07-07). */}
                <span className="flex items-center gap-2">
                  {option.icon && (
                    <span
                      aria-hidden
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-accent-contrast"
                    >
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinejoin="round"
                        strokeLinecap="round"
                      >
                        {OFFER_ICON_PATHS[option.icon]}
                      </svg>
                    </span>
                  )}
                  <span className="font-heading text-lg font-bold leading-snug text-ink-strong sm:text-xl">
                    {option.label}
                  </span>
                </span>
                {option.description && (
                  <span className="text-sm leading-snug text-ink-soft">
                    {option.description}
                  </span>
                )}
                <span aria-hidden className="h-0.5 w-10 rounded-full bg-accent/70" />
                <span className="text-sm text-ink">
                  À partir de{" "}
                  {/* Prix + « / personne » soudés : « / personne » ne doit
                      jamais retomber seul sous le prix (mobile compris). */}
                  <span className="whitespace-nowrap">
                    <strong className="text-lg font-bold text-accent sm:text-xl">
                      {option.priceText}
                    </strong>
                    <span className="text-ink-soft"> / personne</span>
                  </span>
                </span>
                {option.priceNote && (
                  <span className="-mt-1 text-xs text-ink-soft">
                    {option.priceNote}
                  </span>
                )}
                {/* Pas de faux bouton « Je choisis… » : retiré le 2026-07-07
                    (demande Ryan — il alourdissait et élargissait la carte) ;
                    la carte entière est cliquable, le prix fait l'ancre. */}
              </span>
            </label>
          );
        })}
      </div>
      <FieldError name="offreDuree" />
    </div>
  );
}
