"use client";

import { useEffect, useState, type ReactNode } from "react";
import { WagmiProvider, createConfig, http } from "wagmi";
import { sepolia, mainnet } from "wagmi/chains";
import { injected } from "wagmi/connectors";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ZamaProvider } from "@zama-fhe/react-sdk";
import { createConfig as createZamaConfig } from "@zama-fhe/react-sdk/wagmi";
import { sepolia as sepoliaFhe, mainnet as mainnetFhe, type FheChain } from "@zama-fhe/sdk/chains";
import { web } from "@zama-fhe/sdk/web";
import {
  RPC_URL,
  MAINNET_RPC_URL,
  getRelayerUrl,
  SEPOLIA_CHAIN_ID,
  MAINNET_CHAIN_ID,
} from "@/lib/config";

/**
 * Full wagmi config — supports both Sepolia and Ethereum mainnet.
 * Used for WagmiProvider (wallet connection, read-only calls on both chains).
 */
const wagmiConfig = createConfig({
  chains: [sepolia, mainnet],
  connectors: [injected()],
  transports: {
    [sepolia.id]: http(RPC_URL),
    [mainnet.id]: http(MAINNET_RPC_URL),
  },
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 30_000,
    },
  },
});

type ZamaConfig = ReturnType<typeof createZamaConfig>;

/** Survives dev HMR remounts — avoids re-init + startup flash on every save. */
let zamaCache: ZamaConfig | "failed" | null = null;

function buildZamaConfig(origin?: string): ZamaConfig {
  const mySepolia = {
    ...sepoliaFhe,
    relayerUrl: getRelayerUrl(SEPOLIA_CHAIN_ID, origin),
  } as const satisfies FheChain;

  const myMainnet = {
    ...mainnetFhe,
    relayerUrl: getRelayerUrl(MAINNET_CHAIN_ID, origin),
  } as const satisfies FheChain;

  return createZamaConfig({
    chains: [mySepolia, myMainnet],
    wagmiConfig,
    relayers: {
      [mySepolia.id]: web(),
      [myMainnet.id]: web(),
    },
  });
}

function resolveZamaInit(): { config: ZamaConfig | null; failed: boolean } {
  if (typeof window === "undefined") {
    return { config: null, failed: false };
  }
  if (zamaCache === "failed") {
    return { config: null, failed: true };
  }
  if (zamaCache) {
    return { config: zamaCache, failed: false };
  }
  try {
    const origin = typeof window !== "undefined" ? window.location.origin : undefined;
    zamaCache = buildZamaConfig(origin);
    return { config: zamaCache, failed: false };
  } catch (err) {
    console.error("[Macetz] FHE relayer init failed, running in browse-only mode:", err);
    zamaCache = "failed";
    return { config: null, failed: true };
  }
}

export function Web3Provider({ children }: { children: ReactNode }) {
  const [zamaInit, setZamaInit] = useState<{ config: ZamaConfig | null; failed: boolean }>({
    config: null,
    failed: false,
  });

  useEffect(() => {
    setZamaInit(resolveZamaInit());
  }, []);

  const inner =
    zamaInit.config ? (
      <ZamaProvider config={zamaInit.config}>{children}</ZamaProvider>
    ) : (
      children
    );

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>{inner}</QueryClientProvider>
    </WagmiProvider>
  );
}
