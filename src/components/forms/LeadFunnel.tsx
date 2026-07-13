"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useRef, useState } from "react";
import { FormProvider, useForm, type FieldValues } from "react-hook-form";
import type { z } from "zod";
import { submitLead } from "@/actions/submitLead";
import { TrackedLink } from "@/components/tracking/TrackedLink";
import { Button, buttonClasses } from "@/components/ui/Button";
import { MediaBackdrop } from "@/components/ui/MediaBackdrop";
import { getFunnelConfig } from "@/config/funnels";
import { resolveOffer } from "@/config/offers";
import { FB_CONTENT_CATEGORY, fbEvent } from "@/lib/fpixel";
import {
  clearDraft,
  createDraft,
  draftKey,
  readDraft,
  writeDraft,
} from "@/lib/leadDraft";
import { nbVoyageursFrom } from "@/lib/leads/toLeadRow";
import { scrollToElement } from "@/lib/scroll";
import type { Recommendation } from "@/lib/segmentation/types";
import { pushDataLayerEventOnce } from "@/lib/tracking/gtm";
import { readUtm } from "@/lib/utm";
import { getFormSchema } from "@/lib/validations";
import { MESSAGE_EFFECTIF_GROUPE } from "@/lib/validations/common";
import { readVisitorProfile } from "@/lib/visitorProfile";
import type { WizardStep } from "@/types/funnel";
import type { FunnelType } from "@/types/lead";
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

type Screen = { kind: "step"; step: WizardStep } | { kind: "final" };

/**
 * Moteur wizard unique des 6 funnels — gabarit maquette boss 2026-07-07 :
 * Q1 projection → Q2 offre à prix → Q3 période → Q4 voyageurs, un écran par
 * décision avec avance au clic et barre « Étape X/N ». Le CTA de soumission
 * vit sur la dernière décision : les coordonnées déjà collectées dans le sas
 * sont relues côté serveur, sans nouvel écran de saisie. L'écran final est
 * rendu depuis la recommendation retournée par l'action.
 */
