"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { FormProvider, useForm, type FieldValues } from "react-hook-form";
import type { z } from "zod";
import { saveStep2Progress } from "@/actions/saveStep2Progress";
import { submitStep1 } from "@/actions/submitStep1";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { getFunnelConfig } from "@/config/funnels";
import { singleOfferFor } from "@/config/offers";
import { formatEuros } from "@/lib/format";
import { scrollToElement } from "@/lib/scroll";
import { pushDataLayerEvent, pushDataLayerEventOnce } from "@/lib/tracking/gtm";
import { readUtm } from "@/lib/utm";
import { getFormSchema } from "@/lib/validations";
import type {
  ConditionsStep,
  MultiStep,
  RadioStep,
  RecapStep,
} from "@/types/funnel";
import type { FunnelType } from "@/types/lead";
import { CheckboxCards } from "./CheckboxCards";
import { ConditionsFields } from "./ConditionsFields";
import { ContactFields } from "./ContactFields";
import { OfferCards } from "./OfferCards";
import { RadioCards } from "./RadioCards";
import { RecapList } from "./RecapList";
import { StepIndicator } from "./StepIndicator";

type Props = {
  funnelType: FunnelType;
  /** Pré-remplissage (ex. route MLR depuis /mlr/sud). */
  defaultValues?: Record<string, string>;
};

/**
 * Fenêtre d'ignorance des soumissions après un changement d'écran (étape 2) :
 * le bouton final remplace « Continuer » au même emplacement — le second clic
 * d'un double-clic ne doit pas déclencher l'envoi.
 */
const SUBMIT_GUARD_MS = 500;
const STEP2_CTA = "Envoyer mes réponses";

const CONTACT_FIELDS = [
  "nom",
  "prenom",
  "telephone",
  "email",
  "nbVoyageurs",
  "periode",
  "commentaire",
  "consentement",
];

type Step2Screen =
  | { kind: "question"; step: RadioStep | MultiStep }
  | { kind: "conditions"; step: ConditionsStep }
  | { kind: "recap"; step: RecapStep };

/**
 * Parcours de lead en 2 étapes (brief refonte) : étape 1 = ÉCRAN UNIQUE
 * (coordonnées + choix d'offre inline + route MLR inline) → enregistrement
 * Table 1 ; popup Oui/Non ; étape 2 = qualification multi-écrans avec
 * sauvegarde progressive. Un seul useForm/FormProvider.
 */
