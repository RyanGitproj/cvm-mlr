import { QuestionnaireSection } from "@/components/forms/QuestionnaireSection";
import { Etapes } from "@/components/sections/Etapes";
import { Gallery } from "@/components/sections/Gallery";
import { Hero } from "@/components/sections/Hero";
import { NoteTarifaire } from "@/components/sections/NoteTarifaire";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { TempsForts } from "@/components/sections/TempsForts";
import { NOTE_TARIFAIRE_CVM } from "@/config/brands";
import {
  ETAPES_ACCOMPAGNEMENT,
  type CvmUniversContent,
} from "@/config/content/cvm";
import { formatEuros } from "@/lib/format";

/**
 * Gabarit des 4 pages de présentation CVM (brief §7.3) — le contenu vient
 * de config/content/cvm.ts, l'accent (ember/lagon) est surchargé par
 * data-accent sans dupliquer de composant. Le questionnaire du funnel est
 * intégré en bas de page : les CTA scrollent vers lui (pas de navigation).
 */
export function CvmUniversPage({ content }: { content: CvmUniversContent }) {
  return (
    <div data-accent={content.accent}>
      <Hero
        surtitre={content.surtitre}
        titre={content.titre}
        sousTitre={content.sousTitre}
        ctas={[{ href: "#questionnaire", label: content.ctaLabel }]}
        micro={content.micro}
        imageLabel={`Hero — ${content.surtitre}`}
        imageAlt={`${content.titre} — visuel d'ambiance`}
      />

      <section className="mx-auto w-full max-w-3xl px-4 pb-4 sm:px-6">
        {content.presentation.map((paragraphe) => (
          <p
            key={paragraphe}
            className="mt-4 text-base leading-relaxed sm:text-lg"
          >
            {paragraphe}
          </p>
        ))}
      </section>

      <TempsForts titre="Ce qui est inclus" items={content.inclus} />

      <TempsForts
        titre={content.specifique.titre}
        sousTitre={content.specifique.sousTitre}
        items={content.specifique.cartes}
      />
      {content.specifique.note && (
        <section className="mx-auto -mt-6 w-full max-w-6xl px-4 pb-6 sm:px-6">
          <p className="text-sm italic text-ink-soft">{content.specifique.note}</p>
        </section>
      )}

      <Etapes
        titre="Comment ça se passe"
        sousTitre="Vous partagez votre projet, on clarifie la meilleure configuration."
        etapes={ETAPES_ACCOMPAGNEMENT}
      />

      <Gallery titre="En images" items={content.galerie} />

      <section className="mx-auto w-full max-w-6xl px-4 pb-4 sm:px-6">
        <SectionHeading
          titre="Formules & tarifs"
          sousTitre="Tarifs indicatifs par personne — hors vol international & assurance."
        />
        <ul className="mt-6 flex flex-wrap justify-center gap-4">
          {content.formules.map((formule) => (
            <li
              key={formule.duree ?? "formule-unique"}
              className="w-full rounded-2xl border-2 border-line bg-card p-5 text-center sm:w-52"
            >
              {formule.duree && (
                <p className="text-sm font-semibold uppercase tracking-[0.15em] text-accent">
                  {formule.duree}
                </p>
              )}
              <p className="mt-1 font-heading text-2xl font-bold text-ink-strong">
                {formatEuros(formule.prixEuros)}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <NoteTarifaire texte={NOTE_TARIFAIRE_CVM} />

      {/* Fin de page = le questionnaire lui-même (une seule décision : répondre). */}
      <QuestionnaireSection funnelType={content.funnelType} />
    </div>
  );
}
