import { describe, expect, it } from "vitest";
import { EMPTY_QUALIF } from "@/types/lead";
import { toLeadRow } from "./toLeadRow";

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
  moisDepart: "Novembre 2026",
  optinNewsletter: false,
};

describe("toLeadRow", () => {
  it("mappe le contact vers des colonnes indépendantes (snake_case)", () => {
    const row = toLeadRow(
      "cvm_treks",
      { ...parcoursCvm, offreDuree: "10_jours" },
      null,
      EMPTY_QUALIF,
    );
    expect(row.nom).toBe("Rakoto");
    expect(row.prenom).toBe("Riane");
    expect(row.email).toBe("riane@example.com");
    expect(row.telephone).toBe("+33612345678");
    expect(row.nb_voyageurs).toBe(2);
    expect(row.consentement).toBe(true);
  });

  it("laisse à null ce que le parcours n'a pas demandé (anciens leads)", () => {
    const row = toLeadRow(
      "cvm_treks",
      { ...parcoursCvm, offreDuree: "10_jours" },
      null,
      EMPTY_QUALIF,
    );
    expect(row.periode).toBeNull();
    expect(row.commentaire).toBeNull();
    expect(row.optin_newsletter).toBeNull();
    expect(row.route).toBeNull();
  });

  it("fusionne le fragment de qualification dans la ligne", () => {
    const row = toLeadRow(
      "cvm_treks",
      { ...parcoursCvm, offreDuree: "10_jours" },
      null,
      {
        ...EMPTY_QUALIF,
        projection: "ouest",
        depart_fenetre: "4_6",
        reco_fenetre: "proche",
      },
    );
    expect(row.projection).toBe("ouest");
    expect(row.depart_fenetre).toBe("4_6");
    expect(row.reco_fenetre).toBe("proche");
  });

  it("stocke l'effectif approximatif quand « Plus de 4 » est choisi", () => {
    const row = toLeadRow(
      "cvm_treks",
      { ...parcoursCvm, offreDuree: "10_jours", nbVoyageurs: "plus", nbVoyageursPrecision: 8 },
      null,
      EMPTY_QUALIF,
    );
    expect(row.nb_voyageurs).toBe(8);
  });

  it("mappe la newsletter cochée (les 2 marques la proposent)", () => {
    const row = toLeadRow(
      "cvm_treks",
      { ...parcoursCvm, offreDuree: "10_jours", optinNewsletter: true },
      null,
      EMPTY_QUALIF,
    );
    expect(row.optin_newsletter).toBe(true);
  });

  it("résout l'offre CVM en libellé/durée/prix", () => {
    const row = toLeadRow(
      "cvm_treks",
      { ...parcoursCvm, offreDuree: "15_jours" },
      null,
      EMPTY_QUALIF,
    );
    expect(row.offre_ref).toBe("15_jours");
    expect(row.offre_duree).toBe(15);
    expect(row.offre_prix_indicatif).toBe(2500);
  });

  it("résout la formule unique du Grand Tour (durée : 30 jours)", () => {
    const row = toLeadRow(
      "cvm_un_mois",
      { ...parcoursCvm, offreDuree: "un_mois" },
      null,
      EMPTY_QUALIF,
    );
    expect(row.offre_ref).toBe("un_mois");
    expect(row.offre_duree).toBe(30);
    expect(row.offre_prix_indicatif).toBe(5300);
  });

  it("laisse l'offre nulle pour l'orientation (aiguillage sans produit)", () => {
    const row = toLeadRow("cvm_orientation", parcoursCvm, null, EMPTY_QUALIF);
    expect(row.offre_ref).toBeNull();
    expect(row.offre_prix_indicatif).toBeNull();
    expect(row.catalogue_offre_id).toBeNull();
  });

  it("relie chaque offre CVM à sa ligne du catalogue (FK automatisation aval)", () => {
    const cases: [Parameters<typeof toLeadRow>[0], string, number][] = [
      ["cvm_explorer", "12_jours", 1],
      ["cvm_explorer", "15_jours", 2],
      ["cvm_treks", "10_jours", 4],
      ["cvm_treks", "15_jours", 5],
      ["cvm_iles", "10_jours", 6],
      ["cvm_iles", "15_jours", 7],
      ["cvm_un_mois", "un_mois", 8],
    ];
    for (const [funnelType, offreDuree, id] of cases) {
      const row = toLeadRow(
        funnelType,
        { ...parcoursCvm, offreDuree },
        null,
        EMPTY_QUALIF,
      );
      expect(row.catalogue_offre_id).toBe(id);
    }
  });

  it("relie les offres MLR à leur ligne catalogue par route × durée", () => {
    const cases: [string, string, number][] = [
      ["nord", "10_jours", 9],
      ["nord", "15_jours", 10],
      ["ouest", "10_jours", 11],
      ["ouest", "15_jours", 12],
    ];
    for (const [route, offreDuree, id] of cases) {
      const row = toLeadRow(
        "mlr",
        { ...parcoursMlr, route, offreDuree },
        null,
        EMPTY_QUALIF,
      );
      expect(row.catalogue_offre_id).toBe(id);
    }
  });

  it("laisse la FK catalogue nulle si la route MLR manque (cas défensif)", () => {
    const row = toLeadRow(
      "mlr",
      { ...parcoursMlr, route: undefined },
      null,
      EMPTY_QUALIF,
    );
    expect(row.catalogue_offre_id).toBeNull();
  });

  it("mappe le wizard MLR : voyageurs « 3 » → 3, mois de départ → periode, newsletter décochée ≠ null", () => {
    const row = toLeadRow("mlr", parcoursMlr, null, EMPTY_QUALIF);
    expect(row.brand).toBe("mlr");
    expect(row.nb_voyageurs).toBe(3);
    expect(row.periode).toBe("Novembre 2026");
    expect(row.optin_newsletter).toBe(false);
    expect(row.route).toBe("ouest");
    expect(row.offre_ref).toBe("10_jours");
    expect(row.offre_duree).toBe(10);
    expect(row.offre_prix_indicatif).toBe(1400);
  });

  it("garde une periode null quand le mois de départ n'est pas renseigné", () => {
    const row = toLeadRow(
      "mlr",
      { ...parcoursMlr, moisDepart: undefined },
      null,
      EMPTY_QUALIF,
    );
    expect(row.periode).toBeNull();
  });

  it("dérive la marque du funnel_type", () => {
    expect(toLeadRow("cvm_treks", parcoursCvm, null, EMPTY_QUALIF).brand).toBe("cvm");
    expect(toLeadRow("mlr", parcoursMlr, null, EMPTY_QUALIF).brand).toBe("mlr");
  });

  it("aplatit l'UTM en colonnes, null si absent", () => {
    const row = toLeadRow(
      "cvm_treks",
      { ...parcoursCvm, offreDuree: "10_jours" },
      { utm_source: "meta", referrer: "https://exemple.com" },
      EMPTY_QUALIF,
    );
    expect(row.utm_source).toBe("meta");
    expect(row.referrer).toBe("https://exemple.com");
    expect(row.utm_medium).toBeNull();
  });
});
