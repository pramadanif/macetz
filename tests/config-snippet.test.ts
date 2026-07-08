import { describe, it, expect } from "vitest";
import { buildConfigSnippet } from "@/lib/preview-pairs";
import { SEPOLIA_CHAIN_ID, MAINNET_CHAIN_ID } from "@/lib/config";
import type { CustomPairEntry } from "@/lib/types";

// The Admin UI's "Copy Config Snippet" must emit valid JSON that a user can
// paste straight into config/custom-pairs.json for a permanent pair.
const entry: CustomPairEntry = {
  erc20: "0x022D67AeE3a5f841CC0c422F0B849B366f2c59B7",
  erc7984: "0x3A1E3F5a8C5975078C587C73E80A916505538C4B",
  symbol: "cMTUSD",
  decimals: 18,
  source: "local-dev",
};

describe("buildConfigSnippet", () => {
  for (const chainId of [SEPOLIA_CHAIN_ID, MAINNET_CHAIN_ID]) {
    it(`produces valid JSON keyed by chainId ${chainId}`, () => {
      const snippet = buildConfigSnippet(chainId, entry);
      const parsed = JSON.parse(snippet) as Record<string, CustomPairEntry[]>;

      // Keyed by the string chain id, exactly matching the custom-pairs.json schema.
      const key = String(chainId);
      expect(Object.keys(parsed)).toEqual([key]);
      expect(parsed[key]).toHaveLength(1);

      const out = parsed[key]![0]!;
      expect(out.erc20).toBe(entry.erc20);
      expect(out.erc7984).toBe(entry.erc7984);
      expect(out.symbol).toBe(entry.symbol);
      expect(out.decimals).toBe(entry.decimals);
      expect(out.source).toBe("local-dev");
    });
  }

  it("pretty-prints (2-space indent) so the pasted config stays readable", () => {
    const snippet = buildConfigSnippet(SEPOLIA_CHAIN_ID, entry);
    expect(snippet).toContain("\n  ");
  });
});
