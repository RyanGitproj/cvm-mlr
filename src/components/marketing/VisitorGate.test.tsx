/** @vitest-environment jsdom */
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { submitLeadTampon } from "@/actions/submitLeadTampon";
import { readVisitorProfile, saveVisitorProfile } from "@/lib/visitorProfile";
import { VisitorGate } from "./VisitorGate";

vi.mock("@/actions/submitLeadTampon", () => ({
  submitLeadTampon: vi.fn(),
}));

beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
  vi.mocked(submitLeadTampon).mockResolvedValue({ ok: true });
});

afterEach(() => {
  cleanup();
  document.body.style.overflow = "";
});

it("bloque l'accueil et valide toutes les informations obligatoires", async () => {
  const user = userEvent.setup();
  const { container } = render(
    <VisitorGate>
      <main>Accueil Madagascar</main>
    </VisitorGate>,
  );

  expect(screen.getByRole("dialog")).toBeTruthy();
  expect(container.querySelector("[inert]")).toBeTruthy();
  expect(document.body.style.overflow).toBe("hidden");

  // Régression mobile : l'input téléphone doit pouvoir rétrécir dans son
  // conteneur flex sans imposer sa largeur intrinsèque au viewport.
  const phoneInput = screen.getByLabelText("Téléphone");
  expect(phoneInput.className).toContain("w-0");
  expect(phoneInput.closest(".PhoneInput")?.className).toContain("min-w-0");

  await user.click(
    screen.getByRole("button", { name: /continuer vers les offres/i }),
  );
  expect(await screen.findAllByRole("alert")).toHaveLength(7);
  expect(readVisitorProfile()).toBeNull();
});

it("mémorise le profil puis guide vers le choix d'une offre", async () => {
  const user = userEvent.setup();
  const firstTouchUtm = {
    utm_source: "google",
    utm_medium: "cpc",
    utm_campaign: "madagascar",
    utm_term: "voyage sur mesure",
    referrer: "https://www.google.com/",
  };
  sessionStorage.setItem("funnel_utm", JSON.stringify(firstTouchUtm));
  render(
    <VisitorGate>
      <main>Accueil Madagascar</main>
    </VisitorGate>,
  );

  await user.type(screen.getByLabelText("Nom"), "Rakoto");
  await user.type(screen.getByLabelText("Prénom"), "Mia");
  await user.type(screen.getByLabelText("Email"), "MIA@EXAMPLE.COM");
  await user.type(screen.getByLabelText("Téléphone"), "0612345678");
  await user.click(
    screen.getByRole("radio", { name: /je prépare activement/i }),
  );
  await user.click(
    screen.getByRole("radio", { name: /entre 3 et 6 mois/i }),
  );
  await user.click(
    screen.getByRole("checkbox", { name: /j’accepte l’utilisation/i }),
  );
  await user.click(
    screen.getByRole("button", { name: /continuer vers les offres/i }),
  );

  expect(readVisitorProfile()).toEqual({
    nom: "Rakoto",
    prenom: "Mia",
    email: "mia@example.com",
    telephone: "+33612345678",
    intention: "preparation_active",
    echeance: "3_6_mois",
    consentement: true,
  });
  expect(vi.mocked(submitLeadTampon)).toHaveBeenCalledWith(
    {
      nom: "Rakoto",
      prenom: "Mia",
      email: "mia@example.com",
      telephone: "+33612345678",
      intention: "preparation_active",
      echeance: "3_6_mois",
      consentement: true,
    },
    firstTouchUtm,
  );
  expect(
    await screen.findByText(/comparez librement les univers/i),
  ).toBeTruthy();
  expect(screen.queryByText(/profil enregistré/i)).toBeNull();
  expect(
    screen.getByText(/madagascar\. là où les autres ne vont pas/i),
  ).toBeTruthy();
  expect(screen.getByText("Univers & offre")).toBeTruthy();
  await user.click(
    screen.getByRole("button", { name: /voir les univers et les offres/i }),
  );
  await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
  expect(document.body.style.overflow).toBe("");
});

it("ne redemande pas les informations quand un profil valide existe", async () => {
  saveVisitorProfile({
    nom: "Rakoto",
    prenom: "Mia",
    email: "mia@example.com",
    telephone: "+33612345678",
    intention: "preparation_active",
    echeance: "3_6_mois",
    consentement: true,
  });

  render(
    <VisitorGate>
      <main>Accueil Madagascar</main>
    </VisitorGate>,
  );

  await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
  expect(screen.getByText("Accueil Madagascar")).toBeTruthy();
});

it("reste fermé et affiche l'erreur si l'enregistrement tampon échoue", async () => {
  vi.mocked(submitLeadTampon).mockResolvedValue({
    ok: false,
    message: "Service momentanément indisponible.",
  });
  const user = userEvent.setup();
  render(
    <VisitorGate>
      <main>Accueil Madagascar</main>
    </VisitorGate>,
  );

  await user.type(screen.getByLabelText("Nom"), "Rakoto");
  await user.type(screen.getByLabelText("Prénom"), "Mia");
  await user.type(screen.getByLabelText("Email"), "mia@example.com");
  await user.type(screen.getByLabelText("Téléphone"), "0612345678");
  await user.click(
    screen.getByRole("radio", { name: /je prépare activement/i }),
  );
  await user.click(
    screen.getByRole("radio", { name: /entre 3 et 6 mois/i }),
  );
  await user.click(
    screen.getByRole("checkbox", { name: /j’accepte l’utilisation/i }),
  );
  await user.click(
    screen.getByRole("button", { name: /continuer vers les offres/i }),
  );

  expect(await screen.findByText("Service momentanément indisponible.")).toBeTruthy();
  expect(screen.getByRole("dialog")).toBeTruthy();
  expect(readVisitorProfile()).toBeNull();
});
