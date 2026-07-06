import { describe, expect, it } from "vitest";
import type { CvmTreksQualification } from "@/lib/validations/cvm-treks";
import { segmentTreks } from "./treks";

const base: CvmTreksQualification = {
  budget: "2200_2500",
  kmParJour: "8_12",
  denivele: "modere",
  terrain: "accessible",
  passagesRocheux: "aucun",
  decor: "sud",
  confort: "mixte",
};

describe("segmentTreks", () => {
  it("dérive le niveau de base des kilomètres par jour", () => {
    expect(segmentTreks({ ...base, kmParJour: "5_8" }).niveau).toBe("decouverte");
    expect(segmentTreks(base).niveau).toBe("intermediaire");
    expect(segmentTreks({ ...base, kmParJour: "12_18" }).niveau).toBe("soutenu");
    expect(segmentTreks({ ...base, kmParJour: "18_plus" }).niveau).toBe("engage");
  });

  it("monte d'un cran avec un dénivelé soutenu, plafonné à « engagé »", () => {
    expect(segmentTreks({ ...base, denivele: "soutenu" }).niveau).toBe("soutenu");
    expect(
      segmentTreks({ ...base, kmParJour: "18_plus", denivele: "soutenu" }).niveau,
    ).toBe("engage");
  });

  it("descend d'un cran avec un dénivelé faible, plancher « découverte »", () => {
    expect(segmentTreks({ ...base, denivele: "faible" }).niveau).toBe("decouverte");
    expect(
      segmentTreks({ ...base, kmParJour: "5_8", denivele: "faible" }).niveau,
    ).toBe("decouverte");
  });

  it("renvoie vers un conseiller plutôt que de deviner", () => {
    expect(segmentTreks({ ...base, kmParJour: "autre" }).niveau).toBe("a_orienter");
    expect(segmentTreks({ ...base, denivele: "a_orienter" }).niveau).toBe(
      "a_orienter",
    );
    expect(segmentTreks({ ...base, denivele: "autre" }).niveau).toBe("a_orienter");
  });

  it("joint la lecture de l'enveloppe budget", () => {
    expect(segmentTreks(base).budgetLecture).toContain("trek");
  });
});
