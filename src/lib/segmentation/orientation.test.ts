import { describe, expect, it } from "vitest";
import { ORIENTATION_UNIVERS } from "@/config/segmentation";
import { segmentOrientation } from "./orientation";

describe("segmentOrientation", () => {
  it("chaque intention explicite désigne son univers (libellé + lien)", () => {
    for (const univers of ["explorer", "treks", "iles", "un_mois"] as const) {
      const reco = segmentOrientation({
        intention: univers,
        departFenetre: "4_6",
      });
      expect(reco.univers).toBe(univers);
      expect(reco.universLibelle).toBe(ORIENTATION_UNIVERS[univers].libelle);
      expect(reco.href).toBe(ORIENTATION_UNIVERS[univers].href);
    }
  });

  it("porte toujours la fenêtre de départ commune", () => {
    const reco = segmentOrientation({ intention: "treks", departFenetre: "10_plus" });
    expect(reco.fenetre).toBe("lointain");
    expect(typeof reco.libelle).toBe("string");
  });
});
