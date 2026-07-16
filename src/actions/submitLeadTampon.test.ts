import { beforeEach, describe, expect, it, vi } from "vitest";
import { insertLeadTampon } from "@/lib/supabase/leads";
import { setTamponCookie } from "@/lib/tampon-cookie";
import { submitLeadTampon } from "./submitLeadTampon";

vi.mock("@/lib/supabase/leads", () => ({
  insertLeadTampon: vi.fn(),
}));
vi.mock("@/lib/tampon-cookie", () => ({
  setTamponCookie: vi.fn(),
}));

const PROFILE = {
  nom: "Rakoto",
  prenom: "Mia",
  email: "mia@example.com",
  telephone: "+33612345678",
  intention: "preparation_active",
  echeance: "3_6_mois",
  consentement: true,
};

describe("submitLeadTampon", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("insère les coordonnées et conserve l'id de relation côté serveur", async () => {
    vi.mocked(insertLeadTampon).mockResolvedValue({
      ok: true,
      id: "123e4567-e89b-12d3-a456-426614174000",
    });

    await expect(
      submitLeadTampon(PROFILE, {
        utm_source: "meta",
        utm_medium: "paid_social",
        utm_campaign: "madagascar_ete",
        utm_content: "video_1",
        utm_term: "voyage_madagascar",
        referrer: "https://www.instagram.com/",
      }),
    ).resolves.toEqual({ ok: true });
    expect(insertLeadTampon).toHaveBeenCalledWith({
      nom: "Rakoto",
      prenom: "Mia",
      email: "mia@example.com",
      telephone: "+33612345678",
      temperature: "preparation_active",
      depart_prevue: "3_6_mois",
      consentement: true,
      utm_source: "meta",
      utm_medium: "paid_social",
      utm_campaign: "madagascar_ete",
      utm_content: "video_1",
      utm_term: "voyage_madagascar",
      referrer: "https://www.instagram.com/",
    });
    expect(setTamponCookie).toHaveBeenCalledWith(
      "123e4567-e89b-12d3-a456-426614174000",
    );
  });

  it("refuse les données invalides avant tout accès à la base", async () => {
    const result = await submitLeadTampon({ ...PROFILE, email: "invalide" });
    expect(result.ok).toBe(false);
    expect(insertLeadTampon).not.toHaveBeenCalled();
    expect(setTamponCookie).not.toHaveBeenCalled();
  });

  it("ne crée pas de session si l'insertion échoue", async () => {
    vi.mocked(insertLeadTampon).mockResolvedValue({ ok: false });
    const result = await submitLeadTampon(PROFILE);
    expect(result.ok).toBe(false);
    expect(setTamponCookie).not.toHaveBeenCalled();
  });
});
