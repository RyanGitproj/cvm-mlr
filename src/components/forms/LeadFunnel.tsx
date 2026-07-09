"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState } from "react";
import { FormProvider, useForm, type FieldValues } from "react-hook-form";
import type { z } from "zod";
import { submitLead } from "@/actions/submitLead";
import { TrackedLink } from "@/components/tracking/TrackedLink";
import { Button, buttonClasses } from "@/components/ui/Button";
import { MediaBackdrop } from "@/components/ui/MediaBackdrop";
import { getFunnelConfig } from "@/config/funnels";
import { resolveOffer } from "@/config/offers";
import { nbVoyageursFrom } from "@/lib/leads/toLeadRow";
import { scrollToElement } from "@/lib/scroll";
import type { Recommendation } from "@/lib/segmentation/types";
import { pushDataLayerEventOnce } from "@/lib/tracking/gtm";
import { readUtm } from "@/lib/utm";
import { getFormSchema } from "@/lib/validations";
import { MESSAGE_EFFECTIF_GROUPE } from "@/lib/validations/common";
import type { WizardStep } from "@/types/funnel";
import type { FunnelType } from "@/types/lead";
import { ContactFields } from "./ContactFields";
import { ContactFieldsMlr } from "./ContactFieldsMlr";
import { FinalScreen } from "./FinalScreen";
import { OfferCards } from "./OfferCards";
import { RadioCards } from "./RadioCards";
import { StepIndicator } from "./StepIndicator";

type Props = {
  funnelType: FunnelType;
  /** Pré-remplissage (ex. route MLR depuis /mlr/nord) — l'écran est sauté. */
  defaultValues?: Record<string, string>;
  /** h1 sur page dédiée (défaut), h2 quand le wizard est intégré sous un Hero. */
  headingLevel?: "h1" | "h2";
};

/**
 * Fenêtre d'ignorance des clics après un changement d'écran : l'auto-avance
 * place les options au même endroit d'un écran à l'autre — le second clic
 * d'un double-clic ne doit ni sauter un écran ni déclencher l'envoi.
 */
const SUBMIT_GUARD_MS = 500;

type Screen =
  | { kind: "step"; step: WizardStep }
  | { kind: "contact" }
  | { kind: "final" };

/**
 * Moteur wizard unique des 6 funnels — gabarit maquette boss 2026-07-07 :
 * Q1 projection → Q2 offre à prix → Q3 période → Q4 voyageurs, un écran par
 * décision avec avance au clic et barre « Étape X/N », puis écran
 * coordonnées (submit unique — l'enregistrement n'a lieu qu'à la fin), puis
 * écran final conditionnel rendu depuis la recommendation retournée par
 * l'action. Un seul useForm/FormProvider pour tout le parcours.
 */
