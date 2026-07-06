"use client";

import { useQuery } from "@tanstack/react-query";
import { usePublicClient, useChainId } from "wagmi";
import { fetchRegistryPairs, loadCustomPairs } from "@/lib/registry";
import { isMainnet } from "@/lib/config";
import type { TokenPair } from "@/lib/types";

export function useRegistryPairs() {
  const publicClient = usePublicClient();
  const chainId = useChainId();

  return useQuery<TokenPair[]>({
    // Include chainId in the query key so React Query refetches on network switch
    queryKey: ["registry-pairs", chainId],
    queryFn: async () => {
      if (!publicClient) throw new Error("No public client");
      const onchainPairs = await fetchRegistryPairs(publicClient, chainId);
      // Custom/local-dev pairs are Sepolia-only (they are testnet mock addresses)
      const customPairs = isMainnet(chainId) ? [] : loadCustomPairs();
      return [...onchainPairs, ...customPairs];
    },
    enabled: !!publicClient,
    staleTime: 5 * 60 * 1000,
  });
}
