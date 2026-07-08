import { describe, it, expect } from "vitest";
import { isOperationalPair, isDistributeOperationalPair } from "@/lib/pair-utils";
import { basePair } from "./_fixtures";

// These gates decide what a user can actually Shield/Decrypt/Distribute.
// Distribute is intentionally STRICTER than Shield/Decrypt (payroll safety).
describe("isOperationalPair (Shield / Decrypt)", () => {
  it("allows a valid docs-verified registry pair", () => {
    expect(isOperationalPair(basePair())).toBe(true);
  });

  it("allows a valid onchain registry pair even when NOT in the docs allowlist", () => {
    expect(isOperationalPair(basePair({ docsVerified: false }))).toBe(true);
  });

  it("blocks configExample display-only pairs", () => {
    expect(isOperationalPair(basePair({ configOnly: true, isValid: false, integrityStatus: "flagged" }))).toBe(false);
  });

  it("blocks an unverified browser-preview pair, allows a verified one", () => {
    expect(
      isOperationalPair(basePair({ source: "browser-preview", isValid: false, integrityStatus: "flagged", docsVerified: false }))
    ).toBe(false);
    expect(
      isOperationalPair(basePair({ source: "browser-preview", isValid: true, integrityStatus: "verified", docsVerified: false }))
    ).toBe(true);
  });
});

describe("isDistributeOperationalPair (TokenOps payroll — stricter)", () => {
  it("requires docsVerified for onchain registry pairs", () => {
    expect(isDistributeOperationalPair(basePair({ docsVerified: true }))).toBe(true);
    // A non-docs onchain pair is usable in Shield/Decrypt but NOT in Distribute.
    expect(isDistributeOperationalPair(basePair({ docsVerified: false }))).toBe(false);
    expect(isOperationalPair(basePair({ docsVerified: false }))).toBe(true);
  });

  it("blocks configExample pairs from Distribute", () => {
    expect(isDistributeOperationalPair(basePair({ configOnly: true, isValid: false }))).toBe(false);
  });

  it("allows a verified custom/preview pair (verification stands in for docs)", () => {
    expect(
      isDistributeOperationalPair(basePair({ source: "browser-preview", isValid: true, integrityStatus: "verified", docsVerified: false }))
    ).toBe(true);
  });
});
