import { describe, it, expect } from "vitest";
import { runIntegrityChecks } from "@/lib/registry";
import { beforeIntegrity } from "./_fixtures";

// The integrity checker is the "auto-flag anomalies" feature. These tests lock
// in the exact rules so a regression can't silently start (or stop) flagging.
describe("runIntegrityChecks", () => {
  it("passes a clean, spec-compliant pair", () => {
    const [pair] = runIntegrityChecks([beforeIntegrity()]);
    expect(pair?.integrityStatus).toBe("verified");
    expect(pair?.integrityReason).toBeUndefined();
  });

  it("flags a wrapper with more than 6 decimals (ERC-7984 spec)", () => {
    const [pair] = runIntegrityChecks([beforeIntegrity({ erc7984Decimals: 18 })]);
    expect(pair?.integrityStatus).toBe("flagged");
    expect(pair?.integrityReason).toContain("decimals");
  });

  it("flags a zero underlying address", () => {
    const [pair] = runIntegrityChecks([
      beforeIntegrity({ erc20Address: "0x0000000000000000000000000000000000000000" }),
    ]);
    expect(pair?.integrityStatus).toBe("flagged");
    expect(pair?.integrityReason).toContain("zero address");
  });

  it("does NOT flag the legitimate official + Mock split (ctGBP / ctGBPMock)", () => {
    const result = runIntegrityChecks([
      beforeIntegrity({
        erc7984Address: "0x167DC962808B32CFFFc7e14B5018c0bE06A3A208",
        erc7984Symbol: "ctGBP",
        isMock: false,
      }),
      beforeIntegrity({
        erc7984Address: "0xfCE5c7069c5525eF6c8C2b2E35A745bA20a2F7CC",
        erc7984Symbol: "ctGBPMock",
        isMock: true,
      }),
    ]);
    expect(result.every((p) => p.integrityStatus === "verified")).toBe(true);
  });

  it("DOES flag a genuine duplicate: two non-Mock entries on the same base symbol", () => {
    // Fabricated bad data — two different addresses both claiming "cEVIL",
    // neither is a Mock variant, so the official/Mock exception does not apply.
    const result = runIntegrityChecks([
      beforeIntegrity({
        erc7984Address: "0x1111111111111111111111111111111111111111",
        erc7984Symbol: "cEVIL",
        isMock: false,
      }),
      beforeIntegrity({
        erc7984Address: "0x2222222222222222222222222222222222222222",
        erc7984Symbol: "cEVIL",
        isMock: false,
      }),
    ]);
    expect(result.every((p) => p.integrityStatus === "flagged")).toBe(true);
    expect(result[0]?.integrityReason).toContain("Duplicate symbol");
  });

  it("flags unreadable metadata explicitly, not as a false decimals violation", () => {
    const [pair] = runIntegrityChecks([
      beforeIntegrity({ metadataUnreadable: true, erc7984Decimals: 18 }),
    ]);
    expect(pair?.integrityStatus).toBe("flagged");
    expect(pair?.integrityReason).toContain("metadata unreadable");
    expect(pair?.integrityReason).not.toContain("decimals");
  });
});
