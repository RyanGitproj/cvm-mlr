import { describe, expect, it } from "vitest";
import { toLeadInfoRow } from "./toLeadInfoRow";

/** Parcours CVM (gabarit 4 étapes) : coordonnées épurées + Q4 voyageurs. */
const parcoursCvm = {
  nom: "Rakoto",
  prenom: "Riane",
  email: "riane@example.com",
  telephone: "+33612345678",
  consentement: true,
  nbVoyageurs: "2",
  departFenetre: "4_6",
};

const parcoursMlr = {
  nom: "Rakoto",
  prenom: "Riane",
  email: "riane@example.com",
  telephone: "+33612345678",
  consentement: true,
  route: "ouest",
  offreDuree: "10_jours",
  departFenetre: "2_4",
  nbVoyageurs: "3",
  comprehension: true,
  moisDepart: "Novembre 2026",
  optinNewsletter: false,
};

describe("toLeadInfoRow", () => {
  it("mappe le contact vers des colonnes indépendantes (snake_case)", () => {
    const row = toLeadInfoRow("cvm_treks", { ...parcoursCvm, offreDuree: "10_jours" }, null);
    expect(row.nom).toBe("Rakoto");
    expect(row.prenom).toBe("Riane");
    expect(row.email).toBe("riane@example.com");
    expect(row.telephone).toBe("+33612345678");
    expect(row.nb_voyageurs).toBe(2);
    expect(row.consentement).toBe(true);
  });

  it("laisse à null ce que le parcours n'a pas demandé (anciens leads)", () => {
    const row = toLeadInfoRow("cvm_treks", { ...parcoursCvm, offreDuree: "10_jours" }, null);
    expect(row.periode).toBeNull();
    expect(row.commentaire).toBeNull();
    expect(row.optin_newsletter).toBeNull();
    expect(row.route).toBeNull();
  });

  it("stocke l'effectif approximatif quand « Plus de 4 » est choisi", () => {
    const row = toLeadInfoRow(
      "cvm_treks",
      { ...parcoursCvm, offreDuree: "10_jours", nbVoyageurs: "plus", nbVoyageursPrecision: 8 },
      null,
    );
    expect(row.nb_voyageurs).toBe(8);
  });

  it("mappe la newsletter cochée (les 2 marques la proposent)", () => {
    const row = toLeadInfoRow(
      "cvm_treks",
      { ...parcoursCvm, offreDuree: "10_jours", optinNewsletter: true },
      null,
    );
    expect(row.optin_newsletter).toBe(true);
  });

  it("résout l'offre CVM en libellé/durée/prix", () => {
    const row = toLeadInfoRow("cvm_treks", { ...parcoursCvm, offreDuree: "15_jours" }, null);
    expect(row.offre_ref).toBe("15_jours");
    expect(row.offre_duree).toBe("15 jours");
    expect(row.offre_prix_indicatif).toBe(2500);
  });

  it("résout la formule unique du Grand Tour", () => {
    const row = toLeadInfoRow("cvm_un_mois", { ...parcoursCvm, offreDuree: "un_mois" }, null);
    expect(row.offre_ref).toBe("un_mois");
    expect(row.offre_prix_indicatif).toBe(5300);
  });

  it("laisse l'offre nulle pour l'orientation (aiguillage sans produit)", () => {
    const row = toLeadInfoRow("cvm_orientation", parcoursCvm, null);
    expect(row.offre_ref).toBeNull();
    expect(row.offre_prix_indicatif).toBeNull();
  });

  it("mappe le wizard MLR : voyageurs « 3 » → 3, mois de départ → periode, newsletter décochée ≠ null", () => {
    const row = toLeadInfoRow("mlr", parcoursMlr, null);
    expect(row.brand).toBe("mlr");
    expect(row.nb_voyageurs).toBe(3);
    expect(row.periode).toBe("Novembre 2026");
    expect(row.optin_newsletter).toBe(false);
    expect(row.route).toBe("ouest");
    expect(row.offre_ref).toBe("10_jours");
    expect(row.offre_duree).toContain("10 jours");
    expect(row.offre_prix_indicatif).toBe(1400);
  });

  it("garde une periode null quand le mois de départ n'est pas renseigné", () => {
    const row = toLeadInfoRow("mlr", { ...parcoursMlr, moisDepart: undefined }, null);
    expect(row.periode).toBeNull();
  });

  it("dérive la marque du funnel_type", () => {
    expect(toLeadInfoRow("cvm_treks", parcoursCvm, null).brand).toBe("cvm");
    expect(toLeadInfoRow("mlr", parcoursMlr, null).brand).toBe("mlr");
  });

  it("aplatit l'UTM en colonnes, null si absent", () => {
    const row = toLeadInfoRow("cvm_treks", { ...parcoursCvm, offreDuree: "10_jours" }, {
      utm_source: "meta",
      referrer: "https://exemple.com",
    });
    expect(row.utm_source).toBe("meta");
    expect(row.referrer).toBe("https://exemple.com");
    expect(row.utm_medium).toBeNull();
  });
});
