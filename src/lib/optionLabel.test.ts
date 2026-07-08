import { describe, expect, it } from "vitest";
import { splitOptionLabel } from "./optionLabel";

describe("splitOptionLabel", () => {
  it("scinde sur les deux-points typographiques", () => {
    expect(
      splitOptionLabel(
        "Nord : Diego, reliefs puissants, îles et extension Nosy Be possible",
      ),
    ).toEqual({
      title: "Nord",
      description: "Diego, reliefs puissants, îles et extension Nosy Be possible",
    });
  });

  it("scinde sur le tiret cadratin entouré d'espaces", () => {
    expect(splitOptionLabel("Autre projet — je précise")).toEqual({
      title: "Autre projet",
      description: "je précise",
    });
  });

  it("coupe au premier séparateur rencontré quand les deux existent", () => {
    expect(
      splitOptionLabel("Sud : Makay, canyons — fin de parcours plage"),
    ).toEqual({
      title: "Sud",
      description: "Makay, canyons — fin de parcours plage",
    });
  });

  it("laisse intact un libellé sans séparateur", () => {
    expect(splitOptionLabel("Nous sommes 4 ou plus")).toEqual({
      title: "Nous sommes 4 ou plus",
    });
  });

  it("ne scinde pas si la suite du séparateur est vide", () => {
    expect(splitOptionLabel("Titre orphelin — ")).toEqual({
      title: "Titre orphelin — ",
    });
  });
});
