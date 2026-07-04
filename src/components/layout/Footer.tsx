import Link from "next/link";
import { MailLink, PhoneLink } from "@/components/ui/ContactLinks";
import { cvmBrand, mlrBrand } from "@/config/brands";
import { legal } from "@/config/legal";
import type { Brand } from "@/types/lead";
import { BaselineBand } from "./BaselineBand";

const FOOTER_LINK_CLASS =
  "text-sm text-ink-soft transition-colors hover:text-ink-strong";

export function Footer({ brand }: { brand: Brand | "mere" }) {
  return (
    <footer className="mt-auto border-t border-line bg-surface-2">
      {brand === "mlr" && (
        <>
          <BaselineBand />
          <p className="torn-edge bg-accent px-4 py-3 text-center text-xs font-semibold uppercase tracking-widest text-accent-contrast">
            {mlrBrand.signature}
          </p>
        </>
      )}
      {/* Pas de bloc « Parcours » : directive boss 2026-07 — aucune sortie
          latérale du funnel. Seuls restent le légal (obligation) et le
          contact ; la FAQ vit ici, en réassurance, pas en navigation. */}
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-2 sm:px-6">
        <div>
          <p className="font-heading text-lg font-bold text-ink-strong">Madagascar</p>
          {/* Formulation MLR dictée par le boss (2026-07) : « Road-trip
              Madagascar — la liberté de vivre simplement une expérience
              unique ». */}
          <p className="mt-2 max-w-prose text-sm text-ink-soft">
            Deux marques, une même équipe locale : le voyage organisé et serein
            avec {cvmBrand.nom} · le road-trip Madagascar avec {mlrBrand.nom} —
            la liberté de vivre simplement une expérience unique.
          </p>
        </div>
        <nav aria-label="Informations" className="grid content-start gap-2">
          <p className="text-sm font-semibold text-ink-strong">Informations</p>
          <PhoneLink className={FOOTER_LINK_CLASS} />
          <MailLink className={FOOTER_LINK_CLASS} />
          <Link href="/faq" className={FOOTER_LINK_CLASS}>
            Questions fréquentes
          </Link>
          <Link href="/mentions-legales" className={FOOTER_LINK_CLASS}>
            Mentions légales
          </Link>
          <Link href="/confidentialite" className={FOOTER_LINK_CLASS}>
            Politique de confidentialité
          </Link>
        </nav>
      </div>
      <p className="border-t border-line px-4 py-4 text-center text-xs text-ink-soft">
        © {new Date().getFullYear()} {legal.raisonSociale} — {cvmBrand.nom} &{" "}
        {mlrBrand.nom}
      </p>
    </footer>
  );
}
