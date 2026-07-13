import { beforeEach, describe, expect, it, vi } from "vitest";
import { setLeadCookie } from "@/lib/lead-cookie";
import { setMerciCookie } from "@/lib/merci-cookie";
import { getLeadTampon, insertLead } from "@/lib/supabase/leads";
import { readTamponCookie } from "@/lib/tampon-cookie";
import { submitLead } from "./submitLead";

vi.mock("@/lib/supabase/leads", () => ({
  getLeadTampon: vi.fn(),
  insertLead: vi.fn(),
}));
vi.mock("@/lib/tampon-cookie", () => ({
  readTamponCookie: vi.fn(),
}));
vi.mock("@/lib/lead-cookie", () => ({ setLeadCookie: vi.fn() }));
vi.mock("@/lib/merci-cookie", () => ({ setMerciCookie: vi.fn() }));

const TAMPON_ID = "123e4567-e89b-42d3-a456-426614174000";
const LEAD_ID = "223e4567-e89b-42d3-a456-426614174000";
const CONTACT = {
  nom: "Rakoto",
  prenom: "Mia",
  email: "mia@example.com",
  telephone: "+33612345678",
  consentement: true,
};

describe("submitLead", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(readTamponCookie).mockResolvedValue(TAMPON_ID);
    vi.mocked(getLeadTampon).mockResolvedValue({
      ok: true,
      contact: CONTACT,
    });
    vi.mocked(insertLead).mockResolvedValue({ ok: true, id: LEAD_ID });
  });

  it("relit les coordonnées du premier formulaire et soumet depuis la dernière décision", async () => {
    const result = await submitLead(
      "mlr",
      {
        route: "nord",
        offreDuree: "10_jours",
        departFenetre: "2_4",
        nbVoyageurs: "2",
        // Ces valeurs navigateur ne doivent jamais remplacer le tampon.
        nom: "Valeur falsifiée",
        email: "pirate@example.com",
      },
      null,
    );

    expect(result.ok).toBe(true);
    expect(insertLead).toHaveBeenCalledWith(
      expect.objectContaining({
        funnel_leads_tampon_id: TAMPON_ID,
        nom: "Rakoto",
        prenom: "Mia",
        email: "mia@example.com",
        telephone: "+33612345678",
        consentement: true,
        route: "nord",
        nb_voyageurs: 2,
      }),
    );
    expect(setLeadCookie).toHaveBeenCalledWith({
      id: LEAD_ID,
      funnelType: "mlr",
    });
    expect(setMerciCookie).toHaveBeenCalledWith(
      expect.objectContaining({ nom: "Rakoto", prenom: "Mia" }),
    );
  });

  it("n'écrit rien si les coordonnées initiales sont absentes", async () => {
    vi.mocked(readTamponCookie).mockResolvedValue(null);

    const result = await submitLead("mlr", {}, null);

    expect(result.ok).toBe(false);
    expect(getLeadTampon).not.toHaveBeenCalled();
    expect(insertLead).not.toHaveBeenCalled();
  });
});
