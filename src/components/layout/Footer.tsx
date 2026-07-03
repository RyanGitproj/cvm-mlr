import Link from "next/link";
import { MailLink, PhoneLink } from "@/components/ui/ContactLinks";
import { cvmBrand, mlrBrand } from "@/config/brands";
import { legal } from "@/config/legal";
import type { Brand } from "@/types/lead";

const FOOTER_LINK_CLASS =
  "text-sm text-ink-soft transition-colors hover:text-ink-strong";

export function Footer({ brand }: { brand: Brand | "mere" }) {
  return (
    <footer className="mt-auto border-t border-line bg-surface-2">
      {brand === "mlr" && (
        <p className="torn-edge bg-accent px-4 py-3 text-center text-xs font-semibold uppercase tracking-widest text-accent-contrast">
          {mlrBrand.signature}
        </p>
      )}
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-3 sm:px-6">
        <div>
          <p className="font-heading text-lg font-bold text-ink-strong">Madagascar</p>
          <p className="mt-2 max-w-prose text-sm text-ink-soft">
            Deux marques, une même équipe locale : le voyage organisé et serein
            avec {cvmBrand.nom}, la liberté roots avec {mlrBrand.nom}.
          </p>
        </div>
        <nav aria-label="Parcours" className="grid content-start gap-2">
          <p className="text-sm font-semibold text-ink-strong">Parcours</p>
          <Link href="/" className={FOOTER_LINK_CLASS}>
            Choisir mon univers
          </Link>
          <Link href="/cvm" className={FOOTER_LINK_CLASS}>
            {cvmBrand.nom}
          </Link>
          <Link href="/mlr" className={FOOTER_LINK_CLASS}>
            {mlrBrand.nom}
          </Link>
          <Link href="/faq" className={FOOTER_LINK_CLASS}>
            Questions fréquentes
          </Link>
        </nav>
        <nav aria-label="Informations" className="grid content-start gap-2">
          <p className="text-sm font-semibold text-ink-strong">Informations</p>
          <PhoneLink className={FOOTER_LINK_CLASS} />
          <MailLink className={FOOTER_LINK_CLASS} />
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
