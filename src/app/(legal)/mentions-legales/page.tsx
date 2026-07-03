import type { Metadata } from "next";
import { MailLink } from "@/components/ui/ContactLinks";
import { cvmBrand, mlrBrand } from "@/config/brands";
import { legal } from "@/config/legal";

export const metadata: Metadata = {
  title: "Mentions légales",
  description: "Mentions légales du site — société éditrice, directeur de publication, hébergeur.",
};

const DT_CLASS = "text-sm font-semibold text-ink-strong";
const DD_CLASS = "mt-1 text-sm text-ink-soft";

export default function MentionsLegalesPage() {
  return (
    <article>
      <h1 className="font-heading text-4xl font-bold text-ink-strong">
        Mentions légales
      </h1>

      <section className="mt-8">
        <h2 className="font-heading text-2xl font-bold text-ink-strong">
          Éditeur du site
        </h2>
        <dl className="mt-4 grid gap-4">
          <div>
            <dt className={DT_CLASS}>Raison sociale</dt>
            <dd className={DD_CLASS}>
              {legal.raisonSociale} — {legal.forme} au capital de {legal.capital}
            </dd>
          </div>
          <div>
            <dt className={DT_CLASS}>Siège social</dt>
            <dd className={DD_CLASS}>{legal.siege}</dd>
          </div>
          <div>
            <dt className={DT_CLASS}>Immatriculation</dt>
            <dd className={DD_CLASS}>
              SIREN {legal.siren} · SIRET {legal.siret} · {legal.rcs} · TVA
              intracommunautaire {legal.tva}
            </dd>
          </div>
          <div>
            <dt className={DT_CLASS}>Directeur de la publication</dt>
            <dd className={DD_CLASS}>{legal.directeurPublication}</dd>
          </div>
          <div>
            <dt className={DT_CLASS}>Contact</dt>
            <dd className={DD_CLASS}>
              <MailLink className="underline" />
            </dd>
          </div>
        </dl>
        <p className="mt-4 text-sm text-ink-soft">
          {cvmBrand.nom} et {mlrBrand.nom} sont deux marques éditées par la même
          société : {legal.raisonSociale}.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="font-heading text-2xl font-bold text-ink-strong">
          Hébergeur
        </h2>
        <p className="mt-4 text-sm text-ink-soft">
          Le site est hébergé par {legal.hebergeur.nom}.
          <br />
          Adresse : {legal.hebergeur.adresse}
        </p>
      </section>

      <section className="mt-10">
        <h2 className="font-heading text-2xl font-bold text-ink-strong">
          Propriété intellectuelle
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-ink-soft">
          L’ensemble des contenus de ce site (textes, visuels, marques, logos)
          est la propriété de {legal.raisonSociale} ou de ses partenaires. Toute
          reproduction sans autorisation préalable est interdite.
        </p>
      </section>
    </article>
  );
}
