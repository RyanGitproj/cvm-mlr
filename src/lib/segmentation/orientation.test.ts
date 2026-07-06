import { describe, expect, it } from "vitest";
import type { CvmOrientationQualification } from "@/lib/validations/cvm-orientation";
import { segmentOrientation } from "./orientation";

const base: CvmOrientationQualification = {
  budget: "2200_2500",
  intention: "treks",
  delai: "2_4_mois",
  duree: "10_15",
  confort: "mixte",
  niveauPhysique: "active",
  imprevu: "accepte_imprevus",
  objectif: "paysages_cadre",
};

describe("segmentOrientation", () => {
  it("suit l'intention explicite", () => {
    expect(segmentOrientation({ ...base, intention: "iles" }).univers).toBe("iles");
    expect(segmentOrientation({ ...base, intention: "un_mois" }).univers).toBe(
      "un_mois",
    );
  });

  it("réoriente un profil confort vers Treks même si l'intention est Explorer", () => {
    expect(
      segmentOrientation({ ...base, intention: "explorer", confort: "premium" })
        .univers,
    ).toBe("treks");
    expect(
      segmentOrientation({
        ...base,
        intention: "explorer",
        niveauPhysique: "moderee",
      }).univers,
    ).toBe("treks");
  });

  it("confirme Explorer pour un profil rustique et sportif", () => {
    expect(
      segmentOrientation({
        ...base,
        intention: "explorer",
        confort: "rustique",
        niveauPhysique: "tres_sportive",
      }).univers,
    ).toBe("explorer");
  });

  it("retombe sur l'objectif profond quand l'intention est « autre »", () => {
    expect(
      segmentOrientation({ ...base, intention: "autre", objectif: "detente" })
        .univers,
    ).toBe("iles");
    expect(
      segmentOrientation({
        ...base,
        intention: "autre",
        objectif: "projet_de_vie",
      }).univers,
    ).toBe("un_mois");
  });

  it("applique le garde-fou Explorer aussi via l'objectif", () => {
    expect(
      segmentOrientation({
        ...base,
        intention: "autre",
        objectif: "depassement",
        confort: "premium",
      }).univers,
    ).toBe("treks");
  });

  it("utilise durée puis confort en dernier recours", () => {
    const indecis = { ...base, intention: "autre", objectif: "autre" } as const;
    expect(segmentOrientation({ ...indecis, duree: "un_mois" }).univers).toBe(
      "un_mois",
    );
    expect(segmentOrientation({ ...indecis, confort: "premium" }).univers).toBe(
      "iles",
    );
    expect(
      segmentOrientation({
        ...indecis,
        confort: "rustique",
        niveauPhysique: "sportive",
      }).univers,
    ).toBe("explorer");
    expect(segmentOrientation(indecis).univers).toBe("treks");
  });

  it("joint la lecture de l'enveloppe budget", () => {
    const reco = segmentOrientation({ ...base, budget: "3000_plus" });
    expect(reco.budgetLecture).toContain("Premium");
  });
});
