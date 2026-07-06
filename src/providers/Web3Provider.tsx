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

export function Web3Provider({ children }: { children: ReactNode }) {
  const [zamaConfig, setZamaConfig] = useState<ReturnType<
    typeof createZamaConfig
  > | null>(null);
  const [zamaFailed, setZamaFailed] = useState(false);

  useEffect(() => {
    try {
      const mySepolia = {
        ...sepoliaFhe,
        relayerUrl: getRelayerUrl(SEPOLIA_CHAIN_ID),
      } as const satisfies FheChain;

      const myMainnet = {
        ...mainnetFhe,
        relayerUrl: getRelayerUrl(MAINNET_CHAIN_ID),
      } as const satisfies FheChain;

      // Must use the same wagmiConfig as WagmiProvider — Zama's signer reads
      // getConnection(wagmiConfig); a separate config never receives the connect().
      const config = createZamaConfig({
        chains: [mySepolia, myMainnet],
        wagmiConfig,
        relayers: {
          [mySepolia.id]: web(),
          [myMainnet.id]: web(),
        },
      });
      setZamaConfig(config);
    } catch (err) {
      // Zama SDK failed to initialize (e.g., chain mismatch).
      // Fall back to no-FHE mode — registry browse and EIP-712 decrypt still work.
      console.error("[Macetz] FHE relayer init failed, running in browse-only mode:", err);
      setZamaFailed(true);
    }
  }, []);

  const isReady = zamaConfig !== null || zamaFailed;

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        {!isReady ? (
          // Brief initialization splash — should resolve within ~100ms
          <div className="min-h-screen flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-2 border-gray-200 border-t-[#16171C] rounded-full animate-spin" />
              <p className="text-[13px] text-gray-400 font-medium">Starting up...</p>
            </div>
          </div>
        ) : zamaConfig ? (
          <ZamaProvider config={zamaConfig}>{children}</ZamaProvider>
        ) : (
          // FHE unavailable — render without ZamaProvider (browse + decrypt still work via wagmi)
          <>{children}</>
        )}
      </QueryClientProvider>
    </WagmiProvider>
  );
}
