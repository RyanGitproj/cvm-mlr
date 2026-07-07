"use client";

import { useState } from "react";
import { saveSuite } from "@/actions/saveSuite";
import { Button, ButtonLink } from "@/components/ui/Button";
import { MailLink, PhoneLink } from "@/components/ui/ContactLinks";
import { FENETRES, type Fenetre } from "@/config/segmentation";
import { recapChips } from "@/lib/leads/recapChips";
import { fenetreFor } from "@/lib/segmentation/depart";
import type { Recommendation } from "@/lib/segmentation/types";
import {
  DEPART_FENETRES,
  type DepartFenetre,
} from "@/lib/validations/common";
import type { MlrSuite } from "@/lib/validations/mlr";
import type { FunnelConfig, SuiteCta } from "@/types/funnel";

type Props = {
  config: FunnelConfig;
  /** Valeurs du formulaire soumis — alimentent les chips de récapitulatif. */
  values: Record<string, unknown>;
  /** Recommendation retournée par submitLead (donnée, jamais une action). */
  recommendation: Recommendation | null;
  headingId: string;
};

function isFenetre(value: unknown): value is Fenetre {
  return typeof value === "string" && value in FENETRES;
}

/**
 * Résolution du cas d'écran final : la fenêtre vient de la recommendation
 * serveur ; à défaut (réponse inattendue), elle est re-dérivée de la Q3 par
 * la même fonction pure — jamais un écran vide.
 */
function resolveFenetre(
  recommendation: Recommendation | null,
  values: Record<string, unknown>,
): Fenetre {
  if (isFenetre(recommendation?.fenetre)) return recommendation.fenetre;
  const depart = values.departFenetre;
  if (
    typeof depart === "string" &&
    (DEPART_FENETRES as readonly string[]).includes(depart)
  ) {
    return fenetreFor(depart as DepartFenetre);
  }
  return "proche";
}

/** Coordonnées directes révélées après le choix de suite. */
function ContactDirect() {
  return (
    <p className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm">
      <PhoneLink className="font-semibold text-accent underline-offset-4 hover:underline" />
      <MailLink className="font-semibold text-accent underline-offset-4 hover:underline" />
    </p>
  );
}

const CONFIRMATIONS = {
  mlr: {
    rdv: "C'est noté ! Un expert malgache te recontacte très vite pour fixer le créneau. Tu peux aussi nous joindre directement :",
    brochure:
      "C'est noté ! Tu recevras ta brochure Liberty Roots très vite. Une question entre-temps ?",
  },
  cvm: {
    rdv: "C'est noté ! Un expert malgache vous recontacte très vite pour fixer le créneau. Vous pouvez aussi nous joindre directement :",
    brochure:
      "C'est noté ! Vous recevrez votre brochure très vite. Une question entre-temps ?",
  },
} as const;

/**
 * Écran final in-funnel (maquettes 7/8), affiché après l'enregistrement du
 * lead : cas conditionnel selon la fenêtre de départ, chips récap, CTA de
 * suite (enregistrée en base) puis contact direct. L'orientation affiche en
 * plus l'univers recommandé par la segmentation.
 */
export function FinalScreen({ config, values, recommendation, headingId }: Props) {
  const [suite, setSuite] = useState<MlrSuite | null>(null);

  function chooseSuite(cta: SuiteCta) {
    if (suite !== null) return;
    setSuite(cta.suite);
    // Best-effort : l'échec (cookie expiré, base indisponible) ne doit
    // jamais bloquer l'affichage du contact direct.
    void saveSuite(cta.suite);
  }

  const finalCase = config.final.cases[resolveFenetre(recommendation, values)];
  const chips = recapChips(config, values);
  const universLibelle =
    config.final.universRecommande === true &&
    typeof recommendation?.universLibelle === "string"
      ? recommendation.universLibelle
      : null;
  const universHref =
    typeof recommendation?.href === "string" ? recommendation.href : null;

  return (
    <div>
      {chips.length > 0 && (
        <ul className="mb-5 flex flex-wrap gap-2" aria-label="Votre parcours">
          {chips.map((chip) => (
            <li
              key={chip}
              className="rounded-full border-2 border-line bg-card px-3 py-1 text-xs font-semibold text-ink-strong"
            >
              {chip}
            </li>
          ))}
        </ul>
      )}
      <h2
        id={headingId}
        tabIndex={-1}
        className="font-heading text-2xl font-semibold text-ink-strong outline-none sm:text-3xl"
      >
        {finalCase.titre}
      </h2>
      <p className="mt-2 text-sm text-ink-soft">{finalCase.texte}</p>

      {universLibelle && (
        <div className="mt-5 rounded-xl border-2 border-accent-soft bg-surface-2 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-accent">
            L’expérience faite pour vous
          </p>
          <p className="mt-1 font-heading text-lg font-semibold text-ink-strong">
            {universLibelle}
          </p>
          {typeof recommendation?.raison === "string" && (
            <p className="mt-1 text-sm text-ink-soft">{recommendation.raison}</p>
          )}
          {universHref && (
            <ButtonLink href={universHref} variant="outline" className="mt-4">
              Découvrir cet univers
            </ButtonLink>
          )}
        </div>
      )}

      {finalCase.piliers && (
        <ul className="mt-5 grid gap-2 sm:grid-cols-3">
          {finalCase.piliers.map((pilier) => (
            <li
              key={pilier}
              className="rounded-xl border-2 border-line bg-card px-4 py-3 text-center text-sm font-medium text-ink-strong"
            >
              {pilier}
            </li>
          ))}
        </ul>
      )}
      {finalCase.reassurance && (
        <p className="mt-4 text-sm text-ink-soft">{finalCase.reassurance}</p>
      )}

      {suite === null ? (
        <div className="mt-6 flex flex-col gap-3">
          <Button type="button" onClick={() => chooseSuite(finalCase.primary)}>
            {finalCase.primary.label}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => chooseSuite(finalCase.secondary)}
          >
            {finalCase.secondary.label}
          </Button>
        </div>
      ) : (
        <div className="mt-6 rounded-xl border-2 border-accent-soft bg-surface-2 p-4">
          <p className="text-sm font-medium text-ink-strong">
            {CONFIRMATIONS[config.brand][suite]}
          </p>
          <ContactDirect />
        </div>
      )}
    </div>
  );
}
