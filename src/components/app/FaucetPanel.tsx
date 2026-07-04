"use client";

import React, { useState } from "react";
import { useAccount, usePublicClient } from "wagmi";
import { formatUnits } from "viem";
import { useRegistryPairs } from "@/hooks/useRegistryPairs";
import { useFaucet } from "@/hooks/useFaucet";
import { useQuery } from "@tanstack/react-query";
import { ERC20_ABI } from "@/lib/abis";
import { FAUCET_MINT_CAP } from "@/lib/config";
import { CoinPlaceholder } from "@/components/CoinPlaceholder";
import type { TokenPair } from "@/lib/types";

export function FaucetPanel() {
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const { data: pairs } = useRegistryPairs();
  const { mint, isPending, error, txHash } = useFaucet();
  const [selectedPair, setSelectedPair] = useState<TokenPair | null>(null);

  const mockPairs = pairs?.filter((p) => p.isMock && p.source === "registry") ?? [];

  const { data: balance, refetch: refetchBalance } = useQuery({
    queryKey: ["erc20-balance-faucet", selectedPair?.erc20Address, address],
    queryFn: async () => {
      if (!publicClient || !selectedPair || !address) return 0n;
      return publicClient.readContract({
        address: selectedPair.erc20Address,
        abi: ERC20_ABI,
        functionName: "balanceOf",
        args: [address],
      }) as Promise<bigint>;
    },
    enabled: !!publicClient && !!selectedPair && !!address,
    refetchInterval: 10_000,
  });

  const handleMint = async () => {
    if (!selectedPair) return;
    await mint(selectedPair.erc20Address, selectedPair.erc20Decimals);
    refetchBalance();
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Testnet Faucet</h2>
        <p className="text-sm text-gray-500 mt-1">
          Claim mock test tokens on Sepolia. Each mint gives you{" "}
          <span className="font-mono font-medium text-gray-700">{FAUCET_MINT_CAP.toString()}</span>{" "}
          tokens to try the wrap/unwrap flow.
        </p>
      </div>

      <div className="emboss-card rounded-3xl p-8">
        <div className="relative z-10">
          {/* Token grid for quick selection */}
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-8">
            {mockPairs.map((pair) => (
              <button
                key={pair.erc20Address}
                onClick={() => setSelectedPair(pair)}
                className={`flex flex-col items-center gap-2 p-3 rounded-xl transition-all duration-200 ${
                  selectedPair?.erc20Address === pair.erc20Address
                    ? "bg-gradient-to-br from-[#F5C518]/20 to-[#FFD64A]/10 border-2 border-[#F5C518]/50 shadow-md"
                    : "bg-white/50 border border-white/60 hover:bg-white/80 hover:shadow-sm"
                }`}
              >
                <CoinPlaceholder type="gold" size="sm" className="w-8 h-8" />
                <span className="text-[11px] font-medium text-gray-700 leading-tight text-center">
                  {pair.erc20Symbol}
                </span>
              </button>
            ))}
          </div>

          {selectedPair && balance !== undefined && (
            <div className="mb-6 p-4 glass-panel rounded-xl">
              <div className="relative z-10 flex justify-between items-center text-sm">
                <span className="text-gray-500">Current {selectedPair.erc20Symbol} balance</span>
                <span className="font-mono font-semibold text-[#16171C]">
                  {formatUnits(balance, selectedPair.erc20Decimals)}
                </span>
              </div>
            </div>
          )}

          {/* Status messages */}
          {txHash && (
            <div className="mb-6 p-4 rounded-xl text-sm bg-green-50/80 text-green-700 border border-green-200/60 backdrop-blur-sm">
              Minted {FAUCET_MINT_CAP.toString()} {selectedPair?.erc20Symbol ?? "tokens"} successfully!{" "}
              <a
                href={`https://sepolia.etherscan.io/tx/${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="underline font-medium hover:text-green-900"
              >
                View on Etherscan →
              </a>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 rounded-xl text-sm bg-red-50/80 text-red-700 border border-red-200/60 backdrop-blur-sm">
              {error}
            </div>
          )}

          <button
            onClick={handleMint}
            disabled={!selectedPair || isPending}
            className="w-full bg-gradient-to-r from-[#F5C518] to-[#FFD64A] hover:from-[#d4a600] hover:to-[#F5C518] text-[#16171C] font-semibold py-4 rounded-xl transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-[0_8px_24px_rgba(245,197,24,0.3)] hover:-translate-y-0.5"
          >
            {isPending ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-[#16171C]/30 border-t-[#16171C] rounded-full animate-spin" />
                Minting...
              </span>
            ) : (
              `Mint ${FAUCET_MINT_CAP.toString()} ${selectedPair?.erc20Symbol ?? "Tokens"}`
            )}
          </button>

          <p className="text-[11px] text-gray-400 mt-3 text-center leading-relaxed">
            Only mock tokens (cUSDCMock, cUSDTMock, etc.) have a public faucet.
            Official tokens like ctGBP have restricted minting.
          </p>
        </div>
      </div>
    </div>
  );
}
