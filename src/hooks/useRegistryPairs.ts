"use client";

import { useQuery } from "@tanstack/react-query";
import { usePublicClient } from "wagmi";
import { fetchRegistryPairs, loadCustomPairs } from "@/lib/registry";
import type { TokenPair } from "@/lib/types";

export function useRegistryPairs() {
  const publicClient = usePublicClient();

  return useQuery<TokenPair[]>({
    queryKey: ["registry-pairs"],
    queryFn: async () => {
      if (!publicClient) throw new Error("No public client");
      const onchainPairs = await fetchRegistryPairs(publicClient);
      const customPairs = loadCustomPairs();
      return [...onchainPairs, ...customPairs];
    },
    enabled: !!publicClient,
    staleTime: 5 * 60 * 1000,
  });
}