export function LeadFunnel({
  funnelType,
  defaultValues,
  headingLevel: Heading = "h1",
}: Props) {
  const config = getFunnelConfig(funnelType);
  const topRef = useRef<HTMLDivElement>(null);

  // Clé du brouillon persisté : le funnel + la route MLR pré-remplie (les
  // index d'écran diffèrent selon que l'écran route est sauté ou non).
  const draftStorageKey = draftKey(funnelType, defaultValues?.route);

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
    { kind: "final" as const },
  ];
  // Dernier écran = « final » (non persistable : la recommendation ne l'est
  // pas) ; on ne restaure jamais au-delà de la dernière décision.
  const finalIndex = screens.length - 1;
  const maxRestoreIndex = screens.length - 2;

  const [screenIndex, setScreenIndex] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);

  // Miroir de l'écran courant pour l'écrivain debouncé (closure du form.watch).
  const screenIndexRef = useRef(screenIndex);
  screenIndexRef.current = screenIndex;

  // Écrit le brouillon pour un écran donné — ignore l'écran final et les
  // parcours encore vierges (pas de clé inutile en storage).
  const saveDraftAt = useCallback(
    (index: number) => {
      if (index < 0 || index >= finalIndex) return;
      const values = form.getValues();
      const hasValue = Object.values(values).some(
        (value) => value !== undefined && value !== null && value !== "",
      );
      if (!hasValue) return;
      writeDraft(draftStorageKey, createDraft(index, values, readUtm(), Date.now()));
    },
    [draftStorageKey, finalIndex, form],
  );

  // Restauration après un rechargement de webview : une seule fois au montage,
  // avant que l'écrivain ne s'abonne. Ref booléen volontaire — re-restaurer
  // écraserait la saisie en cours (à distinguer du scroll, qui doit re-jouer).
  const restored = useRef(false);
  useEffect(() => {
    if (restored.current) return;
    restored.current = true;
    const draft = readDraft(draftStorageKey, Date.now());
    const profile = readVisitorProfile();

    // L'identité saisie dans le sas de la page d'accueil préremplit les
    // coordonnées. Un brouillon déjà commencé garde toutefois la priorité sur
    // toute valeur non vide que le visiteur aurait corrigée dans le funnel.
    const restoredValues: FieldValues = {
      ...form.getValues(),
      ...(draft?.values ?? {}),
    };
    if (profile !== null) {
      // L'intention du sas reste volontairement hors des réponses du funnel.
      // Les coordonnées et le consentement alimentent seulement la validation
      // cliente ; le serveur relit ensuite les valeurs de la table tampon.
      const contactFields = [
        "nom",
        "prenom",
        "email",
        "telephone",
        "consentement",
      ] as const;
      for (const name of contactFields) {
        const value = profile[name];
        const current = restoredValues[name];
        if (current === undefined || current === null || current === "") {
          restoredValues[name] = value;
        }
      }
    }

    const hasValue = Object.values(restoredValues).some(
      (value) => value !== undefined && value !== null && value !== "",
    );
    if (hasValue) form.reset(restoredValues);

    if (draft !== null) {
      setScreenIndex(Math.min(Math.max(draft.screenIndex, 0), maxRestoreIndex));
    }
  }, [draftStorageKey, maxRestoreIndex, form]);

  // Persistance debouncée, déclenchée par le `onChange` du <form> (il bouillonne
  // depuis tous les champs — y compris le radio posé par setValue à l'avance).
  // On lit l'écran courant via le ref. Les retours ne changent aucune valeur :
  // ils sont persistés explicitement dans goBack.
  const persistTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(
    () => () => {
      if (persistTimer.current !== null) clearTimeout(persistTimer.current);
    },
    [],
  );

  const currentScreen = screens[screenIndex];
  const isLastStep =
    currentScreen.kind === "step" &&
    screenIndex === visibleSteps.length - 1;
  const headingId =
    currentScreen.kind === "step"
      ? `question-${currentScreen.step.id}`
      : "question-final";

  // Entrée réelle dans le funnel : première interaction avec le formulaire
  // (onChange bubbles depuis les champs ; dédup session dans pushDataLayerEventOnce).
  function handleFormChange() {
    pushDataLayerEventOnce(`funnel_start_${funnelType}`, "funnel_start", {
      funnel_type: funnelType,
    });
    if (persistTimer.current !== null) clearTimeout(persistTimer.current);
    persistTimer.current = setTimeout(
      () => saveDraftAt(screenIndexRef.current),
      400,
    );
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

  /** Submit unique du parcours, depuis la dernière étape de décision. */
  async function submit() {
    if (inFlight.current || withinGuard()) return;
    inFlight.current = true;
    try {
      const valid = await form.trigger(undefined, { shouldFocus: true });
      if (!valid) return;
      if (currentScreen.kind === "step") {
        pushDataLayerEventOnce(
          `funnel_step_${funnelType}_${currentScreen.step.id}`,
          "funnel_step",
          {
            funnel_type: funnelType,
            step_id: currentScreen.step.id,
            step_index: screenIndex + 1,
            step_total: visibleSteps.length,
          },
        );
      }
      setServerError(null);
      setSubmitting(true);
      // Fallback d'attribution : si un reload a vidé le sessionStorage des UTM
      // sans re-fournir la query string, on retombe sur le snapshot du brouillon.
      const utm = readUtm() ?? readDraft(draftStorageKey, Date.now())?.utm ?? null;
      const result = await submitLead(funnelType, form.getValues(), utm);
      setSubmitting(false);
      if (!result.ok) {
        setServerError(result.message);
        return;
      }
      // Lead enregistré : le brouillon n'a plus lieu d'être (un reload post-envoi
      // ne doit pas ressusciter un parcours périmé). Le profil visiteur reste
      // disponible jusqu'à son expiration afin de ne jamais redemander les
      // coordonnées juste après la confirmation.
      clearDraft(draftStorageKey);
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
      // Conversion Meta — no-op tant que le pixel n'est pas monté (gate
      // consentement CNIL). value/currency : optimisation valeur côté Ads.
      fbEvent("Lead", {
        content_category: FB_CONTENT_CATEGORY[config.brand],
        ...(offre !== null && { content_name: offre.label }),
        ...(offre !== null &&
          offre.prixIndicatif !== null && {
            value: offre.prixIndicatif,
            currency: "EUR",
          }),
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
    const target = Math.max(screenIndex - 1, 0);
    setScreenIndex(target);
    // Un retour ne change aucune valeur : l'écrivain (form.watch) ne se
    // déclencherait pas, on persiste donc l'écran cible explicitement.
    saveDraftAt(target);
  }

  // Écran à validation explicite : option « Autre » sélectionnée
  // (précision à saisir avant de continuer).
  const explicitCta = (() => {
    if (currentScreen.kind !== "step") return null;
    if (isLastStep) return null;
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
                    Formulaire
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
                        if (!isLastStep) void advanceFrom(currentScreen);
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
                          if (!isLastStep) void advanceFrom(currentScreen);
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
                {isLastStep && (
                  <div className="mt-4 flex items-start gap-3 rounded-xl border-2 border-accent-soft bg-card px-4 py-3 shadow-sm">
                    <span
                      aria-hidden
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-accent-contrast"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        className="h-4 w-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m5 12 4 4L19 6"
                        />
                      </svg>
                    </span>
                    <div className="min-w-0">
                      <p className="font-heading text-sm font-bold text-ink-strong sm:text-base">
                        {config.brand === "mlr"
                          ? `Ta route prend forme${typeof form.getValues("prenom") === "string" ? `, ${form.getValues("prenom")}` : ""}.`
                          : `Votre voyage prend forme${typeof form.getValues("prenom") === "string" ? `, ${form.getValues("prenom")}` : ""}.`}
                      </p>
                      <p className="mt-1 text-xs leading-relaxed text-ink-soft sm:text-sm">
                        Vos coordonnées sont déjà enregistrées. Votre proposition
                        sera préparée pour{" "}
                        <strong className="break-all font-semibold text-ink-strong">
                          {String(form.getValues("email") ?? "votre adresse email")}
                        </strong>
                        .
                      </p>
                      {config.contact.hint && (
                        <p className="mt-1 text-xs leading-relaxed text-ink-soft">
                          {config.contact.hint}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </section>
            </>
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
              {isLastStep ? (
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

          {/* Informations de clôture, désormais sous le CTA de la dernière
              décision puisque l'écran coordonnées a été supprimé. */}
          {isLastStep && (config.contact.message || config.intro.note) && (
            <div className="mt-4 space-y-2 text-xs leading-relaxed text-ink-soft">
              {config.contact.message && (
                <p className="rounded-lg bg-surface-2 px-3 py-2">
                  {config.contact.message}
                </p>
              )}
              {config.intro.note && (
                <p className="rounded-lg border-2 border-accent-soft bg-surface-2 px-3 py-2">
                  {config.intro.note}
                </p>
              )}
            </div>
          )}
        </form>
      </FormProvider>
    </div>
  );
}
