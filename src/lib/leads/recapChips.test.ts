import { describe, expect, it } from "vitest";
import { getFunnelConfig } from "@/config/funnels";
import { recapChips } from "./recapChips";

describe("recapChips", () => {
  it("formate le parcours MLR : route · durée · voyageurs · départ", () => {
    expect(
      recapChips(getFunnelConfig("mlr"), {
        route: "ouest",
        offreDuree: "15_jours",
        nbVoyageurs: "2",
        departFenetre: "4_6",
      }),
    ).toEqual(["L'Ouest", "15 jours", "2 voyageurs", "Départ dans 4 à 6 mois"]);
  });

  it("titre court de la Q1 scindée (treks : « Nord : Diego… » → « Nord »)", () => {
    expect(
      recapChips(getFunnelConfig("cvm_treks"), {
        decor: "nord",
        offreDuree: "10_jours",
        nbVoyageurs: "1",
        departFenetre: "10_plus",
      }),
    ).toEqual(["Nord", "10 jours", "1 voyageur", "Départ dans plus de 10 mois"]);
  });

  it("libelle l'effectif « Plus de 4 » et la formule unique du Grand Tour", () => {
    expect(
      recapChips(getFunnelConfig("cvm_un_mois"), {
        objectifMois: "decouverte",
        offreDuree: "un_mois",
        nbVoyageurs: "plus",
        nbVoyageursPrecision: 7,
        departFenetre: "0_2",
      }),
    ).toEqual([
      "Découverte approfondie du pays et immersion culturelle",
      "Environ 1 mois",
      "7 voyageurs environ",
      "Départ dans 0 à 2 mois",
    ]);
  });

  it("retombe sur « Plus de 4 voyageurs » sans effectif saisi", () => {
    expect(
      recapChips(getFunnelConfig("mlr"), { nbVoyageurs: "plus" }),
    ).toEqual(["Plus de 4 voyageurs"]);
  });

  it("omet les valeurs manquantes ou inconnues sans inventer", () => {
    expect(recapChips(getFunnelConfig("mlr"), { route: "sud", nbVoyageurs: "abc" })).toEqual([]);
    expect(recapChips(getFunnelConfig("mlr"), { offreDuree: "12_jours" })).toEqual(["12 jours"]);
  });
});
