import { type PublicClient } from "viem";
import {
  getRegistryAddress,
  getOfficialAddresses,
  KNOWN_MOCK_PAIRS,
  MAINNET_KNOWN_PAIRS,
  MAINNET_CHAIN_ID,
  isMainnet,
} from "./config";
import { REGISTRY_ABI, ERC20_ABI } from "./abis";
import type { TokenPair, CustomPairsConfig, IntegrityStatus } from "./types";
import customPairsJson from "../../config/custom-pairs.json";

interface RawRegistryPair {
  tokenAddress: `0x${string}`;
  confidentialTokenAddress: `0x${string}`;
  isValid: boolean;
}

/** Returns true if the wrapper address is a known Mock variant (testnet-only). */
function isMockWrapper(address: `0x${string}`, chainId: number): boolean {
  const pairs = isMainnet(chainId) ? MAINNET_KNOWN_PAIRS : KNOWN_MOCK_PAIRS;
  return pairs.some(
    (p) => p.wrapper.toLowerCase() === address.toLowerCase() && p.isMock
  );
}

async function fetchTokenMetadata(
  client: PublicClient,
  address: `0x${string}`
): Promise<{ name: string; symbol: string; decimals: number }> {
  try {
    const [name, symbol, decimals] = await Promise.all([
      client.readContract({ address, abi: ERC20_ABI, functionName: "name" }),
      client.readContract({ address, abi: ERC20_ABI, functionName: "symbol" }),
      client.readContract({ address, abi: ERC20_ABI, functionName: "decimals" }),
    ]);
    return {
      name: name as string,
      symbol: symbol as string,
      decimals: Number(decimals),
    };
  } catch {
    return { name: "Unknown", symbol: "???", decimals: 18 };
  }
}

// ─── Integrity Checker ────────────────────────────────────────────────────────

/**
 * Checks a list of pairs for anomalies and annotates each with an integrity status.
 *
 * Rules:
 * 1. Duplicate detection — an "official + Mock" pair on the same base symbol is EXPECTED
 *    (e.g., ctGBP + ctGBPMock). Only flags if two non-Mock-distinguishable entries share
 *    the same base symbol pointing to different contract addresses.
 * 2. Wrapper decimals must be ≤ 6 (Zama ERC-7984 spec).
 * 3. Underlying token address must not be the zero address.
 * 4. isValid must be true (already filtered upstream, but double-checked here for visibility).
 */
export function runIntegrityChecks(pairs: Omit<TokenPair, "integrityStatus" | "integrityReason">[]): TokenPair[] {
  // Build a map: baseSymbol → list of pairs sharing that base (after stripping Mock suffix)
  const baseSymbolMap = new Map<string, typeof pairs>();
  for (const pair of pairs) {
    const base = pair.erc7984Symbol.replace(/Mock$/, "");
    if (!baseSymbolMap.has(base)) baseSymbolMap.set(base, []);
    baseSymbolMap.get(base)!.push(pair);
  }

  return pairs.map((pair): TokenPair => {
    const reasons: string[] = [];
    const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

    // Check 1: Zero address on underlying
    if (pair.erc20Address.toLowerCase() === ZERO_ADDRESS) {
      reasons.push("Underlying token address is the zero address");
    }

    // Check 2: Wrapper decimals must be ≤ 6
    if (pair.erc7984Decimals > 6) {
      reasons.push(
        `Wrapper has ${pair.erc7984Decimals} decimals (expected ≤ 6 per ERC-7984 spec)`
      );
    }

    // Check 3: Duplicate detection — only flag if NOT explainable by official/Mock split
    const base = pair.erc7984Symbol.replace(/Mock$/, "");
    const siblings = baseSymbolMap.get(base) ?? [];
    if (siblings.length > 1) {
      // Check if all siblings are distinguishable by the official/Mock pattern
      const hasMock = siblings.some((s) =>
        s.erc7984Symbol.toLowerCase().endsWith("mock")
      );
      const hasOfficial = siblings.some(
        (s) => !s.erc7984Symbol.toLowerCase().endsWith("mock")
      );
      const isExplainableByMockSplit = hasMock && hasOfficial;

      if (!isExplainableByMockSplit) {
        // Multiple entries that are NOT the official/Mock split — genuinely suspicious
        const addresses = siblings.map((s) => s.erc7984Address).join(", ");
        reasons.push(
          `Duplicate symbol "${base}" detected across ${siblings.length} entries: ${addresses}`
        );
      }
    }

    const integrityStatus: IntegrityStatus = reasons.length > 0 ? "flagged" : "verified";
    return {
      ...pair,
      integrityStatus,
      integrityReason: reasons.length > 0 ? reasons.join("; ") : undefined,
    };
  });
}

// ─── Registry Fetcher ─────────────────────────────────────────────────────────

export async function fetchRegistryPairs(
  client: PublicClient,
  chainId: number
): Promise<TokenPair[]> {
  const registryAddress = getRegistryAddress(chainId);
  const officialAddresses = getOfficialAddresses(chainId);

  const rawPairs = (await client.readContract({
    address: registryAddress,
    abi: REGISTRY_ABI,
    functionName: "getTokenConfidentialTokenPairs",
  })) as RawRegistryPair[];

  // Only surface wrappers that appear in Zama's official docs table for this chain.
  const validPairs = rawPairs.filter(
    (p) =>
      p.isValid &&
      officialAddresses.has(p.confidentialTokenAddress.toLowerCase())
  );

  const pairs: Omit<TokenPair, "integrityStatus" | "integrityReason">[] =
    await Promise.all(
      validPairs.map(async (raw) => {
        const [erc20Meta, erc7984Meta] = await Promise.all([
          fetchTokenMetadata(client, raw.tokenAddress),
          fetchTokenMetadata(client, raw.confidentialTokenAddress),
        ]);

        return {
          erc20Address: raw.tokenAddress,
          erc7984Address: raw.confidentialTokenAddress,
          erc20Symbol: erc20Meta.symbol,
          erc20Name: erc20Meta.name,
          erc20Decimals: erc20Meta.decimals,
          erc7984Symbol: erc7984Meta.symbol,
          erc7984Name: erc7984Meta.name,
          erc7984Decimals: erc7984Meta.decimals,
          source: "registry" as const,
          isMock: isMockWrapper(raw.confidentialTokenAddress, chainId),
          isValid: true,
        };
      })
    );

  // Run integrity checks on all fetched pairs
  return runIntegrityChecks(pairs);
}

export function loadCustomPairs(): TokenPair[] {
  const config = customPairsJson as CustomPairsConfig;
  return config.pairs.map((entry) => ({
    erc20Address: entry.erc20 as `0x${string}`,
    erc7984Address: entry.erc7984 as `0x${string}`,
    erc20Symbol: entry.symbol.replace(/^c/, ""),
    erc20Name: `${entry.symbol.replace(/^c/, "")} (Dev)`,
    erc20Decimals: entry.decimals,
    erc7984Symbol: entry.symbol,
    erc7984Name: `${entry.symbol} (Dev Pair)`,
    erc7984Decimals: Math.min(entry.decimals, 6),
    source: "local-dev" as const,
    isMock: true,
    isValid: true,
    // Local dev pairs are always considered verified (user-configured)
    integrityStatus: "verified" as const,
  }));
}
