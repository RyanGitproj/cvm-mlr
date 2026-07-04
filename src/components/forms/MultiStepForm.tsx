"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { FormProvider, useForm, type FieldValues } from "react-hook-form";
import type { z } from "zod";
import { submitLead } from "@/actions/submitLead";
import { Button } from "@/components/ui/Button";
import { getFunnelConfig } from "@/config/funnels";
import { scrollToElement } from "@/lib/scroll";
import { pushDataLayerEventOnce } from "@/lib/tracking/gtm";
import { readUtm } from "@/lib/utm";
import { getSchema } from "@/lib/validations";
import type { FunnelStep } from "@/types/funnel";
import type { FunnelType } from "@/types/lead";
import { CheckboxCards } from "./CheckboxCards";
import { ContactFields } from "./ContactFields";
import { RadioCards } from "./RadioCards";
import { RecapList } from "./RecapList";
import { StepIndicator } from "./StepIndicator";

type Props = {
  funnelType: FunnelType;
  /** Pré-remplissage (ex. route MLR depuis /mlr/sud → ?route=sud). */
  defaultValues?: Record<string, string>;
};

/**
 * Fenêtre pendant laquelle toute soumission est ignorée après un changement
 * d'étape. Le bouton « Continuer » (type=button) et le bouton submit occupent
 * le même emplacement à l'écran : le passage d'étape étant instantané, un
 * double-clic (souris ou tactile) sur « Continuer » à l'avant-dernière étape
 * atterrit sur le submit et enverrait un formulaire vide — toutes les alertes
 * de validation apparaîtraient sans intention d'envoi de l'utilisateur.
 */
const SUBMIT_GUARD_MS = 500;

/** Vrai si la soumission survient dans la fenêtre de garde post-changement d'étape. */
function isWithinSubmitGuard(lastStepChangeAt: number): boolean {
  return Date.now() - lastStepChangeAt < SUBMIT_GUARD_MS;
}

/**
 * Moteur de formulaire multi-étapes (brief §9.1) : piloté par la config du
 * funnel, validation Zod par étape, une seule décision par écran.
 */
