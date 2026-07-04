/**
 * @vitest-environment jsdom
 *
 * Garde anti double-clic et blocage de la soumission implicite clavier de
 * MultiStepForm (voir SUBMIT_GUARD_MS / handleFormKeyDown dans le composant).
 * Exception à la règle « fonctions pures uniquement » : le bug vit dans le
 * câblage DOM (le submit remplace « Continuer » au même emplacement écran),
 * il ne se teste qu'en rendant le composant.
 */
import { cleanup, render, screen } from "@testing-library/react";
import userEvent, { type UserEvent } from "@testing-library/user-event";
import { afterEach, beforeAll, expect, it, vi } from "vitest";
import { submitLead } from "@/actions/submitLead";
import { MultiStepForm } from "./MultiStepForm";

// L'app router et la Server Action n'existent pas dans jsdom : remplacés par
// des coquilles inertes. `submitLead` sert aussi de témoin — il ne doit
// jamais être appelé ici (la validation échoue avant, champs vides).
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: () => undefined }),
}));
vi.mock("@/actions/submitLead", () => ({ submitLead: vi.fn() }));

beforeAll(() => {
  // APIs de défilement absentes de jsdom, appelées à chaque changement d'étape.
  window.matchMedia = (query: string): MediaQueryList => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: () => undefined,
    removeEventListener: () => undefined,
    addListener: () => undefined,
    removeListener: () => undefined,
    dispatchEvent: () => false,
  });
  Element.prototype.scrollIntoView = () => undefined;
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.clearAllMocks();
  sessionStorage.clear();
});

/** Une réponse par étape radio MLR — jamais « Autre », pas de précision. */
const REPONSES_MLR = [
  /10 jours/i,
  /^Nord/i,
  /voyager local/i,
  /consignes du guide/i,
  /35 à 50/i,
];

async function continuer(user: UserEvent) {
  await user.click(await screen.findByRole("button", { name: /continuer/i }));
}

/** Répond aux 5 étapes radio et s'arrête sur le récapitulatif (étape 6/7). */
async function allerAuRecap(user: UserEvent) {
  for (const reponse of REPONSES_MLR) {
    await user.click(await screen.findByRole("radio", { name: reponse }));
    await continuer(user);
  }
}

/** Va jusqu'à l'étape coordonnées (7/7), champs vides. */
async function allerAuxCoordonnees(user: UserEvent) {
  await allerAuRecap(user);
  await continuer(user);
  await screen.findByLabelText("Prénom");
}

const boutonEnvoi = () =>
  screen.findByRole("button", { name: /recevoir mon itinéraire/i });

/** Laisse aboutir une éventuelle validation asynchrone avant d'asserter. */
const flush = () => new Promise((resolve) => setTimeout(resolve, 50));

it("ignore le clic hérité d'un double-clic sur « Continuer », puis revalide un envoi volontaire", async () => {
  // Seule l'horloge Date est simulée : le garde compare des Date.now(), et
  // les vrais timers restent disponibles pour user-event et findBy*.
  vi.useFakeTimers({ toFake: ["Date"] });
  const user = userEvent.setup();
  render(<MultiStepForm funnelType="mlr" />);
  await allerAuRecap(user);

  // Récap → coordonnées : le submit vient de remplacer « Continuer » au même
  // endroit ; le second clic du double-clic atterrit dessus immédiatement
  // (horloge figée → on est dans la fenêtre de garde). Aucune alerte attendue.
  await continuer(user);
  await user.click(await boutonEnvoi());
  await flush();
  expect(screen.queryAllByRole("alert")).toHaveLength(0);

  // Passée la fenêtre de garde, un envoi volontaire (champs toujours vides)
  // déclenche normalement les alertes de validation.
  vi.setSystemTime(Date.now() + 600);
  await user.click(await boutonEnvoi());
  const alertes = await screen.findAllByRole("alert");
  expect(alertes.length).toBeGreaterThan(0);
  expect(vi.mocked(submitLead)).not.toHaveBeenCalled();
});

it("n'envoie pas le formulaire quand Entrée est pressée dans le champ Prénom", async () => {
  vi.useFakeTimers({ toFake: ["Date"] });
  const user = userEvent.setup();
  render(<MultiStepForm funnelType="mlr" />);
  await allerAuxCoordonnees(user);

  // Hors fenêtre de garde : c'est bien le blocage clavier qui est vérifié.
  vi.setSystemTime(Date.now() + 600);
  await user.click(screen.getByLabelText("Prénom"));
  await user.keyboard("{Enter}");
  await flush();
  expect(screen.queryAllByRole("alert")).toHaveLength(0);
  expect(vi.mocked(submitLead)).not.toHaveBeenCalled();
});

it("laisse Entrée insérer un saut de ligne dans le commentaire (textarea)", async () => {
  const user = userEvent.setup();
  render(<MultiStepForm funnelType="mlr" />);
  await allerAuxCoordonnees(user);

  const commentaire = screen.getByLabelText(/commentaire libre/i);
  if (!(commentaire instanceof HTMLTextAreaElement)) {
    throw new Error("Le champ commentaire devrait être un textarea.");
  }
  await user.type(commentaire, "ligne 1{Enter}ligne 2");
  expect(commentaire.value).toBe("ligne 1\nligne 2");
});
