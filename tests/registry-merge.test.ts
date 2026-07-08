import { describe, it, expect } from "vitest";
import type { PublicClient } from "viem";
import {
  mergeRegistryPairs,
  loadCustomPairs,
  fetchRegistryPairs,
} from "@/lib/registry";
import { SEPOLIA_CHAIN_ID, MAINNET_CHAIN_ID } from "@/lib/config";
import { basePair } from "./_fixtures";

describe("mergeRegistryPairs (hybrid sourcing)", () => {
  it("keeps onchain over custom when both share a wrapper address", () => {
    const shared = "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa" as `0x${string}`;
    const onchain = basePair({ erc7984Address: shared, erc7984Symbol: "cONCHAIN" });
    const custom = basePair({ erc7984Address: shared, erc7984Symbol: "cCUSTOM", source: "local-dev" });

    const merged = mergeRegistryPairs([onchain], [custom], []);
    expect(merged).toHaveLength(1);
    expect(merged[0]?.erc7984Symbol).toBe("cONCHAIN");
  });

  it("deduplicates case-insensitively by wrapper address", () => {
    const lower = "0xabcabcabcabcabcabcabcabcabcabcabcabcabca" as `0x${string}`;
    const upper = "0xABCABCABCABCABCABCABCABCABCABCABCABCABCA" as `0x${string}`;
    const merged = mergeRegistryPairs(
      [basePair({ erc7984Address: lower })],
      [basePair({ erc7984Address: upper, source: "local-dev" })],
      []
    );
    expect(merged).toHaveLength(1);
  });

  it("preserves precedence order: onchain, then custom, then preview", () => {
    const merged = mergeRegistryPairs(
      [basePair({ erc7984Address: "0x1111111111111111111111111111111111111111", erc7984Symbol: "cON" })],
      [basePair({ erc7984Address: "0x2222222222222222222222222222222222222222", erc7984Symbol: "cCU", source: "local-dev" })],
      [basePair({ erc7984Address: "0x3333333333333333333333333333333333333333", erc7984Symbol: "cPR", source: "browser-preview" })]
    );
    expect(merged.map((p) => p.erc7984Symbol)).toEqual(["cON", "cCU", "cPR"]);
  });
});

describe("loadCustomPairs (network-scoped local config)", () => {
  it("returns entries only for the requested chain and never crashes on an unknown chain", () => {
    const sepolia = loadCustomPairs(SEPOLIA_CHAIN_ID);
    const unknown = loadCustomPairs(999999);
    expect(Array.isArray(sepolia)).toBe(true);
    expect(unknown).toEqual([]);
    // Every loaded pair is tagged as local-dev and never as an onchain registry pair.
    expect(sepolia.every((p) => p.source === "local-dev")).toBe(true);
  });

  it("marks seeded configExample entries as configOnly (display-only, non-operational)", () => {
    const sepolia = loadCustomPairs(SEPOLIA_CHAIN_ID);
    const examples = sepolia.filter((p) => p.configOnly);
    // The repo ships cDEMO examples; if present they must be flagged display-only.
    for (const ex of examples) {
      expect(ex.isValid).toBe(false);
      expect(ex.integrityStatus).toBe("flagged");
    }
  });
});

describe("fetchRegistryPairs (isValid filtering + integrity on real fetch path)", () => {
  // Minimal fake PublicClient — dispatches readContract by function name so we
  // exercise the real fetch/merge/integrity code without touching the network.
  function fakeClient(raw: unknown[], meta: Record<string, { name: string; symbol: string; decimals: number }>): PublicClient {
    return {
      readContract: async ({ address, functionName }: { address?: string; functionName: string }) => {
        if (functionName === "getTokenConfidentialTokenPairs") return raw;
        const m = meta[String(address).toLowerCase()];
        if (functionName === "name") return m?.name ?? "Unknown";
        if (functionName === "symbol") return m?.symbol ?? "???";
        if (functionName === "decimals") return m?.decimals ?? 0;
        return undefined;
      },
    } as unknown as PublicClient;
  }

  const ERC20_A = "0x9b5Cd13b8eFbB58Dc25A05CF411D8056058aDFfF";
  const WRAP_OK = "0x7c5BF43B851c1dff1a4feE8dB225b87f2C223639";
  const ERC20_B = "0x00000000000000000000000000000000000000B0";
  const WRAP_INVALID = "0x000000000000000000000000000000000000dEaD";
  const ERC20_C = "0x00000000000000000000000000000000000000C0";
  const WRAP_BADDEC = "0x000000000000000000000000000000000000BEEF";

  it("drops isValid:false pairs and runs integrity on the survivors", async () => {
    const raw = [
      { tokenAddress: ERC20_A, confidentialTokenAddress: WRAP_OK, isValid: true },
      { tokenAddress: ERC20_B, confidentialTokenAddress: WRAP_INVALID, isValid: false },
      { tokenAddress: ERC20_C, confidentialTokenAddress: WRAP_BADDEC, isValid: true },
    ];
    const meta = {
      [ERC20_A.toLowerCase()]: { name: "USD Coin", symbol: "USDC", decimals: 6 },
      [WRAP_OK.toLowerCase()]: { name: "cUSDC", symbol: "cUSDCMock", decimals: 6 },
      [ERC20_C.toLowerCase()]: { name: "Bad Token", symbol: "BAD", decimals: 18 },
      [WRAP_BADDEC.toLowerCase()]: { name: "cBad", symbol: "cBAD", decimals: 18 },
    };

    const pairs = await fetchRegistryPairs(fakeClient(raw, meta), SEPOLIA_CHAIN_ID);

    // The invalid pair is gone; only the two valid ones remain.
    expect(pairs).toHaveLength(2);
    expect(pairs.some((p) => p.erc7984Address.toLowerCase() === WRAP_INVALID.toLowerCase())).toBe(false);

    // The clean pair verifies; the 18-decimal pair is flagged by the integrity pass.
    const ok = pairs.find((p) => p.erc7984Symbol === "cUSDCMock");
    const bad = pairs.find((p) => p.erc7984Symbol === "cBAD");
    expect(ok?.integrityStatus).toBe("verified");
    expect(bad?.integrityStatus).toBe("flagged");
  });

  it("accepts the mainnet chain id without throwing (network-aware address resolution)", async () => {
    const pairs = await fetchRegistryPairs(fakeClient([], {}), MAINNET_CHAIN_ID);
    expect(pairs).toEqual([]);
  });
});
