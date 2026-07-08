"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

export type NavLink = { href: string; label: string };

type Props = {
  homeLabel: string;
  links: NavLink[];
  /** CTA d'action du funnel, à gauche du hamburger (absent sur la page mère). */
  cta?: NavLink;
};

/**
 * Header commun. La nav ne porte que les deux choix du funnel (directive
 * boss 2026-07). En mobile, les deux marques sont repliées derrière un menu
 * hamburger qui s'ouvre en overlay sous la barre — la navbar reste à sa
 * hauteur minimale (logo + icône). En ≥ sm, les liens sont en ligne.
 */
export function Header({ homeLabel, links, cta }: Props) {
  const [open, setOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    const onPointerDown = (event: PointerEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onPointerDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  const barBase =
    "h-0.5 w-6 rounded-full bg-current motion-safe:transition-transform motion-safe:duration-200";

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-40 border-b border-line bg-surface/90 backdrop-blur"
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-2 px-4 sm:gap-4 sm:px-6">
        {/* Lockup or « Célébrations Voyages » (logo fourni par Ryan le
            2026-07-07, remplace la plaque noire) : plaque claire assumée,
            coins arrondis + bordure dorée (demande Ryan). `border-brand-gold`
            = or de marque fixe, jamais surchargé par l'accent d'aventure.
            homeLabel = nom accessible du lien. `unoptimized` : dorures
            fines, on sert le fichier original. `aspect-[1600/311]`
            verrouille le ratio dès le 1er paint. Le logo mène toujours à la
            page mère `/` (société éditrice), quel que soit l'univers courant
            (demande Ryan 2026-07-08). */}
        <Link
          href="/"
          onClick={() => setOpen(false)}
          className="flex shrink-0 items-center"
        >
          <Image
            src="/images/logo-celebrations-voyages-or.jpeg"
            alt={homeLabel}
            width={1600}
            height={311}
            priority
            unoptimized
            // h-6 mobile (≈ 124 px de large) : même encombrement que
            // l'ancienne plaque — le CTA le plus long du header (« Choisir
            // mon aventure », /mlr à 390 px) tient sans ellipse.
            className="aspect-[1600/311] h-6 w-auto rounded-md border border-brand-gold/80 shadow-sm sm:h-12 sm:rounded-xl"
          />
        </Link>

        <div className="flex min-w-0 items-center gap-2">
          {cta && (
            // À gauche du hamburger. Filet anti-débordement : min-w-0 +
            // truncate + max-w bornée en mobile → jamais de casse de barre,
            // le libellé s'ellipse en dernier recours (hamburger prioritaire).
            <Link
              href={cta.href}
              onClick={() => setOpen(false)}
              className="min-w-0 max-w-[52vw] shrink truncate rounded-lg bg-accent px-3 py-2 text-sm font-semibold text-accent-contrast transition-colors hover:bg-accent-soft sm:max-w-none"
            >
              {cta.label}
            </Link>
          )}

          <nav
            aria-label="Navigation principale"
            className="flex shrink-0 items-center"
          >
          <button
            type="button"
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={open}
            aria-controls="nav-liens"
            onClick={() => setOpen((value) => !value)}
            className="flex h-10 w-10 flex-col items-center justify-center gap-[5px] rounded-lg text-ink-strong transition-colors hover:bg-surface-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent sm:hidden"
          >
            <span
              className={cn(barBase, open && "translate-y-[7px] rotate-45")}
            />
            <span
              className={cn(
                "h-0.5 w-6 rounded-full bg-current motion-safe:transition-opacity motion-safe:duration-200",
                open && "opacity-0",
              )}
            />
            <span
              className={cn(barBase, open && "-translate-y-[7px] -rotate-45")}
            />
          </button>

          <ul
            id="nav-liens"
            className={cn(
              "sm:flex sm:items-center sm:gap-2",
              // Mobile : overlay absolu sous la barre — n'occupe aucun espace
              // quand il est fermé, la navbar garde sa hauteur minimale.
              "absolute inset-x-0 top-16 flex-col border-b border-line bg-surface/95 px-4 py-2 shadow-sm backdrop-blur",
              "sm:static sm:top-auto sm:flex-row sm:border-0 sm:bg-transparent sm:px-0 sm:py-0 sm:shadow-none sm:backdrop-blur-none",
              open ? "flex" : "hidden sm:flex",
            )}
          >
            {links.map((link) => (
              <li key={link.href} className="w-full sm:w-auto">
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block whitespace-nowrap rounded-lg px-3 py-3 text-sm font-medium text-ink-soft transition-colors hover:bg-surface-2 hover:text-ink-strong sm:rounded-full sm:py-2"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}
