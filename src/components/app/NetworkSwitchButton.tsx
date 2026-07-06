"use client";

import React, { useState, useEffect } from "react";
import { useChainId, useSwitchChain, useAccount } from "wagmi";
import { SEPOLIA_CHAIN_ID, MAINNET_CHAIN_ID, isMainnet } from "@/lib/config";

export function NetworkSwitchButton() {
  const chainId = useChainId();
  const { isConnected } = useAccount();
  const { switchChain, isPending } = useSwitchChain();
  const [declinedMsg, setDeclinedMsg] = useState<string | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Clear declined message after 3s
  useEffect(() => {
    if (!declinedMsg) return;
    const t = setTimeout(() => setDeclinedMsg(null), 3000);
    return () => clearTimeout(t);
  }, [declinedMsg]);

  if (!isConnected) return null;

  const onMainnet = isMainnet(chainId);
  const targetChainId = onMainnet ? SEPOLIA_CHAIN_ID : MAINNET_CHAIN_ID;
  const currentLabel = onMainnet ? "Ethereum" : "Sepolia";
  const targetLabel = onMainnet ? "Sepolia" : "Mainnet";
  const currentSub = onMainnet ? "Mainnet" : "Testnet";

  const handleSwitch = async () => {
    setDeclinedMsg(null);
    try {
      await switchChain({ chainId: targetChainId });
    } catch {
      setDeclinedMsg(`Declined — still on ${currentLabel}`);
    }
  };

  return (
    <div className="px-1 space-y-1">
      {/* Network indicator card */}
      <button
        id="network-switch-btn"
        onClick={handleSwitch}
        disabled={isPending}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        aria-label={`Currently on ${currentLabel}. Click to switch to ${targetLabel}`}
        className="w-full group relative flex items-center gap-3 px-3 py-2.5 rounded-2xl border transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-60
          border-gray-200/70 bg-white/60 hover:bg-white/90 hover:border-gray-300/80 hover:shadow-sm"
        style={{ backdropFilter: "blur(8px)" }}
      >
        {/* Live network indicator dot */}
        <span className="relative flex items-center justify-center w-5 h-5 shrink-0">
          {/* Outer ping ring */}
          <span
            className={`absolute inline-flex h-full w-full rounded-full opacity-40 ${
              isPending
                ? "bg-[#D4A600] animate-ping"
                : onMainnet
                ? "bg-[#62805A] animate-ping"
                : "bg-[#5C728A] animate-ping"
            }`}
          />
          {/* Inner solid dot */}
          <span
            className={`relative inline-flex rounded-full h-2.5 w-2.5 shadow-sm ${
              isPending
                ? "bg-[#D4A600]"
                : onMainnet
                ? "bg-[#62805A]"
                : "bg-[#5C728A]"
            }`}
          />
        </span>

        {/* Network label */}
        <div className="flex-1 text-left min-w-0">
          {isPending ? (
            <span className="flex items-center gap-1.5 text-[12px] font-semibold text-[#D4A600]">
              <span className="w-3 h-3 border-2 border-[#D4A600] border-t-transparent rounded-full animate-spin shrink-0" />
              Check wallet...
            </span>
          ) : (
            <>
              <p className="text-[12px] font-bold text-[#16171C] leading-none">
                {currentLabel}
              </p>
              <p className="text-[10px] text-gray-400 leading-none mt-0.5">
                {currentSub}
              </p>
            </>
          )}
        </div>

        {/* Switch arrow — revealed on hover */}
        <div
          className={`shrink-0 flex items-center gap-1 text-[10px] font-semibold transition-all duration-200 ${
            isHovered && !isPending
              ? "opacity-100 translate-x-0 text-gray-600"
              : "opacity-0 -translate-x-1"
          }`}
        >
          <span>{targetLabel}</span>
          {/* Double arrow icon */}
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M1 3.5h9M7.5 1.5l2.5 2-2.5 2" />
            <path d="M11 8.5H2M4.5 6.5L2 8.5l2.5 2" />
          </svg>
        </div>
      </button>

      {/* Rejection message — non-alarming, auto-clears */}
      {declinedMsg && (
        <p
          className="text-[10px] text-gray-400 text-center px-2 leading-tight"
          style={{ animation: "fadeIn 0.15s ease-out" }}
        >
          {declinedMsg}
        </p>
      )}
    </div>
  );
}
