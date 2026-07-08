import { describe, it, expect } from "vitest";
import { resolveTokenIcon, getMonogramText } from "@/lib/token-icons";

describe("resolveTokenIcon", () => {
  it("resolves a known symbol to its bundled icon", () => {
    const r = resolveTokenIcon("cUSDCMock");
    expect(r).toEqual({ type: "url", url: "/icons/usdc.svg" });
  });

  it("normalizes a literal '(Mock)' marker before lookup", () => {
    // On-chain symbol is "csteakcUSDC (Mock)" — must still resolve to the logo.
    const r = resolveTokenIcon("csteakcUSDC (Mock)");
    expect(r).toEqual({ type: "url", url: "/icons/steakcusdc.svg" });
  });

  it("prefers an explicitly provided iconUrl over the known map", () => {
    const r = resolveTokenIcon("cUSDCMock", "/icons/custom.svg");
    expect(r).toEqual({ type: "url", url: "/icons/custom.svg" });
  });

  it("falls back to a deterministic monogram for an unknown symbol", () => {
    const r = resolveTokenIcon("cWHATEVER");
    expect(r.type).toBe("monogram");
    if (r.type === "monogram") {
      // 'c' prefix stripped, first two letters uppercased.
      expect(r.text).toBe("WH");
      expect(r.colors).toHaveLength(2);
    }
  });

  it("is deterministic — same symbol yields the same monogram color", () => {
    const a = resolveTokenIcon("cWHATEVER");
    const b = resolveTokenIcon("cWHATEVER");
    expect(a).toEqual(b);
  });
});

describe("getMonogramText", () => {
  it("uses the currency glyph for GBP-style tokens", () => {
    expect(getMonogramText("ctGBP")).toBe("£");
    expect(getMonogramText("ctGBPMock")).toBe("£");
  });
});
