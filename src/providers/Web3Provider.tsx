"use client";

import { useEffect, useState, type ReactNode } from "react";
import { WagmiProvider, createConfig, http } from "wagmi";
import { sepolia } from "wagmi/chains";
import { injected } from "wagmi/connectors";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ZamaProvider } from "@zama-fhe/react-sdk";
import { createConfig as createZamaConfig } from "@zama-fhe/react-sdk/wagmi";
import { sepolia as sepoliaFhe, type FheChain } from "@zama-fhe/sdk/chains";
import { web } from "@zama-fhe/sdk/web";
import { RPC_URL, getRelayerUrl } from "@/lib/config";

const wagmiConfig = createConfig({
  chains: [sepolia],
  connectors: [injected()],
  transports: {
    [sepolia.id]: http(RPC_URL),
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

export function Web3Provider({ children }: { children: ReactNode }) {
  const [zamaConfig, setZamaConfig] = useState<ReturnType<
    typeof createZamaConfig
  > | null>(null);

  useEffect(() => {
    const relayerUrl = getRelayerUrl();
    const mySepolia = { ...sepoliaFhe, relayerUrl } as const satisfies FheChain;
    setZamaConfig(
      createZamaConfig({
        chains: [mySepolia],
        wagmiConfig,
        relayers: { [mySepolia.id]: web() },
      }),
    );
  }, []);

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        {zamaConfig ? (
          <ZamaProvider config={zamaConfig}>{children}</ZamaProvider>
        ) : (
          <div className="min-h-screen flex items-center justify-center text-sm text-gray-500">
            Initializing FHE relayer...
          </div>
        )}
      </QueryClientProvider>
    </WagmiProvider>
  );
}
