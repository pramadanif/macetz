"use client";

import React, { type ReactNode } from "react";
import { WagmiProvider, createConfig, http } from "wagmi";
import { sepolia } from "wagmi/chains";
import { injected } from "wagmi/connectors";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ZamaProvider } from "@zama-fhe/react-sdk";
import { createConfig as createZamaConfig } from "@zama-fhe/react-sdk/wagmi";
import { sepolia as sepoliaFhe, type FheChain } from "@zama-fhe/sdk/chains";
import { web } from "@zama-fhe/sdk/web";
import { RPC_URL, RELAYER_URL } from "@/lib/config";

const wagmiConfig = createConfig({
  chains: [sepolia],
  connectors: [injected()],
  transports: {
    [sepolia.id]: http(RPC_URL),
  },
});

const mySepolia = {
  ...sepoliaFhe,
  relayerUrl: RELAYER_URL,
} as const satisfies FheChain;

const zamaConfig = createZamaConfig({
  chains: [mySepolia],
  wagmiConfig,
  relayers: { [mySepolia.id]: web() },
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 30_000,
    },
  },
});

export function Web3Provider({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <ZamaProvider config={zamaConfig}>
          {children}
        </ZamaProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
