import { describe, expect, it } from "vitest";
import {
  createDraft,
  decodeDraft,
  DRAFT_TTL_MS,
  draftKey,
  encodeDraft,
  type LeadDraft,
} from "./leadDraft";

const NOW = 1_700_000_000_000;

describe("draftKey", () => {
  it("compose la clé funnel + route", () => {
    expect(draftKey("mlr", "nord")).toBe("funnel-draft:mlr:nord");
    expect(draftKey("mlr", "ouest")).toBe("funnel-draft:mlr:ouest");
  });

  it("route absente = suffixe vide (distinct d'une route pré-remplie)", () => {
    expect(draftKey("cvm_explorer")).toBe("funnel-draft:cvm_explorer:");
    expect(draftKey("mlr")).not.toBe(draftKey("mlr", "nord"));
  });
});

describe("encode/decode", () => {
  it("aller-retour fidèle d'un brouillon frais", () => {
    const draft = createDraft(
      2,
      { terrain: "jungles", offreDuree: "12", nbVoyageurs: "1" },
      { utm_source: "meta", utm_medium: "paid_social" },
      NOW,
    );
    expect(decodeDraft(encodeDraft(draft), NOW)).toEqual(draft);
  });

  it("préserve utm null", () => {
    const draft = createDraft(0, { route: "nord" }, null, NOW);
    const decoded = decodeDraft(encodeDraft(draft), NOW);
    expect(decoded?.utm).toBeNull();
    expect(decoded?.values).toEqual({ route: "nord" });
  });
});

describe("decodeDraft — garde-fous", () => {
  it("entrée absente → null", () => {
    expect(decodeDraft(null, NOW)).toBeNull();
  });

  it("JSON corrompu → null (jamais d'exception)", () => {
    expect(decodeDraft("{not json", NOW)).toBeNull();
    expect(decodeDraft("42", NOW)).toBeNull();
    expect(decodeDraft("null", NOW)).toBeNull();
  });

  it("version inconnue → null", () => {
    const raw = JSON.stringify({
      v: 99,
      savedAt: NOW,
      screenIndex: 1,
      values: {},
      utm: null,
    });
    expect(decodeDraft(raw, NOW)).toBeNull();
  });

  it("champs mal typés → null", () => {
    const base = { v: 1, savedAt: NOW, screenIndex: 1, values: {}, utm: null };
    expect(decodeDraft(JSON.stringify({ ...base, savedAt: "x" }), NOW)).toBeNull();
    expect(decodeDraft(JSON.stringify({ ...base, screenIndex: "x" }), NOW)).toBeNull();
    expect(decodeDraft(JSON.stringify({ ...base, values: null }), NOW)).toBeNull();
  });
});

describe("decodeDraft — expiration (TTL)", () => {
  const draft: LeadDraft = createDraft(1, { terrain: "canyons" }, null, NOW);
  const raw = encodeDraft(draft);

  it("dans la fenêtre → restauré", () => {
    expect(decodeDraft(raw, NOW + DRAFT_TTL_MS - 1)).toEqual(draft);
  });

  it("pile à la limite → encore valide", () => {
    expect(decodeDraft(raw, NOW + DRAFT_TTL_MS)).toEqual(draft);
  });

  it("au-delà du TTL → null", () => {
    expect(decodeDraft(raw, NOW + DRAFT_TTL_MS + 1)).toBeNull();
  });
});
