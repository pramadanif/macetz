"use client";

import React, { useState } from "react";
import { useAccount, usePublicClient, useChainId } from "wagmi";
import { formatUnits } from "viem";
import { useRegistryPairs } from "@/hooks/useRegistryPairs";
import { useFaucet } from "@/hooks/useFaucet";
import { useQuery } from "@tanstack/react-query";
import { ERC20_ABI } from "@/lib/abis";
import { FAUCET_MINT_CAP } from "@/lib/config";
import { formatWalletError } from "@/lib/errors";
import { TokenIcon } from "@/components/app/TokenIcon";
import { AlertMessage } from "@/components/app/AlertMessage";
import { TxLink } from "@/components/app/TxLink";
import type { TokenPair } from "@/lib/types";

export function FaucetPanel() {
  const { address } = useAccount();
  const chainId = useChainId();
  const publicClient = usePublicClient();
  const { data: pairs, isLoading: isLoadingPairs } = useRegistryPairs();
  const { mint, isPending, error } = useFaucet();
  const [selectedPair, setSelectedPair] = useState<TokenPair | null>(null);
  const [mintAllProgress, setMintAllProgress] = useState<{
    current: number;
    total: number;
    symbol: string;
  } | null>(null);
  const [mintAllError, setMintAllError] = useState<string | null>(null);
  /** Completed mints (single mint or Mint All) — each links to its Etherscan tx. */
  const [mintResults, setMintResults] = useState<
    { symbol: string; hash: `0x${string}` }[]
  >([]);

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
    setMintAllError(null);
    try {
      const hash = await mint(selectedPair.erc20Address, selectedPair.erc20Decimals);
      setMintResults([{ symbol: selectedPair.erc20Symbol, hash }]);
      refetchBalance();
    } catch {
      // error surfaced via useFaucet().error
    }
  };

  const handleMintAll = async () => {
    if (mockPairs.length === 0) return;
    setMintAllError(null);
    setMintResults([]);
    const results: { symbol: string; hash: `0x${string}` }[] = [];

    for (let i = 0; i < mockPairs.length; i++) {
      const pair = mockPairs[i]!;
      // Track the token currently minting so the progress message updates each step.
      setMintAllProgress({ current: i + 1, total: mockPairs.length, symbol: pair.erc20Symbol });
      try {
        const hash = await mint(pair.erc20Address, pair.erc20Decimals);
        results.push({ symbol: pair.erc20Symbol, hash });
        setMintResults([...results]); // surface each tx + Etherscan link as it lands
      } catch (e) {
        setMintAllError(formatWalletError(e, chainId));
        setMintAllProgress(null);
        return;
      }
    }

    setMintAllProgress(null);
    refetchBalance();
  };

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
          <div id="faucet-token-list" className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-6 min-h-[100px]">
            {isLoadingPairs ? (
              <div className="col-span-full flex flex-col items-center justify-center py-8">
                <div className="w-8 h-8 border-[3px] border-[#16171C]/10 border-t-[#16171C] rounded-full animate-spin mb-3" />
                <span className="text-sm text-gray-500 font-medium animate-pulse">Loading faucets...</span>
              </div>
            ) : mockPairs.length > 0 ? (
              mockPairs.map((pair) => (
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
              ))
            ) : (
              <div className="col-span-full flex justify-center py-8">
                <span className="text-sm text-gray-400 font-medium">No faucets available</span>
              </div>
            )}
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

          {mintResults.length > 0 && (
            <div className="mb-5">
              <AlertMessage
                type="success"
                title={mintResults.length === 1 ? "Mint successful" : `Minted ${mintResults.length} tokens`}
                message={
                  <ul className="space-y-1.5">
                    {mintResults.map((r) => (
                      <li key={r.hash} className="flex items-center justify-between gap-3">
                        <span>
                          {FAUCET_MINT_CAP.toString()} {r.symbol}
                        </span>
                        <TxLink hash={r.hash} chainId={chainId} />
                      </li>
                    ))}
                  </ul>
                }
              />
            </div>
          )}

          {error && (
            <div className="mb-5">
              <AlertMessage type="error" title="Minting Failed" message={error} />
            </div>
          )}

          {mintAllProgress && (
            <div className="mb-4">
              <AlertMessage
                type="loading"
                title="Minting all mocks"
                message={`Minting ${mintAllProgress.symbol} — ${mintAllProgress.current} of ${mintAllProgress.total}...`}
              />
            </div>
          )}

          {mintAllError && (
            <div className="mb-4">
              <AlertMessage type="error" title="Mint All Failed" message={mintAllError} />
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={handleMintAll}
              disabled={mockPairs.length === 0 || isPending || !!mintAllProgress}
              className="flex-1 border border-[#16171C] text-[#16171C] hover:bg-[#16171C] hover:text-white font-semibold py-3.5 rounded-xl transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Mint All ({mockPairs.length})
            </button>
            <button
              id="faucet-mint-btn"
              onClick={handleMint}
              disabled={!selectedPair || isPending || !!mintAllProgress}
              className="flex-[2] bg-[#16171C] hover:bg-black text-white font-semibold py-3.5 rounded-xl transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-lg"
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
          </div>

          <p className="text-[11px] text-gray-400 mt-3 text-center">
            Only mock tokens have a public faucet. Official tokens like ctGBP have restricted minting.
          </p>
        </div>
      </div>
    </div>
  );
}
