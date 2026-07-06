import { describe, expect, it } from "vitest";
import { toLeadStep1Row } from "./toLeadStep1Row";

const contact = {
  nom: "Rakoto",
  prenom: "Riane",
  email: "riane@example.com",
  telephone: "+33612345678",
  periode: "Octobre 2026",
  nbVoyageurs: 2,
  consentement: true,
  commentaire: undefined,
};

describe("toLeadStep1Row", () => {
  it("mappe le contact vers des colonnes indépendantes (snake_case)", () => {
    const row = toLeadStep1Row("cvm_treks", { ...contact, offreDuree: "10_jours" }, null);
    expect(row.nom).toBe("Rakoto");
    expect(row.prenom).toBe("Riane");
    expect(row.email).toBe("riane@example.com");
    expect(row.telephone).toBe("+33612345678");
    expect(row.nb_voyageurs).toBe(2);
    expect(row.periode).toBe("Octobre 2026");
    expect(row.consentement).toBe(true);
  });

  it("normalise les optionnels vides en null", () => {
    const row = toLeadStep1Row("cvm_treks", { ...contact, offreDuree: "10_jours" }, null);
    expect(row.commentaire).toBeNull();
  });

  it("résout l'offre CVM en libellé/durée/prix", () => {
    const row = toLeadStep1Row("cvm_treks", { ...contact, offreDuree: "15_jours" }, null);
    expect(row.offre_ref).toBe("15_jours");
    expect(row.offre_duree).toBe("15 jours");
    expect(row.offre_prix_indicatif).toBe(2500);
  });

  it("résout l'offre MLR (prix indicatif « dès ») et la route", () => {
    const row = toLeadStep1Row(
      "mlr",
      { ...contact, offreDuree: "10_jours", route: "sud" },
      null,
    );
    expect(row.brand).toBe("mlr");
    expect(row.offre_ref).toBe("10_jours");
    expect(row.offre_prix_indicatif).toBe(1400);
    expect(row.route).toBe("sud");
  });

  it("applique la formule unique un-mois sans champ offre", () => {
    const row = toLeadStep1Row("cvm_un_mois", contact, null);
    expect(row.offre_ref).toBe("un_mois");
    expect(row.offre_prix_indicatif).toBe(5300);
  });

  it("laisse l'offre nulle pour l'orientation", () => {
    const row = toLeadStep1Row("cvm_orientation", contact, null);
    expect(row.offre_ref).toBeNull();
    expect(row.offre_prix_indicatif).toBeNull();
    expect(row.route).toBeNull();
  });

  it("dérive la marque du funnel_type", () => {
    expect(toLeadStep1Row("cvm_treks", contact, null).brand).toBe("cvm");
    expect(toLeadStep1Row("mlr", contact, null).brand).toBe("mlr");
  });

  it("aplatit l'UTM en colonnes, null si absent", () => {
    const row = toLeadStep1Row("cvm_treks", { ...contact, offreDuree: "10_jours" }, {
      utm_source: "meta",
      referrer: "https://exemple.com",
    });
    expect(row.utm_source).toBe("meta");
    expect(row.referrer).toBe("https://exemple.com");
    expect(row.utm_medium).toBeNull();
  });
});
