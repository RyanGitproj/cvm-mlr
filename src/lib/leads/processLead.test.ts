import { describe, expect, it } from "vitest";
import { processLead } from "./processLead";

/** Parcours MLR complet tel que soumis par le wizard (contact + réponses). */
const parcoursMlr = {
  nom: "Rakoto",
  email: "riane@example.com",
  telephone: "+33612345678",
  consentement: true,
  route: "nord",
  offreDuree: "15_jours",
  departFenetre: "4_6",
  nbVoyageurs: "2",
  comprehension: true,
};

describe("processLead — mlr", () => {
  it("ne garde en answers que la fenêtre de départ et la compréhension", () => {
    const result = processLead("mlr", parcoursMlr);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.data).toEqual({ departFenetre: "4_6", comprehension: true });
  });

  it("calcule la recommendation fenêtre (départ 4-6 mois → proche)", () => {
    const result = processLead("mlr", parcoursMlr);
    if (!result.ok) throw new Error("parcours attendu valide");
    expect(result.recommendation?.fenetre).toBe("proche");
    expect(typeof result.recommendation?.libelle).toBe("string");
  });

  it("rejette une fenêtre de départ inconnue", () => {
    const result = processLead("mlr", { ...parcoursMlr, departFenetre: "demain" });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.departFenetre).toBeDefined();
  });
});

describe("processLead — cvm", () => {
  it("treks : answers = décor + fenêtre (voyageurs en colonne), reco fenêtre", () => {
    const result = processLead("cvm_treks", {
      decor: "ouest",
      departFenetre: "10_plus",
      nbVoyageurs: "2",
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.data).toEqual({ decor: "ouest", departFenetre: "10_plus" });
    expect(result.recommendation?.fenetre).toBe("lointain");
  });

  it("orientation : la reco porte la fenêtre ET l'univers recommandé", () => {
    const result = processLead("cvm_orientation", {
      intention: "iles",
      departFenetre: "0_2",
      nbVoyageurs: "2",
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.recommendation?.fenetre).toBe("proche");
    expect(result.recommendation?.href).toBe("/cvm/iles");
  });

  it("explorer : les acceptations réglementaires sont exigées et stockées", () => {
    const sans = processLead("cvm_explorer", {
      terrain: "canyons",
      departFenetre: "2_4",
      nbVoyageurs: "1",
    });
    expect(sans.ok).toBe(false);

    const avec = processLead("cvm_explorer", {
      terrain: "canyons",
      departFenetre: "2_4",
      nbVoyageurs: "1",
      acceptCertificat: true,
      acceptBriefing: true,
    });
    expect(avec.ok).toBe(true);
    if (!avec.ok) return;
    expect(avec.data.acceptCertificat).toBe(true);
  });

  it("rejette une qualification incomplète", () => {
    const result = processLead("cvm_un_mois", { objectifMois: "decouverte" });
    expect(result.ok).toBe(false);
  });
});
