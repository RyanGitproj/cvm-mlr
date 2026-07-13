/**
 * @vitest-environment jsdom
 *
 * Moteur wizard : une décision par écran, avance au clic, garde anti
 * double-clic, puis submit sur la dernière décision. Exception
 * à la règle « fonctions pures uniquement » : ces
 * comportements vivent dans le câblage DOM, ils ne se testent qu'en rendant
 * le composant.
 */
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeAll, beforeEach, expect, it, vi } from "vitest";
import { submitLead } from "@/actions/submitLead";
import { createDraft, draftKey, writeDraft } from "@/lib/leadDraft";
import { readVisitorProfile, saveVisitorProfile } from "@/lib/visitorProfile";
import { LeadFunnel } from "./LeadFunnel";

vi.mock("@/actions/submitLead", () => ({ submitLead: vi.fn() }));
vi.mock("@/actions/saveSuite", () => ({ saveSuite: vi.fn() }));

const VISITOR_PROFILE = {
  nom: "Rakoto",
  prenom: "Mia",
  email: "mia@example.com",
  telephone: "+33612345678",
  intention: "conseil" as const,
  consentement: true,
};

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

beforeEach(() => {
  vi.mocked(submitLead).mockResolvedValue({
    ok: true,
    recommendation: null,
  });
});

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
  localStorage.clear();
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
  "route pré-remplie : Q1 sautée et submit depuis la dernière décision",
  async () => {
    const user = userEvent.setup();
    saveVisitorProfile(VISITOR_PROFILE);
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

    // Les exclusions restent un simple texte d'info. La dernière sélection ne
    // change plus d'écran : elle révèle/maintient le CTA de soumission final.
    expect(
      screen.getByText(/les vols, hôtels et restaurants ne sont pas inclus/i),
    ).toBeTruthy();
    expect(screen.queryByRole("checkbox")).toBeNull();
    await user.click(screen.getByRole("radio", { name: /je pars seul/i }));
    expect(await screen.findByText(/combien de places/i)).toBeTruthy();
    expect(screen.queryByLabelText("Nom")).toBeNull();
    expect(screen.getByText(/mia@example\.com/i)).toBeTruthy();

    await user.click(screen.getByRole("button", { name: /recevoir ma route/i }));
    expect(vi.mocked(submitLead)).toHaveBeenCalledOnce();
    expect(vi.mocked(submitLead).mock.calls[0]?.[1]).toEqual(
      expect.objectContaining({
        nom: "Rakoto",
        email: "mia@example.com",
        consentement: true,
        nbVoyageurs: "1",
      }),
    );
    expect(readVisitorProfile()).toEqual(VISITOR_PROFILE);
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

it("restaure la dernière étape sans réafficher les coordonnées", async () => {
  saveVisitorProfile(VISITOR_PROFILE);
  writeDraft(
    draftKey("mlr"),
    createDraft(
      3,
      {
        route: "nord",
        offreDuree: "10_jours",
        departFenetre: "4_6",
      },
      null,
      Date.now(),
    ),
  );

  render(<LeadFunnel funnelType="mlr" />);

  expect(await screen.findByText(/combien de places/i)).toBeTruthy();
  expect(screen.queryByLabelText("Nom")).toBeNull();
  expect(screen.queryByLabelText("Email")).toBeNull();
  expect(screen.getByText(/mia@example\.com/i)).toBeTruthy();

  const user = userEvent.setup();
  await user.click(screen.getByRole("radio", { name: /je pars seul/i }));
  await user.click(screen.getByRole("button", { name: /recevoir ma route/i }));
  expect(vi.mocked(submitLead)).toHaveBeenCalledOnce();
});
