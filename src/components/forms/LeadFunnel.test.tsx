/**
 * @vitest-environment jsdom
 *
 * Écran unique de l'étape 1 (formule + route MLR + coordonnées ensemble),
 * validation au CTA d'enregistrement et blocage de la soumission implicite
 * clavier. Exception à la règle « fonctions pures uniquement » : ces
 * comportements vivent dans le câblage DOM, ils ne se testent qu'en rendant
 * le composant.
 */
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeAll, expect, it, vi } from "vitest";
import { submitStep1 } from "@/actions/submitStep1";
import { LeadFunnel } from "./LeadFunnel";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: () => undefined }),
}));
vi.mock("@/actions/submitStep1", () => ({ submitStep1: vi.fn() }));
vi.mock("@/actions/saveStep2Progress", () => ({ saveStep2Progress: vi.fn() }));

beforeAll(() => {
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
  vi.clearAllMocks();
  sessionStorage.clear();
});

const boutonEnregistrer = () =>
  screen.findByRole("button", { name: /enregistrer mes coordonnées/i });

/** Laisse aboutir une éventuelle validation asynchrone avant d'asserter. */
const flush = () => new Promise((resolve) => setTimeout(resolve, 50));

it("affiche l'étape 1 en écran unique : formule, route MLR et coordonnées ensemble", async () => {
  render(<LeadFunnel funnelType="mlr" />);
  // Tout coexiste sur le même écran, sans « Continuer » intermédiaire.
  expect(await screen.findByRole("radio", { name: /10 jours/i })).toBeTruthy();
  expect(screen.getByRole("radio", { name: /^Nord/i })).toBeTruthy();
  expect(screen.getByLabelText("Nom")).toBeTruthy();
  expect(screen.queryByRole("button", { name: /continuer/i })).toBeNull();
});

it("masque la route quand la page l'a pré-remplie (/mlr/{route})", async () => {
  render(<LeadFunnel funnelType="mlr" defaultValues={{ route: "sud" }} />);
  expect(await screen.findByRole("radio", { name: /10 jours/i })).toBeTruthy();
  expect(screen.queryByRole("radio", { name: /^Nord/i })).toBeNull();
  expect(screen.getByLabelText("Nom")).toBeTruthy();
});

it("valide tout l'écran au CTA : envoi à vide → alertes, pas d'appel serveur", async () => {
  const user = userEvent.setup();
  render(<LeadFunnel funnelType="cvm_treks" />);
  await user.click(await boutonEnregistrer());
  const alertes = await screen.findAllByRole("alert");
  expect(alertes.length).toBeGreaterThan(0);
  expect(vi.mocked(submitStep1)).not.toHaveBeenCalled();
});

it("n'envoie pas le formulaire quand Entrée est pressée dans le champ Nom", async () => {
  const user = userEvent.setup();
  render(<LeadFunnel funnelType="cvm_treks" />);
  await user.click(await screen.findByLabelText("Nom"));
  await user.keyboard("{Enter}");
  await flush();
  expect(screen.queryAllByRole("alert")).toHaveLength(0);
  expect(vi.mocked(submitStep1)).not.toHaveBeenCalled();
});

it("laisse Entrée insérer un saut de ligne dans le commentaire (textarea)", async () => {
  const user = userEvent.setup();
  render(<LeadFunnel funnelType="cvm_treks" />);
  const commentaire = await screen.findByLabelText(/commentaire libre/i);
  if (!(commentaire instanceof HTMLTextAreaElement)) {
    throw new Error("Le champ commentaire devrait être un textarea.");
  }
  await user.type(commentaire, "ligne 1{Enter}ligne 2");
  expect(commentaire.value).toBe("ligne 1\nligne 2");
});
