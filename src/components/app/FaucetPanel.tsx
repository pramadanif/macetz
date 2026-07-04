"use client";

import React, { useState } from "react";
import { useAccount, usePublicClient } from "wagmi";
import { formatUnits } from "viem";
import { useRegistryPairs } from "@/hooks/useRegistryPairs";
import { useFaucet } from "@/hooks/useFaucet";
import { useQuery } from "@tanstack/react-query";
import { ERC20_ABI } from "@/lib/abis";
import { FAUCET_MINT_CAP } from "@/lib/config";
import { TokenIcon } from "@/components/app/TokenIcon";
import { AlertMessage } from "@/components/app/AlertMessage";
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

  const successMessage = txHash ? (
    <>
      Minted {FAUCET_MINT_CAP.toString()} {selectedPair?.erc20Symbol ?? "tokens"}.{" "}
      <a
        href={`https://sepolia.etherscan.io/tx/${txHash}`}
        target="_blank"
        rel="noopener noreferrer"
        className="underline font-medium hover:text-green-900"
      >
        View on Etherscan
      </a>
    </>
  ) : null;

  return (
    <div className="max-w-lg mx-auto">
      <div className="emboss-card p-6 sm:p-8 space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">Testnet Faucet</h2>
          <p className="text-[15px] text-gray-500 mt-2 leading-relaxed">
            Claim free mock tokens to try the full shield and unshield flow.
          </p>
        </div>

        <div className="relative z-10">
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-6">
            {mockPairs.map((pair) => (
              <button
                key={pair.erc20Address}
                onClick={() => setSelectedPair(pair)}
                className={`flex flex-col items-center gap-2 p-3 rounded-xl transition-all duration-200 ${
                  selectedPair?.erc20Address === pair.erc20Address
                    ? "bg-[#F5C518]/10 border border-[#F5C518]/30 shadow-sm"
                    : "bg-white/50 border border-white/60 hover:bg-white/80"
                }`}
              >
                <TokenIcon symbol={pair.erc20Symbol} size={32} />
                <span className="text-[11px] font-medium text-gray-700 leading-tight text-center">
                  {pair.erc20Symbol}
                </span>
              </button>
            ))}
          </div>

          {selectedPair && balance !== undefined && (
            <div className="mb-5 p-3.5 glass-panel rounded-xl">
              <div className="relative z-10 flex justify-between items-center text-sm">
                <span className="text-gray-500">Current {selectedPair.erc20Symbol} balance</span>
                <span className="font-mono font-semibold text-[#16171C]">
                  {formatUnits(balance, selectedPair.erc20Decimals)}
                </span>
              </div>
            </div>
          )}

          {successMessage && (
            <div className="mb-5">
              <AlertMessage type="success" title="Success" message={successMessage} />
            </div>
          )}

          {error && (
            <div className="mb-5">
              <AlertMessage type="error" title="Minting Failed" message={error} />
            </div>
          )}

          <button
            onClick={handleMint}
            disabled={!selectedPair || isPending}
            className="w-full bg-[#16171C] hover:bg-black text-white font-semibold py-3.5 rounded-xl transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-lg"
          >
            {isPending ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Minting...
              </span>
            ) : (
              `Mint ${FAUCET_MINT_CAP.toString()} ${selectedPair?.erc20Symbol ?? "Tokens"}`
            )}
          </button>

          <p className="text-[11px] text-gray-400 mt-3 text-center">
            Only mock tokens have a public faucet. Official tokens like ctGBP have restricted minting.
          </p>
        </div>
      </div>
    </div>
  );
}
