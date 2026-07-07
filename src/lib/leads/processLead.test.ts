import { describe, expect, it } from "vitest";
import { EMPTY_QUALIF } from "@/types/lead";
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
  it("projette fenêtre + compréhension en colonnes (projection null : la Q1 MLR est la route)", () => {
    const result = processLead("mlr", parcoursMlr);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.qualif).toEqual({
      ...EMPTY_QUALIF,
      depart_fenetre: "4_6",
      comprehension: true,
      reco_fenetre: "proche",
    });
  });

  it("calcule la recommendation fenêtre (départ 4-6 mois → proche)", () => {
    const result = processLead("mlr", parcoursMlr);
    if (!result.ok) throw new Error("parcours attendu valide");
    expect(result.recommendation.fenetre).toBe("proche");
    expect(typeof result.recommendation.libelle).toBe("string");
  });

  it("rejette une fenêtre de départ inconnue", () => {
    const result = processLead("mlr", { ...parcoursMlr, departFenetre: "demain" });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.departFenetre).toBeDefined();
  });
});

describe("processLead — cvm", () => {
  it("treks : projection = décor, fenêtre en colonne, reco fenêtre", () => {
    const result = processLead("cvm_treks", {
      decor: "ouest",
      departFenetre: "10_plus",
      nbVoyageurs: "2",
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.qualif).toEqual({
      ...EMPTY_QUALIF,
      projection: "ouest",
      depart_fenetre: "10_plus",
      reco_fenetre: "lointain",
    });
    expect(result.recommendation.fenetre).toBe("lointain");
  });

  it("orientation : projection et reco_univers = intention, la reco porte fenêtre ET univers", () => {
    const result = processLead("cvm_orientation", {
      intention: "iles",
      departFenetre: "0_2",
      nbVoyageurs: "2",
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.qualif.projection).toBe("iles");
    expect(result.qualif.reco_univers).toBe("iles");
    expect(result.qualif.reco_fenetre).toBe("proche");
    expect(result.recommendation.fenetre).toBe("proche");
    expect(result.recommendation.href).toBe("/cvm/iles");
  });

  it("explorer : projection = terrain, sans acceptation réglementaire", () => {
    const result = processLead("cvm_explorer", {
      terrain: "canyons",
      departFenetre: "2_4",
      nbVoyageurs: "1",
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.qualif.projection).toBe("canyons");
  });

  it("stocke la précision seulement quand « autre » est retenue", () => {
    const commun = {
      departFenetre: "2_4",
      nbVoyageurs: "1",
      terrainPrecision: "les tsingy",
    };
    const autre = processLead("cvm_explorer", { ...commun, terrain: "autre" });
    if (!autre.ok) throw new Error("parcours attendu valide");
    expect(autre.qualif.projection_precision).toBe("les tsingy");

    // Texte saisi puis option fermée re-choisie : la précision ne va pas en base.
    const ferme = processLead("cvm_explorer", { ...commun, terrain: "canyons" });
    if (!ferme.ok) throw new Error("parcours attendu valide");
    expect(ferme.qualif.projection_precision).toBeNull();
  });

  it("rejette une qualification incomplète", () => {
    const result = processLead("cvm_un_mois", { objectifMois: "decouverte" });
    expect(result.ok).toBe(false);
  });
});
