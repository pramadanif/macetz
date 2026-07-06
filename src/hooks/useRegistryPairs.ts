"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { usePublicClient, useChainId } from "wagmi";
import {
  fetchRegistryPairs,
  loadCustomPairs,
  mapCustomEntryToPair,
} from "@/lib/registry";
import { enrichLocalDevPair } from "@/lib/pair-utils";
import { loadPreviewPairs } from "@/lib/preview-pairs";
import type { TokenPair } from "@/lib/types";

export function useRegistryPairs() {
  const publicClient = usePublicClient();
  const chainId = useChainId();
  const queryClient = useQueryClient();

  return useQuery<TokenPair[]>({
    queryKey: ["registry-pairs", chainId],
    queryFn: async () => {
      if (!publicClient) throw new Error("No public client");
      const onchainPairs = await fetchRegistryPairs(publicClient, chainId);
      const customPairs = loadCustomPairs(chainId);
      const previewPairs = loadPreviewPairs(chainId).map((entry) =>
        mapCustomEntryToPair(entry, "browser-preview")
      );

      const seen = new Set<string>();
      const merged: TokenPair[] = [];
      for (const pair of [...onchainPairs, ...customPairs, ...previewPairs]) {
        const key = pair.erc7984Address.toLowerCase();
        if (seen.has(key)) continue;
        seen.add(key);
        merged.push(pair);
      }

      return Promise.all(
        merged.map((pair) => enrichLocalDevPair(publicClient, pair))
      );
    },
    enabled: !!publicClient,
    staleTime: 5 * 60 * 1000,
  });
}

/** Invalidate registry list after adding a browser preview pair. */
export function useInvalidateRegistryPairs() {
  const queryClient = useQueryClient();
  const chainId = useChainId();
  return () =>
    queryClient.invalidateQueries({ queryKey: ["registry-pairs", chainId] });
}
