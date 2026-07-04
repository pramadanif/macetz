import { type PublicClient } from "viem";
import { REGISTRY_ADDRESS, KNOWN_MOCK_PAIRS } from "./config";
import { REGISTRY_ABI, ERC20_ABI } from "./abis";
import type { TokenPair, CustomPairsConfig } from "./types";
import customPairsJson from "../../config/custom-pairs.json";

interface RawRegistryPair {
  tokenAddress: `0x${string}`;
  confidentialTokenAddress: `0x${string}`;
  isValid: boolean;
}

function isMockWrapper(address: `0x${string}`): boolean {
  return KNOWN_MOCK_PAIRS.some(
    (p) => p.wrapper.toLowerCase() === address.toLowerCase() && p.isMock
  );
}

async function fetchTokenMetadata(
  client: PublicClient,
  address: `0x${string}`
): Promise<{ name: string; symbol: string; decimals: number }> {
  try {
    const [name, symbol, decimals] = await Promise.all([
      client.readContract({
        address,
        abi: ERC20_ABI,
        functionName: "name",
      }),
      client.readContract({
        address,
        abi: ERC20_ABI,
        functionName: "symbol",
      }),
      client.readContract({
        address,
        abi: ERC20_ABI,
        functionName: "decimals",
      }),
    ]);
    return { name: name as string, symbol: symbol as string, decimals: Number(decimals) };
  } catch {
    return { name: "Unknown", symbol: "???", decimals: 18 };
  }
}

export async function fetchRegistryPairs(
  client: PublicClient
): Promise<TokenPair[]> {
  const rawPairs = (await client.readContract({
    address: REGISTRY_ADDRESS,
    abi: REGISTRY_ABI,
    functionName: "getTokenConfidentialTokenPairs",
  })) as RawRegistryPair[];

  const validPairs = rawPairs.filter((p) => p.isValid);

  const pairs: TokenPair[] = await Promise.all(
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
        isMock: isMockWrapper(raw.confidentialTokenAddress),
        isValid: true,
      };
    })
  );

  return pairs;
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
  }));
}
