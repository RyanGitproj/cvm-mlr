import { describe, expect, it } from "vitest";
import type { MlrLead } from "@/lib/validations/mlr";
import { segmentMlr } from "./mlr";

const base: MlrLead = {
  prenom: "Riane",
  email: "riane@example.com",
  telephone: "0341234567",
  periode: "Octobre 2026",
  nbVoyageurs: 2,
  consentement: true,
  duree: "10_jours",
  route: "sud",
  pretRoots: "oui_local_simple",
  securite: "respecte_consignes",
  budgetJour: "50_75",
};

describe("segmentMlr", () => {
  it("mappe chaque réponse roots vers son profil", () => {
    expect(segmentMlr(base).profil).toBe("roots_pret");
    expect(
      segmentMlr({ ...base, pretRoots: "oui_comprendre_regles" }).profil,
    ).toBe("roots_a_briefer");
    expect(
      segmentMlr({ ...base, pretRoots: "hesite_prefere_confort" }).profil,
    ).toBe("confort_d_abord");
    expect(segmentMlr({ ...base, pretRoots: "veut_conseil" }).profil).toBe(
      "a_conseiller",
    );
  });

  it("signale l'orientation CVM uniquement pour un profil confort", () => {
    expect(segmentMlr(base).orientationCvm).toBe(false);
    expect(
      segmentMlr({ ...base, pretRoots: "hesite_prefere_confort" }).orientationCvm,
    ).toBe(true);
  });
});
