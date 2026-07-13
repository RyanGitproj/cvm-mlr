import { describe, expect, it } from "vitest";
import {
  decodeVisitorProfile,
  encodeVisitorProfile,
  VISITOR_PROFILE_TTL_MS,
} from "./visitorProfile";

const NOW = 1_800_000_000_000;
const PROFILE = {
  nom: "Rakoto",
  prenom: "Mia",
  email: "mia@example.com",
  telephone: "+33612345678",
  intention: "exploration" as const,
  consentement: true,
};

describe("visitorProfile", () => {
  it("conserve une identité valide pendant la durée prévue", () => {
    const raw = encodeVisitorProfile(PROFILE, NOW);
    expect(decodeVisitorProfile(raw, NOW + VISITOR_PROFILE_TTL_MS)).toEqual(
      PROFILE,
    );
  });

  it("refuse une identité expirée", () => {
    const raw = encodeVisitorProfile(PROFILE, NOW);
    expect(
      decodeVisitorProfile(raw, NOW + VISITOR_PROFILE_TTL_MS + 1),
    ).toBeNull();
  });

  it("refuse un profil sans consentement", () => {
    const raw = JSON.stringify({
      v: 4,
      savedAt: NOW,
      profile: { ...PROFILE, consentement: false },
    });
    expect(decodeVisitorProfile(raw, NOW)).toBeNull();
  });

  it("refuse les données corrompues, futures ou invalides", () => {
    expect(decodeVisitorProfile("{oops", NOW)).toBeNull();
    expect(decodeVisitorProfile(encodeVisitorProfile(PROFILE, NOW + 1), NOW)).toBeNull();
    expect(
      decodeVisitorProfile(
        JSON.stringify({
          v: 4,
          savedAt: NOW,
          profile: { ...PROFILE, email: "pas-un-email" },
        }),
        NOW,
      ),
    ).toBeNull();
  });

  it("normalise les valeurs au décodage", () => {
    expect(
      decodeVisitorProfile(
        JSON.stringify({
          v: 4,
          savedAt: NOW,
          profile: {
            nom: "  Rakoto ",
            prenom: " Mia  ",
            email: " MIA@EXAMPLE.COM ",
            telephone: "+33612345678",
            intention: "exploration",
            consentement: true,
          },
        }),
        NOW,
      ),
    ).toEqual(PROFILE);
  });
});
