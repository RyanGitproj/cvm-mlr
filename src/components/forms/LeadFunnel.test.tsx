/**
 * @vitest-environment jsdom
 *
 * Moteur wizard (gabarit maquette 5 écrans) : une décision par écran, avance
 * au clic, garde anti double-clic, case de confirmation Q4 MLR, submit unique
 * aux coordonnées. Exception à la règle « fonctions pures uniquement » : ces
 * comportements vivent dans le câblage DOM, ils ne se testent qu'en rendant
 * le composant.
 */
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeAll, expect, it, vi } from "vitest";
import { submitLead } from "@/actions/submitLead";
import { LeadFunnel } from "./LeadFunnel";

vi.mock("@/actions/submitLead", () => ({ submitLead: vi.fn() }));
vi.mock("@/actions/saveSuite", () => ({ saveSuite: vi.fn() }));

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

/** L'auto-avance ignore les clics pendant la fenêtre anti double-clic. */
const settleGuard = () => new Promise((resolve) => setTimeout(resolve, 550));

it(
  "wizard MLR : une décision par écran, avance au clic, garde anti double-clic",
  async () => {
    const user = userEvent.setup();
    render(<LeadFunnel funnelType="mlr" />);

    // Q1 seule à l'écran — aucune coordonnée visible.
    expect(await screen.findByText(/quelle route t'appelle le plus/i)).toBeTruthy();
    expect(screen.queryByLabelText("Nom")).toBeNull();

    await user.click(screen.getByRole("radio", { name: /le nord/i }));
    expect(await screen.findByText(/quel niveau d'aventure/i)).toBeTruthy();

    // Un clic immédiat après le changement d'écran est ignoré (double-clic).
    await user.click(
      screen.getByRole("radio", { name: /taxi-brousse intégral/i }),
    );
    expect(screen.queryByText(/quand sens-tu que madagascar/i)).toBeNull();

    await settleGuard();
    await user.click(
      screen.getByRole("radio", { name: /taxi-brousse intégral/i }),
    );
    expect(
      await screen.findByText(/quand sens-tu que madagascar/i),
    ).toBeTruthy();
  },
  15000,
);

it(
  "route pré-remplie : Q1 sautée, case Q4 exigée, submit vide → alertes sans appel serveur",
  async () => {
    const user = userEvent.setup();
    render(<LeadFunnel funnelType="mlr" defaultValues={{ route: "ouest" }} />);

    // Q1 sautée : le parcours démarre au niveau d'aventure, barre sur 3.
    expect(await screen.findByText(/quel niveau d'aventure/i)).toBeTruthy();
    expect(screen.getByText(/étape 1 sur 3/i)).toBeTruthy();

    await user.click(
      screen.getByRole("radio", { name: /taxi-brousse intégral/i }),
    );
    expect(await screen.findByText(/quand sens-tu/i)).toBeTruthy();
    await settleGuard();

    await user.click(screen.getByRole("radio", { name: /0 à 2 mois/i }));
    expect(await screen.findByText(/combien de places/i)).toBeTruthy();
    await settleGuard();

    // La sélection des voyageurs n'avance pas seule : case de confirmation.
    await user.click(screen.getByRole("radio", { name: /je pars seul/i }));
    expect(screen.getByText(/combien de places/i)).toBeTruthy();

    // CTA sans la case cochée → erreur, on reste sur Q4.
    await user.click(
      screen.getByRole("button", { name: /voir ma route liberty roots/i }),
    );
    expect((await screen.findAllByRole("alert")).length).toBeGreaterThan(0);
    expect(screen.queryByText(/ta route est presque prête/i)).toBeNull();

    await user.click(
      screen.getByRole("checkbox", { name: /j'ai compris que les vols/i }),
    );
    await user.click(
      screen.getByRole("button", { name: /voir ma route liberty roots/i }),
    );
    expect(await screen.findByText(/ta route est presque prête/i)).toBeTruthy();
    await settleGuard();

    // Submit à vide → alertes de validation, aucun appel serveur.
    await user.click(screen.getByRole("button", { name: /recevoir ma route/i }));
    expect((await screen.findAllByRole("alert")).length).toBeGreaterThan(0);
    expect(vi.mocked(submitLead)).not.toHaveBeenCalled();

    // Entrée dans un champ texte ne soumet pas le formulaire.
    await user.click(screen.getByLabelText("Nom"));
    await user.keyboard("{Enter}");
    await new Promise((resolve) => setTimeout(resolve, 50));
    expect(vi.mocked(submitLead)).not.toHaveBeenCalled();
  },
  20000,
);

it(
  "cvm_treks (gabarit 4 étapes) : décor → offre 2 cartes à prix, sans « Conseillez-moi »",
  async () => {
    const user = userEvent.setup();
    render(<LeadFunnel funnelType="cvm_treks" />);

    // Q1 = projection décor, barre sur 4 écrans.
    expect(
      await screen.findByText(/quel grand décor vous fait rêver/i),
    ).toBeTruthy();
    expect(screen.getByText(/étape 1 sur 4/i)).toBeTruthy();
    expect(screen.queryByLabelText("Nom")).toBeNull();

    await user.click(screen.getByRole("radio", { name: /morondava/i }));
    // Q2 = offre : 2 cartes avec prix, plus d'option « Conseillez-moi ».
    expect(
      await screen.findByText(/quelle formule vous correspond/i),
    ).toBeTruthy();
    expect(screen.getAllByRole("radio")).toHaveLength(2);
    expect(screen.queryByText(/conseillez-moi/i)).toBeNull();
    expect(screen.getByText(/2 200 €/)).toBeTruthy();
    expect(screen.getByText(/2 500 €/)).toBeTruthy();
  },
  15000,
);
