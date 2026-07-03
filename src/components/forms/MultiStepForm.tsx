"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { FormProvider, useForm, type FieldValues } from "react-hook-form";
import type { z } from "zod";
import { submitLead } from "@/actions/submitLead";
import { Button } from "@/components/ui/Button";
import { getFunnelConfig } from "@/config/funnels";
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
    mode: "onTouched",
    defaultValues,
  });

  const step = config.steps[stepIndex];
  const total = config.steps.length;
  const isLast = stepIndex === total - 1;
  const headingId = `question-${step.id}`;

  function scrollToTop() {
    topRef.current?.scrollIntoView({ block: "start" });
  }

  async function goNext() {
    const valid = await form.trigger(fieldsOfStep(step), { shouldFocus: true });
    if (!valid) return;
    setStepIndex((index) => index + 1);
    scrollToTop();
  }

  function goBack() {
    setStepIndex((index) => Math.max(index - 1, 0));
    scrollToTop();
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
        <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
          <StepIndicator current={stepIndex + 1} total={total} label={config.label} />

          <section key={step.id} className="animate-step mt-6" aria-labelledby={headingId}>
            <h2
              id={headingId}
              className="font-heading text-2xl font-semibold text-ink-strong sm:text-3xl"
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

          {/* Sticky en mobile : le CTA d'étape reste visible sans scroll (390×844). */}
          <div className="sticky bottom-0 z-10 -mx-4 mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-line bg-surface/95 px-4 py-3 backdrop-blur sm:static sm:mx-0 sm:border-0 sm:bg-transparent sm:p-0 sm:backdrop-blur-none">
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
