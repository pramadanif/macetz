"use client";

import React, { useState } from "react";
import { useAccount, usePublicClient } from "wagmi";
import { parseUnits, formatUnits } from "viem";
import {
  useShield,
  useUnshield,
  useConfidentialBalance,
} from "@zama-fhe/react-sdk";
import { useQuery } from "@tanstack/react-query";
import { useRegistryPairs } from "@/hooks/useRegistryPairs";
import { ERC20_ABI } from "@/lib/abis";
import { formatWalletError } from "@/lib/errors";
import type { TokenPair } from "@/lib/types";

type Mode = "wrap" | "unwrap";

export function WrapUnwrapPanel() {
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const { data: pairs, isLoading: pairsLoading } = useRegistryPairs();

  const [mode, setMode] = useState<Mode>("wrap");
  const [selectedPair, setSelectedPair] = useState<TokenPair | null>(null);
  const [amount, setAmount] = useState("");
  const [success, setSuccess] = useState<string | null>(null);

  const wrapperAddress = selectedPair?.erc7984Address ?? ("0x0000000000000000000000000000000000000000" as `0x${string}`);

  const shield = useShield({ address: wrapperAddress });
  const unshield = useUnshield(wrapperAddress);

  const { data: confidentialBalance } = useConfidentialBalance(
    { address: wrapperAddress, account: address },
    { enabled: !!selectedPair && !!address }
  );

  const { data: erc20Balance } = useQuery({
    queryKey: ["erc20-balance", selectedPair?.erc20Address, address],
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

  const handleWrap = async () => {
    if (!selectedPair || !amount) return;
    setSuccess(null);
    const parsedAmount = parseUnits(amount, selectedPair.erc20Decimals);
    await shield.mutateAsync({ amount: parsedAmount });
    setSuccess("Tokens shielded successfully! Your confidential balance has been updated.");
    setAmount("");
  };

  const handleUnwrap = async () => {
    if (!selectedPair || !amount) return;
    setSuccess(null);
    const parsedAmount = parseUnits(amount, selectedPair.erc7984Decimals);
    await unshield.mutateAsync({ amount: parsedAmount });
    setSuccess("Tokens unshielded successfully! The underlying ERC-20 has been returned to your wallet.");
    setAmount("");
  };

  const isPending = shield.isPending || unshield.isPending;
  const error = shield.error || unshield.error;

  if (pairsLoading) {
    return (
      <div className="max-w-xl mx-auto">
        <div className="glass-panel rounded-3xl p-8 animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6" />
          <div className="h-12 bg-gray-200 rounded mb-4" />
          <div className="h-12 bg-gray-200 rounded mb-4" />
          <div className="h-14 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">
          {mode === "wrap" ? "Shield Tokens" : "Unshield Tokens"}
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          {mode === "wrap"
            ? "Convert public ERC-20 tokens into their confidential ERC-7984 equivalent."
            : "Convert confidential tokens back to their public ERC-20 form."}
        </p>
      </div>

      <div className="emboss-card rounded-3xl p-8">
        <div className="relative z-10">
          {/* Mode toggle */}
          <div className="flex gap-1.5 mb-8 p-1 bg-gray-100/80 rounded-full">
            <button
              onClick={() => { setMode("wrap"); setSuccess(null); shield.reset(); unshield.reset(); }}
              className={`flex-1 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                mode === "wrap"
                  ? "bg-white shadow-md text-[#16171C]"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Wrap (Shield)
            </button>
            <button
              onClick={() => { setMode("unwrap"); setSuccess(null); shield.reset(); unshield.reset(); }}
              className={`flex-1 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                mode === "unwrap"
                  ? "bg-white shadow-md text-[#16171C]"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Unwrap (Unshield)
            </button>
          </div>

          {/* Token selector */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Token Pair
            </label>
            <select
              value={selectedPair?.erc7984Address ?? ""}
              onChange={(e) => {
                const pair = pairs?.find((p) => p.erc7984Address === e.target.value);
                setSelectedPair(pair ?? null);
                setAmount("");
                setSuccess(null);
                shield.reset();
                unshield.reset();
              }}
              className="w-full liquid-glass-field rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#F5C518]/50 focus:border-[#F5C518]"
            >
              <option value="">Choose a token pair...</option>
              {pairs?.map((pair) => (
                <option key={pair.erc7984Address} value={pair.erc7984Address}>
                  {pair.erc7984Symbol} ← {pair.erc20Symbol}
                  {pair.source === "local-dev" ? " [Dev]" : ""}
                </option>
              ))}
            </select>
          </div>

          {/* Balance + Amount */}
          {selectedPair && (
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-gray-700">
                  Amount ({mode === "wrap" ? selectedPair.erc20Symbol : selectedPair.erc7984Symbol})
                </label>
                <div className="text-xs space-x-3">
                  {mode === "wrap" && erc20Balance !== undefined && (
                    <button
                      onClick={() => setAmount(formatUnits(erc20Balance, selectedPair.erc20Decimals))}
                      className="text-[#d4a600] hover:text-[#b38f00] font-medium transition-colors"
                    >
                      Max: {formatUnits(erc20Balance, selectedPair.erc20Decimals)}
                    </button>
                  )}
                  {mode === "unwrap" && confidentialBalance !== undefined && (
                    <button
                      onClick={() => setAmount(formatUnits(confidentialBalance, selectedPair.erc7984Decimals))}
                      className="text-[#d4a600] hover:text-[#b38f00] font-medium transition-colors"
                    >
                      Max: {formatUnits(confidentialBalance, selectedPair.erc7984Decimals)}
                    </button>
                  )}
                </div>
              </div>
              <input
                type="text"
                inputMode="decimal"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full liquid-glass-field rounded-xl px-4 py-3.5 text-lg font-mono focus:outline-none focus:ring-2 focus:ring-[#F5C518]/50 focus:border-[#F5C518]"
              />
            </div>
          )}

          {/* Status messages */}
          {success && (
            <div className="mb-6 p-4 rounded-xl text-sm bg-green-50/80 text-green-700 border border-green-200/60 backdrop-blur-sm">
              {success}
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 rounded-xl text-sm bg-red-50/80 text-red-700 border border-red-200/60 backdrop-blur-sm">
              {formatWalletError(error)}
            </div>
          )}

          {isPending && (
            <div className="mb-6 p-4 rounded-xl text-sm bg-amber-50/80 text-amber-700 border border-amber-200/60 backdrop-blur-sm flex items-center gap-3">
              <div className="w-5 h-5 border-2 border-amber-400 border-t-transparent rounded-full animate-spin shrink-0" />
              <div>
                {shield.isPending && "Shielding tokens — approving ERC-20 spend and wrapping..."}
                {unshield.isPending && (
                  <>
                    Unshielding tokens — this is a two-step process.
                    <br />
                    <span className="text-xs opacity-75">Step 1: Submitting unwrap request → Step 2: Relayer decrypts amount → Finalized</span>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Submit */}
          <button
            onClick={mode === "wrap" ? handleWrap : handleUnwrap}
            disabled={!selectedPair || !amount || isPending}
            className="w-full bg-[#16171C] hover:bg-black text-white font-semibold py-4 rounded-xl transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-[0_8px_24px_rgba(0,0,0,0.2)] hover:-translate-y-0.5"
          >
            {isPending
              ? "Processing..."
              : mode === "wrap"
                ? `Shield ${selectedPair ? selectedPair.erc20Symbol : "Tokens"}`
                : `Unshield ${selectedPair ? selectedPair.erc7984Symbol : "Tokens"}`}
          </button>

          {mode === "unwrap" && !isPending && (
            <p className="text-[11px] text-gray-400 mt-3 text-center leading-relaxed">
              Unwrap is a two-step async process. The SDK handles both steps automatically:
              unwrap request → relayer decryption → finalize.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
