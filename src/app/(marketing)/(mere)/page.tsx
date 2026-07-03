import type { Metadata } from "next";
import { Hero } from "@/components/sections/Hero";
import { NoteTarifaire } from "@/components/sections/NoteTarifaire";
import { ReassuranceBar } from "@/components/sections/ReassuranceBar";
import { UniversPicker } from "@/components/sections/UniversPicker";
import { MailLink } from "@/components/ui/ContactLinks";
import { REASSURANCE_COMMUNE } from "@/config/brands";

export const metadata: Metadata = {
  title: "Madagascar, deux façons de vivre le voyage — CVM & Liberty Roots",
  description:
    "D'un côté l'organisation complète et le confort avec Célébration Voyage Madagascar ; de l'autre la liberté brute du road trip avec Madagascar Liberty Roots. Choisissez votre univers.",
};

/**
 * Page mère d'orientation (brief §6) : sas d'entrée unique, thème hybride
 * (socle CVM + éclat MLR sur sa carte). Aucune logique métier : elle route.
 */
export default function PageMere() {
  return (
    <div className="mere-scope">
      <Hero
        surtitre="Deux marques, une île"
        titre="Quel Madagascar voulez-vous vivre ?"
        sousTitre="Choisissez le style de voyage qui vous ressemble : confort et organisation ou aventure roots et rencontres locales."
        ctas={[{ href: "#univers", label: "Choisir mon univers" }]}
        imageLabel="Hero — collage des deux mondes"
        imageAlt="Collage évoquant les deux univers : lodge confortable et piste de road trip"
      />

      <UniversPicker />

      <ReassuranceBar items={REASSURANCE_COMMUNE} />

      <section className="bg-ink-strong">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-6 px-4 py-8 sm:px-6">
          <div>
            <p className="font-heading text-2xl font-bold uppercase tracking-wide text-surface">
              Voyager libre, mais accompagné
            </p>
            <p className="mt-2 max-w-prose text-sm text-surface-2">
              Nos équipes locales sont là pour vous écouter, vous conseiller et
              vous soutenir à chaque étape.
            </p>
          </div>
          <span
            aria-hidden
            className="flex h-24 w-24 shrink-0 -rotate-6 items-center justify-center rounded-full border-2 border-accent-soft p-2 text-center text-[10px] font-bold uppercase leading-tight tracking-widest text-accent-soft"
          >
            L’aventure en confiance
          </span>
        </div>
      </section>

      <div className="pt-12">
        <NoteTarifaire texte="Le billet d'avion international et l'assurance voyage ne sont pas inclus dans les tarifs affichés — quel que soit l'univers choisi." />
      </div>

      <section className="mx-auto w-full max-w-6xl px-4 pb-12 text-center text-sm text-ink-soft sm:px-6">
        <MailLink className="font-medium underline hover:text-ink-strong">
          Parler à un conseiller
        </MailLink>
      </section>
    </div>
  );
}
