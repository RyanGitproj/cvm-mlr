import { describe, expect, it } from "vitest";
import type { CvmExplorerLead } from "@/lib/validations/cvm-explorer";
import { segmentExplorer } from "./explorer";

const base: CvmExplorerLead = {
  prenom: "Riane",
  email: "riane@example.com",
  telephone: "0341234567",
  periode: "2_4_mois",
  nbVoyageurs: 1,
  consentement: true,
  budget: "2500_3000",
  capaciteMarche: "15_20",
  terrainDifficile: "irregulier",
  bivouac: "oui_pleinement",
  sante: ["aucun"],
  certificat: "oui_recent",
  faune: "respecte_consignes",
  motivation: "explorer_respect",
  discipline: "respecte_consignes",
  materiel: "equipe",
  acceptCertificat: true,
  acceptBriefing: true,
};

describe("segmentExplorer", () => {
  it("valide un profil pleinement compatible", () => {
    expect(segmentExplorer(base).compatibilite).toBe("compatible");
  });

  it("réoriente les signaux explicites des sources", () => {
    expect(
      segmentExplorer({ ...base, capaciteMarche: "moins_10" }).compatibilite,
    ).toBe("reorienter");
    expect(
      segmentExplorer({ ...base, bivouac: "besoin_confort" }).compatibilite,
    ).toBe("reorienter");
    expect(
      segmentExplorer({ ...base, faune: "pas_exposition" }).compatibilite,
    ).toBe("reorienter");
  });

  it("marque « à évaluer » les profils intermédiaires", () => {
    expect(
      segmentExplorer({ ...base, capaciteMarche: "10_15" }).compatibilite,
    ).toBe("a_evaluer");
    expect(
      segmentExplorer({ ...base, bivouac: "jamais_teste" }).compatibilite,
    ).toBe("a_evaluer");
    expect(
      segmentExplorer({ ...base, certificat: "pas_certain" }).compatibilite,
    ).toBe("a_evaluer");
    expect(
      segmentExplorer({ ...base, faune: "forte_apprehension" }).compatibilite,
    ).toBe("a_evaluer");
  });

  it("la réorientation prime sur l'évaluation", () => {
    expect(
      segmentExplorer({
        ...base,
        capaciteMarche: "moins_10",
        certificat: "pas_certain",
      }).compatibilite,
    ).toBe("reorienter");
  });
});