export function MultiStepForm({ funnelType, defaultValues }: Props) {
  const config = getFunnelConfig(funnelType);
  const router = useRouter();
  const topRef = useRef<HTMLDivElement>(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<FieldValues>({
    // Le schéma est résolu à l'exécution parmi les 6 funnels : on élargit
    // son type au format générique de champs de react-hook-form. La
    // validation réelle reste entièrement portée par le schéma Zod.
    resolver: zodResolver(
      getSchema(funnelType) as unknown as z.ZodType<FieldValues, FieldValues>,
    ),
    // Les erreurs n'apparaissent qu'à la tentative de validation (clic
    // « Continuer » via `form.trigger`, ou envoi via `handleSubmit`), puis se
    // corrigent en direct (`reValidateMode: "onChange"` par défaut). En
    // `onTouched`, un champ vide se marquait en erreur dès qu'on l'effleurait
    // au passage — surprenant sur l'étape coordonnées, avant toute saisie.
    mode: "onSubmit",
    defaultValues,
  });

  const step = config.steps[stepIndex];
  const total = config.steps.length;
  const isLast = stepIndex === total - 1;
  const headingId = `question-${step.id}`;

  // À chaque changement d'étape : remonter en haut du formulaire (fluide,
  // reduced-motion respecté) et poser le focus sur la nouvelle question —
  // essentiel quand le formulaire est intégré en bas d'une page longue.
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (topRef.current) scrollToElement(topRef.current);
    document.getElementById(headingId)?.focus({ preventScroll: true });
  }, [stepIndex, headingId]);

  // Horodatage du dernier changement d'étape — voir SUBMIT_GUARD_MS.
  const lastStepChangeAt = useRef(0);

  async function goNext() {
    const valid = await form.trigger(fieldsOfStep(step), { shouldFocus: true });
    if (!valid) return;
    // Entrée réelle dans le funnel : 1re étape validée (une fois par session).
    if (stepIndex === 0) {
      pushDataLayerEventOnce(`funnel_start_${funnelType}`, "funnel_start", {
        funnel_type: funnelType,
      });
    }
    const nextStep = config.steps[stepIndex + 1];
    if (nextStep) form.clearErrors(fieldsOfStep(nextStep));
    lastStepChangeAt.current = Date.now();
    setStepIndex((index) => index + 1);
  }

  function goBack() {
    lastStepChangeAt.current = Date.now();
    setStepIndex((index) => Math.max(index - 1, 0));
  }

  /**
   * Garde anti double-clic : une soumission qui survient juste après un
   * changement d'étape est un clic « en trop » hérité de l'étape précédente
   * (le submit vient de remplacer « Continuer » au même endroit), pas une
   * intention d'envoi — on l'ignore. Un clic volontaire, forcément plus
   * tardif, passe normalement et la validation reste entière.
   */
  function handleFormSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    if (isWithinSubmitGuard(lastStepChangeAt.current)) {
      event.preventDefault();
      return;
    }
    void form.handleSubmit(onSubmit)(event);
  }

  /**
   * Bloque la soumission implicite au clavier : la touche Entrée (« aller » /
   * « OK » des claviers mobiles) dans un champ texte soumettait le formulaire
   * avant la dernière étape. On ne neutralise que les INPUT — Entrée garde son
   * rôle dans les TEXTAREA (saut de ligne) et sur les BUTTON (activation).
   */
  function handleFormKeyDown(event: React.KeyboardEvent<HTMLFormElement>) {
    if (event.key !== "Enter") return;
    if (event.target instanceof HTMLElement && event.target.tagName === "INPUT") {
      event.preventDefault();
    }
  }

  async function onSubmit(values: FieldValues) {
    setServerError(null);
    const result = await submitLead(config.type, values, readUtm());
    if (result.ok) {
      router.push("/merci");
      return;
    }
    setServerError(result.message);
  }

  return (
    <div ref={topRef} className="scroll-mt-24">
      <FormProvider {...form}>
        <form onSubmit={handleFormSubmit} onKeyDown={handleFormKeyDown} noValidate>
          <StepIndicator current={stepIndex + 1} total={total} label={config.label} />

          <section key={step.id} className="animate-step mt-6" aria-labelledby={headingId}>
            <h2
              id={headingId}
              tabIndex={-1}
              className="font-heading text-2xl font-semibold text-ink-strong outline-none sm:text-3xl"
            >
              {step.question}
            </h2>
            {step.hint && <p className="mt-2 text-sm text-ink-soft">{step.hint}</p>}
            <div className="mt-5">
              {step.kind === "radio" && (
                <RadioCards name={step.name} options={step.options} labelledBy={headingId} />
              )}
              {step.kind === "multi" && (
                <CheckboxCards name={step.name} options={step.options} labelledBy={headingId} />
              )}
              {step.kind === "recap" && <RecapList config={config} />}
              {step.kind === "contact" && <ContactFields step={step} />}
            </div>
            {step.message && (
              <p className="mt-4 rounded-lg bg-surface-2 px-4 py-3 text-sm text-ink-soft">
                {step.message}
              </p>
            )}
          </section>

          {serverError && (
            <p
              role="alert"
              className="mt-4 rounded-lg border-2 border-danger bg-card px-4 py-3 text-sm font-medium text-danger"
            >
              {serverError}
            </p>
          )}

          {/*
           * CTA d'étape : barre inline, rattachée au bas du formulaire (dans
           * le flux normal). Pas de position `fixed` — sur mobile, elle
           * entrerait en conflit avec le bandeau de consentement CNIL, lui
           * aussi épinglé en bas du viewport (`fixed bottom-0`), qui masquerait
           * le CTA.
           */}
          <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
            {stepIndex > 0 ? (
              <Button type="button" variant="ghost" onClick={goBack}>
                ← Retour
              </Button>
            ) : (
              <span aria-hidden />
            )}
            {isLast ? (
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Envoi en cours…" : config.cta}
              </Button>
            ) : (
              <Button type="button" onClick={goNext}>
                Continuer →
              </Button>
            )}
          </div>
        </form>
      </FormProvider>
    </div>
  );
}

/** Champs à valider pour passer l'étape courante. */
function fieldsOfStep(step: FunnelStep): string[] {
  switch (step.kind) {
    case "radio":
    case "multi":
      return [step.name, `${step.name}Precision`];
    case "contact": {
      const names: string[] = ["prenom", "telephone", "email", ...step.fields];
      for (const acceptance of step.acceptances ?? []) names.push(acceptance.name);
      names.push("consentement");
      return names;
    }
    case "recap":
      return [];
  }
}