export function LeadFunnel({ funnelType, defaultValues }: Props) {
  const config = getFunnelConfig(funnelType);
  const router = useRouter();
  const topRef = useRef<HTMLDivElement>(null);
  const singleOffer = singleOfferFor(funnelType);

  const form = useForm<FieldValues>({
    // Schéma résolu à l'exécution parmi les 6 funnels : on élargit au format
    // générique de react-hook-form. La validation reste portée par Zod.
    resolver: zodResolver(
      getFormSchema(funnelType) as unknown as z.ZodType<FieldValues, FieldValues>,
    ),
    mode: "onSubmit",
    defaultValues,
  });

  // Étape 1 : la route MLR s'affiche inline sauf si la page l'a pré-remplie.
  const inlineRouteSteps = (config.preContact ?? []).filter(
    (step) => !defaultValues?.[step.name],
  );
  const step1Fields = [
    ...(config.offer ? ["offreDuree"] : []),
    ...(config.preContact ?? []).map((step) => step.name),
    ...CONTACT_FIELDS,
  ];

  // Écrans de l'étape 2 : questions → conditions (Explorer) → récap (MLR).
  const step2Screens: Step2Screen[] = config.qualification.map((step) => ({
    kind: "question" as const,
    step,
  }));
  if (config.conditions) {
    step2Screens.push({ kind: "conditions", step: config.conditions });
  }
  if (config.recap) step2Screens.push({ kind: "recap", step: config.recap });

  const [phase, setPhase] = useState<"step1" | "step2">("step1");
  const [screenIndex, setScreenIndex] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const currentScreen = phase === "step2" ? step2Screens[screenIndex] : undefined;
  const isLast = screenIndex === step2Screens.length - 1;
  const headingId =
    phase === "step1" || currentScreen === undefined
      ? `question-${config.contact.id}`
      : `question-${currentScreen.step.id}`;

  // Entrée réelle dans le funnel : première saisie dans le formulaire
  // (onChange bubbles depuis les champs ; dédup session dans pushDataLayerEventOnce).
  function handleFormChange() {
    pushDataLayerEventOnce(`funnel_start_${funnelType}`, "funnel_start", {
      funnel_type: funnelType,
    });
  }

  // Scroll + focus au changement d'écran (mémoire next16-effects-reconnexion-spa :
  // on compare la dernière valeur traitée, jamais un garde « premier rendu »).
  const currentKey = phase === "step1" ? "step1" : `step2:${screenIndex}`;
  const lastHandledKey = useRef("step1");
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

  function fieldsOfStep2(screen: Step2Screen): string[] {
    switch (screen.kind) {
      case "question":
        return [screen.step.name, `${screen.step.name}Precision`];
      case "conditions": {
        const fields = screen.step.includeAge ? ["age"] : [];
        return [...fields, ...screen.step.acceptances.map((a) => a.name)];
      }
      case "recap":
        return [];
    }
  }

  function handleFormKeyDown(event: React.KeyboardEvent<HTMLFormElement>) {
    if (event.key !== "Enter") return;
    if (event.target instanceof HTMLElement && event.target.tagName === "INPUT") {
      event.preventDefault();
    }
  }

  async function step1Submit() {
    if (inFlight.current) return;
    inFlight.current = true;
    try {
      const valid = await form.trigger(step1Fields, { shouldFocus: true });
      if (!valid) return;
      setServerError(null);
      setSubmitting(true);
      const result = await submitStep1(funnelType, form.getValues(), readUtm());
      setSubmitting(false);
      if (!result.ok) {
        setServerError(result.message);
        return;
      }
      pushDataLayerEventOnce(`lead_submitted_${funnelType}`, "lead_submitted", {
        funnel_type: funnelType,
        brand: config.brand,
      });
      setModalOpen(true);
    } finally {
      inFlight.current = false;
    }
  }

  function acceptStep2() {
    setModalOpen(false);
    setServerError(null);
    pushDataLayerEvent("step2_started", {
      funnel_type: funnelType,
      brand: config.brand,
    });
    setPhase("step2");
    setScreenIndex(0);
  }

  function declineStep2() {
    setModalOpen(false);
    router.push("/merci");
  }

  async function step2Next() {
    if (inFlight.current) return;
    inFlight.current = true;
    try {
      const screen = step2Screens[screenIndex];
      const valid = await form.trigger(fieldsOfStep2(screen), {
        shouldFocus: true,
      });
      if (!valid) return;
      lastNavAt.current = Date.now();
      // Sauvegarde progressive best-effort — ne bloque pas la navigation.
      void saveStep2Progress(form.getValues());
      setScreenIndex((index) => index + 1);
    } finally {
      inFlight.current = false;
    }
  }

  async function step2Finish() {
    if (withinGuard() || inFlight.current) return;
    inFlight.current = true;
    try {
      const allFields = step2Screens.flatMap(fieldsOfStep2);
      const valid = await form.trigger(allFields, { shouldFocus: true });
      if (!valid) return;
      setServerError(null);
      setSubmitting(true);
      const result = await saveStep2Progress(form.getValues(), { final: true });
      setSubmitting(false);
      if (!result.ok) {
        setServerError(
          "Certaines réponses sont invalides ou l'enregistrement est momentanément indisponible. Merci de vérifier et réessayer.",
        );
        return;
      }
      pushDataLayerEvent("step2_completed", {
        funnel_type: funnelType,
        brand: config.brand,
      });
      router.push("/merci");
    } finally {
      inFlight.current = false;
    }
  }

  function goBack() {
    lastNavAt.current = Date.now();
    setScreenIndex((index) => Math.max(index - 1, 0));
  }

  // Choix d'offre + route MLR, insérés au-dessus du nombre de participants.
  const offerSlot = (
    <>
      {config.offer && (
        <div className="grid gap-1.5">
          <p id="offre-libelle" className="text-sm font-medium text-ink-strong">
            {config.offer.question}
          </p>
          {config.offer.hint && (
            <p className="text-xs text-ink-soft">{config.offer.hint}</p>
          )}
          <OfferCards funnelType={funnelType} labelledBy="offre-libelle" />
        </div>
      )}
      {singleOffer && (
        <div className="grid gap-1.5">
          <p className="text-sm font-medium text-ink-strong">Votre formule</p>
          <p className="rounded-xl border-2 border-accent-soft bg-surface-2 px-4 py-3 text-sm">
            <span className="font-medium text-ink-strong">{singleOffer.label}</span>
            {singleOffer.prixIndicatif !== null && (
              <span className="text-ink-soft">
                {" "}
                — {formatEuros(singleOffer.prixIndicatif)} / pers
              </span>
            )}
          </p>
        </div>
      )}
      {inlineRouteSteps.map((step) => (
        <div key={step.id} className="grid gap-1.5">
          <p
            id={`inline-${step.id}-libelle`}
            className="text-sm font-medium text-ink-strong"
          >
            {step.question}
          </p>
          {step.hint && <p className="text-xs text-ink-soft">{step.hint}</p>}
          <RadioCards
            name={step.name}
            options={step.options}
            labelledBy={`inline-${step.id}-libelle`}
          />
        </div>
      ))}
    </>
  );

  return (
    <div ref={topRef} className="scroll-mt-24">
      <FormProvider {...form}>
        <form
          onSubmit={(event) => event.preventDefault()}
          onChange={handleFormChange}
          onKeyDown={handleFormKeyDown}
          noValidate
        >
          {phase === "step1" ? (
            <section
              key="step1"
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
                <ContactFields offerSlot={offerSlot} />
              </div>
              {config.contact.message && (
                <p className="mt-4 rounded-lg bg-surface-2 px-4 py-3 text-sm text-ink-soft">
                  {config.contact.message}
                </p>
              )}
            </section>
          ) : (
            currentScreen && (
              <>
                <StepIndicator
                  current={screenIndex + 1}
                  total={step2Screens.length}
                  label={`${config.label} · précisions`}
                />
                <section
                  key={currentKey}
                  className="animate-step mt-6"
                  aria-labelledby={headingId}
                >
                  <h2
                    id={headingId}
                    tabIndex={-1}
                    className="font-heading text-2xl font-semibold text-ink-strong outline-none sm:text-3xl"
                  >
                    {currentScreen.step.question}
                  </h2>
                  {currentScreen.step.hint && (
                    <p className="mt-2 text-sm text-ink-soft">
                      {currentScreen.step.hint}
                    </p>
                  )}
                  <div className="mt-5">
                    {currentScreen.kind === "question" &&
                      (currentScreen.step.kind === "multi" ? (
                        <CheckboxCards
                          name={currentScreen.step.name}
                          options={currentScreen.step.options}
                          labelledBy={headingId}
                        />
                      ) : (
                        <RadioCards
                          name={currentScreen.step.name}
                          options={currentScreen.step.options}
                          labelledBy={headingId}
                        />
                      ))}
                    {currentScreen.kind === "conditions" && (
                      <ConditionsFields
                        includeAge={currentScreen.step.includeAge}
                        acceptances={currentScreen.step.acceptances}
                      />
                    )}
                    {currentScreen.kind === "recap" && <RecapList config={config} />}
                  </div>
                  {currentScreen.step.message && (
                    <p className="mt-4 rounded-lg bg-surface-2 px-4 py-3 text-sm text-ink-soft">
                      {currentScreen.step.message}
                    </p>
                  )}
                </section>
              </>
            )
          )}

          {serverError && (
            <p
              role="alert"
              className="mt-4 rounded-lg border-2 border-danger bg-card px-4 py-3 text-sm font-medium text-danger"
            >
              {serverError}
            </p>
          )}

          <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
            {phase === "step2" && screenIndex > 0 ? (
              <Button type="button" variant="ghost" onClick={goBack}>
                ← Retour
              </Button>
            ) : (
              <span aria-hidden />
            )}
            {phase === "step1" ? (
              <Button type="button" disabled={submitting} onClick={step1Submit}>
                {submitting ? "Envoi en cours…" : config.ctaStep1}
              </Button>
            ) : !isLast ? (
              <Button type="button" onClick={step2Next}>
                Continuer →
              </Button>
            ) : (
              <Button type="button" disabled={submitting} onClick={step2Finish}>
                {submitting ? "Envoi en cours…" : STEP2_CTA}
              </Button>
            )}
          </div>

          {/* Note tarifaire (« hors vol & assurance ») — sous le CTA
              d'enregistrement, en clôture de l'écran unique. */}
          {phase === "step1" && config.intro.note && (
            <p className="mt-6 rounded-lg border-2 border-accent-soft bg-surface-2 px-4 py-3 text-sm text-ink-soft">
              {config.intro.note}
            </p>
          )}
        </form>
      </FormProvider>

      <Modal
        open={modalOpen}
        onClose={declineStep2}
        titleId="lead-modal-title"
        descriptionId="lead-modal-desc"
      >
        <h2
          id="lead-modal-title"
          className="font-heading text-xl font-bold text-ink-strong"
        >
          Vos informations sont bien enregistrées.
        </h2>
        <p id="lead-modal-desc" className="mt-3 text-sm text-ink-soft">
          Notre équipe va préparer votre projet avec attention. Pour affiner
          votre proposition, précisez votre projet en quelques questions rapides.
        </p>
        <div className="mt-6 flex flex-col gap-3">
          <Button type="button" onClick={acceptStep2}>
            Oui, préciser mon projet
          </Button>
          <Button type="button" variant="ghost" onClick={declineStep2}>
            Non merci
          </Button>
        </div>
      </Modal>
    </div>
  );
}
