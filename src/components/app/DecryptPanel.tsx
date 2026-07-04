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
import { TokenIcon } from "@/components/app/TokenIcon";
import { TokenSelect } from "@/components/app/TokenSelect";
import { AlertMessage } from "@/components/app/AlertMessage";
import { formatWalletError } from "@/lib/errors";

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
      <AlertMessage
        type="loading"
        title="Decrypting Balance"
        message={
          <>
            Decrypting your confidential balance...
            <span className="block text-[11px] opacity-75 mt-0.5">This requires an EIP-712 signature on first use.</span>
          </>
        }
      />
    );
  }

  if (error) {
    return (
      <AlertMessage
        type="error"
        title="Decryption Failed"
        message={formatWalletError(error)}
      />
    );
  }

  const decimals = meta?.decimals ?? 6;
  const symbol = meta?.symbol ?? "???";

  return (
    <div className="emboss-card p-5">
      <div className="relative z-10">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Decrypted Balance</p>
        <p className="text-3xl font-mono font-semibold text-[#16171C] tracking-tight">
          {balance !== undefined ? formatUnits(balance, decimals) : "0"}
        </p>
        <div className="flex items-center gap-2 mt-1">
          <TokenIcon symbol={symbol} size={20} />
          <span className="text-sm text-gray-500">{symbol}</span>
        </div>
      </div>
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
      <div className="p-2.5 rounded-lg text-[11px] bg-gray-50/80 text-gray-500 border border-gray-200/60 flex items-center gap-2">
        <div className="w-3 h-3 border-2 border-gray-300 border-t-transparent rounded-full animate-spin" />
        Checking ERC-7984 support...
      </div>
    );
  }

  if (!isConf) {
    return (
      <div className="p-2.5 rounded-lg text-[11px] bg-red-50/80 text-red-600 border border-red-200/60">
        This address does not implement ERC-7984.
      </div>
    );
  }

  return (
    <div className="p-2.5 rounded-lg text-[11px] bg-green-50/80 text-green-600 border border-green-200/60">
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
    <div className="max-w-lg mx-auto">
      <div className="emboss-card p-6 sm:p-8 space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">Decrypt Balance</h2>
          <p className="text-[15px] text-gray-500 mt-2 leading-relaxed">
            Reveal your encrypted confidential balance with an EIP-712 signature.
          </p>
        </div>

      <div className="emboss-card p-5">
        <div className="relative z-10">
          <div className="flex gap-1 mb-6 p-1 bg-gray-100/80 rounded-full">
            <button
              onClick={() => { setMode("registry"); setShowResult(false); }}
              className={`flex-1 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                mode === "registry"
                  ? "bg-white shadow-sm text-[#16171C]"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Registry Tokens
            </button>
            <button
              onClick={() => { setMode("custom"); setShowResult(false); }}
              className={`flex-1 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                mode === "custom"
                  ? "bg-white shadow-sm text-[#16171C]"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Any ERC-7984
            </button>
          </div>

          {mode === "registry" ? (
            <div className="mb-5">
              <TokenSelect
                options={(pairs ?? []).map((pair) => ({
                  value: pair.erc7984Address,
                  label: pair.erc7984Symbol,
                  sublabel: pair.erc7984Name,
                  symbol: pair.erc7984Symbol,
                }))}
                value={selectedToken}
                onChange={(val) => { setSelectedToken(val); setShowResult(false); }}
                placeholder="Choose a confidential token..."
              />
            </div>
          ) : (
            <div className="mb-5 space-y-2.5">
              <input
                type="text"
                value={customAddress}
                onChange={(e) => { setCustomAddress(e.target.value); setShowResult(false); setCustomValid(false); }}
                placeholder="0x..."
                className="w-full liquid-glass-field rounded-xl px-4 py-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#F5C518]/40"
              />
              <CustomAddressValidator customAddress={customAddress} onValid={handleValidChange} />
            </div>
          )}

          {showResult && canDecrypt && (
            <div className="mb-5">
              <DecryptResult tokenAddress={targetAddress as `0x${string}`} />
            </div>
          )}

          <button
            onClick={() => setShowResult(true)}
            disabled={!canDecrypt}
            className="w-full bg-[#16171C] hover:bg-black text-white font-semibold py-3.5 rounded-xl transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-lg"
          >
            Decrypt Balance
          </button>
        </div>
      </div>
      </div>
    </div>
  );
}
