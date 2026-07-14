"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useSyncExternalStore } from "react";
import { FormProvider, useForm, type UseFormRegister } from "react-hook-form";
import { submitLeadTampon } from "@/actions/submitLeadTampon";
import { PhoneField } from "@/components/forms/PhoneField";
import { buttonClasses } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { scrollToElement } from "@/lib/scroll";
import { pushDataLayerEventOnce } from "@/lib/tracking/gtm";
import { readUtm } from "@/lib/utm";
import { readVisitorProfile, saveVisitorProfile } from "@/lib/visitorProfile";
import {
  visitorProfileSchema,
  type VisitorProfile,
} from "@/lib/validations/visitorProfile";

type Props = { children: React.ReactNode };
type SubmissionPhase = "idle" | "success" | "closing" | "complete";

const FIELD_CLASS =
  "peer h-11 w-full min-w-0 max-w-full rounded-lg border-2 border-line bg-card px-3 text-base text-ink shadow-sm outline-none transition-colors placeholder:text-ink-soft/45 hover:border-accent-soft focus:border-accent focus:ring-4 focus:ring-accent/10 aria-[invalid=true]:border-danger aria-[invalid=true]:focus:ring-danger/10 sm:rounded-xl sm:px-4";

function subscribeToStoredProfile(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

const getStoredProfileSnapshot = () => readVisitorProfile() !== null;
const getStoredProfileServerSnapshot = () => false;

const INTENTIONS: ReadonlyArray<{
  value: VisitorProfile["intention"];
  label: string;
}> = [
  {
    value: "preparation_active",
    label: "Je prépare activement mon voyage",
  },
  {
    value: "comparaison_destinations",
    label: "Je compare plusieurs destinations",
  },
  {
    value: "recherche_informations",
    label: "Je cherche simplement des informations",
  },
  {
    value: "curiosite",
    label: "Je suis juste curieux(se)",
  },
];

const ECHEANCES: ReadonlyArray<{
  value: VisitorProfile["echeance"];
  label: string;
}> = [
  { value: "moins_3_mois", label: "Dans moins de 3 mois" },
  { value: "3_6_mois", label: "Entre 3 et 6 mois" },
  { value: "6_10_mois", label: "Entre 6 et 10 mois" },
  { value: "plus_1_an", label: "Dans plus d’un an" },
  { value: "sans_date", label: "Je n’ai aucune date" },
];

type FieldProps = {
  id: keyof VisitorProfile;
  label: string;
  type?: "text" | "email";
  placeholder: string;
  autoComplete: string;
  error?: string;
  register: UseFormRegister<VisitorProfile>;
};

function GateField({
  id,
  label,
  type = "text",
  placeholder,
  autoComplete,
  error,
  register,
}: FieldProps) {
  const errorId = `${id}-gate-error`;

  return (
    <div className="grid min-w-0 max-w-full gap-1">
      <label
        htmlFor={`gate-${id}`}
        className="text-xs font-semibold text-ink-strong sm:text-sm"
      >
        {label}
      </label>
      <input
        id={`gate-${id}`}
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        autoCapitalize={type === "email" ? "none" : "words"}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        {...register(id)}
        className={FIELD_CLASS}
      />
      {error && (
        <p
          id={errorId}
          role="alert"
          className="text-[10px] font-medium leading-tight text-danger sm:text-xs"
        >
          {error}
        </p>
      )}
    </div>
  );
}

/**
 * Sas d'entrée de la page mère : l'accueil reste visible mais flouté derrière
 * un dialogue non fermable. Les coordonnées sont d'abord enregistrées dans la
 * table tampon, puis conservées localement pour éviter la double saisie.
 */
export function VisitorGate({ children }: Props) {
  const hasStoredProfile = useSyncExternalStore(
    subscribeToStoredProfile,
    getStoredProfileSnapshot,
    getStoredProfileServerSnapshot,
  );
  const [submissionPhase, setSubmissionPhase] =
    useState<SubmissionPhase>("idle");
  const [serverError, setServerError] = useState<string | null>(null);
  const form = useForm<VisitorProfile>({
    resolver: zodResolver(visitorProfileSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {
      nom: "",
      prenom: "",
      email: "",
      telephone: "",
      consentement: false,
    },
  });

  // Après l'enregistrement, le dialogue reste ouvert sur une transition qui
  // indique clairement la prochaine action. Le profil stocké ne déverrouille
  // l'accueil qu'après le clic sur ce CTA.
  const unlocked =
    submissionPhase === "complete" ||
    (submissionPhase === "idle" && hasStoredProfile);
  const blocked = !unlocked;
  const visible = !unlocked;
  const success =
    submissionPhase === "success" || submissionPhase === "closing";

  useEffect(() => {
    if (!blocked) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusTimer = window.setTimeout(() => form.setFocus("nom"), 80);

    return () => {
      window.clearTimeout(focusTimer);
      document.body.style.overflow = previousOverflow;
    };
  }, [blocked, form]);

  async function submit(profile: VisitorProfile) {
    setServerError(null);
    let result: Awaited<ReturnType<typeof submitLeadTampon>>;
    try {
      // `UtmCapture` a mémorisé le premier point d'entrée dès le chargement.
      result = await submitLeadTampon(profile, readUtm());
    } catch {
      setServerError(
        "L’enregistrement est momentanément indisponible. Merci de réessayer.",
      );
      return;
    }
    if (!result.ok) {
      setServerError(result.message);
      return;
    }

    saveVisitorProfile(profile);
    try {
      pushDataLayerEventOnce("visitor_gate_complete", "visitor_gate_complete", {
        source: "homepage",
      });
    } catch {
      // Un navigateur qui bloque sessionStorage ne doit jamais bloquer l'accès.
    }
    setSubmissionPhase("success");
  }

  function continueToOffers() {
    setSubmissionPhase("closing");
    window.setTimeout(() => {
      setSubmissionPhase("complete");
      window.setTimeout(() => {
        const destination = [
          "univers",
          "experiences",
          "questionnaire",
          "routes",
        ]
          .map((id) => document.getElementById(id))
          .find((element): element is HTMLElement => element !== null);
        if (destination !== undefined) scrollToElement(destination);
      }, 0);
    }, 320);
  }

  return (
    <>
      <div
        inert={blocked ? true : undefined}
        aria-hidden={blocked || undefined}
      >
        {children}
      </div>

      {visible && (
        <div
          className={cn(
            "fixed inset-0 z-[70] flex h-[100svh] items-center justify-center overflow-hidden bg-ink-strong/60 p-1.5 backdrop-blur-[10px] transition-opacity duration-300 motion-reduce:transition-none sm:p-4",
            submissionPhase === "closing" && "pointer-events-none opacity-0",
          )}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="visitor-gate-title"
            aria-describedby="visitor-gate-description"
            className={cn(
              "relative my-auto max-h-[calc(100svh-.75rem)] w-full min-w-0 max-w-[calc(100vw-.75rem)] overflow-hidden rounded-[1.25rem] border border-brand-gold/70 bg-card shadow-[0_28px_90px_rgb(7_44_26_/_0.45)] transition duration-300 motion-reduce:transition-none sm:max-h-[calc(100svh-2rem)] sm:max-w-3xl sm:rounded-[2rem]",
              submissionPhase === "closing" &&
                "translate-y-2 scale-[0.98] opacity-0",
            )}
          >
            <div
              aria-hidden
              className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-ink-strong via-brand-gold to-ember"
            />
            <div
              aria-hidden
              className="absolute -right-20 -top-20 h-52 w-52 rounded-full bg-accent/10 blur-3xl"
            />
            <div
              aria-hidden
              className="absolute -bottom-24 -left-20 h-52 w-52 rounded-full bg-lagon/10 blur-3xl"
            />

            <div className="relative min-w-0 overflow-hidden px-3.5 pb-3 pt-3.5 sm:px-7 sm:pb-5 sm:pt-5">
              <div className="flex items-start justify-between gap-4 [@media(max-height:720px)]:hidden">
                <Image
                  src="/images/logo-celebrations-voyages-or.jpeg"
                  alt="Célébrations Voyages"
                  width={1600}
                  height={311}
                  priority
                  unoptimized
                  className="h-6 w-auto rounded-md border border-brand-gold/70 shadow-sm sm:h-9 sm:rounded-lg"
                />
              </div>

              <div className="mt-2 sm:mt-4">
                <p className="font-heading text-[10px] font-bold uppercase tracking-[0.2em] text-accent sm:text-xs">
                  {success
                    ? "Étape suivante · Choisissez votre offre"
                    : "Étape 1 sur 3 · Votre profil"}
                </p>
                <h2
                  id="visitor-gate-title"
                  className="mt-1 max-w-2xl font-heading text-xl font-bold leading-tight text-ink-strong sm:text-3xl"
                >
                  {success
                    ? `Choisissez votre offre${form.getValues("prenom") ? `, ${form.getValues("prenom")}` : ""}.`
                    : "Votre voyage commence ici"}
                </h2>
                <p
                  id="visitor-gate-description"
                  className="mt-1 max-w-2xl text-[11px] leading-relaxed text-ink-soft sm:mt-2 sm:text-sm [@media(max-height:680px)]:hidden"
                >
                  {success ? (
                    <>
                      Comparez librement les univers et retenez l’expérience
                      qui correspond à votre façon de voyager.
                    </>
                  ) : (
                    <>
                      Une seule saisie, puis vous choisissez librement votre
                      univers et votre offre.
                    </>
                  )}
                </p>
              </div>

              {success ? (
                <div aria-live="polite" className="mt-4 sm:mt-6">
                  <p className="text-center font-heading text-[11px] font-bold tracking-wide text-accent sm:text-sm">
                    Madagascar. Là où les autres ne vont pas.
                  </p>
                  <ol
                    aria-label="Progression de votre demande"
                    className="mt-2 grid grid-cols-3 gap-1.5 text-center text-[10px] font-semibold sm:gap-3 sm:text-xs"
                  >
                    <li className="rounded-xl border border-lagon/40 bg-lagon/10 px-2 py-2.5 text-ink-strong">
                      <span className="mx-auto mb-1 flex h-6 w-6 items-center justify-center rounded-full bg-lagon text-white">
                        ✓
                      </span>
                      Coordonnées
                    </li>
                    <li
                      aria-current="step"
                      className="rounded-xl border-2 border-accent bg-accent/10 px-2 py-2.5 text-ink-strong shadow-sm"
                    >
                      <span className="mx-auto mb-1 flex h-6 w-6 items-center justify-center rounded-full bg-accent text-white">
                        2
                      </span>
                      Univers & offre
                    </li>
                    <li className="rounded-xl border border-line bg-surface px-2 py-2.5 text-ink-soft">
                      <span className="mx-auto mb-1 flex h-6 w-6 items-center justify-center rounded-full border border-line bg-card">
                        3
                      </span>
                      Proposition
                    </li>
                  </ol>

                  <button
                    type="button"
                    onClick={continueToOffers}
                    className={buttonClasses(
                      "primary",
                      "cta-pulse mt-4 min-h-11 w-full px-4 py-2.5 text-xs sm:text-sm",
                    )}
                  >
                    Voir les univers et les offres
                    <svg
                      aria-hidden
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="h-5 w-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m9 18 6-6-6-6"
                      />
                    </svg>
                  </button>
                  <p className="mt-2 text-center text-[10px] text-ink-soft sm:text-xs">
                    Aucun paiement maintenant · Coordonnées mémorisées 30 jours.
                  </p>
                </div>
              ) : (
                <FormProvider {...form}>
                  <form
                    onSubmit={form.handleSubmit(submit)}
                    noValidate
                    className="mt-2.5 w-full min-w-0 sm:mt-4"
                  >
                    <div className="grid min-w-0 grid-cols-2 gap-2 sm:gap-3">
                      <GateField
                        id="nom"
                        label="Nom"
                        placeholder="Votre nom"
                        autoComplete="family-name"
                        error={form.formState.errors.nom?.message}
                        register={form.register}
                      />
                      <GateField
                        id="prenom"
                        label="Prénom"
                        placeholder="Votre prénom"
                        autoComplete="given-name"
                        error={form.formState.errors.prenom?.message}
                        register={form.register}
                      />
                      <div className="min-w-0 max-w-full">
                        <GateField
                          id="email"
                          label="Email"
                          type="email"
                          placeholder="vous@exemple.com"
                          autoComplete="email"
                          error={form.formState.errors.email?.message}
                          register={form.register}
                        />
                      </div>
                      <div className="min-w-0 max-w-full overflow-hidden [&_.PhoneInput]:h-11 [&_input]:py-2 [&_label]:text-xs sm:[&_input]:py-2.5 sm:[&_label]:text-sm">
                        <PhoneField name="telephone" label="Téléphone" />
                      </div>
                    </div>

                    <fieldset
                      aria-describedby={
                        form.formState.errors.intention
                          ? "gate-intention-error"
                          : undefined
                      }
                      className="mt-2"
                    >
                      <legend className="text-xs font-semibold text-ink-strong sm:text-sm">
                        Quel est votre projet actuellement ?
                      </legend>
                      <div className="mt-1.5 grid grid-cols-2 gap-1.5 sm:grid-cols-4 sm:gap-2">
                        {INTENTIONS.map((intention) => {
                          const id = `gate-intention-${intention.value}`;
                          return (
                            <label
                              key={intention.value}
                              htmlFor={id}
                              className="relative cursor-pointer"
                            >
                              <input
                                id={id}
                                type="radio"
                                value={intention.value}
                                {...form.register("intention")}
                                className="peer sr-only"
                              />
                              <span className="flex h-full min-h-11 items-center rounded-lg border-2 border-line bg-card px-2 py-1.5 pr-5 text-left shadow-sm transition hover:border-accent-soft hover:bg-surface peer-checked:border-accent peer-checked:bg-accent/5 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent sm:min-h-14 sm:rounded-xl sm:px-3 sm:py-2 sm:pr-8">
                                <span className="text-[10px] font-semibold leading-tight text-ink-strong sm:text-sm">
                                  {intention.label}
                                </span>
                              </span>
                              <span
                                aria-hidden
                                className="absolute right-1.5 top-1.5 h-4 w-4 rounded-full border-2 border-line bg-card transition peer-checked:border-[5px] peer-checked:border-accent sm:right-3 sm:top-3 sm:h-5 sm:w-5 sm:peer-checked:border-[6px]"
                              />
                            </label>
                          );
                        })}
                      </div>
                      {form.formState.errors.intention?.message && (
                        <p
                          id="gate-intention-error"
                          role="alert"
                          className="mt-1 text-[10px] font-medium leading-tight text-danger sm:text-xs"
                        >
                          {form.formState.errors.intention.message}
                        </p>
                      )}
                    </fieldset>

                    <fieldset
                      aria-describedby={
                        form.formState.errors.echeance
                          ? "gate-echeance-error"
                          : undefined
                      }
                      className="mt-2"
                    >
                      <legend className="text-xs font-semibold text-ink-strong sm:text-sm">
                        À quelle échéance pensez-vous partir ?
                      </legend>
                      <div className="mt-1.5 grid grid-cols-2 gap-1.5 sm:grid-cols-5 sm:gap-2">
                        {ECHEANCES.map((echeance, index) => {
                          const id = `gate-echeance-${echeance.value}`;
                          return (
                            <label
                              key={echeance.value}
                              htmlFor={id}
                              className={cn(
                                "relative cursor-pointer",
                                index === ECHEANCES.length - 1 &&
                                  "col-span-2 sm:col-span-1",
                              )}
                            >
                              <input
                                id={id}
                                type="radio"
                                value={echeance.value}
                                {...form.register("echeance")}
                                className="peer sr-only"
                              />
                              <span className="flex h-full min-h-11 items-center rounded-lg border-2 border-line bg-card px-2 py-1.5 pr-5 text-left shadow-sm transition hover:border-accent-soft hover:bg-surface peer-checked:border-accent peer-checked:bg-accent/5 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent sm:min-h-14 sm:rounded-xl sm:px-3 sm:py-2 sm:pr-8">
                                <span className="text-[10px] font-semibold leading-tight text-ink-strong sm:text-xs">
                                  {echeance.label}
                                </span>
                              </span>
                              <span
                                aria-hidden
                                className="absolute right-1.5 top-1.5 h-4 w-4 rounded-full border-2 border-line bg-card transition peer-checked:border-[5px] peer-checked:border-accent sm:right-2.5 sm:top-2.5"
                              />
                            </label>
                          );
                        })}
                      </div>
                      {form.formState.errors.echeance?.message && (
                        <p
                          id="gate-echeance-error"
                          role="alert"
                          className="mt-1 text-[10px] font-medium leading-tight text-danger sm:text-xs"
                        >
                          {form.formState.errors.echeance.message}
                        </p>
                      )}
                    </fieldset>

                  <div className="mt-2">
                    <div className="flex items-start gap-2">
                      <input
                        id="gate-consentement"
                        type="checkbox"
                        aria-invalid={
                          form.formState.errors.consentement ? true : undefined
                        }
                        aria-describedby={
                          form.formState.errors.consentement
                            ? "gate-consentement-error"
                            : undefined
                        }
                        {...form.register("consentement")}
                        className="mt-0.5 h-5 w-5 shrink-0 accent-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                      />
                      <p className="text-[10px] leading-snug text-ink-soft sm:text-xs">
                        <label
                          htmlFor="gate-consentement"
                          className="cursor-pointer"
                        >
                          J’accepte l’utilisation de mes coordonnées pour
                          personnaliser ma demande et être recontacté(e).
                        </label>{" "}
                        <Link
                          href="/confidentialite"
                          className="font-semibold underline underline-offset-2 hover:text-ink-strong"
                        >
                          Confidentialité
                        </Link>
                        .
                      </p>
                    </div>
                    {form.formState.errors.consentement?.message && (
                      <p
                        id="gate-consentement-error"
                        role="alert"
                        className="mt-1 text-[10px] font-medium leading-tight text-danger sm:text-xs"
                      >
                        {form.formState.errors.consentement.message}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={form.formState.isSubmitting}
                    aria-busy={form.formState.isSubmitting}
                    className={buttonClasses(
                      "primary",
                      "cta-pulse mt-3 min-h-11 w-full px-4 py-2.5 text-xs sm:py-3 sm:text-sm",
                    )}
                  >
                    {form.formState.isSubmitting
                      ? "Enregistrement…"
                      : "Continuer vers les offres"}
                    {!form.formState.isSubmitting && (
                      <svg
                        aria-hidden
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="h-5 w-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m9 18 6-6-6-6"
                        />
                      </svg>
                    )}
                  </button>
                  {serverError && (
                    <p
                      role="alert"
                      className="mt-1.5 text-center text-xs font-medium text-danger"
                    >
                      {serverError}
                    </p>
                  )}
                </form>
                </FormProvider>
              )}

              {!success && (
                <div className="mt-2.5 flex flex-wrap justify-center gap-x-4 gap-y-1 border-t border-line pt-2 text-[10px] font-medium text-ink-soft sm:mt-3 sm:text-xs [@media(max-height:720px)]:hidden">
                  <span className="inline-flex items-center gap-1.5">
                    <svg
                      aria-hidden
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="h-4 w-4 text-lagon"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m5 12 4 4L19 6"
                      />
                    </svg>
                    Parcours personnalisé
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <svg
                      aria-hidden
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="h-4 w-4 text-lagon"
                    >
                      <rect x="5" y="11" width="14" height="10" rx="2" />
                      <path strokeLinecap="round" d="M8 11V8a4 4 0 0 1 8 0v3" />
                    </svg>
                    Données protégées
                  </span>
                </div>
              )}
            </div>
          </section>
        </div>
      )}
    </>
  );
}
