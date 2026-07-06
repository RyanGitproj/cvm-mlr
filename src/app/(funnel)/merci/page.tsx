import type { Metadata } from "next";
import { FunnelShell } from "@/components/layout/FunnelShell";
import { ButtonLink } from "@/components/ui/Button";
import { cvmBrand, mlrBrand, NOTE_TARIFAIRE_CVM, NOTE_TARIFAIRE_MLR } from "@/config/brands";
import { getFunnelConfig } from "@/config/funnels";
import { readMerciCookie } from "@/lib/merci-cookie";

export const metadata: Metadata = {
  title: "Merci — demande bien reçue",
  robots: { index: false, follow: false },
};

/**
 * Page merci (brief §11.4) : lit le cookie court posé par submitLead.
 * Accès direct sans cookie → message générique, jamais d'erreur.
 * Aucune action aval déclenchée ici (pas d'email : hors scope).
 */
export default async function MerciPage() {
  const merci = await readMerciCookie();

  if (merci === null) {
    return (
      <FunnelShell theme="mere" backHref="/" backLabel="Accueil">
        <div className="py-12 text-center">
          <h1 className="font-heading text-3xl font-bold text-ink-strong">
            Cette page confirme l’envoi d’une demande
          </h1>
          <p className="mx-auto mt-3 max-w-prose text-ink-soft">
            Commencez par choisir votre univers de voyage — le questionnaire ne
            prend que quelques minutes.
          </p>
          <ButtonLink href="/" className="mt-6">
            Choisir mon univers
          </ButtonLink>
        </div>
      </FunnelShell>
    );
  }

  const config = getFunnelConfig(merci.funnelType);
  const isMlr = config.brand === "mlr";

  return (
    <FunnelShell
      theme={isMlr ? "mlr" : "cvm"}
      backHref={isMlr ? "/mlr" : "/cvm"}
      backLabel={isMlr ? mlrBrand.nom : cvmBrand.nom}
    >
      <div className="animate-fade-rise py-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
          Demande bien reçue
        </p>
        <h1 className="mt-3 font-heading text-3xl font-bold leading-tight text-ink-strong sm:text-4xl">
          Merci {merci.prenom ?? merci.nom}, votre demande {config.label} est bien
          reçue.
        </h1>
        <p className="mt-4 text-ink-soft">
          Un conseiller étudie vos réponses et vous recontacte rapidement avec
          une proposition construite sur votre projet.
        </p>

        {merci.recommandation && (
          <div className="mt-6 rounded-2xl border-2 border-accent-soft bg-surface-2 p-5">
            <p className="text-sm font-semibold text-ink-strong">Votre profil</p>
            <p className="mt-1">{merci.recommandation}</p>
            {merci.recommandationHref && (
              <ButtonLink
                href={merci.recommandationHref}
                variant="outline"
                className="mt-4"
              >
                Découvrir cet univers
              </ButtonLink>
            )}
          </div>
        )}

        <p className="mt-6 rounded-lg bg-surface-2 px-4 py-3 text-sm text-ink-soft">
          {isMlr ? NOTE_TARIFAIRE_MLR : NOTE_TARIFAIRE_CVM}
        </p>

        <ButtonLink href="/" variant="ghost" className="mt-8">
          ← Retour à l’accueil
        </ButtonLink>
      </div>
    </FunnelShell>
  );
}
