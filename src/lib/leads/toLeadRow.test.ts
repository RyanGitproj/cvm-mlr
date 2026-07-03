import { describe, expect, it } from "vitest";
import { toLeadRow } from "./toLeadRow";

const data = {
  prenom: "Riane",
  email: "riane@example.com",
  telephone: "0341234567",
  periode: "Octobre 2026",
  nbVoyageurs: 2,
  consentement: true,
  commentaire: undefined,
  budget: "2200_2500",
  kmParJour: "8_12",
  kmParJourPrecision: undefined,
};

describe("toLeadRow", () => {
  it("répartit les clés communes et spécifiques", () => {
    const row = toLeadRow("cvm_treks", data, null, null);
    expect(row.common_fields).toEqual({
      prenom: "Riane",
      email: "riane@example.com",
      telephone: "0341234567",
      periode: "Octobre 2026",
      nbVoyageurs: 2,
      consentement: true,
    });
    expect(row.specific_fields).toEqual({
      budget: "2200_2500",
      kmParJour: "8_12",
    });
  });

  it("supprime les valeurs undefined (champs optionnels non remplis)", () => {
    const row = toLeadRow("cvm_treks", data, null, null);
    expect("commentaire" in row.common_fields).toBe(false);
    expect("kmParJourPrecision" in row.specific_fields).toBe(false);
  });

  it("dérive la marque du funnel_type", () => {
    expect(toLeadRow("cvm_treks", data, null, null).brand).toBe("cvm");
    expect(toLeadRow("mlr", data, null, null).brand).toBe("mlr");
  });

  it("transmet recommandation et UTM tels quels", () => {
    const reco = { niveau: "intermediaire" };
    const utm = { utm_source: "meta", referrer: "https://exemple.com" };
    const row = toLeadRow("cvm_treks", data, reco, utm);
    expect(row.recommendation).toEqual(reco);
    expect(row.utm).toEqual(utm);
  });
});
