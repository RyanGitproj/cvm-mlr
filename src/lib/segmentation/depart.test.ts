import { describe, expect, it } from "vitest";
import { FENETRES } from "@/config/segmentation";
import { DEPART_FENETRES, type DepartFenetre } from "@/lib/validations/common";
import { fenetreFor, segmentDepart } from "./depart";

const FENETRE_ATTENDUE: Record<DepartFenetre, keyof typeof FENETRES> = {
  "0_2": "proche",
  "2_4": "proche",
  "4_6": "proche",
  "6_10": "construction",
  "10_plus": "lointain",
};

describe("fenetreFor", () => {
  it("agrège chaque tranche de départ vers sa fenêtre", () => {
    for (const depart of DEPART_FENETRES) {
      expect(fenetreFor(depart)).toBe(FENETRE_ATTENDUE[depart]);
    }
  });
});

describe("segmentDepart", () => {
  it("retourne la fenêtre et son libellé pour chaque tranche", () => {
    for (const depart of DEPART_FENETRES) {
      const reco = segmentDepart({ departFenetre: depart });
      expect(reco.fenetre).toBe(FENETRE_ATTENDUE[depart]);
      expect(reco.libelle).toBe(FENETRES[FENETRE_ATTENDUE[depart]]);
    }
  });

  it("un départ dans 0-6 mois recommande la fenêtre « proche » (rendez-vous)", () => {
    expect(segmentDepart({ departFenetre: "4_6" }).fenetre).toBe("proche");
    expect(segmentDepart({ departFenetre: "6_10" }).fenetre).not.toBe("proche");
  });
});
