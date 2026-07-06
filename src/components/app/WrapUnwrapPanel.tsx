"use client";

import React, { useState } from "react";
import { useAccount, usePublicClient, useChainId } from "wagmi";
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
import { isMainnet } from "@/lib/config";
import { TokenIcon } from "@/components/app/TokenIcon";
import { TokenSelect } from "@/components/app/TokenSelect";
import { AlertMessage } from "@/components/app/AlertMessage";
import type { TokenPair } from "@/lib/types";
import { isOperationalPair } from "@/lib/pair-utils";

type Mode = "wrap" | "unwrap";

export function WrapUnwrapPanel() {
  const { address, isConnected } = useAccount();
  const publicClient = usePublicClient();
  const chainId = useChainId();
  const { data: pairs, isLoading: pairsLoading } = useRegistryPairs();
  const operationalPairs = (pairs ?? []).filter(isOperationalPair);

  const [mode, setMode] = useState<Mode>("wrap");
  const [selectedPair, setSelectedPair] = useState<TokenPair | null>(null);
  const [amount, setAmount] = useState("");
  const [success, setSuccess] = useState<string | null>(null);
  /** Mainnet real-funds confirmation state */
  const [mainnetConfirmPending, setMainnetConfirmPending] = useState<"wrap" | "unwrap" | null>(null);

  const wrapperAddress = selectedPair?.erc7984Address ?? ("0x0000000000000000000000000000000000000000" as `0x${string}`);

  const shield = useShield({ address: wrapperAddress });
  const unshield = useUnshield(wrapperAddress);

  const { data: confidentialBalance, isLoading: confidentialBalanceLoading, error: confidentialBalanceError } = useConfidentialBalance(
    { address: wrapperAddress, account: address },
    { enabled: !!selectedPair && !!address && mode === "unwrap" }
  );

  const { data: erc20Balance, isLoading: erc20BalanceLoading } = useQuery({
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
    // Gate on mainnet confirmation
    if (isMainnet(chainId)) {
      setMainnetConfirmPending("wrap");
      return;
    }
    await executeWrap();
  };

  const handleUnwrap = async () => {
    if (!selectedPair || !amount) return;
    // Gate on mainnet confirmation
    if (isMainnet(chainId)) {
      setMainnetConfirmPending("unwrap");
      return;
    }
    await executeUnwrap();
  };

  const executeWrap = async () => {
    if (!selectedPair || !amount) return;
    if (!isConnected || !address) return;
    setMainnetConfirmPending(null);
    setSuccess(null);
    const parsedAmount = parseUnits(amount, selectedPair.erc20Decimals);
    await shield.mutateAsync({ amount: parsedAmount });
    setSuccess("Tokens shielded successfully! Your confidential balance has been updated.");
    setAmount("");
  };

  const executeUnwrap = async () => {
    if (!selectedPair || !amount) return;
    if (!isConnected || !address) return;
    setMainnetConfirmPending(null);
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
      <div className="max-w-lg mx-auto">
        <div className="emboss-card rounded-3xl p-8 animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6" />
          <div className="h-12 bg-gray-200 rounded mb-4" />
          <div className="h-12 bg-gray-200 rounded mb-4" />
          <div className="h-14 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  const inputSymbol = mode === "wrap" ? selectedPair?.erc20Symbol : selectedPair?.erc7984Symbol;
  const outputSymbol = mode === "wrap" ? selectedPair?.erc7984Symbol : selectedPair?.erc20Symbol;
  const inputDecimals = mode === "wrap" ? selectedPair?.erc20Decimals : selectedPair?.erc7984Decimals;
  const outputDecimals = mode === "wrap" ? selectedPair?.erc7984Decimals : selectedPair?.erc20Decimals;
  const inputBalance = mode === "wrap" ? erc20Balance : confidentialBalance;

  const balanceLabel = (() => {
    if (!selectedPair) return "";
    if (!address) return "Connect your wallet to see your balance";
    if (mode === "wrap") {
      if (erc20BalanceLoading || erc20Balance === undefined) return "Loading balance...";
      return `Balance: ${formatUnits(erc20Balance, selectedPair.erc20Decimals)}`;
    }
    if (confidentialBalanceLoading) return "Decrypting confidential balance...";
    if (confidentialBalanceError) return "Could not decrypt balance";
    if (confidentialBalance !== undefined) {
      return `Balance: ${formatUnits(confidentialBalance, selectedPair.erc7984Decimals)}`;
    }
    return "Loading balance...";
  })();
  const outputBalance = mode === "wrap" ? confidentialBalance : erc20Balance;

  return (
    <div className="max-w-lg mx-auto">
      <div className="emboss-card p-6 sm:p-8 space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">
            {mode === "wrap" ? "Shield Tokens" : "Unshield Tokens"}
          </h2>
          <p className="text-[15px] text-gray-500 mt-2 leading-relaxed">
            {mode === "wrap"
              ? "Convert ERC-20 tokens into their confidential counterpart."
              : "Decrypt your tokens back into standard ERC-20."}
          </p>
        </div>

      {/* Mode toggle */}
      <div className="flex gap-1 p-1 bg-gray-100/80 rounded-full">
        <button
          onClick={() => { setMode("wrap"); setSuccess(null); shield.reset(); unshield.reset(); }}
          className={`flex-1 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
            mode === "wrap"
              ? "bg-white shadow-sm text-[#16171C]"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Shield
        </button>
        <button
          onClick={() => { setMode("unwrap"); setSuccess(null); shield.reset(); unshield.reset(); }}
          className={`flex-1 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
            mode === "unwrap"
              ? "bg-white shadow-sm text-[#16171C]"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Unshield
        </button>
      </div>

      {/* Connected two-card swap flow */}
      <div className="relative mt-2">
        {/* Input card — "You shield" / "You unshield" */}
        <div className="emboss-card p-5">
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                {mode === "wrap" ? "You shield" : "You unshield"}
              </span>
              <div id="wrap-token-select" className="w-[140px]">
                <TokenSelect
                  options={operationalPairs.map((pair) => ({
                    value: pair.erc7984Address,
                    label: mode === "wrap" ? pair.erc20Symbol : pair.erc7984Symbol,
                    sublabel: undefined,
                    symbol: mode === "wrap" ? pair.erc20Symbol : pair.erc7984Symbol,
                  }))}
                  value={selectedPair?.erc7984Address ?? ""}
                  onChange={(val) => {
                    const pair = pairs?.find((p) => p.erc7984Address === val);
                    setSelectedPair(pair ?? null);
                    setAmount("");
                    setSuccess(null);
                    shield.reset();
                    unshield.reset();
                  }}
                  placeholder="Select..."
                  variant="pill"
                />
              </div>
            </div>
            <input
              type="text"
              inputMode="decimal"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full bg-transparent text-2xl font-mono font-semibold text-[#16171C] placeholder:text-gray-300 focus:outline-none"
              disabled={!selectedPair}
            />
            <div className="flex items-center justify-between mt-2">
              <span className="text-[11px] text-gray-400">
                {balanceLabel}
              </span>
              {selectedPair && inputBalance !== undefined && inputDecimals !== undefined && inputBalance > 0n && (
                <button
                  onClick={() => setAmount(formatUnits(inputBalance, inputDecimals))}
                  className="text-[11px] font-semibold text-[#d4a600] hover:text-[#b38f00] transition-colors"
                >
                  MAX
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Arrow connector */}
        <div className="flex justify-center -my-3 relative z-10">
          <div className="w-8 h-8 rounded-full bg-[#F5F4F0] border-2 border-white shadow-sm flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
              <path d="M12 5v14M19 12l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* Output card — "You receive" */}
        <div className="emboss-card p-5">
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                You receive
              </span>
              {selectedPair && outputSymbol && (
                <div className="w-[140px]">
                  <div className="w-full flex items-center px-2.5 py-1.5 rounded-full text-sm font-medium bg-gray-50 border border-black/5 text-[#16171C]">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <TokenIcon symbol={outputSymbol} size={18} />
                      <span className="font-semibold truncate">{outputSymbol}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <p className="text-2xl font-mono font-semibold text-gray-300">
              {amount && selectedPair ? amount : "0.00"}
            </p>
            <div className="mt-2">
              <span className="text-[11px] text-gray-400">
                {selectedPair && outputBalance !== undefined && outputDecimals !== undefined
                  ? `Balance: ${formatUnits(outputBalance, outputDecimals)}`
                  : selectedPair
                    ? "Connect your wallet to see your balance"
                    : ""}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Status messages */}
      {success && (
        <AlertMessage type="success" title="Success" message={success} />
      )}

      {error && (
        <AlertMessage type="error" title="Transaction Failed" message={formatWalletError(error)} />
      )}

      {isPending && (
        <AlertMessage 
          type="loading" 
          title="Processing Transaction" 
          message={
            shield.isPending 
              ? "Shielding — approving ERC-20 spend and wrapping..."
              : (
                <>
                  Unshielding — two-step process in progress.
                  <span className="block text-[11px] opacity-75 mt-0.5">
                    Step 1: Unwrap request → Step 2: Relayer decrypt → Finalized
                  </span>
                </>
              )
          } 
        />
      )}

      {/* Mainnet real-funds confirmation modal */}
      {mainnetConfirmPending && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl p-7 max-w-sm w-full">
            <div className="flex items-start gap-4 mb-5">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center shrink-0">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-600">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-[17px] text-gray-900 leading-tight mb-1">
                  Real assets — Ethereum Mainnet
                </h3>
                <p className="text-[13px] text-gray-500 leading-relaxed">
                  You are about to{" "}
                  <strong>{mainnetConfirmPending === "wrap" ? "shield" : "unshield"}</strong>{" "}
                  <strong>{amount} {mainnetConfirmPending === "wrap" ? selectedPair?.erc20Symbol : selectedPair?.erc7984Symbol}</strong>{" "}
                  on <strong>Ethereum mainnet</strong>. This uses real funds and cannot be undone.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setMainnetConfirmPending(null)}
                className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                id="mainnet-confirm-btn"
                onClick={mainnetConfirmPending === "wrap" ? executeWrap : executeUnwrap}
                className="flex-1 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold transition-colors"
              >
                I understand, proceed
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Submit */}
      <button
        id="wrap-submit-btn"
        onClick={mode === "wrap" ? handleWrap : handleUnwrap}
        disabled={!selectedPair || !amount || isPending || !isConnected || !address}
        className="w-full bg-[#16171C] hover:bg-black text-white font-semibold py-3.5 rounded-xl transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-lg"
      >
        {isPending
          ? "Processing..."
          : mode === "wrap"
            ? `Shield ${selectedPair ? selectedPair.erc20Symbol : "Tokens"}`
            : `Unshield ${selectedPair ? selectedPair.erc7984Symbol : "Tokens"}`}
      </button>

      {isMainnet(chainId) && !isPending && selectedPair && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-50 border border-amber-200/60">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500 shrink-0">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          <p className="text-[11px] text-amber-700 leading-relaxed">
            <strong>Mainnet:</strong> A confirmation step will appear before any transaction.
          </p>
        </div>
      )}

      {mode === "unwrap" && !isPending && !isMainnet(chainId) && (
        <p className="text-[11px] text-gray-400 text-center leading-relaxed">
          Unwrap is a two-step async process. The SDK handles both steps
          automatically: unwrap request → relayer decryption → finalize.
        </p>
      )}
      </div>
    </div>
  );
}