export function LeadFunnel({
  funnelType,
  defaultValues,
  headingLevel: Heading = "h1",
}: Props) {
  const config = getFunnelConfig(funnelType);
  const topRef = useRef<HTMLDivElement>(null);

  const form = useForm<FieldValues>({
    // Schéma résolu à l'exécution parmi les 6 funnels : on élargit au format
    // générique de react-hook-form. La validation reste portée par Zod.
    resolver: zodResolver(
      getFormSchema(funnelType) as unknown as z.ZodType<FieldValues, FieldValues>,
    ),
    mode: "onSubmit",
    defaultValues,
  });

  // Les écrans radio pré-remplis par la page (route MLR) sont sautés — la
  // barre d'étapes compte les écrans réellement affichés (X/3 sur /mlr/nord).
  const visibleSteps = config.steps.filter(
    (step) => !(step.kind === "radio" && defaultValues?.[step.name]),
  );
  const screens: Screen[] = [
    ...visibleSteps.map((step) => ({ kind: "step" as const, step })),
    { kind: "contact" as const },
    { kind: "final" as const },
  ];

  const [screenIndex, setScreenIndex] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);

  const currentScreen = screens[screenIndex];
  const headingId =
    currentScreen.kind === "step"
      ? `question-${currentScreen.step.id}`
      : currentScreen.kind === "contact"
        ? `question-${config.contact.id}`
        : "question-final";

  // Entrée réelle dans le funnel : première interaction avec le formulaire
  // (onChange bubbles depuis les champs ; dédup session dans pushDataLayerEventOnce).
  function handleFormChange() {
    pushDataLayerEventOnce(`funnel_start_${funnelType}`, "funnel_start", {
      funnel_type: funnelType,
    });
  }

  // Scroll + focus au changement d'écran (mémoire next16-effects-reconnexion-spa :
  // on compare la dernière valeur traitée, jamais un garde « premier rendu »).
  const currentKey = `screen:${screenIndex}`;
  const lastHandledKey = useRef("screen:0");
  useEffect(() => {
    if (lastHandledKey.current === currentKey) return;
    lastHandledKey.current = currentKey;
    if (topRef.current) scrollToElement(topRef.current);
    document.getElementById(headingId)?.focus({ preventScroll: true });
  }, [currentKey, headingId]);

  // Garde anti double-clic : re-entrance (inFlight) + fenêtre post-navigation.
  const inFlight = useRef(false);
  const lastNavAt = useRef(0);
  const withinGuard = () => Date.now() - lastNavAt.current < SUBMIT_GUARD_MS;

  function fieldsOfScreen(screen: Screen): string[] {
    if (screen.kind !== "step") return [];
    const step = screen.step;
    switch (step.kind) {
      case "radio":
        return [step.name, `${step.name}Precision`];
      case "offer":
        return ["offreDuree"];
    }
  }

  function handleFormKeyDown(event: React.KeyboardEvent<HTMLFormElement>) {
    if (event.key !== "Enter") return;
    if (event.target instanceof HTMLElement && event.target.tagName === "INPUT") {
      event.preventDefault();
    }
  }

  /**
   * Garde locale de l'écran : « Plus de 4 » exige l'effectif approximatif.
   * La même règle vit dans le schéma complet (exigeEffectifGroupe) pour le
   * submit final et le serveur — mais un refinement d'objet ne tourne que
   * si le parse de base réussit, ce qui n'est jamais le cas en cours de
   * parcours (les champs contact sont encore vides).
   */
  function precisionNumberFilled(screen: Screen): boolean {
    if (screen.kind !== "step" || screen.step.kind !== "radio") return true;
    const step = screen.step;
    const selected: unknown = form.getValues(step.name);
    const option = step.options.find((o) => o.value === selected);
    if (!option?.precisionInput) return true;
    const raw: unknown = form.getValues(`${step.name}Precision`);
    if (raw !== undefined && raw !== null && String(raw).trim() !== "") {
      return true;
    }
    form.setError(`${step.name}Precision`, {
      type: "custom",
      message: MESSAGE_EFFECTIF_GROUPE,
    });
    form.setFocus(`${step.name}Precision`);
    return false;
  }

  /** Avance d'un écran de décision — bouton « Continuer » ou auto-avance. */
  async function advanceFrom(screen: Screen) {
    if (inFlight.current || withinGuard()) return;
    inFlight.current = true;
    try {
      const valid = await form.trigger(fieldsOfScreen(screen), {
        shouldFocus: true,
      });
      if (!valid) return;
      if (!precisionNumberFilled(screen)) return;
      // Écran de décision validé — granularité d'abandon par étape côté GA4
      // (dédup session : un aller-retour ne regonfle pas les volumes).
      if (screen.kind === "step") {
        pushDataLayerEventOnce(
          `funnel_step_${funnelType}_${screen.step.id}`,
          "funnel_step",
          {
            funnel_type: funnelType,
            step_id: screen.step.id,
            step_index: screenIndex + 1,
            step_total: visibleSteps.length,
          },
        );
      }
      lastNavAt.current = Date.now();
      setScreenIndex((index) => index + 1);
    } finally {
      inFlight.current = false;
    }
  }

  /** Submit unique du parcours, depuis l'écran coordonnées. */
  async function submit() {
    if (inFlight.current || withinGuard()) return;
    inFlight.current = true;
    try {
      const valid = await form.trigger(undefined, { shouldFocus: true });
      if (!valid) return;
      setServerError(null);
      setSubmitting(true);
      const result = await submitLead(funnelType, form.getValues(), readUtm());
      setSubmitting(false);
      if (!result.ok) {
        setServerError(result.message);
        return;
      }
      // Conversion enrichie : l'offre choisie (« formules les plus choisies »
      // côté GA4), la fenêtre de départ, l'effectif réel et la route MLR.
      const values = form.getValues();
      const offre = resolveOffer(
        funnelType,
        typeof values.offreDuree === "string" ? values.offreDuree : undefined,
      );
      const nbVoyageurs = nbVoyageursFrom(values);
      pushDataLayerEventOnce(`lead_submitted_${funnelType}`, "lead_submitted", {
        funnel_type: funnelType,
        brand: config.brand,
        ...(offre !== null && {
          offre_ref: offre.ref,
          offre_label: offre.label,
          offre_prix: offre.prixIndicatif,
        }),
        ...(typeof values.departFenetre === "string" && {
          depart_fenetre: values.departFenetre,
        }),
        ...(nbVoyageurs !== null && { nb_voyageurs: nbVoyageurs }),
        ...(typeof values.route === "string" && { route: values.route }),
      });
      setRecommendation(result.recommendation);
      lastNavAt.current = Date.now();
      setScreenIndex((index) => index + 1);
    } finally {
      inFlight.current = false;
    }
  }

  function goBack() {
    lastNavAt.current = Date.now();
    setScreenIndex((index) => Math.max(index - 1, 0));
  }

  // Écran à validation explicite : option « Autre » sélectionnée
  // (précision à saisir avant de continuer).
  const explicitCta = (() => {
    if (currentScreen.kind !== "step") return null;
    const step = currentScreen.step;
    if (step.kind !== "radio") return null;
    const selected: unknown = form.watch(step.name);
    const freeTextSelected = step.options.some(
      (option) => option.freeText === true && option.value === selected,
    );
    return freeTextSelected ? "Continuer →" : null;
  })();

  return (
    <div ref={topRef} className="scroll-mt-24">
      <FormProvider {...form}>
        <form
          onSubmit={(event) => event.preventDefault()}
          onChange={handleFormChange}
          onKeyDown={handleFormKeyDown}
          noValidate
        >
          {currentScreen.kind === "step" && (
            <>
              {screenIndex === 0 && (
                // Intro visible sur le seul écran d'entrée : dès la première
                // réponse, l'écran de décision se suffit (compacité 07-07).
                // Badge + consigne de clic : sans eux, les cartes riches se
                // lisent comme des images et non comme un formulaire à
                // remplir (demande Ryan 2026-07-09).
                <header className="mb-4">
                  <p className="mb-2.5 inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-xs font-bold uppercase tracking-wide text-accent-contrast">
                    <svg
                      aria-hidden
                      width="13"
                      height="13"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 20h9" />
                      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
                    </svg>
                    Questionnaire
                  </p>
                  <Heading className="font-heading text-2xl font-bold leading-tight text-ink-strong">
                    {config.intro.titre}
                  </Heading>
                  <p className="mt-1.5 text-sm text-ink-soft">
                    {config.intro.sousTitre}
                  </p>
                  <p className="mt-2 text-sm font-semibold text-accent">
                    {config.brand === "mlr"
                      ? "Réponds en cliquant sur les cartes ci-dessous."
                      : "Répondez en cliquant sur les cartes ci-dessous."}
                  </p>
                </header>
              )}
              <StepIndicator
                current={screenIndex + 1}
                total={visibleSteps.length}
                label={config.label}
              />
              <section
                key={currentKey}
                className="animate-step mt-3"
                aria-labelledby={headingId}
              >
                <h2
                  id={headingId}
                  tabIndex={-1}
                  className="font-heading text-xl font-semibold text-ink-strong outline-none sm:text-2xl"
                >
                  {currentScreen.step.question}
                </h2>
                {currentScreen.step.hint && (
                  <p className="mt-1.5 text-sm text-ink-soft">
                    {currentScreen.step.hint}
                  </p>
                )}
                <div className="mt-3">
                  {currentScreen.step.kind === "radio" && (
                    <RadioCards
                      name={currentScreen.step.name}
                      options={currentScreen.step.options}
                      labelledBy={headingId}
                      onSelect={(option) => {
                        // La valeur est posée explicitement avant la
                        // validation : l'ordre onChange/onClick de React
                        // sur un radio n'est pas garanti.
                        if (currentScreen.step.kind === "radio") {
                          form.setValue(currentScreen.step.name, option.value);
                        }
                        void advanceFrom(currentScreen);
                      }}
                    />
                  )}
                  {currentScreen.step.kind === "offer" && (
                    <>
                      <OfferCards
                        funnelType={funnelType}
                        labelledBy={headingId}
                        onSelect={(value) => {
                          form.setValue("offreDuree", value);
                          void advanceFrom(currentScreen);
                        }}
                      />
                      {currentScreen.step.reorientation && (
                        <div className="mt-3 grid grid-cols-[minmax(0,4fr)_minmax(0,5fr)] overflow-hidden rounded-3xl border-2 border-line bg-surface-2">
                          {currentScreen.step.reorientation.image && (
                            <span className="p-2.5 pr-0">
                              <span className="relative block h-full min-h-24 overflow-hidden rounded-2xl">
                                <MediaBackdrop
                                  image={currentScreen.step.reorientation.image}
                                  sizes="(min-width: 640px) 260px, 45vw"
                                  // Cadrage sur la droite : le 4x4 chargé (sujet)
                                  // occupe le tiers droit du paysage desktop ;
                                  // sur mobile le visuel portrait dédié gère son
                                  // propre cadrage (position horizontale ignorée).
                                  objectPosition="right center"
                                />
                              </span>
                            </span>
                          )}
                          <div className="flex flex-col items-start gap-1 p-3">
                            <p className="text-sm font-medium text-ink-strong">
                              {currentScreen.step.reorientation.label}
                            </p>
                            {currentScreen.step.reorientation.hint && (
                              <p className="text-sm text-ink-soft">
                                {currentScreen.step.reorientation.hint}
                              </p>
                            )}
                            <TrackedLink
                              href={currentScreen.step.reorientation.href}
                              event="cta_click"
                              eventParams={{
                                cta_id: "mlr_reorientation_cvm",
                                cta_label: currentScreen.step.reorientation.cta,
                              }}
                              className={buttonClasses("outline", "mt-1")}
                            >
                              {currentScreen.step.reorientation.cta} →
                            </TrackedLink>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
                {currentScreen.step.message && (
                  <div className="mt-3 space-y-1.5 rounded-lg bg-surface-2 px-3 py-2 text-sm text-ink-soft">
                    {(Array.isArray(currentScreen.step.message)
                      ? currentScreen.step.message
                      : [currentScreen.step.message]
                    ).map((paragraphe) => (
                      <p key={paragraphe}>{paragraphe}</p>
                    ))}
                  </div>
                )}
              </section>
            </>
          )}

          {currentScreen.kind === "contact" && (
            <section
              key={currentKey}
              className="animate-step"
              aria-labelledby={headingId}
            >
              <h2
                id={headingId}
                tabIndex={-1}
                className="font-heading text-2xl font-semibold text-ink-strong outline-none sm:text-3xl"
              >
                {config.contact.question}
              </h2>
              {config.contact.hint && (
                <p className="mt-2 text-sm text-ink-soft">{config.contact.hint}</p>
              )}
              <div className="mt-5">
                {config.contact.variant === "mlr" ? (
                  <ContactFieldsMlr />
                ) : (
                  <ContactFields />
                )}
              </div>
              {config.contact.message && (
                <p className="mt-4 rounded-lg bg-surface-2 px-4 py-3 text-sm text-ink-soft">
                  {config.contact.message}
                </p>
              )}
            </section>
          )}

          {currentScreen.kind === "final" && (
            <section
              key={currentKey}
              className="animate-step"
              aria-labelledby={headingId}
            >
              <FinalScreen
                config={config}
                values={form.getValues()}
                recommendation={recommendation}
                headingId={headingId}
              />
            </section>
          )}

          {serverError && (
            <p
              role="alert"
              className="mt-4 rounded-lg border-2 border-danger bg-card px-4 py-3 text-sm font-medium text-danger"
            >
              {serverError}
            </p>
          )}

          {currentScreen.kind !== "final" && (
            <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
              {screenIndex > 0 ? (
                <Button type="button" variant="ghost" onClick={goBack}>
                  ← Retour
                </Button>
              ) : (
                <span aria-hidden />
              )}
              {currentScreen.kind === "contact" ? (
                <Button type="button" disabled={submitting} onClick={submit}>
                  {submitting ? "Envoi en cours…" : config.contact.cta}
                </Button>
              ) : explicitCta !== null ? (
                <Button type="button" onClick={() => void advanceFrom(currentScreen)}>
                  {explicitCta}
                </Button>
              ) : null}
            </div>
          )}

          {/* Note tarifaire (« hors vol & assurance ») — sous le CTA d'envoi,
              en clôture de l'écran coordonnées. */}
          {currentScreen.kind === "contact" && config.intro.note && (
            <p className="mt-6 rounded-lg border-2 border-accent-soft bg-surface-2 px-4 py-3 text-sm text-ink-soft">
              {config.intro.note}
            </p>
          )}
        </form>
      </FormProvider>
    </div>
  );
}
