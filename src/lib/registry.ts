import { type PublicClient, getAddress } from "viem";
import {
  getRegistryAddress,
  getOfficialAddresses,
  KNOWN_MOCK_PAIRS,
  MAINNET_KNOWN_PAIRS,
  isMainnet,
} from "./config";
import { REGISTRY_ABI, ERC20_ABI } from "./abis";
import type { TokenPair, CustomPairsConfig, CustomPairEntry, IntegrityStatus } from "./types";
import customPairsJson from "../../config/custom-pairs.json";

interface RawRegistryPair {
  tokenAddress: `0x${string}`;
  confidentialTokenAddress: `0x${string}`;
  isValid: boolean;
}

interface TokenMetadata {
  name: string;
  symbol: string;
  decimals: number;
  unreadable: boolean;
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
): Promise<TokenMetadata> {
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
      unreadable: false,
    };
  } catch {
    return { name: "Unknown", symbol: "???", decimals: 0, unreadable: true };
  }
}

// ─── Integrity Checker ────────────────────────────────────────────────────────

type PairBeforeIntegrity = Omit<TokenPair, "integrityStatus" | "integrityReason">;

/**
 * Checks a list of pairs for anomalies and annotates each with an integrity status.
 *
 * Rules:
 * 1. Duplicate detection — an "official + Mock" pair on the same base symbol is EXPECTED
 *    (e.g., ctGBP + ctGBPMock). Only flags if two non-Mock-distinguishable entries share
 *    the same base symbol pointing to different contract addresses.
 * 2. Wrapper decimals must be ≤ 6 (Zama ERC-7984 spec) — skipped when metadata is unreadable.
 * 3. Underlying token address must not be the zero address.
 * 4. Unreadable on-chain metadata is flagged explicitly (not as a false decimals violation).
 */
export function runIntegrityChecks(pairs: PairBeforeIntegrity[]): TokenPair[] {
  const baseSymbolMap = new Map<string, PairBeforeIntegrity[]>();
  for (const pair of pairs) {
    const base = pair.erc7984Symbol.replace(/Mock$/, "");
    if (!baseSymbolMap.has(base)) baseSymbolMap.set(base, []);
    baseSymbolMap.get(base)!.push(pair);
  }

  return pairs.map((pair): TokenPair => {
    const reasons: string[] = [];
    const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

    if (pair.metadataUnreadable) {
      reasons.push("Token metadata unreadable on this network");
    }

    if (pair.erc20Address.toLowerCase() === ZERO_ADDRESS) {
      reasons.push("Underlying token address is the zero address");
    }

    if (!pair.metadataUnreadable && pair.erc7984Decimals > 6) {
      reasons.push(
        `Wrapper has ${pair.erc7984Decimals} decimals (expected ≤ 6 per ERC-7984 spec)`
      );
    }

    const base = pair.erc7984Symbol.replace(/Mock$/, "");
    const siblings = baseSymbolMap.get(base) ?? [];
    if (siblings.length > 1) {
      const hasMock = siblings.some((s) =>
        s.erc7984Symbol.toLowerCase().endsWith("mock")
      );
      const hasOfficial = siblings.some(
        (s) => !s.erc7984Symbol.toLowerCase().endsWith("mock")
      );
      const isExplainableByMockSplit = hasMock && hasOfficial;

      if (!isExplainableByMockSplit) {
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

/** Merge onchain, custom, and preview pairs — onchain wins on duplicate erc7984 address. */
export function mergeRegistryPairs(
  onchainPairs: TokenPair[],
  customPairs: TokenPair[],
  previewPairs: TokenPair[]
): TokenPair[] {
  const seen = new Set<string>();
  const merged: TokenPair[] = [];
  for (const pair of [...onchainPairs, ...customPairs, ...previewPairs]) {
    const key = pair.erc7984Address.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    merged.push(pair);
  }
  return merged;
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

  const validPairs = rawPairs.filter((p) => p.isValid);

  const pairs: PairBeforeIntegrity[] = await Promise.all(
    validPairs.map(async (raw) => {
      const [erc20Meta, erc7984Meta] = await Promise.all([
        fetchTokenMetadata(client, raw.tokenAddress),
        fetchTokenMetadata(client, raw.confidentialTokenAddress),
      ]);

      const metadataUnreadable = erc20Meta.unreadable || erc7984Meta.unreadable;
      const wrapperInDocs = officialAddresses.has(
        raw.confidentialTokenAddress.toLowerCase()
      );

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
        docsVerified: wrapperInDocs,
        metadataUnreadable,
      };
    })
  );

  return runIntegrityChecks(pairs);
}

/** Map a config or preview entry into a registry TokenPair row. */
export function mapCustomEntryToPair(
  entry: CustomPairEntry,
  source: "local-dev" | "browser-preview"
): TokenPair {
  const baseSymbol = entry.symbol.replace(/^c/, "");
  const configOnly = entry.configExample === true;
  return {
    erc20Address: getAddress(entry.erc20),
    erc7984Address: getAddress(entry.erc7984),
    erc20Symbol: baseSymbol,
    erc20Name: `${baseSymbol} (${source === "local-dev" ? "Dev" : "Preview"})`,
    erc20Decimals: entry.decimals,
    erc7984Symbol: entry.symbol,
    erc7984Name: `${entry.symbol} (${source === "local-dev" ? "Dev Pair" : "Preview Pair"})`,
    erc7984Decimals: Math.min(entry.decimals, 6),
    source,
    isMock: true,
    configOnly,
    docsVerified: false,
    isValid: false,
    integrityStatus: "flagged",
    integrityReason: configOnly
      ? "Registry display only — example config entry."
      : "Pending on-chain verification on the connected network.",
  };
}

export function loadCustomPairs(chainId: number): TokenPair[] {
  const config = customPairsJson as CustomPairsConfig;
  const entries = config[String(chainId)] ?? [];
  return entries.map((entry) => mapCustomEntryToPair(entry, "local-dev"));
}
