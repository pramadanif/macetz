"use client";

import React, { useState, useCallback } from "react";
import { useAccount } from "wagmi";
import { isAddress, formatUnits } from "viem";
import {
  useConfidentialBalance,
  useIsConfidential,
  useMetadata,
} from "@zama-fhe/react-sdk";
import { useRegistryPairs } from "@/hooks/useRegistryPairs";

type DecryptMode = "registry" | "custom";

function DecryptResult({ tokenAddress }: { tokenAddress: `0x${string}` }) {
  const { address } = useAccount();
  const { data: meta, isLoading: metaLoading } = useMetadata(tokenAddress);
  const {
    data: balance,
    isLoading: balanceLoading,
    error,
  } = useConfidentialBalance({
    address: tokenAddress,
    account: address,
  });

  if (balanceLoading || metaLoading) {
    return (
      <div className="p-5 rounded-xl bg-amber-50/80 text-amber-700 border border-amber-200/60 backdrop-blur-sm flex items-center gap-3">
        <div className="w-5 h-5 border-2 border-amber-400 border-t-transparent rounded-full animate-spin shrink-0" />
        <div>
          <p className="font-medium text-sm">Decrypting your confidential balance...</p>
          <p className="text-xs opacity-75 mt-0.5">This requires an EIP-712 signature on first use.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 rounded-xl text-sm bg-red-50/80 text-red-700 border border-red-200/60 backdrop-blur-sm">
        {error.message}
      </div>
    );
  }

  const decimals = meta?.decimals ?? 6;
  const symbol = meta?.symbol ?? "???";

  return (
    <div className="p-6 rounded-xl bg-gradient-to-br from-green-50/80 to-emerald-50/80 border border-green-200/60 backdrop-blur-sm">
      <p className="text-sm text-green-600 mb-2 font-medium">Decrypted Balance</p>
      <p className="text-3xl font-mono font-semibold text-green-800 tracking-tight">
        {balance !== undefined ? formatUnits(balance, decimals) : "0"}
      </p>
      <p className="text-sm text-green-600 mt-1">{symbol}</p>
    </div>
  );
}

function CustomAddressValidator({
  customAddress,
  onValid,
}: {
  customAddress: string;
  onValid: (valid: boolean) => void;
}) {
  const validAddr = isAddress(customAddress)
    ? (customAddress as `0x${string}`)
    : ("0x0000000000000000000000000000000000000000" as `0x${string}`);
  const { data: isConf, isLoading } = useIsConfidential(validAddr, {
    enabled: isAddress(customAddress),
  });

  React.useEffect(() => {
    if (!isLoading && isConf !== undefined) {
      onValid(!!isConf);
    }
  }, [isConf, isLoading, onValid]);

  if (!isAddress(customAddress)) return null;

  if (isLoading) {
    return (
      <div className="p-3 rounded-xl text-xs bg-gray-50/80 text-gray-500 border border-gray-200/60 flex items-center gap-2">
        <div className="w-3.5 h-3.5 border-2 border-gray-300 border-t-transparent rounded-full animate-spin" />
        Checking ERC-7984 support...
      </div>
    );
  }

  if (!isConf) {
    return (
      <div className="p-3 rounded-xl text-xs bg-red-50/80 text-red-600 border border-red-200/60">
        This address does not implement ERC-7984. Only confidential tokens can be decrypted.
      </div>
    );
  }

  return (
    <div className="p-3 rounded-xl text-xs bg-green-50/80 text-green-600 border border-green-200/60">
      Valid ERC-7984 confidential token detected.
    </div>
  );
}

export function DecryptPanel() {
  const { data: pairs } = useRegistryPairs();

  const [mode, setMode] = useState<DecryptMode>("registry");
  const [selectedToken, setSelectedToken] = useState("");
  const [customAddress, setCustomAddress] = useState("");
  const [customValid, setCustomValid] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const handleValidChange = useCallback((valid: boolean) => {
    setCustomValid(valid);
  }, []);

  const targetAddress = mode === "registry" ? selectedToken : customAddress;
  const canDecrypt = isAddress(targetAddress) && (mode === "registry" || customValid);

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Decrypt Balance</h2>
        <p className="text-sm text-gray-500 mt-1">
          Decrypt the confidential balance of any ERC-7984 token in your wallet via the EIP-712 signature flow.
        </p>
      </div>

      <div className="emboss-card rounded-3xl p-8">
        <div className="relative z-10">
          {/* Mode toggle */}
          <div className="flex gap-1.5 mb-8 p-1 bg-gray-100/80 rounded-full">
            <button
              onClick={() => { setMode("registry"); setShowResult(false); }}
              className={`flex-1 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                mode === "registry"
                  ? "bg-white shadow-md text-[#16171C]"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Registry Tokens
            </button>
            <button
              onClick={() => { setMode("custom"); setShowResult(false); }}
              className={`flex-1 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                mode === "custom"
                  ? "bg-white shadow-md text-[#16171C]"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Any ERC-7984
            </button>
          </div>

          {mode === "registry" ? (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Confidential Token
              </label>
              <select
                value={selectedToken}
                onChange={(e) => { setSelectedToken(e.target.value); setShowResult(false); }}
                className="w-full liquid-glass-field rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#F5C518]/50 focus:border-[#F5C518]"
              >
                <option value="">Choose a confidential token...</option>
                {pairs?.map((pair) => (
                  <option key={pair.erc7984Address} value={pair.erc7984Address}>
                    {pair.erc7984Symbol} — {pair.erc7984Name}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className="mb-6 space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                ERC-7984 Token Address
              </label>
              <input
                type="text"
                value={customAddress}
                onChange={(e) => { setCustomAddress(e.target.value); setShowResult(false); setCustomValid(false); }}
                placeholder="0x..."
                className="w-full liquid-glass-field rounded-xl px-4 py-3.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#F5C518]/50 focus:border-[#F5C518]"
              />
              <CustomAddressValidator customAddress={customAddress} onValid={handleValidChange} />
            </div>
          )}

          {/* Decrypt result */}
          {showResult && canDecrypt && (
            <div className="mb-6">
              <DecryptResult tokenAddress={targetAddress as `0x${string}`} />
            </div>
          )}

          <button
            onClick={() => setShowResult(true)}
            disabled={!canDecrypt}
            className="w-full bg-[#16171C] hover:bg-black text-white font-semibold py-4 rounded-xl transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-[0_8px_24px_rgba(0,0,0,0.2)] hover:-translate-y-0.5"
          >
            Decrypt Balance
          </button>
        </div>
      </div>
    </div>
  );
}
